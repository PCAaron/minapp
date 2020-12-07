import request from '@/utils/request'
const baseURL = 'http://localhost:3000'

// 获取列表
export const fetchList = async (params) => {
    return await request({
        params,
        url: `${baseURL}/blog/list`,
        method: 'get'
    })
}

// 删除博客
export const del = async(params) => {
    return await request({
        data: {
            ...params
        },
        url: `${baseURL}/blog/del`,
        method: 'post'
    })
}