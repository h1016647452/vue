该例子说明使用npm安装vue，构建vue最基础的应用,在用 Vue.js 构建大型应用时推荐使用 NPM 安装

一，进入到工程目录下，执行npm install vue
===================================================
firstUseInNpm>npm install vue
npm WARN saveError ENOENT: no such file or directory, open 'E:\source-code-analysis\vue.js\self-examples\firstUseInNpm\package.json'
npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN enoent ENOENT: no such file or directory, open 'E:\source-code-analysis\vue.js\self-examples\firstUseInNpm\package.json'
npm WARN firstUseInNpm No description
npm WARN firstUseInNpm No repository field.
npm WARN firstUseInNpm No README data
npm WARN firstUseInNpm No license field.

+ vue@2.5.16
added 1 package in 2.956s
===================================================
说明：
1，可以看到生成了node_modules文件夹，里边包含了vue的包
2，工程下自动生成了package-lock.json文件

之后如何处理呢？？

注意：工程文件中的node-module文件夹删掉了，直接使用本地的复制过来就好
