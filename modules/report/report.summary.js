var _ = require('underscore');
var uaparser = require('ua-parser-js');

function Summary(){
  this.gSum={};
  this.gSum.guanggao = {
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
  };


  this.sum={};
  this.sum.PVUV = {
      tooltip : {
          trigger: 'axis'
      },
      legend: {
          data:['PV','UV']
      },
      toolbox: {
          show : true,
          feature : {
              restore : {show: true, title: "restore"},
              saveAsImage : {show: true, title: "save as image"}
          }
      },
      calculable : true,
      xAxis : [
          {
              type : 'category',
              boundaryGap : false
          }
      ],
      yAxis : [
          {
              type : 'value',
              axisLabel : {
                  formatter: '{value}'
              }
          }
      ]
  };

  this.sum.Click = {
      tooltip : {
          trigger: 'axis'
      },
      legend: {
          data:['PV','UV']
      },
      toolbox: {
          show : true,
          feature : {
              restore : {show: true, title: "restore"},
              saveAsImage : {show: true, title: "save as image"}
          }
      },
      calculable : true,
      xAxis : [
          {
              type : 'category',
              boundaryGap : false
          }
      ],
      yAxis : [
          {
              type : 'value',
              axisLabel : {
                  formatter: '{value}'
              }
          }
      ]
  };

  this.sum.Browser = {
    title : {
        text: '浏览器分布',
        x:'center'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient : 'vertical',
        x : 'left'
    },
    toolbox: {
        show : true,
        feature : {
            restore : {show: true, title: "restore"},
            saveAsImage : {show: true, title: "save as image"}
        }
    },
    calculable : true
  };

  this.sum.Device = {
    title : {
        text: '设备分布',
        x:'center'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient : 'vertical',
        x : 'left'
    },
    toolbox: {
        show : true,
        feature : {
            restore : {show: true, title: "restore"},
            saveAsImage : {show: true, title: "save as image"}
        }
    },
    calculable : true,
    series : [
        {
            name:'Vist source',
            type:'pie',
            radius : '55%',
            center: ['50%', '60%']
        }
    ]
  };
}

Summary.prototype={
  getDataGroups : function(data,model){
      var dateGroups = _.chain(data)
      .groupBy(function(obj) { 
          var d= new Date(obj.updatedAt);

          if (model=='Month') {
              return d.getMonth()+'月'+d.getDate()+'日'; 
          }
          if (model=='Year') {
              return d.getFullYear()+'年'+d.getMonth()+'月';
          }
          return d.getDate()+'日'+d.getHours()+'时'; 
      })
      .value();
      return dateGroups;
  },

  getOptionGuangGao : function(data,addDoc){
    var r={};
    r.guanggao = {
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
    };
    /*
    if (addDoc==1) {
      r.doc=data;
    }
    */
    
    var dateGroups = _.chain(data)
      .groupBy(function(obj) {           
          var json = JSON.parse(obj.data);
          return json.target.title; 
      })
      .value();

    //delete dateGroups.undefined;
    var keys=Object.keys(dateGroups);
    var yobj={
        type: 'category'
    }
    yobj.data=keys;
    r.guanggao.yAxis=yobj;
    var chartData=[];
    _.each(dateGroups, function(value, key) {
        var clickCount = value.length;
        chartData.push(clickCount);
    });
    var sum={
      name: '总点击量',
      type: 'bar'
    };
    sum.data=chartData;

    var uniqueList = _.uniq(data, function(item, key, a) { 
        var json=JSON.parse(item.data);
        if (json.target) {
          return json.target.uid; 
        }
    });   
    var dateGroupsUserSum = _.chain(uniqueList)
      .groupBy(function(obj) { 
          var json = JSON.parse(obj.data);
          return json.target.title; 
      })
      .value();
    //delete dateGroupsUserSum.undefined;
    var chartDataUserSum=[];
    _.each(dateGroupsUserSum, function(value, key) {
        var clickCount = value.length;
        chartDataUserSum.push(clickCount);
    });
    var userSum={
        name: '用户点击量',
        type: 'bar'
    };
    userSum.data=chartDataUserSum;
    r.guanggao.series=[sum,userSum];
    
    return r;
  },
  getOption : function(data){
      var model="day";

      var dateGroups = this.getDataGroups(data,model);

      var chartData=[];
      _.each(dateGroups, function(value, key) {
          var pvCount = value.length;
          chartData.push(pvCount);
      });
      
      var keys=Object.keys(dateGroups);
      var xobj={
              type : 'category',
              boundaryGap : false
      };
      xobj.data=keys;
      this.sum.PVUV.xAxis=[xobj];
      var pv= {
          name:'PV',
          type:'line',
          markPoint : {
              data : [
                  {type : 'max', name: 'Max'},
                  {type : 'min', name: 'Min'}
              ]
          },
          markLine : {
              data : [
                  {type : 'average', name: 'Average'}
              ]
          }
      };
      pv.data=chartData;
      console.log(chartData);
      var uv = {
        name:'UV',
        type:'line',
        markPoint : {
            data : [
                {name : 'Lowest', value : -2, xAxis: 1, yAxis: -1.5}
            ]
        },
        markLine : {
            data : [
                {type : 'average', name : 'Average'}
            ]
        }
      }

      var uniqueList = _.uniq(data, function(item, key, a) { 
          var json=JSON.parse(item.data);
          return json.data.uid;
      });   
      var dateGroupsUV = this.getDataGroups(uniqueList,model);

      var chartDataUV=[];
      _.each(dateGroupsUV, function(value, key) {
          var pvCount = value.length;
          chartDataUV.push(pvCount);
      });
      uv.data=chartDataUV;
      console.log(chartDataUV);
      this.sum.PVUV.series=[pv,uv];


      /* Pie */
      var pieDataBrowser=[];
      var pieDataDevice=[];

      var arrBrowser=_.map(data, function(pv){ 
          var json=JSON.parse(pv.data);
          var ua = uaparser(json.data.agent);
          return ua.browser; 
      });

      var arrDevice=_.map(data, function(pv){ 
          var json=JSON.parse(pv.data);
          var ua = uaparser(json.data.agent);   
          return ua.os;
      });

      var groupByBrowser=[];
      groupByBrowser = _.groupBy(arrBrowser, 'name');
      var groupByDevice=[];
      groupByDevice = _.groupBy(arrDevice, 'name');

      var browsersLegend=[];
      _.map(groupByBrowser, function(value,key){ 
          browsersLegend.push(key);
          pieDataBrowser.push({name:key,value:value.length});
      });
      this.sum.Browser.legend.data=Object.keys(groupByBrowser);

      var deviceLegend=[];
      _.map(groupByDevice, function(value,key){ 
          deviceLegend.push(key);
          pieDataDevice.push({name:key,value:value.length});
      });
      this.sum.Device.legend.data=Object.keys(groupByDevice);

      this.sum.Browser.series=[{
            name:'Vist source',
            type:'pie',
            radius : '55%',
            data:pieDataBrowser
      }];
      this.sum.Device.series=[{
            name:'Vist source',
            type:'pie',
            radius : '55%',
            data:pieDataDevice
      }];

      return this.sum;
  }
}

module.exports = Summary;
