<template>
  <v-app app>
    <a
      id="skip-link"
      href="#"
      @keyup.enter="skipto"
    >Skip to content</a>
    <app-header
      v-if="$store.state.app.banner"
      :links="templateLinks.header"
    />
    <time-machine v-if="$store.state.app.timeMachineOn" />
    <app-dialog :options="$store.state.showDialog" />

    <my-app
      ref="content"
      :options="options"
    />

    <app-footer
      v-if="$store.state.app.banner"
      :links="templateLinks.footer"
    />
  </v-app>
</template>
<script>
import { templateMixin } from 'shared/mixins/template.js';
import AppHeader from 'shared/components/Header.vue';
import AppFooter from 'shared/components/Footer.vue';
import AppDialog from '@/views/components/dialog.vue';

import { userMixin } from 'shared/entities/user';
import TimeMachine from 'shared/components/Timemachine.vue';
// import TimeMachine from '@/views/components/timemachine.vue';

export default {
  components: {
    AppHeader,
    AppFooter,
    AppDialog,
    TimeMachine
  },
  mixins: [templateMixin, userMixin],
  props: ['app', 'options'],
  data: () => ({}),
  created() {
    this.defaultLinks();
  },
  mounted() {
    this.getUser();
  },
  methods: {
    skipto: function() {
      window.scrollTo({ top: this.$refs.content.$el.offsetTop });
    }
  }
};
</script>
<style scoped>
.my-app {
  max-width: 1080px;
  margin: 0 auto;
  width: 100%;
  min-height: 400px;
}
</style>
<style lang="scss">
.v-date-picker-header .v-btn {
  padding: 0.45em;
}
.v-date-picker-table tbody tr td .v-btn {
  padding: 0;
}
</style>