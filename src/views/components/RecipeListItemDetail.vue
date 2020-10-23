<template>
  <div>
    <div class="recipedetail_layout">
      <!--  Main body -->
      <div class="main_panel" v-if="recipe">
        <span class="back-btn" data-cy="back-btn" @click="$router.go(-1)">&#8592;&nbsp;Back</span>
        <div class="recipe_detail_body">
          <div class="recipeHead">
            <p class="recipe_intro" data-cy="recipe-intro">Recipe</p>
            <h2 class="recipe_title pt-3" v-html="recipe.title" data-cy="recipe-title"></h2>
            <template v-if="recipe.description">
              <div class="recipe_romance" v-html="recipe.description"></div>
            </template>
          </div>

          <div class="recipe-hero">
            <img
              class="mainImg"
              :alt="recipe.title"
              :title="recipe.title"
              :src="mainImg"
              data-cy="recipe-img"
            />
          </div>

          <div class="recipe_toolbar">
            <v-flex
              class="spec_column justify-md-space-between"
              v-html="recipe.header"
              data-cy="recipe-spec"
            ></v-flex>
            <!-- Mobile Only -->
            <template v-if="isMobile">
              <div class="recipe_side_panel" data-cy="mobile-side-panel">
                <div class="sp-content">
                  <div class="share share-box share-box-top">
                    <p>SHARE</p>
                    <div class="socialShareBox">
                      <app-share :model="this.recipe" :issueData="this.article" :type="`recipe`"></app-share>
                    </div>
                  </div>

                  <div class="share-box">
                    <template>
                      <p>KEYWORDS</p>
                    </template>
                    <div class="mobile-save">
                      <div class="category_icons pa-0">
                        <ul>
                          <li
                            v-for="(cat,i) in itemCategories()"
                            :key="i"
                            :class="getCategoryId(cat)"
                            data-cy="keyword-icon"
                            style="position:relative"
                          >
                            <span
                              :class="`ttip search_icon icon-${getCategoryId(cat)}`"
                              v-html="getCharacter(cat)"
                            ></span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <!-- End Mobile only -->
          </div>
          <v-flex row wrap class="inner_main_panel">
            <div class="primary_panel">
              <app-slot class="recipe_content" data-cy="recipe-content" v-html="tpl_banner"></app-slot>

              <template>
                <div class="recipe_nutrition serving-size" data-cy="recipe_nutrition">
                  <h2>Nutritional Information</h2>
                  <div v-if="tpl_banner_bottom">
                    <app-slot v-html="tpl_banner_bottom"></app-slot>
                  </div>
                  <div v-else-if="recipe.subheader">{{recipe.subheader}}</div>
                  <div v-else>
                    <p>Sorry no Nutritional Information available.</p>
                  </div>
                </div>
              </template>

              <div class="recipe_reviews" v-if="tpl_popup">
                <div class="reviews" v-html="tpl_popup"></div>
              </div>
            </div>
            <div class="recipe_side_panel">
              <template v-if="(!isMobile)">
                <div class="sp-content">
                  <div class="share share-box">
                    <div class="share">
                      <p>SHARE</p>
                      <div class="shareBox">
                        <app-share :model="recipe" :issueData="article" :type="`recipe`"></app-share>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div class="share-box">
                    <p>KEYWORDS</p>
                    <div class="category_icons">
                      <ul>
                        <li
                          v-for="(cat,i) in itemCategories()"
                          :key="i"
                          :class="getCategoryId(cat)"
                          data-cy="keyword-icon"
                          style="position:relative"
                        >
                          <v-tooltip top class="tool">
                            <template v-slot:activator="{ on }">
                              <span
                                v-on="on"
                                :class="`ttip search_icon icon-${getCategoryId(cat)}`"
                                v-html="getCharacter(cat)"
                              ></span>
                            </template>
                            <span style="display:block" id="my-tooltip">{{getName(cat)}}</span>
                          </v-tooltip>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </template>

              <div class="recipe_key_panel" v-if="isMobile" data-cy="recipe_key_panel">
                <h5>Recipe Key</h5>
                <div class="recipe_key_icons">
                  <ul>
                    <li :key="i" :place="i" v-for="(item,i) in allcategories">
                      <div class="search_icon_wrapper">
                        <span
                          class="search_icon"
                          v-bind:class="`icon-FT${item.id}`"
                          v-html="item.character"
                        ></span>
                      </div>
                      <span class="icon_name">{{item.name}}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <template v-if="(staffFav)">
                <div class="staff_favorite">
                  <img :src="staffFav" :alt="'Staff favorite'" title="Staff favorite" />
                </div>
              </template>
            </div>
          </v-flex>
        </div>
        <template v-if="(recipeVideo)">
          <div class="all-videos">
            <div class="main_panel">
              <div class="main_video">
                <app-slot :v-html="js_custom"></app-slot>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import { commonMixin } from 'shared/mixins/mixins.js';
import AppShare from './Share.vue';
import EventBus from 'shared/libs/eventbus.js';
import { recipe_categories } from '@/mixins/recipe_categories.js';

import AppSlot from '@/views/components/AppSlot';
import { mapState } from 'vuex';

export default {
  components: { AppShare, AppSlot },
  props: ['options', 'vm'],
  mixins: [commonMixin, recipe_categories],
  watch: {
    recipe_video_tpl: function() {
      // remove id="vimeo" from video template
      var trimmed = this.recipe_video_tpl.replace('<div id="vimeo">', '');
      this.recipe_video_tpl = trimmed.replace(
        '</iframe></div></div>',
        '</iframe></div>'
      );
    }
  },
  data() {
    return {
      recipe_item_categories: '',
      article: '',
      recipe_video_tpl: '',
      nutritional_template: '',
      tpl_banner: '',
      tpl_banner_bottom: '',
      js_custom: '',
      tpl_popup: ''
    };
  },
  created() {
    if (this.recipe && !this.tpl_banner) {
      this.get_issueData();
      this.get_template();
      // this.get_nutritional();
    }
    //omniture
    let obj = {
      events: 'event28, event 164',
      eVar64: 'no revelant id_' + this.recipe.title,
      eVar132: 'mymagazine_1_',
    };
    EventBus.$emit('analytics:page-view', obj);
  },
  mounted: function() {},
  computed: mapState({
    app: state => state.app,
    isLoggedIn: state => {
      return state.app.user.state > 0;
    },
    recipe: function() {
      var that = this;
      var slug = this.$route.params.value3;
      return this.options.recipes.find(function(recipe) {
        if (that.getSlug(recipe) === slug) {
          return recipe;
        }
      });
    },
    isMobile: state => {
      return state.app.responsive.current === 0;
    },
    issueData: function() {
      return this.get_issueData();
    },
    mainImg: function() {
      return this.getFilePath('IMG_MAIN', undefined, this.recipe);
    },
    staffFav: function() {
      return this.getFilePath('IMG_PACK_SHOT', undefined, this.recipe);
    },
    recipeVideo: function() {
      return this.getFilePath('JS_CUSTOM', undefined, this.recipe);
    },
    authNum: function() {
      return this.$route.params.value2;
    },
    issueNum: function() {
      return this.$route.params.value1;
    }
  }),
  methods: {
    get_template: function() {
      //main, nutritional, video, reviews
      let tpls = ['tpl_banner', 'tpl_banner_bottom', 'js_custom', 'tpl_popup'];
      tpls.forEach(t => this.fetchTemplate(t, this.recipe[t.toUpperCase()]));
    },
    getMatch: function(item) {
      return this.allcategories.find(allCat => {
        return allCat.id === item.slice(2);
      });
    },
    getCategoryId: function(item) {
      let match = this.getMatch(item);
      if (match) {
        return `FT${match.id}`;
      }
    },
    getCharacter: function(item) {
      let match = this.getMatch(item);
      if (match) {
        return match.character;
      }
    },
    getName: function(item) {
      let match = this.getMatch(item);
      if (match) {
        return match.name;
      }
    },
    getArticle: function() {
      var issueNum = this.$route.params.value1,
        articleNum = this.$route.params.value2;

      this.article = this.options.articlesList.find(function(model) {
        var tags = model.tags.map(value => value['tag']);
        const current = [`I${issueNum}`, `A${articleNum}`];
        return current.every(function(val) {
          if (tags.indexOf(val) !== -1) {
            that.addHelpers(model);
            return model;
          }
        });
      });
    },
    get_issueData: function(model) {
      var issueNum = `I${this.options.issueNum}`,
        articleNum = this.$route.params.value2;
      return this.options.articlesList.find(function(model) {
        var tags = model.tags;
        if (tags.includes(issueNum) && model.author_article_id === articleNum) {
          return model;
        }
      });
    },
    itemCategories: function() {
      var that = this;
      const allCatIds = this.allcategories.map(value => 'FT' + value['id']);
      //return only tags with FT and in  recipe categories
      const tags = this.recipe.tags.map(value => value['tag']);
      return tags.filter(tag => {
        return tag.includes('FT') && allCatIds.includes(tag);
      });
    }
  }
};
</script>
<style lang="scss">
// @import "../scss/recipes.scss";

//back button positioning
.back-btn {
  display: inline-block;
  width: 45%;
  padding-left: 5%;
  margin: 8px 0;
  cursor: pointer;
}
.recipe_detail_body {
  background: #fff;
  padding: 0 5%;
}
.recipe_detail_body .recipeHead {
  text-align: center;
  padding: 0 20px 4%;
}

.recipe_intro {
  text-transform: uppercase;
  margin: 0 auto !important;
  padding: 0 0 10px;
  width: 50px;
  border-bottom: 1px solid #000;
  color: #9c9638;
  font-family: "Poppins";
  font-weight: 400;
  font-size: 12px;
  letter-spacing: 1px;
}

.recipe_title {
  font-family: "Poppins";
  font-weight: 700;
  // color: #414042;
  font-size: 3em !important;
  text-transform: none;
  padding: 15px 0 !important;
  line-height: 1.15;
}
.recipe_romance {
  color: #000;
  opacity: 0.9;
  font-size: 1.2em;
  margin: 0 auto;
  p {
    font-family: "Poppins";
    padding: 0;
    font-weight: 300;
    font-size: 17px;
    line-height: 30px;
  }
}

.recipe_toolbar {
  margin: 0 auto 2em;
  padding: 0;
  .spec_column {
    width: 100%;
    text-transform: uppercase;
    font-size: 14px;
    display: flex;
    align-items: center;
    padding: 2em 0 1.5em;
    border-bottom: 1px solid #000;
  }
  .text {
    width: 33%;
    display: flex;
    align-self: flex-start;
    flex-direction: column;
    text-align: center;
    font-size: 14px;
    font-family: "Poppins";
    font-weight: 300;
    strong {
      font-family: "Poppins";
      font-weight: 400;
      letter-spacing: 0;
      font-size: 12px;
    }
  }
  .print_column {
    font-size: 14px;
    text-align: center;
    padding: 10px 20px;
  }
  .print_img {
    margin: 0 0.5em;
    width: 20px;
    padding-bottom: 5px;
    display: block;
    vertical-align: middle;
    cursor: pointer;
  }
}

.recipe_detail_body {
  margin: 0 auto;
}
.recipe_detail_body .recipe_key_icons ul,
.recipe_detail_body ul.instructions {
  margin: 0;
  padding: 0;
}
.primary_panel {
  width: 72%;
  margin-right: 3.5%;
  padding-bottom: 3%;
}
.recipe_content {
  padding: 0 5% 3% 0;
  font-family: "Poppins", serif;
  h2 {
    padding-top: 0;
  }
  .ingredients {
    width: 100%;
  }
  ul {
    padding: 0;
    margin: 0;
  }
  li {
    display: flex;
    margin-bottom: 10px;
    font-family: "Poppins";
    font-weight: 300;
    color: #000;
    line-height: 1.5em;
  }
}
.amount,
.amt {
  width: 25%;
  max-width: 70px;
  text-align: right;
  line-height: 1.5;
}
.ing,
.ingredient {
  margin-left: 20px;
  width: 75%;
  line-height: 1.5;
}
.instructions {
  width: 100%;
  padding: 5% 0 0;
  ul {
    padding: 0 !important;
    list-style: none;
  }
  li {
    padding-bottom: 10px;
    color: #000;
    margin: 0;
    .instructions {
      padding: 0;
    }
    p {
      font-family: "Poppins";
      font-weight: 300;
      padding-bottom: 15px;
      line-height: 1.7;
    }
    p:last-of-type {
      padding-bottom: 0;
      margin: 0;
    }
  }
}
.recipe_nutrition {
  padding: 2% 0 4%;
  font-family: "Poppins";
  font-weight: 300;
  h3 {
    font-family: "Poppins";
    font-weight: 300;
    font-size: 18px;
    padding-top: 0;
  }
  h2 {
    padding: 0.5em 0;
  }
  ul {
    padding: 0;
    overflow-x: hidden;
    list-style: none;
    column-count: 2;
    column-gap: 5%;
    span:first-child {
      padding-right: 0.33em;
      background: #fff;
    }
    span + span {
      float: right;
      padding: 0 2.5px;
      background: #fff;
    }
  }
  li {
    overflow-x: hidden;
    font-size: 18px;
  }
  li:before {
    float: left;
    width: 0;
    white-space: nowrap;
    content: ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ";
  }
}
.recipe_content,
.recipe_nutrition {
  border-bottom: 1px solid #000;
}
.recipe_reviews {
  padding: 2% 0;
  font-family: "Poppins", serif;
  font-weight: 300;
  border-bottom: 0;
  h3 {
    opacity: 0.5;
    color: #000;
    text-transform: uppercase;
    font-size: 16px;
    padding-bottom: 5px;
  }
  p {
    font-family: "Poppins";
  }
  hr {
    width: 100%;
    margin: 15px 0;
    border: 0;
    border-top: 1px solid #eee;
  }
}

.recipe_side_panel {
  width: 23.5%;
  text-align: center;
}
.sp-content {
  background: #eee;
  padding: 30px 20px;
  hr {
    width: 33%;
    border: none;
    border-top: 1px solid #000;
    margin: 1em auto;
  }
}
.share-box {
  p {
    text-align: center;
    font-size: 14px;
    font-family: "Poppins";
    color: #404041;
    letter-spacing: 1px;
  }
  .social {
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    list-style: none;
  }
  li {
    width: 33%;
    margin-bottom: 0.75em;
  }
  img {
    width: 80%;
    max-width: 40px;
    -webkit-transition: all 0.5s ease-out;
    -moz-transition: all 0.5s ease-out;
    -ms-transition: all 0.5s ease-out;
    -o-transition: all 0.5s ease-out;
    transition: all 0.5s ease-out;
    &img:hover {
      -webkit-transform: rotateZ(10deg);
      -moz-transform: rotateZ(10deg);
      -ms-transform: rotateZ(10deg);
      -o-transform: rotateZ(10deg);
      transform: rotateZ(10deg);
    }
  }
  .fav_icon {
    ul {
      padding: 0;
      display: flex;
      justify-content: center;
      line-height: 0.6em;
      list-style: none;
    }
    li {
      cursor: pointer;
      img {
        width: 15px;
        padding: 4px 0;
      }
      &:hover span {
        background-color: #d44e8c;
      }
    }
  }
}
.v-tooltip__content {
  background-color: black !important;
  border-radius: 11px !important;
  top: 0;
}
.v-tooltip__content::after {
  content: " ";
  position: absolute;
  top: 100%; /* At the bottom of the tooltip */
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: black transparent transparent transparent;
}
span#my-tooltip {
  background: #000;
  font-family: "Poppins";
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.8em;
  font-weight: bold;
}
.back-btn,
.ingredients h2,
.ingredients h4,
.instructions h2,
.recipe_nutrition h2,
.recipe_reviews h2 {
  font-family: "Poppins";
  font-weight: 700;
}

.category_icons {
  font-size: 1em;
  // padding-right: 1.4em;
  ul {
    justify-content: space-evenly;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    margin: 0;
    padding: 0;
  }
  .text {
    padding: 0 0.5em;
    li {
      margin: 0 2%;
    }
  }
  li {
    width: 25%;
    margin: 0;
    &:first-of-type {
      margin: 0 0 10px;
    }
    span {
      max-width: 35px;
      min-width: 25px;
      max-height: 35px;
      min-height: 25px;
    }
  }
}
.search_icon {
  width: 30px;
  height: 30px;
  color: #fff;
  border-radius: 3em;
  display: inline-block;
  font-size: 0.75em;
  text-align: center;
  margin: 0 auto;
  vertical-align: middle;
  line-height: 2.5em;
}
.icon_name {
  font-size: 0.6em;
  color: #666;
  cursor: pointer;
  font-family: "Poppins", "Lucida Sans Unicode", "Lucida Grande", sans-serif !important;
}
.icon-FTISSUE {
  background-color: #0066b1;
}
.icon-FTBFAST {
  background-color: #d1ae30;
}
.icon-FTAPP {
  background-color: #449e8e;
}
.icon-FTSDISH {
  background-color: #1e495c;
}
.icon-FTMAIN {
  background-color: #f27d32;
}
.icon-FTDESSERT {
  background-color: #764982;
}
.icon-FTBEV {
  background-color: #757e47;
}
.icon-FTSLCOOK {
  background-color: #fcb425;
}
.icon-FTU30 {
  background-color: #793c27;
}
.icon-FTDIETPICK {
  background-color: #463897;
}
.icon-FTVEG {
  background-color: #93bb40;
}
.recipe_key_panel {
  display: none;
  background: #efefef;
  text-transform: uppercase;
  padding: 0.5em 0;
  h5 {
    margin: 0;
  }
}
.recipe_key_icons {
  width: 80%;
  margin: 0 auto;
  border-top: 1px solid #b1b1b2;
  ul {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
  }
  li {
    line-height: 0.8;
    width: 50%;
    padding: 0.5em;
  }
}
.staff_favorite {
  margin: 3em auto;
}

.recipe_detail_body .ingredients h4 {
  font-size: 15px;
  letter-spacing: 1px;
}
.mobile-hero-fave {
  display: none;
}
#tiptip_content {
  background: #000;
  text-transform: uppercase;
  font-family: "Poppins";
  font-size: 9px;
  letter-spacing: 1px;
}
#tiptip_holder.tip_top #tiptip_arrow,
#tiptip_holder.tip_top #tiptip_arrow_inner {
  border-top-color: #000;
}
@media print {
  .recipe_detail_body .primary_panel {
    width: 100%;
  }
  .article_headline,
  .back-btn,
  .recipe_detail_body .recipe_side_panel {
    display: none;
  }
}
@media screen and (max-width: 960px) {
  .recipe_detail_body .primary_panel .recipe_nutrition ul li {
    font-size: 16px;
  }
  .recipe_content,
  .recipe_nutrition,
  .recipedetail_layout .main_panel,
  .recipes_layout .main_panel {
    padding: 0;
  }
  .recipe_key_panel {
    width: 100%;
    max-width: 250px;
    margin: 0 auto;
  }
  .staff_favorite {
    display: none;
  }
  .recipedetail_layout .recipe_detail_body .recipe_content,
  .recipes_layout .recipe_detail_body .recipe_content {
    width: 100%;
    margin: 0;
  }
  .category_icons,
  .recipe_toolbar .print_column,
  .recipe_toolbar .category_icons,
  .recipe_toolbar .print_column {
    font-size: 14px !important;
    text-transform: uppercase;
  }
  .recipe_toolbar .print_column,
  .recipe_toolbar .print_column {
    width: auto;
    min-width: auto;
    padding: 0.5em 1em;
  }

  .recipe_toolbar .print_column .print_img,
  .recipe_toolbar .print_column .print_img {
    border-left: none;
    vertical-align: middle;
    padding-left: 0;
    margin: 0 1em;
    width: 1.8em;
  }
  .recipe_toolbar .category_icons,
  .recipe_toolbar .category_icons {
    min-width: auto;
    width: auto;
    padding: 0.5em 1em;
  }
  .recipe_toolbar .category_icons ul,
  .recipe_toolbar .category_icons ul {
    justify-content: center;
  }

  .recipe_toolbar .category_icons ul li,
  .recipe_toolbar .category_icons ul li {
    margin: 0 3%;
  }

  .recipe_toolbar .category_icons .search_icon,
  .recipe_toolbar .category_icons .search_icon {
    width: 2em;
    height: 2em;
    line-height: 2em;
    font-size: 1em;
  }

  .recipe_toolbar .category_icons .icon-FAVE img,
  .recipe_toolbar .category_icons .icon-FAVE img {
    width: 12px;
    margin-top: 3px;
  }
  .recipe_nutrition {
    width: 100%;
    padding: 0 0 2%;
    margin: 0 auto;
  }
  .recipe_reviews {
    width: 100%;
  }
  .recipe_reviews hr {
    width: 95%;
  }
}
@media screen and (max-width: 768px) {
  .recipedetail_layout {
    /* margin: 2% 0 0 !important; */
    padding: 0;
  }
  /* .recipedetail_layout .main_panel {
        margin: 40px 0 20px;
    } */
  .recipedetail_layout .main_panel .back-btn {
    margin-left: 20px;
    margin: 35px 0;
  }
  .recipedetail_layout .main_panel .article_headline {
    margin-right: 20px;
  }
  .recipe_toolbar {
    margin: 0 auto;
    flex-direction: column;
    .spec_column {
      flex-direction: column;
      border-bottom: none;
    }
    .text {
      width: 100%;
      margin: 0 auto 1.5em;
      &:last-of-type {
        margin: 0 auto;
        &::after {
          content: none;
        }
      }
      &::after {
        content: "";
        width: 50px;
        margin: 1.5em auto 0;
        border-bottom: 1px solid #000;
      }
    }
  }

  .recipe_side_panel {
    width: 100%;
    text-align: center;
  }
  .sp-content {
    background: #eee;
    padding: 20px;
    margin-bottom: 1.5em;
    .share-box {
      display: flex;
      p {
        text-align: center;
        font-size: 14px;
        font-family: "Poppins";
        color: #404041;
        letter-spacing: 1px;
        padding: 0;
        align-self: center;
      }
      .mobile-save {
        display: flex;
      }
      .fav_icon {
        min-width: auto;
        width: auto;
        padding: 0.5em 1.2em;
        font-size: 14px !important;
        border-right: 1px solid #000;
        ul {
          padding: 0;
          display: flex;
          justify-content: center;
          line-height: 0.6em;
        }
      }
    }
    .socialShareBox {
      width: 100%;
    }
    .social {
      padding: 0.5em 1em;
      display: flex;
      flex-wrap: nowrap;
      li {
        margin: 0 0.25em;
      }
      img {
        width: 40px;
      }
    }
  }

  .category_icons ul {
    justify-content: space-evenly;
  }

  .icon-FAVE {
    width: 2em;
    height: 2em;
    line-height: 2em;
    font-size: 1em;
  }
  .icon-FTFAVE {
    width: 2em;
    height: 2em;
    line-height: 2em;
    font-size: 1em;
  }
  .fav_icon ul li .icon-FAVE img {
    width: 75%;
    margin: 3px auto 0;
  }

  .fav_icon ul li .icon-FTFAVE img {
    width: 75%;
    margin: 3px auto 0;
  }

  .mobile-save .category_icons {
    border-left: 0;
  }

  .sp-content .share-box-top:first-of-type {
    margin-bottom: 1em;
  }
  .recipedetail_layout .recipe-hero {
    position: relative;
  }
  .recipeHead h2 {
    font-size: 3.2em;
  }
  .inner_main_panel {
    width: 100%;
    padding: 0 0 5%;
  }
  .recipe_detail_body {
    width: 100%;
    padding: 0 5%;
  }
  .primary_panel,
  .recipe_side_panel {
    width: 100%;
  }
  .ingredients {
    width: 100% !important;
    padding-right: 0 !important;
    margin-bottom: 25px;
  }
  .instructions {
    width: 100% !important;
    padding-right: 0 !important;
  }

  .recipe_key_panel {
    display: block;
  }
  .recipedetail_layout {
    margin-top: -25px;
  }

  .recipe_toolbar .category_icons ul li {
    margin: 0;
  }

  .recipe_toolbar .category_icons ul li .search_icon {
    margin: 0 5px;
  }
}
@media screen and (max-width: 767px) {
  .mobile-hero-fave .search_icon,
  .recipeHead h2 {
    font-size: 2em;
  }

  .recipe_item .recipe-specs,
  .recipe_toolbar .print_column .text {
    display: none;
  }
  .search_icon_bar ul {
    flex-wrap: wrap;
  }
  .search_icon_bar ul li {
    width: 24%;
    margin: 0.5em 0;
  }
  .recipe_romance p {
    font-size: 18px;
  }
  .recipe_toolbar .print_column {
    width: auto;
    padding: 0;
    border: none;
  }
  .share-box p {
    margin: 0;
  }
  .recipe_toolbar .print_column .print_img {
    width: 1.8em;
    margin: 0 auto;
  }
  .recipe_toolbar .category_icons {
    min-width: 30%;
    ul {
      justify-content: space-evenly;
    }
  }
  .recipe_item {
    width: 45% !important;
    margin: 0 2.5% 5% !important;
  }
}
@media screen and (max-width: 510px) {
  .recipe_toolbar .spec_column {
    width: 100%;
    text-align: center;
  }
  .recipe_toolbar .category_icons {
    border-left: none;
    width: 100%;
    text-align: center;
    margin: 0 auto;
  }
  .recipe_toolbar .print_column {
    width: 100%;
    padding: 0.5em 1em;
    text-align: center;
  }

  .recipe_toolbar .print_column .print-img {
    margin: 0 auto;
  }
}
</style>
