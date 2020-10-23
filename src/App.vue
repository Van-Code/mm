<template>
  <div class="my-app">
    <v-progress-linear
      v-if="loading"
      height="2"
      indeterminate
      color="primary"
    />
    <app-shell
      v-if="!loading"
      :options="options"
    />
    <select-store
      v-else-if="!loading && !hasBanner && options.selectstore"
      :options="options"
      :page="options.selectstore"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import AppShell from '@/views/AppShell.vue';
import { contentMixin } from 'shared/mixins/content';
import { couponMixin } from 'shared/mixins/coupons';
import { magazineMixin } from './mixins/magazine';
import { storageMixin } from 'shared/mixins/storage.js';
import SelectStore from 'shared/components/SelectStore.vue';
import { IshellOptions, Icontent, IssuesList } from '@/types';

export default Vue.extend({
  name: 'App',
    components: {
    AppShell,
    SelectStore
  },
  mixins: [contentMixin, couponMixin, magazineMixin, storageMixin],
  data() {
    //get the active issue numbers
    let allIssueNums = require('@/entities/issuesList.js?v1');
    let activeIssueNums: string[] = [];

    let tmDate = window.sessionStorage.getItem('timeMachineDate');
    tmDate = tmDate
      ? tmDate.slice(0, 2) + '/' + tmDate.slice(2, 4) + '/' + tmDate.slice(4)
      : '';
    let now = tmDate ? new Date(tmDate) : new Date();

    allIssueNums.arr.filter((data: IssuesList) => {
      if (now > new Date(data.start_date)) {
        activeIssueNums.push(data.id);
      }
    });

    let matrix = [];
    let issueList = require('@/entities/issuesList.js?v1');
    let versionData = issueList.arr.find((obj: { id: string }) => {
      {
        return obj.id === activeIssueNums[0];
      }
    });
    if (!this.$store.state.app.urlParam.issue) {
      Object.assign(this.$store.state.app.urlParam, {
        issue: 'M' + activeIssueNums[0].substring(2) + 'M'
      });
    }
    let version = this.$store.state.app.urlParam.issue.includes('U')
      ? 'U'
      : 'M';
    if (versionData) {
      matrix = versionData.matrix[version];
    }
    return {
      tmDate: tmDate,
      options: {
        pages: [],
        coupons: [],
        recipes: [],
        articlesList: [],
        recipesToShow: [],
        version: version,
        activeIssueNums: activeIssueNums.sort().reverse(),
        issueNum: '',
        articlesArchive: [],
        matrix: matrix
      },
      loading: true,
      hasBanner: this.$store.state.app.banner,
      urlParam: this.$store.state.app.urlParam
    };
  },
  computed: {
    state: function() {
      return this.$store.state;
    },
    app: function() {
      return this.$store.state.app;
    },
    issueNum: function() {
      return this.getCurrentIssueNum();
    },
    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn;
    }
  },

  mounted() {
    const that: any = this;

    var promise = (this as any).startProgram();

    promise
      .then((shellOptions: IshellOptions) => {
        var promise2 = that.fetchMagazine(shellOptions);
        promise2.then((collection: Icontent[]) => {
          shellOptions.articlesList = collection;
        });
        return that.fetchContent(shellOptions);
      })
      .then((shellOptions: IshellOptions) => {
        return that.filterContent(shellOptions);
      })
      .then((shellOptions: IshellOptions) => {
        return that.getArchive(shellOptions);
      })
      .then((shellOptions: IshellOptions) => {
        that.sortRecipes(shellOptions);

        return that.fetchCoupons(shellOptions);
      })
      .then((shellOptions: IshellOptions) => {
        if (shellOptions) {
          Object.assign(that.options, shellOptions);
          that.loading = false;
        }
      })
      .catch(function(err: string) {
        //program end
        console.log('catch', err);
        //that.loading = false;
      });
  },
  methods: {
    startProgram: function(): Promise<any> {
      var that: any = this;
      return new Promise(function(resolve) {
        let shellOptions: IshellOptions = Object.assign(that.urlParam, {
          tags: 'MYMAGAZINE',
          banner: that.app.banner.id || 'Kroger',
          issueNum: that.issueNum
        });

        // Time Machine Code
        if (that.app.timeMachineOn) {
          var timeMachineDate = that.tmDate || '';
          if (timeMachineDate !== '') {
            // parse tm Date(remove "/")
            
            const parsedDate = timeMachineDate.split('/').join('');
            // console.log('date',timeMachineDate, parsedDate)
            Object.assign(shellOptions, { date: parsedDate });
            // Object.assign(shellOptions, { date: timeMachineDate });
          }
        }
        resolve(shellOptions);
      });
    },
    getCurrentIssueNum: function() {
      const issueParam = this.$store.state.app.urlParam.issue;
      let currentIssue = issueParam;
      const activeIssueNums = (this as any).options.activeIssueNums;
      if (activeIssueNums.length > 0 && !this.$route.params.value1) {
        let issueExists = activeIssueNums.includes(issueParam);
        if (!issueParam || !issueExists || !this.$route.params.value1) {
          currentIssue = activeIssueNums[0];
        }
      }
      return this.$route.params.value1 || currentIssue;
    },
    filterContent(this: Vue, shellOptions: IshellOptions): Promise<any> {
      let that = this;
      return new Promise(function(resolve) {
        (shellOptions as any).recipes.filter(function(recipe: Icontent) {
          var tags = recipe.tags;
          tags.forEach(function(tag: { tag: string }) {
            (that as any).regExauth_id = new RegExp(/A(\d{3})/gi);
            (that as any).regExissue_id = new RegExp(/I(\d{4})/gi);
            ['auth_id', 'issue_id'].forEach(function(r, i) {
              var b = (that as any)['regEx' + r].exec(tag.tag);
              if (b != null) {
                //because IE 11 thorws error on [r] :b[1]
                if (i === 0) {
                  recipe.auth_id = b[1];
                } else {
                  recipe.issue_id = b[1];
                }
              }
            });

            //add in this issue tag
            setTimeout(function() {
              if (tag.tag === `I${(that as any).options.issueNum}`) {
                tags.push({ tag: 'FTISSUE' });
              }
            }, 200);
          });
          var specLabels = ['HANDS-ON TIME', 'TOTAL TIME', 'SERVES', 'MAKES'],
            result: any;
          let recipeHeader = '';
          specLabels.forEach(function(label, i) {
            var regex = new RegExp('(' + label + ':)([^|]+)', 'gi');
            result = regex.exec(recipe.header);

            if (result) {
              recipeHeader +=
                '<div class="text"><strong>' +
                result['1'] +
                ' </strong>' +
                result['2'] +
                '&nbsp;</div>';
            }
          });
          recipe.header = recipeHeader.replace('undefined', '');
        });

        resolve(shellOptions);
      });
    },
    getArchive: function(shellOptions: IshellOptions) {
      const that = this;
      let all: { author_article_id: string }[] = [];

      //get the archived magazine issues ex articles_1908.json

      that.options.activeIssueNums.forEach((j: string) => {
        var promise = that.fetchMagazine({ issueNum: j });
        promise.then((collection: Icontent) => {
          all.push(collection);
        });
      });
      shellOptions.articlesArchive = all;
      return shellOptions;
    },
    sortRecipes(shellOptions: { recipes: Icontent[] }): void {
      //sort by issue id / newest first
      const distinctIssues = [
        ...new Set(shellOptions.recipes.map(recipe => recipe.issue_id))
      ];
      distinctIssues
        .sort(function(a: any, b: any) {
          return a[1] - b[1];
        })
        .reverse();

      let sorted = shellOptions.recipes.sort(
        (a: Icontent, b: Icontent) =>
          distinctIssues.indexOf(a.issue_id) -
          distinctIssues.indexOf(b.issue_id)
      );
      shellOptions.recipes = sorted;
      this.sortIssuetoTop(shellOptions.recipes);
    },
    sortIssuetoTop: function(recipes: Icontent[]): void {
      //move active issue recipes to top
      recipes.filter((item, index) => {
        if (item.issue_id === this.$store.state.app.urlParam.issue) {
          //remove
          recipes.splice(index, 1);
          //put in the front of array
          recipes.unshift(item);
        }
      });
    }
  }
});
</script>
<style lang="scss">
_:-ms-fullscreen,
:root .v-application--wrap,
_:-ms-fullscreen,
:root .v-content__wrap {
  width: 100%;
}

.Page-content {
  padding-top: 0 !important;
}
.v-application {
  background: #fff !important;
}
.theme--light.v-application {
  color: rgba(0, 0, 0, 1) !important;
}
.desktop-only {
  display: block;
}
.hidden-web,
.mobile-only {
  display: none;
}
a {
  text-decoration: none;
}
// Time machine button styling
.v-date-picker-table {
  tbody {
    tr {
      td {
        .v-btn {
          padding: 0.3125em 1em;
        }
      }
    }
  }
}
@media only screen and (max-width: 767px) {
  // .my-app .page_content {
  //   padding: 0 0.5em;
  // }
  .mobile-only {
    display: block;
  }
  .desktop-only {
    display: none;
  }
}
@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
  .v-application--wrap {
    width: 100%;
  }
  .v-content__wrap {
    width: 100%;
  }
  .Page-content {
    min-height: 100vh;
  }
  .v-content {
    min-height: 100vh;
  }
}
</style>
