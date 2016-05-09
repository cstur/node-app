var _ = require('underscore');
var uaparser = require('ua-parser-js');

function Summary(){
  this.sum={};
  this.sum.PUPV = {
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
        x : 'left',
        data:['Direct','Email','Affiliate','Video Ads','Search']
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
        x : 'left',
        data:['Direct','Email','Affiliate','Video Ads','Search']
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
            center: ['50%', '60%'],
            data:[
                {value:335, name:'Direct'},
                {value:310, name:'Email'},
                {value:234, name:'Affiliate'},
                {value:135, name:'Video Ads'},
                {value:1548, name:'Search'}
            ]
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
      var arrBrowser=_.map(data, function(pv){ 
          var json=JSON.parse(pv.data);
          uaparser.setUA(json.data.agent);
          var result = uaparser.getResult();

          return result.browser; 
      });

      var arrDevice=_.map(data, function(pv){ 
          var json=JSON.parse(pv.data);
          uaparser.setUA(json.data.agent);
          var result = uaparser.getResult();          
          return result.os;
      });

      var groupByBrowser=[];
      groupByBrowser = _.groupBy(arrBrowser, 'name');
      
      _.map(groupByBrowser, function(value,key){ 
          pieDataBrowser.push({name:key,y:value.length});
      });

      this.sum.Browser.series=[{
            name:'Vist source',
            type:'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:groupByBrowser
      }];
      

      return this.sum;
  }
}

module.exports = Summary;
