import Vue from "vue";
import App from "./App.vue";
//引入路由
import router from "./router";
//引入vuex
import store from "./store";

import './permission'
// 加载全局样式  【增加这一句】
import './styles/index.less'
//引入vant
import Vant from 'vant'
//加载vant css样式
import 'vant/lib/index.css'
import 'amfe-flexible'
//引入处理相对时间的工具
import './utils/dayjs'

import { Form, Field, Toast, CountDown, Icon, Image as VanImage, Tab, Tabs, List, PullRefresh, Cell, CellGroup, Popup, ImagePreview } from 'vant';
// 全局注册
Vue.use(ImagePreview);
Vue.use(Popup);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(PullRefresh);
Vue.use(List);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(VanImage);
Vue.use(Vant)
Vue.use(Form);
Vue.use(Field);
Vue.use(Toast);
Vue.use(CountDown);
Vue.use(Icon);
Vue.config.productionTip = false;
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");