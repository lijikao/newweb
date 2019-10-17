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
                type: 'category',                     //!!! may be configured via viewModel
                //boundaryGap: false,                   
                axisLabel: {
                    color: 'rgba(51,51,51,.4)',
                },
                axisTick: {
                    //show: false,
                    alignWithLabel: true
                },
                axisLine: {
                    lineStyle: {
                        color: '#EAEAEA'
                    }
                },
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
                    show: false
                },
                axisLine: {
                    show: false,
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
        let opts = {};

        if (true !== wna.IsNullOrEmpty(model)){
            series = _.map(model.series, (val) => {
                legends.push(val.name);
                return _.merge(val, {
                    type: 'bar',
                    barGap: '100%',
                    barWidth: '10%',
                });
            });
        }

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
        return opts;
    };

    Vue.component('vc-bar-chart', {
        template: `
        <div>
            <div class="chartbox">
                <div class="charttitle">
                    <h3>{{locale.title}}</h3>
                </div>
                <div class="chart-bar">
                    <div v-if="(true === wna.IsNullOrEmpty(model))">{{locale.common.empty}}</div>
                    <div class="barbox" ref="barbox""></div>
                </div>
            </div>
        </div>
        `,
        props: ['model', 'viewModel', 'locale'],
        data: function(){
            return {
                viewState: {
                    barChart: null
                }
            };
        },
        watch: {
            'model': {
                deep: true,
                handler: function(){
                    let thisvue = this;
                    if (true !== wna.IsNullOrUndefined(thisvue.viewState.barChart)){
                        let chartopts = _makeChartOptions(thisvue.model, thisvue.viewModel, thisvue.locale);
                        thisvue.viewState.barChart.setOption(chartopts, true);
                    }
                }
            }
        },
        mounted: function(){
            let thisvue = this;
            let barchart = echarts.init(thisvue.$refs.barbox);

            let chartopts = _makeChartOptions(thisvue.model, thisvue.viewModel, thisvue.locale);
            //console.log('-------------------- bar chart options: ', chartopts, thisvue.model);
            barchart.setOption(chartopts);

            thisvue.viewState.barChart = barchart;

            $(window).resize(function () {
                barchart.resize();
            });
        }
    });
})();