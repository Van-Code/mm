
import {  shallowMount, config } from "@vue/test-utils";
import Component from "@/views/components/RecipeSearch.vue";
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

describe("RecipeSearch", () => {
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
      issueNum:"2002",
      filterArray: ["FTMAIN"]
    }
    wrapper = shallowMount(Component, {
      propsData: { options }
    })
  })  

  it('toggles filter color to black', () => {
    expect(wrapper.vm.getColor({id:'MAIN'})).toBe('black')
    expect(wrapper.vm.getColor({id:'BEV'})).toBe('black')
  })
});