(function(){
    /*
        viewModel: {
            tabs: [
                {
                    id: 'id string',
                    filter: function(dataset){
                        //mandatory
                    }
                }
            ],
            cols: [
                {
                    fieldid: 'field name of data row',
                    transform: function(value){
                        //nullable
                    }
                }
            ],
            filters: [
                {
                    fieldid: 'field name of data row',
                    options: [
                        'value1',
                        'value2'...
                    ]
                }
            ],
            search: function(needle, dataset){}, //or null
            buttons: [
                {
                    id: 'button name string',
                    classes: ['btn-white'], //or null
                    callback: function,
                }
            ]

        },
        locale: {
            common: {
                option_all: '全部',
                export: '下载数据',
                search: '搜索',
            },
            tabs: {
                'tab_id': 'tab caption text'
            },
            fields: {
                'fieldid': 'field caption text'  //for use in cols and filters
            },
            buttons: {
                'id': 'caption text'
            }
        }
     */
    let _instancesViewStates = {

    };

    const _DEFAULT_TAB_ = '___default___';

    Vue.component('vc-tableview', {
        template: `
            <div>
                <div class="main-panelhead">
                    <h2>{{locale.caption}}</h2>
                </div>
                <div class="main-panelbody">
                    <div class="tabswrap">
                        <ul v-if="(true !== wna.IsNullOrEmpty(viewModel.tabs)) && (true !== wna.IsNullOrEmpty(locale)) && (true !== wna.IsNullOrEmpty(locale.tabs))">
                            <!--
                            <li v-for="(t, i) in viewModel.tabs" v-bind:class="[ (t.id === viewState.selectedTab) ? 'activetab' : ((true === wna.IsNullOrUndefined(viewState.selectedTab)) ?  ((0 === i) ? 'activetab' : '') : '') ]" v-bind:name="t.id">
                            //-->
                            <li v-for="(t, i) in viewModel.tabs" v-bind:class="[ (t.id === viewState.selectedTab) ? 'activetab' : '' ]" v-bind:name="t.id">
                                <button type="button" v-bind:value="t.id" v-on:click="onSelectTab($event, t.id, t.filter)">
                                    <span>{{ locale.tabs[t.id] }}</span>
                                    <span class="tabsnum">{{ (true !== wna.IsNullOrEmpty(viewState.model4Tab[t.id])) ? viewState.model4Tab[t.id].length : '' }}</span>
                                </button>
                            </li>
                        </ul>
                    </div><!--tabswrap-->
                    <div class="tabletools">
                        <div class="filtertools" v-if="(true !== wna.IsNullOrEmpty(viewModel.filters))">
                            <div class="toolsgroup" v-for="f in viewModel.filters" >
                                <label>{{locale.fields[f.fieldid]}}</label>
                                <select :name="f.fieldid" v-model="viewState.filters[viewState.selectedTab][f.fieldid]" v-on:change="onFilterChange($event, f.fieldid)">
                                    <option value='-------'>{{locale.common.option_all}}</option>
                                    <option v-for="o in f.options" v-if="(true !== wna.IsNullOrEmpty(o))" :value="o">{{o}}</option>
                                </select>							
                            </div>
                        </div>
                        <div class="toolsgroup buttongroup">
                            <!--
                            <button type="button" v-for="b in viewModel.buttons" v-bind:value="b.id" v-on:click="onButtonClick" v-bind:class="[((true === wna.IsNullOrEmpty(b.classes)) ? '' : b.classes)]">{{locale.buttons[b.id]}}</button>
                            //-->
                            <button type="button" v-for="b in viewModel.buttons" v-bind:value="b.id" v-on:click="onButtonClick($event, b.callback)" v-if="(true === wna.IsNullOrUndefined(b.visibleInTabs)) || (_.includes(b.visibleInTabs, viewState.selectedTab))" v-bind:class="[((true === wna.IsNullOrEmpty(b.classes)) ? '' : b.classes)]">{{locale.buttons[b.id]}}</button>
                        </div>	
                        <div class="toolsgroup searchgroup" v-if="(true === wna.IsFunction(viewModel.search))">
                            <input type="text" v-model="viewState.searchNeedles[viewState.selectedTab]" v-on:change="$forceUpdate" v-bind:placeholder="locale.common.search" :key="'search_' + viewState.selectedTab">
                            <!--
                            <button type="button" v-on:click="onSearch($event, viewModel.search)" class="btn-red">{{locale.common.search}}</button>
                            //-->
                        </div>	
                    </div><!--tabletools-->
                    <div class="tablecontetnt table-responsive">
                        <table id="producttable" class="table table-striped" v-if="true !== wna.IsNullOrEmpty(viewModel.cols)">
                            <thead>
                                <tr>
                                    <td v-if="true === viewModel.multiselect">
                                        <!--
                                        <input type="checkbox" ref="checkall" :id="viewState.selectedTab + '_checkall'" v-on:change="onCheckAllChange" /><label :for="viewState.selectedTab + '_checkall'">&nbsp;</label>
                                        //-->
                                    </td>
                                    <td v-for="c in viewModel.cols" v-on:click="onSort(c.fieldid)"><span>{{locale.fields[c.fieldid]}}</span><div class="sortable-col-head-icon">&nbsp;</div></td>
                                </tr>
                            </thead>
                            <tbody id="" v-if="(true !== wna.IsNullOrEmpty(activeModel))">
                                <tr v-for="(r, i) in _.slice(activeModel, pageStartIndex, pageEndIndex)">
                                <!-- //-->
                                    <td v-if="true === viewModel.multiselect"><input type="checkbox" :ref="rowId(i)" :id="rowId(i)" :value="r[viewModel.primaryKey]" v-model="viewState.selectedRows" ><label :for="rowId(i)">&nbsp;</label></td>
                                    <td v-for="c in viewModel.cols" v-html="(true === wna.IsFunction(c.transform)) ? (c.transform(r[c.fieldid], r)) : (r[c.fieldid])"></td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td :colspan="((true === viewModel.selectable) || (true === viewModel.multiselect)) ? viewModel.cols.length + 1: viewModel.cols.length">
                                        <div>
                                            <div class="total">{{locale.total_head}} {{ (true !== wna.IsNullOrEmpty(activeModel)) ? activeModel.length : '0' }} {{locale.total_tail}}</div>
                                            <div class="paginator" v-if="(true !== wna.IsNullOrUndefined(viewState.totalPages)) && (viewState.totalPages > 1)">
                                                <button name="pagefrst" v-on:click="onPageChange(0)"></button>
                                                <button name="pageprev" v-on:click="onPageChange(null, -1)"></button>
                                                <button name="pagejump" v-on:click="onPageChange(j)" v-for="j in pageJumps" :disabled="(true === wna.IsNullOrUndefined(j))" v-bind:class="[(j === viewState.currentPage) ? 'active' : '']">{{ (true !== wna.IsNullOrUndefined(j)) ? (j + 1) : '...'}}</button> 
                                                <button name="pagenext" v-on:click="onPageChange(null, 1)"></button>
                                                <button name="pagelast" v-on:click="onPageChange(lastPageIndex)"></button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>							
                    </div><!--tablecontetnt-->
                
                </div>
            </div>
        `,
        props: ['viewModel', 'model', 'locale', 'id'],
        beforeDestroy: function(){
            let thisvue = this;
            console.log('----- beforeDestroy - perceive the current instance state for route: ', thisvue.viewState.routePath);
            _instancesViewStates[thisvue.viewState.routePath] = thisvue.viewState;
        },
        beforeMount: function(){
            let thisvue = this;
            let routePath = thisvue.$route.matched[0].path;

            //console.log('----- beforeMount: try get last viewState: ', routePath, thisvue.viewState, _instancesViewStates);
            if (true !== wna.IsNullOrUndefined(_instancesViewStates[routePath])){
                let lastViewState = _instancesViewStates[routePath];
                console.log('------ load back the last viewState ', lastViewState);
                thisvue.viewState = lastViewState;
                thisvue.viewState.lastRoutePath = routePath;
                return;
            }

            let vwstate = thisvue.viewState;
            let vwmodel = thisvue.viewModel;

            if (true !== wna.IsNullOrEmpty(vwmodel.tabs)){
                let defaultTabResults = _.filter(vwmodel.tabs, (t) => {
                    if (true === wna.IsNullOrUndefined(vwstate.filters[t.id])){
                        if (true !== wna.IsNullOrEmpty(vwmodel.filters)){
                            let filterkeys = _.map(vwmodel.filters, 'fieldid');
                            let numfilters = (true !== wna.IsNullOrEmpty(filterkeys)) ? filterkeys.length : 0;
                            let filtervals = _.times(numfilters, _.constant('-------'));
                            let defaultfilters = _.zipObject(filterkeys, filtervals);
                            
                            vwstate.filters[t.id] = defaultfilters;
                        }
                        else{
                            vwstate.filters[t.id] = {};
                        }
                    }

                    vwstate.searchNeedles[t.id] = ''; //init the per tab search needle
                    //console.log('----------- init search needle for tab: ', t.id, vwstate.searchNeedles[t.id]);

                    return (true === t.default);
                });
                let defaultTab = (true !== wna.IsNullOrEmpty(defaultTabResults)) ? defaultTabResults[0] : thisvue.viewModel.tabs[0];
                //console.log('------- default tab ', defaultTab);
                //thisvue.viewState.selectedTab = defaultTab.id;
                thisvue.onSelectTab(null, defaultTab.id);
            }else{
                vwstate.searchNeedles[_DEFAULT_TAB_] = '';

                thisvue.onSelectTab(null, _DEFAULT_TAB_);
            }

            thisvue.viewState.routePath = routePath;


        },
        mounted: function(){
            let $selects = $('select', $(this.$el));
            $selects.val('-------').trigger('change');
            console.log('-------- tableview Mounted: ', this.model, this.id, $selects);
        },
        data: function(){
            return {
                viewState: {
                    totalPages: null,
                    currentPage: null,
                    shouldUpdateActiveModel: true,
                    searchNeedles: {},
                    selectedRows: [],                    
                    selectedTab: null,
                    model4Tab: {},
                    sorting: [],
                    filters: {}
                    /* filters illustration:
                        'tabid': {
                            'fieldid': 
                        }
                     */
                }
            };
        },
        computed: {
            activeModel: function(){
                //activeModel represents the current displayed data which is filtered from the original model
                //return this.model;
                let thisvue = this;
                let vwstate = thisvue.viewState;
                let vwmodel = thisvue.viewModel;
                let ret = vwstate.model4Tab[vwstate.selectedTab]; //thisvue.model.results;
                let searchNeedle = vwstate.searchNeedles[vwstate.selectedTab];

                console.log('------ computing activeModel 1: ', thisvue.viewState.selectedTab, ret, this.viewState.filters[thisvue.viewState.selectedTab]);

                if (true === vwstate.shouldUpdateActiveModel){
                    if (true !== wna.IsNullOrEmpty(ret)){
                        let filtersForCurrentTab = vwstate.filters[vwstate.selectedTab];
                        if (true !== wna.IsNullOrEmpty(filtersForCurrentTab)){
                            let filters = {};
                            _.each(filtersForCurrentTab, function(val, key){
                                if ('-------' !== val){
                                    filters[key] = val;
                                }
                            });

                            ret = _.filter(ret, filters);
                            filters = null;
                        }
                    }

                    if (true !== wna.IsNullOrUndefined(thisvue.viewModel.rowsPerPage)){
                        if (true === wna.IsNullOrEmpty(ret)){
                            vwstate.totalPages = 0;
                            vwstate.currentPage = null;
                        }else{
                            vwstate.totalPages = Math.ceil(ret.length / thisvue.viewModel.rowsPerPage);
                            vwstate.currentPage = 0;
                        }
                    }

                    vwstate.shouldUpdateActiveModel = false;
                }
                
                if ((true !== wna.IsNullOrEmpty(searchNeedle)) && (true === wna.IsFunction(thisvue.viewModel.search))){
                    ret = thisvue.viewModel.search(searchNeedle, ret);
                }
                

                if (true !== wna.IsNullOrEmpty(vwstate.sorting)){
                    let sort_fields = _.map(vwstate.sorting, 'fieldid');
                    let sort_orders = _.map(vwstate.sorting, 'order');

                    _.reverse(sort_fields);
                    _.reverse(sort_orders);

                    //console.log('-------- sorting: ', sort_fields, sort_orders);
                    ret = _.orderBy(ret, sort_fields, sort_orders);
                }else{
                    ret = _.orderBy(ret, [vwmodel.primaryKey], ['desc']);
                }

                console.log('--------> pagination: ', vwstate.totalPages, vwstate.currentPage);

                return ret;
            },
            pageStartIndex: function(){
                let thisvue = this;
                let vwstate = thisvue.viewState;
                let vwmodel = thisvue.viewModel;

                if (vwstate.totalPages > 1){
                    let ret = vwstate.currentPage * vwmodel.rowsPerPage;
                    console.log('------ pageStartIndex: ', ret);
                    return ret;
                }
                return 0;
            },
            pageEndIndex: function(){
                let thisvue = this;
                let vwstate = thisvue.viewState;
                let vwmodel = thisvue.viewModel;

                if (vwstate.totalPages > 1){
                    let ret = (vwstate.currentPage + 1) * vwmodel.rowsPerPage;
                    console.log('------ pageEndIndex: ', ret);
                    return ret;
                }
                return thisvue.activeModel.length;
            },
            lastPageIndex: function(){
                let thisvue = this;
                let vwstate = thisvue.viewState;
                let vwmodel = thisvue.viewModel;

                if (vwstate.totalPages > 1){
                    let ret = (vwstate.totalPages - 1) * vwmodel.rowsPerPage;
                    console.log('------ lastPageIndex: ', ret);
                    return ret;
                }
                return 0;
            },
            pageJumps: function(){
                let thisvue = this;
                let vwstate = thisvue.viewState;
                let vwmodel = thisvue.viewModel;
                let ret;

                do {
                    if (vwstate.totalPages > 5){
                        if (vwstate.currentPage >= vwstate.totalPages - 3){
                            ret = [0, undefined, vwstate.totalPages - 3, vwstate.totalPages - 2, vwstate.totalPages - 1];
                            break;
                        }else {
                            if (vwstate.currentPage > 0){
                                ret = [vwstate.currentPage - 1, vwstate.currentPage, vwstate.currentPage + 1, undefined, vwstate.totalPages -1];
                            }else{
                                ret = [vwstate.currentPage, vwstate.currentPage + 1, vwstate.currentPage + 2, undefined, vwstate.totalPages -1];
                            }
                            break;
                        }
                    }else{
                        ret =  [0, 1, 2, 3, 4];
                        break;
                    }
                }while(false);

                //console.log('------ page jumps: ', ret);
                return ret;
            },
            rowSelectionInCurrentPageOfCurrentTab: function(){
                let thisvue = this;
                let vwstate = thisvue.viewState;
                let vwmodel = thisvue.viewModel;
                let pageid = vwstate.currentPage;
                let tabid = vwstate.selectedTab;
                
                let selection = _(thisvue.activeModel).slice(thisvue.pageStartIndex, thisvue.pageEndIndex).filter(function(r){
                    //console.log('------- get row selection, check: ', vwstate.selectedRows, r[vwmodel.primaryKey]);
                    return _.includes(vwstate.selectedRows, r[vwmodel.primaryKey]);
                }) .map(thisvue.viewModel.primaryKey).value();

                return selection;
            }
            
        },
        watch: {
            'viewState': {
                deep: true,
                handler: function(){
                    console.log('------------------ viewState changed: ', this.viewState);
                }
            },
            'model': {
                deep: true,
                handler: function(){
                    let thisvue = this;
                    let vwstate = thisvue.viewState;

                    if (true !== wna.IsNullOrEmpty(thisvue.viewModel.tabs)){
                        _.each(thisvue.viewModel.tabs, function(t){
                            if (true !== wna.IsNullOrEmpty(t)){
                                try{
                                    let subdata = null;
                                    if (true === wna.IsFunction(t.filter)){
                                        subdata = t.filter(thisvue.model);
                                    }else{
                                        subdata = _.filter(thisvue.model, t.filter);
                                    }
                                    
                                    vwstate.model4Tab[t.id] = (true !== wna.IsNullOrEmpty(subdata)) ? subdata : [];
                                }catch(ex) {
                                    vwstate.model4Tab[t.id] = null;
                                }
                            }
                        });
                    }else{
                        vwstate.model4Tab[_DEFAULT_TAB_] = thisvue.model;
                    }

                    vwstate.shouldUpdateActiveModel = true;
                    //console.log('------------ tableview model changed: ', thisvue.model, vwstate.model4Tab);
                }
            },/*
            'viewState.selectedRowsInPageOfTab': {
                deep: true,
                handler: function(){
                    console.log('-------- selectedRowsInPageOfTab changed: ', this.viewState.selectedRowsInPageOfTab[this.viewState.selectedTab]);
                }
            }*/
            /*
            'viewState.filters': {
                deep: true,
                handler: function(){
                    console.log('------ viewState filters Change', this.viewState.filters);
                }
            }
            */
        },
        methods: {
            rowId: function(i){
                return 'tr_' + this.id + '_' + i;
            },
            onButtonClick: function(ev, callback){
                let thisvue = this;
                let vwstate = thisvue.viewState;
                let filters = vwstate.filters[vwstate.selectedTab];
                let tabid = vwstate.selectedTab;

                filters = _.mapValues(filters, function(v){
                    if ('-------' === v){
                        return null;
                    }
                });

                
                $(thisvue.$el).fire('tools-button-clicked', {
                    filters: filters,
                    target: ev.target, 
                    callback: callback,
                    tabid: tabid,
                    searchNeedle: vwstate.searchNeedles[tabid],
                    rowSelection: thisvue.rowSelectionInCurrentPageOfCurrentTab
                    ///isAllRowsSelected: thisvue.isAllRowsOfPageSelectedInCurrentTab[vwstate.currentPage]
                });
            },
            onSearch: function(ev, callback){
                //search button no longer needed
                /*
                let thisvue = this;
                thisvue.viewState.shouldUpdateActiveModel = true;
                console.log('----- onSearch: ', thisvue.viewState.searchNeedles[thisvue.viewState.selectedTab]);
                
                if ((true !== wna.IsNullOrEmpty(thisvue.viewState.searchNeedle)) &&
                    //(true !== wna.IsNullOrEmpty(thisvue.model)) && //temporarly disabled for dev-debug
                    (true === wna.IsFunction(callback))) {
                    callback(thisvue.viewState.searchNeedle, thisvue.model);
                }
                */
            },
            onSelectTab: function(ev, tabid, filter){
                let thisvue = this;
                let vwstate = thisvue.viewState;
                vwstate.selectedTab = tabid;
                
                /*
                if (true === wna.IsFunction(filter)){
                    thisvue.viewState.model4Tab = filter(thisvue.model.reeults);
                }else{
                    thisvue.viewState.model4Tab = _.cloneDeep(thisvue.model.results);
                }
                */

                console.log('-------- onSelectTab: ', tabid);

                /* //the following seems to be useless
                if (true === wna.IsNullOrUndefined(thisvue.viewState.filters[tabid])){
                    console.log('---------- init filters for tab ', tabid);
                    vwstate.filters[tabid] = {};
                    vwstate.searchNeedles[tabid] = null;
                };
                */

                vwstate.shouldUpdateActiveModel = true;
                
            },
            /* we use model data-binding instead
            //paste this into the "select" tag: v-on:change="onFilterChange($event, f.fieldid)"
            onFilterChange: function(ev, fieldid){
                //console.log('------- filter change ', fieldid, $(ev.target).val());
                console.log('------- filter change ', this.viewState.filters);
            }
            */
            onFilterChange: function(ev, fieldid){
               let thisvue = this;
               let vwstate = thisvue.viewState;
               //let filtersForCurrentTab = vwstate.filters[vwstate.selectedTab];
               vwstate.shouldUpdateActiveModel = true;
               console.log('-------- filter change ', vwstate.filters[vwstate.selectedTab]);
            },
            onCheckAllChange: function (ev) {
                let thisvue = this;
                let vwstate = thisvue.viewState;
                let vwmodel = thisvue.viewModel;
                let pageid = vwstate.currentPage;
                let tabid = vwstate.selectedTab;
                let count = thisvue.pageEndIndex - thisvue.pageStartIndex;
                let selectedRows = vwstate.selectedRowsOfTab[tabid];

                if ((true !== wna.IsNullOrEmpty(selectedRows)) && (selectedRows.length === count)) {
                    vwstate.selectedRowsOfTab[tabid].length = 0;
                    //thisvue.isAllRowsOfPageSelectedInCurrentTab[pageid] = false;
                } else {
                    vwstate.selectedRowsOfTab[tabid] = _.map(_.slice(thisvue.activeModel, thisvue.pageStartIndex, thisvue.pageEndIndex), vwmodel.primaryKey);
                    //thisvue.isAllRowsOfPageSelectedInCurrentTab[pageid] = true;
                }
                /*
                thisvue.$nextTick(function () {
                    thisvue.$forceUpdate();
                });
                */
                //viewState.selectedRows4Tab[viewState.selectedTab]
                //console.log('------ on check all change: ', vwstate.isAllRowsSelected4Tab[vwstate.selectedTab], vwstate.selectedRows4Tab[vwstate.selectedTab]);
            },
           onSort: function(fieldid){
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
               if (true !== wna.IsNullOrEmpty(sort)){
                   sort = sort[0];
                   sort.order = ('desc' === sort.order) ? 'asc' : 'desc';
               }else{
                   sort = {
                       fieldid: fieldid,
                       order: 'desc'
                   };
                }
               
               vwstate.sorting.push(sort);
           },
           onPageChange: function(index, incr){
               let thisvue = this;
               let vwstate = thisvue.viewState;

               if ((true !== wna.IsNullOrUndefined(index)) && (true === wna.IsNumber(index))){
                   if ((index >= 0) && (index < vwstate.totalPages)){
                       vwstate.currentPage = index;
                   }
               }else{
                   if ((true !== wna.IsNullOrUndefined(incr) && (true === wna.IsNumber(incr)))){
                       let target_page = vwstate.currentPage + incr;
                       vwstate.currentPage = (target_page < 0) ? 0 : (target_page >= vwstate.totalPages) ? vwstate.totalPages - 1 : target_page;
                   }
               }
               //console.log('----- onPageChange : ', index, incr);
           }
        }
    });
})();