<template>
    <div>
        <div id="inject-test">
            provide name： {{name}}
        </div>
        <div>
            provide person: {{person.name}} - {{person.sex}}
        </div>
        =============================================
        <div id="inject-test">
            inject name： {{injectName}}
        </div>
        <div>
            inject person: {{injectPerson.name}} - {{injectPerson.sex}}
        </div>
        <el-button type="primary" @click="changeProvide">injectTest子组件修改provide提供的值</el-button>
        =====================injectTest1==========================
        <inject-test1 v-if="true"></inject-test1>
    </div>
</template>
<script>
import injectTest1 from './injectTest1.vue'
export default {
  name: 'injectTest',
  inject: ['name', 'person'],
  data () {
    return {
      injectName: this.name,
      injectPerson: this.cloneSelfProps(this.person)
    }
  },
  methods: {
    changeProvide () {
      // this.name = 'lh' // 直接修改，会报错：Avoid mutating an injected value directly since the changes will be overwritten whenever the provided component re-renders.
      this.injectName = 'lh' // 修改该值，provide的值不会变
      this.person.name = 'lh' // 修改对象里的值不会报错,可修改
      this.person.sex = 'woman'
      this.injectPerson.name = 'aaa' //
      this.injectPerson.sex = 'aaa' //
    },
    cloneSelfProps (origin) {
      return Object.assign({}, origin)
    },
    cloneAllProps (origin) {
      let originProto = Object.getPrototypeOf(origin)
      return Object.assign(Object.create(originProto), origin)
    }
  },
  components: {
    injectTest1
  }
}
</script>
