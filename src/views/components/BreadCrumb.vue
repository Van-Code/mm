<template>
  <div :class="`mm-nav ${$route.name}`">
    <img
      src="src/assets/images/site/bc_flag.png"
      alt="Best Customer Bonus"
      class="bc_flag"
    >
    <div
      v-show="$route.path!=='/'"
      class="breadcrumb-container"
    >
      <router-link to="/">
        MyMagazine&trade;
      </router-link>
      <span v-if="level2">
        &nbsp;>&nbsp;
        <router-link
          v-if="level3"
          :to="`/${$route.meta.type}`"
        >{{ level2 }}</router-link>
        <template v-else>{{ level2 }}</template>
      </span>
      <span v-if="level3">
        <span v-if="$route.meta.type != 'articles'">
          &nbsp;> &nbsp;
          {{ level3 }}
        </span>
        <span v-else>
          &nbsp;> &nbsp;
          <span v-html="this.getArticleHeadline" />
        </span>
      </span>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  props: { options: { type: Object, required: true } },
  computed: {
    level3: function() {
      if (this.$route.params.value3) {
        return this.$route.params.value3
          .toLowerCase()
          .replace(/-/gi, ' ')
          .split(' ')
          .map(s => s.charAt(0).toUpperCase() + s.substring(1))
          .join(' ');
      } else {
        return this.$route.params.value2;
      }
    },
    level2: function() {
      return this.$route.meta.title;
    },
    getArticleHeadline: function() {
      return this.$route.meta.articleTitle;
    }
  }
};
</script>
<style lang="scss" scoped>
.mm-nav {
  z-index: 1;
  position: relative;
  font-family: "Poppins";
  padding: 0 5%;
  .breadcrumb-container a {
    text-decoration: underline;
    color: #134b99 !important;
  }
}
.bc_flag {
  max-width: 61px;
  margin: 0 1em 0 0;
  display: inline-block;
  vertical-align: middle;
}
.breadcrumb-container {
  display: inline-block;
}


@media screen and (max-width:767px) {
  .mm-nav.home {
    padding-left: 5%;
  }
}
</style>