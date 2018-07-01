<template>
  <div id="provide-test">
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
  /* provide () {
    return {
      name: 'hjq', // 字面值
      person: {
        name: 'hjq',
        sex: 'man'
      }
    }
  }, */
  // provide 提供的数据包含有Symbol值类型数据
  const s = Symbol()
  provide () {
      return {
        name: 'hjq', // 字面值
        person: {
          name: 'hjq',
          sex: man
        },
        [s]: 'testSymbolvalue'
      }
  },
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

Symbol类型的提出
ES5 的对象属性名都是字符串，容易造成属性名的冲突。比如，你使用了一个他人提供的对象，但又想为这个对象添加新的方法（mixin 模式），新方法的名字就有可能与现有方法产生冲突。
ES6 引入Symbol保证每个属性的名字都是独一无二的，避免冲突。
es6的新的类型:undefined、null、布尔值（Boolean）、字符串（String）、数值（Number）、对象（Object）、Symbol（独一无二的值）
Symbol 值通过Symbol函数生成。即es6对象的属性名现在有两种类型，一种是原来就有的字符串，另一种就是新增的 Symbol 类型。凡是属性名属于 Symbol 类型，就都是独一无二的，可以保证不会与其他属性名产生冲突.
Symbol函数可以接受一个字符串作为参数，表示对 Symbol 实例的描述，主要是为了在控制台显示，或者转为字符串时，比较容易区分

注意：Symbol 是一个原始类型的值（基础类型），不是对象。由于 Symbol 值不是对象，所以不能添加属性。




*/
</script>
