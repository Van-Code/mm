<template>
  <v-lazy
    v-model="isActive"
    transition="fade-transition"
    :options="{threshold:.25}"
  >
    <div>
      <router-link
        :id="`video_${i}`"
        tag="a"
        :to="`/videos/${video.slug}`"
        class="video content"
        column
      >
        <img
          :src="video.img"
          :alt="video.name"
        >
        <div class="play-icon">
          <img :src="'/programs/kroger/mymag/src/assets/issues/i'+ issueNum +'/images/homepage/video/play_large.png'">
          <!-- <v-icon>play_circle_outline</v-icon> -->
        </div>
      </router-link>

      <div class="content_block">
        <div class="video-type text-uppercase font-weight-bold">
          {{ type }}
        </div>
        <div class="video-title font-weight-bold">
          {{ video.name }}
        </div>
      </div>
    </div>
  </v-lazy>
</template>
<script>
export default {
  props: {
    video: { type: Object, required: true },
    i: { type: Number, required: true },
    types: { type: Array },
    options: { type: Object }
  },
  data() {
    return {
      isActive: false,
      issueNum: this.options.issueNum,
    };
  },
  computed: {
    type: function() {
      const that = this;
      var match = '';
      if (this.$route.name === 'videos') {
        const match = this.video.tags.find(tags => {
          const tag = tags.tag.toLowerCase().trim();
          return that.types.includes(tag);
        });
        if (match) {
          return match.tag;
        }
      }
    }
  }
};
</script>
<style lang="scss">
.video_wrap {
  .content_block {
    padding: 0.5em;
    .video-type {
      font-size: 0.688em;
      margin-bottom: 0.625em;
      letter-spacing: 1px;
      // line-height: 1;
      line-height: 17px;
      color: #65c8ce;
      padding: .35em 0;
    }
    .video-title {
      font-size: 1em;
    }
  }
}
</style>