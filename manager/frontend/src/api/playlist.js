import request from '@/utils/request'
const baseURL = 'http://localhost:3000'

// 获取列表
export const fetchList = async (params) => {
    return await request({
        params,
        url: `${baseURL}/playlist/list`,
        method: 'get'
    })
}

// 查询详情
export const fetchById = async (params) => {
    return await request({
        params,
        url: `${baseURL}/playlist/getById`,
        method: 'get'
    })
}

// 更新详情
export const update = async (params) => {
    return await request({
        url: `${baseURL}/playlist/updatePlaylist`,
        data: {
            ...params
        },
        method: 'post'
    })
}

// 删除详情
export const del = async (params) => {
    return await request({
        url: `${baseURL}/playlist/del`,
        params,
        method: 'get'
    })
}
