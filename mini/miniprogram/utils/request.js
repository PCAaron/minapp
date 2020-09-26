
const defaultHeader = {
    'content-type': 'application/json' // 默认值
}
export const request = ({url,method='GET',data={},header=defaultHeader}) => {
    return new Promise((resolve,reject) => {
        wx.request({
            url, 
            method: method, 
            data,
            header,
            success (res) {
              resolve(res)
            },
            fail(e) {
                reject(e)
            }
        })
    })
}