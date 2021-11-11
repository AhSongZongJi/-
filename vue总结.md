# 1 watch 监视

- 1 引用类型是拿不到 oldValue 的 因为指针相同， 此时指针已经指向了新的 val

# 2 Vue 自定义事件 或者兄弟组件事件触发

```js
// 1 创建一个空的vue实例
// 2 在兄弟1组件里面引入
import event form './event'
// 3 在mounted 里面注册
 mounted(){
   event.$on('addHandler',this.clickHandler) // this.clickHandler 是在methods里面的方法
 }
// 4 在  beforeDestroye 把自定义函数给关了 要不然会造成内存泄漏
beforeDestroye(){
  event.$off('addHandler',this.clickHandler)
}

// 4 在兄弟2组件里面直接可以使用
methods : {
  clcikHandler(){
    // 调用自定义组件
    event.$emit('addHandler', '参数')
  }
}

```

# 3 $nextTick

- 1 在 data 改变之后不会立刻渲染 dom 在 dom 更新以后不能及时获取新 dom 元素 此方法是在 dom 更新之后执行的

```js
this.$nextTick(() => {
  // todo..........
});
```

# 4 slot 插槽 slot 插槽的作用是父组件想往子组件里面自定义一点东西增加组件的可变性灵活性

```js
// 1 基本使用
/*
    1  在子组件里面定义一个slot  
     <div>   <slot/>   </div>

    2 在父组件里面使用  
     import childComponent from './chlid'

    // child-component 标签写的 就是要在子组件里面展示的内容
    <child-component>   </child-component>
  */

// 2 作用域插值
/**
 在子组件里面定义一个slot 然后自定义一个属性  数据对应data里面定义好的数据
 <slot :slotData="dataObj">
 具名插槽   // 这是默认显示
 </slot>

 data(){
   return {
     dataObj :{
       aa :'xx'
     }
   }
 }
 在父组件使用 template标签 然后使用v-solt="slotProps"
 {{ slotProps.子组件自定义的属性.子组件绑定的数据  }}

<child-component>
  <template v-solt="slotProps">
  {{slotProps.slotData.aa}}  // 子组件传过来的数据
  </template>
</child-component>

*/

// 3 具名插槽
/**
// 1 在子组件定义一个插值
<slot name="header"></slot>
<slot name="footer"></slot>


2 在父组件中使用要和定义的名字一至即可
<child-component>
  <template v-solt:header>
    这是作用域插槽
  </template>


   <template v-solt:footer>
    这是作用域插槽
  </template>
</child-component>

 * 
*/
```

# 5 动态组件 为了渲染那些不确定的组件

```js
// 用法
// 语法 在html中使用
<component :is="componentName"> </component>

import childComponet from './xxx'

expoer default {
  component : {
    childComponet,
  },
  data(){
    return  {
      componentName : 'childComponet'
    }
  }
}

```

# 6 异步组件

```js

import()  // 异步引入组件 通过data里面的属性使用v-if控制  实现什么时候使用 什么时候加载

export default {
  component : {
    childComponent : () => import('./index' )
  }
}

//  在Vue性能优化方案面试题中 可能会问到


```

# 7 keep-alive 缓存组件

```js
// 什么情况下使用keep-alive组件
//  1 组件频繁切换，不需要重新渲染的情况下 -----------> 在tab栏或者路由切换的时候 都会重新创建和销毁当前组件  在组件的最外层添加keep-alive组件可以缓存组件 只是控制组件的显示与隐藏 而不是重新创建和销毁组件

//  在Vue性能优化方案面试题中 可能会问到
```

# 8 computed 有何特点

- 1 有缓存 data 不改变 不会重新计算
- 2 合理的使用计算属性 可以提高性能

# 9 Vue 中的性能优化

```js
//  1 合理使用异步组件  chlidComponent : () => import( './xxx' )   实现用到该组件的时候在加载
//  2 keep-alive 组件缓存
//  3 合理使用v-show和v-if
//  4 v-for时加key，避免v-if和v-show同时使用
//  5 合理使用computed
//  6 自定义事件、dom事件及时销毁
//  7 data层级不要太深
```

# 10 mixin

```js
// 1 多个组件有共同逻辑的时候 可以抽离出来 减少代码的冗余
//   比如 多个组件都会用到一个方法 或者同样的数据这个时候可以定义一个js文件 把同样的都写在该文件中 可以直接通过this访问数据或者方法
//   可以有多个mixin
import mixin form './xxxx'
export default {
  mixins :[mixin]
}
// 2 可能会有一些小问题   代码可读性差  数据来源不明确  多个mixin可能会造成命名冲突
```

# 11 MVVM

```js
// 数据驱动试图  当数据发生改变试图就会随着改变 反之也会更新数据  不需要频繁的操作dom元素
//  1 M -----> model ---------> data  表示数据
//  2 V -----> view --------> html  表示试图
//  3 VM -----> ViewModel  --------> VUE和数据链接的过程(Vue)  数据发生改变就会更新试图   反之也会更新数据
```

# 12 v-if 和 v-for 同时使用

```js
// v-if 的优先级高于 v-for 不建议一起使用   非要一起使用可以在外面加个盒子
```

# 13 Vue 是异步渲染的框架

- 1 vue 会把 data 的修改汇总，一次性更新试图 减少 dom 操作次数 提高性能

# 14 为什么 v-for 要加 key

- 1 key 属性可以避免数据混乱的情况出现
- 2 diff 算法中通过 key 和 element 来判断是否是同样的 vnode 优化 diff 算法的次数，提高渲染性能 如果没有 key
- 3 key 必须是唯一的

# 15 父子组件生命周期执行顺序

- 1 加载渲染过程 父 beforeCreate->父 created->父 beforeMount->子 beforeCreate->子 created->子 beforeMount->子 mounted->父 mounted

- 2 更新过程 父 beforeUpdate->子 beforeUpdate->子 updated->父 updated
- 3 销毁过程 父 beforeDestroy->子 beforeDestroy->子 destroyed->父 destroyed

# 16 vueX

- vueX 缺点
- 1 如果多个组件公用一个数据 修改无法追踪

- vuex 基本使用

```js

// vuex文件

import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin: false
  },

  // 同步提交
  mutations: {
    setLogin(state, value) {
      state.isLogin = value
    }
  },

  // 异步提交 不可以直接修改数据 还是需要调用 mutations 同步更改
  actions: {
    SET_LOGIN({ commit }, value) {
      commit("setLogin", value)
    }
  },
  modules: {}
})




import { mapState, mapActions, mapMutations } from "vuex";
export default {
  data() {
    return {};
  },

  computed: {
    // 把vuex里面的state属性映射到组件   等同于 this.$store.state.isLogin  代码可读性更高
    ...mapState(["isLogin"])
  },

  methods: {
    ...mapActions(["SET_LOGIN"]), // 把vuex里面的state属性映射到组件
    ...mapMutations(["setLogin"]), // 把vuex里面的state属性映射到组件

    login() {



      // dispath 分发异步任务
      // commit 提交同步任务

      // 调用actions方法使用 dispatch
      this.SET_LOGIN(true); //等同于 this.$store.dispatch('SET_LOGIN',true) 代码可读性更高 可以通过this直接访问

      // 调用mutations放法使用 commit 因为是同步修改state数据
      this.setLogin(true); // 等同于 this.$store.commit('setLogin',true) 代码可读性更高 可以通过this直接访问
    }
  }
};


```

# 17 SSR 和 CSR 的区别

- SSR：Server side render
- 将组件或页面通过服务器生成 html 字符串，再发送到浏览器，简单理解下来，发了一个请求，服务器返回的不是接口数据，而是一整个页面的 HTML 结构，再结合界面之前定义的 CSS 把页面展示出来；VUE 服务器渲染文档
- **SSR 优点**
- 例如 SEO–因为访问一个请求，返回的就是页面全部的 HTML 结构，包含所需要呈现的所有数据，于是例如搜索引擎或者爬虫的数据抓取；

- 目前使用 MV\*架构的项目，大都是前后端分离，数据都是动态生成，不利于 SEO 优化
- 利于首屏渲染性能高–首屏的页面加载来自于服务器，不依赖与服务端的接口请求再数据处理；

- SSR 缺点
- 性能全都依赖于服务器
- 前端界面开发可操作性不高

- CSR：Client side render
- 通过接口请求数据，前端通过 JS 动态处理和生成页面需要的结构和页面展示
- **CSR 优点**
- FP 最快
- 客户端体验较好，因为在数据没更新之前，页面框架和元素是可以在 dom 生成的
- 在 CSR 的 FP 术语之间，和 FP 相类似的术语还有：FCP 和 FMP；
- FP：仅有一个 div 根节点。以 VUE 为例，div#app 注册一个空的 div
- FCP：包含页面的基本框架，但没有数据内容。以 VUE 为例，每个 template 中的 div 框架，对应 VUE 生命周期的 mounted
- FMP：包含页面所有元素及数据。以 VUE 为例，通过接口更新到页面的数据后完整的页面展示；对应 VUE 的生命周期中的 updated
- **CSR 的缺点**
- 不利于 SEO–爬虫数据不好爬呀~~
- 整体加载完速度慢

# 18 优化首屏加载，减少白屏时间，提升加载性能：

- 浏览器渲染原理：优化关键渲染路径，尽可能减少阻塞渲染的 JS、CSS；
- 优化用户等待体验：白屏使用加载进度条、loading 图、骨架屏代替等；

# 19 Vue 的高级特效

- 1 自定义 v-model input
- 2 slot
- 3 $nextTick() Vue 是异步渲染的 因为操作 js 消耗的性能比操作 dom 小得多，所以异步集中处理比改一下重新渲染一次性能好 举例 往 ul 列表 push3 次 li 标签，如果在 nextTick 外面获取 ul 下的 li 标签是获取不到 push 的值，vue 会整合修改集中处理
- 4 动态 异步组件
- 5 keep-alive
- 6 mixin
- 7 refs

# 20 MVVM 数据驱动试图

- 1 M ------> model ----- 数据
- 2 V ------> view ----- 视图（dom 元素 html）
- 3 VM -----> ViewModel ---- Vue 框架（把视图和数据关联起来 数据发生更改视图也会随着变化 ）

# 21 Vue 如何监听数组的变化

- 1 重写数组 把数组变成对象 原型还是数组的原型 扩展新的方法不会影响新的原型

```js
const arrOldPrototype = Array.prototype;
//  创建新对象 原型指向 arrOldPrototype 在扩展新的方法不会影响原型
const arrProto = Object.carate(arrOldPrototype);

// 重新数组的方法

arrProto.push = function () {
  console.log("视图更新 ");
  //  然后调用数组原型上的方法
  arrOldPrototype.push.call(this, ...arguments);
};

// if( Array.isArray(value) ) {
//   value.__proto__ = arrProto
// }
```

# 22 虚拟 dom

- 虚拟 dom 用 js 模拟 DOM 结构,计算出最新的变更,操作真实的 Dom

# 23 diff 算法

- 把虚拟 dom 通过 js 模拟,进行对比,然后找出最小的更新范围，然后去更新真实 dom。
- 只比较同一层级，不跨级比较
- 标签不相同直接删除重建 不在深度比较
- 标签和 key 都相同,则认为相同节点,不在深度比较

# 24 Vue 模板编译 vue-template-compiler

```js
const compiler = require("vue-template-compiler");
const template = `<p calss="red" @click="clickHandler">p标前</p>`;

const res = compiler.compile(template);
console.log(res.render);

with (this) {
  return _c("p", { attrs: { calss: "red" }, on: { click: clickHandler } }, [
    _v("p标前"),
  ]);
}
//  this  传入的对象
//  clickHandler  传入对象的属性 没有就报错
// 底层是用with语法  从当前传入的对象里面寻找变量
```

- 1 把模板编译成 render 函数 执行 render 函数 返回 vnode
- 2 基于 vnode 在执行**patch**函数 和 diff
- 3 如果 webpack 或者 vue-cli 创建的项目， 会在开发环境下编译模板

# 25 patch 函数的作用

- 1 patch 函数会根据 render 函数生成的 vnode 判断
  - 1.1 如果没有 oldVnode 那么当前就是第一次创建 vnode 进行渲染页面
  - 1.2 如果 newVnode 和 oldVnode 标签和 key 都是一样的 会继续比较 vnode.text(子节点) 和 vnode.child(子元素)存不存在 如果 child 都存在 就会逐个对比子元素的区别 都不传 key 也是相等的
  - 1.3 如果 newVnode 和 oldVnode 标签不一样或者 key 不一样就直接删除重建 vnode 进行渲染

# 26 初次渲染过程和组件更新过程

- 1 解析 template 为 render 函数
- 2 触发响应式，监听 data 属性 getter setter
- 3 执 render 函数 生成 vnode patch(element,vnode)
- 4 更新过程 修改 data，触发 setter
- 5 重新执行 render 函数，生成 newVnode
- 6 执行 patch(oldVnode,newVnode)

# 27 Vue hash 路由原理

- 1 监听 hash 值的变化 window.onhashchange() 更新对应的试图
- 2 每一次改变 hash(window.localtion.hash)，都会在浏览器访问历史中增加一个记录 可以操作添加后退
- 3 利用 hash 变化不会刷新页面，就可以来实现前端路由"更新视图但不重新请求页面"的功能了。
