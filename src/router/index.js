import Vue from 'vue';
import VueRouter from 'vue-router';
import AppHome from '../views/AppHome.vue';
import AppArticles from '../views/AppArticles.vue';
import ArticleListItemDetail from '../views/components/ArticleListItemDetail.vue';
import AppCoupons from '../views/AppCoupons.vue';
import AppVideos from '../views/AppVideos.vue';
import AppRecipes from '../views/AppRecipes.vue';
import RecipeListItemDetail from '../views/components/RecipeListItemDetail.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: AppHome,
    default: true,
    meta: {
      title: 'Home',
      type: 'home'
    },
    name: 'home'
  },
  {
    path: '/articles',
    component: AppArticles,
    meta: {
      title: 'All Articles',
      type: 'articles'
    },
    name: 'articles'
  },
  {
    path: '/articles/:value1/:value2',
    component: ArticleListItemDetail,
    meta: {
      title: 'All Articles',
      type: 'articles',
      articleTitle: ''
    },
    name: 'articleDetail'
  },
  {
    path: '/coupons',
    component: AppCoupons,
    meta: {
      title: 'All Coupons',
      type: 'coupons'
    },
    name: 'coupons'
  },
  {
    path: '/recipes',
    component: AppRecipes,
    meta: {
      title: 'All Recipes',
      type: 'recipes'
    },
    props: true,
    name: 'recipes'
  },
  {
    path: '/recipes/:value1/:value2/:value3',
    component: RecipeListItemDetail,
    props: true,
    meta: {
      title: 'All Recipes',
      type: 'recipes'
    },
    name: 'recipeDetail'
  },
  {
    path: '/videos',
    component: AppVideos,
    props: true,
    meta: {
      title: 'All Videos',
      type: 'videos'
    },
    name: 'videos'
  },
  {
    path: '/videos/:value1',
    component: AppVideos,
    props: true,
    meta: {
      title: 'All Videos',
      type: 'videos'
    },
    name: 'videos'
  },
  {
    path: '#:route/:value1/value1',
    redirect: '#/:route/:value1/value2',
    props: true
  },
  {
    path: '*',
    redirect: '/'
  }
];
const router = new VueRouter({
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(savedPosition);
        }, 100);
      });
    } else {
      return { x: 0, y: 0 };
    }
  }
});

router.afterEach((to, from) => {
  var fullPath =  location.origin + location.pathname + location.search +'#';
  gtag('config', 'UA-15017097-3', {
    'page_location': fullPath + to.path,
    send_page_view: true,
  });
});

export default router;
