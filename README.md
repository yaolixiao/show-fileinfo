## show-fileinfo使用说明

- 安装
```
npm install show-fileinfo
```
- 配置（必选）
```
创建 .diefile 文件，用来忽略指定的文件或者文件夹，把想要忽略的文件或者文件夹列在文件中，格式一行一个
```
- 引入
```
var showFileinfo = require('show-fileinfo')
//接收一个参数path，path是需要遍历的目录的绝对路径，会生成一个files.txt存放该目录下所有的文件，格式是：文件名，大小，sha1值
showFileinfo(path)
```