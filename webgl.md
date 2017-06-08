# 技能测试

本测试在线地址: https://github.com/NStal/recruit-examination/blob/master/webgl.md

在线地址的内容, 可能会有更新, 更新主要是一些辅助的资料和额外的说明。

## 测试题目:
用WebGL实现一个载入一个图片, 并且实现反色效果。`rgb = 1 - rgb`

## 准备环境
* 下载 Chrome 浏览器
* [Fork](https://www.zhihu.com/question/20431718) 这个测试
* 安装NodeJs
* 通过NodeJs的npm模块，安装http-server
    * http-server是一个简单的静态文件服务器，可以快速的建立起一个本地的静态服务器来host接下来项目的代码
    * https://github.com/indexzero/http-server
        * `npm install -g http-server`
* 写一个由静态HTML和Javascript组成的页面，功能是实现一个WebGL特效,
    * 通过webgl的canvas绘画一张图片。
    * 利用原生的webgl(fragment shader)实现这张图片的反色效果。

## 基本要求
1. 不使用框架。
2. 能够显示一张图片。
3. 图片能够实现反色效果。
4. 学习使用Git/Github 并把这个测试完成的内容, 以Pull Request的形式发送给我们。

## 加分项
力所能及的挑选或者学习其中的项目:
* 使用TypeScript取代Javascript完成任务
* 效果改成[高斯模糊](https://zh.wikipedia.org/wiki/%E9%AB%98%E6%96%AF%E6%A8%A1%E7%B3%8A)
* 在Linux或者OSX下完成上述任务, 用Bash实现相关的编译需求。
* *尽可能的满足上面的要求，但也可以有自己的选择。*

## 其他资料
* Typescript
    * https://www.typescriptlang.org/
    * http://tslang.cn/
    * https://zhongsp.gitbooks.io/typescript-handbook/content/index.html
* Google/Stackoverflow/MDN
* webgl
    * http://learningwebgl.com/blog/?page_id=1217
    * https://webglfundamentals.org/webgl/lessons/webgl-image-processing.html

## 提交
学习使用Git/Github 并且给把这个测试完成的内容, 以Pull Request得形式发送给我们。
或者将你的作品打包提交到[hr@fusroda.io](mailto:hr@fusroda.io)，标题为:`[技能测试]姓名-电话`。
或者提供给我们在线的访问地址。

邮件的内容可以包括你做了那些东西，学了哪些新的东西，如果对我们的测试难易度或者形式有什么意见和建议也请帮助我们改进它 ：）

## 祝你顺利
如果有问题可以发邮件到[dev@fusroda.io](mailto:hr@fusroda.io)询问

* 注1：只需要支持Chrome浏览器。
* 注2：最好能在2~5天内完成。
* 注3：尽力而为 
* 注4：也许可以[从这里开始](http://learningwebgl.com/blog/?page_id=1217)


