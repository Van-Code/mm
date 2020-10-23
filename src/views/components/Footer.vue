<template>
  <div>
    <template v-if="hasCoupons">
      <template v-if="isTablet">
        <div class="cpn_dollar_wrapper">
          <div class="cpn_dollar_tab" @click="toggleMobileCpns">$</div>
        </div>
      </template>
      <div class="footer">
        <div class="mobile_coupons" v-if="isTablet && !isHome && !isCoupons">
          <div id="owl-cpn-carousel" class="home-carousel">
            <coupon-list :options="options" :coupons="options.coupons"></coupon-list>
          </div>
          <div class="clearer"></div>

          <div class="couponButton">
            <router-link to="/coupons" class="allCouponButton">View All Coupons</router-link>
            <div class="clearer"></div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import CouponList from './CouponList.vue';
import { mapState } from 'vuex';

export default {
  components: { CouponList },
  props: { options: { type: Object } },
  computed: mapState({
    app: state => state.app,
    banner: state => state.app.banner,
    copyrightYear() {
      const copyrightDate = new Date();
      return copyrightDate.getFullYear();
    },
    hasCoupons: function() {
      return this.options.coupons.length > 0 ? true : false;
    },
    isTablet() {
      return window.innerWidth <= 960;
    },
    isHome() {
      return this.$route.meta.type === 'home';
    },
    isCoupons() {
      return this.$route.meta.type === 'coupons';
    }
  }),
  mounted() {
    $('.mobile_coupons').removeClass('slideDown');
  },
  methods: {
    toggleMobileCpns: function() {
      var that = this;
      $('.mobile_coupons').toggleClass('slideDown');
      $('html').animate({
        scrollTop: $('.cpn_dollar_wrapper').offset().top
      });
    }
  }
};
</script>
<style lang="scss">
// @import "../scss/footer.scss";
// @import "../scss/privacy.scss";
.footerTop {
  h5 {
    font-family: "Poppins";
    font-weight: 700;
    margin: 15px auto 30px;
  }
  p {
    font-family: "Poppins";
    font-weight: 400;
  }
  ul {
    li {
      font-family: "Poppins";
      font-weight: 400;
      font-size: 14px;
    }
  }
}
</style>