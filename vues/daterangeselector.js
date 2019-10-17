(function() {
  Vue.component("vc-daterange-selector", {
    template: `
        <div class="datetimeselector">
            <span class="datetimespan">{{locale.caption}}</span>
            <input class="datetimeinput" type="text" ref="daterangepicker">
            <button type="button" value="7">{{locale.days7}}</button>
            <button type="button" value="15">{{locale.days15}}</button>
            <button type="button" value="30">{{locale.days30}}</button>
            <i class="screen-icon" @click="changeScreen"></i>
            <div class="screen-menu" v-show="isSCreen">
                <h2>Brand</h2>
                <div class="screen-menu-search-box">
                    <span></span>
                <input type="text" class="screen-menu-search" v-model="screenInputValue" placeholder="Search" @keyup="screenInputFunction">
                </div>
                <div class="screen-list">
                    <ul>
                        <li v-for="(site,i) in screenData"><label><span :class="{'active':site.flag}" @click="changeChecked" :id="site.id" v-bind:data="i"></span><i>{{site.name}}</i></label></li>
                    </ul>
                </div>
                <div class="screen-btn">
                    <button type="" @click="screenBtnClick">OK</button>
                </div>
            </div>
            <div class="screen-slide" v-if="screenSLideData[0]">
                <h2>Brand:</h2>
                <ul>
                    <li v-for="site in displayedScreenSlide" ><span>{{site}}</span><i class="screen-closed"></i></li>
                </ul>
            </div>
        </div>
        `,
    props: ["locale"],
    data: function() {
      return {
          startTime:'',
          endTime:'',
        isSCreen: false,
        dateStart: null,
        dateEnd: null,
        $picker: null,
        screenInputValue: "",
        screenData: [{ id: 'all', name: "ALL" ,flag:false}], // filter menu data
        screenSLideData: [],
        // filterTagData: [], // store all selected tag data
        isAllTag: false,
      };
    },
    computed: {
      displayedScreenSlide(){
        return this.isAllTag ? ['ALL'] : this.screenSLideData;
      },
    },
    watch: {
      // screenData: {
      //   handler(oldVal, newVal) {
      //     console.log('changed watch')
      //     // newVal.forEach(ele => {
      //     //   //取消 all 勾选
      //     //   if(ele.flag === false && ele.name !== "ALL") {
      //     //     this.uncheckTheAllTag();
      //     //   } else {
      //     //     this.checkTheAllTag();
      //     //   }
      //     // });
      //   },
      //   deep: true,
      // }
    },
    mounted: function() {
        window.brandData='';
        var that = this;
      (function(thisvue, $picker) {
        $picker
          .daterangepicker({
            locale: {
              format: "DD/MM/YYYY"
            }
          })
          .on("cancel.daterangepicker", function() {
            thisvue.saveDateRange(null);
          })
          .on("apply.daterangepicker", function(ev, picker) {
            thisvue.saveDateRange(picker.startDate, picker.endDate);
          });
         
        $('button[type="button"]', $(thisvue.$el)).on("click", function(ev) {
          let $clicked = $(ev.target);
          let days = $clicked.val();
          if (true === wna.IsNullOrUndefined(days)) {
            return;
          }
          let end = moment();
          let start = moment().subtract(days, "days");
          $picker.data("daterangepicker").setStartDate(start);
          $picker.data("daterangepicker").setEndDate(end);
          that.startTime = start;
          that.endTime = end;
          window.startTimes = start;
          window.endTimes = end;
          thisvue.saveDateRange(start, end);
        });

        thisvue.$picker = $picker;
        $('button[type="button"][value="7"]').trigger("click"); //trigger initial daterange change event
      })(this, $(this.$refs.daterangepicker));
      var that = this;
      // the all tag select event
      $(document).on("click", ".screen-list span:first", function() {
        if ($(this).hasClass("active")) {
          $(this).removeClass("active");
          that.screenData[$(this).attr("data")].flag = false;
          that.isAllTag = false;
          that.uncheckAllTags();
          return;
        }
        $(this).addClass("active");
        that.screenData[$(this).attr("data")].flag = true;
        that.isAllTag = true;
        that.checkAllTags();
      });
      // tag select event
      $(document).on("click", ".screen-list span:gt(0)", function() {
        // unchecking
        if ($(this).hasClass("active")) {
          that.uncheckCertainTag($(this));
          that.filterCheckChange()
          return;
        }
        // checking
        that.checkCertainTag($(this));
        that.filterCheckChange();
      });
      $(document).on("click", ".screen-slide .screen-closed", function() {
        that.screenSLideData.splice(
          $.inArray(
            $(this)
              .closest("li")
              .text(),
            that.screenSLideData
          ),
          1
        );
        var _that = this;
        // remove menu select while deleting the  screen slide tags
        if($(this).closest("li").text() === "ALL") {
          that.uncheckTheAllTag();
          that.uncheckAllTags();
        }
        for (var i = that.screenData.length - 1; i >= 0; i--) {
          if (that.screenData[i].name.indexOf($(_that).siblings().text())>=0){$(".screen-list span").eq(i).removeClass("active");}
        }
        //发起数据请求
        var str = "";
        var brandData = "";
        $('.screen-list .active').each(function(){
            return str +=$(this).attr('id')+','
        });
        brandData = str.slice(0,str.length-1);
        if(brandData.indexOf("all")==0){
            window.brandData = '';
            that.saveDateRange(that.startTime,that.endTime);
          }else {
              window.brandData = brandData;
              that.saveDateRange(that.startTime,that.endTime);
        }
      });
      var that =this;
      //获取列表
      let reportUrl = `https://bps-mynodesql-api.blcksync.info:444/v0/query/metric/commodity_test_report?key=top_brand&start_date=2019-04-01 00:00:00&end_date=2019-08-01 00:00:00`;
      $.ajax({
        url: reportUrl,
        type: "GET",
        changeOrigin: true,
        headers: {
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("token")).val + ""
        },
        success: function(rex) {
          // init new coming tags with 'false' flag
          let results = rex.results.map(function(val) {
            return {
              ...val,
              flag:false,
            }
          });
          that.screenData= that.screenData.concat(results);
          // init filter menu with all checked
          that.$nextTick(function () {
            that.isAllTag = true;
            that.checkTheAllTag();
            that.checkAllTags();
          });
        },
        error: function(response) {}
      });
      
    },
    methods: {
      filterCheckChange() {
        let toggle = true;
        this.screenData.forEach(ele => {
          //取消 all 勾选
          if(!ele.flag && ele.name !== "ALL") {
            toggle = false;
          }
          this.isAllTag = toggle;
        });
        if(this.isAllTag) {
          this.checkTheAllTag();
        } else {
          this.uncheckTheAllTag();
        }
      },
      // check all tags, if the all tag is checked
      checkAllTags: function(){
        let that = this;
        console.log(".screen-list span:gt(0)")
        console.log($(".screen-list span"))
        // reset data to avoid duplication
        that.screenSLideData = [];
        $(".screen-list span:gt(0)").each(function (index) {
          that.checkCertainTag($(this));
        });
      },
      uncheckAllTags: function(){
        let that = this;
        $(".screen-list span:gt(0)").each(function (index) {
          that.uncheckCertainTag($(this));
        });
        // that.screenSLideData = [];
      },
      // in the condition of not all tags are check, remove the all checked.
      uncheckTheAllTag: function() {
        let jqThis = $(".screen-list span").eq(0).removeClass("active");
        this.screenData[$(jqThis).attr("data")].flag = false;
      },
      checkTheAllTag : function (){
        let jqThis = $(".screen-list span").eq(0).addClass("active");
        this.screenData[0].flag = true;
      },
      uncheckCertainTag: function (jqEle) {
        $(jqEle).removeClass("active");
        this.screenData[$(jqEle).attr("data")].flag = false;
        this.screenSLideData.splice($.inArray($(jqEle).closest("li").text(),this.screenSLideData),1);
      },
      checkCertainTag: function (jqEle) {
        $(jqEle).addClass("active");
        this.screenData[$(jqEle).attr("data")].flag = true;
        this.screenSLideData.push(
          $(jqEle)
            .closest("label")
            .text()
        );
      }, 
      saveDateRange: function(start, end) {
        let thisvue = this;
        end = true === wna.IsNullOrEmpty(end) ? start : end;
        if (true !== wna.IsNullOrEmpty(start)) {
          thisvue.dateStart = start;
          thisvue.dateEnd = end;
        } else {
          thisvue.dateStart = null;
          thisvue.dateEnd = null;
        }
        $(thisvue.$el).fire("change", { start: start, end: end });
      },
      changeScreen: function() {
       this.isSCreen = !this.isSCreen;
      },
      changeChecked: function() {},
      screenBtnClick: function() {
          var str = "";
          var brandData = "";
          $('.screen-list .active').each(function(){
              return str +=$(this).attr('id')+','
          });
          brandData = str.slice(0,str.length-1);
          console.log('-------branddata-----')
          console.log(brandData)
          if(brandData.indexOf("all")>= 0){
              window.brandData = '';
              this.saveDateRange(this.startTime,this.endTime);
          }else {
              window.brandData = brandData;
              this.saveDateRange(this.startTime,this.endTime);
          }
          this.isSCreen = false;
      },
      screenInputFunction: function() {
        $(".screen-list li").show();
        var that = this;
        for (var i = this.screenData.length - 1; i >= 0; i--) {
          console.log(that.screenData[i].name.toLowerCase().indexOf(that.screenInputValue.toLowerCase())||
          that.screenData[i].name.indexOf(that.screenInputValue.toLowerCase())||
          that.screenData[i].name.indexOf(that.screenInputValue.toUpperCase())||
          that.screenData[i].name.indexOf(that.screenInputValue))
          if (
            that.screenData[i].name.toLowerCase().indexOf(that.screenInputValue.toLowerCase())>=0||
            that.screenData[i].name.indexOf(that.screenInputValue.toLowerCase())>=0||
            that.screenData[i].name.indexOf(that.screenInputValue.toUpperCase())>=0||
            that.screenData[i].name.indexOf(that.screenInputValue)>=0
            ){}else {
              $(".screen-list li").eq(i).hide();
            }
           
        }
      }
    }
  });
})();
