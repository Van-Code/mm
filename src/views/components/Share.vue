<template>
  <ul class="social">
    <li
      v-for="(url, key) in shareUrls"
      v-bind:key="key"
      @click="trackShare($event, key)"
      :data-service="key"
      :data-cy="`share-`+key"
    >
      <a :href="url" target="_blank" class="social_share" :data-clickpath="'share_' + type">
        <img :src="'src/assets/images/site/share_' + key + '.png'" />
      </a>
    </li>
    <li v-if="type === 'recipe'" data-cy="share-print">
      <a class="print-recipe" data-clickpath="recipe_print" @click.prevent="printRecipe($event)">
        <img src="src/assets/images/site/share_print.png" alt="print recipe" />
      </a>
    </li>
  </ul>
</template>

<script>
import EventBus from 'shared/libs/eventbus.js';
import { commonMixin } from 'shared/mixins/mixins.js';
export default {
  name: 'AppShare',
  mixins: [commonMixin],
  props: {
    model: { type: Object, required: true },
    type: { type: String, required: true }
  },
  data() {
    return {
      imgPath: this.getShareImage()
    };
  },
  mounted: function() {},
  computed: {
    mailToString: function(type) {
      return type === 'article' ? 'An article' : 'A recipe';
    },
    urlBase: function() {
      return 'https://www.mymagazine.us/mm/';
    },
    title: function() {
      if (this.type === 'recipe') {
        return this.model.title;
      } else {
        return this.model.headline;
      }
    },
    category: function() {
      if (this.type == 'recipe') {
        return '';
      } else {
        return this.model.category_name;
      }
    },
    issue_number: function() {
      return this.$route.params.value1;
    },
    articleId: function() {
      if (this.type == 'recipe') {
        return this.$route.params.value2;
      } else {
        return this.$route.params.value2;
      }
    },
    recipePath: function() {
      if (this.type == 'recipe') {
        return this.$route.params.value3;
      } else {
        return '';
      }
    },
    shareUrls: function() {
      return {
        facebook:
          'https://www.facebook.com/sharer/sharer.php?u=' +
          encodeURIComponent(
            `${this.urlBase}og_${this.type}s.jsp?v=1_0&title=${this.title}&issueNum=${this.issue_number}&articleNum=${this.articleId}&image=${this.imgPath}&slug=${this.recipePath}`
          ),
        twitter:
          'https://twitter.com/intent/tweet?text=' +
          this.title +
          '&amp;url=' +
          encodeURIComponent(
            this.urlBase +
              '?issue=' +
              this.issue_number +
              '#/' +
              this.type +
              's/' +
              this.issue_number +
              '/' +
              this.articleId +
              '/' +
              this.recipePath
          ),
        pinterest:
          'http://www.pinterest.com/pin/create/button/?url=' +
          encodeURIComponent(
            this.urlBase +
              '?issue=' +
              this.issue_number +
              '#/' +
              this.type +
              's/' +
              this.issue_number +
              '/' +
              this.articleId +
              '/' +
              this.recipePath
          ) +
          '&media=' +
          this.imgPath +
          '&description=Kroger MyMagazine - ' +
          this.title,
        email: `mailto:?subject=${this.mailToString} I think you will enjoy!&body=Here is a little something from MyMagazine you might like: ${this.urlBase}?issue=${this.issue_number}#/${this.type}s/${this.issue_number}/${this.articleId}/${this.recipePath}`
      };
    }
  },
  methods: {
    getShareImage: function() {
      var that = this;
      if (this.type === 'recipe') {
        return that.getFilePath('IMG_THUMB', undefined, this.model);
      } else {
        return this.model.media_path;
      }
    },
    printRecipe: function(e) {
      e.preventDefault();

      //omniture
      let obj = {
        events: 'event56',
        eVar138: 'mymagazine_1_',
        eVar64: 'no revelant id_' + this.model.title
      };
      EventBus.$emit('analytics:page-view', obj);

      window.print();
    },
    trackShare: function(e, key) {
      var title = this.model.title;
      let obj = {
        events: 'event53',
        eVar60: key,
        eVar138: 'mymagazine_1_'
      };
      //omniture
      if (this.type === 'article') {
        obj.eVar74 = 'no relevant id_' + title;
      } else {
        obj.eVar64 = 'no relevant id_' + title;
      }

      EventBus.$emit('analytics:page-view', obj);
      s.clearVars();
      //GA
      ga('send', 'event', 'Articles', 'Share', title);
    }
  }
};
</script>

<style lang="scss">
// @import "../scss/social-media.scss";
</style>
