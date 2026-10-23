// 通用请求封装（mock 模式下直接返回 mock 数据）
import mock from './mock.js'

const USE_MOCK = true // 是否使用 mock 数据

const request = (options) => {
    return new Promise((resolve) => {
        // mock 模式：模拟网络延迟
        if (USE_MOCK) {
            setTimeout(() => {
                const handler = mock[options.url] || mock['*']
                if (handler) {
                    const result = handler(options.data)
                    resolve({ code: 0, msg: 'ok', data: result })
                } else {
                    resolve({ code: -1, msg: '接口不存在', data: null })
                }
            }, 300)
            return
        }

        // 真实请求模式（暂未启用）
        uni.request({
            url: options.url,
            method: options.method || 'GET',
            data: options.data,
            header: {
                'Content-Type': 'application/json',
                'Authorization': uni.getStorageSync('token') ? 'Bearer ' + uni.getStorageSync('token') : ''
            },
            success: (res) => {
                resolve(res.data)
            },
            fail: () => {
                uni.showToast({ title: '网络错误', icon: 'none' })
                resolve({ code: -1, msg: '网络错误', data: null })
            }
        })
    })
}

export default request
