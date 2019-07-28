---
title: 如何使用React—Redux
date: 2019-1-19  17:00:00
author: WangYao
category: 'Tech'
---
在构建基于`Redux`的`React`应用的时候，我们往往需要使用`React-Redux`做数据绑定，当`Redux`中的数据刷新的时候，通知所有用到数据的组建刷新，`React-Redux`提供了对`React`组件的订阅发布的能力。
## 我们为什么需要React-Redux

如果你熟悉`Redux`的话，我们知道在`Redux`中我们会维护一个全局的`store`，`store`中存储了当前`App`中的数据，如果组件需要使用`store`中的数据，有两种办法，第一种是一层一层将`store`传下去，组件从`props`上去取`store`，然后取自己要用到的数据，很显然，这不是一个好的办法，如果存在一个嵌套很深的组件，那么`store`会从最顶层传到最下面，这对于代码的维护和可读性并不是很友好；第二种办法就是使用`React`提供的`context`，在要使用全局状态的时候，从`context`上去取，但是在`React 16.4.0`之前，`React`官方是不推荐使用`context`的，原因在于，当`context`中的值刷新的时候，是从上到下刷新的，如果中间有组件的`shouldComponentUpdate`返回了`false`，这个组件下面的组件就收不到更新后的值；而`React-Redux`实现了订阅发布的模式，保证使用了`store`的组件在数据更新的时候可以得到通知。

在`React 16.4.0`之后官方将`createContext`暴露出来了，以上的问题不会出现，但是是不是意味着，可以用`context`来替代`redux`呢？理论上是可以的，但是并不推荐这样做，因为在`redux`的发展中，其生态系统是非常繁荣的，用`Redux`能避免重复造轮子的窘境。
## React Redux给我们提供了哪些能力？

- Container 组件和Presentational组件

`React`背后的思想是`UI组件`是一个函数，一个大的`Web App`就是一个由不同函数组成的大的函数；在处理这些组件时，我们遵循这样一个原则，根据职责将组件分为`container组件`和`presentational`组件，前者负责提供数据，后者接受数据，只负责展示；对于后者是对`redux`无感的，只负责从`props`上取数据，然后渲染。

`react-redux`的`connect`函数就提供了生成一个`container`组件负责和`store`进行交互，我们自己的组件就只用负责渲染就可以，数据的交互不用操心；`connect`将数据的来源抽象出来，使得我们的组件复用性更好。

- React-Redux的性能优化

虽然`React`在数据更新的时候有着很好的性能，每次`React`刷新的时候是从父组件渲染到叶子组件，这里带来的问题就是，在子组件中数据没有发生变化，但是却重复渲染了，这种问题积少成多会导致性能问题，`react redux`在其内部提供了对应的性能优化，当组件的数据没有发生变化的时候，这个组件并不会重新渲染。
## 如何使用React Redux

`react-redux`的核心`API`就三个，经常使用到的就两个，分别是：
	- `connect`
	- `Provider`
	- `ConnectAdvanced`

这里先来说说`Provider`的用法，简单来说就是`Provider`是一个容器组件，在你需要使用`react redux`管理你的`redux store`的时候，将你的`App`用`Provider`包起来，这样`Provider`下的所有组件都可以通过`connect`来获取`store`上存储的数据了。

```javascript
import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Counter from './demos/reactReduxDemo/counter';
import { counterStore } from './demos/reactReduxDemo/configStore';

class App extends Component {
  render() {
    return(
      <Provider store={counterStore}>  // 将store注入到Provider中
        <Counter />
      </Provider>
    );
  }
}
render(<App />, document.getElementById('root'));
```
如上，我们将`store`注入到组件中，当数据发生变化的时候，会通知`Provider`下的所有订阅了`store`的组件更新。

在我们将`store`注入之后，其下的组件如果需要使用`store`中的数据，就需要使用`connect`这个`API`。
`connect`其实就是一个高阶组件（传入一个组件，返回一个组件），这里`connect`的接口参数如下：
```javascript
	connect(mapStateToProps, mapDispatchToProps, mergeProps, options)
```
这里的`mapStateToProps`主要是用来从`store`中获取数据的函数，这里的函数接口如下：
```javascript
	const mapStateToProps = (state, ownProps) => { ... }
```
如上这里的`state`就是`store`，在`mapStateProps`中我们可以拿到整个应用的数据，在`mapStateToProps`中可以拿到我们需要的数据，另外一个参数`ownProps`是父组件传给子组件的`props`。
另外一个函数`mapDispatchToProps`，这里的函数的参数接口如下：
```javascript
	mapDispatchToProps = (dispatch, ownProps) => {}
```
如上这里的`dispatch`就是`redux`中的`dispatch`，当我们需要改变`state`的时候，就需要`dispatch action`，在`connect`中如果没有传入`mapDispatchToProps`的话，会将`dispatch`作为`props`传入组件；`mapDispatchToProps`的函数的返回值是一个`object`，函数的`value`就是一个`action creator`：
```javascript
	const mapDispatchToProps = (dispatch) => {
		return ({
			foo: (payload) => { dispatch(myAcion(payload)) },
		});
	}
```
如上，这里的`foo`在组件中可以通过`props`访问到，这里最好将组件中的`action creator`放在`mapDispatchToProps`中，不要暴露`dispatch`到组件中，避免将`redux`暴露给组件中，这样组件对`redux`是无感的，组件的复用性更高。
如下，如果一个组件需要从`store`上获取数据，使用`connect`将组件包起来：
```javascript
	connect()(MyComponent);
	connect(
		mapState,
		null,
		mergeProps,
		options)(MyComponent);
```
如上的方式使用`connect`，`MyComponent`中的`props`就可以拿到`dispatch`。
就像上面说的，并不推荐直接将`dispatch`直接传给组件，将`action creator`包装成一个函数传给组件：
```javascript
	const mapStateToProps = (state, props) => {
		......
	};
	
	const mapDispatchToProps = (dispatch) => {
		return ({
			increment: () => dispatch({type: '	INCREASE'}),
			decrement: () => dispatch({type: 'DESCREASE'}),
		}),
	}
	connect(mapStateToProps, mapDispatchToProps)(MyComponent);
```
`ConnectAdvanced`是`react-redux`提供的最后一个`API`，这个`API`是5.0之后提供的，这个方法主要是提供定制化的`connect`，由开发者自己实现缓存和`props check`，`connect`内部就是使用`connectAdvanced`实现，它也是一个高阶组件，其函数接口如下：
```javascript
	connectAdvanced(selectorFactory, connectOptions?)
```
如上，其中的`selectorFactory`就是产生`mapStateToProps + mapDispatchToProps`的工厂函数，起接口及其作用如下：
```javascript
	(dispatch, options) => (nextState, nextOwnProps) => nextFinalProps
```
我们会在`(dispatch, options) => {}`这一层将我们的`action creator`函数以及最终传给组件的`props`对象创建好，在第二层闭包`nextState, nextOwnProps`中会在`redux state`刷新的时候拿到最新的`state`和`props`，在这一层会做缓存的命中，如果最新的`props`中变更的数据影响当前组件，会更新在第一层闭包中缓存好的最终需要传给组件的`props`。
```javascript
	import * as actionCreators from './actionCreators'
import { bindActionCreators } from 'redux'

function selectorFactory(dispatch) {
  let ownProps = {}
  let result = {}

  const actions = bindActionCreators(actionCreators, dispatch)
  const addTodo = text => actions.addTodo(ownProps.userId, text)

  return (nextState, nextOwnProps) => {
    const todos = nextState.todos[nextOwnProps.userId]
    const nextResult = { ...nextOwnProps, todos, addTodo }
    ownProps = nextOwnProps
    if (!shallowEqual(result, nextResult)) result = nextResult
    return result
  }
}
export default connectAdvanced(selectorFactory)(TodoApp)
```
---
***兴趣遍地都是，坚持和持之以恒才是稀缺的***