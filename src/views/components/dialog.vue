<template>
  <div>
    <!-- <v-overlay
      v-if="state.showDialog"
      class="dialog-overlay"
      @click.prevent="clearDialogProps('Dialog')"
    ></v-overlay>-->

    <v-dialog
      :content-class="`my-dialog hfajsdhfkjahsdkfjlhasdkjlfhalksjdh ${options.className}`"
      :max-width="options.width"
      v-model="$store.state.showDialog"
      @keydown.esc="clearDialogProps('Dialog')"
      v-if="$store.state.showDialog"
    >
      <!-- a whole component is set -->
      <component
        v-if="options.component"
        v-bind:is="options.component"
        :model="options.model"
        :parent="options.parent"
        data-cy="dialog"
      ></component>
      <v-card v-if="!options.component" class="generic">
        <v-card-title>
          <h1>{{options.title}}</h1>
          <button class="dialog-close" @click.prevent="clearDialogProps('Dialog')" role="button">
            <img src="/programs/kroger/common/images/icon_close.png" alt="close" class />
          </button>
        </v-card-title>
        <v-card-text v-html="options.content"></v-card-text>
        <v-card-actions>
          <v-btn class="primary" @click.native="clearDialogProps('Dialog')">close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    options: { type: [Object, Boolean], required: true }
  },
  computed: {
    state: function() {
      return this.$store.state;
    }
  },
  methods: {
    clearDialogProps: function(type) {
      this.$store.state['show' + type] = false;
    }
  }
};
</script>
<style lang="scss" scoped>
//common component do not add styles here or to v-dialog unless it should be applied to all dialogs
.generic {
  position: relative;
  padding: 1em;
  .dialog-close {
    right: 1em;
    top: 1em;
    position: absolute;
  }
  .v-btn {
    padding-left: 3em !important;
    padding-right: 3em !important;
  }
}
</style>