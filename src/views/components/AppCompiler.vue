<script>
import Vue from 'vue';
import AppShare from './Share';

export default {
  name: 'AppCompiler',
  props: {
    template: {
      type: String,
      required: true,
      default: '<div></div>'
    },
    options: {
      type: Object
    },
    model: {
      type: Object
    },
    methods: {
      type: Object
    }
  },
  functional: true,
  render(h, context) {
    if (context.props.template) {
      const myComponent = {
        template: context.props.template,
        props: {
          options: context.props.options,
          model: context.props.model,
          methods: context.props.methods
        },
        components: { AppShare }
      };
      return h('div', [
        h(myComponent, {
          props: context.props
        })
      ]);
    }
  }
};
</script>