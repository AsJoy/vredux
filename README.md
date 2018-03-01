# `vredux` 极简组件状态管理library，inspired by redux & vuex

### 初衷

vue项目按大模块拆分脱离，比方说我有现在的时一个大的部分脱离业务拆分以方便下次重用，这时候，我不想依赖vuex等较重状态管理框架或者`eventhub` 这种较简陋的模型，于是结合redux与vuex简单实现了一个min状态管理库用法结合了vuex与redux，结合了vuex的reactive与redux的轻量，用法也很简单，对于熟悉redux或vuex的人来说可以无痛接入项目

### usage

1. `npm install vredux`
2. 创建store
```js
// store.js
import Vue from 'vue'
import * as vredux from 'vredux'

Vue.use(vredux)

const initState = {
  winAmount: 4, // 蛇身长度
}

// 设置蛇的状态
export const TOGGLESTATE = 'TOGGLESTATE'

function gameReducer(st = initState, action) {
  const payload = action.payload
  switch (action.type) {
    case TOGGLESTATE: // 设置state
      Object.keys(payload).forEach(it => {
        st = {
          ...st,
          [it]: payload[it]
        }
      })
      return st
  }
  return st
}

export default vredux.createStore({
  game: gameReducer,
})
```
3. 在vue组件中引用
```js
import Vue from 'vue'
import store from './store'
const game = createGame()

new Vue({
  el: '#app',
  store,
  computed: {
    winAmount(){ // 蛇的长度
      return this.$store.state.game.winAmount
    },
  },
  async created() {
    setInterval(() => {
      this.$store.dispatch({
          type: 'TOGGLESTATE',
          payload: {
            winAmount: this.winAmount + 1
          }
        })
    }, 1000)
  },
  render() {
    return <div>
      <div >蛇的长度:{this.winAmount}</div>
    </div>
  },
})
```
