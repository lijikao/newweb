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
            type: 'bar'
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
          let dupIndex = acc.channels.indexOf(val.FakeProductStatusByChannel_ChanelName)
          // 根据channel 合并去重，同时重组
          if( dupIndex < 0){
            acc.channels.push(val.FakeProductStatusByChannel_ChanelName)
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
          categories: series.channels,
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
