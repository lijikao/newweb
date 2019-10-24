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
        opts = _.merge(opts, _echartsOptions, {
            series: series,
            legend: {
                data: legends,
                itemWidth: 10,
                itemHeight: 10,
                left: 'left'
            }
        });

        console.log('-------------important')
        console.log(model)

        opts.xAxis[0].data = (true !== wna.IsNullOrEmpty(model)) ? model.categories : [];
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
var Helpers = (function (){
    return {
        toDateTimeString: function(value){
            return (true !== wna.IsNullOrEmpty(value)) ? moment(value).utc().format('YYYY/MM/DD HH:mm:ss') : value;
        }
    }    
})();

/*
 *  model = [
        {
            id: null //or the the unique id within the entire tree of the instance
            title: {
                cn: '选项',
                en: 'item',
                zh: '選項'
            },
            target: null //or the id of the associated action
            submenu: [
                //list of sidemenu model
            ]
        }
    ]
 */
(function(){
    Vue.component('vc-vertmenu', {
        template: `
            <ul v-if="(true !== wna.IsNullOrEmpty(model))">
                <li v-for="en in model">
                    <span class="sidebar-icon" v-bind:class="en.id" v-if="(true === wna.IsNullOrUndefined(en.target))">{{locale[en.id]}}</span>
                    <router-link class="sidebar-icon" v-bind:class="en.id" v-bind:to="'/' + en.target" v-if="(true === wna.IsNullOrEmpty(en.submenu)) &&  (true !== wna.IsNullOrUndefined(en.target))">{{locale[en.id]}}</router-link>
                    <vc-vertmenu v-if="(true !== wna.IsNullOrEmpty(en.submenu))" :model="en.submenu" :locale="locale"></vc-vertmenu>
                </li>
            </ul>
        `,
        props: ['model', 'locale']
    });
})();
(function() {
  Vue.component("vc-tablix", {
    template: `
          <div style="position:relative;">
            <div class="table-loader" v-if="viewModel.tableLoading">
              <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            </div>
            <table :id="id" class="table table-striped" v-if="true !== wna.IsNullOrEmpty(viewModel.cols)">
                <thead>
                    <tr>
                        <td v-if="true === viewModel.multiselect">
                            <!--
                            <input type="checkbox" ref="checkall" :id="'tablix_checkall_' + id" v-on:change="onCheckAllChange" /><label :for="'tablix_checkall_' + id">&nbsp;</label>
                            //-->
                        </td>
                        <td v-for="c in viewModel.cols" v-if="(true === viewModel.shouldActivateCols(c))" v-on:click="onSort(c.fieldid)"><span>{{locale.fields[c.fieldid]}}</span><div class="sortable-col-head-icon">&nbsp;</div></td>
                    </tr>
                </thead>
                <tbody id="" v-if="(true !== wna.IsNullOrEmpty(model))">
                    <tr v-for="(r, i) in sortedModel">
                    <!-- //-->
                        <td v-if="true === viewModel.multiselect"><input type="checkbox"  
                         :ref="rowId(i)" :id="rowId(i)" :value="r[viewModel.primaryKey]" v-bind:disabled="r['Feedback']==1" v-model="viewState.selectedRows" ><label :for="rowId(i)">&nbsp;</label></td>
                        <td v-for="c in viewModel.cols" v-if="(true === viewModel.shouldActivateCols(c))" v-html="(true === wna.IsFunction(c.transform)) ? (c.transform(r[c.fieldid], r)) : (r[c.fieldid])"></td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td :colspan="((true === viewModel.selectable) || (true === viewModel.multiselect)) ? viewModel.cols.length + 1: viewModel.cols.length">
                            <div>
                                <div class="total">{{locale.total_head}} {{ (true !== wna.IsNullOrEmpty(model.info)) ? model.info.countNum : '0' }} {{locale.total_tail}}</div>
                                <div class="paginator" v-if="(true !== wna.IsNullOrUndefined(viewState.totalPages)) && (viewState.totalPages > 1)">
                                    <button name="pagefrst" v-on:click="onPageChange(0)"></button>
                                    <button name="pageprev" v-on:click="onPageChange(null, -1)"></button>
                                    <button name="pagejump" v-on:click="onPageChange(j)" v-for="j in pageJumps" :disabled="(true === wna.IsNullOrUndefined(j))" v-bind:class="[(j === viewState.currentPage) ? 'active' : '']">{{ (true !== wna.IsNullOrUndefined(j)) ? (j + 1) : '...'}}</button> 
                                    <button name="pagenext" v-on:click="onPageChange(null, 1)"></button>
                                    <button name="pagelast" v-on:click="onPageChange(viewState.totalPages-1)"></button>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
          </div>
        `,
    props: ["id", "model", "viewModel", "locale", "lang"],
    data: function() {
      return {
        viewState: {
          selectedRows: [],
          currentPage: null,
          totalPages: 0,
          needSort: false,
          sorting: []
        },
      };
    },
    watch: {
      model: {
        deep: true,
        handler: function() {
          let thisvue = this;
          let vwstate = thisvue.viewState;
          let vwmodel = thisvue.viewModel;
          let data = thisvue.model;
            console.log(111,data,000)
          if (true !== wna.IsNullOrUndefined(vwmodel.rowsPerPage)) {
            if (true === wna.IsNullOrEmpty(data)) {
              thisvue.viewState.totalPages = 0;
              thisvue.viewState.currentPage = null;
            } else {
              thisvue.viewState.totalPages = Math.ceil(
                data.info.countNum / vwmodel.rowsPerPage
              );
              // 前任坑：page 显示的是从0开始，但请求时需加一以页码为准
              thisvue.viewState.currentPage = data.info.page-1;
            }
            console.log(
              "###--- Tablix beforeUpdate: re-calculate pagination : ",
              vwstate.currentPage,
              vwstate.totalPages
            );
          }

          //new data comes, reset the sorting
          if (true !== wna.IsNullOrEmpty(vwstate.sorting)) {
            vwstate.sorting.length = 0;
          }
          vwstate.needSort = true;
        }
      }
    },
    computed: {
      sortedModel: function() {
        let thisvue = this;
        let vwstate = thisvue.viewState;
        let vwmodel = thisvue.viewModel;
        let data = thisvue.model.data;
        console.log("table tableview")
        console.log(data)
        if (true === vwstate.needSort) {
          if (true !== wna.IsNullOrEmpty(vwstate.sorting)) {
            let sort_fields = _.map(vwstate.sorting, "fieldid");
            let sort_orders = _.map(vwstate.sorting, "order");

            _.reverse(sort_fields);
            _.reverse(sort_orders);

            //console.log('-------- sorting: ', sort_fields, sort_orders);
            data = _.orderBy(data, sort_fields, sort_orders);
            console.log(
              "###--- Tablix beforeUpdate: sorting by : ",
              vwstate.sorting
            );
          } else {
            data = _.orderBy(data, [vwmodel.primaryKey], ["desc"]);
          }

          // vwstate.currentPage = 0;
          vwstate.needSort = false;
        }
        console.log(999,data)
        return data;
      },
      // pageStartIndex: function() {
      //   let thisvue = this;
      //   let vwstate = thisvue.viewState;
      //   let vwmodel = thisvue.viewModel;

      //   if (vwstate.totalPages > 1) {
      //     let ret = vwstate.currentPage * vwmodel.rowsPerPage;
      //     console.log("------ pageStartIndex: ", ret);
      //     return ret;
      //   }
      //   return 0;
      // },
      // pageEndIndex: function() {
      //   let thisvue = this;
      //   let vwstate = thisvue.viewState;
      //   let vwmodel = thisvue.viewModel;

      //   if (vwstate.totalPages > 1) {
      //     let ret = (vwstate.currentPage + 1) * vwmodel.rowsPerPage;
      //     console.log("------ pageEndIndex: ", ret);
      //     return ret;
      //   }
      //   return (thisvue.sortedModel || []).length;
      // },
      lastPageStartIndex: function() {
        let thisvue = this;
        let vwstate = thisvue.viewState;
        let vwmodel = thisvue.viewModel;

        if (vwstate.totalPages > 1) {
          let ret = (vwstate.totalPages - 1) * vwmodel.rowsPerPage;
          console.log("------ lastPageStartIndex: ", ret);
          return ret;
        }
        return 0;
      },
      pageJumps: function() {
        // todo: 改写成为用总数除一页个数，然后当前页码
        let thisvue = this;
        let vwstate = thisvue.viewState;
        let ret;

        do {
          if (vwstate.totalPages > 5) {
            if (vwstate.currentPage >= vwstate.totalPages - 3) {
              ret = [
                0,
                undefined,
                vwstate.totalPages - 3,
                vwstate.totalPages - 2,
                vwstate.totalPages - 1
              ];
              break;
            } else {
              if (vwstate.currentPage > 0) {
                ret = [
                  vwstate.currentPage - 1,
                  vwstate.currentPage,
                  vwstate.currentPage + 1,
                  undefined,
                  vwstate.totalPages - 1
                ];
              } else {
                ret = [
                  vwstate.currentPage,
                  vwstate.currentPage + 1,
                  vwstate.currentPage + 2,
                  undefined,
                  vwstate.totalPages - 1
                ];
              }
              break;
            }
          } else {
            //##2019.07.31 - fixes the bug if the number of total pages is less than 5 but the page jumps show 5 pages
            ret = _.times(thisvue.viewState.totalPages, i => i);
            break;
          }
        } while (false);

        console.log("------ page jumps: ", ret);
        return ret;
      }
    },
    //### Methods
    methods: {
      rowId: function(i) {
        return "tr_" + this.id + "_" + i;
      },
      onSort: function(fieldid) {
        let thisvue = this;
        let vwstate = thisvue.viewState;

        /*
                 sorting : [
                     {
                         'fieldid': 'fieldid1',
                         'order': 'desc' //or 'asc'
                     },
                     ...
                 }
                 */
        let sort = _.remove(vwstate.sorting, { fieldid: fieldid });
        if (true !== wna.IsNullOrEmpty(sort)) {
          sort = sort[0];
          sort.order = "desc" === sort.order ? "asc" : "desc";
        } else {
          sort = {
            fieldid: fieldid,
            order: "desc"
          };
        }

        vwstate.sorting.push(sort);
        vwstate.needSort = true;
      },
      onPageChange: function(index, incr) {
        let thisvue = this;
        let vwstate = thisvue.viewState;

        if (
          true !== wna.IsNullOrUndefined(index) &&
          true === wna.IsNumber(index)
        ) {
          if (index >= 0 && index < vwstate.totalPages) {
            vwstate.currentPage = index;
          }
        } else {
          if (
            true !== wna.IsNullOrUndefined(incr) &&
            true === wna.IsNumber(incr)
          ) {
            let target_page = vwstate.currentPage + incr;
            vwstate.currentPage =
              target_page < 0
                ? 0
                : target_page >= vwstate.totalPages
                ? vwstate.totalPages - 1
                : target_page;
          }
        }
        // emit event to request new model
        this.$emit('tableviewModelChange', {
          page: vwstate.currentPage+1,
        })
        //reset the row selection after page change
        vwstate.selectedRows.length = 0;

        //console.log('----- onPageChange : ', index, incr);
      },
      getCurrentSelectedRows: function() {
        let thisvue = this;
        return _.clone(thisvue.viewState.selectedRows);
      }
    },
    //### Lifecycle Hooks
    mounted: function() {},
    beforeUpdate: function() {}
  });
})();

(function(){
    Vue.component('vc-tablix-with-tools', {
        template: `
            <div :id="id">
                <div class="tabletools">
                    <div class="filtertools" v-if="(true !== wna.IsNullOrEmpty(viewModel.filters))">
                        <div class="toolsgroup" v-for="f in viewModel.filters" >
                            <label>{{locale.fields[f.fieldid]}}</label>
                            <select :name="f.fieldid" 
                                v-on:change="onFilterChange($event, f.fieldid)">
                                <option value=''>{{locale.common.option_all}}</option>
                                <option v-for="o in f.options" v-if="(true !== wna.IsNullOrEmpty(o))" :value="o.value">{{o.name}}</option>
                            </select>							
                        </div>
                    </div>
                    <div class="toolsgroup buttongroup">
                        <!--
                        <button type="button" v-for="b in viewModel.buttons" v-bind:value="b.id" v-on:click="onButtonClick" v-bind:class="[((true === wna.IsNullOrEmpty(b.classes)) ? '' : b.classes)]">{{locale.buttons[b.id]}}</button>
                        -->
                        <!-- removed from button declaration: v-if="(true === wna.IsNullOrUndefined(b.visibleInTabs)) || (_.includes(b.visibleInTabs, viewState.selectedTab))" //-->
                        <!-- removed from button declaration:  //-->
                        <button type="button" v-for="b in viewModel.buttons" 
                            v-bind:data-toggle="(true !== wna.IsNullOrEmpty(b.toggleModal)) ? 'modal' : ''"
                            v-bind:data-target="(true !== wna.IsNullOrEmpty(b.toggleModal)) ? b.toggleModal : ''"
                            v-bind:value="b.id" v-bind:class="['btn', ((true === wna.IsNullOrEmpty(b.classes)) ? '' : b.classes)]" 
                            v-on:click="onButtonClick($event, b.callback)"
                            v-if="(true === viewModel.shouldActivateButton(b))"><img v-if="true !== wna.IsNullOrEmpty(b.icon)" :src="b.icon" />{{locale.buttons[b.id]}}</button>
                    </div>	
                    <div class="toolsgroup searchgroup" v-if="(true === wna.IsFunction(viewModel.search))">
                        <input type="text" v-model="viewState.searchNeedle" v-bind:placeholder="locale.common.search">
                        <button type="button" v-on:click="onSearch()" class="btn btn-red">{{locale.common.search}}</button>
                    </div>	
                </div><!--tabletools-->
                <div class="tablecontetnt table-responsive">
                    <vc-tablix ref="tablix" :id="'tablix_core__' + id" :model="model" :view-model="viewModel" :locale="locale" :lang="lang" 
                        @tableviewModelChange="(query,opt)=> $emit('tableviewModelChange',query,opt)"></vc-tablix>
                </div>
            </div>
        `,
        props: ['id', 'model', 'viewModel', 'locale', 'lang'],
        data: function(){
            return {
                viewState: {
                    shouldUpdateActiveModel: false,
                    searchNeedle: '',
                    filters: {}
                }
            };
        },
        watch: {
        },
        computed: {
            // 原数据过滤函数
            // activeModel: function(){
            //     //activeModel represents the current displayed data which is filtered from the original model
            //     let thisvue = this;
            //     let vwstate = thisvue.viewState;
            //     let vwmodel = thisvue.viewModel;

            //     let needle = vwstate.searchNeedle;
            //     let ret = thisvue.model;
                
            //     //console.log('###--- Tablix beforeUpdate: re-calculate pagination : ', vwstate.currentPage, vwstate.totalPages);
            //     //console.log('------ computing activeModel 1: ', thisvue.viewState.selectedTab, ret, this.viewState.filters[thisvue.viewState.selectedTab]);

            //     console.log('------------ re-compute activeModel...');

            //     if (true === vwstate.shouldUpdateActiveModel){
            //         if (true !== wna.IsNullOrEmpty(ret)){
            //             if (true !== wna.IsNullOrEmpty(vwstate.filters)){
            //                 let filters = {};
            //                 _.each(vwstate.filters, function(val, key){
            //                     if ('-------' !== val){
            //                         filters[key] = val;
            //                     }
            //                 });

            //                 ret = _.filter(ret, filters);
            //                 filters = null;
            //             }
            //         }

            //         if ((true !== wna.IsNullOrEmpty(needle)) && (true === wna.IsFunction(vwmodel.search))){
            //             ret = vwmodel.search(needle, ret);
            //         }

            //         vwstate.shouldUpdateActiveModel = false;
            //     }
                
            //     return ret;
            // },
        },
        //### Methods
        methods: {
            onFilterChange: function (ev, fieldid) {
                let thisvue = this;
                let vwstate = thisvue.viewState;
                let fieldValue = ev.target.value;
                //let filtersForCurrentTab = vwstate.filters[vwstate.selectedTab];
                this.$emit('tableviewModelChange',{
                    // condition is for the "低风险" format： 1. number 2. "" empty 3. "中文"
                    [this.mapFieldToRequestField(fieldid)]:Number.isNaN(Number.parseInt(fieldValue))&&fieldValue!=""?`\"${fieldValue}\"`:fieldValue
                });
            },
            onButtonClick: function (ev, callback) {
                //console.log('###-- Tablix-with-tools: onButtonClick: ', $(ev.target), $(ev.target).attr('data-toggle'), wna.IsNullOrEmpty($(ev.target).attr('data-toggle')));
                let btn_toggle = ($(ev.target).attr('data-toggle') || '');
                if ((true !== wna.IsNullOrEmpty(String.prototype.trim.call(btn_toggle)))) {
                    //console.log('###-- Tablix-with-tools:  modal toggle button, exit');
                    return;
                }
                //console.log('###-- Tablix-with-tools: invoke button callback...');
                ev.stopPropagation();

                let thisvue = this;
                let vwstate = thisvue.viewState;
                let filters = _.mapValues(vwstate.filters, function (val, key) {
                    if ('-------' === val) {
                        return '';
                    }
                    return val;
                });
                let selectedRows = [];
                if (true !== wna.IsNullOrEmpty(thisvue.$refs.tablix)) {
                    selectedRows = thisvue.$refs.tablix.getCurrentSelectedRows();
                }
                $(thisvue.$el).fire('tools-button-clicked', {
                    target: ev.target,
                    callback: callback,
                    searchNeedle: vwstate.searchNeedle,
                    selectedRows: selectedRows,
                    filters: filters
                });
            },
            mapFieldToRequestField(filedName){
                let map = {
                    ChannelName:'channelids',
                    level_name:'discrimnants',
                    ConfidenceLevelBucketName:'confidence',
                }
                return map[filedName];
            },
            onSearch(){
                let searchKey = this.viewState.searchNeedle;
                this.$emit('tableviewModelChange',{
                    search: searchKey,
                },{
                    global: true
                })
            }
        },
        //### Lifecycle Hooks
        beforeMount: function(){
            let thisvue = this;
            let vwstate = thisvue.viewState;
            let vwmodel = thisvue.viewModel;

            //init the filters to default value
            if (true !== wna.IsNullOrEmpty(vwmodel.filters)){
                let filterkeys = _.map(vwmodel.filters, 'fieldid');
                let numfilters = (filterkeys || []).length;
                let filtervals = _.times(numfilters, _.constant('-------'));
                let defaultfilters = _.zipObject(filterkeys, filtervals);
                
                vwstate.filters = defaultfilters;
            }
            else{
                vwstate.filters = {};
            }
        },
        mounted: function(){

        },
        beforeUpdate: function(){
            
        }

    });
})();

(function(){
    const _DEFAULT_TAB_ = '___default___';

    Vue.component('vc-tableview2', {
        template: `
            <div :id="id" class="main-panelbody">
                <div class="main-panelhead">
                    <h2>{{locale.section_details}}</h2>
                </div>
                <div class="tabswrap" v-if="(true !== wna.IsNullOrEmpty(viewModel.tabs)) && (true !== wna.IsNullOrEmpty(locale)) && (true !== wna.IsNullOrEmpty(locale.tabs))">
                    <ul>
                        <li v-for="(t, i) in viewModel.tabs" v-bind:class="[ (t.id === viewState.selectedTab) ? 'activetab' : '' ]" v-bind:name="t.id">
                            <button type="button" v-bind:value="t.id" v-on:click="onSelectTab(t.filter,t.id)">
                                <span>{{ locale.tabs[t.id] }}</span>
                                <span class="tabsnum">{{t.sum}}</span>
                            </button>
                        </li>
                    </ul>
                </div><!--tabswrap-->
                <vc-tablix-with-tools 
                    :id="'tablix_with_tools__' + id" 
                    :model="model" :view-model="viewModel" 
                    :locale="locale" 
                    v-on:tools-button-clicked.native="onTablixToolsButtonClicked"
                    @tableviewModelChange="(query,opt)=>$emit('tableviewModelChange',query,opt)"></vc-tablix-with-tools>
            </div>
        `,
        props: ['id', 'model', 'viewModel', 'locale', 'lang'],
        data: function(){
            return {
                viewState: {
                    selectedTab: "tab_all",
                    model4Tab: {}
                }
            };
        },
        watch: {
            'model': {
                deep: true,
                handler: function(){
                    console.log("tableview model");
                    console.log(this.model)
                    // let thisvue = this;
                    // let vwstate = thisvue.viewState;
                    // let vwmodel = thisvue.viewModel;
    
                    // if (true !== wna.IsNullOrEmpty(vwmodel.tabs)){
                    //     let tabs = vwmodel.tabs;
                    //     _.each(tabs, function(t){
                    //         if (true !== wna.IsNullOrEmpty(t)){
                    //             try{
                    //                 let tabmodel = null;
                    //                 if (true === wna.IsFunction(t.filter)){
                    //                     tabmodel = t.filter(thisvue.model);
                    //                 }else{
                    //                     tabmodel = _.filter(thisvue.model, t.filter);
                    //                 }
                                    
                    //                 vwstate.model4Tab[t.id] = (true !== wna.IsNullOrEmpty(tabmodel)) ? tabmodel : [];
                    //             }catch(ex) {
                    //                 vwstate.model4Tab[t.id] = null;
                    //             }
                    //         }
                    //     });
                    // }else{
                    //     vwstate.model4Tab[_DEFAULT_TAB_] = thisvue.model;
                    // }

                    // console.log('----- Tableview2 model-changed: computed model4Tab: ', vwstate.model4Tab);
                }
            }
        },
        computed: {
        },
        //### Methods
        methods: {
            onSelectTab: function(filter,tabid){
                this.viewState.selectedTab = tabid;
                this.$emit('tableviewModelChange', {
                    rp_status: filter? filter.RightsProtectionStatus: 0,
                    page: 1,
                });
            },
            onTablixToolsButtonClicked: function(ev){
                let thisvue = this;
                let vwstate = thisvue.viewState;
                let tabid = vwstate.selectedTab;
                // debugger;
                ev.stopPropagation();
                //console.log('-------- tableview2 - onTablixToolsButtonClicked: ', tabid, ev.detail);
                $(thisvue.$el).fire('tools-button-clicked', _.extend({}, ev.detail, { tabid: tabid }));
            }
        },
        //### Lifecycle Hooks
        beforeMount: function(){
            let thisvue = this;
            let vwstate = thisvue.viewState;
            let vwmodel = thisvue.viewModel;
            let tabid = _DEFAULT_TAB_;
            
            if (true !== wna.IsNullOrEmpty(vwmodel.tabs)){
                let defaultTab = _.find(vwmodel.tabs, { 'default' : true });
                tabid = (true !== wna.IsNullOrUndefined(defaultTab)) ? defaultTab.id : null;
            }

            //extend the vwmodel to provide delegate method for child components
            vwmodel.shouldActivateButton = (function(v){
                return function(button){
                    if (true !== wna.IsNullOrEmpty(button)){
                        if (true === wna.IsNullOrEmpty(button.visibleInTabs)){
                            return true;
                        }
                        return _.includes(button.visibleInTabs, v.viewState.selectedTab);
                    }
                }
            })(thisvue);

            vwmodel.shouldActivateCols = (function(v){
                return function(cols){
                    if (true !== wna.IsNullOrEmpty(cols)){
                        if (true === wna.IsNullOrEmpty(cols.visibleInTabs)){
                            return true;
                        }
                        return _.includes(cols.visibleInTabs, v.viewState.selectedTab);
                    }
                }
            })(thisvue);
        },
        mounted: function(){
            
        },
        beforeUpdate: function(){
        }
    });
})();

(function() {
  Vue.component("vc-daterange-selector", {
    template: `
        <div class="datetimeselector">
            <span class="datetimespan">{{locale.caption}}</span>
            <input class="datetimeinput" type="text" ref="daterangepicker">
            <button type="button" value="7">{{locale.days7}}</button>
            <button type="button" value="15">{{locale.days15}}</button>
            <button type="button" value="30">{{locale.days30}}</button>
            <i class="screen-icon" @click="changeScreen"></i>
            <div class="screen-menu" v-show="isSCreen">
                <h2>Brand</h2>
                <div class="screen-menu-search-box">
                    <span></span>
                <input type="text" class="screen-menu-search" v-model="screenInputValue" placeholder="Search" @keyup="screenInputFunction">
                </div>
                <div class="screen-list">
                    <ul>
                        <li v-for="(site,i) in screenData"><label><span :class="{'active':site.flag}" @click="changeChecked" :id="site.id" v-bind:data="i"></span><i>{{site.name}}</i></label></li>
                    </ul>
                </div>
                <div class="screen-btn">
                    <button type="" @click="screenBtnClick">OK</button>
                </div>
            </div>
            <div class="screen-slide" v-if="screenSLideData[0]">
                <h2>Brand:</h2>
                <ul>
                    <li v-for="site in displayedScreenSlide" ><span>{{site}}</span><i class="screen-closed"></i></li>
                </ul>
            </div>
        </div>
        `,
    props: ["locale"],
    data: function() {
      return {
        startTime:'',
        endTime:'',
        isSCreen: false,
        dateStart: null,
        dateEnd: null,
        $picker: null,
        screenInputValue: "",
        screenData: [{ id: 'all', name: "ALL" ,flag:false}], // filter menu data
        screenSLideData: ['ALL'],
        // filterTagData: [], // store all selected tag data
        isAllTag: false,
      };
    },
    computed: {
      displayedScreenSlide(){
        return this.isAllTag ? ['ALL'] : this.screenSLideData;
      },
    },
    watch: {
      // screenData: {
      //   handler(oldVal, newVal) {
      //     console.log('changed watch')
      //     // newVal.forEach(ele => {
      //     //   //取消 all 勾选
      //     //   if(ele.flag === false && ele.name !== "ALL") {
      //     //     this.uncheckTheAllTag();
      //     //   } else {
      //     //     this.checkTheAllTag();
      //     //   }
      //     // });
      //   },
      //   deep: true,
      // }
    },
    mounted: function() {
        window.brandData='';
        var that = this;
      (function(thisvue, $picker) {
        $picker
          .daterangepicker({
            locale: {
              format: "DD/MM/YYYY"
            }
          })
          .on("cancel.daterangepicker", function() {
            thisvue.saveDateRange(null);
          })
          .on("apply.daterangepicker", function(ev, picker) {
            thisvue.saveDateRange(picker.startDate, picker.endDate);
          });
         
        $('button[type="button"]', $(thisvue.$el)).on("click", function(ev) {
          let $clicked = $(ev.target);
          let days = $clicked.val();
          if (true === wna.IsNullOrUndefined(days)) {
            return;
          }
          let end = moment();
          let start = moment().subtract(days, "days");
          $picker.data("daterangepicker").setStartDate(start);
          $picker.data("daterangepicker").setEndDate(end);
          that.startTime = start;
          that.endTime = end;
          window.startTimes = start;
          window.endTimes = end;
          thisvue.saveDateRange(start, end);
        });

        thisvue.$picker = $picker;
        $('button[type="button"][value="7"]').trigger("click"); //trigger initial daterange change event
      })(this, $(this.$refs.daterangepicker));
      var that = this;
      // the all tag select event
      $(document).on("click", ".screen-list span:first", function() {
        if ($(this).hasClass("active")) {
          $(this).removeClass("active");
          that.screenData[$(this).attr("data")].flag = false;
          // that.isAllTag = false;
          that.uncheckAllTags();
          return;
        }
        $(this).addClass("active");
        that.screenData[$(this).attr("data")].flag = true;
        // that.isAllTag = true;
        that.checkAllTags();
      });
      // tag select event
      $(document).on("click", ".screen-list span:gt(0)", function() {
        // unchecking
        if ($(this).hasClass("active")) {
          that.uncheckCertainTag($(this));
          that.filterCheckChange()
          return;
        }
        // checking
        that.checkCertainTag($(this));
        that.filterCheckChange();
      });
      $(document).on("click", ".screen-slide .screen-closed", function() {
        that.screenSLideData.splice(
          $.inArray(
            $(this)
              .closest("li")
              .text(),
            that.screenSLideData
          ),
          1
        );
        var _that = this;
        // remove menu select while deleting the  screen slide tags
        if($(this).closest("li").text() === "ALL") {
          that.uncheckTheAllTag();
          that.uncheckAllTags();
        }
        for (var i = that.screenData.length - 1; i >= 0; i--) {
          if (that.screenData[i].name.indexOf($(_that).siblings().text())>=0){$(".screen-list span").eq(i).removeClass("active");}
        }
        //发起数据请求
        var str = "";
        var brandData = "";
        $('.screen-list .active').each(function(){
            return str +=$(this).attr('id')+','
        });
        brandData = str.slice(0,str.length-1);
        if(brandData.indexOf("all")==0){
            window.brandData = '';
            that.saveDateRange(window.startTimes,window.endTimes);
          }else {
              window.brandData = brandData;
              that.saveDateRange(window.startTimes,window.endTimes);
        }
      });
      var that =this;
      //获取列表
      let reportUrl = `https://bps-mynodesql-api.blcksync.info:444/v0/query/metric/commodity_test_report?key=top_brand&start_date=2019-04-01 00:00:00&end_date=2019-08-01 00:00:00`;
      $.ajax({
        url: reportUrl,
        type: "GET",
        changeOrigin: true,
        headers: {
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("token")).val + ""
        },
        success: function(rex) {
          // init new coming tags with 'false' flag
          let results = rex.results.map(function(val) {
            return {
              ...val,
              flag:false,
            }
          });
          that.screenData= that.screenData.concat(results);
          // init filter menu with all checked
          that.$nextTick(function () {
            that.isAllTag = true;
            that.checkTheAllTag();
            that.checkAllTags();
          });
        },
        error: function(response) {}
      });
      
    },
    methods: {
      filterCheckChange() {
        let toggle = true;
        this.screenData.forEach(ele => {
          //取消 all 勾选
          if(!ele.flag && ele.name !== "ALL") {
            toggle = false;
          }
        });
        if(toggle) {
          this.checkTheAllTag();
        } else {
          this.uncheckTheAllTag();
        }
      },
      // check all tags, if the all tag is checked
      checkAllTags: function(){
        let that = this;
        console.log(".screen-list span:gt(0)")
        console.log($(".screen-list span"))
        // reset data to avoid duplication
        // that.screenSLideData = [];
        $(".screen-list span:gt(0)").each(function (index) {
          that.checkCertainTag($(this));
        });
      },
      uncheckAllTags: function(){
        let that = this;
        $(".screen-list span:gt(0)").each(function (index) {
          that.uncheckCertainTag($(this));
        });
        // that.screenSLideData = [];
      },
      // in the condition of not all tags are check, remove the all checked.
      uncheckTheAllTag: function() {
        let jqThis = $(".screen-list span").eq(0).removeClass("active");
        this.screenData[$(jqThis).attr("data")].flag = false;
      },
      checkTheAllTag : function (){
        let jqThis = $(".screen-list span").eq(0).addClass("active");
        this.screenData[0].flag = true;
      },
      uncheckCertainTag: function (jqEle) {
        $(jqEle).removeClass("active");
        this.screenData[$(jqEle).attr("data")].flag = false;
      },
      checkCertainTag: function (jqEle) {
        $(jqEle).addClass("active");
        this.screenData[$(jqEle).attr("data")].flag = true;
      }, 
      saveDateRange: function(start, end) {
        let thisvue = this;
        end = true === wna.IsNullOrEmpty(end) ? start : end;
        if (true !== wna.IsNullOrEmpty(start)) {
          thisvue.dateStart = start;
          thisvue.dateEnd = end;
        } else {
          thisvue.dateStart = null;
          thisvue.dateEnd = null;
        }
        $(thisvue.$el).fire("change", { start: start, end: end });
      },
      changeScreen: function() {
       this.isSCreen = !this.isSCreen;
      },
      changeChecked: function() {},
      screenBtnClick: function() {
        let that = this;
        var str = "";
        var brandData = "";
        let isAll = (_.filter(that.screenData,o=>o.flag).length) == (that.screenData.length);
        that.isAllTag = isAll;
        
        that.screenSLideData = _(that.screenData)
          .filter(o => o.flag)
          .map(o=>o.name)
          .value();
        
        console.log('----new slide', that.screenSLideData)
        // update screen slide
        $('.screen-list .active').each(function(){
            return str +=$(this).attr('id')+','
        });
        brandData = str.slice(0,str.length-1);
        console.log('-------branddata-----')
        console.log(brandData)
        if(brandData.indexOf("all")>= 0){
            window.brandData = '';
            this.saveDateRange();
        }else {
            window.brandData = brandData;
            this.saveDateRange();
        }
        this.isSCreen = false;
      },
      screenInputFunction: function() {
        $(".screen-list li").show();
        var that = this;
        for (var i = this.screenData.length - 1; i >= 0; i--) {
          console.log(that.screenData[i].name.toLowerCase().indexOf(that.screenInputValue.toLowerCase())||
          that.screenData[i].name.indexOf(that.screenInputValue.toLowerCase())||
          that.screenData[i].name.indexOf(that.screenInputValue.toUpperCase())||
          that.screenData[i].name.indexOf(that.screenInputValue))
          if (
            that.screenData[i].name.toLowerCase().indexOf(that.screenInputValue.toLowerCase())>=0||
            that.screenData[i].name.indexOf(that.screenInputValue.toLowerCase())>=0||
            that.screenData[i].name.indexOf(that.screenInputValue.toUpperCase())>=0||
            that.screenData[i].name.indexOf(that.screenInputValue)>=0
            ){}else {
              $(".screen-list li").eq(i).hide();
            }
           
        }
      }
    }
  });
})();

(function(){
    Vue.component('vc-dateranged-view',{
        template: `
            <div>
                <vc-daterange-selector :locale="sharedLocale.dateranger" :shared-locale="sharedLocale" v-on:change.native="onDateRangeChange"></vc-daterange-selector>
                <div class="main-chart">
                    <slot name="chart" v-bind:daterange="viewState.dateRange" v-bind:class="main-chart"></slot>
                </div>
                <div class="main-table">
                    <slot name="table" v-bind:daterange="viewState.dateRange" v-bind:class="main-table"></slot>
                </div>
            </div>
        `,
        props: ['model', 'locale', 'sharedLocale'],
        data: function(){
            return {
                viewState: {
                    dateRange: {
                        start: null,
                        end: null
                    }
                }
            }
        },
        methods: {
            onDateRangeChange: function(ev){
                if($(ev.target).hasClass('screen-menu-search'))return;
                let thisvue = this;
                let thisrange = thisvue.viewState.dateRange;

                thisrange.start = moment(ev.detail.start).format('DD/MM/YYYY');
                thisrange.end = moment(ev.detail.end).format('DD/MM/YYYY');
                $(thisvue.$el).fire('daterange-change', ev.detail);
                //console.log('------- onDateRangeChange ', ev.detail);
            }
        }
    });
})();
(function(){
      Vue.component('vc-counterfeit-store', {
        template: `
            <vc-dateranged-view :model="model" :locale="locale" :shared-locale="sharedLocale" v-on:daterange-change.native="onDateRangeChange" v-bind:class="['main-content-body']">
                <template v-slot:chart="slotProps">
                    <div class="main-panelhead">
                        <h2>{{locale.section_chart}}</h2>
                    </div>
                    <div class="main-panelbody">
                        <div class="chartwrap">
                            <div class="chartrow">
                                <div class="chartcol4">
                                    <div class="chartbox">
                                        <div class="chart-1column">
                                            <div class="charttitle">
                                                <h3>{{locale.fakes_shops_count}}</h3>
                                            </div>
                                            <div class="chart-number">
                                                <span>{{ wna.NVL(dashboardModel.total_fakes, 'N/A') }}</span>
                                            </div>										
                                        </div>
                                        <div class="chart-2column chart-2column-r">
                                        <div class="charttitle">
                                            <h3>{{locale.fakes_shops_percent}}</h3>
                                        </div>
                                        <div class="chart-number">
                                            <span>{{ wna.NVL2(dashboardModel.fakes_percent, dashboardModel.fakes_percent, 'N/A') }}</span>
                                        </div>										
                                    </div>
                                    </div>
                                </div>
                                <vc-trend-chart :model="dashboardModel.trendChart" :view-model="viewModel.trendChart" :locale="localeForSubview('trendchart')" class="chartcol8 echat-230"></vc-trend-chart>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-slot:table="slotProps">
                    <vc-tableview2 id="counterfeitStoresTableView" 
                        :model="tableviewModel" :view-model="viewModel.tableview" 
                        :locale="localeForSubview('tableview')" 
                        v-on:tools-button-clicked.native="onTableviewToolsButtonClicked"
                        @tableviewModelChange="tableviewModelChange">
                    </vc-tableview>
                </template>
            </vc-dateranged-view>
        `,
        props: ['path', 'locale', 'sharedLocale', 'lang'],
        data: function(){
            return {
                model: {
                    results: [],
                    channel: [],
                    series: [],
                    model: [],
                    all_shops: null,
                    fakes_shops: null,
                    fakes_shops_count: null,
                    fakes_shops_percent: null,
                    all_shops_count: null,
                    trendChart: null,
                    tablix_model: [],
                },
                tableviewModel: {
                    data: [],
                    query: [],
                },
                tableviewQuery: {
                    key: "discrimination_report_paging",
                    start_date: "",
                    end_date: "",
                    industry: "1",
                    category: "1",
                    brand: "",
                    series: "",
                    model: "",
                    search: "",
                    userid: "",
                    page: "1",
                    record_per_page: "10",
                    // rp_status: "0",
                    channelids: "",
                    // discrimnants: "",
                    // confidence: "",
                },
                dashboardModel:{
                    total_fakes: null,
                    fakes_percent: null,
                    trendChart: null,
                },
                viewState: {
                    start_date: "",
                    end_date: "",
                    dataState: null, //null, loading, ready, error
                },
                viewModel: {
                    lastViewState: null,
                    tableview: {
                        tableLoading: false,
                        rowsPerPage: 10,
                        cols: [
                            {
                                fieldid: 'ShopName'
                            },
                            {
                                fieldid: 'ChannelName'
                            },
                            {
                                fieldid: 'FakeProductNum'
                            },
                            {
                                fieldid: 'RightProctedLinkNum'
                            },
                            // {
                            //     fieldid: 'succeeded_links'    
                            // },
                            /*
                            {
                                fieldid: 'RightsProtectionStartTime',
                                transform:  Helpers.toDateTimeString
                            }*/
                        ],
                        filters: [
                            {
                                fieldid: 'channel',
                                source: 'channels',
                                options: []
                            }   
                        ],
                        search: function(needle, dataset){
                            if ((true !== wna.IsNullOrEmpty(needle)) && (true !== wna.IsNullOrEmpty(dataset))){
                                return _.filter(dataset, function(d){
                                    let shopname = d.ShopName;
                                    return (true !== wna.IsNullOrEmpty(shopname)) ? shopname.contains(needle, true) : false;
                                });
                            }else{
                                return dataset;
                            }
                        },
                        buttons: [
                            {
                                id: 'export',
                                icon: 'assets/icons/icon_export.png',
                                classes: ['btn-red'],
                                callback: function(tabid, filters, searchNeedle){
                                    //we can use 'this' to refer to this vue-component object is because we do callback apply in method onTableviewToolsButtonClicked
                                    let thisvue = this; 
                                    let vwmodel = thisvue.viewModel;
                                    let vwstate = thisvue.viewState;

                                    let start_date = moment(vwstate.start_date).format('YYYY-MM-DD 00:00:00');
                                    let end_date = moment(vwstate.end_date).format('YYYY-MM-DD 23:59:59');

                                    searchNeedle = (true === wna.IsNullOrUndefined(searchNeedle)) ? '' : searchNeedle;
                                    filters = (true === wna.IsNullOrEmpty(filters)) ? null : filters;

                                    let conditions = { filters, searchNeedle, start_date, end_date };

                                    thisvue.$emit('request-export', thisvue.path, conditions, thisvue);
                                    console.log('------ > button(export): clicked!', conditions);
                                }
                            }
                        ]
                    },
                    trendChart:{
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                        },
                        yAxis: {
                            type: 'value',
                        }
                    }
                }
            }
        },
        computed: {
           
        },
        watch: {
        },
        methods: {
            tableviewModelChange: function (query, opt) {
                /*
                 query: {
                   keyToChange: value
                   ... repeat 
                 }
                */
                // add user key 
                
                let that = this;
                let globalQuery = {}; // used as global activated
                let emptyQuery= {
                    key: "discrimination_report_paging",
                    start_date: "",
                    end_date: "",
                    industry: "",
                    category: "",
                    brand: "",
                    series: "",
                    model: "",
                    search: "",
                    userid: "",
                    page: 0,
                    record_per_page: "10",
                    rp_status: "0",
                    channelids: "",
                    discrimnants: "",
                    confidence: "",
                }
        
                this.activeTableLoader();
                this.tableviewQuery.userid =  localStorage.getItem("UserId") && JSON.parse(localStorage.getItem("UserId")).val;
                this.tableviewQuery.start_date = this.viewState.start_date?this.viewState.start_date:"2019-10-05 00:00:00";
                this.tableviewQuery.end_date = this.viewState.end_date?this.viewState.end_date:"2019-10-10 00:00:00";
                this.tableviewQuery.brand = window.brandData||"";
                
                if (opt&&opt.global) {
                  // temp global intervention for search or other query
                  globalQuery = {
                    ... emptyQuery,
                    start_date: this.tableviewQuery.start_date,
                    end_date: this.tableviewQuery.end_date,
                    brand: this.tableviewQuery.brand,
                    userid: this.tableviewQuery.userid,
                    ...query,
                    
                  };
                }else{
                  // temp global intervention for search or other query
                  if(opt&&opt.clearing=="deep"){
        
                  }else if(opt&&opt.clearing=="keepTab"){
        
                  }
                  query && Object.keys(query).forEach((key)=>{
                    this.tableviewQuery[key] = query[key];
                  });
                }
                let url = `https://bps-mynodesql-api.blcksync.info:444/v1/query/metric/abnormal_shop_report`;
                $.ajax({
                  url:  url,
                  type: "GET",
                  data: opt&&opt.global? globalQuery : this.tableviewQuery,
                  headers: {'Authorization': 'Bearer '+JSON.parse(localStorage.getItem("token")).val+''},
                  changeOrigin: true,
                  crossDomain: true,
                  success: function(rex) {
                    let data = rex.results[1];
                    that.tableviewModel.info = {
                      page: parseInt(rex.query.page),
                      countNum: rex.results[0][0].Total,
                    };
                    that.tableviewModel.data = data;
                    that.shutTableLoader();
                  },
                  error: function(response) {
                    alert("表格数据加载失败");
                  }
                });
            },
            // loader for table 
            activeTableLoader: function() {
                this.viewModel.tableview.tableLoading = true;
            },
            shutTableLoader: function() {
                this.viewModel.tableview.tableLoading = false;
            },
            requestTabAndDropdownData() {
                let that = this;
                let url = `https://bps-mynodesql-api.blcksync.info:444/v1/query/metric/abnormal_shop_report`;
                $.ajax({
                  url:  url,
                  type: "GET",
                  data: {
                    key: "discrimination_report_filter",
                    start_date: that.viewState.start_date,
                    end_date: that.viewState.end_date,
                    brandids: window.brandData||"",
                  },
                  headers: {'Authorization': 'Bearer '+JSON.parse(localStorage.getItem("token")).val+''},
                  changeOrigin: true,
                  crossDomain: true,
                  success: function(rex) {
                    //chanel
                    that.viewModel.tableview.filters[0].options = rex.results[0].map(function(val) {
                      return {
                        name: val.ChannelName,
                        value: val.ChannelId,
                      }
                    });
                  },
                  error: function(response) {
                    alert("表格筛选加载失败");                    
                  }
                });
            },
            requestDashboardData:function(query) {
                /*
                    dashboardModel:{
                    total_fakes: null,
                    fakes_percent: null,
                    trendChart: null,
                    barChart1: null,
                    barChart2: null,
                    pieChart: null
                },
                */
                let that = this;
                let requestQuery = {
                    key:"dashboard",
                    start_date: this.viewState.start_date,
                    end_date: this.viewState.end_date,
                    brand: window.brandData,
                }
                Object.assign(requestQuery,query); // mutate
                console.log("!!!impor")
                console.log(requestQuery)
                $.ajax({
                    url:  `https://bps-mynodesql-api.blcksync.info:444/v1/query/metric/abnormal_shop_report`,
                    type: "GET",
                    data: requestQuery,
                    headers: {'Authorization': 'Bearer '+JSON.parse(localStorage.getItem("token")).val+''},
                    changeOrigin: true,
                    crossDomain: true,
                    success: function(rex) {
                        that.dashboardModel.total_fakes = _.head(rex.results[0]).FakeShopCount;
                        that.dashboardModel.fakes_percent= _.head(rex.results[1]).FakeProductRate; // trap:这个数据后台穿的名称是product  应为shop
                        that.buildTrendChartSeries(rex.results[2]);
                        console.log('-----dashboard----')
                        console.log(rex)
                    },
                    error: function(response) {
                        alert("DASHBOARD 数据加载失败");     
                    }
                });
            },
            buildTrendChartSeries: function(metaData){
                // trap: 如果出现不干净数据，同一个渠道被多次重复，可借鉴conterfeitproduct中的barchart2的方法修改
                let organizedDataTemplate = {
                  channelId: [],
                  shopCount: [],
                };
                let organizedData = metaData.reduce((acc,val) => {
                    acc.channelId.push(val.FakeShopStatusByChannel_ChannelId);
                    acc.shopCount.push(val.FakeShopStatusByChannel_ShopCount);
                    return acc;
                },organizedDataTemplate)
                this.dashboardModel.trendChart = {
                  x: organizedData.channelId,
                  series: [
                    {
                      color: "rgb(244,115,115)",
                      data: organizedData.shopCount,
                    }
                  ],
                }
                console.log('new------- counterfeit store trendChart model: ', {
                    x:organizedData.channelId,
                    series: organizedData.shopCount,
                  });
            },
            localeForSubview: function(subviewname){
                let ret =  _.extend({ common: this.sharedLocale.common}, this.locale[subviewname]);
                return ret;
            },
            buildBaseModelFromData: function(data){
                console.log(data)
                let thisvue = this;
                let channels = _.map(data.channel, 'channel');
                let series = _.map(data.series, 'series');
                let models = _.map(data.model, 'model');
                let results = _.map(data, function(r){
                    r.ProductDescriptionLong = r.ProductDescription + '_' + r.Skumap;
                    r.DiscriminantTimeShort = moment(r.DiscriminantTime).utc().format('YYYY-MM-DD');
                    r.level_name = (0 === r.DiscriminantResult) ? '假' : '真';
                    return r;
                });
                let total = (true !== wna.IsNullOrEmpty(results)) ? results.length : null;
                let fakes = (true !== wna.IsNullOrUndefined(total)) ?  _.filter(results, {'DiscriminantResult': 0}) : null;
                let reals = (true !== wna.IsNullOrUndefined(total)) ?  _.differenceBy(results, [{'DiscriminantResult': 0}], 'DiscriminantResult') : null;

                let all_shops = _.uniqBy(results, 'ShopName');
                let fakes_shops = _.uniqBy(fakes, 'ShopName');

                let all_shops_count = (true !== wna.IsNullOrUndefined(all_shops)) ? (all_shops || []).length : null;
                let fakes_shops_count = (all_shops_count > 0) ? (fakes_shops || []).length : null;
                let fakes_shops_percent = (all_shops_count) ? ((fakes_shops_count / all_shops_count) * 100.0).toFixed(2) : null;
                

                thisvue.model.models = models;
                thisvue.model.series = series;
                thisvue.model.results = results;
                thisvue.model.channels = channels;

                thisvue.model.fakes = fakes;
                thisvue.model.reals = reals;
                thisvue.model.all_shops = all_shops;
                thisvue.model.fakes_shops = fakes_shops;
                thisvue.model.all_shops_count = all_shops_count;
                thisvue.model.fakes_shops_count = fakes_shops_count;
                thisvue.model.fakes_shops_percent = fakes_shops_percent;
                
            },
            buildSpecificModelFromData: function(){
                let thisvue = this;
                let fakes = thisvue.model.fakes;
                let fakes_group_by_channel = _.groupBy(fakes, 'channel');
                let tablix_model = [];

                let i = 0;
                _.each(fakes_group_by_channel, function(fakes_of_channel, channel){
                    let fakes_of_channel_group_by_shop = _.groupBy(fakes_of_channel, 'ShopName');

                    _.each(fakes_of_channel_group_by_shop, function(fakes_of_shop_of_channel, shop){
                        let distinct_fake_products_count = (_.uniqBy(fakes_of_shop_of_channel, 'ProductDescriptionLong') || []).length;
                        let distinct_fake_products_links = (_.uniqBy(fakes_of_shop_of_channel, 'ProductURL') || []).length;
                        let succeeded_links = (_.uniqBy(_.filter(fakes_of_shop_of_channel, {'RightsProtectionStatus': 4}), 'ProductURL') || []).length;
                        let min_protection_start_time = _.minBy(fakes_of_shop_of_channel, 'RightsProtectionStartTime');

                        tablix_model.push({
                            resultid: ++i,
                            channel: channel,
                            ShopName: shop,
                            fake_products_count: distinct_fake_products_count,
                            fake_links_count: distinct_fake_products_links,
                            succeeded_links: succeeded_links,
                            RightsProtectionStartTime: min_protection_start_time
                        })
                    });
                });

                thisvue.model.fakes_group_by_channel = fakes_group_by_channel;
                thisvue.model.tablix_model = tablix_model;
            },
            buildFilters: function(){
                let thisvue = this;
                let tbviewViewModel = thisvue.viewModel.tableview;
                
                _.each(tbviewViewModel.filters, function(filter_entry){
                    if ((true !== wna.IsNullOrEmpty(filter_entry)) && (true !== wna.IsNullOrEmpty(filter_entry.source))){
                        filter_entry['options'] = thisvue.model[filter_entry.source];
                    }
                });
            },
            buildTrendChartModel: function(){
                let thisvue = this;
                let model = thisvue.model;
                let fakes = model.fakes;
                let chartseries = [];
                let fakes_group_by_channel = model.fakes_group_by_channel;

                //  1) find all distinct dates for constructing the x-axis
                let dates = _(fakes).map('DiscriminantTimeShort').sortedUniq().value();

                //  2) for each channel, count the fakes shop that grouped by dates
                _.each(fakes_group_by_channel, function(fakes_of_channel, channel){
                    let channel_fakes_shops = _.uniqBy(fakes_of_channel, 'ShopName');
                    let channel_fakes_shops_group_by_dates = _.groupBy(channel_fakes_shops, 'DiscriminantTimeShort');

                    //normalized means filling 0 in missing dates
                    let normalized_channel_fakes_shops_count_group_by_dates = [];
                    _.each(dates, function(d){
                        let channel_fakes_shops_of_date = channel_fakes_shops_group_by_dates[d];
                        let channel_fakes_shops_count_of_date = (channel_fakes_shops_of_date || []).length;

                        normalized_channel_fakes_shops_count_group_by_dates.push(channel_fakes_shops_count_of_date);
                    });
                    chartseries.push({
                        name: channel,
                        data: normalized_channel_fakes_shops_count_group_by_dates
                    });
                });

                let trendChartModel = {
                    x: dates,
                    series: chartseries
                };

                console.log('------- counterfeit store trendChart model: ', trendChartModel);
                thisvue.model.trendChart = trendChartModel;

            },
            onDateRangeChange: function(ev){
                let thisvue = this;
                let hasData = (true !== wna.IsNullOrEmpty(ev.detail));
                let start = (true === hasData) ? ev.detail.start : null;
                let end = (true === hasData) && (null !== start) ? ev.detail.end : null;
                if(start && end ) {
                    thisvue.viewState.start_date =start.format('YYYY-MM-DD 00:00:00');
                    thisvue.viewState.end_date =end.format('YYYY-MM-DD 23:59:59');
                  }
                console.log('------- onDateRangeChange >', thisvue.path, ev.detail);
                // thisvue.$emit('request-data', thisvue.path, start, end, {keys: ['channel', 'series', 'model']}, thisvue.onRequestReturned, thisvue);
                thisvue.requestTabAndDropdownData();
                thisvue.requestDashboardData({});
                thisvue.tableviewModelChange()
            },
            onRequestReturned: function(data, jqXHR, textStatus, errorThrown){
                let thisvue = this;
                if (true !== wna.IsNullOrEmpty(data)){
                    if (true === data.success){
                        thisvue.buildBaseModelFromData(data.results);
                        thisvue.buildSpecificModelFromData();

                        thisvue.buildFilters();

                        if (true === wna.IsNullOrEmpty(thisvue.model.results)){
                            thisvue.model.trendChart = null;
                            return;
                        }

                        thisvue.buildTrendChartModel();
                    }
                }
            },
            onTableviewToolsButtonClicked: function(ev){
                let thisvue = this;
                
                if (true !== wna.IsNullOrEmpty(ev.detail)){
                    let detail = ev.detail;
                    let btnid = $(detail.target).val();

                    if (true === wna.IsFunction(detail.callback)){
                        let args = [detail.tabid, detail.filters, detail.searchNeedle];
                        detail.callback.apply(thisvue, args);
                    }
                }
            }
        }
    });
})();
(function() {
  Vue.component("vc-counterfeit-product", {
    template: `
            <vc-dateranged-view :model="model" :locale="locale" :shared-locale="sharedLocale" v-on:daterange-change.native="onDateRangeChange" v-bind:class="['main-content-body']">
                <template v-slot:chart="slotProps">
                    <div class="main-panelhead">
                        <h2>{{locale.section_chart}}</h2>
                    </div>
                    <div class="main-panelbody">
                        <div class="chartwrap">
                            <div class="chartrow">
                                <div class="chartcol4">
                                    <div class="chartbox">
                                        <div class="chart-2column">
                                            <div class="charttitle">
                                                <h3>{{locale.total_fakes}}</h3>
                                            </div>
                                            <div class="chart-number">
                                                <span>{{ wna.NVL(dashboardModel.total_fakes, 'N/A') }}</span>
                                            </div>
                                        </div>
                                        <div class="chart-2column chart-2column-r">
                                            <div class="charttitle">
                                                <h3>{{locale.fakes_percent}}</h3>
                                            </div>
                                            <div class="chart-number">
                                                <span>{{ wna.NVL2(dashboardModel.fakes_percent, dashboardModel.fakes_percent, 'N/A') }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <vc-trend-chart ref= "trendChart"  :model="dashboardModel.trendChart" :view-model="viewModel.trendChart" :locale="localeForSubview('trendchart')" class="chartcol8 echat-230"></vc-trend-chart>
                            </div>
                            <div class="chartrow">
                                <vc-pie-chart :model="dashboardModel.pieChart" :locale="localeForSubview('piechart')" class="chartcol4 echat-v6"></vc-pie-chart>
                                <vc-bar-chart :model="dashboardModel.barChart1" :locale="localeForSubview('barchart1')" class="chartcol4 echat-v6"></vc-bar-chart>
                            </div>
                        </div>
                    </div>
                    <div class="modal fade" id="complaints-insufficient-quota" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
                          <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <span class="modal-success-icon"></span>
                                    <h3>Sorry, the complaint balance is insufficient</h3>
                                    <p>If you want to get more complaints, you can get more complaints through data feedback</p>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-primary" @click="$('#complaints-insufficient-quota').modal('hide')">OK</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Modal -->
               
                    <div class="modal fade" id="complaints-normal-quota" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
                          <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <span class="modal-success-icon"></span>
                                    <h3>Do you confirm the complaint?</h3>
                                    <p>You have {{balance}} </p>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-primary" @click="normalQuota">OK</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal fade" id="complaints-no-authority" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
                          <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <span class="modal-success-icon"></span>
                                    <h3>Sorry，You don't have permission</h3>
                                    <p>If you need permission to file a complaint, you can contact simplybrand for permission to file a complaint</p>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-primary" @click="$("#complaints-insufficient-quota").modal('hide');">OK</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal fade" id="complaints-success" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
                          <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <span class="modal-success-icon"></span>
                                    <h3>Successfully !</h3>
                                    <p>We have received your feedback and suggestions successfully. You have received a quota for this feedback.</p>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-primary" @click="$('#complaints-success').modal('hide');">OK</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal fade" id="received-success" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
                          <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <span class="modal-success-icon"></span>
                                    <h3>Successfully !</h3>
                                    <p>We have received your feedback and suggestions successfully. You have received a quota for this feedback.</p>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-primary" @click="$('#received-success').modal('hide');">OK</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal fade" id="feedback" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
                          <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">Feedback</h4>
                                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                             </div>
                                <div class="modal-body">
                                    <form role="form">
                                        <div class="form-group">
                                            <p>Data Feedback</p>
                                            <button type="button" v-for="site in feedbackOptions" :id="site.id"  :class="[{'disabled':isDisabled},{'active':feedbackBtnId==site.id}]" class="feedback-check btn btn-default" @click="feetbackBtnClick(site.id)">{{site.label}}</button>
                                            <p v-if="isDisabled">You have not selected any data, so you can't select the question label at this time. Please select the data and try again.</p>
                                        </div>
                                        <div class="form-group">
                                        <p for="textarea">System Feedback</p>
                                        <textarea class="form-control" rows="5" v-model="feedbackTextarea" placeHolder="Please fill in the feedback"  style="resize:none;"></textarea>
                                    </div>
                                    </form>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-primary">Cancel</button><button type="button" class="btn btn-primary" @click="feedbackCommit">Sure</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-slot:table="slotProps">
                    <vc-tableview2 id="counterfeitProductsTableView" 
                      :model="tableviewModel" :view-model="viewModel.tableview" 
                      :locale="localeForSubview('tableview')" 
                      v-on:tools-button-clicked.native="onTableviewToolsButtonClicked"
                      @tableviewModelChange="tableviewModelChange">
                    </vc-tableview2>
                <!--
                    <vc-tableview id="counterfeitProductsTablix" :model="tableviewModel" :view-model="viewModel.tableview" :locale="localeForSubview('tableview')" v-on:tools-button-clicked.native="onTableviewToolsButtonClicked"></vc-tableview>
                //-->
                </template>
            </vc-dateranged-view>
            

        `,
    props: ["path", "locale", "sharedLocale", "lang"],
    beforeMount: function() {
      //This will complicate the logic, use local computed property for component-specific locale
      /*
            console.log('------------ before mount: ', this.path, this.model, this.locale);
            this.$emit('registerlocales', {path: this.path, locales: _locales});
            */
    },
    data: function() {
      return {
        feedbackTextarea: "",
        feedbackBtnId:0,
        feedbackOptions: [
          
        ],
        balance:0,
        model: {
          results: [],
          channel: [],
          series: [],
          model: [],
          total_fakes: null,
          fakes_percent: null,
          trendChart: null,
          barChart1: null,
          barChart2: null,
          pieChart: null
        },
        dashboardModel:{
          total_fakes: null,
          fakes_percent: null,
          trendChart: null,
          barChart1: null,
          barChart2: null,
          pieChart: null
        },
        tableviewModel: {
          data: [],
          query: [],
        },
        tableviewQuery: {
          key: "discrimination_report_paging",
          start_date: "",
          end_date: "",
          industry: "1",
          category: "",
          brand: "",
          series: "",
          model: "",
          search: "",
          userid: "",
          page: "1",
          record_per_page: "10",
          rp_status: "0",
          channelids: "",
          discrimnants: "",
          confidence: "",
        },
        viewState: {
          start_date: null,
          end_date: null,
          dataState: null, //null, loading, ready, error
        },
        viewModel: {
          //lastViewState: null,
          tableview: {
            //selectable: true, //single select
            rowsPerPage: 10,
            multiselect: true,
            tableLoading: true,
            primaryKey: "ResultId",
            tabs: [
              {
                id: "tab_all",
                filter: { RightsProtectionStatus: 0 },                
                sum: 0,
                default: true
              },
              {
                id: "tab_pending",
                filter: { RightsProtectionStatus: 1 },
                sum: 0,
                /*
                                filter: function(dataset){
                                    //console.log('------ > tab_pending activated', dataset);
                                    return (true !== wna.IsNullOrEmpty(dataset)) ? _.filter(dataset, { 'RightsProtectionStatus' : 1 }) : [];
                                }
                                */
              },
              {
                id: "tab_waiting",
                filter: { RightsProtectionStatus: 2 },
                sum: 0,
                /*
                                filter: function(dataset){
                                    //console.log('------ > tab_waiting activated', dataset);
                                    return (true !== wna.IsNullOrEmpty(dataset)) ? _.filter(dataset, { 'RightsProtectionStatus' : 2 }) : [];
                                }
                                */
              },
              {
                id: "tab_progress",
                filter: { RightsProtectionStatus: 5 },
                sum: 0,
                /*
                                filter: function(dataset){
                                    //console.log('------ > tab_progress activated', dataset);
                                    return (true !== wna.IsNullOrEmpty(dataset)) ? _.filter(dataset, { 'RightsProtectionStatus' : 5 }) : [];
                                }
                                */
              },
              {
                id: "tab_success",
                filter: { RightsProtectionStatus: 4 },
                sum: 0,
                /*
                                filter: function(dataset){
                                    //console.log('------ > tab_success activated', dataset);
                                    return (true !== wna.IsNullOrEmpty(dataset)) ? _.filter(dataset, { 'RightsProtectionStatus' : 4 }) : [];
                                }
                                */
              },
              {
                id: "tab_failed",
                filter: { RightsProtectionStatus: 3 },
                sum: 0,
                /*
                                filter: function(dataset){
                                    //console.log('------ > tab_failed activated', dataset);
                                    return (true !== wna.IsNullOrEmpty(dataset)) ? _.filter(dataset, { 'RightsProtectionStatus' : 3 }) : [];
                                }
                                */
              }
            ],
            cols: [
              //the colums that we'd like to display
              {
                fieldid:
                  "ResultId" /*
                                transform: function(value){
                                    //nullable
                                }*/
              },
              {
                fieldid: "BrandNameList"
              },
              // {
              //   fieldid: "series"
              // },
              // {
              //   fieldid: "model"
              // },
              {
                fieldid: "DiscriminantResult",
                transform: function(value, entry) {
                  return (
                    '<div class="result' +
                    value +
                    '"><span style="margin-right: 6px;">&#9679;</span><span>' +
                    (value===0?'FALSE':'TRUE')+
                    "</span></div>"
                  );
                }
              },
              {
                fieldid: "ConfidenceLevelBucketName"
              },
              {
                fieldid: "ProductDescription",
                transform: function(value, entry) {
                  if (true !== wna.IsNullOrEmpty(entry.ProductURL)) {
                    return (
                      '<a href="' +
                      entry.ProductURL +
                      '" target="_blank">' +
                      value +
                      "</a>"
                    );
                  } else {
                    return value;
                  }
                }
              },
              {
                fieldid: "Skumap"
              },
              {
                fieldid: "ChannelName"
              },
              {
                fieldid: "DiscriminantTime",
                transform: Helpers.toDateTimeString
              },
              {
                fieldid: "RightsProtectionStatus", //'',
                visibleInTabs: ["tab_all","tab_pending"],
                transform: function(value, entry) {
                  if (
                    true === wna.IsNullOrEmpty(entry) ||
                    true === wna.IsNullOrUndefined(entry.RightsProtectionStatus)
                  ) {
                    return "";
                  }
                  let styleclass = "";
                  switch (entry.RightsProtectionStatus) {
                    case 1:
                      styleclass = "initiate";
                      break;
                    case 2:
                      styleclass = "receipt";
                      break;
                    case 3:
                      styleclass = "failed";
                      break;
                    case 4:
                      styleclass = "completed";
                      break;
                    case 5:
                      styleclass = "process";
                      break;
                    default:
                      styleclass = "";
                      break;
                  }
                  // debugger;
                  return (
                    '<div class="status ' +
                    styleclass +
                    '"><span>' +
                    entry.RightsProtectionStatusContent +
                    "</span></div>"
                  );
                }
              },
              {
                fieldid: "RightsProtectionStartTime",
                visibleInTabs: [
                  "tab_all",
                  "tab_waiting",
                  "tab_progress",
                  "tab_success",
                  "tab_failed"
                ],
                transform: Helpers.toDateTimeString
              }
            ],
            filters: [
              {
                fieldid: "ChannelName",
                source: "channels",
                options: []
              },
              {
                fieldid: "level_name",
                source: "level_names",
                options: []
              },
              {
                fieldid: "ConfidenceLevelBucketName",
                source: "confidences",
                options: []
              },
              // {
              //   fieldid: "series",
              //   source: "series",
              //   options: []
              // },
              // {
              //   fieldid: "model",
              //   source: "models",
              //   options: []
              // }
            ],
            search: function(needle, dataset) {
              if (
                true !== wna.IsNullOrEmpty(needle) &&
                true !== wna.IsNullOrEmpty(dataset)
              ) {
                return _.filter(dataset, function(d) {
                  let productstring = d.ProductDescription;
                  return true !== wna.IsNullOrEmpty(productstring)
                    ? productstring.contains(needle, true)
                    : false;
                });
              } else {
                return dataset;
              }
              //console.log('------ > search: ', needle, dataset);
            }, //or null
            buttons: [
              {
                id: "feedback",
                classes: ["btn-white"],
                visibleInTabs: [
                  "tab_all",
                  "tab_waiting",
                  "tab_progress",
                  "tab_success",
                  "tab_failed"
                ],
                callback: function(selection) {
                  var selectionData = selection;
                  window.selectionData = selectionData;
                  if (true === wna.IsNullOrEmpty(selection)) {
                    this.isDisabled = true;
                    $("#feedback").modal();
                  } else {
                    this.isDisabled = false;
                    $("#feedback").modal();
                  }
                  let thisvue = this;
                  let vwstate = thisvue.viewState;

                  console.log("------ > button(launch): clicked!", selection);
                }
              },
              {
                id: "launch",
                classes: ["btn-white"], //or null
                visibleInTabs: ["tab_pending"],
                callback: function(selection) {
                  if (true === wna.IsNullOrEmpty(selection)) {
                    return;
                  }
                   //鉴权
                  if(JSON.parse(localStorage.getItem("balance")).val>0){
                    this.balance = JSON.parse(localStorage.getItem("balance")).val;
                    $("#complaints-normal-quota").modal();
                  }else if(JSON.parse(localStorage.getItem("balance")).val==0){
                    $("#complaints-insufficient-quota").modal();
                    return;
                  }else {
                    $("#complaints-insufficient-quota").modal();
                    return;
                  }
                  var selectionData = selection;
                  window.selectionData = selectionData;
                  let thisvue = this;
                  let vwstate = thisvue.viewState;
                  console.log("------ > button(launch): clicked!", selection);
                }
              }
              // {
              //     id: 'export',
              //     icon: 'assets/icons/icon_export.png',
              //     classes: ['btn-red'],
              //     callback: function (tabid, filters, searchNeedle) {
              //         //we can use 'this' to refer to this vue-component object is because we do callback apply in method onTableviewToolsButtonClicked
              //         let thisvue = this;
              //         let vwmodel = thisvue.viewModel;
              //         let vwstate = thisvue.viewState;

              //         let start_date = moment(vwstate.start_date).format('YYYY-MM-DD 00:00:00');
              //         let end_date = moment(vwstate.end_date).format('YYYY-MM-DD 23:59:59');
              //         let tabobj = (_.find(vwmodel.tableview.tabs, { id: tabid }) || { filter: null });
              //         let tab = wna.NVL2(tabobj.filter, tabobj.filter, '');
              //         let f1 = _.mapValues(filters, function (v, k) {
              //             if ('level_name' === k) {
              //                 let result_value = _.findKey(thisvue.locale.valuesMapping.DiscriminantResult, function (o) {
              //                     return (o === v);
              //                 });
              //                 let ret = parseInt(result_value, 10);
              //                 return isNaN(ret) ? '' : ret;
              //             }
              //             return (true === wna.IsNullOrUndefined(v)) ? '' : v;
              //         });
              //         filters = _.mapKeys(f1, function (v, k) {
              //             if ('level_name' === k) {
              //                 return 'DiscriminantResult';
              //             }
              //             return k;
              //         });
              //         searchNeedle = (true === wna.IsNullOrUndefined(searchNeedle)) ? '' : searchNeedle;
              //         filters = (true === wna.IsNullOrEmpty(filters)) ? null : filters;

              //         let conditions = { tab, filters, searchNeedle, start_date, end_date };

              //         thisvue.$emit('request-export', thisvue.path, conditions, thisvue);
              //         console.log('------ > button(export): clicked!', conditions);
              //     }
              // }
            ]
          },
          trendChart: {
            xAxis: {
              type: "category",
              boundaryGap: false
            },
            yAxis: {
              type: "value"
            }
          }
        },
        testBar: {
          model: {
            categories: ["京東", "考拉", "淘寶", "天貓"],
            series: [
              {
                name: "低",
                data: [10, 52, 200, 334]
              },
              {
                name: "中",
                data: [10, 52, 200, 334]
              },
              {
                name: "中高",
                data: [10, 52, 200, 334]
              },
              {
                name: "高",
                data: [30, 72, 230, 334]
              }
            ]
          }
        },
        testPie: {
          model: {
            Apple: 3700,
            Banna: 1177,
            Peach: 1093
          }
        },
        testChart: {
          model: {
            x: ["03-04", "03-05", "03-06", "03-07", "03-08", "03-09", "03-10"], //will be copied to opts.xAxis.data,
            series: [
              {
                color: "rgb(244,115,115)",
                name: "Fakes",
                data: [120, 132, 101, 134, 90, 230, 210]
              },
              {
                color: "rgb(114,144,242)",
                name: "Rights",
                data: [220, 182, 191, 234, 290, 330, 310]
              }
            ]
          }
        },
        isDisabled: false,
        channelIdAndNameMap: {},
      };
    },
    watch: {
      locale: {
        deep: true,
        handler: function(val) {
          this.dashboardModel.trendChart.series[0].name = this.locale.valuesMapping.DiscriminantResult[0]
          this.dashboardModel.barChart1.series[0].name = this.locale.valuesMapping.DiscriminantResult[1];
          this.dashboardModel.barChart1.series[1].name = this.locale.valuesMapping.DiscriminantResult[0];
        }
      },
    },
    mounted() {
      
      $("#complaints-insufficient-quota").appendTo("body");
      $("#complaints-normal-quota").appendTo("body");
      $("#complaints-no-authority").appendTo("body");
      $("#received-success").appendTo("body");
      $("#complaints-success").appendTo("body");
      $("#feedback").appendTo("body");
      //获取反馈用户信息options
      var that = this;
      let optionsUrl = `https://bps-mynodesql-api.blcksync.info:444/v0/feedback/options/`;
      $.ajax({
        url: optionsUrl,
        type: "GEt",
        headers: {
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("token")).val + ""
        },
        changeOrigin: true,
        success: function(rex) {
          console.log(rex.feedback_options)
          that.feedbackOptions =rex.feedback_options;
        },
        error: function(response) {}
      });
    },
    computed: {},
    methods: {
      // tableview model change event 
      tableviewModelChange: function (query, opt) {
        /*
         query: {
           keyToChange: value
           ... repeat 
         }
        */
        // add user key 
        
        let that = this;
        let globalQuery = {}; // used as global activated
        let emptyQuery= {
          key: "discrimination_report_paging",
          start_date: "",
          end_date: "",
          industry: "",
          category: "",
          brand: "",
          series: "",
          model: "",
          search: "",
          userid: "",
          page: 0,
          record_per_page: "10",
          rp_status: "",
          channelids: "",
          discrimnants: "",
          confidence: "",
        }

        // active loader
        this.activeTableLoader();
        
        this.tableviewQuery.userid =  localStorage.getItem("UserId") && JSON.parse(localStorage.getItem("UserId")).val;
        this.tableviewQuery.start_date = this.viewState.start_date?this.viewState.start_date:"2019-10-05 00:00:00";
        this.tableviewQuery.end_date = this.viewState.end_date?this.viewState.end_date:"2019-10-10 00:00:00";
        this.tableviewQuery.brand = window.brandData||"";
        
        if (opt&&opt.global) {
          // temp global intervention for search or other query
          globalQuery = {
            ... emptyQuery,
            start_date: this.tableviewQuery.start_date,
            end_date: this.tableviewQuery.end_date,
            brand: this.tableviewQuery.brand,
            userid: this.tableviewQuery.userid,
            ...query,
            
          };
        }else{
          // temp global intervention for search or other query
          // if(opt&&opt.clearing=="deep"){

          // }else if(opt&&opt.clearing=="keepTab"){

          // }
          query && Object.keys(query).forEach((key)=>{
            this.tableviewQuery[key] = query[key];
          });
        };
        let url = `https://bps-mynodesql-api.blcksync.info:444/v1/query/metric/commodity_test_report`;
        $.ajax({
          url:  url,
          type: "GET",
          data: opt&&opt.global? globalQuery : this.tableviewQuery,
          headers: {'Authorization': 'Bearer '+JSON.parse(localStorage.getItem("token")).val+''},
          changeOrigin: true,
          crossDomain: true,
          success: function(rex) {
            let data = rex.results[1];
            that.tableviewModel.info = {
              page: parseInt(rex.query.page),
              countNum: rex.results[0][0].CountNum,
            };
            that.tableviewModel.data = data;
            that.shutTableLoader();
          },
          error: function(response) {
            alert("表格数据加载失败");
          }
        });
      },
      // loader for table 
      activeTableLoader: function() {
        this.viewModel.tableview.tableLoading = true;
      },
      shutTableLoader: function() {
        this.viewModel.tableview.tableLoading = false;
      },
      // request new tab and control data list
      requestTabAndDropdownData() {
        let that = this;
        let url = `https://bps-mynodesql-api.blcksync.info:444/v1/query/metric/commodity_test_report`;
        $.ajax({
          url:  url,
          type: "GET",
          data: {
            key: "discrimination_report_filter",
            start_date: that.viewState.start_date,
            end_date: that.viewState.end_date,
            brandids: window.brandData||"",
            rp_status: ""
          },
          headers: {'Authorization': 'Bearer '+JSON.parse(localStorage.getItem("token")).val+''},
          changeOrigin: true,
          crossDomain: true,
          success: function(rex) {
            rex.results[0].forEach(function(val) {
              let correspondingTab = _.find(that.viewModel.tableview.tabs, function(o) {
                  return o.filter.RightsProtectionStatus === val.RightsProtectionStatus;
                }
              );
              correspondingTab.sum = val['count(0)'];
            })
            //chanel
            that.viewModel.tableview.filters[0].options = rex.results[1].map(function(val) {
              // cache the channel name to use later in the graph
              that.channelIdAndNameMap[val.ChannelId] = val.ChannelName;
              console.log("-----channel",that.channelIdAndNameMap)
              return {
                name: val.ChannelName,
                value: val.ChannelId,
              };
            });
            //results
            that.viewModel.tableview.filters[1].options = rex.results[2].map(function(val) {
              return {
                name: val.DiscriminantResult,
                value: val.DiscriminantResult,
              }
            });
            //confidence
            that.viewModel.tableview.filters[2].options = rex.results[3].map(function(val) {
              return {
                name: val.ConfidenceLevelBucketName,
                value: val.ConfidenceLevelBucketName,
              }
            });
            console.log('------new tab data-------')
            console.log(rex.results)
          },
          error: function(response) {
            alert("显示信息加载失败");
          }
        });
      },
      requestDashboardData:function(query) {
        /*
         dashboardModel:{
          total_fakes: null,
          fakes_percent: null,
          trendChart: null,
          barChart1: null,
          barChart2: null,
          pieChart: null
        },
        */
        let that = this;
        let requestQuery = {
          key:"dashboard",
          start_date: this.viewState.start_date,
          end_date: this.viewState.end_date,
          brand: window.brandData,
        }
        Object.assign(requestQuery,query); // mutate
        console.log("!!!impor")
        console.log(requestQuery)
        $.ajax({
          url:  `https://bps-mynodesql-api.blcksync.info:444/v1/query/metric/commodity_test_report`,
          type: "GET",
          data: requestQuery,
          headers: {'Authorization': 'Bearer '+JSON.parse(localStorage.getItem("token")).val+''},
          changeOrigin: true,
          crossDomain: true,
          success: function(rex) {
            that.dashboardModel.total_fakes = _.head(rex.results[0]).FakeProductCount;
            that.dashboardModel.fakes_percent= _.head(rex.results[1]).FakeProductRate;
            that.buildTrendChartSeries(rex.results[2]);
            that.buildPieChartSeries(rex.results[3]);
            that.buildFakesByChannelBarChartSeries(rex.results[4]);
            console.log('-----dashboard----')
            console.log(rex)
          },
          error: function(response) {
            alert("dashboard加载失败");
          }
        });
      },
      localeForSubview: function(subviewname) {
        let ret = _.extend(
          { common: this.sharedLocale.common },
          this.locale[subviewname]
        );
        return ret;
      },
      buildBaseModelFromData: function(data) {
        let thisvue = this;
        //let channels = _.map(data.channel, "channel");
        let series = _.map(data.series, "series");
        let models = _.map(data.model, "model");
        let results = _.map(data, function(r) {
          r.DiscriminantTimeShort = moment(r.DiscriminantTime)
            .utc()
            .format("YYYY-MM-DD");

          (function(o, v) {
            Object.defineProperty(o, "level_name", {
              get: function() {
                return v.locale.valuesMapping.DiscriminantResult[
                  o.DiscriminantResult
                ]; //(0 === r.DiscriminantResult) ? '假' : '真';
              }
            });

            Object.defineProperty(o, "statusText", {
              get: function() {
                return v.locale.valuesMapping.RightsProtectionStatus[
                  o.RightsProtectionStatus
                ]; //(0 === r.DiscriminantResult) ? '假' : '真';
              }
            });
          })(r, thisvue);
          //r.level_name = _locales[thisvue.lang].valuesMapping['DiscriminantResult'][r.DiscriminantResult]; //(0 === r.DiscriminantResult) ? '假' : '真';

          return r;
        });
        let total = true !== wna.IsNullOrEmpty(results) ? results.length : null;
        let fakes =
          true !== wna.IsNullOrUndefined(total)
            ? _.filter(results, { DiscriminantResult: 0 })
            : null;
        let reals =
          true !== wna.IsNullOrUndefined(total)
            ? _.differenceBy(
                results,
                [{ DiscriminantResult: 0 }],
                "DiscriminantResult"
              )
            : null;

        let total_fakes =
          true !== wna.IsNullOrUndefined(total)
            ? true !== wna.IsNullOrEmpty(fakes)
              ? fakes.length
              : 0
            : null;
        let fakes_percent =
          true !== wna.IsNullOrUndefined(total_fakes)
            ? ((total_fakes / total) * 100.0).toFixed(2)
            : null;

        let successes =
          true !== wna.IsNullOrUndefined(total)
            ? _.filter(results, { RightsProtectionStatus: 4 })
            : null;
        let total_success =
          true !== wna.IsNullOrUndefined(total)
            ? true !== wna.IsNullOrEmpty(successes)
              ? successes.length
              : 0
            : null;

        thisvue.model.models = models;
        thisvue.model.series = series;
        thisvue.model.results = results;
        //thisvue.model.channels = channels;

        thisvue.model.channels = _.map(
          _.uniqBy(results, "ChannelName"),
          "ChannelName"
        );

        thisvue.model.fakes = fakes;
        thisvue.model.reals = reals;
        thisvue.model.successes = successes;
        thisvue.model.total_fakes = total_fakes;
        thisvue.model.total_success = total_success;
        thisvue.model.fakes_percent = fakes_percent;

        thisvue.model.level_names = _.map(
          _.uniqBy(results, "level_name"),
          "level_name"
        );
      },
      buildSpecificModelFromData: function(data) {
        let thisvue = this;
        //confidences
        //thisvue.model.discriminants = [{ title: '真', value: 1 }, { title: '假', value: 0 }];
        thisvue.model.confidences = _(thisvue.model.results)
          .map("ConfidenceLevelBucketName")
          .uniq()
          .value();
      },
      buildFilters: function() {
        let thisvue = this;
        let tbviewViewModel = thisvue.viewModel.tableview;

        _.each(tbviewViewModel.filters, function(filter_entry) {
          if (
            true !== wna.IsNullOrEmpty(filter_entry) &&
            true !== wna.IsNullOrEmpty(filter_entry.source)
          ) {
            filter_entry.options = thisvue.model[filter_entry.source];
          }
        });
      },
      buildTrendChartModel: function() {
        let thisvue = this;
        let model = thisvue.model;
        let fakes = model.fakes;
        let reals = model.reals;
        let results = model.results;

        //console.log('ddddd----',results);

        //  1) find all distinct dates for constructing the x-axis
        let dates = _(results)
          .map("DiscriminantTimeShort")
          .sortedUniq()
          .value();

          console.log('eeeee---',dates);

        //  2) group the fakes and rights by dates
        let fakes_group_by_dates = _.groupBy(fakes, "DiscriminantTimeShort");
        let reals_group_by_dates = _.groupBy(reals, "DiscriminantTimeShort");

        //  3) fill the fakes and reals groups with the missing dates
        let dateobjs = _.map(dates, d => {
          return {
            DiscriminantTimeShort: d
          };
        });

        let fakes_missing_dates = _.differenceBy(
          dateobjs,
          fakes,
          "DiscriminantTimeShort"
        );
        let reals_missing_dates = _.differenceBy(
          dateobjs,
          reals,
          "DiscriminantTimeShort"
        );

        _.each(fakes_missing_dates, o => {
          fakes_group_by_dates[o.DiscriminantTimeShort] = [];
        });
        _.each(reals_missing_dates, o => {
          reals_group_by_dates[o.DiscriminantTimeShort] = [];
        });

        //  4) create the chart model
        let trendChartModel = {
          x: dates,
          series: [
            {
              color: "rgb(244,115,115)",
              name: "假",
              data: _.map(dates, d => {
                let fd = fakes_group_by_dates[d]; //fakes on date
                return true !== wna.IsNullOrEmpty(fd) ? fd.length : 0;
              })
            }
            // {
            //     color: 'rgb(114,144,242)',
            //     name: '真',
            //     data: _.map(dates, (d) => {
            //         let rd = reals_group_by_dates[d]; //rights on date
            //         return (true !== wna.IsNullOrEmpty(rd)) ? rd.length : 0;
            //     })
            // }
          ]
        };
        //console.log('------- trendChart model: ', trendChartModel);
        thisvue.model.trendChart = trendChartModel;
      },
      buildTrendChartSeries: function(metaData){
        let organizedDataTemplate = {
          dates: [],
          fakeVal: [],
        };
        let organizedData = [];
        metaData.forEach((val) => {
          organizedData.push([moment(val.FakeProductValueTradeData).toDate(),val.FakeProductValueTradeValue]);
        },[])
        
        this.dashboardModel.trendChart = {
          series: [
            {
              color: "rgb(244,115,115)",
              // localeForSubview
              name: this.locale.valuesMapping.DiscriminantResult[0],
              data: organizedData,
            }
          ],
        }
      },
      buildPieChartModel: function() {
        let thisvue = this;
        let model = thisvue.model;
        let fakes = model.fakes;
        console.log('--------eee',fakes);
        //  1) group the fakes by series and count number of fakes as value
        let fakes_count_group_by_series = _(fakes)
          .groupBy("BrandNameList")
          .map(function(val, key) {
            return {
              series: key,
              count: true !== wna.IsNullOrEmpty(val) ? val.length : 0
            };
          })
          .orderBy(["count"], ["desc"])
          .value(); //_.groupBy(fakes, 'series');

        //  2) maximum number of pie items is 8, if fakes groups more than 8, reduce to 8 by picking up the top-7 and sum the others
        if (
          true !== wna.IsNullOrEmpty(fakes_count_group_by_series) &&
          fakes_count_group_by_series.length > 8
        ) {
          let reduced = _.slice(fakes_count_group_by_series, 0, 7);
          let rest = _.drop(fakes_count_group_by_series, 7);
          let sumrest = _.reduce(
            rest,
            function(sum, r) {
              sum += r.count;
              return sum;
            },
            0
          );

          fakes_count_group_by_series = _.concat(reduced, [
            { series: "others", count: sumrest }
          ]);
        }

        //  3) Map array to object
        let pieChartModel = _(fakes_count_group_by_series)
          .keyBy("series")
          .mapValues("count")
          .value();
        console.log('-------- reduced fakes count group by series: ', fakes_count_group_by_series);
        console.log('-------- reduced fakes count group by series: ', pieChartModel);
        thisvue.model.pieChart = pieChartModel;
      },
      buildPieChartSeries(metaData){
        this.dashboardModel.pieChart = metaData.reduce((acc,val) => {
          acc[val.FakeProductStatusByBrand_BrandName] = val.FakeProductStatusByBrand_ProductCount;
          return acc
        },{})
      },
      buildChannelFakesBarChartModel: function() {
        let thisvue = this;
        let model = thisvue.model;
        let fakes = model.fakes;
        let reals = model.reals;
        let channels = model.channels;
        console.log('--------------ddd',channels)
        //  1) Group the fakes by channel
        let fakes_count_group_by_channel = _(fakes)
          .groupBy("ChannelName")
          .map(function(val, key) {
            return {
              channel: key,
              count: true !== wna.IsNullOrEmpty(val) ? val.length : 0
            };
          })
          .value();

        let reals_count_group_by_channel = _(reals)
          .groupBy("ChannelName")
          .map(function(val, key) {
            return {
              channel: key,
              count: true !== wna.IsNullOrEmpty(val) ? val.length : 0
            };
          })
          .value();

        let fakes_count_order_by_channel = _.map(channels, c => {
          let entry_of_channel = _.find(fakes_count_group_by_channel, {
            channel: c
          });

          if (
            true !== wna.IsNullOrEmpty(entry_of_channel) &&
            true !== wna.IsNullOrUndefined(entry_of_channel.count)
          ) {
            return entry_of_channel.count;
          } else {
            return 0;
          }
        });

        let reals_count_order_by_channel = _.map(channels, c => {
          let entry_of_channel = _.find(reals_count_group_by_channel, {
            channel: c
          });

          if (
            true !== wna.IsNullOrEmpty(entry_of_channel) &&
            true !== wna.IsNullOrUndefined(entry_of_channel.count)
          ) {
            return entry_of_channel.count;
          } else {
            return 0;
          }
        });

        //  2) Construct the bar-chart model
        let barChart1Model = {
          categories: channels,
          series: [
            {
              name: "真",
              data: reals_count_order_by_channel,
              itemStyle: {
                color: "#7290F2"
              }
            },
            {
              name: "假",
              data: fakes_count_order_by_channel,
              itemStyle: {
                color: "#F47373"
              }
            }
          ]
        };
        console.log(
          "------ fakes by channel ",
          fakes_count_order_by_channel
        );
        console.log(
          "------ all channels ",
          barChart1Model
        );
        thisvue.model.barChart1 = barChart1Model;
      },
      buildFakesByChannelBarChartSeries: function(metaData) {
         //orgnize metadata
        let series = metaData.reduce((acc,val) => {
          let dupIndex = acc.channels.indexOf(val.FakeProductStatusByChannel_ChanelId)
          // 根据channel 合并去重，同时重组
          if( dupIndex < 0){
            acc.channels.push(val.FakeProductStatusByChannel_ChanelId)
            acc.fakeCounts.push(val.FakeProductStatusByChannel_DiscriminantResult)
            acc.realCounts.push(val.FakeProductStatusByChannel_ProductCount)
          }else{
            acc.fakeCounts[dupIndex] += val.FakeProductStatusByChannel_DiscriminantResult;
            acc.realCounts[dupIndex] += val.FakeProductStatusByChannel_ProductCount;
          }
          return acc;
        },{
          channels:[],
          fakeCounts:[],
          realCounts:[],
        })
        //  2) Construct the bar-chart model
        let barChart1Model = {
          categories: series.channels.map(val => {
            console.log("----series",val)
            console.log("----series",this.channelIdAndNameMap[val])
            return this.channelIdAndNameMap[val]
          }),
          series: [
            {
              name: this.locale.valuesMapping.DiscriminantResult[1],
              data: series.realCounts,
              itemStyle: {
                color: "#7290F2"
              }
            },
            {
              name: this.locale.valuesMapping.DiscriminantResult[0],
              data: series.fakeCounts,
              itemStyle: {
                color: "#F47373"
              }
            }
          ]
        };
        this.dashboardModel.barChart1 = barChart1Model;
      },
      buildChannelConfidenceBarChartModel: function() {
        let thisvue = this;
        let model = thisvue.model;
        let fakes = model.fakes;
        let results = model.results;
        let channels = model.channels;

        let fakes_count_group_by_confidence = _(results)
          .groupBy("ConfidenceLevelBucketName")
          .map(function(val, key) {
            //key is ConfidenceLevelBucket value,
            //val is array of fakes under the same ConfidenceLevelBucket
            let fakes_count_of_channles = [];
            _.each(channels, function(c) {
              let fakes_in_channel = _.filter(val, {
                DiscriminantResult: 0,
                channel: c
              });
              fakes_count_of_channles.push(
                true !== wna.IsNullOrEmpty(fakes_in_channel)
                  ? fakes_in_channel.length
                  : 0
              );
            });

            return {
              name: key,
              data: fakes_count_of_channles
            };
          })
          .value();

        let barChart2Model = {
          categories: channels,
          series: fakes_count_group_by_confidence
        };

        //console.log('------- check check ', _.groupBy(fakes, 'ConfidenceLevelBucketName'));
        thisvue.model.barChart2 = barChart2Model;
      },
      onDateRangeChange: function(ev) {
        let thisvue = this;
        let hasData = true !== wna.IsNullOrEmpty(ev.detail);
        let start = true === hasData ? ev.detail.start : null;
        let end = true === hasData && null !== start ? ev.detail.end : null;
        if(start && end ) {
          thisvue.viewState.start_date =start.format('YYYY-MM-DD 00:00:00');
          thisvue.viewState.end_date =end.format('YYYY-MM-DD 23:59:59');
        }
        
        console.log("------- onDateRangeChange >", thisvue.path, ev.detail);
        thisvue.requestTabAndDropdownData();
        thisvue.requestDashboardData({});
        thisvue.tableviewModelChange()
      },
      onRequestReturned: function(data, jqXHR, textStatus, errorThrown) {
        let thisvue = this;
        if (true !== wna.IsNullOrEmpty(data)) {
          if (true === data.success) {
            thisvue.buildBaseModelFromData(data.results);
            thisvue.buildSpecificModelFromData(data.results);
            thisvue.buildFilters();

            if (true === wna.IsNullOrEmpty(thisvue.model.results)) {
              thisvue.model.trendChart = null;
              thisvue.model.barChart1 = null;
              thisvue.model.barChart2 = null;
              thisvue.model.pieChart = null;

              return;
            }

            // I - prepare the model for trend-chart
            thisvue.buildTrendChartModel();

            // II - Prepare the model for the pie-chart
            thisvue.buildPieChartModel();

            //  III - Prepare the model for the bar-chart-1 (各渠道假货统计（比例、数量)
            thisvue.buildChannelFakesBarChartModel();

            //  IV - Prepare the model for the bar-char-2
            thisvue.buildChannelConfidenceBarChartModel();
          } else {
            alert("Query Data Not Success, message: " + data.msg);
          }
        } else {
          if (true !== wna.IsNullOrUndefined(jqXHR)) {
            alert("Query Data got Error: ", textStatus);
          } else {
            alert("Empty Data");
          }
        }
        console.log(
          "------- onRequestReturned: ",
          data,
          jqXHR,
          textStatus,
          errorThrown
        );
      },
      onTableviewToolsButtonClicked: function(ev) {
        let thisvue = this;
        if (true !== wna.IsNullOrEmpty(ev.detail)) {
          let detail = ev.detail;
          let btnid = $(detail.target).val();

          if (true === wna.IsFunction(detail.callback)) {
            let args = [];
            if ("launch" === btnid || "feedback" === btnid) {
              args = [detail.selectedRows];
            } else {
              args = [detail.tabid, detail.filters, detail.searchNeedle];
            }

            detail.callback.apply(thisvue, args);
          }
        }
      },
      feedbackCommit: function() {
        // $('#complaints-insufficient-quota').modal();
        // $('#complaints-no-authority').modal();
        // $("#feedback").modal("hide");
        //发送用户信息反馈
        var submitFeedbackData = {
          ResultIds: selectionData.join(","),
          feedbackContent: this.feedbackTextarea,
          feedbackOptionId: this.feedbackBtnId
        };
        var that = this;
        let url = `https://bps-mynodesql-api.blcksync.info:444/v0/feedback/submit/commodity_test_report?key=submit_feedback`;
        $.ajax({
          url: url,
          type: "POST",
          changeOrigin: true,
          dataType: "json",
          contentType: "application/json",
          headers: {
            Authorization:
              "Bearer " + JSON.parse(localStorage.getItem("token")).val + ""
          },
          data: JSON.stringify(submitFeedbackData),
          success: function(rex) {
            $("#feedback").modal('hide');
            $("#received-success").modal();
            //重新调取接口数据
            that.tableviewModelChange({});
          },
          error: function(response) {}
        });
      },
      normalQuota: function() {
        $("#complaints-normal-quota").modal('hide');
        //用户发起投诉
        var submitFeedbackData = {
          UserId: JSON.parse(localStorage.getItem("UserId"))&&JSON.parse(localStorage.getItem("UserId")).val,
          ResultId: selectionData.join(",")
        };
        var that = this;
        let reportUrl = `https://bps-mynodesql-api.blcksync.info:444/v0/update/report/commodity_test_report?key=submit_rights_status`;
        $.ajax({
          url: reportUrl,
          type: "PUT",
          dataType: "json",
          contentType: "application/json",
          changeOrigin: true,
          headers: {
            Authorization:
              "Bearer " + JSON.parse(localStorage.getItem("token")).val + ""
          },
          data: JSON.stringify(submitFeedbackData),
          success: function(rex) {
            $('#complaints-success').modal();
             //重新调取接口数据
             that.tableviewModelChange({});
          },
          error: function(response) {
           
          }
        });
      },
      feetbackBtnClick:function(ctx){
        this.feedbackBtnId=ctx;
      }
    }
  });
})();

(function(){
    
    Vue.component('vc-dialog', {
        template: `
        <div class="modal fade" :id="id" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">
                            <slot name="title">
                            </slot>
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <slot name="body" :view-model="viewModel" :locale="locale" :lang="lang">
                        </slot>
                    </div>
                    <div class="modal-footer">
                        <slot name="foot" :view-model="viewModel.footer" :locale="locale" :lang="lang">
                        </slot>
                    </div>
                </div>
            </div>
        </div>
        `,
        props: ['id', 'viewModel', 'locale', 'lang']
    });

})();
(function(){
      Vue.component('vc-settings', {
        template: `
            <div class="main-content-body">
                <div class="main-table">
                    <vc-tableview2 id="settingsTableView" :model="model.results" :view-model="viewModel.tableview" :locale="localeForSubview('tableview')" 
                        v-on:tools-button-clicked.native="onTableviewToolsButtonClicked"
                        v-on:tab-change="onTableviewTabChange">
                    </vc-tableview2>
                </div>
                <!-- Modal -->
                <vc-dialog ref="uploadModal" id="settingsView_uploadDialog" :locale="localeForSubview('uploadDialog')" :view-model="viewModel">
                    <template v-slot:title="slotProps">
                        {{locale.uploadDialog.title}}
                    </template>
                    <template v-slot:body="slotProps">
                        <div class="form-group align-left" v-if="null === viewState.uploadState">
                            <label>{{locale.uploadDialog.caption}}</label>
                            <p class="help-block" v-html="descriptionText"></p>
                            <input type="file" v-on:change="onFilesChange($event.target.name, $event.target.files)">
                        </div>
                        <div class="form-group" v-if="'progress' === viewState.uploadState">
                            <div class="upload-modal-icon progress"></div>
                            <label>{{locale.uploadDialog.progress.caption}}</label>
                            <p class="help-block">{{locale.uploadDialog.progress.description}}</p>
                        </div>
                        <div class="form-group" v-if="'success' === viewState.uploadState">
                            <div class="upload-modal-icon success"></div>
                            <label>{{locale.uploadDialog.success.caption}}</label>
                            <p class="help-block">{{locale.uploadDialog.success.description}}</p>
                        </div>
                        <div class="form-group" v-if="'failed' === viewState.uploadState">
                            <div class="upload-modal-icon failed"></div>
                            <label>{{locale.uploadDialog.failed.caption}}</label>
                            <p class="help-block">{{locale.uploadDialog.failed.description}}</p>
                        </div>
                    </template>
                    <template v-slot:foot="slotProps">
                        <button type="button" class="btn btn-blue" 
                            v-on:click="onUploadButtonClicked"
                            v-if="null === viewState.uploadState"><img src="assets/icons/icon_upload.png" />{{locale.uploadDialog.uploadButton}}</button>
                        <button type="button" class="btn btn-blue" data-dismiss="modal" 
                            v-if="('success' === viewState.uploadState) || ('failed' === viewState.uploadState)">Ok</button>
                    </template>
                </vc-dialog>
            </div>
        `,
        props: ['path', 'locale', 'sharedLocale', 'lang'],
        data: function(){
            return {
                model: {
                    results: []
                },
                viewModel: {
                    tableview: {
                        tabs: [
                            {
                                id: 'tab_anticounterfeiting',
                                filter: function(dataset){
                                    console.log('------ > tab_anticounterfeiting activated', dataset);
                                    return dataset;
                                },
                                default: true
                            },/*
                            {
                                id: 'tab_lowprice',
                                filter: function(dataset){
                                    console.log('------ > tab_lowprice activated', dataset);
                                    return dataset;
                                }
                            },
                            {
                                id: 'tab_transshipment',
                                filter: function(dataset){
                                    console.log('------ > tab_transshipment activated', dataset);
                                    return dataset;
                                }
                            }*/
                        ],
                        cols: [ //the colums that we'd like to display
                            {
                                fieldid: 'code',
                            },
                            {
                                fieldid: 'Industry'
                            },
                            {
                                fieldid: 'Brand'
                            },
                            {
                                fieldid: 'Category'
                            },
                            {
                                fieldid: 'series'
                            },
                            {
                                fieldid: 'model',
                            },
                            {
                                fieldid: 'channel',
                            }
                        ],
                        filters: [
                            {
                                fieldid: 'channel',
                                source: 'channels',
                                options: []
                            },
                            {
                                fieldid: 'series',
                                source: 'series',
                                options: []
                            },
                            {
                                fieldid: 'model',
                                source: 'models',
                                options: []
                            }
                        ],
                        buttons: [
                            {
                                id: 'import',
                                icon: 'assets/icons/icon_products_import.png',
                                classes: ['btn-white'], //or null
                                toggleModal: '#settingsView_uploadDialog'
                                /*
                                callback: function(dataset){
                                    console.log('------ > button(import): clicked!', dataset);
                                }*/
                            },
                            {
                                id: 'export',
                                icon: 'assets/icons/icon_export.png',
                                classes: ['btn-red'],
                                callback: function(tabid, filters, searchNeedle){
                                    //we can use 'this' to refer to this vue-component object is because we do callback apply in method onTableviewToolsButtonClicked
                                    let thisvue = this; 
                                    let vwmodel = thisvue.viewModel;
                                    let vwstate = thisvue.viewState;

                                    filters = (true === wna.IsNullOrEmpty(filters)) ? null : filters;

                                    let conditions = filters; //{ filters, tabid };

                                    thisvue.$emit('request-export', thisvue.path, conditions, thisvue);
                                    console.log('------ > button(export): clicked!', dataset);
                                }
                            }
                        ]
                    },
                    uploadDialog: {
                        footer: {}
                    }
                },
                viewState: {
                    uploadState: null,
                    selectedFiles: null
                }
            }
        },
        computed: {
            /*
            currentLocale: function(){
                let ret = _locales[this.lang]; //_.extend({common: this.locale.shared.common}, _locales[this.lang]);
                return ret;
            },
            */
           descriptionText: function(){
               let thisvue = this;
               ret = thisvue.locale.uploadDialog.description;
               if ((null === thisvue.viewState.uploadState) && (true !== wna.IsNullOrEmpty(ret))){
                   ret = ret.replace("（###", "（<a href='assets/import_temp.csv' target='_blank'>");
                   ret = ret.replace("###）", "</a>）");
               }
               return ret;
           }
        },
        methods: {
            localeForSubview: function(subviewname){
                let ret =  _.extend({ common: this.sharedLocale.common}, this.locale[subviewname]);
                return ret;
            },
            buildBaseModelFromData: function(data){
                let thisvue = this;
                let channels = _.map(data.channel, 'channel');
                let series = _.map(data.series, 'series');
                let models = _.map(data.model, 'model');
                let results = data.results;
                
                thisvue.model.models = models;
                thisvue.model.series = series;
                thisvue.model.results = results;
                thisvue.model.channels = channels;
            },
            buildFilters: function(){
                let thisvue = this;
                let tbviewViewModel = thisvue.viewModel.tableview;
                
                _.each(tbviewViewModel.filters, function(filter_entry){
                    if ((true !== wna.IsNullOrEmpty(filter_entry)) && (true !== wna.IsNullOrEmpty(filter_entry.source))){
                        filter_entry.options = thisvue.model[filter_entry.source];
                    }
                });
            },
            /*
            onDateRangeChange: function(ev){
                let thisvue = this;
                let hasData = (true !== wna.IsNullOrEmpty(ev.detail));
                let start = (true === hasData) ? ev.detail.start : null;
                let end = (true === hasData) && (null !== start) ? ev.detail.end : null;

                console.log('------- onDateRangeChange >', thisvue.path, ev.detail);
                thisvue.$emit('request-data', thisvue.path, start, end, {keys: ['channel', 'series', 'model']}, thisvue.onRequestReturned, thisvue);
            },*/
            onTableviewToolsButtonClicked: function(ev){
                let thisvue = this;
                
                if (true !== wna.IsNullOrEmpty(ev.detail)){
                    let detail = ev.detail;
                    let btnid = $(detail.target).val();

                    if (('export' === btnid) && (true === wna.IsFunction(detail.callback))){
                        let args = [detail.tabid, detail.filters, detail.searchNeedle];
                        detail.callback.apply(thisvue, args);
                    }
                }
            },
            onTableviewTabChange: function(tabid){
                let thisvue = this;
                
                console.log('-------- settingsView onTableviewTabChange: ', tabid, thisvue.path);
                thisvue.$emit('request-data', thisvue.path, null, null, {keys: ['channel', 'series', 'model']}, thisvue.onRequestReturned, thisvue);
            },
            onRequestReturned: function(data, jqXHR, textStatus, errorThrown){
                let thisvue = this;
                if (true !== wna.IsNullOrEmpty(data)){
                    if (true === data.success){
                        thisvue.buildBaseModelFromData(data.results);
                        thisvue.buildFilters();


                    }else{
                        alert('Query Data Not Success, message: ' + data.msg);
                    }
                }else{
                    if (true !== wna.IsNullOrUndefined(jqXHR)){
                        alert('Query Data got Error: ', textStatus);
                    }else{
                        alert('Empty Data');
                    }
                }
                console.log('------- onRequestReturned: ', data, jqXHR, textStatus, errorThrown);
            },
            onFilesChange: function(name, files){
                let thisvue = this;
                thisvue.viewState.selectedFiles = files;
                console.log('------- onFilesChange: ', name, files);
            },
            onUploadButtonClicked: function(){
                let thisvue = this;
                let files = thisvue.viewState.selectedFiles;
                if (true !== wna.IsNullOrEmpty(files)){
                    console.log('------- Upload Files...', files);  
                    thisvue.viewState.uploadState = 'progress';
                    thisvue.$emit('request-upload', thisvue.path, files, thisvue.onUploadRequestReturn, thisvue);
                }

            },
            onUploadRequestReturn: function(data, jqXHR, textStatus, errorThrown){
                let thisvue = this;
                let vwstate = thisvue.viewState;

                if ((true !== wna.IsNullOrEmpty(data)) && (true === data.success)){
                    vwstate.uploadState = 'success';
                }else{
                    vwstate.uploadState = 'failed';
                }
            }
    
        },
        //##Life-cycle Hooks
        mounted: function(){
            //$(thisvue.$refs.uploadModal.$el).on('shown.bs.modal', thisvue.onUploadModalShown);
            (function(thisvue){
                let vwstate = thisvue.viewState;

                $(thisvue.$el).on('shown.bs.modal', function(ev){
                    $(ev.target).one('hide.bs.modal', function(ev){   
                        console.log('------- modal hide: ', vwstate.uploadState); 
                        if (('success' === vwstate.uploadState) || ('failed' === vwstate.uploadState)){
                            vwstate.uploadState = null;
                        }else if ('progress' === vwstate.uploadState){
                            ev.stopPropagation();
                        }
                    }).appendTo('body');
                });
            })(this);

        },
        updated: function(){
            console.log('------------ settingsView updated: ');
        }

    });
})();
(function() {
  Vue.component("vc-loginwarp", {
    template: `
  <div id='content'>
    <div id="login-adv">
        <div class="main-info">{{lang}}
            <h3>{{locale.mainInfo}}</h3>
            <p>{{ locale.subInfo }}</p>
        </div>
    </div>
    <div id="login-form">
        <h2 class="login-title">{{ locale.loginTitle }}</h2>
        <div class="password-status-info" v-if="isPasswordError">
            <p>{{ locale.passwordStatusInfo3 }}<a href="#">{{ locale.passwordStatusInfo }}</a>{{ locale.passwordStatusInfo2 }}</p>
        </div>
        <div class="email-status-info" v-if="isEmailStatus">
            <p>{{ locale.emailStatusInfo3 }}{{ locale.emailStatusInfo }}{{ locale.emailStatusInfo2 }}</p>
        </div>
        <div class="login-status-info" v-if="isLoginStatus">
            <span></span>
            <p>{{ locale.loginStatusinfo }}</p>
        </div>
        <form>
            <div class="form-group" >
                <input type="text" class="form-control" :placeholder=" locale.inputName " v-model="Verification.inputAdress.value" >
               
            </div>
            <div class="form-group" >
                <input type="password" class="form-control" :placeholder=" locale.inputPassword"  v-model="Verification.inputPassword.value"  >
            </div> 
            <div class="checkbox">
                <label v-on:click="checkboxToggle">
                    <span class="s-checkbox" type="checkbox" :class="{'active':isActive}"></span> {{ locale.rememberMe
                    }}
                </label>
                <p class="forget-password"><a href="javascript:void(0);" @click="goToPassword">{{ locale.forget }}</a>
                </p>
            </div>
            <div class="form-group">
                <div id="check-slide"></div>
            </div>
            <button type="button" class="submit btn btn-default" @click="goToLogin">{{ locale.signIn }}</button>
            <p class="help-block">{{ locale.helpBlock }}<a href="javascript:void(0);" @click="goToRegister">{{ locale.helpBlockInfo
                }}</a></p>
        </form>
    </div>
    <div class="modal fade" id="register-error" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-body">
                <span class="modal-success-icon"></span>
                <h3>{{ locale.registerError }}</h3>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" @click="goToRegister">{{ locale.registerErrorBtn }}</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="login-success" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-body">
                <span class="modal-success-icon"></span>
                <h3>{{ locale.loginSuccessInfo }}</h3>
            </div>
            <div class="modal-footer">
               <p>{{ locale.loginSuccessInfo2 }}</P>
            </div>
        </div>
    </div>
</div>


</div> 
        `,
    data: function() {
      return {
        isEmailStatus: false,
        isLoginStatus: false,
        isPasswordError: false,
        isActive: false,
        Verification: {
          inputAdress: { value: "", icon: 1, status: "" },
          inputPassword: {
            value: "",
            icon: 1,
            status: ""
          }
        },
        slideResult: false,
        isRemenber: false,
        isPasswordStatusInfo: false,
        isEmailStatusInfo: false
      };
    },
    created() {},
    watch: {
      Verification: {
        handler(newValue, oldValue) {
          for (let key in newValue) {
            if (newValue.hasOwnProperty(key)) {
              let element = newValue[key];
              newValue[key].icon = Number(!this.required(newValue[key].value));
            }
          }
        },
        deep: true
      }
    },
    mounted() {
      var that = this;
      //注册邮箱状态判断
      if (this.$route.query.activate_token) {
        //发送验证请求 
        let url = `https://bps-mynodesql-api.blcksync.info:444/v0/users/activate?activate_token=`+ this.$route.query.activate_token + '&uuid='+that.$route.query["uuid"];
        $.ajax({
          url: url,
          type: "GEt",
          changeOrigin: true,
          success: function(rex) {
            that.$router.push({
              path:'./login'
            });
            //验证成功
            $("#login-success").modal();
            var id = setTimeout(function() {
              $("#login-success").modal("hide");
            }, 3000);
          },
          error: function(response) {
            //注册失败
            $("#register-error").modal();
          }
        });
      } else {
        //邮件请激活
        //  this.isEmailStatus = true;
      }
      let _this = this;

      if (this.getLocalStorage("user")) {
        this.Verification.inputAdress.value = this.getLocalStorage("user");
        this.Verification.inputPassword.value = this.getLocalStorage(
          "userPassword"
        );
      }
      $("#check-slide").slider({
        width: 320, // width
        height: 40, // height
        sliderBg: "#E8E8E8", // 滑块背景颜色
        color: "#666", // 文字颜色
        fontSize: 14, // 文字大小
        bgColor: "#E8E8E8", // 背景颜色
        textMsg: "Hold the slider drag to the far right", // 提示文字
        successMsg: "Verification passed", // 验证成功提示文字
        successColor: "#fff", // 滑块验证成功提示文字颜色
        time: 400, // 返回时间
        callback: function(result) {
          // 回调函数，true(成功),false(失败)
          if (result) $("#check-slide").addClass("success");
          _this.slideResult = result;
        }
      });
    },
    methods: {
      validateFunc(key) {
        let value = this.Verification[key].value;
        let status = "";
        if (key == "inputAdress") {
          status = this.required(value)
            ? this.email(value)
              ? "success"
              : "false"
            : "default";
        } else if (key == "inputPassword") {
          this.Verification[key].tips = 0;
          status = this.required(value)
            ? this.rangelength(value, [8, 16])
              ? "success"
              : "false"
            : "default";
          this.passwordInput(key);
        }
        key != "inputPassword" && (this.Verification[key].tips = 0);
        this.Verification[key].status = status;
      },
      resetDefault(key) {
        this.Verification[key].status == "default" &&
          (this.Verification[key].status = "");
        key == "inputPassword" &&
          ((this.Verification[key].tips = 1), this.passwordInput(key));
      },
      goToPassword() {
        this.$router.push({ path: "/password" });
      },
      email: function(value) {
        if (value == null || this.trim(value) == "") return true;
        return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
          value
        );
      },
      required(value) {
        return value.trim().length > 0;
      },
      passwordInput(key) {
        let level = 0;
        let strength1, strength2, strength3;
        this.required(this.Verification[key].value) &&
        this.rangelength(this.Verification[key].value, [5, 25])
          ? ((strength1 = "success"), level++)
          : (strength1 = "false");
        this.required(this.Verification[key].value) &&
        this.rangelength(this.Verification[key].value, [5, 25])
          ? ((strength2 = "success"), level++)
          : (strength2 = "false");
        this.required(this.Verification[key].value) &&
        this.rangelength(this.Verification[key].value, [5, 25])
          ? ((strength3 = "success"), level++)
          : (strength3 = "false");
        this.Verification[key].strength = {
          strength1: strength1,
          strength2: strength2,
          strength3: strength3
        };
        this.Verification[key].strength.level =
          level < 2 ? "low" : level < 3 ? "center" : "high";
      },
      //字符串长度的范围
      rangelength: function(value, param) {
        if (value == null || this.trim(value) == "") return true;
        return value.length >= param[0] && value.length <= param[1];
      },
      //密码
      password: function(value, param) {
        if (value == null || this.trim(value) == "") return true;
        var rex = /^(?=.*\d+)(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*[^A-Za-z0-9\s]+)\S{8,16}$/;
        return rex.test(value);
      },
      trim(value) {
        return value.replace(/(^\s*)|(\s*$)/g, "");
      },
      checkboxToggle: function() {
        this.isActive = !this.isActive;
        this.isRemenber = !this.isRemenber;
      },
      goToRegister() {
        $("#register-error").modal("hide");
        this.$router.push({ path: "/register" });
      },
      goToLogin() {
        var that = this;
        if (this.slideResult) {
          //users/login
          let url = `https://bps-mynodesql-api.blcksync.info:444/v0/users/login`;
          let data = {
            email: this.Verification.inputAdress.value,
            password: this.Verification.inputPassword.value,
            expire: 14400
          };
          $.ajax({
            url: url,
            type: "POST",
            dataType: "json",
            changeOrigin: true,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function(data) {
              console.log(data);
              //账号密码错误
              // isLoginStatus = false;
              if (that.isRemenber) {
                that.setLocalStorage(
                  "user",
                  that.Verification.inputAdress.value
                );
                that.setLocalStorage(
                  "userPassword",
                  that.Verification.inputPassword.value
                );
              }
                that.setLocalStorage(
                  "policy",
                  data.policy
                );
                that.setLocalStorage(
                  "token",
                  data.token
                );
                that.setLocalStorage(
                  "userid",
                  data.UserId
                );
                that.setLocalStorage(
                  "username",
                  data.Username
                );
                that.setLocalStorage(
                "balance",
                data.balance
              );
              that.setLocalStorage("token", data.token);
              that.setLocalStorage("UserId", data.user.UserId);
              that.$router.push({ path: "/CounterfeitProduct" });
            },
            error: function(response) {
              //账号密码错误
              that.isLoginStatus = true;
            }
          });
        }
      },
      //账号本地存储时效
      setLocalStorage(key, value) {
        var curtime = new Date().getTime(); // 获取当前时间 ，转换成JSON字符串序列
        var valueDate = JSON.stringify({
          val: value,
          timer: curtime
        });
        localStorage.setItem(key, valueDate);
      },
      getLocalStorage(key) {
        var exp = 60 * 60 * 24 * 1000 * 30; // 一天的秒数
        if (localStorage.getItem(key)) {
          var vals = localStorage.getItem(key); // 获取本地存储的值
          var dataObj = JSON.parse(vals); // 将字符串转换成JSON对象
          // 如果(当前时间 - 存储的元素在创建时候设置的时间) > 过期时间
          var isTimed = new Date().getTime() - dataObj.timer > exp;
          if (isTimed) {
            localStorage.removeItem(key);
            return null;
          } else {
            var newValue = dataObj.val;
          }
          return newValue;
        } else {
          return null;
        }
      }
    },
    props: ["model", "locale", "lang", "sharedLocale"]
  });
})();

(function() {
  Vue.component("vc-registerwarp", {
    template: `
    <div id="content">
    <div class="register-container">
        <div class="register-box">
                <div id="register-form">
                        <h2 class="login-title">{{ locale.registerTitle }}</h2>
                        <form>
                            <div class="form-group" :data-status="Verification.inputName.status">
                                <em style="color: #CD454A;" v-if="Verification.inputName.icon">*</em>
                                <input type="text" class="form-control" :placeholder="locale.inputName" v-model="Verification.inputName.value" @blur="validateFunc('inputName')" @focus="resetDefault('inputName')">
                                    <span class="input-status"></span>
                                    <p class="status-info">{{ locale.inputNameInfo }}</p>
                            </div>
                            <div class="form-group" :data-status="Verification.inputAdress.status">
                                    <em style="color: #CD454A;" v-if="Verification.inputAdress.icon">*</em>
                                    <input type="text" class="form-control"  :placeholder="locale.inputAdress" v-model="Verification.inputAdress.value" @blur="validateFunc('inputAdress')" @focus="resetDefault('inputAdress')">
                                    <span class="input-status"></span>
                                    <p class="status-info">{{locale.inputAdressInfo}}</p>
                                </div>
                                <div class="form-group" :data-status="Verification.inputCompany.status">
                                        <em style="color: #CD454A;" v-if="Verification.inputCompany.icon">*</em>
                                        <input type="text" class="form-control"  :placeholder="locale.inputCompany"  v-model="Verification.inputCompany.value" @blur="validateFunc('inputCompany')" @focus="resetDefault('inputCompany')">
                                        <span class="input-status"></span>
                                        <p class="status-info">{{locale.inputCompanyInfo}}</p>
                                    </div>
                            <div class="form-group" :data-status="Verification.inputPassword.status">
                                    <em style="color: #CD454A;"  v-if="Verification.inputPassword.icon">*</em>
                            <input type="password" class="form-control" id="registerPassword1" :placeholder="locale.inputPassword" v-model="Verification.inputPassword.value"  @keyup="passwordInput('inputPassword')" @blur="validateFunc('inputPassword')" @focus="resetDefault('inputPassword')">
                                    <span class="input-status"></span>
                                    <p class="status-info">{{locale.inputPasswordInfo}}</p>
                                    <div class="status-tips" :class="{'tipShow':Verification.inputPassword.tips}">
                                            <div class="strength">
                                                <p>{{locale.statusTips}}</p>
                                                <div class="strength-box" :data-status="Verification.inputPassword.strength.level" v-model="level">
                                                    <span></span>
                                                    <span></span>
                                                    <span></span>
                                                </div>
                                                <p class="strength-info">{{level}}</p>
                                            </div>
                                            <p class="strength-status" :data-status="Verification.inputPassword.strength.strength1"><span></span>{{locale.strengthStatus1}} </p>
                                            <p class="strength-status" :data-status="Verification.inputPassword.strength.strength2"><span></span>{{locale.strengthStatus2}} </p>
                                            <p class="strength-status" :data-status="Verification.inputPassword.strength.strength3"><span></span>{{locale.strengthStatus3}} </p>
                                        </div>
                            </div>
                            <div class="form-group" :data-status="Verification.inputConfirm.status">
                                    <em style="color: #CD454A;" v-if="Verification.inputConfirm.icon">*</em>
                                    <input type="password" class="form-control" :placeholder="locale.inputConfirm" v-model="Verification.inputConfirm.value" @blur="validateFunc('inputConfirm')" @focus="resetDefault('inputConfirm')">
                                    <span class="input-status"></span>
                                    <p class="status-info">{{locale.inputConfirmInfo}}</p>
                            </div>
                            <div class="form-group" :data-status="Verification.inputMobile.status">
                                    <div class="input-group">
                                        <div class="input-group-addon">{{locale.inputNumberMobile}}</div>
                                        <input type="text" class="form-control"  :placeholder="locale.inputMobile" v-model="Verification.inputMobile.value" @keyup="canClickGetCode(Verification.inputMobile.value)" @blur="validateFunc('inputMobile')" @focus="resetDefault('inputMobile')">
                                    </div>
                                        <span class="input-status"></span>
                                        <p class="status-info">{{locale.inputMobileInfo}}</p>
                            </div>
                            <div class="form-group code-verification" :data-status="Verification.inputVerification.status">
                                <input type="text" class="form-control"  :placeholder="locale.inputVerification" v-model="Verification.inputVerification.value" @blur="validateFunc('inputVerification')" @focus="resetDefault('inputVerification')">
                                <button type="button" class="btn btn-default" @click="sendCode">{{locale.inputVerificationBtn}}</button>
                                <span class="input-status"></span>
                                <p class="status-info">{{locale.inputVerificationInfo}}</p>
                            </div>
                            
                            <button type="button" class=" submit btn btn-default" @click="registerr">{{ locale.signIn }}</button>
                            <p class="help-block">{{ locale.helpBlock }}<a href="javascript:void(0);" @click="goToLoginPage">{{ locale.helpBlockInfo }}</a>  </p>
                        </form>
                </div>
        </div>
    </div>
    <div class="modal fade" id="register" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                    <span class="modal-success-icon"></span>
                        <h3>{{ locale.modalRegisterH3 }}</h3>
                        <p>{{ locale.modalRegisterP }}</p>
                    </div>
                    <div class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="modalGoToLoginPage">OK</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="register-error" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-body">
                <span class="modal-success-icon"></span>
                    <h3>{{ locale.modalRegisterErrorH3 }}</h3>
                    <p>{{ locale.modalRegisterErrorP }}</p>
                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-primary" @click="$('#register-error').modal('hide')">OK</button>
                </div>
            </div>
        </div>
    </div>
</div>
    `,
    props: ["model", "locale", "lang", "sharedLocale"],
    created() {
      console.log("login page");
    },
    data: function() {
      return {
        codeNum: null,
        verifysmsrequest: false,
        level: "low",
        Verification: {
          inputName: { value: "", icon: 1, status: "" },
          inputCompany: { value: "", icon: 1, status: "" },
          inputAdress: { value: "", icon: 1, status: "" },
          inputPassword: {
            value: "",
            icon: 1,
            status: "",
            tips: 0,
            strength: {
              level: "low",
              strength1: "false",
              strength2: "false",
              strength3: "false"
            }
          },
          inputConfirm: { value: "", icon: 1, status: "" },
          inputMobile: { value: "", icon: 1, status: "", isClick: false },
          inputVerification: { value: "", icon: 1, status: "" }
        }
      };
    },
    watch: {
      Verification: {
        handler(newValue, oldValue) {
          for (let key in newValue) {
            if (newValue.hasOwnProperty(key)) {
              let element = newValue[key];
              newValue[key].icon = Number(!this.required(newValue[key].value));
            }
          }
        },
        deep: true
      }
    },
    methods: {
      registerr() {
        if (
          this.Verification.inputConfirm.status == "success" &&
          this.Verification.inputCompany.status == "success" &&
          this.Verification.inputAdress.status == "success" &&
          this.Verification.inputName.status == "success" &&
          this.Verification.inputPassword.status == "success"
        ) {
          var that = this;
          // user/signup
          let url = `https://bps-mynodesql-api.blcksync.info:444/v0/users/signup`;
          let dataRegister = {
            email: this.Verification.inputAdress.value,
            password: this.Verification.inputPassword.value,
            telnum: this.Verification.inputMobile.value,
            company: this.Verification.inputCompany.value,
            username: this.Verification.inputName.value
          };
          $.ajax(url, {
            type: "POST",
            data: dataRegister,
            success: function(data) {
              if (that.isRemenber) {
                that.setLocalStorage(
                  "user",
                  that.Verification.inputAdress.value
                );
                that.setLocalStorage(
                  "userPassword",
                  that.Verification.inputPassword.value
                );
              }
              //邮件确认弹窗
              $("#register").modal("toggle");
            },
            error: function(response) {
              $("#register-error").modal("toggle");
            }
          });
        }
      },
      sendCode() {
        // user/verifysmsrequest（发送短信验证码）
        if (this.Verification.inputMobile.status == "success") {
          var num = 60,
            str = null;
          var interval = setInterval(function() {
            $("#register-form .code-verification .btn").prop("disabled", true);
            num--;
            str = "Resend in " + num + "s";
            $("#register-form .code-verification .btn").html(str);
            if (num < 0) {
              $("#register-form .code-verification .btn").html("get code");
              $("#register-form .code-verification .btn").prop(
                "disabled",
                false
              );
              clearInterval(interval);
            }
          }, 1000);
          let url = `https://bps-mynodesql-api.blcksync.info:444/v0/users/verifysmsrequest`;
          let dataSendCode = {
            email: this.Verification.inputAdress.value,
            telnum: this.Verification.inputMobile.value
          };
          $.ajax(url, {
            type: "POST",
            data: JSON.stringify(dataSendCode),
            contentType: "application/json",
            success: function(data) {},
            error: function(response) {}
          });
        }
      },
      modalGoToLoginPage() {
        $("#register").modal("hide");
        this.$router.push({ path: "/login" });
      },
      goToLoginPage() {
        this.$router.push({ path: "/login" });
      },
      validateFunc(key) {
        var value = this.Verification[key].value;
        var status = "";
        if (key == "inputName") {
          var rex = /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/;
          status = this.required(value)
            ? this.rangelength(value, [5, 20]) && rex.test(value)
              ? "success"
              : "false"
            : "default";
        } else if (key == "inputAdress") {
          status = this.required(value)
            ? this.email(value)
              ? "success"
              : "false"
            : "default";
        } else if (key == "inputCompany") {
          status = this.required(value)
            ? this.rangelength(value, [0, 50])
              ? "success"
              : "false"
            : "default";
        } else if (key == "inputPassword") {
          this.Verification[key].tips = 0;
          status = this.required(value)
            ? this.rangelength(value, [8, 16])
              ? "success"
              : "false"
            : "default";
          this.passwordInput(key);
        } else if (key == "inputConfirm") {
          status = this.required(value)
            ? value == this.Verification["inputPassword"].value
              ? "success"
              : "false"
            : "default";
        } else if (key == "inputMobile") {
          status = this.required(value)
            ? this.phone(value)
              ? "success"
              : "false"
            : "default";
        } else if (key == "inputVerification") {
          var that = this;
          // user/verifysmsrequest
          if (this.Verification.inputMobile.status == "success") {
            let url = `https://bps-mynodesql-api.blcksync.info:444/v0/users/verifysms`;
            let dataCheckCode = {
              email: this.Verification.inputAdress.value,
              telnum: this.Verification.inputMobile.value,
              smsid: this.Verification.inputVerification.value
            };
            $.ajax(url, {
              type: "POST",
              data: dataCheckCode,
              success: function(data) {
                that.verifysmsrequest = true;
                status = that.required(value)
                  ? that.rangelength(value, [5, 25]) && that.verifysmsrequest
                    ? "success"
                    : "false"
                  : "default";
                key != "inputPassword" && (that.Verification[key].tips = 0);
                that.Verification[key].status = status;
              },
              error: function(response) {
                that.verifysmsrequest = false;
                status = that.required(value)
                  ? that.rangelength(value, [5, 25]) && that.verifysmsrequest
                    ? "success"
                    : "false"
                  : "default";
                key != "inputPassword" && (that.Verification[key].tips = 0);
                that.Verification[key].status = status;
              }
            });
          }
        }
        key != "inputPassword" && (this.Verification[key].tips = 0);
        this.Verification[key].status = status;
      },
      resetDefault(key) {
        this.Verification[key].status == "default" &&
          (this.Verification[key].status = "");
        key == "inputPassword" &&
          ((this.Verification[key].tips = 1), this.passwordInput(key));
      },
      passwordInput(key) {
        var rex = /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/;
        var rexx = /^(?=.*\d)(?=.*[a-z])(?=.*[!@#$%^&*]).{5,}$/;
        let level = 0;
        let strength1, strength2, strength3;
        this.required(this.Verification[key].value) &&
        this.rangelength(this.Verification[key].value, [8, 16])
          ? ((strength1 = "success"), level++)
          : (strength1 = "false");
        this.required(this.Verification[key].value) &&
        this.rangelength(this.Verification[key].value, [8, 16]) &&
        rex.test(this.Verification[key].value)
          ? ((strength2 = "success"), level++)
          : (strength2 = "false");
        this.required(this.Verification[key].value) &&
        this.rangelength(this.Verification[key].value,  [8, 16]) &&
        rex.test(this.Verification[key].value) &&
        rexx.test(this.Verification[key].value)
          ? ((strength3 = "success"), level++)
          : (strength3 = "false");
        this.Verification[key].strength = {
          strength1: strength1,
          strength2: strength2,
          strength3: strength3
        };
        this.Verification[key].strength.level =
          level < 2 ? "low" : level < 3 ? "center" : "height";
        this.level = this.Verification[key].strength.level;
      },
      canClickGetCode(value) {
        this.Verification.inputMobile.isClick =
          this.required(value) && this.phone(value);
      },
      required(value) {
        return value.trim().length > 0;
      },
      email: function(value) {
        if (value == null || this.trim(value) == "") return true;
        return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,50}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,50}[a-zA-Z0-9])?)*$/.test(
          value
        );
      },
      //字符串长度的范围
      rangelength: function(value, param) {
        if (value == null || this.trim(value) == "") return true;
        return value.length >= param[0] && value.length <= param[1];
      },
      //手机号码
      phone: function(value) {
        if (value == null || this.trim(value) == "") return true;
        var rex = /^1[345789]\d{9}$/;
        return rex.test(value);
      },
      //密码
      password: function(value, param) {
        if (value == null || this.trim(value) == "") return true;
        var rex = /^(?=.*\d+)(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*[^A-Za-z0-9\s]+)\S{8,16}$/;
        return rex.test(value);
      },
      trim(value) {
        return value.replace(/(^\s*)|(\s*$)/g, "");
      },
      //账号本地存储时效
      setLocalStorage(key, value) {
        var curtime = new Date().getTime(); // 获取当前时间 ，转换成JSON字符串序列
        var valueDate = JSON.stringify({
          val: value,
          timer: curtime
        });
        console.log(valueDate);
        localStorage.setItem(key, valueDate);
      },
      getLocalStorage(key) {
        var exp = 60 * 60 * 24 * 1000 * 30; // 一天的秒数
        if (localStorage.getItem(key)) {
          var vals = localStorage.getItem(key); // 获取本地存储的值
          var dataObj = JSON.parse(vals); // 将字符串转换成JSON对象
          // 如果(当前时间 - 存储的元素在创建时候设置的时间) > 过期时间
          var isTimed = new Date().getTime() - dataObj.timer > exp;
          console.log(isTimed, new Date().getTime() - dataObj.timer);
          if (isTimed) {
            console.log("存储已过期");
            localStorage.removeItem(key);
            return null;
          } else {
            var newValue = dataObj.val;
          }
          return newValue;
        } else {
          return null;
        }
      }
    }
  });
})();

(function() {
  Vue.component("vc-passwordwarp", {
    template: `
        <div id="content">
        <div class="password-container">
            <div class="password-top" v-if="isforgetPassword">
                <h2 class="password-title">{{ locale.passwordTitle }}</h2>
            </div>
            <div class="password-top" v-if="isresetPassword">
            <h2 class="password-title">{{ locale.resetPasswordTitle }}</h2>
            </div>
            <div class="password-box" v-if="isforgetPassword">
                <div id="password-form">
                    <form>
                        <div class="form-group">
                            <p class="password-info">请输入您的账号，以进行密码重设</p>
                        </div>
                        <div class="form-group" :data-status="Verification.inputAdress.status">
                            <em style="color: #CD454A;" v-if="Verification.inputAdress.icon">*</em>
                            <input type="text" class="form-control" :placeholder="locale.inputAdress"
                                   v-model="Verification.inputAdress.value" @blur="validateFunc('inputAdress')"
                                   @focus="resetDefault('inputAdress')">
                            <span class="input-status"></span>
                            <p class="status-info">{{locale.inputAdressInfo}}</p>
                        </div>
                        <button type="button" class=" submit btn btn-default" @click="forgetpassword">确认找回</button>
                    </form>
                </div>
            </div>
            <div class="password-box" v-if="isresetPassword">
            <div id="password-form">
                <form v-if="isvisible">
                <div class="form-group">
                        <p class="password-info">账号：{{Verification.inputAdress.value}}</p>
                    </div>
                    <div class="form-group" :data-status="Verification.inputPassword.status">
                        <em style="color: #CD454A;" v-if="Verification.inputPassword.icon">*</em>
                        <input type="password" class="form-control" id="passwordPassword1"
                               :placeholder="locale.inputPassword" v-model="Verification.inputPassword.value"
                               @keyup="passwordInput('inputPassword')" @blur="validateFunc('inputPassword')"
                               @focus="resetDefault('inputPassword')">
                        <span class="input-status"></span>
                        <p class="status-info">{{locale.inputPasswordInfo}}</p>
                        <div class="status-tips" :class="{'tipShow':Verification.inputPassword.tips}">
                            <div class="strength">
                                <p>{{locale.statusTips}}</p>
                                <div class="strength-box" :data-status="Verification.inputPassword.strength.level" v-model="level">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                <p class="strength-info">{{level}}</p>
                            </div>
                            <p class="strength-status" :data-status="Verification.inputPassword.strength.strength1">
                                <span></span>{{locale.strengthStatus1}} </p>
                            <p class="strength-status" :data-status="Verification.inputPassword.strength.strength2">
                                <span></span>{{locale.strengthStatus2}} </p>
                            <p class="strength-status" :data-status="Verification.inputPassword.strength.strength3">
                                <span></span>{{locale.strengthStatus3}} </p>
                        </div>
                    </div>
                    <div class="form-group" :data-status="Verification.inputConfirm.status">
                        <em style="color: #CD454A;" v-if="Verification.inputConfirm.icon">*</em>
                        <input type="password" class="form-control" :placeholder="locale.inputConfirm"
                               v-model="Verification.inputConfirm.value" @blur="validateFunc('inputConfirm')"
                               @focus="resetDefault('inputConfirm')">
                        <span class="input-status"></span>
                        <p class="status-info">{{locale.inputConfirmInfo}}</p>
                    </div>


                    <button type="button" class=" submit btn btn-default" @click="resetpassword">{{locale.passwordStatusInfo3}}</button>
                </form>
                <div class="password-status-info" v-if="!isvisible">
                    <span class="modal-success-icon"></span>
                    <h3>{{locale.passwordStatusInfo1}}</h3>
                    <p>{{locale.passwordStatusInfo2}}</p>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" @click="modalGoToLoginPage">OK</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="password" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        <span class="modal-success-icon"></span>
                        <h3>{{locale.modalRepasswordH3}} </h3>
                        <p>{{locale.modalRepasswordP}} </p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" @click="passwordEmail">OK</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="password-error" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-body">
                    <span class="modal-success-icon"></span>
                    <h3>{{locale.modalpasswordErrorH3}} </h3>
                    <p>{{locale.modalpasswordErrorP}} </p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="$('#password-error').modal('hide')">OK</button>
                </div>
            </div>
        </div>
    </div>
        </div>
    </div>
    `,
    props: ["model", "locale"],
    created() {
      console.log("login page");
    },
    data: function() {
      return {
        passwordtoken: "",
        level: "low",
        isforgetPassword: true,
        isresetPassword: false,
        isvisible: true,
        Verification: {
          inputName: { value: "", icon: 1, status: "" },
          inputCompany: { value: "", icon: 1, status: "" },
          inputAdress: { value: "", icon: 1, status: "" },
          inputPassword: {
            value: "",
            icon: 1,
            status: "",
            tips: 0,
            strength: {
              level: "low",
              strength1: "false",
              strength2: "false",
              strength3: "false"
            }
          },
          inputConfirm: { value: "", icon: 1, status: "" },
          inputMobile: { value: "", icon: 1, status: "", isClick: false },
          inputVerification: { value: "", icon: 1, status: "" }
        }
      };
    },
    watch: {
      Verification: {
        handler(newValue, oldValue) {
          for (let key in newValue) {
            if (newValue.hasOwnProperty(key)) {
              let element = newValue[key];
              newValue[key].icon = Number(!this.required(newValue[key].value));
            }
          }
        },
        deep: true
      }
    },
    mounted() {
      if (this.$route.query.passwordtoken) {
        var that = this;
        this.isforgetPassword = false;
        this.isresetPassword = true;
        this.Verification.inputAdress.value = this.$route.query.email;
      }
    },
    methods: {
      modalGoToresetPage() {
        $("#password").modal("hide");
        this.isforgetPassword = false;
        this.isresetPassword = true;
      },
      forgetpassword() {
        var that = this;
        let dataforgetpassword = {
          email: this.Verification.inputAdress.value
        };
        //验证邮箱名称
        if (this.Verification.inputAdress.status == "success") {
          $.ajax(
            `https://bps-mynodesql-api.blcksync.info:444/v0/users/resetpassword`,
            {
              type: "Post",
              data: JSON.stringify(dataforgetpassword),
              contentType: "application/json",
              success: function(data) {
                $("#password").modal();
              },
              error: function(response) {
                $("#password-error").modal();
              }
            }
          );
        }
      },
      passwordEmail() {
        $("#password").modal("hide");
      },
      resetpassword() {
        var that = this;
        //需要token*
        let dataNewpassword = {
          passwordtoken: this.$route.query.passwordtoken,
          email: this.Verification.inputAdress.value,
          password: this.Verification.inputPassword.value
        };
        if (
          this.Verification.inputPassword.status == "success" &&
          this.Verification.inputConfirm.status == "success"
        ) {
          
          //新密码接口
          $.ajax(
            `https://bps-mynodesql-api.blcksync.info:444/v0/users/newpassword`,
            {
              type: "POST",
              data: JSON.stringify(dataNewpassword),
              contentType: "application/json",
              success: function(data) {
                that.isvisible = false;
              },
              error: function(response) {
                
              }
            }
          );
        }
      },
      goToResetPassword() {},
      modalGoToLoginPage() {
        $("#password").modal("hide");
        this.$router.push({ path: "/login" });
      },
      goToLoginPage() {
        this.$router.push({ path: "/login" });
      },
      validateFunc(key) {
        let value = this.Verification[key].value;
        let status = "";
        if (key == "inputName") {
          status = this.required(value);
          var rex = /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/;
          status = this.required(value)
            ? this.rangelength(value, [5, 20]) && rex.test(value)
              ? "success"
              : "false"
            : "default";
        } else if (key == "inputAdress") {
          status = this.required(value)
            ? this.email(value)
              ? "success"
              : "false"
            : "default";
        } else if (key == "inputCompany") {
          status = this.required(value)
            ? this.rangelength(value, [0, 50])
              ? "success"
              : "false"
            : "default";
        } else if (key == "inputPassword") {
          this.Verification[key].tips = 0;
          status = this.required(value)
            ? this.rangelength(value, [8, 16])
              ? "success"
              : "false"
            : "default";
          this.passwordInput(key);
        } else if (key == "inputConfirm") {
          status = this.required(value)
            ? value == this.Verification["inputPassword"].value
              ? "success"
              : "false"
            : "default";
        } else if (key == "inputMobile") {
          status = this.required(value)
            ? this.phone(value)
              ? "success"
              : "false"
            : "default";
        } else if (key == "inputVerification") {
          status = this.required(value)
            ? this.rangelength(value, [5, 25])
              ? "success"
              : "false"
            : "default";
        }
        key != "inputPassword" && (this.Verification[key].tips = 0);
        this.Verification[key].status = status;
      },
      resetDefault(key) {
        this.Verification[key].status == "default" &&
          (this.Verification[key].status = "");
        key == "inputPassword" &&
          ((this.Verification[key].tips = 1), this.passwordInput(key));
      },
      passwordInput(key) {
        var rex = /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/;
        var rexx = /^(?=.*\d)(?=.*[a-z])(?=.*[!@#$%^&*]).{5,}$/;
        let level = 0;
        let strength1, strength2, strength3;
        this.required(this.Verification[key].value) &&
        this.rangelength(this.Verification[key].value, [8, 16])
          ? ((strength1 = "success"), level++)
          : (strength1 = "false");
        this.required(this.Verification[key].value) &&
        this.rangelength(this.Verification[key].value, [8, 16]) &&
        rex.test(this.Verification[key].value)
          ? ((strength2 = "success"), level++)
          : (strength2 = "false");
        this.required(this.Verification[key].value) &&
        this.rangelength(this.Verification[key].value, [8, 16]) &&
        rex.test(this.Verification[key].value) &&
        rexx.test(this.Verification[key].value)
          ? ((strength3 = "success"), level++)
          : (strength3 = "false");
        this.Verification[key].strength = {
          strength1: strength1,
          strength2: strength2,
          strength3: strength3
        };
        this.Verification[key].strength.level =
          level < 2 ? "low" : level < 3 ? "center" : "height";
        this.level = this.Verification[key].strength.level;
      },
      canClickGetCode(value) {
        this.Verification.inputMobile.isClick =
          this.required(value) && this.phone(value);
      },
      required(value) {
        return value.trim().length > 0;
      },
      email: function(value) {
        if (value == null || this.trim(value) == "") return true;
        return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,50}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,50}[a-zA-Z0-9])?)*$/.test(
          value
        );
      },
      //字符串长度的范围
      rangelength: function(value, param) {
        if (value == null || this.trim(value) == "") return true;
        return value.length >= param[0] && value.length <= param[1];
      },
      //手机号码
      phone: function(value) {
        if (value == null || this.trim(value) == "") return true;
        var rex = /^1[345789]\d{9}$/;
        return rex.test(value);
      },
      //密码
      password: function(value, param) {
        if (value == null || this.trim(value) == "") return true;
        var rex = /^(?=.*\d+)(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*[^A-Za-z0-9\s]+)\S{8,16}$/;
        return rex.test(value);
      },
      trim(value) {
        return value.replace(/(^\s*)|(\s*$)/g, "");
      }
    }
  });
})();


(function(){

    /*
    let _locales = {
        cn: {
            sidemenu: {
                'sidebar-01': '反假冒',
                'sidebar-02': '商品监测报告',
                'sidebar-03': '异常店铺报告',
                'sidebar-04': '渠道管理',
                'sidebar-05': '低价监控',
                'sidebar-06': '低价商品报告',
                'sidebar-07': '违规店铺列表',
                'sidebar-08': '窜货管理',
                'sidebar-09': '商品报告',
                'sidebar-10': '店铺列表',
                'sidebar-11': '配置',
                'sidebar-12': '个人中心'
            },
            shared: {
                dateranger: {
                    'days7': '近7天',
                    'days15': '近15天',
                    'days30': '近30天',
                    'caption': '时间：',
                },
                common: {
                    option_all: '全部',
                    export: '下载数据',
                    search: '搜索',
                    empty: '暂无资料'
                }
            }
        }
    };
    */

    let _serializeToQueryString = function(o){
        let strarr = _.reduce(o, (result, val, key) => {
            let keystr = encodeURIComponent(key);

            if (true === wna.IsArray(val)){
                // _.each(val, (v) => {
                //     let piece = encodeURIComponent(v)+'=1';
                //     result.push(piece);
                // });
                let piece = 'industry=&category=&brand='+window.brandData+'&series=&model=&search='+'&page=1&record_per_page=10';
                result.push(piece);
            }else{
                let piece = keystr + '=' + encodeURIComponent(val);
                result.push(piece);
            }

            return result;
        }, []);

        return (true !== wna.IsNullOrEmpty(strarr)) ? strarr.join('&') : null;
    };

    let _datasources = {
        'commodity_test_report': {
            query: {
                method: 'get',
                path: 'query/metric/commodity_test_report?key=discrimination_report',
            },
            export: {
                path: 'download/report/commodity_test_report',    
            },
            update: {
                method: 'put',
                path: 'update/report/commodity_test_report',
            }
        },
        'abnormal_shop_report': {
            query: {
                method: 'get',
                path: 'query/metric/abnormal_shop_report?key=discrimination_report',
            },
            export: {
                path: 'download/report/abnormal_shop_report'
            }
        },
        'settings_ac': {
            query: {
                method: 'get',
                path: 'query/report/settings_ac'
            },
            upload: {
                path: 'upload/report/commodity_test_report'
            },
            export: {
                method: 'get',
                path: 'download/settings/ac_base64'
            }
        }
    };
/*
    let _exportsources = {
        'commodity_test_report': {
            path: 'download/report',
        }
    };
*/

    let _backendBaseUrl = g_BACKEND_API_BASE_URL;
    let _fetchFromDataSource = function(dsname, since, to, args, callback, sender){
        let ds = _datasources[dsname];
        if (true === wna.IsNullOrEmpty(ds)){
            throw new wna.NullReferenceException("Datasource with name = " + dsname);
        }
        ds = ds.query;
        if (true === wna.IsNullOrEmpty(ds)){
            throw new wna.NullReferenceException("Datasource(query) with name = " + dsname);
        } 

        let end = (true !== wna.IsNullOrEmpty(to)) ? to.format('YYYY-MM-DD 23:59:59') : '';
        let start = (true !== wna.IsNullOrEmpty(since)) ? since.format('YYYY-MM-DD 00:00:00') : '';
        
        let prms = _.extend({start_date: start, end_date: end}, args);
        let qstr = _serializeToQueryString(prms);
        if(ds.path.indexOf('discrimination_report')){
            var url =  _backendBaseUrl+'/'+ds.path+'&' + qstr +'&userid='+JSON.parse(localStorage.getItem("UserId")).val;
        }else {
            var url =  [_backendBaseUrl, ds.path, '?'].join('/') + qstr;
        }
       
        let cb = (callback || function(){});
        $.ajax(url, {
            method: (ds.method || 'GET'),
            headers: {
                Authorization:
                  "Bearer " + JSON.parse(localStorage.getItem("token")).val + ""
              },
            success: function(data){
                console.log(555,data)
                cb.call(sender, data);
            },
            error: function(jqXHR, textStatus, errorThrown){
                cb.call(sender, null, jqXHR, textStatus, errorThrown);
            }
        });
    };

    let _updateDataSource = function(dsname, args, callback, sender){
        let ds = _datasources[dsname];
        if (true === wna.IsNullOrEmpty(ds)){
            throw new wna.NullReferenceException("Datasource with name = " + dsname);
        }
        ds = ds.update;
        if (true === wna.IsNullOrEmpty(ds)){
            throw new wna.NullReferenceException("Datasource(query) with name = " + dsname);
        } 

        let qstr = _serializeToQueryString(args);

        if(ds.path.indexOf('discrimination_report')){
            var url =  _backendBaseUrl+'/'+ds.path+'&' + qstr +'&userid='+JSON.parse(localStorage.getItem("UserId")).val;
        }else {
            var url =  [_backendBaseUrl, ds.path, '?'].join('/') + qstr;
        }
        let cb = (callback || function(){});
        $.ajax(url, {
            method: (ds.method || 'GET'),
            headers: {
                Authorization:
                  "Bearer " + JSON.parse(localStorage.getItem("token")).val + ""
              },
            success: function(data){
                cb.call(sender, data);
            },
            error: function(jqXHR, textStatus, errorThrown){
                cb.call(sender, null, jqXHR, textStatus, errorThrown);
            }
        });
    };

    let _downloadFileWith = function(dsname, args){
        let ds = _datasources[dsname];
        if (true === wna.IsNullOrEmpty(ds)){
            throw new wna.NullReferenceException("Datasource with name = " + dsname);
        }
        ds = ds['export'];
        if (true === wna.IsNullOrEmpty(ds)){
            throw new wna.NullReferenceException("Datasource(export) with name = " + dsname);
        } 

        args['userid'] = 1;
        let qs = (true !== wna.IsNullOrEmpty(args)) ? base64.base64EncArr(base64.strToUTF8Arr(JSON.stringify(args))) : "";
        let url = [_backendBaseUrl, ds.path].join('/') + wna.NVL2(qs, '?p=' + qs, '');

        window.open(url, 'Download');
    };

    let _uploadToBackend = function(dsname, files, args, callback, sender){
        let ds = _datasources[dsname];
        if (true === wna.IsNullOrEmpty(ds)){
            throw new wna.NullReferenceException("Datasource with name = " + dsname);
        }
        ds = ds.upload;
        if (true === wna.IsNullOrEmpty(ds)){
            throw new wna.NullReferenceException("Datasource(upload) with name = " + dsname);
        } 

        let qstr = _serializeToQueryString(args);

        let url =  [_backendBaseUrl, ds.path, '?'].join('/') + qstr;
        let cb = (callback || function(){});

        let data = new FormData();
        _.each(files, function(f, i){
            data.append('filename', f);
        });

        $.ajax(url, {
            method: 'POST',
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            success: function(data){
                cb.call(sender, data);
            },
            error: function(jqXHR, textStatus, errorThrown){
                cb.call(sender, null, jqXHR, textStatus, errorThrown);
            }
        });
    };



    let _sidemenuModel = [
        {
            id: 'sidebar-01',
            //target: null,
            submenu: [
                {
                    id: 'sidebar-02',
                    target: 'CounterfeitProduct',
                    viewComponent: 'vc-counterfeit-product',
                    dataSource: 'commodity_test_report',
                    localeSource: 'counterfeitProducts.json',
                },
                {
                    id: 'sidebar-03',
                    target: 'CounterfeitStore',
                    viewComponent: 'vc-counterfeit-store',
                    dataSource: 'abnormal_shop_report',
                    localeSource: 'counterfeitStores.json',
                },
                // {
                //     id: 'sidebar-100',
                //     target: 'loginData',
                //     viewComponent: 'vc-counterfeit-store111',
                //     dataSource: 'abnormal_shop_report111',
                //     localeSource: 'login.json',
                // }
            ]
        }, 
        {
            id: 'sidebar-04',
            //target: null,
            submenu: [
                {
                    id: 'sidebar-05',
                    submenu: [
                        {
                            id: 'sidebar-06',
                            target: 'LowpriceProduct'
                        },
                        {
                            id: 'sidebar-07',
                            target: 'LowpriceStore'
                        }
                    ]
                },
                {
                    id: 'sidebar-08',
                    submenu: [
                        {
                            id: 'sidebar-09',
                            target: 'TransshipmentProduct'
                        },
                        {
                            id: 'sidebar-10',
                            target: 'TransshipmentStore'
                        }
                    ]
                }
            ]

        },
        {
            id: 'sidebar-11',
            target: 'Setting',
            viewComponent: 'vc-settings',
            dataSource: 'settings_ac',
            localeSource: 'settingsView.json'
        },
        {
            id: 'sidebar-12',
            target: 'MyAccount'
        }
    ];
   
    let _appViewState = {
        currentRoute: null,
        currentTitle: '',
        lang: 'cn'
    };

    let _appViewModel = {
        sideMenu: _sidemenuModel,
        locales: null
    };

    let _appDataModel = {
        //test: 'Namie Amuro'

    };

    let _localeSources = [
        {
            path: '/',
            source: 'app.json'
        },
              {
            path: '/login',
            source: 'login.json'
        },
              {
            path: '/register',
            source: 'register.json'
        }
        ,
              {
            path: '/password',
            source: 'password.json'
        }
    ];

    function _localesLoader(i, accumulator, callback){
        if (true === wna.IsNullOrEmpty(_localeSources)){
            return;
        }
        if (i >= _localeSources.length){
            callback(accumulator);
            return;
        }

        let localesrc = _localeSources[i];
        let url = ['locales', localesrc.source].join('/');

        console.log('------------ try loading locale for ', localesrc.path, localesrc.source, _localeSources.length);
        $.ajax({
            method: 'GET',
            url: url,
            success: function(data){
                if (true === wna.IsNullOrEmpty(data)){
                    throw new Exception("Failed to load locale file", "Locale", localesrc.path);
                }
                if (true === wna.IsNullOrUndefined(accumulator)){
                    accumulator = {};
                }
                if (true === wna.IsNullOrUndefined(accumulator.cn)){
                    accumulator.cn = {};
                }
                if (true === wna.IsNullOrUndefined(accumulator.en)){
                    accumulator.en = {};
                }

                if (true !== wna.IsNullOrEmpty(data.cn)){
                    if ('/' === localesrc.path){
                        _.merge(accumulator.cn, data.cn);
                    }else{
                        let entry = {};
                        entry[localesrc.path] = data.cn;
                        _.merge(accumulator.cn, entry);
                    }
                }

                if (true !== wna.IsNullOrEmpty(data.en)){
                    if ('/' === localesrc.path){
                        _.merge(accumulator.en, data.en);
                    }else{
                        let entry = {};
                        entry[localesrc.path] = data.en;
                        _.merge(accumulator.en, entry);
                    }
                }

                return _localesLoader(++i, accumulator, callback);
            },
            error: function(jqXHR, textStatus, errorThrown){
                throw new Exception("Failed to load locale file: " + textStatus, "Locale", localesrc.path);
            }
        });
    }

    function _sidemenu_flattener(en){
        if (true !== wna.IsNullOrEmpty(en.submenu)){
            return [en, _.flatMapDeep(en.submenu, _sidemenu_flattener)];
        }
        return [en];
    }


    const routes = _.chain(_sidemenuModel).flatMapDeep(_sidemenu_flattener).filter((en) => {
        return ((true !== wna.IsNullOrEmpty(en.target)) && (true !== wna.IsNullOrEmpty(en.viewComponent)));
    }).map((en) => {   

        let localesrc = en.localeSource;
        if (true !== wna.IsNullOrEmpty(localesrc)){
            _localeSources.push({
                path: '/' + en.target,
                source: localesrc
            });
        }

        return {
            path: '/' + en.target,
            props: (function(o){
                return function(r){
                    let path = o.target;
                    let slotProps = {
                        path
                    };
/*
                    Object.defineProperty(slotProps, 'locale', {
                        get: function(){
                            console.log('---------- locale getter is invoked for ', path);
                            return _.pick(_appViewModel.locales[_appViewState.lang], ['shared', path]);
                        }
                    });
*/
                    return slotProps;
                    /*
                    let locale = _appViewModel.locales[_appViewState.lang];
                    locale = _.pick(locale, [o.target, 'shared']);
                    let path = en.target;
                    let menu = en.id;
                    //let ret = { locale }; //{ path: r.path, locale: locale };
                    //console.log('------- route prop ', ret);
                    return { path, locale };
                    */

                };
            })(en),
            component: Vue.component(en.viewComponent),
            dataSource: en.dataSource,
            menuid: en.id
        };
    }).value();

    routes.push( {
        path: "/login",
        component:Vue.component("vc-loginwarp"),
        meta:{
            requireAuth:true,//验证用户能不能跳转这个页面true能false不能
        }
    },
    {
        path: "/register",
        component:Vue.component("vc-registerwarp"),
        meta:{
            requireAuth:true,//验证用户能不能跳转这个页面true能false不能
        }
    },
    {
        path: "/password",
        component:Vue.component("vc-passwordwarp"),
        meta:{
            requireAuth:true,//验证用户能不能跳转这个页面true能false不能
        }
    },
    {
        path: "*",
        redirect: "/login"
    }
    );
    const router = new VueRouter({
        // mode: 'history', //default mode is "hash" mode, history mode allow browser navigation
        routes
    });
    router.beforeEach(async (to, from, next) => {
        if (to.path == '/login' || to.path == '/register' || to.path == '/password' || to.path == '/') {
            next()
        } else {
          if (localStorage.getItem('token')) {
            next()
          } else {
            next({
              path: '/login',
            })
          }
        }
      })
    //app zapper
    $(document).ready(function () {
        //load locales
        if (true !== wna.IsNullOrEmpty(_localeSources)) {
            _localesLoader(0, {}, function (locales) {
                console.log('--------- loaded locales: ', locales);
                _appViewModel.locales = locales;

                let vapp = new Vue({
                    el: '#pagewrap',
                    router: router,
                    data: {
                        model: _appDataModel,
                        viewModel: _appViewModel,
                        viewState: _appViewState,
                    },
                    methods: {
                        /* This will complicate the logic, use local computed property for component-specific locale
                        onRegisterLocales: function(arg){
                            console.log('-------------- onRegisterLocales for ', arg.path, arg.locales);
                        }
                        */
                       onLoginout:function(){
                            var that = this;
                            //发送退出请求
                            let url = `https://bps-mynodesql-api.blcksync.info:444/v0/users/logout`;
                            $.ajax({
                            url: url,
                            type: "GET",
                            headers: {'Authorization': 'Bearer '+JSON.parse(localStorage.getItem("token")).val+''},
                            changeOrigin: true,
                            success: function(rex) {
                                localStorage.removeItem("token");
                                that.$router.push({path:'/'})
                            },
                            error: function(response) {

                            }
                            });
                        },
                        onRequestData: function (path, startDate, endDate, args, callback, sender) {
                            let thisvue = this;
                            let route = _.find(routes, { path: '/' + path });

                            //console.log('--------------- onRequestData: ', arguments);
                            _fetchFromDataSource(route.dataSource, startDate, endDate, args, callback, sender);
                        },
                        onRequestExport: function (path, conditions, sender) {
                            let thisvue = this;
                            let route = _.find(routes, { path: '/' + path });

                            console.log('-------- trigger download of exported datta: ', path, conditions);
                            _downloadFileWith(route.dataSource, conditions);
                        },
                        onRequestLaunch: function (path, ids, callback, sender) {
                            let thisvue = this;
                            let route = _.find(routes, { path: '/' + path });
                            let args = {
                                'key': 'update_rights_status',
                                'ResultId': Array.prototype.join.call(ids, ','),
                                "RightsProtectionStatus": "2"
                            };

                            _updateDataSource(route.dataSource, args, callback, sender);
                        },
                        onRequestUpload: function (path, files, callback, sender) {
                            let thisvue = this;
                            let route = _.find(routes, { path: '/' + path });
                            let args = {
                                'UserId': 1
                            };

                            _uploadToBackend(route.dataSource, files, args, callback, sender);
                        },
                        onLangButtonClicked: function(ev){
                            let thisvue = this;
                            let lang = null;
                            if ('cn' === thisvue.viewState.lang){
                                lang = 'en';
                            }else{
                                lang = 'cn';
                            }
                            thisvue.viewState.lang = lang;
                        },
                        makeCurrentTitle: function () {
                            let thisvue = this;
                            let route = _.find(routes, { path: thisvue.$router.currentRoute.path });
                            let locale = _appViewModel.locales[_appViewState.lang];
                            if ((true !== wna.IsNullOrEmpty(route)) && (true !== wna.IsNullOrEmpty(route.menuid))) {
                                thisvue.viewState.currentTitle = locale.sidemenu[route.menuid];
                                thisvue.viewState.currentMenuId = 'pagehead-' + route.menuid;
                            } else {
                                thisvue.viewState.currentTitle = '';
                                thisvue.viewState.currentMenuId = '';
                            }
                        }
                    },
                    watch: {
                        $route(to, from) {
                            this.viewState.currentRoute = this.$router.currentRoute.path;
                            this.makeCurrentTitle();
                        },
                        'viewState.lang': function(){
                            this.makeCurrentTitle();
                        }
                    },
                    computed: {
                        renderForCurrentHtml:function(){
                            return this.$route.path == '/login' || this.$route.path == '/register' || this.$route.path == '/password' 
                        },
                        localeForCurrentRoute: function(){
                            let thisvue = this;
                            let locales = thisvue.currentLocale;
                            let route = thisvue.viewState.currentRoute;
                            let locale = _appViewModel.locales[_appViewState.lang];
                            console.log(locale)
                            /*
                            let locale = _.merge({}, locales[route], { shared: locales['shared'] });
                            return locale;
                            */
                           if (true === wna.IsNullOrEmpty(route)){
                               return null;
                           }
                            console.log('------------- getting localeForCurrentRoute: ', route, locales[route]);
                            return locales[route];
                        },
                        currentLocale: function(){
                            let thisvue = this;
                            return thisvue.viewModel.locales[thisvue.viewState.lang];
                        }
                    },
                    beforeMount: function(){
                        // this.xxx = this.$route.path == 'login' || this.$route.path == 'register'
                        this.viewState.currentRoute = this.$router.currentRoute.path;
                        this.makeCurrentTitle();
                    },
                    mounted: function () {
                        /*
                        this.viewState.currentRoute = this.$router.currentRoute.path;
                        this.makeCurrentTitle();
                        */
                    }
                });

                console.log('----- vue app inited');
            });
        }

    });
    
})();