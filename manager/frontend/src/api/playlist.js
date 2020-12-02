import request from '@/utils/request'
const baseURL = 'http://localhost:3000'

export const fetchList = async (params) => {
    return await request({
        params,
        url: `${baseURL}/playlist/list`,
        method: 'get'
    })
}