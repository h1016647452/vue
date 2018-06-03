import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue (options) {  // vue的构造方法
  if (process.env.NODE_ENV !== 'production' &&  // process是啥？
    !(this instanceof Vue) // this表示当前实例对象不是vue对象
  ) { 
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options) // _init是vue对象的方法，参看vue\src\core\instance\init.js
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue
