<template>
  <div
    class="search-panel"
    data-cy="recipes_search_bar"
  >
    <hr
      role="separator"
      aria-orientation="horizontal"
      class="hr-barv"
    >
    <div class="search_box">
      <div class="search-heading">
        Narrow Your Search
      </div>
      <div class="search_icon_bar">
        <v-chip
          v-for="(item,i) in allcategories"
          :key="i"
          label
          :place="i"
          :data-key="`FT${item.id}`"
          outlined
          :color="getColor(item)"
          :ripple="false"
          :class="{selected: item.selected === true}"
          :data-cy="`narrow-icon_${item.id}`"
          class="ma-1"
          @click.prevent="filterRecipes(`FT${item.id}`),trackFilter($event)"
        >
          {{ item.name }}
        </v-chip>
      </div>
    </div>
  </div>
</template>
<script>
import EventBus from '../../../../shared/src/libs/eventbus.js';
import { mapState } from 'vuex';
export default {
  props: { allcategories: { type: Array,default:Array }, filterArray: { type: Array,default:Array } },

  data() {
    var vars = {};
    var parts = window.location.search.replace(
      /[?&]+([^=&]+)=([^&]*)/gi,
      function(m, key, value) {
        vars[key] = value;
      }
    );
    return {
      urlParam: vars
    };
  },
    created() {
    this.choicesArr = [];
  },
  methods: {
    filterRecipes: function(id) {
      this.$emit('filter', id);
    },
    getColor: function(item) {
      return this.filterArray.indexOf(`FT${item.id}`) > -1 ? 'red' : 'black';
    },
    trackFilter: function(e) {
      //omniture
      var that = this;
      var choice,
        option = 'narrow search';
      if ($(e.target).has('.selected')) {
        choice = $(e.target)
          .find('.icon_name')
          .data('name');
        //add if is Selected
        this.choicesArr.push(choice);
      } else {
        //remove if unselected
        this.choicesArr.splice(this.choicesArr.indexOf(choice));
      }
      if (this.choicesArr.length > 0) {
        choice = that.choicesArr.join('_');

        //build option string
        if (this.choicesArr.length > 0) {
          option = option.repeat(this.choicesArr.length);
          option = option.replace(/chna/gi, 'ch_na');
        }
      }
      //omniture
      let obj = {
        events: 'event144',
        prop52: option,
        prop53: choice,
        eVar134: 'mymagazine'
      };
      EventBus.$emit('analytics:page-view', obj);
    }
  },
  computed: mapState({
    app: state => state.app
  }),
  mounted: function() {
    var that = this;
    if (this.urlParam['selectedFilter']) {
      let filter = 'FT' + that.urlParam['selectedFilter'].toUpperCase();
      let selector = '[data-key=\'' + filter + '\']';
      let $el = $(selector);
      $el.click();
      // remove selectedFilter param
      const params = window.location.search.slice(1);
      let param_value = that.app.urlParam['selectedFilter'];
      let clean_params = params.replace(`&selectedFilter=${param_value}`, '');
      window.history.replaceState(
        {},
        '',
        `${window.location.pathname}?${clean_params}${window.location.hash}`
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.search-panel {
  margin: 3em auto;
  display: flex;
  flex-direction: row;
  .search_box {
    padding: 0.5em 0 0.5em 1em;
    .search-heading {
      line-height: 1;
      padding: 0 0 1em 4px;
    }
    .v-chip {
      text-transform: capitalize;
      border-radius: 2px !important;
    }
  }
}
@media screen and (max-width: 767px) {
  .search-panel {
    margin: 1em auto 2em;
  }
}
</style>
