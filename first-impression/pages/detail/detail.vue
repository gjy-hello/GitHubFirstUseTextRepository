<template>
    <view class="page">
        <!-- 商品图片轮播 -->
        <swiper v-if="detail" class="banner" :indicator-dots="detail.images.length > 1" indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#FFFFFF">
            <swiper-item v-for="(img, i) in detail.images" :key="i">
                <image class="banner-img" :src="img" mode="aspectFill" />
            </swiper-item>
        </swiper>
        <view v-else class="empty-wrap">
            <text class="empty-icon">🌼</text>
            <text class="empty-text">商品不存在</text>
        </view>

        <view v-if="detail" class="detail-wrap">
            <!-- 价格 & 名称 -->
            <view class="card price-card">
                <view class="price-row">
                    <view class="price big">
                        <text class="price-symbol">¥</text>
                        <text class="price-integer">{{ detail.price }}</text>
                    </view>
                    <text class="original-price">¥{{ detail.originalPrice }}</text>
                    <view class="discount-tag">限时特惠</view>
                </view>
                <text class="product-title">{{ detail.name }}</text>
                <view class="meta-row">
                    <text class="sales-text">已售 {{ detail.sales }}</text>
                    <text class="divider-line">|</text>
                    <text class="shop-text">第一印象 · 生活美学</text>
                </view>
            </view>

            <!-- 商品描述 -->
            <view class="card">
                <view class="desc-title">商品特色</view>
                <text class="desc-text">{{ detail.desc }}</text>
            </view>

            <!-- 推荐理由 -->
            <view class="card">
                <view class="desc-title">为什么值得拥有</view>
                <view class="reason-list">
                    <view class="reason-item" v-for="(r, i) in reasons" :key="i">
                        <text class="reason-dot">·</text>
                        <text class="reason-text">{{ r }}</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 底部操作栏 -->
        <view v-if="detail" class="bottom-bar">
            <view class="bar-icon" @click="toggleFavorite">
                <text class="bi-icon">{{ isFav ? '❤️' : '🤍' }}</text>
                <text class="bi-text">收藏</text>
            </view>
            <view class="bar-icon" @click="goHome">
                <text class="bi-icon">🏠</text>
                <text class="bi-text">首页</text>
            </view>
            <view class="bar-cart" @click="addToCart">加入购物车</view>
            <view class="bar-buy" @click="buyNow">立即购买</view>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request.js'
import store from '@/utils/store.js'

const detail = ref(null)
const isFav = ref(false)

const reasons = [
    '温柔色调，百搭各种家居风格',
    '品质优选，细节经得起推敲',
    '实用美观，让日常多一点仪式感',
    '第一印象严选好物'
]

onMounted(async () => {
    const pages = getCurrentPages()
    const curPage = pages[pages.length - 1]
    const id = curPage.options.id
    const res = await request({ url: '/api/product/detail', data: { id } })
    detail.value = res.data
})

const toggleFavorite = () => {
    isFav.value = !isFav.value
    uni.showToast({ title: isFav.value ? '已收藏' : '已取消收藏', icon: 'none' })
}
const addToCart = () => {
    if (!detail.value) return
    store.addToCart(detail.value, 1)
}
const buyNow = () => {
    if (!detail.value) return
    store.addToCart(detail.value, 1)
    setTimeout(() => uni.switchTab({ url: '/pages/cart/cart' }), 500)
}
const goHome = () => uni.switchTab({ url: '/pages/index/index' })
</script>

<style scoped>
.page {
    padding-bottom: 140rpx;
    min-height: 100vh;
}
.banner {
    width: 100%;
    height: 750rpx;
    background: #FFFFFF;
}
.banner-img { width: 100%; height: 100%; }

.detail-wrap {
    padding: 24rpx 24rpx 0;
}
.price-card {
    padding: 28rpx;
}
.price-row {
    display: flex;
    align-items: baseline;
    margin-bottom: 16rpx;
}
.price.big .price-integer { font-size: 52rpx; font-weight: 700; }
.price.big .price-symbol { font-size: 28rpx; }
.original-price {
    font-size: 24rpx;
    color: #B0A18A;
    text-decoration: line-through;
    margin-left: 16rpx;
}
.discount-tag {
    background: linear-gradient(135deg, #FF8C42, #FF6B35);
    color: #FFFFFF;
    font-size: 20rpx;
    padding: 4rpx 16rpx;
    border-radius: 20rpx;
    margin-left: auto;
}
.product-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #5D4037;
    display: block;
    line-height: 1.5;
}
.meta-row {
    display: flex;
    align-items: center;
    margin-top: 16rpx;
    font-size: 22rpx;
    color: #B0A18A;
}
.divider-line { margin: 0 12rpx; }

.desc-title {
    font-size: 28rpx;
    font-weight: 600;
    color: #5D4037;
    margin-bottom: 16rpx;
    padding-left: 16rpx;
    border-left: 6rpx solid #FFB347;
}
.desc-text {
    font-size: 26rpx;
    color: #8D6E63;
    line-height: 1.8;
}
.reason-list {
    padding-left: 8rpx;
}
.reason-item {
    display: flex;
    font-size: 26rpx;
    color: #8D6E63;
    line-height: 2;
}
.reason-dot {
    color: #FFB347;
    margin-right: 12rpx;
    font-weight: 700;
}

.bottom-bar {
    position: fixed;
    left: 0; right: 0; bottom: 0;
    height: 110rpx;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    padding: 0 16rpx;
    padding-bottom: env(safe-area-inset-bottom);
    box-shadow: 0 -4rpx 16rpx rgba(0,0,0,0.05);
    z-index: 99;
}
.bar-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100rpx;
}
.bi-icon { font-size: 36rpx; }
.bi-text { font-size: 20rpx; color: #8D6E63; }
.bar-cart, .bar-buy {
    flex: 1;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    font-size: 28rpx;
    border-radius: 40rpx;
    margin-left: 12rpx;
}
.bar-cart {
    background: #FFE0B2;
    color: #FF8C42;
}
.bar-buy {
    background: linear-gradient(135deg, #FFB347, #FF8C42);
    color: #FFFFFF;
    box-shadow: 0 4rpx 12rpx rgba(255,140,66,0.3);
}
</style>
