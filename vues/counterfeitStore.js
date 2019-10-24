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