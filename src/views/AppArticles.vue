<template>
  <div
    class="all-articles"
    data-cy="all-articles"
  >
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
      <em>{{ articlesToShow.flat().length }} matching results for "{{ input }}"</em>
    </p>
    <div>
      <template v-if="articlesToShow.length===0">
        <p>Sorry, your search returned no results. Try another search</p>
      </template>
      <div v-else>
        <v-row
          v-for="(byIssue,i) in articlesToShow"
          :key="i"
        >
          <template v-if="byIssue.length>0">
            <v-col cols="12">
              <template v-if="i>0">
                <hr
                  role="separator"
                  aria-orientation="horizontal"
                  class="hr-barh"
                >
                <div
                  class="text-uppercase font-weight-bold text-center divider-text"
                  v-html="getDividerText(byIssue)"
                />
              </template>
            </v-col>
            <v-col
              v-for="(model,num) in byIssue"
              :key="num"
              cols="6"
              md="3"
              sm="4"
            >
              <article-list-item
                :key="num"
                class="article-block"
                :model="model"
                :place="num"
                data-cy="article"
                :options="options"
              />
            </v-col>
          </template>
        </v-row>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import ArticleListItem from './components/ArticleListItem.vue';
import SearchBox from './components/SearchBox.vue';
import { magazineMixin } from '@/mixins/magazine';

export default {
  name: 'AllArticles',
  components: { ArticleListItem, SearchBox },
  mixins: [magazineMixin],
  props: { options: { type: Object, required: true } },
  data() {
    let issueList = require('@/entities/issuesList.js?v1');
    return {
      issueNum: this.options.issueNum,
      articlesToShow: this.options.articlesArchive,
      issueList: issueList,
      input: ''
    };
  },
  computed: {
    pageTitle: function() {
      return this.input ? 'Search Results' : this.$route.meta.title;
    }
  },
  mounted() {
    //sort by personalized first
    this.updateResults(this.options.articlesArchive);
  },
  methods: {
    updateResults: function(results, input) {
      const that = this;
      results = results.flat();
      this.articlesToShow = [];
      this.options.articlesArchive.forEach(issue => {
        if (issue) {
          let byIssue = issue.filter(mag => {
            if (results.includes(mag)) {
              return mag;
            }
          });
          if (byIssue.length > 0) {
            that.articlesToShow.push(byIssue);
          }
        }
      });
      //sort by personalized first
      this.articlesOrder(this.articlesToShow);
      this.input = input;
    },

    getDividerText: function(model) {
      var yr = parseInt(model[0].tags[0].substr(1, 2));
      var months = [
        '',
        'February',
        'April',
        'May',
        'July',
        'August',
        'October',
        'November',
        'January'
      ];
      var mm = months[model[0].tags[0].substr(4)];

      if (mm === 'January') {
        return '20' + (yr + 1) + ' | ' + mm + ' issue';
      } else {
        return '20' + yr + ' | ' + mm + ' issue';
      }
    },
    articlesOrder: function(data) {
      const that = this;
      let p:string[] = [];
      //sort by the personalized version first
      data.filter(issue => {
        //find current issue matrix ex. 2001
        let versionData = that.issueList.arr.find(
          obj => obj.id === issue[0].tags[0].substring(1)
        );
        //create an array of peronalization articles nums
        if (versionData.matrix) {
          let matrix = versionData.matrix[that.options.version];
          p.push(matrix.featured);
          p = p.concat(matrix.kitchen).concat(matrix.life);
        }
        //add property to each article if it is personalized one
        issue.forEach(model => {
          if (p.includes(model.author_article_id)) {
            model.myversion = true;
            model.order = p.indexOf(model.author_article_id);
          } else {
            model.myversion = false;
            model.order = 10001;
          }
        });
        //sort by that property
        return issue.sort((a, b) => {
          return a.order > b.order ? 1 : -1;
        });
      });
      this.articlesToShow = data;
    }
  }
};
</script>

<style lang="scss" scoped>
.all-articles {
  font-family: $font-family;
  position: relative;
  margin: 2em auto 0;
  padding: 0 5%;

  .search-box {
    position: absolute;
    right: 0;
    top: 0;
  }

  .page-title {
    font-size: 3.125em;
    line-height: 1;
  }

  .row {
    margin: 3em auto 0;
  }

  .article-block {
    margin: 0 auto 2em;
  }

  .divider-text {
    font-size: 0.688em;
    padding: 0.3125em 0.625em;
    letter-spacing: 1px;
    width: fit-content;
    margin: 0 auto 3em;
    // 
    // background: $all-articles-divider-bg;
  }
}

@media screen and (max-width: 960px) {
  .all-articles {
    .search-box {
      right: 1%;
    }
  }
}
@media screen and (max-width: 767px) {
  .all-articles {
    .search-box {
      position: relative;
    }
  }
}
</style>

<style lang="scss">
.all-articles {
  margin: 2em auto 0;
  .main-image {
    display: none !important;
  }
  .article-block {
    a {
      text-decoration: none;
      &:hover {
        .article-title {
          text-decoration: underline;
        }
      }
    }
  }
  .article-box-content {
    padding: 0.5em;
    .article-tag {
      font-size: 0.688em;
      margin-bottom: 0.625em;
      letter-spacing: 1px;
    }
    .article-title {
      padding: 0;
      font-size: 1.1875em;
      line-height: 1.2;
    }
    .article-subtitle {
      display: none;
    }
  }
  .article-btn {
    display: none;
  }
}
</style>
