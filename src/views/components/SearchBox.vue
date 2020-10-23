<template>
  <v-text-field
    v-model="input"
    solo
    singleline
    clearable
    clear-icon="mdi-close"
    outlined
    flat
    append-icon="mdi-magnify"
    label="Search"
    @keyup.enter="searchContent(input)"
    @click:append="searchContent(input)"
  />
</template>
<script lang="ts">
import axios from 'axios';
export default {
  props: { options: { type: Object } },
  data() {
    let keywords:any= [];
    if (this.$route.name === 'articles') {
      axios
        .get('src/json/keywords.json')
        .then(response => (keywords = response));
    }
    return {
      input: null,
      newArr: [],
      keywords: keywords,
      merged: false
    };
  },
  computed: {
    collectionName: function() {
      //build collection name
      return this.$route.name === 'recipes'
        ? this.$route.name
        : this.$route.name + 'Archive';
    }
  },
  mounted() {
    if (this.$route.name === 'articles') {
      this.mergeJSON();
    }
  },
  methods: {
    clearMessage() {
      this.message = '';
    },
    searchContent: function(input) {
      let that = this;
      let text = input;
      that.newArr = [];
      if (input) {
        input = input.split(' ');
        input.forEach(str => {
          let fields = this.getFields(this.collectionName);
          let collection = this.options[this.collectionName].flat();
          collection.filter((x, i) => {
            fields.some(name => {
              if (x[name]) {
                var field = x[name].toLowerCase();
                if (field.includes(str.toLowerCase()) && !that.newArr.includes(x)) {
                  that.newArr.push(x);
                }
              }
            });
          });
        });
      } else {
        this.newArr = this.options[this.collectionName];
      }
      this.$emit('updateResults', this.newArr, text);
    },
    getFields: function(col) {
      let fields :string[]= [];
      switch (col) {
        case 'recipes':
          fields = ['title', 'header', 'subheader', 'description'];
          break;
        case 'articlesArchive':
          fields = ['headline', 'category_name', 'html', 'keywords'];
          break;
      }
      return fields;
    },
    mergeJSON: function() {
      //add search fields to articlesList object
      const that = this;
      this.options.articlesArchive.forEach((issue, i) => {
        //each issue, ex 2001, 1908
        if (issue) {
          issue.forEach(model => {
            //each article ex. 211
            let str = model.tags[0].substring(1) + model.author_article_id;
            //see if search id field includes the article tag
            var match = that.keywords.find(g => {
              return g.id.includes(str);
            });

            if (match) {
              Object.assign(model, match, {
                tag: model.tags[0].substring(1, 5)
              });
            }
          });
        }
      });
      //sort by issue tag
      that.options.articlesArchive = that.options.articlesArchive.sort(
        (a, b) => {
          return a[0].tags[0].substr(1) - b[0].tags[0].substr(1);
        }
      );
      that.options.articlesArchive.reverse();
    }
  }
};
</script>