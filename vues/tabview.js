(function(){
    const _DEFAULT_TAB_ = '___default___';

    Vue.component('vc-tabview', {
        template: `
            <div> <!-- move class="main-panelbody" to caller //-->
                <div class="tabswrap">
                    <ul v-if="(true !== wna.IsNullOrEmpty(viewModel.tabs)) && (true !== wna.IsNullOrEmpty(locale)) && (true !== wna.IsNullOrEmpty(locale.tabs))">
                        <li v-for="(t, i) in viewModel.tabs" v-bind:class="[ (t.id === viewState.selectedTab) ? 'activetab' : '' ]" v-bind:name="t.id">
                            <button type="button" v-bind:value="t.id" v-on:click="onSelectTab($event, t.id, t.filter)">
                                <span>{{ locale.tabs[t.id] }}</span>
                                <span class="tabsnum">{{ (true !== wna.IsNullOrEmpty(viewState.model4Tab[t.id])) ? viewState.model4Tab[t.id].length : '' }}</span>
                            </button>
                        </li>
                    </ul>
                </div><!--tabswrap-->
                <slot name="tabcontent"></slot>
            </div>
        `,
        props: ['id', 'model', 'viewModel', 'locale', 'lang'],
        data: function(){
            return {
                viewState: {
                    selectedTab: null,
                    model4Tab: {}
                }
            };
        },
        watch: {
            'model': {
                deep: true,
                handler: function(){
                    let thisvue = this;
                    let vwstate = thisvue.viewState;
                    let vwmodel = thisvue.viewModel;
    
                    if (true !== wna.IsNullOrEmpty(vwmodel.tabs)){
                        let tabs = vwmodel.tabs;
                        _.each(tabs, function(t){
                            if (true !== wna.IsNullOrEmpty(t)){
                                try{
                                    let tabmodel = null;
                                    if (true === wna.IsFunction(t.filter)){
                                        tabmodel = t.filter(thisvue.model);
                                    }else{
                                        tabmodel = _.filter(thisvue.model, t.filter);
                                    }
                                    
                                    vwstate.model4Tab[t.id] = (true !== wna.IsNullOrEmpty(tabmodel)) ? tabmodel : [];
                                }catch(ex) {
                                    vwstate.model4Tab[t.id] = null;
                                }
                            }
                        });
                    }else{
                        vwstate.model4Tab[_DEFAULT_TAB_] = thisvue.model;
                    }
                }
            }
        },
        computed: {

        },
        //### Methods
        methods: {
            onSelectTab: function(ev, tabid, filter){
                let thisvue = this;
                let vwstate = thisvue.viewState;
                vwstate.selectedTab = tabid;

                console.log('-------- onSelectTab: ', tabid);
            },
        },
        //### Lifecycle Hooks
        mounted: function(){

        },
        beforeUpdate: function(){
        }
    });
})();
