var _ = require('underscore');

function Summary(){
  this.PVUV={};
  this.PVUV.options = {
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
      this.PVUV.options.xAxis=[xobj];
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
      this.PVUV.options.series=[pv,uv];
      return this.PVUV.options;
  }
}

module.exports = Summary;
