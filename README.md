# demos
- [loading](https://rookieking.github.io/demos/loading)
- [ios7](https://rookieking.github.io/demos/ios7)
- [flower](https://rookieking.github.io/demos/flower)
- [fireworks](https://rookieking.github.io/demos/fireworks)

# code snippet

- 使用闭包与自执行函数生成最佳的获取 `xhr` 对象的方法

``` javascript
var createXhr = (function () {
    var i = 0,
        undefinedXHR = typeof XMLHttpRequest === 'undefined',
        progIds = [
            'Msxml2.XMLHTTP',
            'Microsoft.XMLHTTP',
            'Msxml2.XMLHTTP.4.0'
            //and more
        ];
    if (undefinedXHR) {
        for (; i < progIds.length; i++) {
            try {
                new ActiveXObject(progIds[i]);
            } catch (e) {
                continue;
            }
            break;
        }
    }
    return undefinedXHR
        ? function () {
            return new ActiveXObject(progIds[i]);
        }
        : function () {
            return new XMLHttpRequest();
        };
})();
```
- urlParse

``` javascript
function urlParse(url) {
    var match = /^(https?:)?\/\/((?:[^=\s:?/]+\.)+[^=\s:?/]+)(:\d+)?(\/(?:[^=\s?#]+?(?=[/?#]|$))*)?(\?[^#]*)?(#.*)?$/.exec(url);
    /*
        /^
        (https?:)?\/\/                          //protocol
        ((?:[^=\s:?/]+\.)+[^=\s:?/]+)           //host
        (:\d+)?                                 //port
        (\/(?:[^=\s?#]+?(?=[/?#]|$))*)?         //pathname
        (\?[^#]*)?                              //search
        (#.*)?                                  //hash
        $/
    */
    return match ? {
        protocol: match[1],
        host: match[2],
        port: match[3],
        pathname: match[4],
        search: match[5] === '?' ? '' : match[5],
        hash: match[6] === '#' ? '' : match[6],
        origin: match[1] + '//' + match[2]
    } : null;
}
```

# License
```
MIT License

Copyright (c) 2016 王磊 <rookielei@gameil.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```