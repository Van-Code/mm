<template>
  <div class="all-coupons">
    <p
      class="page-title font-weight-bold"
      data-cy="page-title"
    >
      {{ $route.meta.title }}
    </p>
    <v-btn 
      class="print-btn" 
      text
      @click.prevent="printMe"
    >
      Print My Coupons
      <v-icon class="material-icons">mdi-printer</v-icon>
    </v-btn>

    <div
      class="coupon_block"
      data-cy="coupon-block"
    >
      <coupon-list
        v-if="options.coupons"
        id="no-print"
        class="pa-0"
        :options="options"
        :coupons="options.coupons"
      />
      <coupon-list
        v-if="options.coupons"
        id="print-me"
        class="pa-0"
        :options="options"
        :coupons="options.coupons"
      />
      <div v-else>
        Sorry, currently there are no available coupons to add to your card.
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from 'shared/libs/eventbus.js';
import CouponList from './components/CouponList.vue';
import { mapState } from 'vuex';
import printJS from 'print-js';

export default {
  components: { CouponList },
  props: { options: { type: Object, required: true } },
  methods: {
    printModal: function(model) {
      var self = this;
      var modalOpts = {};
      modalOpts.component = CouponList;
      modalOpts.model = model;
      modalOpts.className = 'print-me';
      modalOpts.width = '720';
      modalOpts.type = 'Dialog';
      //new way - used with Boilerplate.vue in dcps
      this.$store.commit('setDialogProps', modalOpts);
    },
    printMe: function() {
      printJS({
        printable: 'print-me',
        type: 'html',
        header: 'MyMagazine Coupons',
        targetStyles: ['*'],
        css: './src/assets/css/couponPrint.css'
      });
    }
  }
};
</script>

<style scoped lang="scss">
.all-coupons {
  font-family: $font-family;
  position: relative;
  margin: 2em auto 0;
  padding: 0 5%;

  .print-btn {
    position: absolute;
    right: 5%;
    top: 0;
    text-transform: capitalize;
    font-size: 1em;
    letter-spacing: inherit;
    cursor: pointer;
    i {
      font-size: 1.25em;
      padding-left: 0.25em;
    }
  }

  .page-title {
    font-size: 3.125em;
    line-height: 1;
  }

  .coupon_block {
    margin: 4em auto;
  }
}

.coupon_block .couponlist {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
}
@media screen and (max-width: 960px) {
  .all-coupons {
    .print-btn {

    }
  }
}
@media screen and (max-width: 600px) {
  .all-coupons .print-btn {
    position: relative;
    left: 0.5%;
  }
  .all-coupons .coupon_block {
    margin: 2em auto;
  }
}
</style>


<style lang="css">
/* print styles */
#print-me {
  display: none;
}
#print-me .coupon-item {
  margin: 0;
  padding: 0 !important;
}
#print-me .coupon-item .content {
  width: 100%;
  height: inherit !important;
  margin-bottom: 1em;
  padding: 0;
}
#print-me .coupon-item .content h1 {
  font-weight: 700;
  margin: 0;
  padding: 0;
}
#print-me .coupon-item .content p {
  margin: 0;
  padding: 0;
}
#print-me .coupon-item .content .exp_date {
  font-size: 12px;
}
#print-me .coupon-item .border {
  border: none !important;
}
#print-me .coupon-item .coupon-header,
#print-me .coupon-item .offer-footer,
#print-me .coupon-item .cta_box,
#print-me .coupon-item .coupon_image_holder,
#print-me .coupon-item .red_text {
  display: none;
}
</style>
