import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [{
        path: '/login',
        name: 'login',
        component: () =>
            import ('@/views/login')
    },
    {
        path: '/',
        component: () =>
            import ('@/views/layout'),
        children: [{
            path: '',
            name: 'Home',
            component: () =>
                import ('@/views/Home')
        }, {
            path: '/qa',
            name: 'qa',
            component: () =>
                import ('@/views/qa')
        }, {
            path: '/video',
            name: 'video',
            component: () =>
                import ('@/views/video')
        }, {
            path: '/my',
            name: 'my',
            component: () =>
                import ('@/views/my')
        }]
    },
    {
        path: '/search',
        name: 'search',
        component: () =>
            import ('@/views/search')
    },
    {
        path: '/article/:articleId',
        name: 'article',
        component: () =>
            import ('@/views/article'),
        // 将路由动态参数映射到组件的 props 中，更推荐这种做法
        props: true
    },
    {
        path: '/userProfile',
        name: 'userProfile',
        component: () =>
            import ('@/views/user-profile'),
    }
]

const router = new VueRouter({
    routes
})

export default router