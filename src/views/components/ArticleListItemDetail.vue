<template>
  <div class="articles_layout">
    <div class="main_panel">
      <v-runtime-template
        :template="tpl_banner"
        class="article_content"
        :article="article"
        :options="options"
        v-if="article"
        data-cy="article_content"
      ></v-runtime-template>
    </div>
  </div>
</template>
<script>
import VRuntimeTemplate from 'v-runtime-template';
import { commonMixin } from 'shared/mixins/mixins-2.js';
import AppShare from '@/views/components/Share.vue';
import CustomModal from './CustomModal.vue';
import EventBus from 'shared/libs/eventbus.js';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel';
import { twentytwenty } from '@/libs/twentytwenty.min.js';
import {
  VExpansionPanels,
  VExpansionPanel,
  VExpansionPanelHeader,
  VExpansionPanelContent } from 'vuetify/lib'

export default {
  data() {
    return {
      openExpansion: 0,
      tpl_banner: '',
      output: [],
      js_custom: {}
    };
  },
  props: {
    options: { type: Object, required: true }
  },
  components: {
    VRuntimeTemplate,
    AppShare,
    CustomModal,
    VExpansionPanels,
    VExpansionPanel,
    VExpansionPanelHeader,
    VExpansionPanelContent
  },
  mixins: [commonMixin],
  watch: {
    article: {
      immediate: true,
      handler(val) {
        this.get_issueData();
        this.get_template();
        this.loadScripts();
      }
    },
    articleExists: function(val) {
      if (!val) {
        this.tpl_banner = '';
        this.$router.replace('/articles');
      }
    }
  },
  created() {
    //omniture
    let obj = {
      events: 'event28',
      eVar11: 'mymagazine_view article',
      eVar74: 'mymagazine_' + this.article.headline
    };
    EventBus.$emit('analytics:page-view', obj);
  },
  mounted() {
    var currIssue = this.article.title.replace('Article', '').slice(0, 4);
    // var issue_path =
    //   '/programs/kroger/mymag/src/assets/issues/i' +
    //   currIssue +
    //   '/css/style.min.css';

    const link = document.createElement('link');
    link.async = true;
    // link.setAttribute('href', issue_path);
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    document.head.appendChild(link);
    this.correct = 0;

    // setting breadcrumb article title
    this.$route.meta.articleTitle = this.article.headline;
    // Add a temporary query parameter.
    this.$router.replace({query: {temp: Date.now()}})
    // Remove the temporary query parameter.
    this.$router.replace({query: {temp: undefined}})
  },
  computed: {
    article: function() {
      return this.getArticle();
    },
    articleExists: function() {
      return this.isActualArticle();
    },
    // scramble game
    setHeightUnit: function() {
      return $('html').hasClass('no-objectfit') ? 'vh' : '%';
    }
  },
  methods: {
    getArticle: function() {
      var that = this;
      var issueNum = this.$route.params.value1,
        articleNum = this.$route.params.value2;
      return this.options.pages.find(model => {
        const tags = model.tags.map(tags => tags.tag);
        const current = [`I${issueNum}`, `A${articleNum}`];
        return current.every(function(val) {
          if (tags.indexOf(val) !== -1) {
            return model;
          }
        });
      });
    },
    get_template: function() {
      //main, nutritional, video, reviews
      let tpls = ['tpl_banner', 'tpl_banner_bottom', 'tpl_popup'];
      tpls.forEach(t => this.fetchTemplate(t, this.article[t.toUpperCase()]));
    },
    isActualArticle: function() {
      //router value2 exists
      const ids = this.options.articlesList.map(
        value => value['author_article_id']
      );
      return ids.includes(this.$route.params.value2);
    },
    // Either use getVimeoVideo.
    getVimeoVideo: function(videoID, videoPadding) {
      return `<div class="wistia_responsive_padding" style="padding:${videoPadding}% 0 0 0;position:relative;"><div class="wistia_responsive_wrapper" style="height:100%;left:0;position:absolute;top:0;width:100%;"><iframe src="https://player.vimeo.com/video/${videoID}?autoplay=1&loop=1&muted=1&controls=0&autopause=0" width="100%" height="100%" frameborder="0" background-size: 100%;height:100%;position:relative;width:100%" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div></div>`;
    },
    get_issueData: function() {
      var that = this;
      var issueNum = `I${this.$route.params.value1}`,
        articleNum = this.$route.params.value2;
      this.options.articlesArchive.forEach(function(issue) {
        let match = issue.find(model => {
          var tags = model.tags;
          return (
            tags.includes(issueNum) && model.author_article_id === articleNum
          );
        });

        if (match) {
          Object.assign(that.article, {
            headline: match.headline,
            category_name: match.category_name,
            subtitle: match.subtitle,
            media_path: match.media_path
          });
        }
      });
      var issueNum = "";
    },
    getCurrentPos: function() {
      return this.options.articlesList
        .map(function(x) {
          return x.author_article_id;
        })
        .indexOf(this.$route.params.value2);
    },
    getNextAuth: function() {
      return this.options.articlesList[this.getCurrentPos() + 1]
        .author_article_id;
    },
    getPrevAuth: function() {
      return this.options.articlesList[this.getCurrentPos() - 1]
        .author_article_id;
    },
    loadScripts: function() {
      var that = this,
      issue = that.$route.params.value1
      require([
        `../../../../mymag/src/assets/issues/i`+issue+`/scripts.js`
      ], function(custom) {
        custom.scripts.onRender(that.options, that, that.$store);
      });
      
    },
    // Scramble Game

    openTab(e, stepNumber) {
      var that = this;
      var i, tabcontent, tablinks;
      tabcontent = document.getElementsByClassName('tabcontent');
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none';
      }
      tablinks = document.getElementsByClassName('tablinks');
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(' active', '');
      }
      document.getElementById(stepNumber).style.display = 'block';
      $(e.target)
        .closest('.tablinks')
        .addClass('active');
    }
  }
};
</script>
<style lang="scss">
.article {
  padding:0 5% 5%;
  .header {
    width: 100%;
    margin: 0 auto;
    padding: 40px 20px;
    text-align: center;
    h1 {
      color: #fff;
    }
    p {
      color: #fff;
      letter-spacing: 1px;
      text-transform: uppercase;
      padding: 0;
    }
    hr.big {
      width: 50px;
      margin: 10px auto;
      border: none;
      border-top: 1px solid #fff;
    }
    .tag {
      margin: 0 auto;
      p {
        color: #fff;
        font-family: "Poppins";
        font-weight: 700;
        font-size: 11px;
        letter-spacing: 1px;
        text-transform: uppercase;
        padding: 5px 20px 3px;
        width: fit-content;
        margin: 0 auto;
      }
    }
  }
}


@import "@/assets/css/social-media.scss";
@import "@/assets/css/owl-carousel.scss";

.i2004 {
  @import "@/assets/issues/i2004/css/article.scss";
}
.i2003 {
  @import "@/assets/issues/i2003/css/article.scss";
}
.i2002 {
  @import "@/assets/issues/i2002/css/scss/article.scss";
}
.i2001 {
  @import "@/assets/issues/i2001/css/scss/article.scss";
}
.i1908 {
  @import "@/assets/issues/i1908/css/scss/article.scss";
  .articles_layout {
    padding-top:2.5%
  }
}
.i1907 {
  @import "@/assets/issues/i1907/css/scss/article.scss";
  .articles_layout {
    padding-top:2.5%
  }
}
.i1906 {
  @import "@/assets/issues/i1906/css/scss/article.scss";
  .articles_layout {
    padding-top:2.5%
  }
}
.i1905 {
  @import "@/assets/issues/i1905/css/scss/article.scss";
  .articles_layout {
    padding-top:2.5%
  }
}
.i1904 {
  @import "@/assets/issues/i1904/css/scss/article.scss";
  .articles_layout {
    padding-top:2.5%
  }
}
.i1903 {
  @import "@/assets/issues/i1903/css/scss/article.scss";
  .articles_layout {
    padding-top:2.5%
  }
}
.i1902 {
  @import "@/assets/issues/i1902/css/scss/article.scss";
  .articles_layout {
    padding-top:2.5%
  }
}
.i1901 {
  @import "@/assets/issues/i1901/css/scss/article.scss";
  .articles_layout {
    padding-top:2.5%
  }
}
.i1808 {
  @import "@/assets/issues/i1808/css/scss/article.scss";
  .articles_layout {
    padding-top:2.5%
  }
}
.i1807 {
  @import "@/assets/issues/i1807/css/scss/article.scss";
  .articles_layout {
    padding-top:2.5%
  }
}
.i1806 {
  @import "@/assets/issues/i1806/css/scss/article.scss";
  .articles_layout {
    padding-top:2.5%
  }
}
.i1805 {
  @import "@/assets/issues/i1805/css/scss/article.scss";
  .articles_layout {
    padding-top:2.5%
  }
}
.i1804 {
  @import "@/assets/issues/i1804/css/scss/article.scss";
}
.i1803 {
  @import "@/assets/issues/i1803/css/scss/article.scss";
  .articles_layout {
    padding-top:2.5%
  }
}
.i1802 {
  @import "@/assets/issues/i1802/css/scss/article.scss";
  .articles_layout {
    padding-top:2.5%
  }
}
.i1801 {
  @import "@/assets/issues/i1801/css/scss/article.scss";
  .articles_layout {
    padding-top:2.5%
  }
}
</style>
