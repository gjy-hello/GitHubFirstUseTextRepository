/**
 * 云开发统一封装
 * -------------
 * 设计目的：让 uni-app 前端在「真实云开发」和「本地 mock」之间零改动切换。
 * 默认 USE_MOCK=true（前端可独立运行），部署到云开发后把 USE_MOCK 改成 false。
 *
 * 云数据库表结构（真实环境）：
 * ------------------------------------------------------------
 * 表 users:      { _openid, realName, nickName, avatarUrl, school, major, gradYear, bio, photoWall[], createdAt }
 * 表 teachers:   { _openid, _id, name, subject, avatarUrl, memo, inviteToken, createdAt, updatedAt }
 * 表 memories:   { _openid, _id, teacherId, kind:'shared'|'mine', content, photos[], date, createdAt }
 * 表 responses:  { _openid(teacher), _id, studentOpenid, teacherId, evaluation, memories[], photos[], createdAt }
 *                    其中 studentOpenid 指向被评价的学生
 * ------------------------------------------------------------
 */

// ⚠️ 切真实环境时改成 false
export const USE_MOCK = true

// ============ Mock 内存存储（只在当前会话有效，便于开发演示） ============
const mockDB = {
    user: null,
    teachers: [],     // 每位老师一条
    memories: [],     // 学生写的共同回忆
    responses: []     // 老师给的评价
}

// ============ 通用 Promise 包装 ============
const delay = (ms = 400) => new Promise(r => setTimeout(r, ms))

// ============ 真实云开发适配器 ============
const cloud = {
    /** 调云函数 */
    callFunction(name, data) {
        return new Promise((resolve, reject) => {
            // #ifdef MP-WEIXIN
            wx.cloud.callFunction({
                name, data,
                success: res => resolve(res.result),
                fail: reject
            })
            // #endif
            // #ifndef MP-WEIXIN
            resolve({ code: 0, data: null })
            // #endif
        })
    },

    /** 直接查集合（小程序端 SDK） */
    collection(name) {
        // #ifdef MP-WEIXIN
        return wx.cloud.database().collection(name)
        // #endif
        return null
    }
}

// ============ API 集合 ============

export default {
    // ---------- 登录 & 用户 ----------
    async loginByWx() {
        if (USE_MOCK) {
            await delay()
            mockDB.user = mockDB.user || {
                _openid: 'mock_openid_' + Date.now(),
                nickName: '少年·未命名',
                avatarUrl: '',
                realName: '',
                school: '',
                major: '',
                gradYear: '',
                bio: '',
                photoWall: [],
                createdAt: Date.now()
            }
            uni.setStorageSync('userInfo', mockDB.user)
            uni.setStorageSync('openid', mockDB.user._openid)
            return mockDB.user
        }
        const res = await cloud.callFunction('login')
        if (res.code === 0) {
            uni.setStorageSync('userInfo', res.data)
            uni.setStorageSync('openid', res.data._openid)
        }
        return res.data
    },

    async updateUser(patch) {
        if (USE_MOCK) {
            Object.assign(mockDB.user, patch)
            uni.setStorageSync('userInfo', mockDB.user)
            return mockDB.user
        }
        await cloud.callFunction('updateUser', patch)
    },

    async getCurrentUser() {
        return uni.getStorageSync('userInfo') || null
    },

    // ---------- 老师 ----------
    async createTeacher(data) {
        if (USE_MOCK) {
            await delay()
            const token = Math.random().toString(36).slice(2, 8).toUpperCase()
            const t = {
                _id: 't_' + Date.now(),
                _openid: uni.getStorageSync('openid'),
                ...data,
                inviteToken: token,
                createdAt: Date.now(),
                updatedAt: Date.now()
            }
            mockDB.teachers.push(t)
            return t
        }
        return cloud.callFunction('createTeacher', data)
    },

    async listTeachers() {
        if (USE_MOCK) { await delay(); return mockDB.teachers }
        return cloud.callFunction('listTeachers')
    },

    async updateTeacher(id, patch) {
        if (USE_MOCK) {
            const t = mockDB.teachers.find(x => x._id === id)
            if (t) Object.assign(t, patch, { updatedAt: Date.now() })
            return t
        }
        return cloud.callFunction('updateTeacher', { id, ...patch })
    },

    async deleteTeacher(id) {
        if (USE_MOCK) {
            mockDB.teachers = mockDB.teachers.filter(x => x._id !== id)
            mockDB.memories = mockDB.memories.filter(m => m.teacherId !== id)
            mockDB.responses = mockDB.responses.filter(r => r.teacherId !== id)
            return true
        }
        return cloud.callFunction('deleteTeacher', { id })
    },

    /** 老师端：通过邀请码找学生 */
    async getTeacherByToken(token) {
        if (USE_MOCK) {
            await delay()
            const t = mockDB.teachers.find(x => x.inviteToken === token.toUpperCase())
            if (!t) return null
            return {
                teacher: t,
                student: mockDB.user,
                memories: mockDB.memories.filter(m => m.teacherId === t._id),
                response: mockDB.responses.find(r => r.teacherId === t._id) || null
            }
        }
        return cloud.callFunction('teacherEnter', { token })
    },

    // ---------- 共同回忆 ----------
    async addMemory(data) {
        if (USE_MOCK) {
            await delay()
            const m = {
                _id: 'm_' + Date.now(),
                _openid: uni.getStorageSync('openid'),
                kind: 'shared',
                createdAt: Date.now(),
                ...data
            }
            mockDB.memories.push(m)
            return m
        }
        return cloud.callFunction('addMemory', data)
    },

    async listMemoriesByTeacher(teacherId) {
        if (USE_MOCK) return mockDB.memories.filter(m => m.teacherId === teacherId)
        return cloud.callFunction('listMemoriesByTeacher', { teacherId })
    },

    // ---------- 老师的评价 ----------
    async submitResponse(data) {
        if (USE_MOCK) {
            await delay()
            let r = mockDB.responses.find(x => x.teacherId === data.teacherId)
            if (r) {
                Object.assign(r, { ...data, updatedAt: Date.now() })
            } else {
                r = {
                    _id: 'r_' + Date.now(),
                    teacherId: data.teacherId,
                    studentOpenid: data.studentOpenid,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                    ...data
                }
                mockDB.responses.push(r)
            }
            return r
        }
        return cloud.callFunction('submitResponse', data)
    },

    async listResponses(studentOpenid) {
        if (USE_MOCK) return mockDB.responses
        return cloud.callFunction('listResponses', { studentOpenid })
    }
}
