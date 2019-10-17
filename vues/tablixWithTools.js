(function(){
    Vue.component('vc-tablix-with-tools', {
        template: `
            <div :id="id">
                <div class="tabletools">
                    <div class="filtertools" v-if="(true !== wna.IsNullOrEmpty(viewModel.filters))">
                        <div class="toolsgroup" v-for="f in viewModel.filters" >
                            <label>{{locale.fields[f.fieldid]}}</label>
                            <select :name="f.fieldid" v-model="viewState.filters[f.fieldid]" v-on:change="onFilterChange($event, f.fieldid)">
                                <option value='-------'>{{locale.common.option_all}}</option>
                                <option v-for="o in f.options" v-if="(true !== wna.IsNullOrEmpty(o))" :value="o">{{o}}</option>
                            </select>							
                        </div>
                    </div>
                    <div class="toolsgroup buttongroup">
                        <!--
                        <button type="button" v-for="b in viewModel.buttons" v-bind:value="b.id" v-on:click="onButtonClick" v-bind:class="[((true === wna.IsNullOrEmpty(b.classes)) ? '' : b.classes)]">{{locale.buttons[b.id]}}</button>
                        //-->
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
                        <!--
                        <button type="button" v-on:click="onSearch($event, viewModel.search)" class="btn-red">{{locale.common.search}}</button>
                        //-->
                    </div>	
                </div><!--tabletools-->
                <div class="tablecontetnt table-responsive">
                    <vc-tablix ref="tablix" :id="'tablix_core__' + id" :model="model" :view-model="viewModel" :locale="locale" :lang="lang" 
                        @tableviewModelChange="(query)=> $emit('tableviewModelChange',query)"></vc-tablix>
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
            'viewState.searchNeedle': function(){
                this.viewState.shouldUpdateActiveModel = true;
                console.log('----------- searchNeedle change: ', this.viewState.searchNeedle);
            }
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
                //let filtersForCurrentTab = vwstate.filters[vwstate.selectedTab];
                vwstate.shouldUpdateActiveModel = true;
                console.log('###-- Tablix-with-tools: filter change:', vwstate.filters[vwstate.selectedTab]);
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
