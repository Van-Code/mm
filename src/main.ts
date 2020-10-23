import Vue, { VNode } from 'vue';
//common modules

import vuetify from '@/plugins/vuetify';
import { store } from '@/store';
import myApp from '@/App.vue';
import Boilerplate from '@/Boilerplate.vue';
import router from '@/router';

import { omniture } from 'shared/mixins/omniture';

Vue.config.devtools = !location.host.includes('mymagazine.us') || location.search.includes('debug') ? true : false;

import '@/assets/css/main.css';

require('intersection-observer');

Vue.component('myApp', {
	render: (h) => h(myApp)
});

export default new Vue({
	router,
	store,
	vuetify,
	components: {
		myApp
	},
	mixins: [ omniture ],
	computed: {
		ipChecked: function () {
		  return store.state.app.user.ipChecked
		}
	},
	render(createElement): VNode {
		if (this.ipChecked) {
		  return createElement(Boilerplate)
		}
		return createElement('div')
	}
}).$mount('#app');
