<template>
  <v-lazy
    transition="fade-transition"
    v-model="isActive"
    :options="{threshold:.25}"
    min-height="200"
  >
    <v-card flat @click="trackRecipe($event)" :ripple="false">
      <!-- Older recipe -->
      <router-link
        v-if="this.model.issue_id < 2000"
        :to="`/recipes/${model.issue_id}/${model.auth_id}/${getSlug(model)}`"
        class="track_recipe recipe-box"
        :data-clickpath="`recipes-viewarticle-${place+1}`"
        :place="place"
      >
        <v-img :alt="sanitizedAlt" :title="sanitizedAlt" :src="imgPathThumb"></v-img>
        <h5 class="recipe-title font-weight-bold" v-html="model.title"></h5>
      </router-link>

      <!-- newer than goes to banner -->
      <a
        v-else
        :href="model.subheader"
        target="_Blank"
        class="track_recipe recipe-box"
        :data-clickpath="`recipes-viewarticle-${place+1}`"
        :place="place"
        rel="noopener"
      >
        <v-img :alt="sanitizedAlt" :title="sanitizedAlt" :src="imgPathThumb"></v-img>
        <h5 class="recipe-title font-weight-bold" v-html="model.title"></h5>
      </a>
    </v-card>
  </v-lazy>
</template>
<script>
import Vue from 'vue';
import { commonMixin } from '../../../../shared/src/mixins/mixins.js';
import EventBus from '../../../../shared/src/libs/eventbus.js';

export default {
  props: {
    model: { type: Object, required: true },
    options: { type: Object, required: true },
    place: { type: Number }
  },
  mixins: [commonMixin],
  watch: {
    'recipe.isFavorite': function(val) {
      this.isSaved = val ? 'saved' : '';
    }
  },
  data() {
    return {
      slug: this.getSlug(this.model),
      imgPath: this.getFilePath('IMG_MAIN', undefined, this.model),
      isLoggedIn: this.$store.state.app.user.state === 2,
      author_article_id: this.model.auth_id,
      categories: this.model.tags,
      isSaved: this.model.isFavorite ? 'saved' : '',
      isActive: false
    };
  },
  computed: {
    imgPathThumb: function() {
      return this.getFilePath('IMG_THUMB', undefined, this.model);
    },
    sanitizedAlt: function() {
      return this.sanitizeText(this.model.title);
    }
  },
  methods: {
    getMatch: function(item) {
      return this.allcategories.find(allCat => {
        return allCat.id === item.slice(2);
      });
    },
    trackRecipe: function(e) {
      //omniture
      var title = this.model.title;
      var place = this.place;

      let obj = {
        events: 'event28, event164',
        eVar64: 'no relevant id_' + title,
        eVar132: 'mymagazine_' + place
      };
      //omniture
      EventBus.$emit('analytics:page-view', obj);
      //GA
      ga('send', 'event', 'Recipes', 'View', title);
    }
  }
};
</script>

<style lang="scss" scoped>
.recipe-box {
  .recipe-title {
    padding: 1em 0.5em;
    font-family: "Poppins";
    font-size: 1em;
  }
}
</style>