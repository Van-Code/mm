
export const recipe_categories = {
  computed: {
    allcategories: function () {
      let issue = this.$store.state.app.urlParam.issue.slice(0, 3);
      switch (issue) {
        case 'M01':
          //example only
          // if (
          //   !main_categories.find(cat => {
          //     return cat.name == "Fat Tuesday";
          //   })
          // ) {
          //   main_categories.push({
          //     id: 'S01',
          //     name: 'Fat Tuesday',
          //     character: 'S'
          //   })
          // }
          break;
        case 'M02':
          //example only
          // if (
          //   !main_categories.find(el => {
          //     return el.name == "Easter";
          //   })
          // ) {
          //   main_categories.push({
          //     id: 'S01',
          //     name: 'Easter',
          //     character: 'S'
          //   })
          // }
          break;
      }
      //remove duplicates
      return [...new Set(main_categories)]
    }
  }
}


let main_categories = [
  // {
  //   id: 'FAVE',
  //   name: 'saved recipes',
  //   character: '<img src="src/assets/images/site/heart-icon.png">'
  // },
  {
    id: 'ISSUE',
    name: 'in this issue',
    character: '&#9733'
  },
  {
    id: 'BFAST',
    name: 'breakfast',
    character: 'B'
  },
  {
    id: 'APP',
    name: 'app',
    character: 'A'
  },
  {
    id: 'SDISH',
    name: 'side dish',
    character: 'SD'
  },
  {
    id: 'MAIN',
    name: 'main dish',
    character: 'M'
  },
  {
    id: 'DESSERT',
    name: 'dessert',
    character: 'D'
  },
  {
    id: 'BEV',
    name: 'beverage',
    character: 'BV'
  },
  {
    id: 'SLCOOK',
    name: 'slow cooker',
    character: 'SC'
  },
  {
    id: 'U30',
    name: '<30 min',
    character: '30'
  },
  {
    id: 'DIETPICK',
    name: "dietitian's pick",
    character: 'DP'
  },
  {
    id: 'VEG',
    name: 'vegetarian',
    character: 'V'
  },
  {
    id: 'SALAD',
    name: 'salad',
    character: 'S'
  }
];
