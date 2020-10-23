import Vue from 'vue';
import Vuex from 'vuex';
var Banners = require('shared/entities/banners');

Vue.config.devtools =
  !location.host.includes('mymagazine.us') || location.search.includes('debug')
    ? true
    : false;

const w: any = {};
Vue.use(Vuex);
w.urlParam = {};
getUrlParam();
//set back up origin
var origin = w.urlParam.origin || w.urlParam.campaign || 'KWL';
if (origin === 'DigitalCoupons') {
  origin = 'KWL';
}

w.urlParam.origin = origin;
w.responsive = { current: '' };
w.responsive = {
  cutoffs: [0, 767, 960],
  init: function() {
    var that = this;
    that.current = that.getValue(that.dimensions());

    //If the window resizes past a cutoff, reload the page
    window.addEventListener('resize', function(size) {
      var value = that.getValue(that.dimensions());
      if (!w.noresizeEvent && that.current !== value) {
        var t = setTimeout(function() {
          location.reload();
        }, 10);
      }
      w.responsive.current = that.current;
    });
  },
  getValue: function(obj: any) {
    var that = this,
      index = 2;
    while (index > 0) {
      if (obj.winW > that.cutoffs[index]) {
        return index;
      }
      index--;
    }
    return index;
  },
  dimensions: function() {
    if (document.body && document.body.offsetWidth) {
      return {
        winW: document.body.offsetWidth,
        winH: document.body.offsetHeight
      };
    } else if (
      document.compatMode == 'CSS1Compat' &&
      document.documentElement &&
      document.documentElement.offsetWidth
    ) {
      return {
        winW: document.documentElement.offsetWidth,
        winH: document.documentElement.offsetHeight
      };
    } else if (window.innerWidth && window.innerHeight) {
      return {
        winW: window.innerWidth,
        winH: window.innerHeight
      };
    }
  }
};
w.responsive.init();

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
      banner: Banners.find((obj: any) => {
        return (
          obj.id ===
          (w.urlParam.banner === undefined ? 'Kroger' : w.urlParam.banner)
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
      isTesting: location.host.indexOf('localhost') > -1 && w.urlParam.testing,
      noresizeEvent: true,
      storageSupported: storageSupported(),
      timeMachineOn: timeMachineOn(),
      responsive: {
        current: w.responsive.current
      },
      storedUrlParam: {},
      urlParam: w.urlParam
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
    setDialogProps(state: any, payload) {
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
    clearDialogProps(state: any, payload) {
      state['show' + payload.type] = false;
    },
    showTimeMachine(state: any, payload) {
      state.showTM = payload;
    }
  },
  getters: {
    //legacy check if we progrms are using this one before removing
    // loggedIn: state => {
    //   return state.app.user.state;
    // },
    isLoggedIn: state => {
      return state.app.user.state > 0;
    }
  }
});
function getUrlParam() {
  var match,
    pl = /\+/g, // Regex for replacing addition symbol with a space
    search = /([^&=]+)=?([^&]*)/g,
    decode = function(s: any) {
      return decodeURIComponent(s.replace(pl, ' '));
    },
    query = window.location.search.substring(1);
  w.urlParam = {};
  while ((match = search.exec(query)))
    w.urlParam[decode(match[1])] = decode(match[2]);
}
function timeMachineOn() {
  return (
    [
      'localhost',
      'dev.softcoin.com',
      'staging.softcoin.com',
      'timemachine-kroger.softcoin.com',
      'www.mymagazine.us'
    ].indexOf(window.location.hostname) > -1 && w.urlParam.tm
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
