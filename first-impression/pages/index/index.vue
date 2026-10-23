<template>
    <view class="page">
        <!-- 搜索框 -->
        <view class="search-bar">
            <view class="search-input" @click="goSearch">
                <text class="search-icon">🔍</text>
                <text class="search-placeholder">搜索你喜欢的好物～</text>
            </view>
        </view>

        <!-- Banner 轮播 -->
        <swiper class="banner" :indicator-dots="true" :autoplay="true" :interval="4000" circular indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#FFFFFF">
            <swiper-item v-for="item in banners" :key="item.id" @click="goDetail(item.link)">
                <image class="banner-img" :src="item.image" mode="aspectFill" />
                <view class="banner-title">{{ item.title }}</view>
            </swiper-item>
        </swiper>

        <!-- 分类入口 -->
        <view class="section-title">逛一逛</view>
        <view class="category-grid">
            <view
                class="category-item"
                v-for="cat in categories"
                :key="cat.id"
                @click="goCategory(cat.id)"
            >
                <view class="cat-icon" :style="{ background: cat.color }">{{ cat.icon }}</view>
                <text class="cat-name">{{ cat.name }}</text>
            </view>
        </view>

        <!-- 热门推荐 -->
        <view class="section-title">为你推荐</view>
        <view class="product-grid">
            <view
                class="product-item card"
                v-for="p in products"
                :key="p.id"
                @click="goProduct(p.id)"
            >
                <image class="product-img" :src="p.image" mode="aspectFill" />
                <view class="product-info">
                    <text class="product-name">{{ p.name }}</text>
                    <view class="price-row">
                        <view class="price">
                            <text class="price-symbol">¥</text>
                            <text class="price-integer">{{ p.price }}</text>
                        </view>
                        <text class="original-price">¥{{ p.originalPrice }}</text>
                    </view>
                    <view class="sales-row">
                        <text class="sales-text">已售 {{ p.sales }}</text>
                        <view class="add-cart-btn" @click.stop="addToCart(p)">＋</view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request.js'
import store from '@/utils/store.js'

const banners = ref([])
const categories = ref([])
const products = ref([])

onMounted(async () => {
    const [bRes, cRes, pRes] = await Promise.all([
        request({ url: '/api/banners' }),
        request({ url: '/api/categories' }),
        request({ url: '/api/products' })
    ])
    banners.value = bRes.data || []
    categories.value = cRes.data || []
    products.value = (pRes.data || []).slice(0, 6)
})

const goDetail = (link) => {
    if (!link) return
    const id = link.match(/id=(\d+)/)
    if (id) goProduct(id[1])
}
const goProduct = (id) => uni.navigateTo({ url: '/pages/detail/detail?id=' + id })
const goCategory = (id) => {
    uni.switchTab({ url: '/pages/category/category' })
}
const goSearch = () => uni.showToast({ title: '搜索功能开发中', icon: 'none' })
const addToCart = (p) => store.addToCart(p, 1)
</script>

<style scoped>
.page {
    padding: 20rpx 24rpx 120rpx;
}
.search-bar {
    margin-bottom: 24rpx;
}
.search-input {
    background: #FFFFFF;
    border-radius: 40rpx;
    height: 72rpx;
    display: flex;
    align-items: center;
    padding: 0 28rpx;
    box-shadow: 0 4rpx 12rpx rgba(255,179,71,0.08);
}
.search-icon { font-size: 28rpx; margin-right: 16rpx; }
.search-placeholder { color: #B0A18A; font-size: 26rpx; }

.banner {
    height: 320rpx;
    border-radius: 20rpx;
    overflow: hidden;
    margin-bottom: 32rpx;
    box-shadow: 0 8rpx 24rpx rgba(255,179,71,0.15);
}
.banner-img { width: 100%; height: 100%; }
.banner-title {
    position: absolute;
    left: 32rpx; bottom: 32rpx;
    color: #FFFFFF;
    font-size: 36rpx;
    font-weight: 600;
    text-shadow: 0 2rpx 8rpx rgba(0,0,0,0.3);
}

.section-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #5D4037;
    margin: 24rpx 0 20rpx;
    padding-left: 16rpx;
    border-left: 6rpx solid #FFB347;
}

.category-grid {
    display: flex;
    flex-wrap: wrap;
    background: #FFFFFF;
    border-radius: 20rpx;
    padding: 24rpx 0;
    margin-bottom: 16rpx;
    box-shadow: 0 4rpx 16rpx rgba(255,179,71,0.08);
}
.category-item {
    width: 33.33%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 16rpx;
}
.cat-icon {
    width: 88rpx; height: 88rpx;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 40rpx;
    margin-bottom: 10rpx;
}
.cat-name { font-size: 24rpx; color: #5D4037; }

.product-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
.product-item {
    width: 48%;
    margin-bottom: 20rpx;
    padding: 16rpx;
}
.product-img {
    width: 100%;
    height: 300rpx;
    border-radius: 16rpx;
    margin-bottom: 16rpx;
}
.product-info { padding: 0 8rpx; }
.product-name {
    font-size: 26rpx;
    color: #5D4037;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    line-height: 1.4;
    height: 72rpx;
}
.price-row {
    display: flex;
    align-items: baseline;
    margin-top: 10rpx;
}
.original-price {
    font-size: 22rpx;
    color: #B0A18A;
    text-decoration: line-through;
    margin-left: 12rpx;
}
.sales-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12rpx;
}
.sales-text { font-size: 22rpx; color: #B0A18A; }
.add-cart-btn {
    width: 48rpx; height: 48rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, #FFB347, #FF8C42);
    color: #FFFFFF;
    text-align: center;
    line-height: 44rpx;
    font-size: 32rpx;
    box-shadow: 0 4rpx 12rpx rgba(255,140,66,0.3);
}
</style>
