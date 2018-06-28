<template>
  <div id="inject-test">
    <el-button type="primary" @click="openInjectTest">显示injectTest子组件</el-button>
    <inject-test v-if="show"></inject-test>
  </div>
</template>
<script>
import injectTest from './injectTest.vue'
export default {
  name: 'provideTest',
  /* // provide 为对象
  provide: {
    name: 'hjq', // 字面值
    person: {
      name: 'hjq',
      sex: 'man'
    }
  }, */
  // provide 为返回一个对象的函数
  provide () {
    return {
      name: 'hjq', // 字面值
      person: {
        name: 'hjq',
        sex: 'man'
      }
    }
  },
  // provide 提供的数据包含有Symbol值类型数据
  /* provide () {
      return {
        name: 'hjq', // 字面值
        person: {
          name: 'hjq',
          sex: man
        },
        aaa: Symbol()
      }
  }, */
  components: {
    injectTest
  },
  data () {
    return {
      show: false
    }
  },
  methods: {
    openInjectTest () {
      this.show = true
    }
  }
}

/*
provide 和 inject需要一起使用，以允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在起上下游关系成立的时间里始终生效。
provide 选项应该是一个对象或返回一个对象的函数。该对象包含可注入其子孙的属性。在该对象中你可以使用 ES2015 Symbols 作为 key，但是只在原生支持 Symbol 和 Reflect.ownKeys 的环境下可工作。

用途：
在多层级的组件中传递共用数据可以考虑使用，而不是props一层一层的传递；
官网建议是用于组件库或者高级插件
*/
</script>
