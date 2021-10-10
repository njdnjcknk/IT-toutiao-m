//导入封装的的基地址
import request from '@/utils/request'
// 导入vuex
// import store from '@/store'
// 定义发送请求的方法
export const login = data => {
    return request({
        url: '/v1_0/authorizations',
        method: 'post',
        data
    })
}

//发送验证码
export const sendSms = mobile => {
    return request({
        url: `/v1_0/sms/codes/${mobile}`,
        method: 'get',
    })
}

//请求用户数据
export const getUserInfo = () => {
    return request({
        url: `/v1_0/user`,
        method: 'get',
    })
}

//获取用户频道
export const getUserChannels = () => {
    return request({
        url: '/v1_0/user/channels',
        method: 'get',
    })
}

/**
 * 添加关注
 */
export const addFollow = userId => {
    return request({
        method: 'POST',
        url: '/v1_0/user/followings',
        data: {
            target: userId
        }
    })
}

/**
 * 取消关注
 */
export const deleteFollow = userId => {
    return request({
        method: 'DELETE',
        url: `/v1_0/user/followings/${userId}`
    })
}

/**
 * 获取当前登录用户的个人资料
 */
export const getUserProfile = (target) => {
    return request({
        method: 'get',
        url: '/v1_0/user/profile'
    })
}

/**
 * 更新用户昵称
 */
export const updateUserProfile = data => {
    return request({
        method: 'PATCH',
        url: '/v1_0/user/profile',
        data
    })
}

/**
 * 更新用户照片资料
 */
export const updateUserPhoto = data => {
    return request({
        method: 'PATCH',
        url: '/v1_0/user/photo',
        data
    })
}