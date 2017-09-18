import React, { Component } from 'react';
import Prism from 'prismjs'
import showdown from 'showdown'
import './App.css'

const styleText = [
  `/*
* Inspired by http://strml.net https://zhuanlan.zhihu.com/p/25202080 https://zhuanlan.zhihu.com/p/29134444
* 大家好，我是jkb
* 九月了，看到很多公司都在招聘，你们是不是都在准备简历。
* 那我也来写一份简历！
*/

/* 首先给所有元素加上过渡效果 */
* {
  transition: all 1s;
}
/* 我们来加点背景 */
html {
  color: rgb(222,222,222); 
  background: rgb(63,82,99);
}
/* 调整一下文字距离 */
.styleEditor {
  padding: .5em;
    border: 1px solid;
    margin: .5em;
    overflow: auto;
    background: rgb(48, 48, 48);
}
@media (min-width:500px){
  .styleEditor {
    width: 45vw; 
    height: 90vh;
  }
}
@media screen and (min-width: 320px) and (max-width: 480px) {
  .styleEditor{
    width: 100vw;
    height: 45vh;
  }
}
/* 代码逼格调一下 */
.token.selector{ color: rgb(133,153,0); }
.token.property{ color: rgb(187,137,0); }
.token.punctuation{ color: yellow; }
.token.function{ color: rgb(42,161,152); }

/* 加点特效 */
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
/* 边框竟然有马赛克
* emmmmmm.
* 改一改 
* 假装去掉了马赛克
*/
.styleEditor {
  box-shadow: 0px 0px 10px rgba(255,255,255,0.4);
}
/* 接下来准备一个编辑器 */
 .resumeEditor{
    white-space: normal;
    padding: .5em;  margin: .5em;
    border: 1px solid;
    background: white; color: #222;
    overflow: auto;
 }
@media(min-width: 500px) {
  .resumeEditor{
    position: fixed; right: 0; top: 0;
    width: 48vw; 
    height: 90vh;
  }
}

@media screen and (min-width: 320px) and (max-width: 480px) {
  .resumeEditor{
    position: fixed; left: 0; top: 50vh;
    padding: .5em;  margin: .5em;
    width: 90vw; 
    height: 45vh;
  }
}
/* 好了，我开始写简历了 */
`,
  `/* 这个简历好像还有点问题
 * emmmm..这是 Markdown 格式的，我需要变成对 HR 更友好的格式
 * 翻译一下
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
const resume = `个人信息
----
姓名：靳凯博<br>
性别：男<br>
学历：天津理工大学软件工程专业，本科2017届<br>
电话：18622464594 邮箱：jkbspin777@gmail.com<br>

技能
----
HTML、CSS、JavaScript、React、Webpack、Git

工作经历
----
1.北京东方瑞科信息技术有限公司（前端开发）<br>2017/7/1-至今<br>负责一路一居项目所有前端的工作。推动项目代码的前后端分离，分工更明确。用React重写了原来的项目，后端用PHP开发。<br>
2.天津九安医疗电子股份有限公司（Android开发实习）<br>2016/7/1-2016/11/1<br>Android开发实习，参与到成长日记app的开发中，负责宝宝模块的开发。

#项目经历
----
1.一路一居（预计10月中上线）<br>
pc端的租房网站，最初项目是使用的PHP开发，前端页面混乱复杂，我用React重写了前端的页面，并分离前后端，后端继续使用PHP写接口，项目部署在阿里云上。主要使用到的技术有React + Ant Design + PHP。<br>
2.一个React的简历（个人项目）<br>
知乎上看到的创意，用React实现了一遍，感觉很有意思。[预览](https://spinjkb.github.io/resume/build/index.html)

其他
----
希望能找到一份初级前端开发的工作（北京）

致谢
----
感谢您花时间阅读我的简历，期待能有机会和您共事。


* [GitHub](https://github.com/spinjkb)
* [代码地址](https://github.com/spinjkb/resume)
`
var currentStyle = ''
var currentMarkdown = ''
let speed = 10
let nowLength = 0
let allLength = 0

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
      let interval = speed
      for (let i = 0; i <= n; i++) {
        allLength += styleText[i].length 
      }
      let showStyle = (async function () {
        let style = styleText[n]
        if (!style) { return }
        //这次要插入的长度
        nowLength = allLength - style.length
        if (currentStyle.length < allLength) {
          let i = currentStyle.length - nowLength
          let char = style.substring(i, i + 1) || ' '
          currentStyle += char
          this.setState({ styleTextDom: Prism.highlight(currentStyle, Prism.languages.css) })
          this.refs.styleEditor.scrollTop = this.refs.styleEditor.scrollHeight
          setTimeout(showStyle, interval)
        } else {
          //重置一下长度
          allLength =0
          resolve()
        }
      }).bind(this)
      showStyle()
    })
  }
  ShowResume() {
    return new Promise((resolve, reject) => {
      let length = resume.length
      let interval = speed
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
export default App;
