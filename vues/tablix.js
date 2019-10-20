(function() {
  Vue.component("vc-tablix", {
    template: `
          <div style="position:relative;">
            <div class="table-loader" v-if="viewModel.tableLoading">
              <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            </div>
            <table :id="id" class="table table-striped" v-if="true !== wna.IsNullOrEmpty(viewModel.cols)">
                <thead>
                    <tr>
                        <td v-if="true === viewModel.multiselect">
                            <!--
                            <input type="checkbox" ref="checkall" :id="'tablix_checkall_' + id" v-on:change="onCheckAllChange" /><label :for="'tablix_checkall_' + id">&nbsp;</label>
                            //-->
                        </td>
                        <td v-for="c in viewModel.cols" v-if="(true === viewModel.shouldActivateCols(c))" v-on:click="onSort(c.fieldid)"><span>{{locale.fields[c.fieldid]}}</span><div class="sortable-col-head-icon">&nbsp;</div></td>
                    </tr>
                </thead>
                <tbody id="" v-if="(true !== wna.IsNullOrEmpty(model))">
                    <tr v-for="(r, i) in sortedModel">
                    <!-- //-->
                        <td v-if="true === viewModel.multiselect"><input type="checkbox"  
                         :ref="rowId(i)" :id="rowId(i)" :value="r[viewModel.primaryKey]" v-bind:disabled="r['Feedback']==1" v-model="viewState.selectedRows" ><label :for="rowId(i)">&nbsp;</label></td>
                        <td v-for="c in viewModel.cols" v-if="(true === viewModel.shouldActivateCols(c))" v-html="(true === wna.IsFunction(c.transform)) ? (c.transform(r[c.fieldid], r)) : (r[c.fieldid])"></td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td :colspan="((true === viewModel.selectable) || (true === viewModel.multiselect)) ? viewModel.cols.length + 1: viewModel.cols.length">
                            <div>
                                <div class="total">{{locale.total_head}} {{ (true !== wna.IsNullOrEmpty(model.info)) ? model.info.countNum : '0' }} {{locale.total_tail}}</div>
                                <div class="paginator" v-if="(true !== wna.IsNullOrUndefined(viewState.totalPages)) && (viewState.totalPages > 1)">
                                    <button name="pagefrst" v-on:click="onPageChange(0)"></button>
                                    <button name="pageprev" v-on:click="onPageChange(null, -1)"></button>
                                    <button name="pagejump" v-on:click="onPageChange(j)" v-for="j in pageJumps" :disabled="(true === wna.IsNullOrUndefined(j))" v-bind:class="[(j === viewState.currentPage) ? 'active' : '']">{{ (true !== wna.IsNullOrUndefined(j)) ? (j + 1) : '...'}}</button> 
                                    <button name="pagenext" v-on:click="onPageChange(null, 1)"></button>
                                    <button name="pagelast" v-on:click="onPageChange(viewState.totalPages-1)"></button>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
          </div>
        `,
    props: ["id", "model", "viewModel", "locale", "lang"],
    data: function() {
      return {
        viewState: {
          selectedRows: [],
          currentPage: null,
          totalPages: 0,
          needSort: false,
          sorting: []
        },
      };
    },
    watch: {
      model: {
        deep: true,
        handler: function() {
          let thisvue = this;
          let vwstate = thisvue.viewState;
          let vwmodel = thisvue.viewModel;
          let data = thisvue.model;
            console.log(111,data,000)
          if (true !== wna.IsNullOrUndefined(vwmodel.rowsPerPage)) {
            if (true === wna.IsNullOrEmpty(data)) {
              thisvue.viewState.totalPages = 0;
              thisvue.viewState.currentPage = null;
            } else {
              thisvue.viewState.totalPages = Math.ceil(
                data.info.countNum / vwmodel.rowsPerPage
              );
              // 前任坑：page 显示的是从0开始，但请求时需加一以页码为准
              thisvue.viewState.currentPage = data.info.page-1;
            }
            console.log(
              "###--- Tablix beforeUpdate: re-calculate pagination : ",
              vwstate.currentPage,
              vwstate.totalPages
            );
          }

          //new data comes, reset the sorting
          if (true !== wna.IsNullOrEmpty(vwstate.sorting)) {
            vwstate.sorting.length = 0;
          }
          vwstate.needSort = true;
        }
      }
    },
    computed: {
      sortedModel: function() {
        let thisvue = this;
        let vwstate = thisvue.viewState;
        let vwmodel = thisvue.viewModel;
        let data = thisvue.model.data;
        console.log("table tableview")
        console.log(data)
        if (true === vwstate.needSort) {
          if (true !== wna.IsNullOrEmpty(vwstate.sorting)) {
            let sort_fields = _.map(vwstate.sorting, "fieldid");
            let sort_orders = _.map(vwstate.sorting, "order");

            _.reverse(sort_fields);
            _.reverse(sort_orders);

            //console.log('-------- sorting: ', sort_fields, sort_orders);
            data = _.orderBy(data, sort_fields, sort_orders);
            console.log(
              "###--- Tablix beforeUpdate: sorting by : ",
              vwstate.sorting
            );
          } else {
            data = _.orderBy(data, [vwmodel.primaryKey], ["desc"]);
          }

          // vwstate.currentPage = 0;
          vwstate.needSort = false;
        }
        console.log(999,data)
        return data;
      },
      // pageStartIndex: function() {
      //   let thisvue = this;
      //   let vwstate = thisvue.viewState;
      //   let vwmodel = thisvue.viewModel;

      //   if (vwstate.totalPages > 1) {
      //     let ret = vwstate.currentPage * vwmodel.rowsPerPage;
      //     console.log("------ pageStartIndex: ", ret);
      //     return ret;
      //   }
      //   return 0;
      // },
      // pageEndIndex: function() {
      //   let thisvue = this;
      //   let vwstate = thisvue.viewState;
      //   let vwmodel = thisvue.viewModel;

      //   if (vwstate.totalPages > 1) {
      //     let ret = (vwstate.currentPage + 1) * vwmodel.rowsPerPage;
      //     console.log("------ pageEndIndex: ", ret);
      //     return ret;
      //   }
      //   return (thisvue.sortedModel || []).length;
      // },
      lastPageStartIndex: function() {
        let thisvue = this;
        let vwstate = thisvue.viewState;
        let vwmodel = thisvue.viewModel;

        if (vwstate.totalPages > 1) {
          let ret = (vwstate.totalPages - 1) * vwmodel.rowsPerPage;
          console.log("------ lastPageStartIndex: ", ret);
          return ret;
        }
        return 0;
      },
      pageJumps: function() {
        // todo: 改写成为用总数除一页个数，然后当前页码
        let thisvue = this;
        let vwstate = thisvue.viewState;
        let ret;

        do {
          if (vwstate.totalPages > 5) {
            if (vwstate.currentPage >= vwstate.totalPages - 3) {
              ret = [
                0,
                undefined,
                vwstate.totalPages - 3,
                vwstate.totalPages - 2,
                vwstate.totalPages - 1
              ];
              break;
            } else {
              if (vwstate.currentPage > 0) {
                ret = [
                  vwstate.currentPage - 1,
                  vwstate.currentPage,
                  vwstate.currentPage + 1,
                  undefined,
                  vwstate.totalPages - 1
                ];
              } else {
                ret = [
                  vwstate.currentPage,
                  vwstate.currentPage + 1,
                  vwstate.currentPage + 2,
                  undefined,
                  vwstate.totalPages - 1
                ];
              }
              break;
            }
          } else {
            //##2019.07.31 - fixes the bug if the number of total pages is less than 5 but the page jumps show 5 pages
            ret = _.times(thisvue.viewState.totalPages, i => i);
            break;
          }
        } while (false);

        console.log("------ page jumps: ", ret);
        return ret;
      }
    },
    //### Methods
    methods: {
      rowId: function(i) {
        return "tr_" + this.id + "_" + i;
      },
      onSort: function(fieldid) {
        let thisvue = this;
        let vwstate = thisvue.viewState;

        /*
                 sorting : [
                     {
                         'fieldid': 'fieldid1',
                         'order': 'desc' //or 'asc'
                     },
                     ...
                 }
                 */
        let sort = _.remove(vwstate.sorting, { fieldid: fieldid });
        if (true !== wna.IsNullOrEmpty(sort)) {
          sort = sort[0];
          sort.order = "desc" === sort.order ? "asc" : "desc";
        } else {
          sort = {
            fieldid: fieldid,
            order: "desc"
          };
        }

        vwstate.sorting.push(sort);
        vwstate.needSort = true;
      },
      onPageChange: function(index, incr) {
        let thisvue = this;
        let vwstate = thisvue.viewState;

        if (
          true !== wna.IsNullOrUndefined(index) &&
          true === wna.IsNumber(index)
        ) {
          if (index >= 0 && index < vwstate.totalPages) {
            vwstate.currentPage = index;
          }
        } else {
          if (
            true !== wna.IsNullOrUndefined(incr) &&
            true === wna.IsNumber(incr)
          ) {
            let target_page = vwstate.currentPage + incr;
            vwstate.currentPage =
              target_page < 0
                ? 0
                : target_page >= vwstate.totalPages
                ? vwstate.totalPages - 1
                : target_page;
          }
        }
        // emit event to request new model
        this.$emit('tableviewModelChange', {
          page: vwstate.currentPage+1,
        })
        //reset the row selection after page change
        vwstate.selectedRows.length = 0;

        //console.log('----- onPageChange : ', index, incr);
      },
      getCurrentSelectedRows: function() {
        let thisvue = this;
        return _.clone(thisvue.viewState.selectedRows);
      }
    },
    //### Lifecycle Hooks
    mounted: function() {},
    beforeUpdate: function() {}
  });
})();
