(function (UNDEFINED) {
    "use strict";
    //#region var
    var globalScope = typeof global !== "undefined" ? global : window,  //browser or nodejs

        IS_ARRAY = "isArray",
        IS_OBJECT = "isObject",
        FALSE = !1,
        TRUE = !0,
        PROTO = "prototype",
        CALL = "call",
        APPLY = "apply",
        LEN = "length",

        arrayProto = [],
        stringProto = String[PROTO],
        regExpProto = RegExp[PROTO],
        shortFun = Function,

        applyPush = uncurryApply(arrayProto.push),
        applyConcat = uncurryApply(arrayProto.concat),
        callSlice = uncurryCall(arrayProto.slice),
        callExec = uncurryCall(regExpProto.exec),
        callToString = uncurryCall({}.toString),

        type = ["RegExp", "Function", "Array", "Object", "String", "Number", "Date"];
    //#endregion

    for (var index in type) {
        !function (type) {
            globalScope["is" + type] = function (obj) {
                return callToString(obj) === formatString("[object {0}]", type);
            }
        }(type[index]);
    }

    function likeObj(obj) {
        return typeof obj === "object";
    }

    function uncurryCall(fn) {
        return function () {
            return shortFun[CALL][APPLY](fn, arguments);
        };
    }

    function uncurryApply(fn) {
        return function () {
            return shortFun[APPLY][APPLY](fn, arguments);
        };
    }

    function getFirstDefined() {
        for (var i = 0,
                length = arguments[LEN] - 1; i < length; i++) {
            if (arguments[i] !== UNDEFINED) return arguments[i];
        }
        return arguments[length];
    }

    function each(obj, iterator, context) {
        if (globalScope[IS_ARRAY](obj)) {
            for (var i = 0, l = obj[LEN]; i < l && iterator[CALL](context, obj[i], i) !== TRUE; i++) { }
        } else {
            for (var key in obj) {
                if (iterator[CALL](context, obj[key], key) === TRUE) return;
            }
        }
    }

    function keys(obj) {
        var arr = [];
        each(obj, function (v, key) {
            arr.push(key);
        });
        return arr;
    }

    function any(obj, predicate, context) {
        var flag = FALSE;
        each(obj, function (v) {
            return flag = predicate[CALL](context, v);
        });
        return flag;
    }

    function extend(obj) {
        each(callSlice(arguments, 1), function (arg) {
            for (var key in arg) {
                obj[key] = arg[key];
            }
        });
        return obj;
    }

    function defaults(obj) {
        each(callSlice(arguments, 1), function (arg) {
            for (var key in arg) {
                obj[key] = getFirstDefined(obj[key], arg[key]);
            }
        });
        return obj;
    }

    function map(obj, iterator, context) {
        var ret = globalScope[IS_ARRAY](obj) ? [] : {};
        each(obj, function (val, key) {
            ret[key] = iterator[CALL](context, val, key, obj);
        });
        return ret;
    }

    function clone(obj) {
        var ret;
        if (globalScope[IS_ARRAY](obj)) {
            ret = [];
        } else if (globalScope[IS_OBJECT](obj)) {
            ret = {};
        } else {
            return obj;
        }
        for (var key in obj) {
            if (likeObj(obj[key])) {
                ret[key] = clone(obj[key]);
            } else {
                ret[key] = obj[key];
            }
        }
        return ret;
    }

    function formatString(str, arg) {
        var isNotObj = typeof arg !== "object";
        if (isNotObj) arg = callSlice(arguments, 1);
        return str.replace(isNotObj ? /{(\d+)}/g : /{(.+?)}/g, function ($, $1) {
            return getFirstDefined(arg[$1], $);
        });
    }

    function formatNumber(number, len, fill) {
        for (var ret = "",
                 len = getFirstDefined(len, 2),
                 fill = getFirstDefined(fill, "0"),
                 i = len; i--; ret += fill) { }
        return (ret + number).slice(-len);
    }

    function formatDate(date, str) {
        var hour = date.getHours(),
            millisecond = date.getMilliseconds(),
            longDate = {
                MM: date.getMonth() + 1,
                dd: date.getDate(),
                HH: hour,
                hh: hour % 12 || 12,
                mm: date.getMinutes(),
                ss: date.getSeconds()
            };
        return format((str || "yyyy-MM-dd").replace(/(yyyy|MM|M|dd|d|HH|H|hh|h|tt|t|mm|m|ss|s|fff|f)/g, "{$1}"), extend({
            yyyy: date.getFullYear(),
            M: longDate.MM,
            H: hour,
            d: longDate.dd,
            h: longDate.hh,
            m: longDate.mm,
            s: longDate.ss,
            f: millisecond,
            fff: format(millisecond, 3),
            tt: hour < 12 ? "AM" : "PM"
        }, map(longDate, function (val) {
            return format(val);
        })));
    }

    //Router
    function format(obj) {
        var args = callSlice(arguments),
            result;
        if (isString(obj)) {
            result = formatString[APPLY](null, args);
        } else if (isNumber(obj)) {
            result = formatNumber[APPLY](null, args);
        } else if (isDate(obj)) {
            result = formatDate[APPLY](null, args);
        }
        return result;
    }

    function formatMoney(str, len, separator) {
        if (isString(len)) {
            separator = len;
            len = 3;
        }
        return str.toString().replace(/([^.]+)/, function (x, l) {
            return l.reverse().replace(new RegExp(format("\\d{{0}}(?=\\d)", len || 3), "g"), function (n) {
                return n + (separator || ",");
            }).reverse();
        });
    }

    //extend
    extend(globalScope, {
        formatString: formatString,
        formatNumber: formatNumber,
        formatDate: formatDate
    });
    each(type.slice(-3), function (val, key) {
        globalScope[val][PROTO].format = function () {
            return globalScope["format" + val][APPLY](null, applyConcat([this], arguments));
        };
    });
    stringProto.reverse = function () {
        return this.split("").reverse().join("");
    };
    stringProto.formatMoney = function () {
        return formatMoney[APPLY](null, applyConcat([this], arguments));
    };
    regExpProto.run = function (str, iterator) {
        if (!this.global) throw new Error("dead loop");
        for (var match = UNDEFINED || (this.i = -1) ; (this.i++, match = callExec(this, str)) && iterator[APPLY](this, match.concat(this.lastIndex)) !== TRUE;) { }
        //var match;
        //while (true) {
        //    match = callExec(this, str);
        //    if (match == null || iterator[APPLY](this, match.concat(this.lastIndex)) === true) return;
        //}
    };
    regExpProto.exec = function (str, iterator) {
        if (typeof iterator !== "function") {
            return callExec(this, str);
        } else {
            if (!this.global) throw new Error("loop err");
            for (var match; (match = callExec(this, str)) && iterator[CALL](this, match, this) !== TRUE;) { }
        }
    };
    extend(globalScope, {
        likeObj: likeObj,
        getFirstDefined: getFirstDefined,
        each: each,
        eachAsync: function (arr, iterator, callback, context) {
            for (var i = 0, sum = 0, l = arr[LEN]; i < l && iterator[CALL](context, function () {
                if (++sum == l) { callback(); }
            }, arr[i], i) !== TRUE; i++) { }
        },
        eachSync: function (arr) {
            arr[LEN] && (function _(i, arr, iterator, callback, context) {
                var arg = arguments;
                iterator[CALL](context, function () {
                    if (arr[LEN] === ++arg[0]) {
                        callback();
                    } else {
                        _[APPLY](UNDEFINED, arg);
                    }
                }, arr[i], i);
            })[APPLY](UNDEFINED, [0].concat(callSlice(arguments)));
        },
        keys: keys,
        any: any,
        uniq: function (arr) {
            var ret = [];
            each(arr, function (v) {
                if (!any(ret, function (val) {
                    return val === v;
                })) {
                    ret.push(v);
                }
            });
            return ret;
        },
        extend: extend,
        defaults: defaults,
        map: map,
        clone: clone,
        format: format,
        range: function (min, max) {
            min > max && (min ^= max, max ^= min, min ^= max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        isMoney: function (str) {
            return isNumber(str) || /^-?(?:\d+(\.(\d+))?|\.\d+)$/.test(str);
        },
        asMoney: function (obj, key) {
            obj[key] = parseFloat(obj[key]);
            return TRUE;
        },
        toMoney: function (str) {
            return parseFloat(parseFloat(str).toFixed(2));
        },
        absLength: function (str) {
            var sum = str[LEN];
            /[^\x00-\xff]/g.run(str, function () {
                sum++;
            });
            return sum;
        },
        formatMoney: formatMoney,
        curry: function (fn, context) {
            var args = [],
                _curry = function () {
                    if (!arguments.length) {
                        return fn[APPLY](context || null, args);
                    } else {
                        applyPush(args, arguments);
                        return _curry;
                    }
                };
            return _curry;
        },
        uncurryCall: uncurryCall,
        uncurryApply: uncurryApply,
        //fn的返回值将发送到callback
        processor: function (fn, callback, milliseconds) {
            if (!isFunction(callback)) {
                milliseconds = callback;
            }
            var timeoutId = null;
            var process = function () {
                clearTimeout(timeoutId);
                var args = arguments;
                var self = this;
                timeoutId = setTimeout(function () {
                    isFunction(callback)
                        ? callback(fn[APPLY](self, args))
                        : fn[APPLY](self, args);
                }, milliseconds || 400);
            }
            return function () {
                process[APPLY](this, arguments);
            };
        },
        get: function (obj, str) {
            var ret = obj;
            if (likeObj(obj)) {
                /([^.]+)/g.run(str, function (match, item) {
                    if (likeObj(ret) && item in ret) {
                        ret = ret[item];
                    } else {
                        ret = null;
                        return TRUE;
                    }
                });
            }
            return ret === obj ? null : ret;
        },
        set: function (obj, str, val) {
            //set(window, "aa.bb.cc", "dd")
            var ret;
            if (likeObj(obj)) {
                /([^.]+)(?=\.([^.]+)|$)/g.run(str, function (match, child, grandson) {
                    if (grandson) {
                        if (!likeObj(obj[child])) {
                            obj[child] = {};
                        }
                        obj = obj[child];
                    } else {
                        ret = obj[child] = val;
                    }
                });
                return ret;
            } else {
                throw new Error(obj + " is not Object");
            }
        }
    });
})();
