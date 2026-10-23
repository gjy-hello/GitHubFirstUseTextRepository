<script>
export default {
    onLaunch() {
        console.log('第一印象 小程序启动')
        // 初始化本地存储
        if (!uni.getStorageSync('userInfo')) {
            uni.setStorageSync('userInfo', null)
        }
        if (!uni.getStorageSync('cartList')) {
            uni.setStorageSync('cartList', [])
        }
    },
    onShow() {
        console.log('App Show')
    },
    onHide() {
        console.log('App Hide')
    }
}
</script>

<style>
/* 全局样式 */
page {
    background-color: #FFFAF3;
    font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
    color: #5D4037;
    font-size: 28rpx;
    line-height: 1.6;
}

/* 通用容器 */
.container {
    padding: 24rpx;
    box-sizing: border-box;
}

/* 主按钮 */
.btn-primary {
    background: linear-gradient(135deg, #FFB347, #FF8C42);
    color: #FFFFFF;
    border-radius: 48rpx;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    font-size: 30rpx;
    font-weight: 500;
    border: none;
    box-shadow: 0 8rpx 24rpx rgba(255, 140, 66, 0.3);
}

.btn-primary:active {
    opacity: 0.85;
}

/* 卡片样式 */
.card {
    background: #FFFFFF;
    border-radius: 20rpx;
    padding: 24rpx;
    box-shadow: 0 4rpx 16rpx rgba(255, 179, 71, 0.08);
    margin-bottom: 20rpx;
}

/* 分割线 */
.divider {
    height: 1rpx;
    background: #F0E6D8;
    margin: 24rpx 0;
}

/* 价格 */
.price {
    color: #FF6B35;
    font-weight: 600;
}

.price-symbol {
    font-size: 24rpx;
}

.price-integer {
    font-size: 36rpx;
}

/* 空状态 */
.empty-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 120rpx 0;
    color: #B0A18A;
}

.empty-icon {
    font-size: 120rpx;
    margin-bottom: 24rpx;
}

.empty-text {
    font-size: 28rpx;
}
</style>
