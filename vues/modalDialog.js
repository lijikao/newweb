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