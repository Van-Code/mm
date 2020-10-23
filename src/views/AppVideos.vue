<template>
  <div class="all-videos" data-cy="all-videos">
    <p class="page-title font-weight-bold" data-cy="page-title">{{$route.meta.title}}</p>
    <div class="video-body" data-cy="video-body">
      <v-flex class="videos" wrap column flex-start>
        <template v-for="(video,i) in videosToShow">
          <v-col
            :class="`video_wrap_${i} video_wrap`"
            :ref="`video_wrap_${i}`"
            :key="i"
            col="12"
            data-cy="video"
            :md="i > 2 ? 3 : undefined"
            :sm="i > 2 ? 4 : undefined"
            :xs="i > 2 ? 6 : undefined"
          >
            <template v-if="i===1">
              <p class="font-weight-bold">Up Next</p>
            </template>
            <!-- main video -->
            <div v-if="i===0">
              <div id="video_0" class="video" column :key="video.id"></div>
              <div class="content_block">
                <div class="video-type text-uppercase font-weight-bold">{{getType(video)}}</div>
                <div class="video-title font-weight-bold" v-html="video.name"></div>
              </div>
            </div>
            <!-- thumbs -->
            <video-item :video="video":options="options" :i="i" :types="types" v-else :ref="`video_${i}`"></video-item>
          </v-col>
          <template v-if="i===2">
            <div :key="`d${i}`" class="video-separator">
              <hr role="separator" aria-orientation="horizontal" class="hr-barh" />
              <!-- Removing this. Should be on with search -->
              <!-- <p>Narrow Your Search</p>
              <v-chip
                v-for="(type,i) in types"
                outlined
                label
                :color="getColor(type)"
                @click.prevent="filterVideos(type)"
                class="text-capitalize mr-2"
                :key="i"
              >{{type}}</v-chip>-->
            </div>
          </template>
        </template>
      </v-flex>
    </div>
  </div>
</template>
<script>
import EventBus from 'shared/libs/eventbus.js';
import { videoMixin } from '../mixins/video.js';
import VideoItem from './components/VideoItem.vue';
import Player from '@vimeo/player';

export default {
  mixins: [videoMixin],
  props: {
    options: { type: Object }
  },
  components: { VideoItem },
  watch: {
    $route(to, from) {
      if (to !== from) {
        this.doThings(this.allVideos);
      }
    }
  },
  data() {
    return {
      allVideos: [],
      types: [],
      videosToShow: [],
      filterSelection: ''
    };
  },
  created: function() {
    const that = this;

    const promise = this.fetchVideos();
    promise
      .then(function(response) {
        if (response.length > 0) {
          that.doThings(response);
        }
      })
      .catch(function(err) {
        console.log('err', err);
      });
  },
  mounted: function() {
    const that = this;
    EventBus.$on('refreshVideos', function(data) {
      that.doThings(data);
    });
  },
  methods: {
    doThings: function(data) {
      const that = this;
      const promise = that.addVideoProps(data);

      promise
        .then(function(response) {
          //remove the matrix videos from full videos fetch response
          let homeVideos = [];
          let regvideos = response.filter(r => {
            var id = r.uri.replace('/videos/', '');
            if (that.options.matrix.videos.includes(id)) {
              homeVideos.push(r);
            }
            return !that.options.matrix.videos.includes(id);
          });
          // add matrix videos to the beginning of full response
          response = homeVideos.concat(regvideos);
          const narrowTypes = ['inspiration', 'recipe', 'technique'];
          response.filter(v => {
            //add the narrow search video types that exist
            if (v.type && narrowTypes.includes(v.type)) {
              that.types.push(v.type);
            }
          });
          //remove duplicates
          that.types = [...new Set(that.types)];

          that.allVideos = response;

          //creates a new copy
          that.videosToShow = that.allVideos.slice();
          //if there is a slug, update order of videos
          if (that.$route.params.value1) {
            that.orderBySlug();
          }
          if (that.videosToShow.length > 0) {
            that.loadMainVideo(); //mixin
          }
        })
        .catch(function(err) {
          console.log('err', err);
        });
    },
    getType: function(video) {
      const that = this;
      const match = video.tags.find(tags => {
        const tag = tags.tag.toLowerCase().trim();
        return that.types.includes(tag);
      });
      if (match) {
        return match.tag;
      }
    },
    orderBySlug: function() {
      const that = this;
      //find the index of the video
      const index = that.videosToShow.findIndex((vid, i) => {
        return vid.slug === that.$route.params.value1;
      });
      let beg = that.videosToShow.slice(0, index);
      let end = that.videosToShow.slice(index);
      //move videos before index to the end
      that.videosToShow = end.concat(beg);
    },
    filterVideos: function(type) {
      let filtered = [];
      //allow only one selection
      if (this.filterSelection === type) {
        //reset selection
        this.filterSelection = '';
        filtered = this.allVideos;
      } else {
        this.filterSelection = type;
        filtered = this.allVideos.filter(video => {
          const tags = video.tags.map(tags => tags.tag.toLowerCase());
          return tags.includes(this.filterSelection);
        });
      }
      //keep the top videos in place
      // const topVideos = this.allVideos.slice(0, 3);
      //merge top videos with the results
      this.videosToShow = filtered;
    },
    updateResults: function(results) {
      this.videosToShow = results;
    },
    getColor: function(item) {
      return this.filterSelection.indexOf(item) > -1 ? 'red' : 'black';
    },
    resetVideoTracking: function(videoId) {
      var that = this;
      //remove event listener from player
      this.player.off('cuepoint');
      this.player.off('ended');
      //load new video to player
      this.player.loadVideo(videoId);
      setTimeout(function() {
        that.startTracking();
      }, 500);
    }
  }
};
</script>

<style lang="scss">
// page title
.all-videos {
  font-family: $font-family;
  margin: 2em auto 0;
  padding: 0 5%;

  .page-title {
    font-size: 3.125em;
    line-height: 1;
    margin-bottom: 1.4em;
  }

  .video_wrap {
    display: inline-block;
    vertical-align: top;
    padding: 0.5em;
    margin: 0 auto 2em;
    .video {
      width: 100%;
      iframe {
        width: 100% !important;
      }
    }
  }

  .video_wrap_0 {
    float: left;
    width: 65%;
    padding: 0;
    min-height: 300px;
    .content_block {
      padding: 1.5em 1em;
    }
    .video-type {
      background: #e8d661;
      color: #000;
      padding: 3px 5px;
      width: fit-content;
      // margin-bottom: 10px;
    }
    .video-title {
      font-size: 1.875em;
    }
  }
  .video_wrap_1,
  .video_wrap_2 {
    display: table;
    width: 25%;
    margin: 0 auto;
  }

  .video-separator {
    margin: 7em auto 3em;
    hr {
      margin: 2em auto;
    }
    .v-chip {
      text-transform: capitalize;
      border-color: #000;
      border-radius: 2px !important;
    }
  }
}
@media screen and (min-width: 961px) {
  .all-videos {
    .video_wrap_1,
    .video_wrap_2 {
      margin: 0 auto !important;
    }
  }
}
@media screen and (max-width: 960px) {
  .all-videos {
    .video_wrap_0 {
      float: none;
      width: 100%;
      margin: 0 auto 2em;
    }
    .video_wrap_1 {
      display: inline-block;
      width: 50%;
      margin: 0;
      padding-right: 1em !important;
      img {
        margin: 0 !important;
      }
    }
    .video_wrap_2 {
      display: inline-block;
      width: 50%;
      margin-top: 2.5em;
      padding-left: 1em;
      img {
        margin: 0;
      }
    }
  }
}

@media screen and (max-width: 600px) {
  .all-videos {
    .col-sm-4 {
      -webkit-box-flex: 0;
      -ms-flex: 0 0 50%;
      flex: 0 0 50%;
      max-width: 50%;
    }
  }
}
</style>

<style lang="scss">
.all-videos {
  .play-icon {
    display: none;
  }
}
</style>
