let session = { sessionId: wx.getStorageSync('sessionId')};
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const request = (obj) => {
  if(obj.header){
    obj.header.sessionId = session.sessionId;
  }else{
    obj.header = { sessionId: session.sessionId};
  }
  wx.request(obj);
}
module.exports = {
  formatTime: formatTime,
  request : request,
  session: session,
}
