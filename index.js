// ����fsģ�飬��ȡ��д���ļ�
var fs = require('fs');

// path  ������Ի��߾���·��
var path = require('path');

// crypto �����ļ���sha1ֵ
var crypto = require('crypto');
function toHash(file) {
    var hash = crypto.createHash('sha1');
    hash.update(file);
    return hash.digest('hex');
}

// ������ԭ���϶���contains�������ж��Ƿ���������
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

// ���庯��getAllFiles����ȡ��ǰ�ļ�������������ļ�
var getAllFiles = function (filePath, cb) {
    // filesArr ��ȡ�����ļ���Ϣ�б�
    var fileArr = [];

    // dieArr ��ź��Ե��ļ����ļ���
    var str = fs.readFileSync('.diefile', 'utf-8');
    var dieArr = [].concat(['.diefile'], str.split('\r\n'));
    dieArr = dieArr.filter(function(item){
        return item !== '';
    });

    filePath = /\/$/.test(filePath) ? filePath : filePath + '/';
    (function dir(dirpath, fn) {
        var files = fs.readdirSync(dirpath);

        async(files, function (item, next) {
            // flagΪtrue��ʾ�������У���Ҫ������һ��
            var flag = dieArr.contains(item);
            //��ǰ�ļ�����Ϣ
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

//���庯��writeAllFiles�ѻ�ȡ���ļ��б�д��һ���ļ�files.txt
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
 * async��������ѭ��һ��һ����
 * @param arr ����������
 * @param cb1 ��������������һ����ǰ����data��һ���Ǻ���next
 * @param cb2 ���������
 */
function async(arr, cb1, cb2) {
    if (Object.prototype.toString.call(arr) !== '[object Array]') {
        return cb2 && cb2(new Error('��һ����������������'));
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