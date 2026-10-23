<template>
    <view class="page">
        <view class="main-layout">
            <!-- 左侧分类 -->
            <scroll-view class="left-cats" scroll-y>
                <view
                    class="cat-item"
                    :class="{ active: activeCat === cat.id }"
                    v-for="cat in categories"
                    :key="cat.id"
                    @click="selectCat(cat.id)"
                >
                    <text class="cat-emoji">{{ cat.icon }}</text>
                    <text class="cat-name">{{ cat.name }}</text>
                </view>
            </scroll-view>

            <!-- 右侧商品 -->
            <scroll-view class="right-products" scroll-y>
                <view class="section-header">
                    <text class="sec-title">{{ currentCatName }}</text>
                    <text class="sec-count">共 {{ filteredProducts.length }} 件</text>
                </view>

                <view v-if="filteredProducts.length === 0" class="empty-wrap">
                    <text class="empty-icon">🌱</text>
                    <text class="empty-text">暂时没有商品～</text>
                </view>

                <view v-else class="product-list">
                    <view
                        class="product-row card"
                        v-for="p in filteredProducts"
                        :key="p.id"
                        @click="goProduct(p.id)"
                    >
                        <image class="p-img" :src="p.image" mode="aspectFill" />
                        <view class="p-info">
                            <text class="p-name">{{ p.name }}</text>
                            <text class="p-desc">{{ p.desc }}</text>
                            <view class="p-bottom">
                                <view class="price">
                                    <text class="price-symbol">¥</text>
                                    <text class="price-integer">{{ p.price }}</text>
                                </view>
                                <view class="add-cart" @click.stop="addToCart(p)">加入购物车</view>
                            </view>
                        </view>
                    </view>
                </view>
            </scroll-view>
        </view>
    </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import request from '@/utils/request.js'
import store from '@/utils/store.js'

const categories = ref([])
const activeCat = ref(1)
const allProducts = ref([])

onMounted(async () => {
    const [c, p] = await Promise.all([
        request({ url: '/api/categories' }),
        request({ url: '/api/products' })
    ])
    categories.value = c.data || []
    allProducts.value = p.data || []
})

const currentCatName = computed(() => {
    const cat = categories.value.find(c => c.id === activeCat.value)
    return cat ? cat.name : '全部商品'
})
const filteredProducts = computed(() =>
    allProducts.value.filter(p => p.categoryId === activeCat.value)
)

const selectCat = (id) => activeCat.value = id
const goProduct = (id) => uni.navigateTo({ url: '/pages/detail/detail?id=' + id })
const addToCart = (p) => store.addToCart(p, 1)
</script>

<style scoped>
.page { height: 100vh; background: #FFFAF3; }
.main-layout {
    display: flex;
    height: calc(100vh - 100rpx);
    box-sizing: border-box;
}
.left-cats {
    width: 180rpx;
    background: #FDF6EC;
    height: 100%;
}
.cat-item {
    padding: 28rpx 16rpx;
    text-align: center;
    font-size: 24rpx;
    color: #8D6E63;
    border-left: 6rpx solid transparent;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.cat-emoji { font-size: 36rpx; margin-bottom: 6rpx; }
.cat-item.active {
    background: #FFFFFF;
    color: #FF8C42;
    font-weight: 600;
    border-left-color: #FFB347;
}

.right-products {
    flex: 1;
    height: 100%;
    padding: 20rpx 20rpx 120rpx;
    box-sizing: border-box;
}
.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    padding: 0 8rpx;
}
.sec-title {
    font-size: 30rpx;
    font-weight: 600;
    color: #5D4037;
}
.sec-count { font-size: 24rpx; color: #B0A18A; }

.product-row {
    display: flex;
    padding: 16rpx;
    margin-bottom: 16rpx;
}
.p-img {
    width: 180rpx; height: 180rpx;
    border-radius: 16rpx;
    flex-shrink: 0;
}
.p-info {
    flex: 1;
    padding: 0 16rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.p-name {
    font-size: 28rpx;
    color: #5D4037;
    font-weight: 500;
}
.p-desc {
    font-size: 22rpx;
    color: #B0A18A;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    margin: 8rpx 0;
}
.p-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.add-cart {
    font-size: 22rpx;
    color: #FF8C42;
    border: 1rpx solid #FFB347;
    border-radius: 24rpx;
    padding: 6rpx 20rpx;
}
</style>
