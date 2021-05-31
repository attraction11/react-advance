// 在不同的组件之间公用功能、共享代码
// 和页面具有相同的生命周期
const MixinLog = {
  componentDidMount() {
    console.log('MixinLog componentDidMount')
  },
  log () {
    console.log('abcdefg...')
  }
}

export default MixinLog
