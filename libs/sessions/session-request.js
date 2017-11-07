const co = require('./co.js');
const promisify = require('./promisify.js');

const headers = {
    WX_CODE: 'X-WX-Code',
    WX_RAW_DATA: 'X-WX-RawData',
    WX_SIGNATURE: 'X-WX-Signature',
};

const errors = {
    ERR_SESSION_EXPIRED: 'ERR_SESSION_EXPIRED',
    ERR_SESSION_KEY_EXCHANGE_FAILED: 'ERR_SESSION_KEY_EXCHANGE_FAILED',
    ERR_UNTRUSTED_RAW_DATA: 'ERR_UNTRUSTED_RAW_DATA',
};

const SESSION_MAGIC_ID = 'F2C224D4-2BCE-4C64-AF9F-A6D872000D1A';
const MAX_RETRY_TIMES = 3;

const login = promisify(wx.login);
const getUserInfo = promisify(wx.getUserInfo);

// 用户当前的 code 凭据
let currentCode = null;

let pendingHeader = null;

/**
 * 生成 header 信息
 */
const buildHeader = co.wrap(function *() {
    if (currentCode) {
        return { [headers.WX_CODE]: currentCode };
    } else {
        return pendingHeader = pendingHeader || co(function *() {
            const { code } = yield login();
            const { rawData, signature } = yield getUserInfo();

            currentCode = code;
            pendingHeader = null;

            return {
                [headers.WX_CODE]: currentCode,
                [headers.WX_RAW_DATA]: encodeURIComponent(rawData),
                [headers.WX_SIGNATURE]: signature || '',
            };
        });
    }
});

/**
 * 带会话管理的网络请求，参数配置和 wx.request 一致
 */
function requestWithSession(options = {}) {
    let tryTimes = 0;

    const wrapRequest = co.wrap(function *() {
        const { success, fail, complete } = options;

        const callSuccess = (...params) => {
            success && success(...params);
            complete && complete(...params);
        };

        const callFail = error => {
            fail && fail(error);
            complete && complete(error);
            throw error;
        };

        if (tryTimes++ > MAX_RETRY_TIMES) {
            return callFail(new Error('请求失败次数过多'));
        }

        return wx.request(Object.assign({}, options, {
            header: Object.assign({}, options.headers, yield buildHeader()),

            success({ data }) {
                if (SESSION_MAGIC_ID in data) {
                    const error = data.error;

                    switch (data.reason) {
                    case errors.ERR_SESSION_EXPIRED:
                    case errors.ERR_SESSION_KEY_EXCHANGE_FAILED:
                        currentCode = null;
                        return wrapRequest();

                    case errors.ERR_UNTRUSTED_RAW_DATA:
                    default:
                        return callFail(error);
                    }
                }

                callSuccess(...arguments);
            },

            fail: callFail,

            complete: () => void(0),
        }));
    });

    return wrapRequest();
}

module.exports = requestWithSession;