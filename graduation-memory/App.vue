<script>
export default {
    onLaunch() {
        console.log('时光寄 · 启动')

        // 初始化微信云开发（真实环境）
        // #ifdef MP-WEIXIN
        if (typeof wx !== 'undefined' && wx.cloud) {
            wx.cloud.init({
                env: 'your-cloud-env-id',
                traceUser: true
            })
        }
        // #endif

        // 本地状态初始化
        if (!uni.getStorageSync('userInfo')) {
            uni.setStorageSync('userInfo', null)
        }
    },
    onShow() {},
    onHide() {}
}
</script>

<style>
/* ============ 回忆录全局视觉系统 ============ */
page {
    background-color: #FAF6F0;
    font-family: -apple-system, 'Noto Serif SC', 'Source Han Serif', 'Songti SC', 'STSong', serif;
    color: #4A3728;
    font-size: 28rpx;
    line-height: 1.8;
}

/* 老信纸卡片 */
.paper-card {
    background: linear-gradient(180deg, #FFFBF3 0%, #FAF1E4 100%);
    border-radius: 12rpx;
    padding: 36rpx 32rpx;
    box-shadow:
        0 2rpx 0 rgba(139, 111, 71, 0.06),
        0 8rpx 24rpx rgba(139, 111, 71, 0.08);
    border: 1rpx solid rgba(139, 111, 71, 0.08);
    margin-bottom: 24rpx;
    position: relative;
}
.paper-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    pointer-events: none;
    border-radius: 12rpx;
    background-image: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 44rpx,
        rgba(139, 111, 71, 0.04) 44rpx,
        rgba(139, 111, 71, 0.04) 45rpx
    );
}

/* 拍立得照片 */
.polaroid {
    background: #FFFFFF;
    padding: 16rpx 16rpx 56rpx;
    box-shadow: 0 8rpx 24rpx rgba(139, 111, 71, 0.15);
    border-radius: 4rpx;
    display: inline-block;
    position: relative;
}
.polaroid image {
    width: 100%;
    display: block;
}
.polaroid-caption {
    position: absolute;
    bottom: 14rpx;
    left: 16rpx;
    right: 16rpx;
    text-align: center;
    font-family: 'Noto Serif SC', 'Kaiti SC', 'STKaiti', serif;
    color: #8B6F47;
    font-size: 22rpx;
}

/* 手写感标题 */
.title-script {
    font-family: 'STKaiti', 'Kaiti SC', 'Noto Serif SC', serif;
    color: #4A3728;
    font-weight: 500;
}

/* 主按钮 · 暖棕色信封 */
.btn-seal {
    background: #8B6F47;
    color: #F5ECD7;
    border-radius: 6rpx;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    font-size: 30rpx;
    letter-spacing: 12rpx;
    border: none;
    box-shadow: 0 6rpx 16rpx rgba(139, 111, 71, 0.3);
}
.btn-seal:active {
    transform: translateY(1rpx);
    box-shadow: 0 2rpx 8rpx rgba(139, 111, 71, 0.25);
}
.btn-outline {
    background: transparent;
    color: #8B6F47;
    border: 1rpx solid #8B6F47;
    border-radius: 6rpx;
    height: 88rpx;
    line-height: 86rpx;
    text-align: center;
    font-size: 28rpx;
    letter-spacing: 8rpx;
}

/* 时间轴竖线 */
.timeline {
    position: relative;
    padding-left: 40rpx;
}
.timeline::before {
    content: '';
    position: absolute;
    left: 14rpx;
    top: 8rpx;
    bottom: 8rpx;
    width: 2rpx;
    background: linear-gradient(180deg, rgba(139,111,71,0.4), rgba(139,111,71,0.05));
}
.timeline-dot {
    position: absolute;
    left: 6rpx;
    top: 16rpx;
    width: 18rpx; height: 18rpx;
    border-radius: 50%;
    background: #C4A574;
    border: 3rpx solid #FAF6F0;
    box-shadow: 0 0 0 2rpx rgba(196,165,116,0.5);
}

/* 空状态 */
.empty {
    text-align: center;
    padding: 160rpx 60rpx;
    color: #B8A68B;
}
.empty-ink {
    font-size: 100rpx;
    margin-bottom: 32rpx;
    opacity: 0.5;
}
.empty-text {
    font-family: 'STKaiti', 'Kaiti SC', serif;
    font-size: 28rpx;
}

/* 印章 · 红色签名 */
.seal {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 120rpx; height: 120rpx;
    background: #C0392B;
    color: #FFFFFF;
    font-family: 'STKaiti', serif;
    font-size: 24rpx;
    line-height: 1.2;
    border-radius: 12rpx;
    transform: rotate(-8deg);
    box-shadow: 0 4rpx 12rpx rgba(192,57,43,0.4);
    letter-spacing: 2rpx;
}

/* 标签 · 时间 */
.tag-time {
    display: inline-block;
    padding: 4rpx 16rpx;
    background: #F5ECD7;
    color: #8B6F47;
    font-size: 22rpx;
    border-radius: 4rpx;
    font-family: 'Noto Serif SC', serif;
}
</style>
