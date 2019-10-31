(function() {
  Vue.component("vc-registerwarp", {
    template: `
    <div id="content">
    <div class="register-container">
        <div class="register-box">
                <div id="register-form">
                        <h2 class="login-title">{{ locale.registerTitle }}</h2>
                        <form>
                            <div class="form-group" :data-status="Verification.inputName.status">
                                <em style="color: #CD454A;" v-if="Verification.inputName.icon">*</em>
                                <input type="text" class="form-control" :placeholder="locale.inputName" v-model="Verification.inputName.value" @blur="validateFunc('inputName')" @focus="resetDefault('inputName')">
                                    <span class="input-status"></span>
                                    <p class="status-info">{{ locale.inputNameInfo }}</p>
                            </div>
                            <div class="form-group" :data-status="Verification.inputAdress.status">
                                    <em style="color: #CD454A;" v-if="Verification.inputAdress.icon">*</em>
                                    <input type="text" class="form-control"  :placeholder="locale.inputAdress" v-model="Verification.inputAdress.value" @blur="validateFunc('inputAdress')" @focus="resetDefault('inputAdress')">
                                    <span class="input-status"></span>
                                    <p class="status-info">{{locale.inputAdressInfo}}</p>
                                </div>
                                <div class="form-group" :data-status="Verification.inputCompany.status">
                                        <em style="color: #CD454A;" v-if="Verification.inputCompany.icon">*</em>
                                        <input type="text" class="form-control"  :placeholder="locale.inputCompany"  v-model="Verification.inputCompany.value" @blur="validateFunc('inputCompany')" @focus="resetDefault('inputCompany')">
                                        <span class="input-status"></span>
                                        <p class="status-info">{{locale.inputCompanyInfo}}</p>
                                    </div>
                            <div class="form-group" :data-status="Verification.inputPassword.status">
                                    <em style="color: #CD454A;"  v-if="Verification.inputPassword.icon">*</em>
                            <input type="password" class="form-control" id="registerPassword1" :placeholder="locale.inputPassword" v-model="Verification.inputPassword.value"  @keyup="passwordInput('inputPassword')" @blur="validateFunc('inputPassword')" @focus="resetDefault('inputPassword')">
                                    <span class="input-status"></span>
                                    <p class="status-info">{{locale.inputPasswordInfo}}</p>
                                    <div class="status-tips" :class="{'tipShow':Verification.inputPassword.tips}">
                                            <div class="strength">
                                                <p>{{locale.statusTips}}</p>
                                                <div class="strength-box" :data-status="Verification.inputPassword.strength.level" v-model="level">
                                                    <span></span>
                                                    <span></span>
                                                    <span></span>
                                                </div>
                                                <p class="strength-info">{{level}}</p>
                                            </div>
                                            <p class="strength-status" :data-status="Verification.inputPassword.strength.strength1"><span></span>{{locale.strengthStatus1}} </p>
                                            <p class="strength-status" :data-status="Verification.inputPassword.strength.strength2"><span></span>{{locale.strengthStatus2}} </p>
                                            <p class="strength-status" :data-status="Verification.inputPassword.strength.strength3"><span></span>{{locale.strengthStatus3}} </p>
                                        </div>
                            </div>
                            <div class="form-group" :data-status="Verification.inputConfirm.status">
                                    <em style="color: #CD454A;" v-if="Verification.inputConfirm.icon">*</em>
                                    <input type="password" class="form-control" :placeholder="locale.inputConfirm" v-model="Verification.inputConfirm.value" @blur="validateFunc('inputConfirm')" @focus="resetDefault('inputConfirm')">
                                    <span class="input-status"></span>
                                    <p class="status-info">{{locale.inputConfirmInfo}}</p>
                            </div>
                            <div class="form-group" :data-status="Verification.inputMobile.status">
                                    <div class="input-group">
                                        <div class="input-group-addon">{{locale.inputNumberMobile}}</div>
                                        <input type="text" class="form-control"  :placeholder="locale.inputMobile" v-model="Verification.inputMobile.value" @keyup="canClickGetCode(Verification.inputMobile.value)" @blur="validateFunc('inputMobile')" @focus="resetDefault('inputMobile')">
                                    </div>
                                        <span class="input-status"></span>
                                        <p class="status-info">{{locale.inputMobileInfo}}</p>
                            </div>
                            <div class="form-group code-verification" :data-status="Verification.inputVerification.status">
                                <input type="text" class="form-control"  :placeholder="locale.inputVerification" v-model="Verification.inputVerification.value" @blur="validateFunc('inputVerification')" @focus="resetDefault('inputVerification')">
                                <button type="button" class="btn btn-default" @click="sendCode">{{locale.inputVerificationBtn}}</button>
                                <span class="input-status"></span>
                                <p class="status-info">{{locale.inputVerificationInfo}}</p>
                            </div>
                            
                            <button type="button" class=" submit btn btn-default" @click="registerr">{{ locale.signIn }}</button>
                            <p class="help-block">{{ locale.helpBlock }}<a href="javascript:void(0);" @click="goToLoginPage">{{ locale.helpBlockInfo }}</a>  </p>
                        </form>
                </div>
        </div>
    </div>
    <div class="modal fade" id="register" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                    <span class="modal-success-icon"></span>
                        <h3>{{ locale.modalRegisterH3 }}</h3>
                        <p>{{ locale.modalRegisterP }}</p>
                    </div>
                    <div class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="modalGoToLoginPage">OK</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="register-error" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-body">
                <span class="modal-success-icon"></span>
                    <h3>{{ locale.modalRegisterErrorH3 }}</h3>
                    <p>{{ locale.modalRegisterErrorP }}</p>
                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-primary" @click="$('#register-error').modal('hide')">OK</button>
                </div>
            </div>
        </div>
    </div>
</div>
    `,
    props: ["model", "locale", "lang", "sharedLocale"],
    created() {
      console.log("login page");
    },
    data: function() {
      return {
        codeNum: null,
        verifysmsrequest: false,
        level: "low",
        Verification: {
          inputName: { value: "", icon: 1, status: "" },
          inputCompany: { value: "", icon: 1, status: "" },
          inputAdress: { value: "", icon: 1, status: "" },
          inputPassword: {
            value: "",
            icon: 1,
            status: "",
            tips: 0,
            strength: {
              level: "low",
              strength1: "false",
              strength2: "false",
              strength3: "false"
            }
          },
          inputConfirm: { value: "", icon: 1, status: "" },
          inputMobile: { value: "", icon: 1, status: "", isClick: false },
          inputVerification: { value: "", icon: 1, status: "" }
        }
      };
    },
    watch: {
      Verification: {
        handler(newValue, oldValue) {
          for (let key in newValue) {
            if (newValue.hasOwnProperty(key)) {
              let element = newValue[key];
              newValue[key].icon = Number(!this.required(newValue[key].value));
            }
          }
        },
        deep: true
      }
    },
    methods: {
      registerr() {
        if (
          this.Verification.inputConfirm.status == "success" &&
          this.Verification.inputCompany.status == "success" &&
          this.Verification.inputAdress.status == "success" &&
          this.Verification.inputName.status == "success" &&
          this.Verification.inputPassword.status == "success"
        ) {
          var that = this;
          // user/signup
          let url = `https://bps-mynodesql-api.blcksync.info:444/v0/users/signup`;
          let dataRegister = {
            email: this.Verification.inputAdress.value,
            password: this.Verification.inputPassword.value,
            telnum: this.Verification.inputMobile.value,
            company: this.Verification.inputCompany.value,
            username: this.Verification.inputName.value
          };
          $.ajax(url, {
            type: "POST",
            data: dataRegister,
            success: function(data) {
              if (that.isRemenber) {
                that.setLocalStorage(
                  "user",
                  that.Verification.inputAdress.value
                );
                that.setLocalStorage(
                  "userPassword",
                  that.Verification.inputPassword.value
                );
              }
              //邮件确认弹窗
              $("#register").modal("toggle");
            },
            error: function(response) {
              $("#register-error").modal("toggle");
            }
          });
        }
      },
      sendCode() {
        // user/verifysmsrequest（发送短信验证码）
        if (this.Verification.inputMobile.status == "success") {
          var num = 60,
            str = null;
          var interval = setInterval(function() {
            $("#register-form .code-verification .btn").prop("disabled", true);
            num--;
            str = "Resend in " + num + "s";
            $("#register-form .code-verification .btn").html(str);
            if (num < 0) {
              $("#register-form .code-verification .btn").html("get code");
              $("#register-form .code-verification .btn").prop(
                "disabled",
                false
              );
              clearInterval(interval);
            }
          }, 1000);
          let url = `https://bps-mynodesql-api.blcksync.info:444/v0/users/verifysmsrequest`;
          let dataSendCode = {
            email: this.Verification.inputAdress.value,
            telnum: this.Verification.inputMobile.value
          };
          $.ajax(url, {
            type: "POST",
            data: JSON.stringify(dataSendCode),
            contentType: "application/json",
            success: function(data) {},
            error: function(response) {}
          });
        }
      },
      modalGoToLoginPage() {
        $("#register").modal("hide");
        this.$router.push({ path: "/login" });
      },
      goToLoginPage() {
        this.$router.push({ path: "/login" });
      },
      validateFunc(key) {
        var value = this.Verification[key].value;
        var status = "";
        if (key == "inputName") {
          var rex = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
          status = this.required(value)
            ? this.rangelength(value, [5, 20]) && rex.test(value)
              ? "success"
              : "false"
            : "default";
        } else if (key == "inputAdress") {
          status = this.required(value)
            ? this.email(value)
              ? "success"
              : "false"
            : "default";
        } else if (key == "inputCompany") {
          var rex =/^[\!\#\~\@]+$/;
          status = this.required(value)
            ? this.rangelength(value, [0, 50]) && !rex.test(value)
              ? "success"
              : "false"
            : "default";
        } else if (key == "inputPassword") {
          this.Verification[key].tips = 0;
          status = this.required(value)
            ? this.rangelength(value, [5, 20])
              ? "success"
              : "false"
            : "default";
          this.passwordInput(key);
        } else if (key == "inputConfirm") {
          status = this.required(value)
            ? value == this.Verification["inputPassword"].value
              ? "success"
              : "false"
            : "default";
        } else if (key == "inputMobile") {
          status = this.required(value)
            ? this.phone(value)
              ? "success"
              : "false"
            : "default";
        } else if (key == "inputVerification") {
          var that = this;
          // user/verifysmsrequest
          if (this.Verification.inputMobile.status == "success") {
            let url = `https://bps-mynodesql-api.blcksync.info:444/v0/users/verifysms`;
            let dataCheckCode = {
              email: this.Verification.inputAdress.value,
              telnum: this.Verification.inputMobile.value,
              smsid: this.Verification.inputVerification.value
            };
            $.ajax(url, {
              type: "POST",
              data: dataCheckCode,
              success: function(data) {
                that.verifysmsrequest = true;
                status = that.required(value)
                  ? that.rangelength(value, [5, 25]) && that.verifysmsrequest
                    ? "success"
                    : "false"
                  : "default";
                key != "inputPassword" && (that.Verification[key].tips = 0);
                that.Verification[key].status = status;
              },
              error: function(response) {
                that.verifysmsrequest = false;
                status = that.required(value)
                  ? that.rangelength(value, [5, 25]) && that.verifysmsrequest
                    ? "success"
                    : "false"
                  : "default";
                key != "inputPassword" && (that.Verification[key].tips = 0);
                that.Verification[key].status = status;
              }
            });
          }
        }
        key != "inputPassword" && (this.Verification[key].tips = 0);
        this.Verification[key].status = status;
      },
      resetDefault(key) {
        this.Verification[key].status == "default" &&
          (this.Verification[key].status = "");
        key == "inputPassword" &&
          ((this.Verification[key].tips = 1), this.passwordInput(key));
      },
      passwordInput(key) {
        var rex = /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/;
        var rexx = /^(?=.*\d)(?=.*[a-z])(?=.*[!@#$%^&*]).{5,}$/;
        let level = 0;
        let strength1, strength2, strength3;
        this.required(this.Verification[key].value) &&
        this.rangelength(this.Verification[key].value, [5, 25])
          ? ((strength1 = "success"), level++)
          : (strength1 = "false");
        this.required(this.Verification[key].value) &&
        this.rangelength(this.Verification[key].value, [2, 25]) &&
        rex.test(this.Verification[key].value)
          ? ((strength2 = "success"), level++)
          : (strength2 = "false");
        this.required(this.Verification[key].value) &&
        this.rangelength(this.Verification[key].value,  [5, 25]) &&
        rex.test(this.Verification[key].value) &&
        rexx.test(this.Verification[key].value)
          ? ((strength3 = "success"), level++)
          : (strength3 = "false");
        this.Verification[key].strength = {
          strength1: strength1,
          strength2: strength2,
          strength3: strength3
        };
        this.Verification[key].strength.level =
          level < 2 ? "low" : level < 3 ? "center" : "height";
        this.level = this.Verification[key].strength.level;
      },
      canClickGetCode(value) {
        this.Verification.inputMobile.isClick =
          this.required(value) && this.phone(value);
      },
      required(value) {
        return value.trim().length > 0;
      },
      email: function(value) {
        if (value == null || this.trim(value) == "") return true;
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{3,}))$/.test(
          value
        );
      },
      //字符串长度的范围
      rangelength: function(value, param) {
        if (value == null || this.trim(value) == "") return true;
        return value.replace(/[^\x00-\xff]/g, '01').length >= param[0] && value.length <= param[1];
      },
      //手机号码
      phone: function(value) {
        if (value == null || this.trim(value) == "") return true;
        var rex = /^1[345789]\d{9}$/;
        return rex.test(value);
      },
      //密码
      password: function(value, param) {
        if (value == null || this.trim(value) == "") return true;
        var rex = /^(?=.*\d+)(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*[^A-Za-z0-9\s]+)\S{8,16}$/;
        return rex.test(value);
      },
      trim(value) {
        return value.replace(/(^\s*)|(\s*$)/g, "");
      },
      //账号本地存储时效
      setLocalStorage(key, value) {
        var curtime = new Date().getTime(); // 获取当前时间 ，转换成JSON字符串序列
        var valueDate = JSON.stringify({
          val: value,
          timer: curtime
        });
        console.log(valueDate);
        localStorage.setItem(key, valueDate);
      },
      getLocalStorage(key) {
        var exp = 60 * 60 * 24 * 1000 * 30; // 一天的秒数
        if (localStorage.getItem(key)) {
          var vals = localStorage.getItem(key); // 获取本地存储的值
          var dataObj = JSON.parse(vals); // 将字符串转换成JSON对象
          // 如果(当前时间 - 存储的元素在创建时候设置的时间) > 过期时间
          var isTimed = new Date().getTime() - dataObj.timer > exp;
          console.log(isTimed, new Date().getTime() - dataObj.timer);
          if (isTimed) {
            console.log("存储已过期");
            localStorage.removeItem(key);
            return null;
          } else {
            var newValue = dataObj.val;
          }
          return newValue;
        } else {
          return null;
        }
      }
    }
  });
})();
