---
title: ES6 Module
date: 2019-3-16  17:00:00
author: WangYao
category: 'Tech'
---
在ES6之前，`Javascript`并没有官方标准的模块化方案，在社区中就出现了`Common.js`和`AMD`这两种方案，前者主要用于服务端，后者用在浏览器端，为了统一写法，又出现了`UMD`的标准，在`ES6`中，`Javascript`终于有了官方标准的模块化方案，这篇博客我们就来看看`ES6`的模块化方案。

# Overview
## 定义和使用模块
```javascript
// ------lib.js-----
export function foo() {
    console.log('foo in lib.js');
}
export default function bar() { 
    console.log('bar in lib.js')
}
// ------main.js-----
import { foo } from './lib.js';
import bar from './lib.js';
```
如上，是`ES6`中`Module`的用法，这里有两个保留字`import`和`export`，从上面的代码中，我们可以发现，对于不同的`export`方式，对应的`import`的方式也不一样。
## Name Export
```javascript
// ------lib.js-----
let a = 1;
export foo() {}
export bar() {}
export a;
```
如上，就是`name export`的写法，每一个函数或者变量，直接被`export`，这种每写一个函数或者变量就`export`的方式也叫做`inline export`，如果在一个`Module`中有很多需要`export`的东西，这种写法就有些累赘了，这时候可以写成这样：
```javascript
// ------lib.js------
let a = 1;
function foo() {}
function bar() {}
export {
    foo,
    bar,
    a
}
```
在`ES6 Module`中，有`local name`和`export name`的概念，顾名思义`local name`就是在`Module`中的名字，`export name`就是模块暴露给外界的名字。
```javascript
// ------lib.js------
let a = 1;
function foo() {} // {A}
function bar() {} 
export {
    foo as bar,  // {B}
    bar as foo,
    a as b,
}
```
在上面的代码中，`{A}`行的`foo`是`local name`，在`{B}`行的`bar`是`export name`，同样的我们在`import`的时候也可以使用别名。
```javascript
// ------lib.js------
export function foo() {}
// ------main.js------
import { foo as bar } from './lib.js';
bar();
```
## Default Export
```javascript
// ------lib.js------
export default foo() {}
// ------main.js------
import foo from 'lib.js';
foo();
```
如上，我们`import`了一个`default`的`export`，`default export`和`name export`在`import`的时候，`name export`需要加大括号，而`default export`则不需要。
## 转发export
```javascript
// ------lib.js------
let a = 1;
function foo() {
  console.log('foo in lib.js');
}

function bar() {
  console.log('bar in lib.js')
}

export {
  foo,
  bar,
  a,
}
// ------middleLib.js------
export { foo as bar, bar as foo } from './lib';
// ------main.js------
import { foo, bar } from './middleLib';
foo();
bar();
```
如上我们将模块`lib.js`中暴露的`export`通过另一个模块暴露出去了，这种常见的用法是，在封装好一个大的模块后，这个大的模块只需要向外界暴露部分小模块的`API`：
```javascript
- module
  -- a.js
  -- b.js
  -- index.js
```
如上，在`module`这个`folder`下我们有`a.js, b.js, index.js`，`a.js和b.js`是一些功能的实现，我们将`a.js, b.js`中需要向外界暴露的`API`通过`index.js`转发。
# ES6 Module Under Hood
`ES6`给我们提供了很简洁的语法去使用模块，但是`ES Module`简洁的外表下，背后的细节仍然值得我们注意。
## ES Module是静态的
如何理解`ES Module`是静态的这句话呢？意思就是，`ES Module`不同于`Common.js`这种模块化方案，只有在运行时才可以确定依赖的模块，在源码中看到的依赖关系就是运行时的依赖。
```javascript
//------commonJSModule.js------
function foo() {}
function bar() {}

module.exports = {
 foo,
 bar,
}
//------main.js------
if (something) {
    let foo = require('./commonJSModule.js').foo;
    foo();
} else {
    let foo = require('./commonJSModule.js').bar;
    bar();
}
```
如上，在`CommonJS`中这中动态的在运行时决定依赖的方式在`ES Module`中是行不通的（但是有提案在做运行时的`loader` --> https://github.com/whatwg/loader/）。
## ES Module的变量提升
```javascript
// ------lib.js------
let a = 1;
function foo() {
  console.log('foo in lib.js');
}

function bar() {
  console.log('bar in lib.js')
}

export {
  foo,
  bar,
  a,
}
// ------main.js------
foo();
bar();
import { foo, bar } from './lib';
```
如上，我们可以先调用`export`的函数，在调用之后再`import`，这个在编译的时候会将`import`提升到顶层，但是在实际开发的过程中，虽然可以这样，但是这并不是好的代码风格。
## ES Module是只读的
```javascript
// ------commonJSModule.js------
function foo(){}
let a = 0;
module.exports = {
    foo,
    a,
}
// ------main.js------
let a = require('./lib.js').a;
++a; // 1
console.log(require('./lib.js').a) // 0
```
上面的代码在`CommonJS`下，我们可以修改`require`的东西，因为在`commonJS`中是拷贝一份，但是在`ES Module`中，我们无法修改`import`的东西，`import`的模块在行为上类似于`const`变量和`frozen object`
```javascript
// ------lib.js------
let a = 1;
function foo() {
  console.log('foo in lib.js');
}

function bar() {
  console.log('bar in lib.js')
}

export {
  foo,
  bar,
  a,
}
// ------main.js------
import { foo, bar, a } from './lib';
foo();
bar();
foo.a = 1; // works {A}
++a; // error {B}
```
## ES Module静态结构的设计带来的益处
`ES Module`的静态结构的设计特点，让代码在编译的时候就能确定依赖关系，不同于运行时，只有代码跑起来的时候很多东西才能确定，就好比，你计划完成一项复杂的项目，静态的结构能保证你在做之前，你确定的事是不会变的，而不是只要等到在项目进行中去确定，面对可预测的问题，我们是好解决的。

- 有助于在代码打包的时候做 `dead code elimination`，减小`bundle`文件的大小（`RollUp`基于`ES Module`实现了`tree shaking`）
- 静态的结构有助于`lint`工具的检测
- 为`javascript`支持宏做准备（宏操作需要静态的结构 --> https://www.sweetjs.org/）

# Reference
- [ES6 Module](http://exploringjs.com/es6/ch_modules.html)
- [Are the new ECMAScript 6 import and export asynchronous?](https://stackoverflow.com/questions/41706953/are-the-new-ecmascript-6-import-and-export-asynchronous)

---
***兴趣遍地都是，坚持和持之以恒才是稀缺的***
