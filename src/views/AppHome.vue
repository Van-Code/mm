<template>
  <div>
    <div class="home-page" v-bind:id="'home-'+options.issueNum">
      <!-- Featured Article section -->
      <section class="section-featured">
        <div class="article-featured" data-cy="feature-article">
          <article-list-item
            :class="`article-block featured-${this.options.matrix.featured}`"
            :model="featured"
            :options="options"
            data-cy="feature-articles"
          ></article-list-item>
        </div>
        <div class="logo">
          <img src="/programs/kroger/mymag/src/assets/images/site/MyMagLogo_white.png" alt="MyMagazine" />
        </div>
      </section>

      <!-- Coupon Section -->
      <section v-if="options.coupons" class="section-coupon">
        <div class="section-header">
          <div class="section-title">Best-Customer Bonus</div>
          <router-link to="/coupons" class="section-link">
            All Coupons
            <v-icon class="material-icons">mdi-chevron-right</v-icon>
          </router-link>
        </div>

        <coupon-list :options="options" :coupons="options.coupons"></coupon-list>
      </section>

      <!-- Stay home -->
      <hr role="separator" aria-orientation="horizontal" class="hr-barh home-separator" />
      <section class="section-past">
        <div class="section-header">
          <div class="section-title">
            <span v-html="stayhome[4].sectiontitle"></span>
          </div>
          <router-link to="/articles" class="section-link">
            All Articles
            <v-icon class="material-icons">mdi-chevron-right</v-icon>
          </router-link>
        </div>
        <v-row class="stayhome" no-gutters>
          <v-col cols="3" class="px-2 articles" v-for="(past, i) in stayhome.slice(1)" :key="i">
            <div :class="`item item-${i}`" :key="i">
              <router-link
                :to="stayhome[i].url"
                v-if="stayhome[i].url"
                class="track_article"
                :data-clickpath="'home_viewarticle_'+i "
              >
                <div class="article-box">
                  <img
                    class="art_image main-image"
                    :alt="stayhome[i].title"
                    :title="stayhome[i].title"
                    :src="stayhome[i].thumbnail"
                  />
                  <div class="article-box-content">
                    <h5
                      class="article-tag text-uppercase font-weight-bold"
                      data-cy="article-tag"
                      v-html="stayhome[i].tag"
                    ></h5>
                    <h2
                      class="article-title font-weight-bold"
                      data-cy="article-title"
                      v-html="stayhome[i].title"
                    ></h2>
                  </div>
                </div>
              </router-link>
              <a
                :href="stayhome[i].external ? stayhome[i].external : stayhome[i].externalBeginning + $store.state.app.banner.web + stayhome[i].externalEnd"
                target="_Blank"
                v-else
                class="track_article"
                :data-clickpath="'home_viewarticle_'+i "
              >
                <div class="article-box">
                  <img
                    class="art_image main-image"
                    :alt="stayhome[i].title"
                    :title="stayhome[i].title"
                    :src="stayhome[i].thumbnail"
                  />
                  <div class="article-box-content">
                    <h5
                      class="article-tag text-uppercase font-weight-bold"
                      data-cy="article-tag"
                      v-html="stayhome[i].tag"
                    ></h5>
                    <h2
                      class="article-title font-weight-bold"
                      data-cy="article-title"
                      v-html="stayhome[i].title"
                    ></h2>
                  </div>
                </div>
              </a>
            </div>
          </v-col>
        </v-row>
      </section>

      <!-- In the Kitchen Section -->
      <hr role="separator" aria-orientation="horizontal" class="hr-barh home-separator" style="margin: 35px 1.5em 0;" />
      <section class="section-kitchen" data-cy="section-kitchen">
        <div class="section-header">
          <div class="section-title">In the Kitchen</div>
          <router-link to="/articles" class="section-link">
            All Articles
            <v-icon class="material-icons">mdi-chevron-right</v-icon>
          </router-link>
        </div>

        <v-row class="articles kitchen" no-gutters>
          <v-col cols="6" class="kitchen-col-1">
            <article-list-item
              :class="`article-block kitchen-${i}`"
              :model="k"
              :options="options"
              :place="i"
              v-for="(k, i) in kitchen.slice(0,3)"
              :key="i"
              data-cy="kitchen"
            ></article-list-item>
          </v-col>
          <v-col cols="6" class="kitchen-col-2">
            <article-list-item
              :class="`article-block kitchen-${i}`"
              :model="k"
              :options="options"
              :place="i"
              v-for="(k, i) in kitchen.slice(3,6)"
              :key="i"
              data-cy="kitchen"
            ></article-list-item>
          </v-col>
        </v-row>
      </section>
      <div class="clearer"></div>

      <!-- Videos Section / Now Playing -->
      <hr role="separator" aria-orientation="horizontal" class="hr-barh home-separator" style="margin: 35px 1.5em 0;"/>
      <section class="section-videos" data-cy="section-videos">
        <div class="section-header">
          <div class="section-title">Now Playing</div>
          <router-link to="/videos" class="section-link">
            All Videos
            <v-icon class="material-icons">mdi-chevron-right</v-icon>
          </router-link>
        </div>
        <div class="main-video">
          <div>
            <div id="video_0" class="video content"></div>
            <div class="main-video-title" v-if="!this.isHidden">
              <h2>{{firstVideoName}}</h2>
            </div>
            <div class="play-icon" v-if="!this.isHidden" v-on:click="playVideo($event)">
              <img :src="'/programs/kroger/mymag/src/assets/issues/i'+ options.issueNum +'/images/homepage/video/play_large.png'" alt="Play Video Button"/>
              <!-- <v-icon>play_circle_outline</v-icon> -->
            </div>
          </div>
        </div>
        <div class="thumbnails mt-5">
          <div v-for="(video,i) in homeVideos" :key="i" class="video-block">
            <video-item
              :video="video"
              :options="options"
              :i="i"
              :id="`video_${i}`"
              :data-id="i"
              class="video-item"
              v-if="i>0 &&video.checked"
            ></video-item>
          </div>
        </div>
      </section>

      <!-- Staff Favorite Recipe Section-->
      <hr role="separator" aria-orientation="horizontal" class="hr-barh home-separator" />
      <section class="section-recipes" data-cy="section-recipes">
        <div class="section-header">
          <div class="section-title">Staff-Favorite Recipes</div>
          <router-link to="/recipes" class="section-link">
            All Recipes
            <v-icon class="material-icons">mdi-chevron-right</v-icon>
          </router-link>
        </div>

        <v-row class="staff" no-gutters>
          <v-col
            cols="8 main-recipe"
            :style="`background-image:url(`+staff[0].bgImg+`),linear-gradient(90deg, `+staff[0].bgColor+` 94.75%, rgba(255,255,255,1) 94.75%);`"
          >
            <img :src="staff[0].tagImg" alt class="image-tag" />
            <h3 v-html="staff[0].name"></h3>
            <v-btn :href="bannerWeb+staff[0].url" target="_blank" text>View Recipe</v-btn>
          </v-col>
          <hr role="separator" aria-orientation="horizontal" class="hr-barv" />
          <v-col cols="3 staff-favorite">
            <div :style="[!isMobile ? {'height': this.carouselHeight} : {'height': '100% !important'}]">
              <slick 
                ref="slickStaffFav"
                id="slickStaffFav" 
                :options="slickStaffFav"
                class="staff-fav"
              >
                <template v-for="(recipe, i) in staff">
                  <div :key="i" v-if="i>1" class="carousel-item">
                    <a :href="bannerWeb+staff[i].url" target="_blank">
                      <div class="image-block">
                        <img :src="staff[i].uri" :alt="staff[i].name" class="mb-4" />
                      </div>
                      <div class="text-block">
                        <h3 v-html="staff[i].name"></h3>
                        <p v-html="staff[i].quote" v-if="!isMobile"></p>
                        <v-btn
                          :href="bannerWeb+staff[i].url"
                          v-if="isMobile"
                          target="_blank"
                          class="button"
                          text
                        >View Recipe</v-btn>
                      </div>
                    </a>
                  </div>
                </template>
              </slick>
            </div>
          </v-col>
          <v-col cols="12 family-recipe">
            <div class="recipe" :style="`background-image:url(`+staff[1].bgImg+`)`">
              <div class="image-block">
                <img :src="staff[1].mainImg" alt class="main-image" />
                <div>
                  <p
                    v-html="staff[1].tag"
                    class="recipe-tag font-weight-bold"
                    v-if="$store.state.app.responsive.current === 0"
                  ></p>
                </div>
              </div>
              <div class="text-block">
                <p
                  v-html="staff[1].tag"
                  v-if="$store.state.app.responsive.current > 0"
                  class="recipe-tag font-weight-bold"
                ></p>
                <h3 v-html="staff[1].name"></h3>
                <v-btn :href="bannerWeb+staff[1].url" target="_blank" class="mx-0" text>View Recipe</v-btn>
              </div>
            </div>
            <div class="share pa-5">
              <h3 class="font-weight-bold">Do you have a fave family recipe to share?</h3>
              <p class="ma-0">
                <a href="mailto:ReaderThoughts@mymagazine.us">Email</a> an original recipe and a good-quality photo to ReaderThoughts@mymagazine.us for a chance to be featured.
              </p>
            </div>
          </v-col>
        </v-row>
      </section>

      <!-- Life at Large Section -->
      <hr role="separator" aria-orientation="horizontal" class="hr-barh home-separator" />
      <section class="section-life" data-cy="section-life">
        <div class="section-header">
          <div class="section-title">Life at Large</div>
          <router-link to="/articles" class="section-link">
            All Articles
            <v-icon class="material-icons">mdi-chevron-right</v-icon>
          </router-link>
        </div>

        <v-row class="articles yourlife" no-gutters>
          <v-col
            cols="3"
            class="px-2 secondary-articles"
            v-for="(article, i) in life.slice(0,4)"
            :key="i"
          >
            <article-list-item
              class="article-block"
              :model="article"
              :options="options"
              :place="i"
              data-cy="your-life"
            ></article-list-item>
          </v-col>
        </v-row>
        <v-row class="articles yourlife" no-gutters>
          <v-col cols="12" class="main-article">
            <article-list-item
              class="article-block"
              :model="life.slice(-1).pop()"
              :options="options"
              :place="1"
              data-cy="your-life"
            ></article-list-item>
          </v-col>
        </v-row>
      </section>

      <!-- poll section -->
      <section class="section-poll" data-cy="section-poll" :style="[!isMobile ?{'background-image':'url(src/assets/issues/i'+ options.issueNum +'/images/homepage/poll/poll.png)'} : {'background-image':'url(src/assets/issues/i'+ options.issueNum +'/images/homepage/poll/poll-mobile.png)'}]">
        <div class="poll-main">
          <img
            :src="`src/assets/issues/i${options.issueNum}/images/homepage/poll/poll_logo.png`"
            class="poll-image"
            v-if="!isMobile"
            alt=""
          />
          <div style="width:100%">
            <div style="width: 100%; max-width: 100%;">
              <div
                style="margin: 0px auto; padding: 0px; box-sizing: border-box; text-align: left;"
              >
                <div class="poll-title">
                  <h1 v-html="poll.question"></h1>
                </div>
                <div class="poll-options">
                  <div v-for="(choice,i) in poll.choices" :key="i" :class="choice.text">
                    <input
                      type="radio"
                      :id="choice.text"
                      :value="choice.text"
                      v-model="poll.model"
                      v-if="!poll.showResults"
                    />
                    <label :for="choice.text" class="radio-choices">
                      {{choice.text}}
                      <!-- <span v-if="poll.showResults">{{choice.count}}%</span> -->
                      <div v-if="poll.showResults" class="poll-result">
                        <div class="poll-chart" :style="'width:'+ barPercentage(choice.count)+ '%'"></div>
                        <div>{{barPercentage(choice.count)}}%</div>
                      </div>
                    </label>
                  </div>
                </div>
                <br />
                <v-btn
                  @click="submitVote"
                  v-if="!poll.showResults"
                  class="submit-btn"
                  outlined
                >Submit</v-btn>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div class="clearer"></div>

      <!-- footer section -->
      <section class="section-footer" data-cy="section-footer">
        <div class="feedback">
          <h3>
            Let us know what you think of
            <em>MyMagazine</em>
            <sup>TM</sup>!
          </h3>
          <v-btn
            href="https://8451cx.az1.qualtrics.com/jfe/form/SV_0VxF88SzkdmiJ5b"
            outlined
            class="feedback-btn"
            target="_Blank"
          >Submit Feedback</v-btn>
        </div>

        <hr role="separator" aria-orientation="horizontal" class />

        <div class="disclaimer">
          <p>
            See digital coupon terms and conditions for additional details. Our digital coupons appear in the digital coupons section of our website or mobile app up to 48 hours prior to being delivered to your inbox. Therefore, you may have already loaded the coupons shown here. Any coupons that have already been redeemed are not shown here. Would you prefer to receive your personalized offers by mail? Call Customer Service at 1-800-576-4377 to change the way you receive qualifying offers. If you wish to create or edit your online profile, please
            <a
              :href="addCard"
            >click here</a>.
          </p>
        </div>
      </section>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import ArticleListItem from "./components/ArticleListItem.vue";
import CouponList from "./components/CouponList.vue";
import VideoItem from "./components/VideoItem.vue";
import EventBus from "shared/libs/eventbus.js";
import { commonMixin } from "shared/mixins/mixins.js";
import { videoMixin } from "../mixins/video";
import { mapState } from "vuex";
import Player from "@vimeo/player";
import "owl.carousel";
import firebase from "@/plugins/firebase.js";
import { Icontent, IshellOptions } from "../types";
import $ from "jquery";
import Slick from 'vue-slick';
export default Vue.extend({
  name: "AppHome",
  components: {
    ArticleListItem,
    VideoItem,
    CouponList,
    Slick
  },
  mixins: [commonMixin, videoMixin],
  props: { options: { type: Object, required: true } },
  data() {
    return {
      instore: [],
      featureId: this.options.matrix.featured,
      bannerWeb: "https://www." + this.$store.state.app.banner.web + "/",
      addCard: this.$store.state.app.user.links.addcard,
      isHidden: false,
      poll: {
        question: "",
        choices: [],
        model: "",
        showResults: false,
        id: this.options.issueNum + "/1/"
      },
      slickStaffFav: {
        slidesToShow: 1,
        dots: true,
        arrows: false,
        infinite: true,
        speed: 300,
        slidesToScroll: 1
      },
    };
  },
  created: function() {  },
  mounted() {
    this.firebasePoll();
    this.loadMainVideo();
    this.goAnchor();
  },
  computed: {
    featured: function() {
      const that = this;
      return this.options.articlesList.find(
        x => x.author_article_id === that.options.matrix.featured
      );
    },
    kitchen: function() {
      var filtered: Icontent[] = [];
      this.options.matrix.kitchen.forEach((l, i) => {
        this.options.articlesList.filter(a => {
          if (a.author_article_id === l) {
            filtered.splice(i, 0, a);
          }
        });
      });
      return filtered;
    },
    life: function() {
      var filtered: Icontent[] = [];
      this.options.matrix.life.forEach((l, i) => {
        this.options.articlesList.filter(a => {
          if (a.author_article_id === l) {
            filtered.splice(i, 0, a);
          }
        });
      });
      return filtered;
    },
    staff: function() {
      return this.options.matrix.recipes;
    },
    stayhome: function() {
      return this.options.matrix.past;
    },
    isMobile: function() {
      return this.$store.state.app.responsive.current === 0 ? true : false;
    },
    carouselHeight: function() {
      return this.$store.state.app.responsive.current === 0 ? "auto" : "100%";
    },
    firstVideoName: function() {
      return this.matrixVideos.length > 0 ? this.matrixVideos[0].name : "";
    },
    homeVideos: function() {
      return this.matrixVideos;
    }
  },
  methods: {
    goAnchor: function() {
      let id = this.$store.state.app.urlParam.anchor;
      if(id) {
        let ypos = this.$refs[id].offsetTop;
        window.scrollTo(0, ypos - 100);
      }
    },
    playVideo: function(event) {
      this.isHidden = true;
      var videoIframe = document.getElementById("video_0");
      $("#video_0 iframe").attr(
        "src",
        $("#video_0 iframe").attr("src") + "&autoplay=1&controls=1"
      );
    },
    toggleMore: function(e) {
      var $target = $(e.currentTarget),
        text = $target.text(),
        hasMore = text.indexOf("More") > -1,
        textOptions = ["More", "Less"];
      $target.text(text.replace(textOptions[+!hasMore], textOptions[+hasMore]));
      this.$el.find("#letter").toggle("blind");
      ga(
        "send",
        "event",
        "Editor Note",
        "Click",
        "Read " + textOptions[+!hasMore]
      );
    },
    trackPrev: function(e) {
      $(e.currentTarget).data("clickpath", "home_carousel_prev");
      ga("send", "event", "Coupons", "Move Carousel", "Previous");
    },
    trackNext: function(e) {
      $(e.currentTarget).data("clickpath", "home_carousel_next");
      ga("send", "event", "Coupons", "Move Carousel", "Next");
    },
    openTab(e, stepNumber) {
      var that = this;
      var i, tabcontent, tablinks;
      tabcontent = document.getElementsByClassName("tabcontent");
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
      tablinks = document.getElementsByClassName("tablinks");
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
      }
      document.getElementById(stepNumber)!.style.display = "block";
      $(e.target)
        .closest(".tablinks")
        .addClass("active");
    },
    firebasePoll: function() {
      const that = this;
      ["question", "choices"].forEach(key => {
        that.poll[key] = firebase.database().ref(that.poll.id + key);
        that.poll[key].on("value", function(snapshot) {
          that.poll[key] = snapshot.val();
        });
      });
    },
    submitVote: function() {
      const that = this;
      $(".radio-choices").addClass("result-label");

      var entries = Object.entries(that.poll.choices);
      Object.entries(entries).filter(entry => {
        let key = entry[0];
        let value = (entry[1][1] as any).text;
        if (value === that.poll.model) {
          const newVal = that.poll.choices[key].count + 1;
          firebase
            .database()
            .ref(that.poll.id + "choices/" + key + "/count")
            .set(newVal, function(error) {
              if (error) {
                console.log(error);
              } else {
                console.log("success");
              }
            });
          this.poll.showResults = true;
        }
      });
    },
    barPercentage: function(chartCount) {
      const that = this;
      var totalCount = 0;
      that.poll.choices.forEach(singleChoice => {
        totalCount += singleChoice.count;
      });
      return Math.floor((chartCount / totalCount) * 100.0);
    }
  }
});
</script>
<style lang="scss">
.home-page {
  font-family: $font-family, "Roboto";
  // Sections
  .article-title,
  .article-tag {
    text-transform: initial;
    color: #000;
  }
  .article-title:hover {
    text-decoration: underline;
  }
}

// section-featured
.section-featured {
  position: relative;
  .logo {
    position: absolute;
    top: 22%;
    img {
      width: 85%;
    }
  }
  .article-featured {
    margin-top: -85px;
    position: relative;
    overflow: hidden;
    img {
      width: 100%;
    }
    img.secondary-image {
      display: none;
    }
    .article-box-content {
      width: 355px;
      padding: 2em 3em;
      background-color: #fff;
      bottom: 3em;
      left: 5%;
      position: absolute;
      z-index: 1;
      .article-tag {
        font-size: 0.688em;
        letter-spacing: 1px;
        box-sizing: content-box;
        // background: $featured-tagbg;
        width: fit-content;
        padding: 0.625em;
        position: absolute;
        top: 0;
        left: 0;
        writing-mode: vertical-rl;
        transform: rotateZ(180deg);
      }
      .article-title {
        font-size: 2.3125em;
        line-height: 45px;
        padding-bottom: 0;
        &:hover {
          text-decoration: none;
        }
      }
      .article-subtitle {
        font-size: 1.4375em;
        line-height: 1.25;
        font-weight: 400;
        // color: $featured-subtitle;
        margin: 0.5em 0;
      }
      .v-btn {
        // background-color: $featured-buttonbg !important;
        color: #fff;
        z-index: 9;
      }
      .v-btn:hover {
        color: #fff !important;
        // background-color: #fff !important;
      }
    }
    &:after {
      content: "";
      background: transparent;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
    }
  }
}

// coupons
.section-coupon {
  padding: 0 3em;
  .coupon-item {
    flex-direction: row;
  }
}

// Past Article Section
.section-past {
  padding: 0 3em;
  .stayhome {
    .articles {
      a:hover {
        .article-title {
          text-decoration: underline;
        }
      }
    }
    .article-box-content {
      padding: 0.5em;
    }
    .article-tag {
      font-size: 0.688em;
      letter-spacing: 1px;
      padding: 0.5em 0 0;
    }
    .article-title {
      font-size: 1.188em;
      line-height: 25px;
    }
  }
}

// In the kitchen
.section-kitchen {
  padding: 0 3em;
  .article-block {
    width: 47.5%;
    display: inline-flex;
    a {
      text-decoration: none;
    }
    .article-tag {
      font-size: 0.688em;
      letter-spacing: 1px;
      width: fit-content;
      padding: 0.625em;
    }
    .article-title {
      font-size: 1.188em;
      line-height: 25px;
    }
  }
  // left
  .kitchen-col-1 {
    padding-right: 1.25% !important;
    // top
    .kitchen-0 {
      width: 100%;
      margin-bottom: 1.5em;
      // background: $kitchen-col1-main-bg;
      img.secondary-image {
        display: none;
      }
      .article-box-content {
        padding: 2em 3em;
        padding-left: 20px;
      }
      // .article-tag {
      //   // background: $kitchen-col1-main-tag;
      // }
      .article-title {
        font-size: 1.875em;
        line-height: 36px;
      }
    }
    // bottom
    .kitchen-1 {
      margin: 0 2.5% 0 0;
      img.main-image {
        display: none;
      }
      .article-box-content {
        padding: 0.5em;
      }
      .article-tag {
        // color: $kitchen-col1-secondary-tag;
        padding: 0.5em 0 0;
      }
    }
    .kitchen-2 {
      margin: 0 0 0 2.5%;
      img.main-image {
        display: none;
      }
      .article-box-content {
        padding: 0.5em;
      }
      .article-tag {
        // color: $kitchen-col1-secondary-tag;
        padding: 0.5em 0 0;
      }
    }
  }
  // right
  .kitchen-col-2 {
    padding-left: 1.25% !important;
    // top
    .kitchen-0 {
      margin: 0 2.5% 0 0;
      img.main-image {
        display: none;
      }
      .article-box-content {
        padding: 0.5em;
      }
      .article-tag {
        // color: $kitchen-col1-secondary-tag;
        padding: 0.5em 0 0;
      }
    }
    .kitchen-1 {
      margin: 0 0 0 2.5%;
      img.main-image {
        display: none;
      }
      .article-box-content {
        padding: 0.5em;
      }
      .article-tag {
        // color: $kitchen-col1-secondary-tag;
        padding: 0.5em 0 0;
      }
    }
    // bottom
    .kitchen-2 {
      width: 100%;
      margin-top: 2em;
      // background: $kitchen-col2-main-bg;
      img.secondary-image {
        display: none;
      }
      .article-box-content {
        padding: 1.5em;
      }
      // .article-tag {
      //   // background: $kitchen-col2-main-tag;
      // }
      .article-title {
        font-size: 1.875em;
        line-height: 36px;
      }
    }
  }

  .article-btn {
    display: none;
  }
}

// Video
.section-videos {
  padding: 0 3em;
  .main-video {
    div {
      position: relative;
      .main-video-title {
        position: absolute;
        // top: 30%;
        bottom: 0;
        left: 5%;
        width: 84%;
        h2 {
          font-size: 65px;
          line-height: 1.15;
        }
      }
      .play-icon {
        position: absolute;
        padding: 0 1em;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        cursor: pointer;
        img {
          cursor: inherit;
          position: relative;
          right: -46%;
          bottom: -82%;
          height: 15%;
          max-height: 75px;
          min-height: 50px;
        }
      }
    }
  }

  .thumbnails {
    display: flex;
    flex-direction: row;
    background: none;
    .video-block {
      position: relative;
      &:first-child {
        display: none;
      }
      .video-item {
        padding: 1em 1em 0;
        .video-title {
          font-weight: 400 !important;
          font-size: 0.9375em;
          line-height: 1.15;
          padding: 0.5em 0 0;
        }
      }
      .video {
        position: relative;
        display: flex;
        img {
          height: 100%;
          width: 100%;
        }
        .play-icon {
          position: absolute;
          // padding: 1em;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            cursor: inherit;
            position: relative;
            width: 60px;
            height: 60px;
          }
        }
      }

      #video_1 {
        padding-left: 0;
        .play-icon {
          padding-left: 0;
        }
      }
      #video_4 {
        padding-right: 0;
        .play-icon {
          padding-right: 0;
        }
      }
    }
  }
}

// Recipe
.section-recipes {
  padding: 0 3em;
  .main-recipe {
    background-position: bottom right;
    background-repeat: no-repeat;
    background-size: auto 100%;

    .image-tag {
      margin: 0;
    }
    h3 {
      font-size: 2.3125em;
      line-height: 45px;
      margin: 0.5em 0 0;
    }
    .v-btn {
      background: none;
      padding: 7px 16px;
      border-color: #000;
      cursor: pointer;
    }
  }
  .staff-fav {
    height: 100%;
    flex-direction: column;
    h3 {
      font-size: 1.125em;
      line-height: 20px;
    }
    p {
      margin: 1em 0 0;
      font-style: italic;
      font-size: 0.875em;
      line-height: 19px;
    }
  }
  .family-recipe {
    // background: $recipe-family-bg;
    margin-top: 4em;
    .recipe {
      display: flex;
      flex-direction: row;
      .image-block {
        .main-image {
          position: relative;
          top: -1em;
        }
      }
      .text-block {
        position: relative;
        .recipe-tag {
          font-size: 0.688em;
          letter-spacing: 1px;
          text-transform: uppercase;
          // background: $recipe-family-tag-bg;
          width: fit-content;
          padding: 0.625em;
          position: absolute;
          top: 0;
          left: 0;
          writing-mode: vertical-rl;
          transform: rotateZ(180deg);
        }
        h3 {
          font-size: 1.188em;
          line-height: 25px;
        }
        // h3 {
        //   // color: $recipe-family-recipe-title;
        // }
        .v-btn {
          background: none;
          padding: 7px 16px;
          cursor: pointer;
        }
      }
    }
    .share {
      // background: $recipe-share-bg;
      h3 {
        font-size: 1.188em;
        line-height: 25px;
      }
      p {
        font-size: 0.8125em;
      }
      a {
        text-decoration: underline;
      }
    }
  }

  .hr-barv {
    margin: 0 3.7% !important;
    height: auto;
  }
  a {
    text-decoration: none;
  }
}

// Life at Large
.section-life {
  padding: 0 3em;
  a {
    text-decoration: none;
  }
  .yourlife {
    // bottom article
    .main-article {
      position: relative;
      margin-top: 2.3125em;
      img {
        width: 100%;
      }
      img.secondary-image {
        display: none;
      }
      .article-box-content {
        // width: 55%;
        width: 380px;
        height: 380px;
        padding: 2em 3em;
        background-color: #fff;
        bottom: 3em;
        left: 3em;
        position: absolute;
        .article-tag {
          font-size: 0.688em;
          letter-spacing: 1px;
          box-sizing: content-box;
          // background: $yourlife-main-tagbg;
          color: #000 !important;
          width: fit-content;
          padding: 0.625em;
          position: absolute;
          top: 0;
          left: 0;
          writing-mode: vertical-rl;
          transform: rotateZ(180deg);
        }
        .article-title {
          font-size: 2.3125em;
          line-height: 45px;
          padding: 0;
          &:hover {
            text-decoration: none;
          }
        }
        .article-subtitle {
          font-size: 1.4375em;
          line-height: 1.25;
          font-weight: 400;
          // color: $yourlife-main-subtitle;
          margin: 0.5em 0;
        }
        .article-btn {
          display: block;
          // background-color: $yourlife-buttonbg !important;
          color: #fff;
          z-index: 2;
        }
        .v-btn:hover {
          // color: $yourlife-buttonbg;
          background-color: #fff !important;
        }
      }
      &:after {
        content: "";
        background: transparent;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
      }
    }
    .secondary-articles {
      img.main-image {
        display: none;
      }
      a:hover {
        .article-title {
          text-decoration: underline;
        }
      }
    }
    .article-box-content {
      padding: 0.5em;
    }
    .article-tag {
      font-size: 0.688em;
      letter-spacing: 1px;
      padding: 0.625em 0 0;
      // color: $yourlife-seconary-tag;
    }
    .article-title {
      font-size: 1.188em;
      line-height: 25px;
    }
  }
  .article-btn {
    display: none;
  }
}

//Poll Section
.section-poll {
  position: relative;
  margin: 55px 0 0;
  background-position: bottom center;
  background-size: contain;
  background-color: #b3d8ed;
  .poll-main {
    display: flex;
    bottom: 0em;
    left: 1em;
    height: 100%;
    min-height: 500px;
    .poll-image {
      width: 35%;
      max-width: 100%;
      // margin-right: -2em;
    }
    .poll-title {
      font-size: 1.5em;
      font-family: "Poppins";
      h1 {
        font-size: 30px;
        line-height: 36px;
        padding: 1em 0 0;
        margin-bottom: 10px;
        width: 65%;
      }
    }
    .poll-options {
      display: flex;
      flex: 0 0 100%;
      flex-wrap: wrap;
      width: 95%;
      margin: 0 auto;
      div {
        padding: 5px 0;
        width: 35%;
        // width: 40%;
        // margin-left: 1em;
        &:nth-child(4) {
          padding-top: 0;
        }
        .radio-choices {
          display: block !important;
          margin-left: 19px;
          margin-top: -23px;
        }
        .result-label {
          margin-top: 0px !important;
        }
      }
      .poll-result {
        display: flex;
        align-items: center;
        padding: 0;
        margin: 4px 0;
        background: #f4f4f4;
        height: 20px;
        .poll-chart {
          background: #1071b7;
          height: 20px;
          margin-right: 5px;
        }
      }
    }
    .food-section {
      display: flex;
      span {
        font-family: "Poppins";
      }
    }
    .submit-btn {
      min-width: 7.8em;
      // padding: 0.75em 1.5em;
      font-family: "Poppins";
      font-size: 14px;
      color: rgb(0, 0, 0);
      -webkit-appearance: none;
      // border-radius: 20px;
      border: 1px solid #000;
      cursor: pointer;
      input {
        cursor: pointer;
      }
    }
  }
}

// Footer Section
.section-footer {
  width: 80%;
  margin: 0 auto;
  .feedback {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 2em 0;
    h3 {
      font-weight: 300;
      sup {
        font-size: 10px;
        top: -8px;
      }
    }
    .feedback-btn {
      border: 2px solid #000;
      margin-left: 1em;
      font-weight: 400;
      display: flex;
      &:hover,
      &:before {
        border-radius: 3em;
        background: transparent;
      }
      .v-ripple__container {
        display: none;
      }
    }
  }
  hr {
    border: none;
    border-top: 1px solid #000;
  }
  .disclaimer {
    padding: 2em 0;
    font-size: 14px;
    a {
      color: #1976d2 !important;
    }
  }
}

////// Global
.section-header {
  display: flex;
  flex-direction: row;
  padding: 55px 0 37px;
  justify-content: space-between;
  align-items: baseline;
  .section-title {
    font-weight: bold;
    font-size: 3.125em;
    line-height: 1;
    display: inline-block;
  }
  .section-link {
    font-size: 1em;
    line-height: 1;
    font-weight: 400;
    text-decoration: none;
    display: flex;
    align-items: center;
    .v-icon {
      color: #000 !important;
    }
  }
}

.home-separator {
  margin: 55px 3em 0;
}

// button styling
.v-btn {
  width: auto;
  text-align: center;
  font-size: 0.875em;
  font-weight: 500;
  padding: 0.3125em 2em;
  display: inline-block;
  color: #fff;
  border-radius: 3em;
  transition: 0.5s ease-in;
  text-transform: capitalize;
  border: 1px solid #eee;
  background: inherit;
  letter-spacing: 0;
  &:hover {
    transition: 0.5s ease-in;
  }
  &:before {
    opacity: 0;
  }
}

@media screen and (max-width: 960px) {
  .section-life {
    .yourlife {
      .main-article {
        .article-box-content {
          width: 90%;
          height: inherit;
          bottom: 0;
          left: inherit;
          margin: -30% auto 0;
          position: relative;
        }
      }
    }
  }
  //Poll section
  .section-poll {
    .poll-main {
      .poll-options {
        div {
          width: 48%;
        }
      }
      .poll-title {
        h1 {
          width: 100%;
        }
      }
    }
  }
}

@media screen and (max-width: 767px) {
  // section-featured
  .section-featured {
    .article-featured .article-box-content {
      width: 90%;
      height: inherit;
      margin: -4em auto 0;
      bottom: 0;
      left: inherit;
      position: relative;
      padding-bottom: 0;
    }
  }
  // coupons
  .section-coupon {
    padding: 0 1.5em;
  }
  // Past Article Section
  .section-past {
    padding: 0 1.5em;
    .section-title {
      word-break: break-word;
    }
    .stayhome {
      .articles {
        flex: 0 0 47.5%;
        max-width: 47.5%;
        padding: 0 !important;
        &:nth-child(even) {
          margin: 0 0 5% 2.5%;
        }
        &:nth-child(odd) {
          margin: 0 2.5% 5% 0;
        }
      }
    }
  }
  // kitchen
  .section-kitchen {
    padding: 0 1.5em;
    .kitchen-col-1,
    .kitchen-col-2 {
      flex: 0 0 100%;
      max-width: 100%;
      padding: 0 !important;
    }
    .kitchen-col-1 {
      .kitchen-0 {
        .article-box-content {
          padding: 1.5em 0.5em;
        }
      }
    }
    .kitchen-col-2 {
      display: table;
      .kitchen-2 {
        margin: 0 auto;
        display: table-header-group;
        .article-box-content {
          padding: 1.5em 0.5em;
        }
      }
      .kitchen-1 {
        margin: 1em 0 0 2.5%;
        display: table-footer-group;
        float: right;
      }
      .kitchen-0 {
        margin: 1em 2.5% 0 0;
        display: table-footer-group;
        float: left;
      }
    }
  }
  // Video
  .section-videos {
    padding: 0 1.5em;
    .main-video {
      div {
        .main-video-title {
          h2 {
            font-size: 35px;
          }
        }
        .play-icon {
          .v-icon {
            font-size: 3em;
            height: 1em;
            right: -46%;
            bottom: -78%;
          }
        }
      }
    }
    .thumbnails {
      flex-wrap: wrap;
      .video-block {
        width: 47.5%;
        &:nth-child(even) {
          margin: 5% 2.5% 0 0;
        }
        &:nth-child(odd) {
          margin: 5% 0 0 2.5%;
        }
        .video-item {
          padding: 0;
        }
      }
    }
  }
  // Recipe
  .section-recipes {
    padding: 0 1.5em;
    .main-recipe {
      flex: 0 0 100%;
      max-width: 100%;
      padding: 1.5em 1em 6em !important;
      h3 {
        font-size: 2em;
        margin: 0;
        padding: 2.5% 0;
      }
    }
    hr.hr-barv {
      display: none;
    }
    .staff-fav {
      .carousel-item a {
        .image-block,
        .text-block {
          width: 50%;
        }
      }
    }
  }
  // your life
  .section-life {
    padding: 0 1.5em;
    .yourlife {
      .secondary-articles {
        flex: 0 0 47.5%;
        max-width: 47.5%;
        padding: 0 !important;
        &:nth-child(even) {
          margin: 0 0 5% 2.5%;
        }
        &:nth-child(odd) {
          margin: 0 2.5% 5% 0;
        }
      }
    }
  }
  //Poll
  .section-poll {
    background-position: bottom right;
    .poll-main {
      left: 0;
      .poll-title {
        width: 80%;
        margin: 0 auto;
      }
      .poll-options {
        display: flex;
        padding: 0 28% 0 10%;
        width: 100%;
        div {
          width: 100%;
        }
      }
      .submit-btn {
        margin: 0 0 0 35%;
      }
    }
  }
  // footer
  .section-footer {
    width: 100%;
    padding: 0 1.5em;
    .feedback {
      flex-direction: column;
      .feedback-btn {
        margin: 0 auto;
      }
      h3 {
        text-align: center;
      }
    }
  }
  ////// Global
  .section-header {
    align-items: flex-end;
    .section-title {
      // font-size: 1.8125em;
      font-size: 40px;
      width: 50%;
    }
    .section-link {
      width: 50%;
      justify-content: flex-end;
    }
  }
  // hr
  .home-separator {
    margin: 55px 1.5em 0;
  }
}
@media screen and (max-width: 414px) {
  // coupons
  .section-coupon {
    .section-title {
      width: 200px;
    }
  }
  //Video
  .section-videos {
    .main-video {
      div {
        .play-icon {
          .v-icon {
            bottom: -72% !important;
          }
          img {
            bottom: -65%;
          }
        }
      }
    }
  }
}
@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
  .article-block {
    div {
      width: 100%;
    }
    .article-tag {
      display: table;
    }
  }
  .section-videos .thumbnails .video-block {
    width: 25%;
  }
}

//webkit hacks
@media not all and (min-resolution: 0.001dpcm) {
  @supports (-webkit-appearance: none) {
    .article-featured {
      .article-tag {
        left: -15px !important;
      }
    }
    .yourlife {
      .article-tag {
        left: -15px !important;
      }
    }
    .section-recipes {
      .family-recipe {
        .text-block {
          .recipe-tag {
            left: -15px !important;
            width: auto !important;
          }
        }
      }
    }
  }
}
</style>
