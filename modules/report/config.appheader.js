module.exports = {
      title: {
          text: '首页广告点击量',
      },
      tooltip: {
          trigger: 'axis',
          axisPointer: {
              type: 'shadow'
          }
      },
      legend: {
          data: ['总点击量', '用户点击量']
      },
      grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
      },
      xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
      }
    }