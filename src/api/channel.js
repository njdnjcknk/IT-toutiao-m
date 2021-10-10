//频道模块
import request from '@/utils/request.js'
//获取所有频道数据
export const getAllChannels = () => {
    return request({
        method: 'GET',
        url: '/v1_0/channels'
    })
}

//获取缓存频道数据
export const getAddChannels = (channel) => {
    return request({
        method: 'PATCH',
        url: '/v1_0/user/channels',
        data: {
            channels: [channel]
        }
    })
}

//获取删除频道方法
export const getDelChannels = (channelId) => {
    return request({
        method: 'DELETE',
        url: `/v1_0/user/channels/${channelId}`
    })
}