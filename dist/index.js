'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.install = exports.createStore = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* 极简组件状态管理library，inspired by redux & vuex
* */
var Vue = void 0;

var createStore = exports.createStore = function createStore(reducers) {
  var state = {};
  var initType = '___init___';
  var subscribers = [];

  function subscribe(fn) {
    subscribers.push(fn);
  }
  function dispatch(action) {
    (0, _keys2.default)(reducers).forEach(function (it) {
      state = (0, _extends4.default)({}, state, (0, _defineProperty3.default)({}, it, reducers[it].bind(null, state[it])(action)));
    });
    subscribers.forEach(function (fn) {
      return fn(state);
    });
  }
  var _vm = new Vue({
    data: function data() {
      return {
        $$game: dispatch({
          type: initType
        })
      };
    }
  });
  var store = {
    get state() {
      return _vm._data.$$game;
    },
    reducers: reducers,
    dispatch: dispatch,
    subscribe: subscribe
  };

  function applyMiddles() {
    var mds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    mds.reduce(function (fn, _store) {
      return fn(_store);
    }, store);
  }

  store.applyMiddles = applyMiddles;

  subscribe(function () {
    _vm._data.$$game = state;
  });
  return store;
};

var install = exports.install = function install(_Vue) {
  Vue = _Vue;
  var version = Number(Vue.version.split('.')[0]);
  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit });
  } else {
    var _init = Vue.prototype._init;
    Vue.prototype._init = function () {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      options.init = options.init ? [vuexInit].concat(options.init) : vuexInit;
      _init.call(this, options);
    };
  }
  function vuexInit() {
    var options = this.$options;
    if (options.game) {
      this.$game = typeof options.game === 'function' ? options.game() : options.game;
    } else if (options.parent && options.parent.$game) {
      this.$game = options.parent.$game;
    }
  }
};
