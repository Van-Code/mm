<template>
  <div class="all-recipes">
    <p
      class="page-title font-weight-bold"
      data-cy="page-title"
    >
      {{ pageTitle }}
    </p>

    <search-box
      class="search-box"
      :options="options"
      @updateResults="updateResults"
    />

    <p v-if="input">
      <em>{{ recipesToShow.length }} matching results for "{{ input }}"</em>
    </p>
    <recipe-search
      :allcategories="allcategories"
      :filter-array="filterArray"
      @filter="filterRecipes"
    />

    <div class="recipe-body">
      <template v-if="noResults">
        <p>Sorry, your search returned no results. Try another search</p>
      </template>
      <v-row v-else>
        <v-col
          v-for="(recipe,i) in recipesToShow"
          :key="i"
          cols="6"
          md="3"
          sm="4"
        >
          <recipe-list-item
            class="recipe-item"
            :model="recipe"
            :options="options"
            :place="i"
            data-cy="recipe-item"
          >
            Loading...
          </recipe-list-item>
        </v-col>
      </v-row>
      <div class="clearer" />
    </div>
  </div>
</template>
<script lang="ts">
import RecipeListItem from '@/views/components/RecipeListItem.vue';
import RecipeSearch from '@/views/components/RecipeSearch.vue';
import SearchBox from '@/views/components/SearchBox.vue';
import { recipe_categories } from '@/mixins/recipe_categories.js';
import { mapState } from 'vuex';
export default {
  components: {
    RecipeListItem,
    RecipeSearch,
    SearchBox
  },
  mixins: [recipe_categories],
  props: {
    showFaves: { type: Boolean, required: false, default: false },
    options: { type: Object, required: true }
  },
  data() {
    var sorted = this.sortByIssue(this.options.recipes.slice());
    return {
      // noResults: false,
      filterArray: [],
      recipesToShow: sorted,
      input: ''
    };
  },
  created() {
    this.choicesArr = [];
    this.firstLoad = true;
  },
  computed: mapState({
    app: function() {
      return this.$store.state.app;
    },
    // app: state => state.app,
    banner: function() {
      return this.$store.state.app.banner;
    },
    // banner: state => state.app.banner,
    user: function() {
      return this.$store.state.app.user;
    },
    // user: state => state.app.user,
    pageTitle: function() {
      return this.input ? 'Search Results' : this.$route.meta.title;
    },
    noResults: function() {
      return this.recipesToShow.length == 0;
    }
  }),
  methods: {
    updateResults: function(val, input) {
      // clear filter after doing search.
      this.filterArray = [];
      this.recipesToShow = this.sortByIssue(val);
      this.input = input;
    },
    filterRecipes: function(id, bool) {
      var that = this;
      this.toggleIcon(id, bool);
      let temp;
      if (this.input && this.recipesToShow.length > 0) {
        temp = this.recipesToShow;
      } else if (!this.input || this.recipesToShow.length == 0) {
        temp = this.sortByIssue(this.options.recipes.slice());
      }
      this.recipesToShow = [];
      //at least one filters selected
      if (that.filterArray.length > 0) {
        temp.filter(function(recipe) {
          // all the tags that current recipe has
          const tags = recipe.tags.map(value => {
            if (value['tag'].match('I' + that.options.issueNum)) {
              value['tag'] = 'FT' + that.options.issueNum;
            }
            return value['tag'];
          });
          //does recipe have all selected cats?
          if (that.hasAllTags(tags)) {
            // if so then show this recipe
            that.recipesToShow.push(recipe);
          }
          if (recipe.isFavorite && that.filterArray.includes('FTFAVE')) {
            that.recipesToShow.push(recipe);
          }
        });
      } else {
        //no filters selected
        this.$set(
          this,
          'recipesToShow',
          this.sortByIssue(this.options.recipes.slice())
        );
        this.input = '';
      }
    },
    toggleIcon: function(id, bool) {
      var theCat = this.allcategories.find(cat => {
        return `FT${cat.id}` === id;
      });
      //remove category if it's already selected otherwise add it
      //don't remove if it's FTFAVE and recipebox clicked
      if (this.filterArray.indexOf(id) !== -1 && !bool) {
        this.filterArray.splice(this.filterArray.indexOf(id), 1);
        theCat.selected = false;
      } else {
        this.filterArray.push(id);
        theCat.selected = true;
      }
    },
    hasAllTags: function(tags) {
      return this.filterArray.every(function(selected) {
        return tags.indexOf(selected) !== -1;
      });
    },
    sortByIssue: function(x) {
      var asc = x.sort((a, b) => (a.issue_id > b.issue_id ? 1 : -1));
      return asc.reverse();
    }
  }
};
</script>

<style lang="scss">
.all-recipes {
  font-family: $font-family;
  position: relative;
  margin: 2em auto 0;

  .search-box {
    position: absolute;
    right: 0;
    top: 0;
  }

  .page-title {
    font-size: 3.125em;
    line-height: 1;
  }
  .recipe-item {
    margin: 1em auto;
    a {
      text-decoration: none;
      &:hover {
        .recipe-title {
          text-decoration: underline;
        }
      }
    }
  }
}
@media screen and (max-width: 960px) {
  .all-recipes {
    padding: 0 0.5em;
    .search-box {
      right: 1%;
    }
  }
}

@media screen and (max-width: 767px) {
  .all-recipes {
    .search-box {
      position: relative;
    }
  }
}

@media print {
  .footerTop,
  .coupons_panel,
  .sticky-only,
  .header-nav .sticky-nav,
  .clearer {
    display: none;
  }
  .recipedetail_layout {
    margin: 0 !important;
  }
}
</style>
