<template>
  <div @click.prevent="clearProps()">
    <v-overlay
      class="drawer-overlay"
      id="my-overlay"
      @click.prevent="clearProps()"
      v-if="$store.state.showDrawer"
    ></v-overlay>
    <transition name="slide-drawer-transition">
      <v-card
        v-if="$store.state.showDrawer"
        id="drawer"
        class="my-drawer"
        :modal="options"
        aria-hidden="true"
        aria-live="assertive"
      >
        <div class="modal-holder">
          <component
            v-if="options.component"
            v-bind:is="options.component"
            :model="options.model"
            :parent="options.parent"
          ></component>
          <template v-else>
            <div>
              <div class="screen-reader-only">You are in a Modal window. To close press Escape.</div>

              <h1 id="modalCpnTitle" v-if="options.title">{{drawer.title}}</h1>
              <div class="spacer"></div>
              <button
                flat="true"
                @click.prevent="clearProps()"
                data-clickpath="coupon detail_close"
              >
                <img src="/programs/kroger/common/images/icon_close.png" alt="close" />
              </button>
            </div>
            <div v-html="options.content"></div>
          </template>
        </div>
      </v-card>
    </transition>
  </div>
</template>
<script>
export default {
  props: {
    options: { type: [Object, Boolean], required: true }
  },
  created() {},
  computed: {
    show: function() {
      return this.$store.state.showDrawer ? true : false;
    }
  },
  methods: {
    clearProps: function() {
      this.$store.commit('clearDialogProps', { type: 'Drawer' });
    }
  }
};
</script>
<style lang="scss" scoped>
@import url("../../../../shared/src/css/drawer.css");
</style>