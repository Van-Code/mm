
<template>
  <div class="carousel-wrap" v-if="coupons.length > 0 && $route.name=='home'">
    <slick 
      ref="slick"
      id="slick" 
      :options="slickOptions"
    >
      <coupon-item
        v-for="(cpn, j) in options.coupons"
        data-cy="coupon-li"
        :model="cpn"
        :key="j"
        :options="options"
        class="coupon_item_owl"
        ></coupon-item>
    </slick>
  </div>

  <ul class="couponlist" v-else-if="coupons.length >0 && $route.name!='home'">
    <template>
      <coupon-item
        data-cy="coupon-li"
        v-for="(coupon, i) in coupons"
        :model="coupon"
        :options="options"
        :place="i"
        :key="coupon.id"
        class="coupon_item pa-2 col-12 col-sm-6 col-md-4"
      ></coupon-item>
    </template>
  </ul>

  <div class="padding" v-else>{{options.noCpnsMsg || "Sorry, there are no available coupons."}}</div>
</template>
<script>
import EventBus from 'shared/libs/eventbus.js';
import CouponItem from 'shared/components/CouponItem.vue';
import Slick from 'vue-slick';
// import 'node_modules/slick-carousel/slick/slick.css';

export default {
  props: ['coupons', 'options'],
  components: { CouponItem, Slick },
  data() {
    return {
      slickOptions: {
        slidesToShow: 3,
        rows: 2,
        dots: false,
        arrows: true,
        infinite: true,
        speed: 300,
        slidesToShow: 3,
        slidesToScroll: 1,
        prevArrow: "<v-icon class='mdi mdi-chevron-left prev-arrow'></v-icon>",
        nextArrow: "<v-icon class='mdi mdi-chevron-right next-arrow'></v-icon>",
        responsive: [
          {
            breakpoint: 960,
            settings: {
              rows: 1,
              slidesToShow: 2
            }
          },
          {
            breakpoint: 767,
            settings: {
              rows: 1,
              slidesToShow: 1
            }
          }
        ]
      },
    };
  },
  created() {
    let that = this;
    EventBus.$on('template:rendered', this.matchHeights);
    EventBus.$on('template:shown', this.matchHeights);
    EventBus.$on('sync', this.matchHeights);
  },
  watch:{
    coupons: {
      immediate: true,
      handler(val) {
        const that = this; 
        setTimeout(function(){
          that.reInit();
        },300)
      }
    },
  },
  mounted() {
    const that = this;
    that.matchHeights();
  },
  computed: {
    coups: function (){
      return this.options.coupons
    },
    isMobile: function() {
      return this.$store.state.app.responsive.current < 2;
    },
    nocpntext: function() {
      return `<h2>
        &nbsp;
        <br />&nbsp;
        <br />&nbsp;
        <br />${this.options.nocpntext} <br />&nbsp;
        <br />&nbsp;
        <br />&nbsp;
      </h2>`;
    }
  },
  methods: {
    reInit() {
      const that = this;
      
      that.$refs.slick.destroy();
    
      setTimeout(function(){
        that.$refs.slick.create();
      },300)
  
    },
    //Match the heights of all rows to create a clean grid display
    matchHeights: function() {
      var that = this;
      that.wrapPosition = false;
      //Make sure the template CSS is loaded
      //otherwise DOM elements will have no position
      if (this.coupons && this.coupons.length > 0) {
        var parentLeft = this.$el.offsetLeft,
          parentWidth = this.$el.offsetWidth,
          firstChildWidth = this.$children[0].$el.offsetWidth,
          //Baseline number of columns should be the parent width divided by the child width
          // columns = Math.floor(parentWidth/firstChildWidth),
          columns = Math.floor(parentWidth / firstChildWidth),
          num = 0,
          currentColumns = columns;
        //Loop through all the rows (currentColumns determines row length)
        while (num < that.$children.length) {
          var row = [],
            child,
            allRendered = true;
          //_.range(num, num + currentColumns);
          let range = [];
          if (currentColumns > 0) {
            range = Array(currentColumns)
              .fill()
              .map((_, currentColumns) => num + currentColumns);
          }
          range.forEach(function(i) {
            //We might be in the last row, could have fewer than currentColumns
            if (i < that.$children.length) {
              var child = that.$children[i].$el;
              // child.options.doRender = false;
              //var model = that.collection.at(i);
              //child = that.children.findByModel(model);
              row.push(child);
              child.row = row;
              //if (!child.options.doRender) {
              //     allRendered = false;
              // }
            }
          });
          //Invoke the setHeights function on coupon_item to set the height individually on each element
          // if (allRendered && child) {
          this.setRowHeights(row);
          //}
          num += currentColumns;
        }
      }
      this.showChildren();
    },
    showChildren: function() {
      var that = this;
      var top = $(window).scrollTop(),
        height = $(window).height(),
        bottom = top + height * 2;
      this.$children.every(function(model) {
        var child = model;
        if (child && !child.options.doRender) {
          var childTop = child.$el.offsetTop;
          if (childTop > 0 && childTop < bottom) {
            child.options.doRender = true;
            // child.render();
            return true;
          }
          return false;
        }
        return true;
      });
    },
    setRowHeights: function(row) {
      let elementsToMatch = [
        { selector: '.content' },
        { selector: '.cta_box' },
        { selector: '.header' }
      ];
      var that = this;
      //An array to save the heights of the various elements needing to be matched
      var maxHeights = elementsToMatch.map(function(itm) {
        return Object.assign(itm, { height: 0 });
      });
      row.forEach(function(child) {
        maxHeights.forEach(function(itm) {
          //Re-set the height to auto (if it was already set) so that the natural height can be determined
          $(child)
            .find(itm.selector)
            .css({ height: 'auto' });
          //Get the height of the element
          var height = $(child)
            .find(itm.selector)
            .height();
          //If this is the biggest height, save it
          if (height > itm.height) {
            itm.height = height;
          }
        });
      });
      //Set heights on all coupons in the row
      row.forEach(itm => {
        this.setHeights(itm, maxHeights);
      });
    },
    setHeights: function(cpn, heights) {
      //Set and save the heights for the coupon's elements
      var that = this;
      that.heights = [];
      heights.forEach(function(itm) {
        that.heights.push(itm);
        $(cpn)
          .find(itm.selector)
          .height(itm.height);
      });
    }
  }
};
</script>

<style lang="scss">
.border {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

// slick
.slick-slider {
  display: flex !important;
  flex-direction: row;
  .slick-arrow {
    align-self: center;
    cursor: pointer;
    font-size: 3em;
  }
  .slick-list {
    width:90%;
    margin:0 auto
  }
  .coupon-item {
    padding: 5px;
  }
}
.material-icons {
  color: black;
}
@media (min-width: 960px) {
  _:-ms-fullscreen,
  :root .border {
    width: 100%;
  }
  .border {
    display: block;
  }
}
@media screen and (max-width:400px) {
  #slick {
    .prev-arrow {
      position: absolute;
      left: -10%;
    }
    .next-arrow {
      position: absolute;
      right: -10%;
    }
    .offer-footer span {
      font-size:8px
    }
  }
  
}
</style>
