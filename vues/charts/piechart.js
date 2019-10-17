(function(){
    let _echartsOptions = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            show: true,
            orient: 'vertical',
            //data: ['A', 'B', 'C', 'D', 'E'],      //!!! should be populated from model
            formatter: '{name}',
            itemWidth: 10,
            itemHeight: 10,
            verticalAlign: 'middle',
            align: 'left',
            x : '50%',
            y : '25%',
        },
        series: [
            {
                //name: 'TEst',                     //!!! should be populated from model
                type: 'pie',
                center: ['80', '50%'],
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: true,
                        position: 'center',
                        rich: {
                            totalCount: {
                                color: '#323759',
                                fontSize: 32,
                                fontWeight: 'normal'
                            },
                            caption: {
                                color: '#323759',
                                top:10,
                                fontSize: 14,
                                fontWeight: 'normal'
                            }
                        }
                    },
                    emphasis: {
                        show: false,
                        textStyle: {
                            fontSize: '15',
                            fontWeight: 'bold'
                        },
                        //formatter: "{d}%\n__CAPTION_TOTAL__: __TOTAL__"     //!!! should replace the placeholders (caption_total, total) with actual values
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: [
                    /*
                    { value: 335, name: 'A' },
                    { value: 310, name: 'B' },
                    { value: 234, name: 'C' },
                    { value: 135, name: 'D' },
                    { value: 1548, name: 'E' }
                    */
                ]
            }
        ],
        color: ['#F47373', '#7290F2', '#24CCB8', '#8D7CED', '#F49256', '#F4C36F',  '#CED2EB', '#E8EAF6']
    };

    /*
        model = {
            'A': valueA,
            'B': valueB,
            ...
        }
        viewModel = {

        }
     */
    let _makeChartOptions = function(model, viewModel, locale){
        let chartdata = [];
        let legends = [];
        let values = [];
        let total = null;

        let opts = {};

        if (true !== wna.IsNullOrEmpty(model)){
            values = _.values(model);
            legends = _.keys(model);

            total = _.sum(values);
        }

        opts = _.merge({}, _echartsOptions, {
            legend: {
                data: legends
            }
        });

        _.merge(opts.series[0], {
            name: locale.title,
            label: {
                /*
                emphasis: {
                    formatter: "{d}%\n" + locale.total + ":" + total
                }
                */
               normal: {
                   formatter: "{totalCount|" + total + "}\n{caption|" + locale.total + "}"
               }
            },
            data: _.map(legends, (n, i) => {
                return {name: n, value: values[i]};
            })
        });
        //console.log('-------------------- pie chart options: ', opts);

        return opts;
    };

    Vue.component('vc-pie-chart', {
        template: `
        <div>
            <div class="chartbox">
                <div class="charttitle">
                    <h3>{{locale.title}}</h3>
                </div>
                <div class="chart-pie">
                    <span v-if="(true === wna.IsNullOrEmpty(model))">{{locale.common.empty}}</span>
                    <div class="piebox" ref="piebox">
                    </div>
                </div>
            </div>								
        </div>
        `,
        props: ['model', 'viewModel', 'locale'],
        data: function(){
            return {
                viewState: {
                    pieChart: null
                }
            };
        },
        watch: {
            'model': {
                deep: true,
                handler: function(){
                    let thisvue = this;
                    if (true !== wna.IsNullOrUndefined(thisvue.viewState.pieChart)){
                        let chartopts = _makeChartOptions(thisvue.model, thisvue.viewModel, thisvue.locale);
                        thisvue.viewState.pieChart.setOption(chartopts, true);
                    }
                }
            }
        },
        mounted: function(){
            let thisvue = this;
                        
            let piechart = echarts.init(thisvue.$refs.piebox);
            let chartopts = _makeChartOptions(thisvue.model, thisvue.viewModel, thisvue.locale);
            //console.log('-------------------- pie chart options: ', chartopts, thisvue.model);

            piechart.setOption(chartopts);
            thisvue.viewState.pieChart = piechart;

            $(window).resize(function () {
                piechart.resize();
            });
        }

    });
})();