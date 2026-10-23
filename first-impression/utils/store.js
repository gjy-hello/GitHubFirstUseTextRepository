// 本地状态管理（基于 uni.storage，简单轻量）
import request from './request.js'

const store = {
    // ===== 用户相关 =====
    getUserInfo() {
        return uni.getStorageSync('userInfo') || null
    },
    isLoggedIn() {
        return !!uni.getStorageSync('userInfo')
    },
    async login(payload) {
        const res = await request({ url: '/api/user/login', data: payload })
        if (res.code === 0 && res.data) {
            uni.setStorageSync('token', res.data.token)
            uni.setStorageSync('userInfo', res.data.userInfo)
            return res.data.userInfo
        }
        return null
    },
    logout() {
        uni.removeStorageSync('token')
        uni.removeStorageSync('userInfo')
    },

    // ===== 购物车 =====
    getCart() {
        return uni.getStorageSync('cartList') || []
    },
    addToCart(product, count = 1) {
        const cart = this.getCart()
        const exist = cart.find(item => item.id === product.id)
        if (exist) {
            exist.count += count
        } else {
            cart.push({ ...product, count })
        }
        uni.setStorageSync('cartList', cart)
        uni.showToast({ title: '已加入购物车', icon: 'success' })
    },
    updateCartItem(id, count) {
        const cart = this.getCart()
        const item = cart.find(i => i.id === id)
        if (item) {
            item.count = Math.max(1, count)
        }
        uni.setStorageSync('cartList', cart)
    },
    removeFromCart(id) {
        let cart = this.getCart().filter(i => i.id !== id)
        uni.setStorageSync('cartList', cart)
    },
    clearCart() {
        uni.setStorageSync('cartList', [])
    },
    getCartCount() {
        return this.getCart().reduce((sum, i) => sum + i.count, 0)
    },
    getCartTotal() {
        return this.getCart().reduce((sum, i) => sum + i.price * i.count, 0)
    }
}

export default store
