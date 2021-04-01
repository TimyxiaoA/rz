import Layout from '@/layout'

export default {
  path: '/settings',
  component: Layout,
  meta: { name: 'settings' },
  children: [
    { path: '',
      component: () => import('@/views/setting/index'),
      meta: { title: '公司设置', icon: 'setting' }
    }
  ]
}
