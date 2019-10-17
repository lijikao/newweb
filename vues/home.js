(function(){
    Vue.component('vc-home', {
        template: `
            <div id='content'>首页首页</div>
        `,
        props: ['model', 'locale'],
        created(){
            console.log('login page')
        }
    });
})();