/*
* 极简组件状态管理library，inspired by redux & vuex
* */
let Vue

export const createStore = (reducers) => {
  let state = {}
  const initType = '___init___'
  const subscribers = []

  function subscribe(fn) {
    subscribers.push(fn)
  }
  function dispatch(action) {
    Object.keys(reducers).forEach(it => {
      state = {
        ...state,
        [it]: reducers[it].bind(null, state[it])(action)
      }
    })
    subscribers.forEach(fn => fn(state))
  }
  const _vm = new Vue({
    data() {
      return {
        $$game: dispatch({
          type: initType,
        })
      }
    },
  })
  const store = {
    get state() {
      return  _vm._data.$$game
    },
    reducers,
    dispatch,
    subscribe
  }

  function applyMiddles(mds = []) {
    mds.reduce((fn, _store) => fn(_store), store)
  }

  store.applyMiddles = applyMiddles

  subscribe(() => {
    _vm._data.$$game = state
  })
  return store
}

export const install = (_Vue) => {
  Vue = _Vue
  const version = Number(Vue.version.split('.')[0])
  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit })
  } else {
    const _init = Vue.prototype._init
    Vue.prototype._init = function (options = {}) {
      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit
      _init.call(this, options)
    }
  }
  function vuexInit () {
    const options = this.$options
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
  }
}