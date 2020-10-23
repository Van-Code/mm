<template>
  <v-lazy
    v-model="isActive"
    transition="fade-transition"
    :options="{threshold:.5}"
    min-height="200"
  >
    <div @click="trackArticle($event)">
      <!-- article layout item -->
      <router-link
        :to="`/articles/${issueNum}/${model.author_article_id}`"
        class="track_article"
        :data-clickpath="'home_viewarticle_'+ index+1 "
        :place="index"
        @click="trackArticle"
      >
        <div
          class="article-box"
          :class="isAnimation ? 'article_animation' :''"
          :style="[
            this.model.animate_bg_image
              ? { 'background-image': 'url(' + this.model.animate_bg_image + ')' }
              : {}
          ]"
        >
          <div
            v-if="isAnimation && this.$route.path==='/'"
            class="featured_animation"
          >
            <animation :model="model" :options="options" v-bind:is="HeaderAnimation"></animation>
          </div>
          <div
            v-else
            class
          >
            <img
              class="art_image main-image"
              :alt="sanitizedAlt"
              :title="sanitizedAlt"
              :src="model.media_path"
            >
            <img
              class="art_image secondary-image"
              :alt="sanitizedAlt"
              :title="sanitizedAlt"
              :src="model.secondary_media_path"
            >
          </div>
          <div
            class="article-box-content"
            @click="trackArticle"
          >
            <h5
              class="article-tag text-uppercase font-weight-bold"
              data-cy="article-tag"
              v-html="model.category_name"
            />
            <h2
              class="article-title font-weight-bold"
              data-cy="article-title"
              v-html="model.headline"
            />

            <h4
              v-if="model.subtitle"
              class="article-subtitle"
              v-html="model.subtitle"
            />

            <v-btn
              depressed
              class="article-btn ma-0"
            >
              Read Article
            </v-btn>
          </div>
        </div>
      </router-link>
    </div>
  </v-lazy>
</template>
<script src="https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver"></script>
<script lang="ts">
import Vue from 'vue';
import EventBus from '../../../../shared/src/libs/eventbus.js';
import { commonMixin } from '../../../../shared/src/mixins/mixins.js';

export default Vue.extend({
  props: {
    model: { type: Object },
    place: { type: Number },
    options: { type: Object, required: true }
  },
  mixins: [commonMixin],
  data() {
    return {
      //We may need index for omniture tracking
      index: this.place,
      isActive: false
    };
  },
  computed: {
    isMobile: function() {
      return this.$store.state.app.responsive.current === 0 ? true : false;
    },
    issueNum: function() {
      return this.model.tags[0].replace('I', '') || this.options.issueNum;
    },
    sanitizedAlt: function() {
      return this.sanitizeText(this.model.headline);
    },
    isFeatured: function() {
      let featuredId = this.options.matrix.featured;
      return this.model.author_article_id == featuredId;
    },
    animateBg: function() {
      return this.model.animate_bg_color || this.model.animate_bg_image;
    },
    isAnimation: function() {
      return this.isFeatured && this.animateBg && !this.isMobile;
    },
    HeaderAnimation: function() {
      var issueNumber = this.issueNum;
			return () => import(`../../../../mymag/src/assets/issues/i`+issueNumber+`/HeaderAnimation.vue`);
		}
  },
  mounted() {
    EventBus.$on('track:article', function($event) {
      this.trackArticle($event);
    });
  },
  methods: {
    trackArticle: function(e) {
      var headline = this.model.headline;
      //omniture
      EventBus.$emit('view_details:track', {
        e: e,
        article_name: 'mymagazine_' + headline,
        internal_nav_clickpath: 'mymagazine_view article'
      });
      //GA
      ga('send', 'event', 'Articles', 'View', headline);
    }
  }
});
</script>
<style lang="scss">
</style>
