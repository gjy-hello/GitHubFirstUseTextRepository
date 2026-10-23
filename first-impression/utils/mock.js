// Mock 数据 —— 温馨阳光淡淡的生活美学小店风格
// 所有商品、分类、Banner 等假数据

const banners = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=750&h=360&fit=crop',
        title: '阳光午后 · 温柔相待',
        link: '/pages/detail/detail?id=1'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=750&h=360&fit=crop',
        title: '自然之美 · 生活之光',
        link: '/pages/detail/detail?id=2'
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=750&h=360&fit=crop',
        title: '简约好物 · 不期而遇',
        link: '/pages/detail/detail?id=3'
    }
]

const categories = [
    { id: 1, name: '家居好物', icon: '🏡', color: '#FFE0B2' },
    { id: 2, name: '绿植花园', icon: '🌿', color: '#C8E6C9' },
    { id: 3, name: '香氛蜡烛', icon: '🕯️', color: '#FFCCBC' },
    { id: 4, name: '茶具器物', icon: '🍵', color: '#D7CCC8' },
    { id: 5, name: '文创手作', icon: '✏️', color: '#B3E5FC' },
    { id: 6, name: '小装饰品', icon: '🌼', color: '#F8BBD9' }
]

const products = [
    {
        id: 1,
        name: '温柔时光陶瓷马克杯',
        price: 68,
        originalPrice: 98,
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&h=600&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=750&h=750&fit=crop',
            'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=750&h=750&fit=crop'
        ],
        categoryId: 3,
        sales: 1256,
        desc: '手工拉坯陶瓷，手感温润，釉色自然，每一只都是独一无二的存在。'
    },
    {
        id: 2,
        name: '北欧风原木小边桌',
        price: 328,
        originalPrice: 458,
        image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26f?w=600&h=600&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1532372320572-cda25653a26f?w=750&h=750&fit=crop'
        ],
        categoryId: 1,
        sales: 432,
        desc: '天然橡木打造，简约线条，放在沙发旁刚刚好。'
    },
    {
        id: 3,
        name: '向日葵干花束',
        price: 88,
        originalPrice: 128,
        image: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=600&h=600&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=750&h=750&fit=crop'
        ],
        categoryId: 2,
        sales: 2180,
        desc: '向阳而生，一束阳光住进家的每个角落。'
    },
    {
        id: 4,
        name: '大豆蜡香氛蜡烛 · 蜜桃乌龙',
        price: 128,
        originalPrice: 168,
        image: 'https://images.unsplash.com/photo-1602874801007-aa66498dd5c5?w=600&h=600&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1602874801007-aa66498dd5c5?w=750&h=750&fit=crop'
        ],
        categoryId: 3,
        sales: 3421,
        desc: '天然大豆蜡，蜜桃与乌龙的温柔邂逅。'
    },
    {
        id: 5,
        name: '手工皮革笔记本',
        price: 198,
        originalPrice: 258,
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=600&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1544816155-12df9643f363?w=750&h=750&fit=crop'
        ],
        categoryId: 5,
        sales: 876,
        desc: '植鞣革封面，越用越有味道，记录生活的每一笔。'
    },
    {
        id: 6,
        name: '日式粗陶茶碗套装',
        price: 158,
        originalPrice: 228,
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=750&h=750&fit=crop'
        ],
        categoryId: 4,
        sales: 654,
        desc: '质朴粗陶，泡一杯清茶，慢下来的时光。'
    },
    {
        id: 7,
        name: '棉麻抱枕 · 暖阳',
        price: 78,
        originalPrice: 108,
        image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&h=600&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=750&h=750&fit=crop'
        ],
        categoryId: 1,
        sales: 1543,
        desc: '厚实棉麻，温暖色调，沙发上的温柔一角。'
    },
    {
        id: 8,
        name: '小清新玻璃花瓶',
        price: 48,
        originalPrice: 68,
        image: 'https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=600&h=600&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=750&h=750&fit=crop'
        ],
        categoryId: 6,
        sales: 987,
        desc: '通透玻璃，插一枝花，便是一整个春天。'
    },
    {
        id: 9,
        name: '龟背竹盆栽',
        price: 88,
        originalPrice: 118,
        image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&h=600&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=750&h=750&fit=crop'
        ],
        categoryId: 2,
        sales: 1876,
        desc: '好养又好看的网红绿植，为家带来自然气息。'
    },
    {
        id: 10,
        name: '干花押花相框',
        price: 98,
        originalPrice: 138,
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&h=600&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=750&h=750&fit=crop'
        ],
        categoryId: 6,
        sales: 432,
        desc: '把时光装进相框，让美好永远停留。'
    },
    {
        id: 11,
        name: '香片衣橱香氛',
        price: 38,
        originalPrice: 58,
        image: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600&h=600&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=750&h=750&fit=crop'
        ],
        categoryId: 3,
        sales: 5678,
        desc: '每一次打开衣橱，都是温柔的问候。'
    },
    {
        id: 12,
        name: '木质手机支架',
        price: 28,
        originalPrice: 45,
        image: 'https://images.unsplash.com/photo-1580894908361-967195033215?w=600&h=600&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1580894908361-967195033215?w=750&h=750&fit=crop'
        ],
        categoryId: 1,
        sales: 3210,
        desc: '原木质感，追剧看书都方便。'
    }
]

// 接口映射
const mock = {
    '/api/banners': () => banners,

    '/api/categories': () => categories,

    '/api/products': (params) => {
        if (params && params.categoryId) {
            return products.filter(p => p.categoryId === params.categoryId)
        }
        if (params && params.keyword) {
            const kw = params.keyword.toLowerCase()
            return products.filter(p =>
                p.name.toLowerCase().includes(kw) ||
                p.desc.toLowerCase().includes(kw)
            )
        }
        return products
    },

    '/api/product/detail': (params) => {
        return products.find(p => p.id === Number(params.id)) || null
    },

    '/api/user/login': (params) => {
        return {
            token: 'mock_token_' + Date.now(),
            userInfo: {
                nickName: params.nickName || '温柔的你',
                avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
                phone: params.phone || '138****8888'
            }
        }
    },

    '*': () => null
}

export default mock
