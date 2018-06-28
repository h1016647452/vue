/* @flow */

import config from '../config'
import { initProxy } from './proxy'
import { initState } from './state'
import { initRender } from './render'
import { initEvents } from './events'
import { mark, measure } from '../util/perf'
import { initLifecycle, callHook } from './lifecycle'
import { initProvide, initInjections } from './inject'
import { extend, mergeOptions, formatComponentName } from '../util/index'

let uid = 0

export function initMixin (Vue: Class<Component>) { // 在引入vue的index.js文件时，会执行initMixin(Vue)方法，之后再通过new Vue()构造方法来创建vue实例时，会调用下面添加的_init方法。
  Vue.prototype._init = function (options?: Object) { // 给vue对象添加一个_init方法。 prototype 属性可以定义构造函数的属性和方法，还可以为本地对象添加属性和方法。
    const vm: Component = this // 这种语法是flow语法，this表示调用initMixin函数的对象,this赋给vm实例的Component属性。关于this的知识点参见知识点1
    // a uid
    vm._uid = uid++

    let startTag, endTag
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) { // 判断是否是生产环境&&是否开启前端监控工具(window.performance)&&是否mark
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag) // 调用mark函数，创建一个时间戳
    }

    // a flag to avoid this being observed
    vm._isVue = true // ？
    // merge options
    if (options && options._isComponent) { 
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }
    // expose real self
    vm._self = vm
    initLifecycle(vm)
    initEvents(vm)
    initRender(vm)
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props
    initState(vm)
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}

export function initInternalComponent (vm: Component, options: InternalComponentOptions) { // 初始化内部Component，参数：vm本身，创建vue实例时传递的option参数
  const opts = vm.$options = Object.create(vm.constructor.options) // 创建一个具有与vm对象的原型一致的对象，且该对象只包含指定的options属性。Object.create方法即创建一个具有指定原型且可选择性地包含指定属性的对象。
  // doing this because it's faster than dynamic enumeration.
  const parentVnode = options._parentVnode // 这些带_的数据哪里来的？通过new Vue(options)创建对象时，没有传递这些参数啊？
  opts.parent = options.parent // 指定当前vue实例的父实例
  opts._parentVnode = parentVnode //?

  const vnodeComponentOptions = parentVnode.componentOptions //组件属性
  opts.propsData = vnodeComponentOptions.propsData // vue实例的 选项/数据 。目的：通过new Vue创建vue实例时传递 props。注意：只用于 new 创建的实例中
  opts._parentListeners = vnodeComponentOptions.listeners
  // listeners:是vue的实例属性，其表示当前vue实例中包含的父作用域中的 (不含 .native 修饰器的) v-on 事件监听器。它可以通过 v-on="$listeners" 传入内部组件——在创建更高层次的组件时非常有用。
  // 访问 ：vm.$listeners
  opts._renderChildren = vnodeComponentOptions.children
  // children：当前vue实例的直接子组件。需要注意 $children 并不保证顺序，也不是响应式的。
  // 若当前需要尝试使用 $children 来进行数据绑定，考虑使用一个数组配合 v-for 来生成子组件，并且使用 Array 作为真正的来源。
  opts._componentTag = vnodeComponentOptions.tag //?

  if (options.render) {
  // render : 选项/DOM ，当前vue实例的视图
  // 字符串模板template的代替方案，该渲染函数接收一个 createElement 方法作为第一个参数用来创建 VNode。
  // 如果组件是一个函数组件，渲染函数还会接收一个额外的 context 参数，为没有实例的函数组件提供上下文信息。
  // Vue 选项中的 render 函数若存在，则 Vue 构造函数不会从 template 选项或通过 el 选项指定的挂载元素中提取出的 HTML 模板编译渲染函数。
    opts.render = options.render
    opts.staticRenderFns = options.staticRenderFns
  }
}

export function resolveConstructorOptions (Ctor: Class<Component>) {
  let options = Ctor.options
  if (Ctor.super) {
    const superOptions = resolveConstructorOptions(Ctor.super)
    const cachedSuperOptions = Ctor.superOptions
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions
      // check if there are any late-modified/attached options (#4976)
      const modifiedOptions = resolveModifiedOptions(Ctor)
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions)
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions)
      if (options.name) {
        options.components[options.name] = Ctor
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor: Class<Component>): ?Object {
  let modified
  const latest = Ctor.options
  const extended = Ctor.extendOptions
  const sealed = Ctor.sealedOptions
  for (const key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) modified = {}
      modified[key] = dedupe(latest[key], extended[key], sealed[key])
    }
  }
  return modified
}

function dedupe (latest, extended, sealed) {
  // compare latest and sealed to ensure lifecycle hooks won't be duplicated
  // between merges
  if (Array.isArray(latest)) {
    const res = []
    sealed = Array.isArray(sealed) ? sealed : [sealed]
    extended = Array.isArray(extended) ? extended : [extended]
    for (let i = 0; i < latest.length; i++) {
      // push original options and not sealed options to exclude duplicated options
      if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
        res.push(latest[i])
      }
    }
    return res
  } else {
    return latest
  }
}
/*
知识点
1，js对象
js中的所有事物都是对象：字符串、数字、数组、日期等。在 JavaScript 中，对象是拥有属性和方法的数据。

2，js变量
es5和es6对变量的处理有区别的，包括声明、作用域等
定义/声明变量
var a;
var a=1,b="1"；
let a=1;

3，关于this
1）this的本质：在 ECMAScript 中，要掌握的最重要的概念之一是关键字 this 的用法，它用在对象的方法中。关键字 this 总是指向调用该方法的对象。
例子一 ： 直接在<script>中输出this+在某个对象的方法中直接使用this
<script type="text/javascript">
var oCar = new Object; // 创建对象 
oCar.color = "red"; //创建对象的属性
oCar.showColor = function() { //创建对象的方法
  alert(this.color);
};
oCar.showColor(); //真正调用对象的方法，这个时候才能判断this指向什么！！，比如这里就指向oCar对象

console.dir(this); // 这里调用的对象是window！！！！
// 理解关键语句：指向调用该方法的对象！！！
</script>

例子二：在某个对象的方法中调用该对象的其他方法
<script type="text/javascript">
// 定义oCar相关
var oCar = new Object;
oCar.showColor = function() {
  this.test1()  // 调用this所指向的对象的test1方法。
};
oCar.test1 = function () { // 定义oCar对象的test1方法
  console.dir(this)  // 
}

// 直接定义方法，即给window对象添加方法
test1 = function () { // 在<scipt>块中直接定义test1方法，即给顶级对象window定义个test1方法
  console.dir(this)
}

//调用方法
oCar.showColor();// 打印结果：oCar对象。原因：调用test1方法的调用者是this，而这个this指向调用showColor方法的调用者，即oCar。
</script>
若showColor的代码修改一下：
oCar.showColor = function() {
  test1()  // 调用this所指向的对象的test1方法。
};
此时调用oCar.showColor()打印的是window，因为此时调用test1方法的调用者不是oCar，而是window，且调用的是window的test1方法。若是window对象没有定义test1方法，运行报错

深刻理解：this一般用于方法块中，在该方法块中的含义表示：this 总是指向调用该方法的对象

例子三：通过prototype给某个对象添加了方法，在添加的方法中使用this
<script type="text/javascript">
a= new Object;
a.prototype=a; // 注意：prototype属性可以指向任何东西，但一般指向父类原型对象。这里直接指向自己
test = function () {
  a.prototype.test1 = function() {
    console.dir(this)
  }
}
test()
a.test1() // 调用方法，打印结果：a对象
</script>
若修改一下：
<script type="text/javascript">
a= new Object;
a.prototype=window; 
test = function () { // 注意：prototype属性可以指向任何东西，但一般指向父类原型对象（其实也不能理解为父类，就是原型，
  // 这种方式便于之后创建了很多不同的对象，然后将多个对象的共性抽取扔到某个基础原型对象里）。这里直接指向window
  a.prototype.test1 = function() { //对a的父类原型window对象添加test1方法
    console.dir(this)
  }
}
test()
test1() //  调用方法，打印结果：window对象。注意：这里就不能用a.test1()了，会报错误表示a对象没有test1方法。
</script>


2）为什么要使用this，直接使用对象替代this不可以？
因为在实例化对象时，总是不能确定开发者会使用什么样的变量名。使用 this，即可在任何多个地方重用同一个函数。
思考下面的例子：
function showColor() {
  alert(this.color);
};

var oCar1 = new Object;
oCar1.color = "red";
oCar1.showColor = showColor;

var oCar2 = new Object;
oCar2.color = "blue";
oCar2.showColor = showColor;

oCar1.showColor();		//输出 "red"
oCar2.showColor();    //输出 "blue"
说明：
this根据当前调用方法的对象，指向不同的调用者！！！
两个对象都被赋予了属性 showColor，指向原始的 showColor () 函数（注意这里不存在命名问题，因为一个是全局函数，而另一个是对象的属性）

js的变量 要么是全局变量（即顶级对象window的属性变量）、局部变量（函数块里的变量）、某个对象的属性变量。所以变量的使用：
如果不用对象或 this 关键字来引用变量，ECMAScript 就会把它看作局部变量或全局变量。然后该函数将查找名为 color 的局部或全局变量，但是不会找到。结果如何呢？该函数将在警告中显示 "null"。


es5前与es6关于this是有区别的

4，js中关于布尔值的判断
任何不是 false, undefined, null, 0, NaN 的值，或一个空字符串（''）在作为if条件语句进行测试时实际返回true。但真实的值仍然是自己的值，并没有改变为true或false

*/