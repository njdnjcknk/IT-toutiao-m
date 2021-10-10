/**
 * 用户相关请求模块
 */

import request from '../utils/request'
//搜索联想接口
export const getSearchSuggestion = q => {
    return request({
        method: 'GET',
        url: '/v1_0/suggestion',
        params: {
            q
        }
    })
}

//搜索结果接口
export const getSearchResult = q => {
    return request({
        method: 'GET',
        url: '/v1_0/search',
        params: {
            q
        }
    })
}