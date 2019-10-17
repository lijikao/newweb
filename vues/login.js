(function() {
  Vue.component("vc-loginwarp", {
    template: `
  <div id='content'>
    <div id="login-adv">
        <div class="main-info">{{lang}}
            <h3>{{locale.mainInfo}}</h3>
            <p>{{ locale.subInfo }}</p>
        </div>
    </div>
    <div id="login-form">
        <h2 class="login-title">{{ locale.loginTitle }}</h2>
        <div class="password-status-info" v-if="isPasswordError">
            <p>{{ locale.passwordStatusInfo3 }}<a href="#">{{ locale.passwordStatusInfo }}</a>{{ locale.passwordStatusInfo2 }}</p>
        </div>
        <div class="email-status-info" v-if="isEmailStatus">
            <p>{{ locale.emailStatusInfo3 }}{{ locale.emailStatusInfo }}{{ locale.emailStatusInfo2 }}</p>
        </div>
        <div class="login-status-info" v-if="isLoginStatus">
            <span></span>
            <p>{{ locale.loginStatusinfo }}</p>
        </div>
        <form>
            <div class="form-group" >
                <input type="text" class="form-control" :placeholder=" locale.inputName " v-model="Verification.inputAdress.value" >
               
            </div>
            <div class="form-group" >
                <input type="password" class="form-control" :placeholder=" locale.inputPassword"  v-model="Verification.inputPassword.value"  >
            </div> 
            <div class="checkbox">
                <label v-on:click="checkboxToggle">
                    <span class="s-checkbox" type="checkbox" :class="{'active':isActive}"></span> {{ locale.rememberMe
                    }}
                </label>
                <p class="forget-password"><a href="javascript:void(0);" @click="goToPassword">{{ locale.forget }}</a>
                </p>
            </div>
            <div class="form-group">
                <div id="check-slide"></div>
            </div>
            <button type="button" class="submit btn btn-default" @click="goToLogin">{{ locale.signIn }}</button>
            <p class="help-block">{{ locale.helpBlock }}<a href="javascript:void(0);" @click="goToRegister">{{ locale.helpBlockInfo
                }}</a></p>
        </form>
    </div>
    <div class="modal fade" id="register-error" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-body">
                <span class="modal-success-icon"></span>
                <h3>{{ locale.registerError }}</h3>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" @click="goToRegister">{{ locale.registerErrorBtn }}</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="login-success" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-body">
                <span class="modal-success-icon"></span>
                <h3>{{ locale.loginSuccessInfo }}</h3>
            </div>
            <div class="modal-footer">
               <p>{{ locale.loginSuccessInfo2 }}</P>
            </div>
        </div>
    </div>
</div>


</div> 
        `,
    data: function() {
      return {
        isEmailStatus: false,
        isLoginStatus: false,
        isPasswordError: false,
        isActive: false,
        Verification: {
          inputAdress: { value: "", icon: 1, status: "" },
          inputPassword: {
            value: "",
            icon: 1,
            status: ""
          }
        },
        slideResult: false,
        isRemenber: false,
        isPasswordStatusInfo: false,
        isEmailStatusInfo: false
      };
    },
    created() {},
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
      var that = this;
      //注册邮箱状态判断
      if (this.$route.query.activate_token) {
        //发送验证请求 
        let url = `https://bps-mynodesql-api.blcksync.info:444/v0/users/activate?activate_token=`+ this.$route.query.activate_token + '&uuid='+that.$route.query["uuid"];
        $.ajax({
          url: url,
          type: "GEt",
          changeOrigin: true,
          success: function(rex) {
            that.$router.push({
              path:'./login'
            });
            //验证成功
            $("#login-success").modal();
            var id = setTimeout(function() {
              $("#login-success").modal("hide");
            }, 3000);
          },
          error: function(response) {
            //注册失败
            $("#register-error").modal();
          }
        });
      } else {
        //邮件请激活
        //  this.isEmailStatus = true;
      }
      let _this = this;

      if (this.getLocalStorage("user")) {
        this.Verification.inputAdress.value = this.getLocalStorage("user");
        this.Verification.inputPassword.value = this.getLocalStorage(
          "userPassword"
        );
      }
      $("#check-slide").slider({
        width: 320, // width
        height: 40, // height
        sliderBg: "#E8E8E8", // 滑块背景颜色
        color: "#666", // 文字颜色
        fontSize: 14, // 文字大小
        bgColor: "#E8E8E8", // 背景颜色
        textMsg: "Hold the slider drag to the far right", // 提示文字
        successMsg: "Verification passed", // 验证成功提示文字
        successColor: "#fff", // 滑块验证成功提示文字颜色
        time: 400, // 返回时间
        callback: function(result) {
          // 回调函数，true(成功),false(失败)
          if (result) $("#check-slide").addClass("success");
          _this.slideResult = result;
        }
      });
    },
    methods: {
      validateFunc(key) {
        let value = this.Verification[key].value;
        let status = "";
        if (key == "inputAdress") {
          status = this.required(value)
            ? this.email(value)
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
      goToPassword() {
        this.$router.push({ path: "/password" });
      },
      email: function(value) {
        if (value == null || this.trim(value) == "") return true;
        return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
          value
        );
      },
      required(value) {
        return value.trim().length > 0;
      },
      passwordInput(key) {
        let level = 0;
        let strength1, strength2, strength3;
        this.required(this.Verification[key].value) &&
        this.rangelength(this.Verification[key].value, [5, 25])
          ? ((strength1 = "success"), level++)
          : (strength1 = "false");
        this.required(this.Verification[key].value) &&
        this.rangelength(this.Verification[key].value, [5, 25])
          ? ((strength2 = "success"), level++)
          : (strength2 = "false");
        this.required(this.Verification[key].value) &&
        this.rangelength(this.Verification[key].value, [5, 25])
          ? ((strength3 = "success"), level++)
          : (strength3 = "false");
        this.Verification[key].strength = {
          strength1: strength1,
          strength2: strength2,
          strength3: strength3
        };
        this.Verification[key].strength.level =
          level < 2 ? "low" : level < 3 ? "center" : "high";
      },
      //字符串长度的范围
      rangelength: function(value, param) {
        if (value == null || this.trim(value) == "") return true;
        return value.length >= param[0] && value.length <= param[1];
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
      checkboxToggle: function() {
        this.isActive = !this.isActive;
        this.isRemenber = !this.isRemenber;
      },
      goToRegister() {
        $("#register-error").modal("hide");
        this.$router.push({ path: "/register" });
      },
      goToLogin() {
        var that = this;
        if (this.slideResult) {
          //users/login
          let url = `https://bps-mynodesql-api.blcksync.info:444/v0/users/login`;
          let data = {
            email: this.Verification.inputAdress.value,
            password: this.Verification.inputPassword.value,
            expire: 14400
          };
          $.ajax({
            url: url,
            type: "POST",
            dataType: "json",
            changeOrigin: true,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function(data) {
              console.log(data);
              //账号密码错误
              // isLoginStatus = false;
              if (that.isRemenber) {
                that.setLocalStorage(
                  "user",
                  that.Verification.inputAdress.value
                );
                that.setLocalStorage(
                  "userPassword",
                  that.Verification.inputPassword.value
                );
                that.setLocalStorage(
                  "policy",
                  data.policy
                );
                that.setLocalStorage(
                  "token",
                  data.token
                );
                that.setLocalStorage(
                  "userid",
                  data.UserId
                );
                that.setLocalStorage(
                  "username",
                  data.Username
                );
              }
              that.setLocalStorage("token", data.token);
              that.setLocalStorage("UserId", data.user.UserId);
              that.$router.push({ path: "/CounterfeitProduct" });
            },
            error: function(response) {
              //账号密码错误
              that.isLoginStatus = true;
            }
          });
        }
      },
      //账号本地存储时效
      setLocalStorage(key, value) {
        var curtime = new Date().getTime(); // 获取当前时间 ，转换成JSON字符串序列
        var valueDate = JSON.stringify({
          val: value,
          timer: curtime
        });
        localStorage.setItem(key, valueDate);
      },
      getLocalStorage(key) {
        var exp = 60 * 60 * 24 * 1000 * 30; // 一天的秒数
        if (localStorage.getItem(key)) {
          var vals = localStorage.getItem(key); // 获取本地存储的值
          var dataObj = JSON.parse(vals); // 将字符串转换成JSON对象
          // 如果(当前时间 - 存储的元素在创建时候设置的时间) > 过期时间
          var isTimed = new Date().getTime() - dataObj.timer > exp;
          if (isTimed) {
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
    },
    props: ["model", "locale", "lang", "sharedLocale"]
  });
})();
