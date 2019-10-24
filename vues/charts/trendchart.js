(function(){

    let _echartsOptions = {
        //color: ['#3398DB'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '10px',
            right: '20px',
            bottom: '10px',
            containLabel: true
        },
        xAxis: [
            {
                type: 'time',                     //!!! may be configured via viewModel
                boundaryGap: [0.1,0.1],  
                minInterval: 3600 * 24 * 1000 ,                
                axisLabel: {
                    color: 'rgba(51,51,51,.4)',
                    formatter: function(val,idx) {
                        // if(idx===0) return '';
                        return moment(val).format("YYYY")+'\n'+moment(val).format("MM-DD");
                    } 
                },
                axisTick: {
                    show: false,
                    alignWithLabel: true
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#EAEAEA'
                    }
                },
                splitLine: {show:false},
                min: function(value) {
                    return value.min - (3600 * 24 * 1000);
                },
                max: function(value) {
                    return value.max + (3600 * 24 * 1000);
                }
                //data: ['京东', '考拉', '淘宝', '天猫'],       //!!! should be loaded from model
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    color: 'rgba(51,51,51,.4)',
                },
                axisTick: {
                    show: true
                },
                splitLine: {show:true},
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#EAEAEA',
                    }
                }
            }
        ],
        series: [                           //!!! should be loaded from model
            /* 
            {
                name: '低',
                type: 'bar',
                barWidth: '10%',
                data: [10, 52, 200, 334],
            },
            {
                name: '中',
                type: 'bar',
                barWidth: '10%',
                data: [10, 52, 200, 334],
            },
            {
                name: '中高',
                type: 'bar',
                barWidth: '10%',
                data: [10, 52, 200, 334],
            },
            {
                name: '高',
                type: 'bar',
                barGap: '100%',
                barWidth: '10%',
                data: [30, 72, 230, 334],
            }
            */
        ],
        color: ['#C7CBE8', '#7290F2', '#24CCB8', '#F47373']
        //color: ['#7290F2', '#F47373', '#7290F2', '#F49256', '#F4C36F', '#8D7CED', '#CED2EB', '#D9D9D9']
    };

    /*
        model: {
            categories: ['JD', 'TB', ...],
            series: [
                {
                    name: '低',
                    data: []
                },
                {
                    name: '中',
                    data: []
                }
            ]
        }
     */
    let _makeChartOptions = function(model, viewModel, locale){
        let legends = [];
        let series = [];
        let xData = [];
        let opts = {};

        if (true !== wna.IsNullOrEmpty(model)){
            xData = model.x;
            series = _.map(model.series, (val) => {
                legends.push(val.name);
                return _.merge(val, {
                    type: 'bar',
                    barGap: '50%',
                    barWidth: '20%',
                });
            });
        }
        // category case:设计稿中模块为共享，但源码及后端数据为不同模块图表，这里进行了强行条件判断！！！！注意
        if(xData) {
            // for counterfeitStore trendchart
            _echartsOptions.xAxis = {};
            opts = _.merge(opts, _echartsOptions, {
                xAxis: {
                        type: 'category',                     //!!! may be configured via viewModel              
                        axisLabel: {
                            color: 'rgba(51,51,51,.4)',
                            // formatter: function(val,idx) {
                            //     // if(idx===0) return '';
                            //     return moment(val).format("YYYY")+'\n'+moment(val).format("MM-DD");
                            // } 
                        },
                        axisTick: {
                            show: true,
                            alignWithLabel: true
                        },
                        axisLine: {
                            show: false,
                            lineStyle: {
                                color: '#EAEAEA'
                            }
                        },
                        splitLine: {show:false},

                        data: xData,       //!!! should be loaded from model
                    },
                series: series,
                legend: {
                }
            });
        }else{
            // for counterfeitProduct trendchart
            opts = _.merge(opts, _echartsOptions, {
                series: series,
                legend: {
                    data: legends,
                    itemWidth: 10,
                    itemHeight: 10,
                    left: 'left'
                }
            });
            opts.xAxis[0].data = (true !== wna.IsNullOrEmpty(model)) ? model.categories : [];
        }
        

        console.log('-------------important')
        console.log(model)

        return opts;
    };

    /*
        model = {
            x: [], //will be copied to opts.xAxis.data,
            series: [
                {
                    color: '',
                    name: 'Apple',
                    data: []
                },
                {
                    color: '',
                    name: 'Banana',
                    data: []
                }
            ]
        }

        viewModel = {
            xAxis: {
                type: 'category',
                boundaryGap: false,
            },
            yAxis: {
                type: 'value',
            }
        }
     */
    Vue.component('vc-trend-chart', {
        template: `
        <div>
            <div class="chartbox">
                <div class="charttitle">
                    <h3>{{locale.title}}</h3>
                </div>
                <div class="chart-trend">
                    <!--
                    <div class="trendbox" ref="trendbox" v-if="(true !== wna.IsNullOrEmpty(model))"></div>
                    <span v-if="(true === wna.IsNullOrEmpty(model))">{{locale.common.empty}}</span>
                    //-->
                    <div class="trendbox" ref="trendbox">
                        <span v-if="(true === wna.IsNullOrEmpty(model))">{{locale.common.empty}}</span>
                    </div>
                </div>
            </div>
        </div>
        `,
        props: ['model', 'viewModel', 'locale'],
        data: function(){
            return {
                viewState: {
                    trendChart: null
                }
            };
        },
        watch: {
            'model': {
                deep: true,
                handler: function(){
                    let thisvue = this;
                    let chartopts = _makeChartOptions(thisvue.model, thisvue.viewModel, thisvue.locale);
                    thisvue.viewState.trendChart.setOption(chartopts, true);
                }
            }
        },
        mounted: function(){
            let thisvue = this;
            console.log('-------- trend-chart mounted');

            /*
            if (true === wna.IsNullOrEmpty(thisvue.model)){
                return;
            }
            */
            let trendchart = echarts.init(thisvue.$refs.trendbox);

            let chartopts = _makeChartOptions(thisvue.model, thisvue.viewModel, thisvue.locale);
            trendchart.setOption(chartopts);

            thisvue.viewState.trendChart = trendchart;
            
            $(window).resize(function () {
                trendchart.resize();
            });
        },
        beforeMount: function(){
            
        },
        updated: function(){
        },

    });
})();