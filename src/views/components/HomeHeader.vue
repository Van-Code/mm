<template>
  <v-runtime-template
    :template="header_tpl"
    :banner="banner"
    :userState="userState"
    :options="options"
  ></v-runtime-template>
  <!-- <div class="" v-html="header_tpl"></div> -->
</template>
<script>
import VRuntimeTemplate from 'v-runtime-template';
import { commonMixin } from 'shared/mixins/mixins.js';

export default {
  props: ['app', 'options'],
  components: { VRuntimeTemplate },
  mixins: [commonMixin],
  data() {
    return {
      // banner: this.$store.state.app.banner,
      // userState: this.$store.state.app.user.state,
      header_tpl: ''
    };
  },
  mounted: function() {
    // this.headerVideo();
    this.getHeaderTemplate();
  },
  computed: {
    banner: function() {
      return this.$store.state.app.banner;
    },
    userState: function() {
      return this.$store.state.app.user.state;
    }
  },
  methods: {
    getHeaderTemplate: function() {
      var that = this;
      let str = `src/assets/issues/i${that.options.issueNum}/header.html`;
      that.fetchTemplate('header_tpl', str);
    },
    headerVideo: function() {
      var script_paths = [
        'https://fast.wistia.com/embed/medias/4hyvn119rg.jsonp',
        'https://fast.wistia.com/assets/external/E-v1.js'
      ];
      script_paths.forEach(function(path) {
        var script = document.createElement('script');
        script.setAttribute('src', path);
        script.async = true;
        document.getElementById('addVideo').appendChild(script);
      });
    },
    trackArticle: function(e) {
      //omniture
      var title = $(e.currentTarget).text();
      EventBus.$emit('view_details:track', {
        e: e,
        article_name: title
      });
    }
  }
};
</script>
<style lang="scss">
</style>
