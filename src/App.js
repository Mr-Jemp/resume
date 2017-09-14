import React, { Component } from 'react';
import Prism from 'prismjs'
import showdown from 'showdown'
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
  transition: all 1s;
}
/* 白色背景太单调了，我们来点背景 */
html {
  color: rgb(222,222,222); 
  background: rgb(0,43,54);
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
/* 接下来我给自己准备一个编辑器 */
.resumeEditor{
  white-space: normal;
  position: fixed; right: 0; top: 0;
  padding: .5em;  margin: .5em;
  width: 48vw; height: 90vh;
  border: 1px solid;
  background: white; color: #222;
  overflow: auto;
}
/* 好了，我开始写简历了 */
`,
  `/* 这个简历好像差点什么
 * 对了，这是 Markdown 格式的，我需要变成对 HR 更友好的格式
 * 简单，用开源工具翻译成 HTML 就行了
 */
`,
  `
/* 再对 HTML 加点样式 */
.resumeEditor{
  padding: 2em;
}
.resumeEditor h2{
  display: inline-block;
  border-bottom: 1px solid;
  margin: 1em 0 .5em;
}
.resumeEditor ul,.resumeEditor ol{
  list-style: none;
}
.resumeEditor ul> li::before{
  content: '•';
  margin-right: .5em;
}
.resumeEditor ol {
  counter-reset: section;
}
.resumeEditor ol li::before {
  counter-increment: section;
  content: counters(section, ".") " ";
  margin-right: .5em;
}
.resumeEditor blockquote {
  margin: 1em;
  padding: .5em;
  background: #ddd;
}
`
]
const resume = `靳凯博
----
前端工程师，现在在 [一路一居](http://www.pay365.com.cn/)做前端开发
技能
----
* 前端开发
工作经历
----
1. [一路一居](http://www.pay365.com.cn/)
2. 天津九安医疗电子股份有限公司(Android开发实习)
链接
----
* [GitHub](https://github.com/spinjkb)
`
var currentStyle = ''
var currentMarkdown = ''

console.log(resume)

class App extends Component {
  constructor(...prop) {
    super(...prop)
    this.state = {
      styleTextDom: '',
      resumeMarkdownDom: ''
    }
  }
  componentDidMount() {
    (async (that) => {
      await this.ShowStyle(0)
      await this.ShowResume()
      await this.ShowStyle(1)
      await this.ShowStyle(2)
    })(this)
  }
  ShowStyle(n) {
    return new Promise((resolve, reject) => {
      let interval = 40
      let showStyle = (async function () {
        let style = styleText[n]
        if (!style) { return }
        let length = styleText.filter((_, index) => index <= n).map((item) => item.length).reduce((p, c) => p + c, 0)
        let prefixLength = length - style.length
        if (currentStyle.length < length) {
          let l = currentStyle.length - prefixLength
          let char = style.substring(l, l + 1) || ' '
          currentStyle += char
          this.setState({ styleTextDom: Prism.highlight(currentStyle, Prism.languages.css) })
          this.refs.styleEditor.scrollTop = this.refs.styleEditor.scrollHeight
          setTimeout(showStyle, interval)
        } else {
          resolve()
        }
      }).bind(this)
      showStyle()
    })
  }
  ShowResume() {
    return new Promise((resolve, reject) => {
      let length = resume.length
      let interval = 50
      let showResumeMd = () => {
        if (currentMarkdown.length < length) {
          let i = currentMarkdown.length
          let char = resume.substring(i, i + 1) || ' '
          currentMarkdown += char
          const converter = new showdown.Converter()
          const markdownResume = converter.makeHtml(currentMarkdown)
          this.setState({ resumeMarkdownDom: markdownResume })
          this.refs.resumeEditor.scrollTop = this.refs.resumeEditor.scrollHeight
          setTimeout(showResumeMd, interval)
        } else {
          resolve()
        }
      }
      showResumeMd()
    })
  }
  render() {
    return (
      <div className="App" >
        <div ref='styleEditor' className='styleEditor'>
          <div dangerouslySetInnerHTML={{ __html: this.state.styleTextDom }}></div>
          <style dangerouslySetInnerHTML={{ __html: currentStyle }}></style>
        </div>
        <div ref='resumeEditor' className='resumeEditor'>
          <div dangerouslySetInnerHTML={{ __html: this.state.resumeMarkdownDom }}></div>
        </div>
      </div >
    );
  }
}

// <div dangerouslySetInnerHTML={{ __html: currentStyle }}></div>
// <style dangerouslySetInnerHTML={{ __html: this.state.DOMStyleText }}></style>
// <div> {this.state.styleText}</div>
export default App;
