<template>
    <view class="page">
        <!-- 购物车为空 -->
        <view v-if="cart.length === 0" class="empty-wrap">
            <text class="empty-icon">🛒</text>
            <text class="empty-text">购物车还是空的</text>
            <text class="empty-sub">去挑几件你喜欢的吧～</text>
            <view class="go-shop-btn" @click="goHome">去逛逛</view>
        </view>

        <!-- 购物车有商品 -->
        <view v-else>
            <view class="cart-list">
                <view class="cart-item card" v-for="item in cart" :key="item.id">
                    <view class="select-box" @click="toggleSelect(item)">
                        <view class="checkbox" :class="{ checked: selected.includes(item.id) }">
                            <text v-if="selected.includes(item.id)">✓</text>
                        </view>
                    </view>
                    <image class="c-img" :src="item.image" mode="aspectFill" @click="goProduct(item.id)" />
                    <view class="c-info">
                        <text class="c-name">{{ item.name }}</text>
                        <view class="c-bottom">
                            <view class="price">
                                <text class="price-symbol">¥</text>
                                <text class="price-integer">{{ item.price }}</text>
                            </view>
                            <view class="num-ctrl">
                                <view class="num-btn" @click="changeCount(item, -1)">－</view>
                                <text class="num-val">{{ item.count }}</text>
                                <view class="num-btn" @click="changeCount(item, 1)">＋</view>
                            </view>
                        </view>
                    </view>
                    <view class="del-btn" @click="removeItem(item)">删除</view>
                </view>
            </view>

            <!-- 底部结算栏 -->
            <view class="bar">
                <view class="bar-left" @click="toggleSelectAll">
                    <view class="checkbox" :class="{ checked: isAllSelected }">
                        <text v-if="isAllSelected">✓</text>
                    </view>
                    <text class="bar-label">全选</text>
                </view>
                <view class="bar-mid">
                    <text class="bar-total-label">合计：</text>
                    <view class="price">
                        <text class="price-symbol">¥</text>
                        <text class="price-integer">{{ selectedTotal }}</text>
                    </view>
                </view>
                <view class="settle-btn" @click="checkout">结算({{ selectedCount }})</view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import store from '@/utils/store.js'

const cart = ref([])
const selected = ref([])

const refresh = () => {
    cart.value = store.getCart()
    // 移除已选中但不在购物车中的 id
    selected.value = selected.value.filter(id => cart.value.some(i => i.id === id))
}

onMounted(refresh)

watch(cart, () => {
    // 默认选中全部
    if (selected.value.length === 0 && cart.value.length > 0) {
        selected.value = cart.value.map(i => i.id)
    }
})

const isAllSelected = computed(() =>
    cart.value.length > 0 && selected.value.length === cart.value.length
)
const selectedCount = computed(() =>
    cart.value.filter(i => selected.value.includes(i.id)).reduce((s, i) => s + i.count, 0)
)
const selectedTotal = computed(() =>
    cart.value.filter(i => selected.value.includes(i.id))
        .reduce((s, i) => s + i.price * i.count, 0)
        .toFixed(2)
)

const toggleSelect = (item) => {
    const idx = selected.value.indexOf(item.id)
    if (idx >= 0) selected.value.splice(idx, 1)
    else selected.value.push(item.id)
}
const toggleSelectAll = () => {
    if (isAllSelected.value) selected.value = []
    else selected.value = cart.value.map(i => i.id)
}
const changeCount = (item, delta) => {
    const newCount = item.count + delta
    if (newCount < 1) return
    store.updateCartItem(item.id, newCount)
    refresh()
}
const removeItem = (item) => {
    uni.showModal({
        title: '提示',
        content: '确定删除该商品？',
        success: (res) => {
            if (res.confirm) {
                store.removeFromCart(item.id)
                refresh()
            }
        }
    })
}
const goProduct = (id) => uni.navigateTo({ url: '/pages/detail/detail?id=' + id })
const goHome = () => uni.switchTab({ url: '/pages/index/index' })

const checkout = () => {
    if (selectedCount.value === 0) {
        uni.showToast({ title: '请选择商品', icon: 'none' })
        return
    }
    uni.showToast({ title: '已下单，模拟支付成功～', icon: 'success' })
    // 结算后清空已选
    cart.value.filter(i => selected.value.includes(i.id))
        .forEach(i => store.removeFromCart(i.id))
    selected.value = []
    refresh()
}
</script>

<style scoped>
.page {
    padding: 20rpx 20rpx 180rpx;
    min-height: 100vh;
}

.cart-item {
    display: flex;
    align-items: center;
    padding: 20rpx 16rpx;
    margin-bottom: 16rpx;
    position: relative;
}
.select-box { padding: 0 16rpx 0 8rpx; }
.checkbox {
    width: 40rpx; height: 40rpx;
    border: 2rpx solid #D7CCC8;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 24rpx;
    color: transparent;
}
.checkbox.checked {
    background: #FFB347;
    border-color: #FFB347;
    color: #FFFFFF;
}

.c-img {
    width: 160rpx; height: 160rpx;
    border-radius: 16rpx;
    flex-shrink: 0;
}
.c-info {
    flex: 1;
    padding: 0 16rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 160rpx;
}
.c-name {
    font-size: 28rpx;
    color: #5D4037;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}
.c-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.num-ctrl {
    display: flex;
    align-items: center;
    border: 1rpx solid #E6D5BE;
    border-radius: 8rpx;
}
.num-btn {
    width: 48rpx; height: 48rpx;
    text-align: center;
    line-height: 46rpx;
    font-size: 28rpx;
    color: #8D6E63;
}
.num-val {
    width: 60rpx;
    text-align: center;
    font-size: 26rpx;
}
.del-btn {
    position: absolute;
    top: 16rpx; right: 16rpx;
    font-size: 22rpx;
    color: #E57373;
}

.bar {
    position: fixed;
    left: 0; right: 0; bottom: 0;
    height: 110rpx;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    padding: 0 24rpx;
    padding-bottom: env(safe-area-inset-bottom);
    box-shadow: 0 -4rpx 16rpx rgba(0,0,0,0.05);
    z-index: 99;
}
.bar-left { display: flex; align-items: center; }
.bar-label { margin-left: 8rpx; font-size: 26rpx; color: #5D4037; }
.bar-mid { flex: 1; padding-left: 24rpx; }
.bar-total-label { font-size: 24rpx; color: #5D4037; }
.settle-btn {
    background: linear-gradient(135deg, #FFB347, #FF8C42);
    color: #FFFFFF;
    padding: 16rpx 36rpx;
    border-radius: 44rpx;
    font-size: 26rpx;
    box-shadow: 0 4rpx 12rpx rgba(255,140,66,0.3);
}

.empty-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 200rpx;
}
.empty-sub {
    font-size: 24rpx;
    color: #B0A18A;
    margin-top: 12rpx;
}
.go-shop-btn {
    margin-top: 40rpx;
    background: linear-gradient(135deg, #FFB347, #FF8C42);
    color: #FFFFFF;
    padding: 18rpx 80rpx;
    border-radius: 44rpx;
    font-size: 28rpx;
    box-shadow: 0 8rpx 24rpx rgba(255,140,66,0.3);
}
</style>
