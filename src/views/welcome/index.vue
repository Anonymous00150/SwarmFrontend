<template>
  <div class="dashboard">
    <h1>数据可视化仪表盘</h1>
    
    <div class="charts-grid">
      <v-chart :option="barOption" class="chart" />
      <v-chart :option="lineOption" class="chart" />
      <v-chart :option="pieOption" class="chart" />
      <v-chart :option="radarOption" class="chart" />
    </div>
  </div>
</template>

<script setup>
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import {
  CanvasRenderer
} from 'echarts/renderers'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import {
  BarChart,
  LineChart,
  PieChart,
  RadarChart
} from 'echarts/charts'

// 注册 ECharts 组件
use([
  CanvasRenderer,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  BarChart,
  LineChart,
  PieChart,
  RadarChart
])

// 图表配置项
const barOption = {
  title: { text: '柱状图 - 销售额' },
  tooltip: {},
  xAxis: { data: ['一月', '二月', '三月', '四月'] },
  yAxis: {},
  series: [{ type: 'bar', data: [120, 200, 150, 80] }]
}

const lineOption = {
  title: { text: '折线图 - 用户增长' },
  tooltip: {},
  xAxis: { data: ['周一', '周二', '周三', '周四'] },
  yAxis: {},
  series: [{ type: 'line', data: [30, 70, 50, 90] }]
}

const pieOption = {
  title: { text: '饼图 - 访问来源', left: 'center' },
  tooltip: { trigger: 'item' },
  legend: { orient: 'vertical', left: 'left' },
  series: [{
    name: '来源',
    type: 'pie',
    radius: '50%',
    data: [
      { value: 1048, name: '搜索引擎' },
      { value: 735, name: '直接访问' },
      { value: 580, name: '邮件营销' },
      { value: 484, name: '联盟广告' },
      { value: 300, name: '视频广告' }
    ]
  }]
}

const radarOption = {
  title: { text: '雷达图 - 能力评估' },
  tooltip: {},
  legend: { data: ['张三'] },
  radar: {
    indicator: [
      { name: '沟通', max: 100 },
      { name: '技术', max: 100 },
      { name: '团队协作', max: 100 },
      { name: '执行力', max: 100 },
      { name: '学习能力', max: 100 }
    ]
  },
  series: [{
    name: '能力图',
    type: 'radar',
    data: [{ value: [90, 80, 85, 70, 95], name: '张三' }]
  }]
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
  font-family: 'Arial', sans-serif;
}
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-top: 20px;
}
.chart {
  width: 100%;
  height: 400px;
  border: 1px solid #eee;
  border-radius: 8px;
}
</style>
