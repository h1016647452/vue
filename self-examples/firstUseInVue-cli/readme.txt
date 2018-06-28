使用vue-cli命令行工具直接安装/构建vue应用
1,，安装vue-cli命令行工具
# 全局安装 vue-cli工具
$ npm install --global vue-cli

2，用vue-cli工具创建一个基于 webpack 模板的新项目
执行该命令时，会直接创建一个对应的工程文件夹
$ vue init webpack my-project //执行该命令需要配置一些信息，如下：
===================================================================
$vue init webpack firstUseInNpm
? Project name firstuseinnpm
? Project description A Vue.js project
? Author h1016647452 <1016647452@qq.com>
? Vue build (Use arrow keys)
? Vue build standalone
? Install vue-router? Yes
? Use ESLint to lint your code? Yes
? Pick an ESLint preset Standard
? Set up unit tests Yes
? Pick a test runner jest
? Setup e2e tests with Nightwatch? Yes
? Should we run `npm install` for you after the project has been created? (recommended) (Use arrow key? Should we run `npm install` for you after the project has been created? (recommended) npm
==========================================================================
执行完命令后，会自动生成vue应用的目录结构，详细结构参看readme/vueDirectoryImage

3，进入项目，安装并运行：
$ cd my-project
$ cnpm install // 这一步可以省略
$ cnpm run dev
 DONE  Compiled successfully in 4388ms
 Your application is running here: http://localhost:8080


注意：工程文件中的node-module文件夹删掉了，直接使用本地的复制过来就好