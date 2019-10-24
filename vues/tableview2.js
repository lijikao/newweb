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
