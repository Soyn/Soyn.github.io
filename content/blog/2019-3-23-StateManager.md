---
title: 实现一个前端状态管理库
date: 2019-3-23  17:00:00
author: WangYao
category: 'Tech'
---
在前端开发中，如何对前端状态的管理是一个需要面对的问题，前端主要是数据展示和界面交互，***交互的存在就会导致数据的变化，数据的变化会影响页面的展示***，也就是说，一个完整的前端状态管理，要提供数据的存储、更新、数据变化的通知机制。这篇文章，我们来了解一下如何从0到1，如何实现前端数据的管理。
## 发布订阅
首先我们需要一个机制在数据更新的时候，用到这份数据的部分能够知道数据更新了，这样才能保证页面的同步；这里我们需要实现一个[Publish/Subscribe](https://en.wikipedia.org/wiki/Publish–subscribe_pattern)，在数据更新的时候发布`stateChanged`的事件，所有订阅了`stateChange`的组件会调用注册的回调函数来获取更新后的数据。
```javascript
// ------pubSub.js------
export default class PubSub {
  constructor(){
    this.listeners = {};
  }
  publish(event, data) {
    const currentEventListeners = this.listeners[event];
    if (currentEventListeners) {
      currentEventListeners.forEach(listener => {
        listener(data);
      });
    } 
  }
  
  subscribe(event, callback) {
    if (typeof callback !== 'function') {
      throw Error('callback is not a function!');
    }
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }
}
```
如上，就是一个发布／订阅的简单实现，`listeners`中会维护所有注册的回调函数，在`subscribe`的时候会以事件名为`key`，回调函数为`value`，放入`listeners`中，`publish`事件的时候，会调用注册到当前这个事件所有的回调函数。`发布／订阅`模式是很常见的消息传递机制，好处是模块与模块之间解耦，订阅者和发布者对于彼此是透明的。
## 如何侦测数据变更
有了发布／订阅之后，我们就需要知道数据变更的时机，这里我们使用`ES6`的`Proxy`来检测数据的变化。
```javascript
// --- store.js---
this.state = new Proxy(params.state || {}, {
  set: (state, key, value) => {
    state[key] = value;
    this.events.publish('stateChanged', this.state);
    if (this.status !== Status.Mutating) {
      console.warn('You Should Mutate Your State By Action!');
    }
    this.status = Status.Resting;
    return true;
  }
```
如上，`store`中的`state`是一个`Proxy`，我们在`set`数据的时候，会发布`stateChanged`的事件，所有订阅了`stateChanged`的回调都会被调用。
## 如何变更数据
类似于`redux`，我们需要设计一套去变更数据的模式，在创建`store`的时候，将我们对数据的加工操作（类似于`redux`的`reducer`注册进去），在需要修改数据的时候，`dispatch`对应的`action`。
```javascript
export class Store {
  constructor(params) {
    this.events = new PubSub();
    if (params.hasOwnProperty('mutations')) { // {A}
      this.mutations = params.mutations;
    };
  }
  commit(mutationType, payload) {
    this.status = Status.Mutating;
    if (typeof this.mutations[mutationType] === 'function') {
      this.mutations[mutationType](this.state, payload);
    }
  }
  dispatch(actionType, payload){
    if (isPlainObject(payload)) {
      throw Error('Payload Must Be A Plain Object!');
    }
    if (this.status === Status.Mutating) {
      throw Error('Can Not Dispatch Action In Mutation Function!');
    }
    this.commit(actionType, payload); // {B}
  }
  getState() {
    return this.state;
  }
}
```
在创建`store`的时候，我们将修改`state`的操作`mutations`注入进去(`{A}`行代码)，在`dispatch`的时候，根据`dispatch`的`action`的类型去调用对应的`mutation`来更改`state`，`mutation`会触发`stateChanged`的事件，这样所有订阅了`stateChanged`事件的组件会刷新；所以我们可以提供一个基础组件，这个组件要做的事就是订阅`stateChanged`事件，事件发生之后就重新渲染：
```javascript
export default class Component {
  constructor(props) {
    if (props.store instanceof Store) {
      this.store = props.store;
      this.store.events.subscribe('stateChanged', (state) => this.render(state));
    }
    if (props.hasOwnProperty('element')) {
      this.element = props.element;
    }
  }
  render() {}
}
```
如上，其他的组件从这个组件上继承的时候，就会自动订阅`stateChanged`的事件，完整的代码实现在这里：[tinyStateManager](https://github.com/Soyn/tinyStateManager)

## Reference
- [Build a state management system with vanilla JavaScript](https://css-tricks.com/build-a-state-management-system-with-vanilla-javascript/)
---
***兴趣遍地都是，坚持和持之以恒才是稀缺的***

