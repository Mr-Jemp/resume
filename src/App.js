import React, { Component } from 'react';
import Prism from 'prismjs'
import './App.css'
const styleText = [
  `/*
* Inspired by http://strml.net
* 大家好，我是jkb
* 九月了，看到很多公司都在招聘，你们是不是都在准备简历。
* 那我也来写一份简历！
*/

/* 首先给所有元素加上过渡效果 */
* {
  transition: all .3s;
}
/* 白色背景太单调了，我们来点背景 */
html {
  color: rgb(222,222,222); background: rgb(0,43,54);
}
/* 文字离边框太近了 */
.styleEditor {
  padding: .5em;
  border: 1px solid;
  margin: .5em;
  overflow: auto;
  width: 45vw; 
  height: 90vh;
}
/* 代码高亮 */
.token.selector{ color: rgb(133,153,0); }
.token.property{ color: rgb(187,137,0); }
.token.punctuation{ color: yellow; }
.token.function{ color: rgb(42,161,152); }

/* 加点 3D 效果呗 */
html{
  perspective: 1000px;
}
.styleEditor {
  position: fixed; left: 0; top: 0;
  -webkit-transition: none;
  transition: none;
  -webkit-transform: rotateY(10deg) translateZ(-100px) ;
          transform: rotateY(10deg) translateZ(-100px) ;
}
`
]
var currentStyle = ''
let interval
// 读取
// const read = async (that, n, index) => {
//   // console.log(n)
//   // console.log(index)
//   let char = styleText[n].slice(index, index + 1)
//   index += 1
//   if (index > styleText[n].length) { return }
//   await write(that, char)
//   await read(that, n, index)
// }
// // 写
// const write = (that, char) => new Promise((resolve) => {
//   setTimeout(() => {
//     const origin = that.state.DOMStyleText + char
//     const html = Prism.highlight(origin, Prism.languages.css)
//     that.setState({
//       styleText: html,
//       DOMStyleText: origin
//     })
//     /* 这里是控制，当遇到中文符号的？，！的时候就延长时间  */
//     if (char === "？" || char === "，" || char === "！") {
//       interval = 800
//     } else {
//       interval = 50
//     }
//     resolve()//一定要写的promise函数，不然你无法获得promise结果
//   }, interval)

// })




class App extends Component {
  constructor(...prop) {
    super(...prop)
    this.state = {
      styleText: '',
      DOMStyleText: '',
      styleTexts: ''
    }
  }

  componentDidMount() {
    (async (that) => {
      await this.progressivelyShowStyle(0)
    })(this)
    // (async (that) => {
    //   await read(that, 0, 0)
    // })(this);
  }
  progressivelyShowStyle = (n) => {
    return new Promise((resolve, reject) => {
      let interval = 40
      let showStyle = (async function () {
        let style = styleText[n]
        if (!style) { return }
        // 计算前 n 个 style 的字符总数
        let length = styleText.filter((_, index) => index <= n).map((item) => item.length).reduce((p, c) => p + c, 0)
        let prefixLength = length - style.length
        if (currentStyle.length < length) {
          let l = currentStyle.length - prefixLength
          let char = style.substring(l, l + 1) || ' '
          currentStyle += char
          this.setState({ styleTexts: Prism.highlight(currentStyle, Prism.languages.css) })
          // console.log(currentStyle)
          // if (style.substring(l - 1, l) === '\n' && this.refs.styleEditor) {
          //   this.$nextTick(() => {
          //     this.refs.styleEditor.goBottom()
          //   })
          // }
          setTimeout(showStyle, interval)
        } else {
          resolve()
        }
      }).bind(this)
      showStyle()
    })
  }
  render() {
    //dangerouslySetInnerHTML:
    return (
      <div className="App" >
        <div ref='styleEditor' className='styleEditor'>
          <div dangerouslySetInnerHTML={{ __html: this.state.styleTexts }}></div>
          <style dangerouslySetInnerHTML={{ __html: currentStyle }}></style>
        </div>
      </div >
    );
  }
}

// <div dangerouslySetInnerHTML={{ __html: currentStyle }}></div>
// <style dangerouslySetInnerHTML={{ __html: this.state.DOMStyleText }}></style>
// <div> {this.state.styleText}</div>
export default App;
