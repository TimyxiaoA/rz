<template>
  <!-- 雷达图  图表必须给高和宽度-->
  <div ref="myDiv" class="radar-echart" />
</template>

<script>
import * as echarts from 'echarts/core'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components'
import {
  RadarChart
} from 'echarts/charts'
import {
  CanvasRenderer
} from 'echarts/renderers'

echarts.use(
  [TitleComponent, TooltipComponent, LegendComponent, RadarChart, CanvasRenderer]
)
export default {
  name: 'Radar',

  data () {
    return {}
  },
  mounted() {
    var myChart = echarts.init(this.$refs.myDiv)
    var option =
     {
       title: {
         text: '基础雷达图'
       },
       tooltip: {},
       //  legend: {
       //    data: ['张三', '李四']
       //  },
       radar: {
         // shape: 'circle',
         axisName: {

           color: '#fff',
           backgroundColor: '#999',
           borderRadius: 3,
           padding: [3, 5]

         },
         indicator: [
           { name: '工作效率', max: 100 },
           { name: '考勤', max: 100 },
           { name: '积极性', max: 100 },
           { name: '帮助同事', max: 100 },
           { name: '自主学习', max: 100 },
           { name: '正确率', max: 100 }
         ]
       },
       series: [{
         name: '张三 VS 李四',
         type: 'radar',
         // areaStyle: {normal: {}},
         data: [
           {
             value: [10, 1, 100, 5, 100, 0],
             name: '张三'
           },
           {
             value: [50, 50, 50, 50, 50, 10],
             name: '李四'
           }
         ]
       }]
     }

    option && myChart.setOption(option)
  }
}
</script>

<style lang='scss' scoped>
.radar-echart {
    width: 600px;
    height: 400px;
}
</style>
