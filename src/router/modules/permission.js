import Layout from '@/layout'

export default {
  path: '/permissions',
  component: Layout,
  meta: { name: 'permissions' },
  children: [
    { path: '',
      component: () => import('@/views/permission/index'),
      meta: { title: '权限管理', icon: 'lock' }
    }
  ]
}
