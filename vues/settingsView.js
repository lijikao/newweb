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