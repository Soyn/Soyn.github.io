---
title: Javascript模块化
date: 2019-2-6  17:00:00
author: WangYao
category: 'Tech'
---
---
TL:DR;

  - 前端模块化主要是解决依赖管理，模块加载的问题
  - 立即调用函数的匿名闭包是模块化实现的基石
  - 在客户端和服务端都需要做模块化
  - CommonJS是服务端的模块化解决方案，模块同步加载
  - AMD是客户端（浏览器）的模块化方案，模块异步加载
  - UMD统一了客户端和服务端，兼容AMD和CommonJS
  - ES6提供了官方的模块化（import/export）

---

 在写`Javascript`的时候，会经常会听到模块化这个概念，模块化在编程是一个很重要的设计，将可复用的、独立的模块抽出来，一是避免重复造轮子；二是减小维护和使用成本，虽然现在`ES6`提供了标准的模块化方案，但是在`Javascript`的发展历程中还是经历了一段从黑暗到光明的阶段。
## 模块的加载和封装

使用`<script>`来做模块化最常见的方式是使用`script`标签将你需要的模块在网页中加载，在用户请求网页的时候，会加载前置的依赖，例如这样：

```html
  <html>
    <head>
      <script type="text/javascript" src="./module1.js"></script>
      <script type="text/javascript" src="./main.js"></script>
    </head>
    <body></body>
  </html>
```

就像上面一样，这里先加载`module1.js`，在`main.js`中会使用`module1`暴露出的方法，但是这样的模块化方案如果面对大量的依赖管理的话，就会面临很多问题，就像下面的代码：
```html
  <html>
    <head>
      <script type="text/javascript" src="./framework.js"></script>
      <script type="text/javascript" src="./frameworkPlugin.js"></script>
      <script type="text/javascript" src="./frameworkPlugin1.js"></script>
      <script type="text/javascript" src="./frameworkPlugin2.js"></script>
      <script type="text/javascript" src="./frameworkPlugin3.js"></script>
      ...
      <script type="text/javascript" src="./main.js"></script>
    </head>
    <body></body>
  </html>
```
但是如果依赖多了的话，带来的问题就是，第一依赖模糊，模块与模块之间的依赖并不清楚；第二就是会给代码维护带来麻烦，因为在编写代码的时候，依赖的注入，是依赖于`html`中前置的`script`标签做的，在代码中并没有显示的声明依赖；第三就是每个`<script>`加载都需要发网络请求，这里网络请求过多。

如何构建`Javascript`模块也是一个值得探讨的问题，常见的是这样：

```javascript
function foo() {
	......
}

function bar() {
	......
}
```
如果以为上面的方式暴露接口的话，存在的问题就是，很容易污染全局环境，造成命名冲突，为了解决命名冲突的问题，随之而来，我们可以增加命名空间：

```javascript
const myModule = {
	foo: function () { ... },
	bar: function () { ... },
}

myModule.foo()
```
像上面这样加命名空间的方式减少了全局环境被污染的情况，并且这样的封装并不安全，本质上是对象，外部可以访问到不想暴露给外界的东西，这种方式并没有解决根本矛盾—>保证封装性的同时减少全局变量的数量，在这里我们要保证模块只暴露想暴露的东西，一些私有属性外界无法访问，这里使用闭包就可以解决这些问题：

```javascript
const myModule = (function(){
	const _private = 1;
	const foo = () => {
		// use _private
	}
	return {
		foo,
	}
})();
myModule.foo()
myModule._private
```

这里使用立即调用（IIFE）的模式，将私有属性和外部隔离起来，保证了封装性，如果我们需要注入其他的依赖可以这样：

```javascript
const myModule = (function($){
	const _$ = $;
	const _private = 1;
	const foo = (selector) => {
		return _$(selector);
	}
	return {
		foo,
	}
})($)
```

就像上面的代码，如果可以向模块引入外部依赖，这就是现代模块系统的基石。

上面讲了如何封装一个模块和加载模块，在实际的开发过程中，我们仍然需要考虑几个问题，比如跳出浏览器环境，在`Node.js`下如何做模块化，如何对打包之后的模块进行压缩、合并、优化。

## CommonJS
`CommonJS`是`Node.js`的模块化规范，`Common.js`对外暴露四个环境变量`module`、`exports`、`global`、`require`，`Common.js`以文件作为独立模块来管理，`Common.js`以同步的方式加载模块。

```javascript
//  引入模块
// a.js
const foo = () => {
	...
}
const bar = () => {
	...
}

// 导出模块
module.exports = {
	foo,
	bar
}

// main.js
// 声明依赖模块
const { foo, bar } = reauire(./a.js);

foo();
bar();
```

因为在服务端，文件存在磁盘上，读取速度很快，同步的加载方式不存在问题，但是在浏览器上，因为网络的原因，同步加载的方式并不是一个好的方式，这就引入了异步加载模块的方式`AMD`。

优缺点：

- 服务端的模块化方案实现
- 模块的输出是`Object`，无法做静态分析
- 每个模块输出都是一个`copy`，无法做到热加载
- 循环依赖的管理做的不好

## AMD（Async Module Definition ）
`AMD`规范制定了一套异步加载`module`的机制，`define(id?, dependencies?, factory)`，`define`函数的前两个参数是可选的，如果提供了一个`id`，这个`id`就代表该模块，如果没有给这个参数，某块的名字就是模块加载器请求脚本的名字，`dependencies`是一个模块`id`的数组，声明当前模块的依赖模块，`factory`函数就是在所有依赖模块加载好之后的会调函数，如果`dependencies`中没有提供任何依赖，模块加载器会扫描`factory`函数中所有的`require`，同步加载依赖,`factory`函数只执行一次，如果传入的参数是一个`Object`的话，会将模块输出到这个对象中，如果函数的返回值是一个对象，模块输出到返回值中。

```javascript
// 将alpha模块挂到exports上
  define("alpha", ["require", "exports", "beta"], function (require, exports, beta) {
       exports.verb = function() {
           return beta.verb();
           //Or:
           return require("beta").verb();
       }
   });
// 返回输出模块
   define(["alpha"], function (alpha) {
       return {
         verb: function(){
           return alpha.verb() + 2;
         }
       };
   });
// 一个没有依赖的模块
   define({
     add: function(x, y){
       return x + y;
     }
   });
// 使用commonJS包裹的模块
   define(function (require, exports, module) {
     var a = require('a'),
         b = require('b');

     exports.action = function () {};
   });
```

优缺点：

- 主要用于客户端（浏览器）
- 语法复杂

## UMD（Universal Module Definition）
`AMD`和`CommonJS`的模块化方案提供两套`API`，`UMD`将这两套`API`统一了起来，`UMD`使用`commonJS`的语法，但是提供异步加载模块的能力。
```javascript
	// File log.js
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.log = mod.exports;
  }
})(this, function (exports) {
  "use strict";

  function log() {
    console.log("Example of UMD module system");
  }
  // expose log to other modules
  exports.log = log;
});
```
如上其实`UMD`就是对宿主环境做了兼容性处理，在不同的宿主环境下输出不同模块。

优缺点：
	- 同时适用于客户端和服务端，兼容性好
	- 兼容`AMD`和`CommonJS`

## ES6的Import和Export
在`ES6`中有了官方的模块化解决方案，将`AMD`、`CommonJS`和`UMD`统一了起来，并且在打包工具打包的时候可以做静态分析，可以做`tree shaking`。
```javascript
// a.js
export const foo = () => {}

// main.js
import { foo } from './a';
foo();
```

优缺点：

- 服务端和客户端都可以使用
- `import`的时候拿到的是实际值不是拷贝，可以做热更新
- 支持静态分析（可以用`tree shaking`）
- 相比于`CommonJS`循环依赖的管理做的更好

## Webpack 、Babel
因为并不是所有的宿主环境都支持`ES6`，我们需要使用`Babel`来将`ES6`的代码转移成`es5`的代码，同时我们需要对现有的工程代码做合并、压缩和优化，这主要是通过`Webpack`实现的，也可以使用`Webpack`做按需加载，划分不同的`chunk`，减少`http`请求。

## Reference
  - https://github.com/creeperyang/blog/issues/17
  - https://github.com/Huxpro/js-module-7day
  - https://medium.freecodecamp.org/anatomy-of-js-module-systems-and-building-libraries-fadcd8dbd0e

---
***兴趣遍地都是，坚持和持之以恒才是稀缺的***

