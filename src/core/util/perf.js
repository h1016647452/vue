import { inBrowser } from './env'

export let mark
export let measure

if (process.env.NODE_ENV !== 'production') {
  const perf = inBrowser && window.performance // 若window对象是否已实例化且window对象的performance属性不为undefined，则返回window.performance
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = tag => perf.mark(tag) // mark被定义为一个函数，函数体执行 perf.mark(tag)方法
    //perf.mark: 基于给定的 name在浏览器的性能输入缓冲区中创建一个 timestamp 。 名称作为键和对应的DOMHighResTimeStamp（作为值）保存在一个哈希结构里。该键值对表示了从某一时刻（通常是 navigationStart 事件发生时刻）到记录时刻间隔的毫秒数
    measure = (name, startTag, endTag) => { // 
      //mark及以下几个方法不是window.performance属性本身的方法，而是performance属性的prototype原型对象Performance（Performance是个接口）的方法
      perf.measure(name, startTag, endTag) // 在浏览器的指定 start mark 和 end mark 间的性能输入缓冲区中创建一个指定的 timestamp
      perf.clearMarks(startTag) //  从浏览器的性能输入缓冲区中移除给定的 mark
      perf.clearMarks(endTag)
      perf.clearMeasures(name) // 移除给定的 measure，从浏览器的性能输入缓冲区中
    }
  }
}
/*
知识点

1，js的&&运算符说明 =========================================================
1）若&&运算符的运算数都是Boolen值，则与平时的处理一样
2）逻辑 AND 运算的运算数可以是任何类型的，不止是 Boolean 值。
如果某个运算数不是原始的 Boolean 型值，逻辑 AND 运算并不一定返回 Boolean 值：
如果一个运算数是对象，另一个是 Boolean 值，返回该对象。 不管Boolean的值是否为true？？不是，也会从左至右判断，若之前一旦判断为false则直接返回false，只有当前面判断都为true才能输出最后的对象
如果两个运算数都是对象，返回第二个对象。
如果某个运算数是 null，返回 null。
如果某个运算数是 NaN，返回 NaN。
如果某个运算数是 undefined，发生错误。
常见的对象对应的Boolean值如下：
  对象                 ==》 true，
  非空字符串      ==》 true
  非0数字           ==》 true
  true                  ==》 true
  
  ""                     ==》 false
  null                  ==》 false
  undefined       ==》 false
  false               ==》 false
  NaN                ==》 false
  0                     ==》 false
特别注意，虽然这些在运算符中当做对应的布尔值处理，但是真正的数据值仍然是本身的数据。
任何不是 false, undefined, null, 0, NaN 的值，或一个空字符串（''）在作为if条件语句进行测试时实际返回true。但真实的值仍然是自己的值，并没有改变为true或false

2，关于Performace接口
Performance 接口可以获取到当前页面与性能相关的信息，可以通过调用只读属性 Window.performance 来获得

 */