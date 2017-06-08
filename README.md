# 技能测试

本测试在线地址: https://github.com/NStal/recruit-examination

在线地址的内容, 可能会有更新, 更新主要是一些辅助的资料和额外的说明。

## 测试题目:
实现一个在线的TodoList（代办事项工具）

## 准备环境
* 下载 Chrome 浏览器
* [Fork](https://www.zhihu.com/question/20431718) 这个测试
* 安装NodeJs
* 通过NodeJs的npm模块，安装http-server
    * http-server是一个简单的静态文件服务器，可以快速的建立起一个本地的静态服务器来host接下来项目的代码
    * https://github.com/indexzero/http-server
        * `npm install -g http-server`
* 写一个由静态HTML和Javascript组成的页面，功能是实现一个TodoList, 
    * 参考 http://todomvc.com/examples/typescript-react/
    * 语言/框架/不做具体要求

## 基本要求
1. 能创建新的Todo, 能输入内容
2. 能勾选(标记为完成)，或取消勾选Todo
3. 能删除已完成和未完成的Todo。
4. 学习使用Git/Github 并把这个测试完成的内容, 以Pull Request的形式发送给我们。

## 加分项
力所能及的挑选或者学习其中的项目:
* 下次进来能看到上次的Todo(即能保存)
    * 数据可以存储在前台使用`localStorage`或者`indexedDb`
* 使用TypeScript取代Javascript完成任务
* 使用Less或类似的CSS预处理语言取代CSS
* 用gulp/webpack/browserify构建你的编译流程。
* 不借助任何前端框架或者，前端框架使用React或者Vue或者Backbone，尽可能不使用jQuery。
* 功能尽可能的完善，页面尽可能的美观
    * 支持实时搜索
    * 支持鼠标跟随/拖拽对列表进行排序
    * 支持添加优先级/标签/提醒
    * 支持根据首字母/添加的时间或者优先级排序
    * 其他你觉得合适的功能
* 通过Nodejs或者其他你喜欢的语言实现后台，并且将数据存储在后台数据库中
* 如果有Ajax的部分请使用原生Javascript的XMLHttpRequest/WebSocket/FetchAPI中的一个实现
* 静态内容发布到[CDN](https://www.zhihu.com/question/36514327)，CDN可以使用[七牛](http://www.qiniu.com/)的免费CDN
* 动态内容发布到你自己的服务器上并且外网可以访问，端口为19233，可以使用美团或者阿里的云。
* 在Linux或者OSX下完成上述任务, 用Bash实现相关的编译需求。
* 实践[PWA(Progressive Web Apps)](https://developers.google.com/web/progressive-web-apps/)
* 如果这一切都太简单了, 请把项目的要求从TodoList改成MindMap
* *尽可能的满足上面的要求，但也可以有自己的选择。*

## 其他资料
* 相关API
    * LocalStorage
        * https://developer.mozilla.org/zh-CN/docs/Web/API/Window/localStorage
    * indexedDb
        * https://developer.mozilla.org/zh-CN/docs/Web/API/IDBEnvironment/indexedDB
* Typescript
    * https://www.typescriptlang.org/
    * http://tslang.cn/
    * https://zhongsp.gitbooks.io/typescript-handbook/content/index.html
* TodoMVC
    * [http://todomvc.com/](http://todomvc.com/)
* Google/Stackoverflow/MDN
* Lesscss
    * http://lesscss.org/
* CDN
    * [七牛](http://www.qiniu.com/)/[免费体验](https://portal.qiniu.com/signin)
* nodejs
    * https://nodejs.org/zh-cn/

## 提交
学习使用Git/Github 并且给把这个测试完成的内容, 以Pull Request得形式发送给我们。
或者将你的作品打包提交到[hr@fusroda.io](mailto:hr@fusroda.io)，标题为:`[技能测试]姓名-电话`。
或者提供给我们在线的访问地址。

邮件的内容可以包括你做了那些东西，学了哪些新的东西，如果对我们的测试难易度或者形式有什么意见和建议也请帮助我们改进它 ：）

## 祝你顺利
如果有问题可以发邮件到[dev@fusroda.io](mailto:hr@fusroda.io)询问

* 注1：不需要实现用户系统，只需要支持Chrome浏览器。
* 注2：最好能在2~5天内完成。
* 注3：做不完没关系, 因为一般都做不完，尽力而为 
* 注4：也许可以从这里开始 : [http://todomvc.com/](http://todomvc.com/)

