
import {  shallowMount, config } from "@vue/test-utils";
import Component from "@/views/AppRecipes.vue";
import vuetify from "vuetify"
import Vue from 'vue';
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
    title:'Recipes'
  }
}
describe("AppRecipes", () => {
 let wrapper
 let options
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
      issueNum:"2002"
    }
    wrapper = shallowMount(Component, {
      propsData: { options }
    })
  })

  it('renders li for each item in options.recipes', () => {
    expect(wrapper.findAll('.recipe-item')).toHaveLength(options.recipes.length)
  })

  it('filters recipes to show one recipe', () => {
    wrapper.vm.allCategories = [{
      id: 'MAIN',
      name: 'main dish',
      character: 'M'
    }],
    wrapper.vm.filterRecipes('FTMAIN',true)//call method
   
    expect(wrapper.vm.recipesToShow).toHaveLength(1)
  })

  it('returns 1 result from search box', () => {
     wrapper.vm.updateResults(options.recipes,'recipe2')//call method
   
    expect(wrapper.vm.input).toBe('recipe2')
  })

  it('checks if recipes contains all selected filters', () => {
    wrapper.vm.filterArray = ['FTMAIN','FTBEV']

    let recipeTags = ['FTBEV']
    expect(wrapper.vm.hasAllTags(recipeTags)).toBeFalsy()
    recipeTags = ['FTMAIN','FTBEV']
    expect(wrapper.vm.hasAllTags(recipeTags)).toBeTruthy()
  })

  it('sorts recipes by newest issue', () => {
    const result =  [
      {title:"recipe2",
       issue_id:"2002",
       tags: [{tag:"FTMAIN"}]
      },
      {title:"recipe1",
        issue_id:"2001",
        tags: [{tag:"FTGF"}]
      }
    ]
    expect(wrapper.vm.sortByIssue(options.recipes)).toEqual(result)
  })

});
