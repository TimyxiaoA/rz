import Layout from '@/layout'

export default {
  path: '/employees',
  component: Layout,
  meta: { name: 'employees' },
  children: [
    { path: '',
      name: 'employees',
      component: () => import('@/views/employees/index'),
      meta: { title: '员工', icon: 'people' }
    },
    {
      path: 'detail/:id?', // query传参 动态路由传参 加 ? 表示id参数可传可不传
      component: () => import('@/views/employees/detail'),
      hidden: true, // 不在左侧菜单显示
      meta: {
        title: '员工详情' // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
      }
    },
    {
      path: 'print/:id', // 二级默认路由
      component: () => import('@/views/employees/print'), // 按需加载
      hidden: true,
      meta: {
        title: '打印'// 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
      }
    }
  ]
}
