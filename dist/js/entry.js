(function(){
    Vue.component('vc-loginwarp', {
        template: `
        <div id="content">
        <div class="register-container">
            <div class="register-box">
                    <div id="register-form">
                            <h2 class="login-title">{{ register.en.registerTitle }}</h2>
                            <form>
                                <div class="form-group" data-status="success">
                                        <em style="color: #CD454A;">*</em>
                                    <input type="text" class="form-control"  :placeholder="register.en.inputName">
                                        <span class="input-status"></span>
                                        <p class="status-info">{{ register.en.inputNameInfo }}</p>
                                </div>
                                <div class="form-group" data-status="success">
                                        <em style="color: #CD454A;">*</em>
                                        <input type="text" class="form-control"  :placeholder="register.en.inputAdress">
                                        <span class="input-status"></span>
                                        <p class="status-info">{{register.en.inputAdressInfo}}</p>
                                    </div>
                                    <div class="form-group" data-status="success">
                                            <em style="color: #CD454A;">*</em>
                                            <input type="text" class="form-control"  :placeholder="register.en.inputCompany">
                                            <span class="input-status"></span>
                                            <p class="status-info">{{register.en.inputCompanyInfo}}</p>
                                        </div>
                                <div class="form-group" data-status="false">
                                        <em style="color: #CD454A;">*</em>
                                <input type="password" class="form-control" id="registerPassword1" :placeholder="register.en.inputPassword">
                                        <span class="input-status"></span>
                                        <p class="status-info">{{register.en.inputPasswordInfo}}</p>
                                        <div class="status-tips">
                                                <div class="strength">
                                                    <p>{{register.en.statusTips}}</p>
                                                    <div class="strength-box" data-status="low">
                                                        <span></span>
                                                        <span></span>
                                                        <span></span>
                                                    </div>
                                                    <p class="strength-info">{{register.en.passwordStatus}}</p>
                                                </div>
                                                <p class="strength-status" data-status="success"><span></span>{{register.en.strengthStatus1}} </p>
                                                <p class="strength-status" data-status="false"><span></span>{{register.en.strengthStatus2}} </p>
                                                <p class="strength-status" data-status="success"><span></span>{{register.en.strengthStatus3}} </p>
                                            </div>
                                </div>
                                <div class="form-group" data-status="false">
                                        <em style="color: #CD454A;">*</em>
                                        <input type="password" class="form-control"  :placeholder="register.en.inputConfirm">
                                        <span class="input-status"></span>
                                        <p class="status-info">{{register.en.inputConfirmInfo}}</p>
                                </div>
                                <div class="form-group" data-status="false">
                                        <div class="input-group">
                                            <div class="input-group-addon">{{register.en.inputNumberMobile}}</div>
                                            <input type="password" class="form-control"  :placeholder="register.en.inputMobile">
                                        </div>
                                            <span class="input-status"></span>
                                            <p class="status-info">{{register.en.inputMobileInfo}}</p>
                                </div>
                                <div class="form-group code-verification" data-status="false">
                                    <input type="text" class="form-control"  :placeholder="register.en.inputVerification">
                                    <button type="button" class="btn btn-default">{{register.en.inputVerificationBtn}}</button>
                                    <span class="input-status"></span>
                                    <p class="status-info">{{register.en.inputVerificationInfo}}</p>
                                </div>
                                
                                <button type="submit" class=" submit btn btn-default">{{ register.en.signIn }}</button>
                                <p class="help-block">{{ register.en.helpBlock }}<a :href="register.en.helpBlockLink">{{ register.en.helpBlockInfo }}</a>  </p>
                            </form>
                    </div>
            </div>
        </div>
    </div>

        `,
        props: ['model', 'locale'],
        created(){
            console.log('login page')
        },
        data:function(){
          return {
            register:{
                en:{
                    registerTitle:"Sign up",
                    inputName:'Account name',
                    inputNameInfo:'Username is 5-25 characters and needs to contain letters.',
                    inputAdress:'Email address',
                    inputAdressInfo:'Username is 5-25 characters and needs to contain letters.',
                    inputCompany:'Company name',
                    inputCompanyInfo:'Username is 5-25 characters and needs to contain letters.',
                    inputPassword:'Password',
                    inputPasswordInfo:'Username is 5-25 characters and needs to contain letters.',
                    statusTips:'Strength',
                    passwordStatus:'Low',
                    strengthStatus1:'5 to 25 charcters',
                    strengthStatus2:'Contains only letters,numbers and symbols ',
                    strengthStatus3:'Contains at least two of the following: letters,numbers,symbols.',
                    inputConfirm:'Password',
                    inputConfirmInfo:'Username is 5-25 characters and needs to contain letters.',
                    inputMobile:'Mobile number',
                    inputNumberMobile:'+86',
                    inputMobileInfo:'Username is 5-25 characters and needs to contain letters.',
                    inputVerification:'Verification code',
                    inputVerificationBtn:'Get code',
                    inputVerificationInfo:'Username is 5-25 characters and needs to contain letters.',
                    signIn:'Sign in',
                    helpBlock:'Don’t have an account?',
                    helpBlockInfo:'Sign up',
                    helpBlockLink:'#', 
                }
            }
          }
        },
        methods:{

        }
    });
})();
// 
/* 
      #content
        #loginAdv
          .mainInfo
            h3 Brand Intelligence & Brand Protection
            p Making digital commerce trustworthy through big data, AI and blockchain
        #login-form
          h2.login-title Log in
            form
              .form-group
                input.form-control(type="text" id="exampleInputName2" placeholder="Jane Doe")
              .form-group
                input.form-control(type="password" class="form-control" placeholder="Password")
              .checkbox
                label
                  span.s-checkbox(class="active" type="checkbox")
                  | Remember me
                p.forget-password
                  a(href='#') Forget Password ?
              .form-group
              button(type="submit" class="btn btn-default") Sign in 
              p.help-block Don’t have an account?
                a(href='#') Sign up
      // /container


*/
(function() {
  Vue.component("vc-registerwarp", {
    template: `
            <div id='content'>
            <div id="login-adv">
            <div class="main-info">
                <h3></h3>
                <p>{{ login.en.subInfo }}</p>
            </div>
          </div>
          <div id="login-form">
              <h2 class="login-title">{{ login.en.loginTitle }}</h2>
              <div class="login-status-info">
                <span></span>
                <p>{{ login.en.loginStatusinfo }}</p>
              </div>
              <form>
                  <div class="form-group">
                      <input type="text" class="form-control" :placeholder=" login.en.inputName ">
                  </div>
                  <div class="form-group">
                   <input type="password" class="form-control"  :placeholder=" login.en.inputPassword ">
                  </div>
                  <div class="checkbox">
                    <label v-on:click="checkboxToggle">
                      <span class="s-checkbox"  type="checkbox" :class="{'active':isActive}" ></span> {{ login.en.rememberMe }}
                    </label>
                    <p class="forget-password"><a href="#"></a>{{ login.en.forget }}</p>
                  </div>
                  <div class="form-group">
                     
                   </div>
                   <button type="submit" class=" submit btn btn-default">{{ login.en.signIn }}</button>
                   <p class="help-block">{{ login.en.helpBlock }}<a :href="login.en.helpBlockLink">{{ login.en.helpBlockInfo }}</a>  </p>
                </form>
          </div>
            </div> 
        `,
    data: function(){
        return {
            isActive:false,
            login:{
                en :{
                    mainInfo:"Brand Intelligence & Brand Protection",
                    subInfo:"Making digital commerce trustworthy through big data, AI and blockchain",
                    loginTitle:"Log in",
                    loginStatusinfo:"Login or login password is incorrect",
                    inputName:'Jane Doe',
                    inputPassword:'Password',
                    rememberMe:'Remember me',
                    forget:'Forget Password ?',
                    signIn:'Sign in',
                    helpBlock:'Don’t have an account?',
                    helpBlockInfo:'Sign up',
                    helpBlockLink:'#',
                }
            }
        }   
    },
    props: ["model", "locale"],
    created() {
      console.log("registerwarp page");
    },
    methods:{
        checkboxToggle:function(){
            this.isActive = !this.isActive;
        }
    }
  });
})();

(function(){
        let _locales = {
            cn:{
                entry:{
                    
                }
            },
            en:{
                entry:{
                    
                }
            }
        }    
        let _localeSources = [
            {
                path: '/',
                source: 'entry.json'
            }
        ];
        let _appViewState = {
            currentRoute: null,
            currentTitle: '',
            lang: 'cn'
        };
        let _appViewModel = {
            // sideMenu: _sidemenuModel,
            locales: null
        };
        const routes1 =[{
            path: "/login",
            // redirect: "/CounterfeitProduct"
            component:Vue.component("vc-loginwarp")
        },
        {
            path: "/register",
            // redirect: "/CounterfeitProduct"
            component:Vue.component("vc-registerwarp")
        }
    
      
      ];
        const routes2 = [];
        const routes = routes1.concat(routes2)
        routes.push( {
            path: "/",
            redirect: "/login"
        });
    
        const router = new VueRouter({
            //mode: 'history', //default mode is "hash" mode, history mode allow browser navigation
            routes
        });
    
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
        $(document).ready(function () {
            //load 登录页面
            debugger
            if (true !== wna.IsNullOrEmpty(_localeSources)) {
                _localesLoader(0, {}, function (locales) {
                    console.log('--------- loaded locales: ', locales);
                    _appViewModel.locales = locales;
    
                    let vapp = new Vue({
                        el: '#pagewrap',
                        router: router,
                        data: {
                            // model: _appDataModel,
                            viewModel: _appViewModel,
                            viewState: _appViewState
                        },
                        methods: {
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
                        },
                        watch: {
                           
                        },
                        computed: {
                            currentLocale: function(){
                                let thisvue = this;
                                return thisvue.viewModel.locales[thisvue.viewState.lang];
                            }
                        },
                        mounted: function () {
                            console.log('----- vue app inited');
                        }
                    });
                });
            }
    
        });


    })();