<template>
  <div
    v-if="issue_number"
    :class="`i${issue_number} version-${options.issue.slice(3).toLowerCase()}`"
  >
    <my-breadcrumb :options="options" />

    <!-- Page Content -->
    <router-view
      v-if="options"
      class="page_content"
      :options="options"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import MyBreadcrumb from '@/views/components/BreadCrumb.vue';
import EventBus from 'shared/libs/eventbus.js';
import { mapState } from 'vuex';
import axios from 'axios';
import $ from 'jquery';
interface user {
  state: number;
  links: { login: string; logout: string };
  logOut: Function;
}
export default Vue.extend({
  components: {
    MyBreadcrumb
  },
  props: { options: { type: Object, required: true } },

  data() {
    return {
      output: []
    };
  },
  computed: {
    isLoggedIn: function(): boolean {
      return this.$store.getters.isLoggedIn;
    },
    issue_number: function(): string {
      var that = this;
      if (that.$route.params.value1) {
        return that.$route.params.value1;
      } else if (that.options.issueNum) {
        return that.options.issueNum;
      } else {
        return '';
      }
    }
  },
  mounted() {},
  methods: {
    callOwl: function(): void {
      ($ as any)('#owl-homecpn-carousel').owlCarousel({
        nav: false,
        loop: true,
        items: 3,
        dots: true,
        responsiveClass: true,
        responsive: {
          0: {
            items: 2
          },
          550: {
            items: 3
          },
          767: {
            items: 4
          }
        }
      });
    },
    onButtonClicked: function(e): void {
      const that = this;
      var user = this.$store.state.app.user as user;
      if ((this as any).isLoggedIn) {
        user.logOut({
          success: function() {
            //After clearing user on YT end, redirect to Kroger's logout page
            that.$router.push({ path: user.links.logout });
          }
        });
      } else {
        that.$router.push({ path: user.links.logout });
      }
    }
  }
});
</script>
<style lang="scss">
// @import "scss/fonts.scss";
// @import "scss/header.scss";
// @import "scss/homepage.scss";
// @import "scss/owl-carousel.scss";
// @import "scss/modal-video.scss";

html {
  text-rendering: auto;
  -webkit-font-smoothing: auto;
}
.v-application a {
  color: #000 !important;
  .v-content {
    font-family: $font-family, sans-serif;
  }
}

.hr-barh {
  border-width: 4px;
  border-radius: 10px;
  border-color: black;
  border-style: solid;
}
.hr-barv {
  border-width: 4px;
  border-radius: 10px;
  border-color: black;
  border-style: solid;
}
img {
  max-width: 100%;
  display: block;
  margin: 0 auto;
}
</style>
