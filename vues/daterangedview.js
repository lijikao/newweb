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