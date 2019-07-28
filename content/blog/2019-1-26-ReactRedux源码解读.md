---
title: React-Redux源码剖析
date: 2019-1-26  17:00:00
author: WangYao
category: 'Tech'
---
---
TL;DR;
  - `Connect`本质上是一个高阶组件
  - `Connect`会对组件做缓存控制
  - `Connect`使用`Context`做全局状态的通信
---

## Overview

```javascript
import Provider from './components/Provider'
import connectAdvanced from './components/connectAdvanced'
import { ReactReduxContext } from './components/Context'
import connect from './connect/connect'

export { Provider, connectAdvanced, ReactReduxContext, connect }
```
如上，react-redux向外暴露了四个API，分别是`Provider`、`ConnectAdvanced`、`ReactReduxContext`、`connect`。
## Provider
`Provider`是一个`React Component`，在组件`didMount`的时候订阅`redux`的`store`，在`willUnMount`的时候接触订阅，每次`redux state`改变的时候，会调用`Provider`中的`setState`，使得组件刷新，我们来看看部分源代码：
```javascript
    constructor(props) {
    super(props)

    const { store } = props

    this.state = {
      storeState: store.getState(),
      store
    }
  }
```
在组件初始化的时候，`Provider`从`props`上获取`redux`上的`store`，并初始化`state`。

同时在组件`didMount`的时候，这里会向`redux`的`store`上注册`callback`函数：
```javascript
    componentDidMount() {
    this._isMounted = true
    this.subscribe()
  }
  subscribe() {
    const { store } = this.props

    this.unsubscribe = store.subscribe(() => {
      const newStoreState = store.getState()

      if (!this._isMounted) {
        return
      }

      this.setState(providerState => {
        // If the value is the same, skip the unnecessary state update.
        if (providerState.storeState === newStoreState) {
          return null
        }

        return { storeState: newStoreState }
      })
    })

    // Actions might have been dispatched between render and mount - handle those
    const postMountStoreState = store.getState()
    if (postMountStoreState !== this.state.storeState) {
      this.setState({ storeState: postMountStoreState })
    }
  }
```
这里在`subscribe`函数的最后几行的代码，是用来处理在组件`Provider`如果在初次`render`的时候，如果有`action`被`dispatch`，这个时候还没有`subscribe`，但是这时候我们的数据需要刷新，所以这个时候需要去取一次最新数据，如果发现有数据变化，使用`setState`，触发组件刷新。

在`render`中使用`Context.Provider`将`context`中的内容，即我们这里的`state`注入到`children`组件中。

从上面的代码可以看到，如果`redux`的`State`发生了变化，会触发顶层组件的刷新，重新`render`，从而重刷整个应用。


## Connect
`connect`这个函数就是我们经常要使用到的，一般来说在使用`redux`的时候，`Container`组件就是一个`connect`之后的组件。
`connect`主要的工作就是一是负责从`state tree`上去取组件要用的数据，另外就是在`state`变化的时候，重新计算来自`state`上的`props`。
我们来看看一个简单版本的`connect`的实现（[connect explain](https://gist.github.com/gaearon/1d19088790e70ac32ea636c025ba424e)）:
```javascript
// connect() is a function that injects Redux-related props into your component.
// You can inject data and callbacks that change that data by dispatching actions.
function connect(mapStateToProps, mapDispatchToProps) {
  // It lets us inject component as the last step so people can use it as a decorator.
  // Generally you don't need to worry about it.
  return function (WrappedComponent) {
    // It returns a component
    return class extends React.Component {
      render() {
        return (
          // that renders your component
          <WrappedComponent
            {/* with its props  */}
            {...this.props}
            {/* and additional props calculated from Redux store */}
            {...mapStateToProps(store.getState(), this.props)}
            {...mapDispatchToProps(store.dispatch, this.props)}
          />
        )
      }
      
      componentDidMount() {
        // it remembers to subscribe to the store so it doesn't miss updates
        this.unsubscribe = store.subscribe(this.handleChange.bind(this))
      }
      
      componentWillUnmount() {
        // and unsubscribe later
        this.unsubscribe()
      }
    
      handleChange() {
        // and whenever the store state changes, it re-renders.
        this.forceUpdate()
      }
    }
  }
}
```
如上就是`connect`一个简单版本的实现，`connect`是一个包装过的高阶组件的函数，在第一层接受一个`selector`函数，接收`redux`的`state`和传给组件的`props`， 然后将需要包装的组件传给返回后的函数，最后返回的组件中就可以从`props`上拿到`redux state`上的数据了，上面这个是一个简陋的`connect`实现，我们来看看`react redux`真正的实现。

我们先来看看`connect`是如何解析我们传入的参数的，`connect`的`map*`传入的格式支持直接传入函数，也可以传入一个`obejct`，来看看`react-redux`是如何支持不同的输入的。

```javascript
// createConnect with default args builds the 'official' connect behavior. Calling it with
// different options opens up some testing and extensibility scenarios
export function createConnect({
  connectHOC = connectAdvanced,
  mapStateToPropsFactories = defaultMapStateToPropsFactories,
  mapDispatchToPropsFactories = defaultMapDispatchToPropsFactories,
  mergePropsFactories = defaultMergePropsFactories,
  selectorFactory = defaultSelectorFactory
}{
	......
}

export default createConnect()
```
如上，是`connect.js`文件暴露出来的`connect`接口，外面用的时候，是使用的`createConnect`的返回值。
在这里`createConnect`使用了默认参数，分别是：
- `connectAdvanced`
- `defaultMapStateToPropsFactories`
- `defaultMapDispatchToPropsFactories `
- defaultMergePropsFactories
- defaultSelectorFactory

我们这里先看和`props`相关的`defaultMapStateToPropsFactories `和`defaultMapDispatchToPropsFactories `。
```javascript
const initMapStateToProps = match(
      mapStateToProps,
      mapStateToPropsFactories,
      'mapStateToProps'
    )
const initMapDispatchToProps = match(
      mapDispatchToProps,
      mapDispatchToPropsFactories,
      'mapDispatchToProps'
    )
```
当调用`connect`的时候，这里会调用`match`函数，来辨别出我们传入的`mapStateToProps`和`mapDispatchToProps`是函数还是`object`。
```javascript
function match(arg, factories, name) {
  for (let i = factories.length - 1; i >= 0; i--) {
    const result = factories[i](arg)
    if (result) return result
  }

  return (dispatch, options) => {
    throw new Error(
      `Invalid value of type ${typeof arg} for ${name} argument when connecting component ${
        options.wrappedComponentName
      }.`
    )
  }
}
```
上面就是`match`函数的代码，这里会将我们传入的`map*`函数作为参数，传入给`mapDispatchToPropsFactories`这个工厂函数，我们来这个工厂函数的实现。
```javascript
import { wrapMapToPropsConstant, wrapMapToPropsFunc } from './wrapMapToProps'

export function whenMapStateToPropsIsFunction(mapStateToProps) {
  return typeof mapStateToProps === 'function'
    ? wrapMapToPropsFunc(mapStateToProps, 'mapStateToProps')
    : undefined
}

export function whenMapStateToPropsIsMissing(mapStateToProps) {
  return !mapStateToProps ? wrapMapToPropsConstant(() => ({})) : undefined
}

export default [whenMapStateToPropsIsFunction, whenMapStateToPropsIsMissing]

```
如上是`mapStateToPropsFactories `的实现，这里`export`出去的是一个`array`，分别是当`mapStateToProps`是函数和没有传入的时候，最后返回的是`wrapMapToPropsFunc`这个函数包装后的函数。
```javascript
export function wrapMapToPropsFunc(mapToProps, methodName) {
  return function initProxySelector(dispatch,{ displayName }){
	......
}
```
这里`wrapMapToPropsFuc`，返回值是一个`(dispatch, { displayName}) => {}`的接口，这里就是工厂函数生成的函数的接口，这个函数也是被`mapDispatchToProps`复用的，生成统一的接口函数。

```javascript
import { bindActionCreators } from 'redux'
import { wrapMapToPropsConstant, wrapMapToPropsFunc } from './wrapMapToProps'

export function whenMapDispatchToPropsIsFunction(mapDispatchToProps) {
  return typeof mapDispatchToProps === 'function'
    ? wrapMapToPropsFunc(mapDispatchToProps, 'mapDispatchToProps')
    : undefined
}

export function whenMapDispatchToPropsIsMissing(mapDispatchToProps) {
  return !mapDispatchToProps
    ? wrapMapToPropsConstant(dispatch => ({ dispatch }))
    : undefined
}

export function whenMapDispatchToPropsIsObject(mapDispatchToProps) {
  return mapDispatchToProps && typeof mapDispatchToProps === 'object'
    ? wrapMapToPropsConstant(dispatch =>
        bindActionCreators(mapDispatchToProps, dispatch)
      )
    : undefined
}

export default [
  whenMapDispatchToPropsIsFunction,
  whenMapDispatchToPropsIsMissing,
  whenMapDispatchToPropsIsObject
]
```
如上是`mapDispatchToProps`的代码，`mapDisptchToProps`支持函数、`Object`、或者不传任何参数，和`mapStateToProps`一样最后也是返回`(dispatch, { options }) => {}`。在将`map*`函数初始化好之后，后面就是调用一个高阶组件函数，用来接收我们想要从`redux`上获取数据的组件。
```javascript
    return connectHOC(selectorFactory, {
      // used in error messages
      methodName: 'connect',

      // used to compute Connect's displayName from the wrapped component's displayName.
      getDisplayName: name => `Connect(${name})`,

      // if mapStateToProps is falsy, the Connect component doesn't subscribe to store state changes
      shouldHandleStateChanges: Boolean(mapStateToProps),

      // passed through to selectorFactory
      initMapStateToProps,
      initMapDispatchToProps,
      initMergeProps,
      pure,
      areStatesEqual,
      areOwnPropsEqual,
      areStatePropsEqual,
      areMergedPropsEqual,

      // any extra options args can override defaults of connect or connectAdvanced
      ...extraOptions
    })
```
上面的代码就是`connect(map1, map2)`的返回值，这里调用了`connectHOC(connectAdvanced)`，我们来看看`connectAdvanced`函数的代码：
```javascript
export default function connectAdvanced(selectorFactory, {.../* options object*/}) {
	......
	return return function wrapWithConnect(WrappedComponent) { ...}
}
```
上面的代码是`connectAdvanced`函数的接口和返回值，这里接受`selectorFactory`和`options`设置，这里的`selectorFactory`函数就是将我们在上一步调用初始化好的`map*`函数由`(dispatch, { options }) => {}`的形式转换为`(stateOrDispatch, ownProps) => {}`的形式。
```javascript
export default function finalPropsSelectorFactory(
  dispatch,
  { initMapStateToProps, initMapDispatchToProps, initMergeProps, ...options }
) {
  const mapStateToProps = initMapStateToProps(dispatch, options)
  const mapDispatchToProps = initMapDispatchToProps(dispatch, options)
  const mergeProps = initMergeProps(dispatch, options)

  if (process.env.NODE_ENV !== 'production') {
    verifySubselectors(
      mapStateToProps,
      mapDispatchToProps,
      mergeProps,
      options.displayName
    )
  }

  const selectorFactory = options.pure
    ? pureFinalPropsSelectorFactory
    : impureFinalPropsSelectorFactory

  return selectorFactory(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
    dispatch,
    options
  )
}
```
上面的代码就是`selectorFactory`函数的实现，这里首先调用了由`map`工厂函数生成的函数，返回的函数就是由`wrapMapToPropsFunc`返回的函数，这里我们来看看`wrapMapToPropsFunc`的实现：
```javascript
export function wrapMapToPropsFunc(mapToProps, methodName) {
  return function initProxySelector(dispatch, { displayName }) {
    const proxy = function mapToPropsProxy(stateOrDispatch, ownProps) {
      return proxy.dependsOnOwnProps
        ? proxy.mapToProps(stateOrDispatch, ownProps)
        : proxy.mapToProps(stateOrDispatch)
    }

    // allow detectFactoryAndVerify to get ownProps
    proxy.dependsOnOwnProps = true

    proxy.mapToProps = function detectFactoryAndVerify(
      stateOrDispatch,
      ownProps
    ) {
      proxy.mapToProps = mapToProps
      proxy.dependsOnOwnProps = getDependsOnOwnProps(mapToProps)
      let props = proxy(stateOrDispatch, ownProps)

      if (typeof props === 'function') {
        proxy.mapToProps = props
        proxy.dependsOnOwnProps = getDependsOnOwnProps(props)
        props = proxy(stateOrDispatch, ownProps)
      }

      if (process.env.NODE_ENV !== 'production')
        verifyPlainObject(props, displayName, methodName)

      return props
    }

    return proxy
  }
}
```
这里的`wrapMapToPropsFunc`最终返回的是一个`proxy`函数，这个函数的接口是`(dispatchOrState, ownProps) => {}`，这也我们的`map*`函数的接口相同，这里`proxy`函数主要是处理在第一次运行的时候，如果我们提供的`map*`函数的返回值是`map`函数这种情况，另外就是检测最后我们提供的`map*`函数的返回值是一个`plain object`的情况。

在拿到真正的`map*`函数后，会判断传入的`options`中`pure`的值来决定使用哪一个`SelectorFactory`函数，默认情况下会使用`pureFinalPropsSelectorFactory`，如果`pure`为`false`的话会使用`impureFinalPropsSelectorFactory`，前一个函数缓存了前一次的`state`，`ownProps`，`stateProps`，`dispatchProps`，`mergedProps`，在第一次调用`connect`的时候，会设置好缓存，在后续的调用中会比较缓存，如果缓存的引用没变，就不会调用`map*`函数生成新的`props`。具体的实现代码如下：
```javascript
export function pureFinalPropsSelectorFactory(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
  dispatch,
  { areStatesEqual, areOwnPropsEqual, areStatePropsEqual }
) {
  let hasRunAtLeastOnce = false
  let state
  let ownProps
  let stateProps
  let dispatchProps
  let mergedProps

  function handleFirstCall(firstState, firstOwnProps) {
    state = firstState
    ownProps = firstOwnProps
    stateProps = mapStateToProps(state, ownProps)
    dispatchProps = mapDispatchToProps(dispatch, ownProps)
    mergedProps = mergeProps(stateProps, dispatchProps, ownProps)
    hasRunAtLeastOnce = true
    return mergedProps
  }

  function handleNewPropsAndNewState() {
    stateProps = mapStateToProps(state, ownProps)

    if (mapDispatchToProps.dependsOnOwnProps)
      dispatchProps = mapDispatchToProps(dispatch, ownProps)

    mergedProps = mergeProps(stateProps, dispatchProps, ownProps)
    return mergedProps
  }

  function handleNewProps() {
    if (mapStateToProps.dependsOnOwnProps)
      stateProps = mapStateToProps(state, ownProps)

    if (mapDispatchToProps.dependsOnOwnProps)
      dispatchProps = mapDispatchToProps(dispatch, ownProps)

    mergedProps = mergeProps(stateProps, dispatchProps, ownProps)
    return mergedProps
  }

  function handleNewState() {
    const nextStateProps = mapStateToProps(state, ownProps)
    const statePropsChanged = !areStatePropsEqual(nextStateProps, stateProps)
    stateProps = nextStateProps

    if (statePropsChanged)
      mergedProps = mergeProps(stateProps, dispatchProps, ownProps)

    return mergedProps
  }

  function handleSubsequentCalls(nextState, nextOwnProps) {
    const propsChanged = !areOwnPropsEqual(nextOwnProps, ownProps)
    const stateChanged = !areStatesEqual(nextState, state)
    state = nextState
    ownProps = nextOwnProps

    if (propsChanged && stateChanged) return handleNewPropsAndNewState()
    if (propsChanged) return handleNewProps()
    if (stateChanged) return handleNewState()
    return mergedProps
  }

  return function pureFinalPropsSelector(nextState, nextOwnProps) {
    return hasRunAtLeastOnce
      ? handleSubsequentCalls(nextState, nextOwnProps)
      : handleFirstCall(nextState, nextOwnProps)
  }
}
```
如上是`pureFinalPropsSelectorFactory`的实现，这里在第一次调用的时候产生一份缓存，后续的调用会检查缓存。

上面的一连串过程就是`props`如何产生，以及`props`的刷新过程。简要的来说，这里的几个不同的`factory`函数，主要的工作是统一接口，校验传进来的参数，函数接口的转换形式如下：
```javascript
(dispatch, options) => (mapOrDispatch, ownProps) => finalProps
```
上面就是这几个`factory`函数的主要工作。

我们继续来看`connect`后续的代码的主要工作是返回一个高阶组件来包装我们的组件：
```javascript
export default function connectAdvanced(selectoryFactory, {
	...
	/*options object*/
}) {
	return withConnect(WrappedComponent) {
		......
	}
}
```
这里对这个高阶组件做了几个小的处理，一是对于`forwardRef`的处理，而是对`Context`的处理。
```javascript
    if (forwardRef) {
      const forwarded = React.forwardRef(function forwardConnectRef(
        props,
        ref
      ) {
        return <Connect wrapperProps={props} forwardedRef={ref} />
      })

      forwarded.displayName = displayName
      forwarded.WrappedComponent = WrappedComponent
      return hoistStatics(forwarded, WrappedComponent)
    }
```
如上，如果`forwardRef`为`true`的时候，这个时候，会讲`ref`挂到`connect`包的底层组件上；另外就是对`context`的处理了
```javascript
render() {
        const ContextToUse =
          this.props.context &&
          this.props.context.Consumer &&
          isContextConsumer(<this.props.context.Consumer />)
            ? this.props.context
            : Context

        return (
          <ContextToUse.Consumer>
            {this.indirectRenderWrappedComponent}
          </ContextToUse.Consumer>
        )
      }
```
`connect`的第三个参数支持注入我们自己的`context`，如上的代码，如果我们在`mergeProps`中注入了我们自己的`context`，会优先使用我们自己的`context`，否则就使用`Provider`上提供的`context`。在之前讲的到，`selectorFactory`会讲`wrapMapToProps`包装后的函数`(dispatch, options) => {}` 转换为`(stateOrDispatch, ownProps) => {}`。在代码里的体现如下：

```javascript
render() {
        const ContextToUse =
          this.props.context &&
          this.props.context.Consumer &&
          isContextConsumer(<this.props.context.Consumer />)
            ? this.props.context
            : Context

        return (
          <ContextToUse.Consumer>
            {this.indirectRenderWrappedComponent}
          </ContextToUse.Consumer>
        )
      }	
```
在`connect`的`render`方法中，调用了`this.indirectRenderWrappedComponent `，这个方法实际上就是`makeDerivedPropsSelector`返回的函数，我们来看看这个方法的代码：
```javascript
 function makeDerivedPropsSelector() {
      let lastProps
      let lastState
      let lastDerivedProps
      let lastStore
      let lastSelectorFactoryOptions
      let sourceSelector

      return function selectDerivedProps(
        state,
        props,
        store,
        selectorFactoryOptions
      ) {
        if (pure && lastProps === props && lastState === state) {
          return lastDerivedProps
        }

        if (
          store !== lastStore ||
          lastSelectorFactoryOptions !== selectorFactoryOptions
        ) {
          lastStore = store
          lastSelectorFactoryOptions = selectorFactoryOptions
          sourceSelector = selectorFactory(
            store.dispatch,
            selectorFactoryOptions
          )
        }

        lastProps = props
        lastState = state

        const nextProps = sourceSelector(state, props)

        lastDerivedProps = nextProps
        return lastDerivedProps
      }
    }
```
可以看到在第一次运行，更换`store`或更换`selectorFactoryOptions`的时候，会重新获取`store`和`selectorFactoryOptions`，这块函数就是每次`context`刷新或者`props change`的时候，调用当前的`map*`函数，生成新的`props`或者是使用旧的`props`。最后调用`makeChildElementSelector`将计算好的props，要渲染的组件，以及要转发的`ref`传进去，可以看到这里的刷新也是有一层缓存的，如果传入的这些东西还是上一次的话，这里还是会返回上一次渲染的组件。
```javascript
   function makeChildElementSelector() {
      let lastChildProps, lastForwardRef, lastChildElement, lastComponent

      return function selectChildElement(
        WrappedComponent,
        childProps,
        forwardRef
      ) {
        if (
          childProps !== lastChildProps ||
          forwardRef !== lastForwardRef ||
          lastComponent !== WrappedComponent
        ) {
          lastChildProps = childProps
          lastForwardRef = forwardRef
          lastComponent = WrappedComponent
          lastChildElement = (
            <WrappedComponent {...childProps} ref={forwardRef} />
          )
        }

        return lastChildElement
      }
    }
```
在没有转发`ref`的情况下，`connect`组件会返回：
```javascript
   return hoistStatics(Connect, WrappedComponent)
```
这里的`hoistStatics`函数是为了将`WrapperComponent`上的静态属性复制到`Connect`的组件上；原因在于，如果原始的组件上有一个静态方法，在`connect`之后的组件暴露出去用的时候，这个组件实际上是访问不到的，所以要把一些静态属性拷到高阶组件上去。

---
***兴趣遍地都是，坚持和持之以恒才是稀缺的***