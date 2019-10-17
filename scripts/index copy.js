
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
                _.each(val, (v) => {
                    let piece = keystr + '[]=' + encodeURIComponent(v);
                    result.push(piece);
                });
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
                path: 'query/report/commodity_test_report',
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
                path: 'query/report/abnormal_shop_report',
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
        debugger
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

        let url =  [_backendBaseUrl, ds.path, '?'].join('/') + qstr;
        let cb = (callback || function(){});
        $.ajax(url, {
            method: (ds.method || 'GET'),
            success: function(data){
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

        let url =  [_backendBaseUrl, ds.path, '?'].join('/') + qstr;
        let cb = (callback || function(){});
        $.ajax(url, {
            method: (ds.method || 'GET'),
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
            path: '/login',
            source: 'login.json'
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
            headers: {
                Authorization:
                  "Bearer " + JSON.parse(localStorage.getItem("token")).val + ""
              },
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

    function xxx(){
        const dy_routes = _.chain(_sidemenuModel).flatMapDeep(_sidemenu_flattener).filter((en) => {
            return ((true !== wna.IsNullOrEmpty(en.target)) && (true !== wna.IsNullOrEmpty(en.viewComponent)));
        }).map((en) => {   
    
            let localesrc = en.localeSource;
            debugger
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
                menuid: en.id,
                meta:{
                    requireAuth:true,//验证用户能不能跳转这个页面true能false不能
                }
            };
        }).value();
        dy_routes.push( {
            path: '/',
            redirect:'/CounterfeitProduct',
            meta:{
                requireAuth:true,//验证用户能不能跳转这个页面true能false不能
            }
          })
        //   _localeSources.unshift({
        //         path: '/',
        //         source: 'app.json'
        //   })
        //    _localesLoader(0, {}, function (locales) {
        //         console.log('--------- loaded locales: ', locales);
        //      _appViewModel.locales.push(locales)})
        return dy_routes
    }
 
    const routes = [{
        path: "/login",
        component:Vue.component("vc-loginwarp"),
        meta:{
            requireAuth:false,//验证用户能不能跳转这个页面true能false不能
        }
    },
    // {
    //     path: "/register",
    //     component:Vue.component("vc-registerwarp"),
    //     meta:{
    //         requireAuth:false,//验证用户能不能跳转这个页面true能false不能
    //     }
    // },
    // {
    //     path: "/forgetPassword",
    //     component:Vue.component("vc-forgetpasswordwarp"),
    //     meta:{
    //         requireAuth:false,//验证用户能不能跳转这个页面true能false不能
    //     }
    // },
    // {
    //     path: "/resetPassword",
    //     component:Vue.component("vc-resetpasswordwarp"),
    //     meta:{
    //         requireAuth:false,//验证用户能不能跳转这个页面true能false不能
    //     }
    // },
    // {
    //     path: '/CounterfeitProduct',
    //     meta:{
    //         requireAuth:true,//验证用户能不能跳转这个页面true能false不能
    //     }
    //   },
    //   {
    //     path: '/CounterfeitStore',
    //     meta:{
    //         requireAuth:true,//验证用户能不能跳转这个页面true能false不能
    //     }
    //   },
    //   {
    //     path: '/',
    //     redirect:'/login',
    //     requireAuth:true,//验证用户能不能跳转这个页面true能false不能
    //   },
    //   {
    //     path: '*',
    //     redirect:'/login',
    //     requireAuth:false,//验证用户能不能跳转这个页面true能false不能
    //   }
   ]
    const router = new VueRouter({
        // mode: 'history', //default mode is "hash" mode, history mode allow browser navigation
        routes
    });
    var flag = true
    router.beforeEach(async (to,from,next)=>{
        debugger
        // if(to.meta.requiresAuth===false){
        //   //不需要登录的直接放行
        //   next()
        // // }
        // // else if(!authorize.checkLogin()){
        // //   //如果页面需要登录，且登录失效，进入登录页面
        // //   next({
        // //     path:config.login_path,
        // //     query: { redirect: to.fullPath }
        // //   })
        // }else {
          //已经登录
          //是否已经拉取menu，权限等信息
        //   if(!store.state.menu_loaded){
        //     //如果页面还没有拉取menu
        //     await netwrok.post(api.get_user_info,'',true).then((res)=>{
        //       store.commit('SET_USER_INFO',res)
               
              //获取动态路由
                // if(flag){
                //     flag = false
                //     let dy_routers= xxx();
                //     //动态添加路由
                //         router.addRoutes(dy_routers)
                //     next({ ...to, replace: true })
                // }
            
            //   }else{
            //       next()
              
        // }
       
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
                            this.$router.push({path:'/login'})
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
                            console.log( this.$router)
                            this.viewState.currentRoute = this.$router.currentRoute.path;
                            this.makeCurrentTitle();
                        },
                        'viewState.lang': function(){
                            this.makeCurrentTitle();
                        }
                    },
                    computed: {
                        renderForCurrentHtml:function(){
                            return this.$route.path == '/login' || this.$route.path == '/register' || this.$route.path == '/forgetPassword' || this.$route.path == '/resetPassword'
                        },
                        localeForCurrentRoute: function(){
                            debugger
                            let thisvue = this;
                            let locales = thisvue.currentLocale;
                            let route = thisvue.viewState.currentRoute;
                            let locale = _appViewModel.locales[_appViewState.lang];
                            
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
                        console.log( this.$router)
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