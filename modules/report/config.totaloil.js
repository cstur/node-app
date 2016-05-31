module.exports ={
    title: {
        text: '加油管理'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data:['PV','UV']
    },
    toolbox: {
        show: true,
        feature: {
            dataZoom: {},
            dataView: {readOnly: false},
            magicType: {type: ['line', 'bar']},
            restore: {},
            saveAsImage: {}
        }
    },
    yAxis: {
        type: 'value'
    }
}