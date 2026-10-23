// 轻量本地状态 & 工具函数
export const store = {
    isLoggedIn() {
        return !!uni.getStorageSync('userInfo')
    },
    getUserInfo() {
        return uni.getStorageSync('userInfo') || null
    },
    logout() {
        uni.removeStorageSync('userInfo')
        uni.removeStorageSync('openid')
        uni.showToast({ title: '已退出', icon: 'none' })
    }
}

// 时间格式化
export function fmtDate(ts) {
    if (!ts) return ''
    const d = new Date(ts)
    const pad = n => String(n).padStart(2, '0')
    return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`
}

export function fmtDateTime(ts) {
    if (!ts) return ''
    const d = new Date(ts)
    const pad = n => String(n).padStart(2, '0')
    return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// 生成邀请链接（实际小程序用 share 跳转）
export function buildInviteLink(token) {
    return `时光寄 · 您的专属邀请码：${token}`
}

export default store
