import EventBus from 'shared/libs/eventbus.js';
import axios from 'axios';
import Player from '@vimeo/player';
import Vue from 'vue';
import { commonMixin } from 'shared/mixins/mixins.js';

export const videoMixin = Vue.extend({
	data() {
		return {
			matrixVideos: []
		};
	},
	mixins: [ commonMixin ],
	created() {
		var Vimeo = require('vimeo').Vimeo;
		this.client = new Vimeo(
			'5d57eee950176facbc68307e02f401b457c01cc5',
			'A/l2LRmSetRNODpfs6LkfRmFY9CnIkyz5W+fFjXZrR1rMbvpm+xzKIbFBme05WL6HDJThVm2WOI1VkuhHEG3HDVI+uN3NNiyf6Vg3IddYG9Rso6FHwWzKWdetx6OIP',
			'd555585195cee012869c4149b2203133'
		);

		this.startTracking();
	},
	mounted() {
		if (this.$route.name === 'home' || this.$route.name === 'videos') {
			this.getMatrixVideos();
		}
	},
	methods: {
		getMatrixVideos: function(this: any) {
			const that = this;
			let matrixVideos = <any>[];
			const personalizedVideos = that.options.matrix.videos;
			personalizedVideos.forEach((id, i) => {
				//get video metadata
				var promise = that.fetchVideos(id);
				promise.then((data) => {
					matrixVideos.splice(i, 0, data);
					// if (matrixVideos.length === 5) {
					// as long as there's a video add props
					if (matrixVideos.length > 0) {
						//add the properties that we need
						that.addVideoProps(matrixVideos);
					}
				});
			});
			that.matrixVideos = matrixVideos;
		},
		filterVideo: function(videos, videoId) {
			let path = '/videos/' + videoId;
			let matched = videos.find((video) => {
				return video.uri == path;
			});
			return matched;
		},
		fetchVideos: function(videoId) {
			let that = this;
			return new Promise(function(resolve, reject) {
				if (!that.$store.state.app.isTesting) {
					let path = './src/json/videos.json';
					axios
						.get(path)
						.then((response) => {
							let videoCollection = response.data.data;
							if (videoId) {
								// resolve video that match the id
								let matchedVideo = that.filterVideo(videoCollection, videoId);
								if (matchedVideo) {
									// only resolve if it match a video
									resolve(matchedVideo);
								}
							} else {
								// resolve the collection
								resolve(videoCollection);
							}
						})
						.catch(function(json) {
							console.log('err', json);
							EventBus.$emit('triggerModal', {
								content: json
							});
						});
				} else {
					let iteration = 2;
					//path to get all the videos
					let path = '/users/71523972/projects/198391/videos';

					let query = '?per_page=';
					//per page param
					that.pp = '10';
					//if videoId is passed, get the individual video data
					if (videoId) {
						iteration = 1;
						path = 'videos/' + videoId;
						query = '';
						that.pp = '';
					}
					//loop once if videoid exists otherwise 2x to speed up page load
					for (let i = 0; i < iteration; i++) {
						that.client.request(
							{
								path: path + query + that.pp
							},
							function(error, body, status_code, headers) {
								if (error) {
									console.log(error);
									console.log('header', headers);
									reject();
								} else {
									that.response = body.data ? body.data : body;
									if (iteration === 1) {
										resolve(that.response);
									}
									if (iteration === 2) {
										//get the first few videos to speed up page load
										if (i === 0) {
											resolve(that.response);
										} else {
											EventBus.$emit('refreshVideos', that.response);
										}
									}
								}
							}
						);
						that.pp = 100;
					}
				}
			});
		},
		loadMainVideo: function() {
			const that = this;
			const firstVideo = this.getVideoByPage();
			var options01 = {
				id: firstVideo,
				responsive: true,
				controls: this.$route.name === 'videos'
			};
			that.$nextTick(function() {
				var vPlayer = new Player('video_0', options01);
				// vPlayer.setVolume(0);
				vPlayer.on('play', function() {
					// console.log('Played the first video');
				});
				vPlayer.on('ended', function() {
					//console.log('Finished the first video');
					//load next video
					const nextSlug = that.$refs.video_1[0].video.slug;
					that.$router.push({ path: `/videos/${nextSlug}` });
				});
			});
		},
		getVideoByPage: function() {
			const that = this;
			//main video for all videoes page
			if (this.$route.params.value1 || this.$route.name === 'videos') {
				return that.videosToShow[0].id;
			}
			//main video for home is the first id in the matrix

			return that.options.matrix.videos[0];
		},
		addVideoProps: function(videos) {
			let that = this;
			//add the props
			return new Promise(function(resolve) {
				if (videos.length > 0) {
					videos.forEach((video, i) => {
						let video_id = video.uri.replace('/videos/', '');
						let type = video.tags.length > 0 ? video.tags[0].tag.toLowerCase() : '';
						let img = video.pictures.sizes.find((obj) => obj.width === 295);
						Object.assign(video, {
							id: video_id,
							type: type,
							img: img.link,
							slug: that.sanitizeTitle(video.name),
							checked: true
						});
					});
				}
				// sort videos
				videos.sort(function(a, b) {
					return that.options.matrix.videos.indexOf(a.id) - that.options.matrix.videos.indexOf(b.id);
				});
				resolve(videos);
			});
		},
		startTracking: function() {
			const that = this;
            var checkExist = setInterval(function () {
                if ($(".video_wrap_0 iframe").length) {
                    let iframe = $(".video_wrap_0 iframe");
                    that.trackVideo(iframe);
                    clearInterval(checkExist);
                }
            }, 100);
		},
		trackVideo: function(e) {
			var that = this;
			// Video tracking

			that.player = new Player(e);
			that.vidOpts = {
				e: e
			};

			that.player.getDuration().then(function(duration) {
				// Adding Cue Point
				// Start Video
				that.player
					.addCuePoint(1, {
						customKey: 'startVideo'
					})
					.then(function(id) {})
					.catch(function(error) {
						switch (error.name) {
							case 'UnsupportedError':
								break;
							case 'RangeError':
								break;
							default:
								break;
						}
					});
				// dividing total duration by half to get 50% of video
				var cueTime = duration / 2;

				that.player
					.addCuePoint(cueTime, {
						customKey: 'midVideo'
					})
					.then(function(id) {})
					.catch(function(error) {
						switch (error.name) {
							case 'UnsupportedError':
								break;
							case 'RangeError':
								break;
							default:
								break;
						}
					});
			});
			that.player.on('cuepoint', function(data) {
				switch (data.data.customKey) {
					case 'startVideo':
						//   Getting the videoTitle
						that.player.getVideoTitle().then(function (title) {
                            that.vidOpts.title = title;
                        });
                        //get current play time
                        that.player.getCurrentTime().then(function (time) {
                            that.vidOpts.elapsed = time.toString();
                        });
                        //   Getting the videoDuration
                        that.player.getDuration().then(function (duration) {
                            that.vidOpts.duration = duration.toString();
                        });
                        console.log('title', that.vidOpts.title)
    
                        setTimeout(function () {
                            let obj = {
                                events: 'event450',
                                prop67: 'start~' + that.vidOpts.title + '~' + that.vidOpts.elapsed + '~' + that.vidOpts.duration
                            };
                            EventBus.$emit('analytics:page-view', obj);
                        }, 200);
						break;
					case 'midVideo':
						that.player.getCurrentTime().then(function (time) {
                            that.vidOpts.elapsed = time.toString();
                        });

                        setTimeout(function () {
                            let obj = {
                                events: 'event451',
                                prop67: '50~' + that.vidOpts.title + '~' + that.vidOpts.elapsed + '~' + that.vidOpts.duration
                            };
                            EventBus.$emit('analytics:page-view', obj);
                        }, 200);
						break;
					default:
						break;
				}
			});

			// End Video
			that.player.getEnded().then(function(ended) {});
			that.player.on('ended', function(data) {
				that.player.getCurrentTime().then(function (time) {
                    that.vidOpts.elapsed = time.toString();
                });
				setTimeout(function () {
                    let obj = {
                        events: 'event453',
                        prop67: 'complete~' + that.vidOpts.title + '~' + that.vidOpts.elapsed + '~' + that.vidOpts.elapsed
                    };
                    EventBus.$emit('analytics:page-view', obj);
                }, 200);
			});
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
});
