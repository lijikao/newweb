(function() {
  Vue.component("vc-passwordwarp", {
    template: `
        <div id="content">
        <div class="password-container">
            <div class="password-top" v-if="isforgetPassword">
                <h2 class="password-title">{{ locale.passwordTitle }}</h2>
            </div>
            <div class="password-top" v-if="isresetPassword">
            <h2 class="password-title">{{ locale.resetPasswordTitle }}</h2>
            </div>
            <div class="password-box" v-if="isforgetPassword">
                <div id="password-form">
                    <form>
                        <div class="form-group">
                            <p class="password-info">请输入您的账号，以进行密码重设</p>
                        </div>
                        <div class="form-group" :data-status="Verification.inputAdress.status">
                            <em style="color: #CD454A;" v-if="Verification.inputAdress.icon">*</em>
                            <input type="text" class="form-control" :placeholder="locale.inputAdress"
                                   v-model="Verification.inputAdress.value" @blur="validateFunc('inputAdress')"
                                   @focus="resetDefault('inputAdress')">
                            <span class="input-status"></span>
                            <p class="status-info">{{locale.inputAdressInfo}}</p>
                        </div>
                        <button type="button" class=" submit btn btn-default" @click="forgetpassword">确认找回</button>
                    </form>
                </div>
            </div>
            <div class="password-box" v-if="isresetPassword">
            <div id="password-form">
                <form v-if="isvisible">
                <div class="form-group">
                        <p class="password-info">账号：{{Verification.inputAdress.value}}</p>
                    </div>
                    <div class="form-group" :data-status="Verification.inputPassword.status">
                        <em style="color: #CD454A;" v-if="Verification.inputPassword.icon">*</em>
                        <input type="password" class="form-control" id="passwordPassword1"
                               :placeholder="locale.inputPassword" v-model="Verification.inputPassword.value"
                               @keyup="passwordInput('inputPassword')" @blur="validateFunc('inputPassword')"
                               @focus="resetDefault('inputPassword')">
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
                            <p class="strength-status" :data-status="Verification.inputPassword.strength.strength1">
                                <span></span>{{locale.strengthStatus1}} </p>
                            <p class="strength-status" :data-status="Verification.inputPassword.strength.strength2">
                                <span></span>{{locale.strengthStatus2}} </p>
                            <p class="strength-status" :data-status="Verification.inputPassword.strength.strength3">
                                <span></span>{{locale.strengthStatus3}} </p>
                        </div>
                    </div>
                    <div class="form-group" :data-status="Verification.inputConfirm.status">
                        <em style="color: #CD454A;" v-if="Verification.inputConfirm.icon">*</em>
                        <input type="password" class="form-control" :placeholder="locale.inputConfirm"
                               v-model="Verification.inputConfirm.value" @blur="validateFunc('inputConfirm')"
                               @focus="resetDefault('inputConfirm')">
                        <span class="input-status"></span>
                        <p class="status-info">{{locale.inputConfirmInfo}}</p>
                    </div>


                    <button type="button" class=" submit btn btn-default" @click="resetpassword">{{locale.passwordStatusInfo3}}</button>
                </form>
                <div class="password-status-info" v-if="!isvisible">
                    <span class="modal-success-icon"></span>
                    <h3>{{locale.passwordStatusInfo1}}</h3>
                    <p>{{locale.passwordStatusInfo2}}</p>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" @click="modalGoToLoginPage">OK</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="password" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        <span class="modal-success-icon"></span>
                        <h3>{{locale.modalRepasswordH3}} </h3>
                        <p>{{locale.modalRepasswordP}} </p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" @click="passwordEmail">OK</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="password-error" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-body">
                    <span class="modal-success-icon"></span>
                    <h3>{{locale.modalpasswordErrorH3}} </h3>
                    <p>{{locale.modalpasswordErrorP}} </p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="$('#password-error').modal('hide')">OK</button>
                </div>
            </div>
        </div>
    </div>
        </div>
    </div>
    `,
    props: ["model", "locale"],
    created() {
      console.log("login page");
    },
    data: function() {
      return {
        passwordtoken: "",
        level: "low",
        isforgetPassword: true,
        isresetPassword: false,
        isvisible: true,
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
    mounted() {
      if (this.$route.query.passwordtoken) {
        var that = this;
        this.isforgetPassword = false;
        this.isresetPassword = true;
        this.Verification.inputAdress.value = this.$route.query.email;
      }
    },
    methods: {
      modalGoToresetPage() {
        $("#password").modal("hide");
        this.isforgetPassword = false;
        this.isresetPassword = true;
      },
      forgetpassword() {
        var that = this;
        let dataforgetpassword = {
          email: this.Verification.inputAdress.value
        };
        //验证邮箱名称
        if (this.Verification.inputAdress.status == "success") {
          $.ajax(
            `https://bps-mynodesql-api.blcksync.info:444/v0/users/resetpassword`,
            {
              type: "Post",
              data: JSON.stringify(dataforgetpassword),
              contentType: "application/json",
              success: function(data) {
                $("#password").modal();
              },
              error: function(response) {
                $("#password-error").modal();
              }
            }
          );
        }
      },
      passwordEmail() {
        $("#password").modal("hide");
      },
      resetpassword() {
        var that = this;
        //需要token*
        let dataNewpassword = {
          passwordtoken: this.$route.query.passwordtoken,
          email: this.Verification.inputAdress.value,
          password: this.Verification.inputPassword.value
        };
        if (
          this.Verification.inputPassword.status == "success" &&
          this.Verification.inputConfirm.status == "success"
        ) {
          
          //新密码接口
          $.ajax(
            `https://bps-mynodesql-api.blcksync.info:444/v0/users/newpassword`,
            {
              type: "POST",
              data: JSON.stringify(dataNewpassword),
              contentType: "application/json",
              success: function(data) {
                that.isvisible = false;
              },
              error: function(response) {
                
              }
            }
          );
        }
      },
      goToResetPassword() {},
      modalGoToLoginPage() {
        $("#password").modal("hide");
        this.$router.push({ path: "/login" });
      },
      goToLoginPage() {
        this.$router.push({ path: "/login" });
      },
      validateFunc(key) {
        let value = this.Verification[key].value;
        let status = "";
        if (key == "inputName") {
          status = this.required(value);
          var rex = /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/;
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
          status = this.required(value)
            ? this.rangelength(value, [0, 50])
              ? "success"
              : "false"
            : "default";
        } else if (key == "inputPassword") {
          this.Verification[key].tips = 0;
          status = this.required(value)
            ? this.rangelength(value, [8, 16])
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
          status = this.required(value)
            ? this.rangelength(value, [5, 25])
              ? "success"
              : "false"
            : "default";
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
        this.rangelength(this.Verification[key].value, [8, 16])
          ? ((strength1 = "success"), level++)
          : (strength1 = "false");
        this.required(this.Verification[key].value) &&
        this.rangelength(this.Verification[key].value, [8, 16]) &&
        rex.test(this.Verification[key].value)
          ? ((strength2 = "success"), level++)
          : (strength2 = "false");
        this.required(this.Verification[key].value) &&
        this.rangelength(this.Verification[key].value, [8, 16]) &&
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
        return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,50}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,50}[a-zA-Z0-9])?)*$/.test(
          value
        );
      },
      //字符串长度的范围
      rangelength: function(value, param) {
        if (value == null || this.trim(value) == "") return true;
        return value.length >= param[0] && value.length <= param[1];
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
      }
    }
  });
})();
