// 引入fs模块，读取和写入文件
var fs = require('fs');

// path  生产相对或者绝对路径
var path = require('path');

// crypto 计算文件的sha1值
var crypto = require('crypto');
function toHash(file) {
    var hash = crypto.createHash('sha1');
    hash.update(file);
    return hash.digest('hex');
}

// 在数组原型上定义contains方法。判断是否在数组中
Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        var reg = new RegExp(this[i]);
        if (reg.test(obj)) {
            return true;
        }
    }
    return false;
}

// 定义函数getAllFiles来获取当前文件夹下面的所有文件
var getAllFiles = function (filePath, cb) {
    // filesArr 获取到的文件信息列表
    var fileArr = [];

    // dieArr 存放忽略的文件和文件夹
    var str = fs.readFileSync('.diefile', 'utf-8');
    var dieArr = [].concat(['.diefile'], str.split('\r\n'));
    dieArr = dieArr.filter(function(item){
        return item !== '';
    });

    filePath = /\/$/.test(filePath) ? filePath : filePath + '/';
    (function dir(dirpath, fn) {
        var files = fs.readdirSync(dirpath);

        async(files, function (item, next) {
            // flag为true表示在数组中，需要跳过这一项
            var flag = dieArr.contains(item);
            //当前文件的信息
            var info = fs.statSync(dirpath + item);

            if (!flag) {
                if (info.isDirectory()) {
                    dir(dirpath + item + '/', function () {
                        next();
                    });
                } else {
                    var _file = fs.readFileSync(dirpath + item);
                    var obj = {
                        item: item,
                        size: info.size,
                        sha: toHash(_file)
                    };
                    fileArr.push(obj);
                    cb && cb(dirpath + item);
                    next();
                }
            } else {
                next();
            }

        }, function (err) {
            !err && fn && fn();
        });
    })(filePath);
    return fileArr;
};

function showFiles(filePath){
    var arr = getAllFiles(filePath)
    writeAllFiles(arr);
}

//定义函数writeAllFiles把获取的文件列表写入一个文件files.txt
function writeAllFiles(filesArr) {
    if (!filesArr) {
        return;
    }
    var str = '';
    filesArr.forEach(function (item, index) {
        str += item.item + ',  ' + item.size + ',  ' + item.sha + '\n';
    });
    fs.writeFileSync('./files.txt', str);
}

/**
 * async函数，让循环一步一步走
 * @param arr 遍历的数组
 * @param cb1 接收两个参数，一个当前数据data，一个是函数next
 * @param cb2 处理错误函数
 */
function async(arr, cb1, cb2) {
    if (Object.prototype.toString.call(arr) !== '[object Array]') {
        return cb2 && cb2(new Error('第一个参数必须是数组'));
    }

    if (arr.length === 0) {
        return cb2 && cb2(null);
    }

    (function walk(i) {
        if (i >= arr.length) {
            return cb2 && cb2(null);
        }

        cb1(arr[i], function () {
            walk(++i);
        })
    })(0)
}

module.exports = showFiles;