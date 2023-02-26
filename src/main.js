import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import store from './store'
import router from './router'
// import { CHECK_AUTH } from "./store/actions.type";
// import Amplify from 'aws-amplify';
// import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';
// import aws_exports from './aws-exports';
// import {
//   applyPolyfills,
//   defineCustomElements,
// } from '@aws-amplify/ui-components/loader';

// Vue.config.productionTip = false

// Amplify.configure(aws_exports);
// applyPolyfills().then(() => {
//   defineCustomElements(window);
// });

// Amplify.addPluggable(new AWSIoTProvider({
//   aws_pubsub_region: 'ap-southeast-1',
//   aws_pubsub_endpoint: 'wss://a21k3646n3kve7-ats.iot.ap-southeast-1.amazonaws.com/mqtt',
// }));

// eslint-disable-next-line no-unused-vars
// router.beforeEach((to, from, next) =>
//   Promise.all([store.dispatch(CHECK_AUTH)]).then(() => {
//     console.log('beforeEach', 'then')
//   }).catch(() => {
//     console.log('beforeEach', 'catch')
//   })
// );

new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app')

