<template>
    <view class="page">
        <!-- 信封头 -->
        <view class="letter-head">
            <view class="lh-sub">致</view>
            <input
                class="lh-name"
                v-model="form.name"
                placeholder="老师的名字"
                maxlength="20"
            />
            <view class="lh-sub2">老师 启</view>
            <view class="divider-soft" style="margin: 24rpx 0;"></view>
        </view>

        <view class="paper-card form-card">
            <view class="field row">
                <text class="field-label">学科</text>
                <input class="field-input" v-model="form.subject" placeholder="如：高等数学 / 古典文学" maxlength="20" />
            </view>
            <view class="field col">
                <text class="field-label">照片</text>
                <view class="photo-row">
                    <image v-if="form.avatarUrl" :src="form.avatarUrl" class="avatar-preview" mode="aspectFill" @click="chooseAvatar" />
                    <view v-else class="avatar-add" @click="chooseAvatar">＋</view>
                    <text class="avatar-tip">一张合影或老师的照片</text>
                </view>
            </view>
            <view class="field col">
                <text class="field-label">开场白</text>
                <textarea
                    class="field-textarea"
                    v-model="form.memo"
                    placeholder="一句话，或一段你们之间最难忘的故事。这会出现在老师的欢迎页。"
                />
            </view>
        </view>

        <view class="paper-card memories-card">
            <view class="mc-head">
                <text class="mc-title title-script">往 事 点 滴</text>
                <text class="mc-sub">写几条小事，让老师看到鲜活的你</text>
            </view>

            <!-- 已添加的记忆 -->
            <view class="memory-item" v-for="(m, idx) in form.memories" :key="idx">
                <view class="mi-head">
                    <text class="mi-dot"></text>
                    <text class="mi-date">{{ fmtDate(m.date) }}</text>
                    <text class="mi-del" @click="removeMemory(idx)">×</text>
                </view>
                <view class="mi-content">{{ m.content }}</view>
            </view>

            <!-- 新增一条 -->
            <view class="add-memory">
                <picker mode="date" :value="newMem.date" @change="e => newMem.date = e.detail.value">
                    <view class="mem-date-tag">📅 {{ newMem.date || '选个日期' }}</view>
                </picker>
                <textarea
                    class="mem-text"
                    v-model="newMem.content"
                    placeholder="那年冬天您在走廊的那句夸奖..."
                    :maxlength="200"
                />
                <view class="mem-add" @click="addMemory">＋ 加入信封</view>
            </view>
        </view>

        <view class="btn-seal save-btn" @click="save">
            {{ isEdit ? '更新信封' : '写好这一封' }}
        </view>

        <view v-if="isEdit" class="token-box">
            <text class="token-label">专属邀请码</text>
            <text class="token">{{ form.inviteToken }}</text>
            <text class="token-tip" @click="copyToken">点击复制</text>
        </view>
    </view>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import cloud from '@/utils/cloud.js'
import { fmtDate } from '@/utils/store.js'

const isEdit = ref(false)
const form = reactive({
    _id: '', name: '', subject: '', avatarUrl: '', memo: '',
    inviteToken: '', memories: []
})
const newMem = reactive({ date: '', content: '' })

onLoad(async (opt) => {
    if (opt && opt.id) {
        isEdit.value = true
        const list = await cloud.listTeachers()
        const t = (list || []).find(x => x._id === opt.id)
        if (t) {
            Object.assign(form, t)
            const mems = await cloud.listMemoriesByTeacher(t._id)
            form.memories = mems || []
        }
    }
})

const chooseAvatar = () => {
    uni.chooseImage({ count: 1, success: r => form.avatarUrl = r.tempFilePaths[0] })
}

const addMemory = async () => {
    if (!newMem.content.trim()) {
        uni.showToast({ title: '写点什么吧', icon: 'none' }); return
    }
    if (isEdit.value && form._id) {
        // 编辑模式：加到后端
        const m = await cloud.addMemory({
            teacherId: form._id,
            content: newMem.content,
            date: newMem.date || Date.now()
        })
        form.memories.push({ ...m, content: newMem.content, date: newMem.date || Date.now() })
    } else {
        form.memories.push({
            content: newMem.content,
            date: newMem.date || Date.now(),
            createdAt: Date.now()
        })
    }
    newMem.content = ''
    newMem.date = ''
}
const removeMemory = (idx) => form.memories.splice(idx, 1)

const save = async () => {
    if (!form.name.trim()) {
        uni.showToast({ title: '老师的名字必填哦', icon: 'none' }); return
    }
    uni.showLoading({ title: '写好中' })
    if (isEdit.value && form._id) {
        await cloud.updateTeacher(form._id, {
            name: form.name, subject: form.subject,
            avatarUrl: form.avatarUrl, memo: form.memo
        })
    } else {
        // 新建：先创建老师记录，再写入待入库的 memories
        const t = await cloud.createTeacher({
            name: form.name, subject: form.subject,
            avatarUrl: form.avatarUrl, memo: form.memo
        })
        form._id = t._id
        form.inviteToken = t.inviteToken
        for (const m of form.memories) {
            await cloud.addMemory({
                teacherId: form._id,
                content: m.content, date: m.date || Date.now()
            })
        }
    }
    uni.hideLoading()
    uni.showToast({ title: '已封存', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 800)
}

const copyToken = () => {
    uni.setClipboardData({
        data: form.inviteToken,
        success: () => uni.showToast({ title: '已复制邀请码', icon: 'none' })
    })
}
</script>

<style scoped>
.page { min-height: 100vh; padding: 24rpx 28rpx 160rpx; }

.letter-head {
    padding: 24rpx 20rpx 0;
    font-family: 'STKaiti', 'Noto Serif SC', serif;
}
.lh-sub {
    color: #8B6F47;
    font-size: 26rpx;
    letter-spacing: 12rpx;
}
.lh-name {
    font-size: 48rpx;
    font-family: 'STKaiti', 'Noto Serif SC', serif;
    color: #4A3728;
    font-weight: 500;
    padding: 8rpx 0;
    border-bottom: 1rpx dashed rgba(139,111,71,0.2);
    margin: 8rpx 0;
}
.lh-sub2 {
    text-align: right;
    font-size: 24rpx;
    color: #8B6F47;
}

.form-card { padding: 24rpx 28rpx; margin-top: 8rpx; }
.field { padding: 18rpx 0; }
.field.row { display: flex; align-items: center; border-bottom: 1rpx solid rgba(139,111,71,0.1); }
.field.col { display: flex; flex-direction: column; border-bottom: 1rpx solid rgba(139,111,71,0.1); }
.field-label {
    font-family: 'STKaiti', serif;
    font-size: 26rpx;
    color: #8B6F47;
    margin-bottom: 12rpx;
}
.field.row .field-label { width: 100rpx; margin-bottom: 0; }
.field-input { flex: 1; font-size: 28rpx; color: #4A3728; }
.field-textarea {
    min-height: 200rpx;
    font-size: 28rpx;
    color: #4A3728;
    padding: 14rpx;
    background: rgba(139,111,71,0.04);
    border-radius: 6rpx;
    line-height: 1.8;
    font-family: 'STKaiti', 'Noto Serif SC', serif;
}

.photo-row { display: flex; align-items: center; gap: 20rpx; margin-top: 10rpx; }
.avatar-preview, .avatar-add {
    width: 120rpx; height: 120rpx;
    border-radius: 6rpx;
    flex-shrink: 0;
}
.avatar-preview { border: 2rpx solid rgba(139,111,71,0.2); }
.avatar-add {
    background: rgba(139,111,71,0.06);
    border: 2rpx dashed rgba(139,111,71,0.3);
    color: #8B6F47;
    display: flex; align-items: center; justify-content: center;
    font-size: 60rpx;
}
.avatar-tip { font-size: 22rpx; color: #B8A68B; }

.memories-card { padding: 28rpx 28rpx; }
.mc-head { margin-bottom: 20rpx; }
.mc-title { font-size: 32rpx; letter-spacing: 8rpx; }
.mc-sub { font-size: 22rpx; color: #B8A68B; margin-top: 6rpx; display: block; }

.memory-item {
    position: relative;
    padding: 20rpx 24rpx;
    background: rgba(196,165,116,0.08);
    border-radius: 6rpx;
    margin-bottom: 16rpx;
    border-left: 3rpx solid #C4A574;
}
.mi-head {
    display: flex; align-items: center;
    font-size: 22rpx; color: #8B6F47;
    margin-bottom: 8rpx;
}
.mi-dot {
    width: 10rpx; height: 10rpx;
    background: #C4A574; border-radius: 50%;
    margin-right: 12rpx;
}
.mi-date { font-family: 'Noto Serif SC', serif; }
.mi-del {
    margin-left: auto;
    color: #B8A68B; font-size: 36rpx;
    padding: 0 12rpx;
}
.mi-content {
    font-family: 'STKaiti', 'Noto Serif SC', serif;
    font-size: 26rpx;
    color: #4A3728;
    line-height: 1.9;
}

.add-memory {
    margin-top: 16rpx;
    padding: 20rpx;
    background: rgba(139,111,71,0.04);
    border-radius: 6rpx;
    border: 1rpx dashed rgba(139,111,71,0.2);
}
.mem-date-tag {
    display: inline-block;
    padding: 6rpx 16rpx;
    background: #F5ECD7;
    color: #8B6F47;
    font-size: 22rpx;
    border-radius: 4rpx;
    margin-bottom: 14rpx;
}
.mem-text {
    width: 100%;
    min-height: 120rpx;
    font-size: 26rpx;
    color: #4A3728;
    font-family: 'STKaiti', serif;
}
.mem-add {
    text-align: center;
    font-size: 24rpx;
    color: #8B6F47;
    padding: 12rpx 0;
    margin-top: 8rpx;
    border-top: 1rpx dashed rgba(139,111,71,0.15);
}

.save-btn { margin-top: 40rpx; }
.token-box {
    margin-top: 20rpx;
    text-align: center;
    padding: 20rpx;
    background: rgba(139,111,71,0.08);
    border-radius: 6rpx;
}
.token-label { font-size: 22rpx; color: #B8A68B; margin-right: 12rpx; }
.token {
    font-family: 'Noto Serif SC', serif;
    font-size: 32rpx;
    font-weight: 600;
    color: #C0392B;
    letter-spacing: 6rpx;
}
.token-tip { font-size: 22rpx; color: #8B6F47; margin-left: 12rpx; }
</style>
