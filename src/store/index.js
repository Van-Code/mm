import Vue from 'vue';
import Vuex from 'vuex';
var Banners = require('shared/entities/banners');
import util from 'shared/libs/utilities';
Vue.config.devtools =
  !location.host.includes('mymagazine.us') || location.search.includes('debug')
    ? true
    : false;

Vue.use(Vuex);
Vue.urlParam = {};
getUrlParam();
//set back up origin
var origin = Vue.urlParam.origin || Vue.urlParam.campaign || 'KWL';
if (origin === 'DigitalCoupons') {
  origin = 'KWL';
}

Vue.urlParam.origin = origin;
Vue.responsive = { current: '' };
//determine device
Vue.responsive = {
  cutoffs: [0, 767, 960],
  init: function() {
    var that = this;
    that.current = that.getValue();
    //If the window resizes past a cutoff, reload the page
    $(window).resize(function() {
      var value = that.getValue();
      //app.noresizeEvent is needed to prevent refresh loop on facebook app - mobile
      if (!Vue.noresizeEvent && that.current !== value) {
        var t = setTimeout(function() {
          location.reload();
        }, 10);
      }
      Vue.responsive.current = that.current;
    });
  },
  getValue: function() {
    var that = this,
      index = 2;
    while (index > 0) {
      if (util.dimensions().winW > that.cutoffs[index]) {
        return index;
      }
      index--;
    }
    return index;
  }
};
Vue.responsive.init();

const domain = document.domain || '';
export const store = new Vuex.Store({
  state: {
    app: {
      user: {
        state: 0,
        checked: false,
				ipChecked: false
      },
      banners: Banners,
      banner: Banners.find(obj => {
        return (
          obj.id ===
          (Vue.urlParam.banner === undefined ? 'Kroger' : Vue.urlParam.banner)
        );
      }),
      curhash: '',
      istestsite: [
        'dev',
        'staging',
        'staging2',
        'staging3',
        'swarmtest',
        'swarmtest-oh',
        'scapp-09-swarmlt',
        'scapp-oh2a-09-swarmlt',
        'released',
        'localhost',
        'preview',
        'mymag-staging',
        'staging-c7',
        'released-c7',
        'staging.mymagazine.us',
        'bs-local' //browserstack
      ].includes(domain.split('.')[0]),
      loginProgram: 'DigitalCoupons',
      isTesting:
        location.host.indexOf('localhost') > -1 && Vue.urlParam.testing,
      noresizeEvent: true,
      storageSupported: storageSupported(),
      timeMachineOn: timeMachineOn(),
      responsive: {
        current: Vue.responsive.current
      },
      isRendered: false,
      storedUrlParam: {},
      urlParam: Vue.urlParam
    },
    showDrawer: false,
    showDialog: false,
    showSnackBar: false,
    showTM: false
  },
  mutations: {
    userData(state, payload) {
      Object.assign(state.app.user, payload);
    },
    userState(state, payload) {
      Object.assign(state.app.user, { state: payload.state });
    },
    setDialogProps(state, payload) {
      if (payload.type === 'Dialog' && !payload.width) {
        //set default dialog width
        payload.width = 500;
      }
      if (payload.type === 'Drawer' && !payload.width) {
        //set default dialog width
        payload.width = state.app.responsive.current === 2 ? '50%' : '100%';
      }
      if (payload.type === 'SnackBar' && !payload.timeout) {
        payload.timeout = 3000;
      }
      state['show' + payload.type] = payload;
    },
    clearDialogProps(state, payload) {
      state['show' + payload.type] = false;
    },
    showTimeMachine(state, payload) {
      state.showTM = payload;
    },
    templateRendered(state, payload) {
      state.isRendered = payload;
    }
  },
  getters: {
    //legacy check if we progrms are using this one before removing
    // loggedIn: state => {
    //   return state.app.user.state;
    // },
    isLoggedIn: state => {
      return state.app.user.state > 0;
    },
    isRendered: state => {
      return state.app.isRendered;
    }
  }
});
function getUrlParam() {
  var match,
    pl = /\+/g, // Regex for replacing addition symbol with a space
    search = /([^&=]+)=?([^&]*)/g,
    decode = function(s) {
      return decodeURIComponent(s.replace(pl, ' '));
    },
    query = window.location.search.substring(1);
  Vue.urlParam = {};
  while ((match = search.exec(query)))
    Vue.urlParam[decode(match[1])] = decode(match[2]);
}
function timeMachineOn() {
  return (
    [
      'localhost',
      'dev.softcoin.com',
      'staging.softcoin.com',
      'timemachine-kroger.softcoin.com',
      'www.mymagazine.us'
    ].indexOf(window.location.hostname) > -1 && Vue.urlParam.tm
  );
}
function storageSupported() {
  var storage = window.sessionStorage,
    key = 'test';
  try {
    storage.setItem(key, '1');
    storage.removeItem(key);
    return true;
  } catch (error) {
    //Storage not supported
    return false;
  }
}
