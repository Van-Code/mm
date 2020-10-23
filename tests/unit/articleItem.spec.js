import {  shallowMount, config,createLocalVue } from "@vue/test-utils";
import Component from "@/views/components/ArticleListItem.vue";
import vuetify from "vuetify"
import Vue from 'vue';
import VueRouter from 'vue-router'
const localVue = createLocalVue()
localVue.use(VueRouter)
const router = new VueRouter()
//no localVue https://github.com/vuetifyjs/vuetify/issues/4964
Vue.use(vuetify);
config.mocks['$store'] = {
  state:{ app: {
    banner:{
      id: 'Frys',
      web:'frysfood'
    },
    urlParam:{
      banner:'Frys',
      issue: 'M02M'
    }
  }}
}
config.mocks['$route'] = {
  meta:{ 
    title:'Home'
  }
}
describe("ArticleItem", () => {
 let wrapper
 let options
 let model
  beforeEach(()=>{
    options={
      recipes: [
        {title:"recipe1",
         issue_id:"2001",
         tags: [{tag:"FTGF"}]
        },
        {title:"recipe2",
          issue_id:"2002",
          tags: [{tag:"FTMAIN"}]
        }
      ],
      issueNum:"2002",
      matrix: {
        featured: "301"
      }
    }
    model={
      tags: ["I2001"],
      headline: 'test',
      author_article_id: "301"
    }
    wrapper = shallowMount(Component, {
      localVue,
      propsData: { options,model },
      router
    })
  })

  it('computed issueNum should be of article\'s issue tag', () => {
    expect(wrapper.vm.issueNum).toBe("2001")
  })
  it('verifies article is featured', () => {
    expect(wrapper.vm.isFeatured).toBeTruthy()
  })

});
