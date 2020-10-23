import axios from 'axios';
import Vue from 'vue';
import EventBus from 'shared/libs/eventbus.js';
import { IshellOptions } from '@/types';

export const magazineMixin = Vue.extend({
	methods: {
		fetchMagazine(shellOptions: IshellOptions) {
			return new Promise(function(resolve) {
				let issueNum = shellOptions.issueNum;
				let url = './src/json/articles_' + issueNum + '.json';
				axios
					.get(url)
					.then((response) => {
						let collection = response.data.general_issue;
						resolve(collection);
					})
					.catch(function(json) {
						console.log('err', json);
						EventBus.$emit('triggerModal', {
							content: json
						});
					});
			});
		}
	}
});
