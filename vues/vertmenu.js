/*
 *  model = [
        {
            id: null //or the the unique id within the entire tree of the instance
            title: {
                cn: '选项',
                en: 'item',
                zh: '選項'
            },
            target: null //or the id of the associated action
            submenu: [
                //list of sidemenu model
            ]
        }
    ]
 */
(function(){
    Vue.component('vc-vertmenu', {
        template: `
            <ul v-if="(true !== wna.IsNullOrEmpty(model))">
                <li v-for="en in model">
                    <span class="sidebar-icon" v-bind:class="en.id" v-if="(true === wna.IsNullOrUndefined(en.target))">{{locale[en.id]}}</span>
                    <router-link class="sidebar-icon" v-bind:class="en.id" v-bind:to="'/' + en.target" v-if="(true === wna.IsNullOrEmpty(en.submenu)) &&  (true !== wna.IsNullOrUndefined(en.target))">{{locale[en.id]}}</router-link>
                    <vc-vertmenu v-if="(true !== wna.IsNullOrEmpty(en.submenu))" :model="en.submenu" :locale="locale"></vc-vertmenu>
                </li>
            </ul>
        `,
        props: ['model', 'locale']
    });
})();