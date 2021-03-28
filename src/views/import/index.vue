<template>
  <!-- 公共导入组件 -->
  <upload-excel :on-success="success" />
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  name: 'Import',

  data () {
    return {
    }
  },

  methods: {
    async success({ header, results }) {
      const userRelations = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      // 将 数据 [{姓名:'张三',手机号:13199999999},{},{}] => [{username:'张三',mobile:13199999999},{}]
      /* const arr = []
      results.forEach(item => {
        const obj = {}
        for (const key in item) {
          obj[userRelations[key]] = item[key]
        }
        arr.push(obj)
      })
      console.log(arr) */
      const arr = results.map(item => {
        const userinfo = {}
        Object.keys(item).forEach(key => {
          // 处理时间
          if (['timeOfEntry', 'correctionTime'].includes(userRelations[key])) {
            // 后端要求 时间类型对象
            userinfo[userRelations[key]] = new Date(this.formatDate(item[key], '/'))
          } else {
            userinfo[userRelations[key]] = item[key]
          }
        })
        return userinfo
      })
      console.log(arr)
      await importEmployee(arr)
      this.$message.success('导入excel成功')
      this.$router.push(this.$route.query.redirect) // 返回上一个页面
    },
    // excel 日期格式 转数字
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
