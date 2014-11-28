/*!
 * typeahead.js 0.10.5
 * https://github.com/twitter/typeahead.js
 * Copyright 2013-2014 Twitter, Inc. and other contributors; Licensed MIT
 */

 !function(n,t,i){var u=function(u,f){var e,o;if(this.element=n(u),this.autoHide=!0&&f.autoHide!==!1&&this.element.data("datepicker-autohide")!==!1,this.format=f.format||this.element.data("datepicker-format")||t.langData().longDateFormat("L"),this.calendarPlacement=f.calendarPlacement||this.element.data("datepicker-calendarplacement")||"right",this.picker=n(r.template).appendTo(f.container).on({click:n.proxy(this.click,this),mousedown:n.proxy(this.mousedown,this)}),e=f.startDate||this.element.data("datepicker-startdate")||i,this.startDate=e?r.parseDate(e,this.format):i,o=f.endDate||this.element.data("datepicker-enddate")||i,this.endDate=o?r.parseDate(o,this.format):i,this.isInput=this.element.is("input"),this.component=!this.isInput&&this.element.is(".date")?this.element.find(".add-on"):!1,this.isInput)this.element.on({focus:n.proxy(this.show,this),blur:n.proxy(function(){this.hide(),this.triggerChangeDate()},this),input:n.proxy(function(){this.updateFromValue(!0)},this),keyup:n.proxy(function(n){n.keyCode==13&&this.updateFromValue()},this),click:n.proxy(this.show,this)});else if(this.component)this.component.on("click",n.proxy(this.show,this));else this.element.on("click",n.proxy(this.show,this));if(this.minViewMode=f.minViewMode||this.element.data("datepicker-minviewmode")||0,typeof this.minViewMode=="string")switch(this.minViewMode){case"months":this.minViewMode=1;break;case"years":this.minViewMode=2;break;default:this.minViewMode=0}if(this.viewMode=f.viewMode||this.element.data("datepicker-viewmode")||0,typeof this.viewMode=="string")switch(this.viewMode){case"months":this.viewMode=1;break;case"years":this.viewMode=2;break;default:this.viewMode=0}this.startViewMode=this.viewMode,this.weekStart=f.weekStart||this.element.data("datepicker-weekstart")||0,this.weekEnd=this.weekStart===0?6:this.weekStart-1,this.fillDow(),this.fillMonths(),this.setCustomClasses(),this.updateFromValue(),this.showMode(),this.refresh()},r;u.prototype={constructor:u,get:function(){return this.moment&&this.moment.clone()},getAsText:function(n){return this.moment&&this.moment.format(n||this.format)||""},show:function(t){if((!this.isInput||!this.element.is(":disabled"))&&!this.element.children("input").is(":disabled")){this.picker.show(),this.height=this.component&&this.component.outerHeight()||this.element.outerHeight(),this.place();n(window).on("resize",n.proxy(this.place,this));if(t&&(t.stopPropagation(),t.preventDefault()),!this.isInput)n(document).on("mousedown",n.proxy(this.hide,this));this.element.trigger({type:"show"})}},hide:function(){this.picker.hide(),n(window).off("resize",this.place),this.viewMode=this.startViewMode,this.showMode(),this.isInput||n(document).off("mousedown",this.hide),this.refresh(),this.element.trigger({type:"hide"})},refresh:function(){var n=this.getAsText();this.isInput?this.element.prop("value",n).change():(this.component&&this.element.find("input").prop("value",n).change(),this.element.data("date",n).change())},set:function(n,t){this.update(n,t),this.refresh()},place:function(){var t=this.component?this.component:this.element,n=t.offset();this.calendarPlacement=="left"?this.picker.css({top:n.top+this.height,left:n.left+t[0].offsetWidth-this.picker[0].offsetWidth}):this.picker.css({top:n.top+this.height,left:n.left})},lastValue:null,triggerChangeDate:function(){var n=this.moment?this.moment.valueOf():null;n!=this.lastValue&&(this.lastValue=n,this.element.trigger({type:"changeDate"})),this.autoHide&&this.hide()},updateFromValue:function(n){this.update(this.isInput?this.element.prop("value"):this.element.data("date"),n)},update:function(n,i){var f=this.moment?this.moment.valueOf():null,u;this.moment=r.parseDate(n,this.format),u=this.moment?this.moment.valueOf():null,this.viewDate&&f==u||(this.viewDate=this.get()||t().hours(0).minutes(0).seconds(0).milliseconds(0),this.fill(),this.element.trigger({type:"changeDateInstant"})),i||this.triggerChangeDate()},fillDow:function(){for(var r=this.weekStart,i="<tr>",u=n.proxy(t.langData().weekdaysMin,t.langData());r<this.weekStart+7;)i+='<th class="dow">'+u(t().day(r++%7))+"<\/th>";i+="<\/tr>",this.picker.find(".datepicker-days thead").append(i)},fillMonths:function(){for(var i="",r=0,u=n.proxy(t.langData().monthsShort,t.langData());r<12;)i+='<span class="month">'+u(t().startOf("month").month(r++))+"<\/span>";this.picker.find(".datepicker-months td").append(i)},fill:function(){var n=this.viewDate.year(),o=this.viewDate.month(),r=this.get(),l=r?r.valueOf():null,s=r?r.year():null,a=r?r.month():null,i,h,u,f,c,e;for(this.picker.find(".datepicker-days th:eq(1)").text(t.langData().months(t().month(o))+" "+n),i=t([n,o,0]),i.day(i.day()-(i.day()-this.weekStart+7)%7),h=t(i).add("days",42).valueOf(),html=[];i.valueOf()<h;)i.day()===this.weekStart&&html.push("<tr>"),u="",i.year()<n||i.year()==n&&i.month()<o?u+=" old":(i.year()>n||i.year()==n&&i.month()>o)&&(u+=" new"),i.valueOf()===l&&(u+=" active"),(i.valueOf()<this.startDate||i.valueOf()>this.endDate)&&(u+=" disabled"),html.push('<td class="day'+u+'">'+i.date()+"<\/td>"),i.day()===this.weekEnd&&html.push("<\/tr>"),i.add("days",1);for(this.picker.find(".datepicker-days tbody").empty().append(html.join("")),f=this.picker.find(".datepicker-months").find("th:eq(1)").text(n).end().find("span").removeClass("active").removeClass("disabled"),s===n&&f.eq(a).addClass("active"),(this.startDate&&n<this.startDate.year()||this.endDate&&n>this.endDate.year())&&f.addClass("disabled"),this.startDate&&n==this.startDate.year()&&f.slice(0,this.startDate.month()).addClass("disabled"),this.endDate&&n==this.endDate.year()&&f.slice(this.endDate.month()+1).addClass("disabled"),html="",n=parseInt(n/10,10)*10,c=this.picker.find(".datepicker-years").find("th:eq(1)").text(n+"-"+(n+9)).end().find("td"),n-=1,e=-1;e<11;e++)html+='<span class="year'+(e===-1||e===10?" old":"")+(s===n?" active":"")+(this.startDate&&n<this.startDate.year()||this.endDate&&n>this.endDate.year()?" disabled":"")+'">'+n+"<\/span>",n+=1;c.html(html)},click:function(i){var u,o,s,h,e,c,f;if(i.stopPropagation(),i.preventDefault(),u=n(i.target).closest("span, td, th"),u.length===1)switch(u[0].nodeName.toLowerCase()){case"th":switch(u[0].className){case"switch":this.showMode(1);break;case"prev":case"next":o=r.modes[this.viewMode],this.viewDate.add(o.navFnc,o.navStep*(u[0].className==="prev"?-1:1)),this.fill(),this.refresh()}break;case"span":u.is(".disabled")||(u.is(".month")?(s=u.parent().find("span").index(u),this.viewDate.add("months",s-this.viewDate.month())):(f=parseInt(u.text(),10)||0,this.viewDate.year(f)),this.viewMode!==this.minViewMode?(this.showMode(-1),this.set(this.viewDate,!0)):this.set(this.viewDate));break;case"td":u.is(".disabled")||u.is(".day")&&(h=parseInt(u.text(),10)||1,e=this.viewDate.clone(),u.is(".old")?e.startOf("month").add("days",-1):u.is(".new")&&e.endOf("month").add("days",1),c=e.month(),f=e.year(),this.set(t([f,c,h])))}},dateWithinRange:function(n){return n>=this.startDate&&n<=this.endDate},mousedown:function(n){n.stopPropagation(),n.preventDefault()},showMode:function(n){n&&(this.viewMode=Math.max(this.minViewMode,Math.min(2,this.viewMode+n))),this.picker.find(">div").hide().filter(".datepicker-"+r.modes[this.viewMode].clsName).show()},setCustomClasses:function(){this.calendarPlacement=="left"&&this.picker.addClass("datepicker-left")}},n.fn.datepicker=function(t,i){var r=[],f=this.each(function(){var o=n(this),f=o.data("datepicker"),s=typeof t=="object"&&t,e;typeof t=="string"?f&&(e=f[t](i),typeof e!="undefined"&&r.push(e)):f||o.data("datepicker",f=new u(this,n.extend({},n.fn.datepicker.defaults,s)))});return r.length==1?r[0]:r.length?r:f},n.fn.datepicker.defaults={container:"body"},n.fn.datepicker.Constructor=u,r={modes:[{clsName:"days",navFnc:"months",navStep:1},{clsName:"months",navFnc:"years",navStep:1},{clsName:"years",navFnc:"years",navStep:10}],parseDate:function(n,i){var r=null;return(typeof n=="string"&&(r=t(n,i)),r&&r.isValid()||(r=t(n)),!r||!r.isValid())?null:r.hours(0).minutes(0).seconds(0).milliseconds(0)},headTemplate:'<thead><tr><th class="prev">&lsaquo;<\/th><th colspan="5" class="switch"><\/th><th class="next">&rsaquo;<\/th><\/tr><\/thead>',contTemplate:'<tbody><tr><td colspan="7"><\/td><\/tr><\/tbody>'},r.template='<div class="datepicker dropdown-menu"><div class="datepicker-days"><table class=" table-condensed">'+r.headTemplate+'<tbody><\/tbody><\/table><\/div><div class="datepicker-months"><table class="table-condensed">'+r.headTemplate+r.contTemplate+'<\/table><\/div><div class="datepicker-years"><table class="table-condensed">'+r.headTemplate+r.contTemplate+"<\/table><\/div><\/div>"}(this.jQuery,this.moment);


(function($) {
    var _ = function() {
        "use strict";
        return {
            isMsie: function() {
                return /(msie|trident)/i.test(navigator.userAgent) ? navigator.userAgent.match(/(msie |rv:)(\d+(.\d+)?)/i)[2] : false;
            },
            isBlankString: function(str) {
                return !str || /^\s*$/.test(str);
            },
            escapeRegExChars: function(str) {
                return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
            },
            isString: function(obj) {
                return typeof obj === "string";
            },
            isNumber: function(obj) {
                return typeof obj === "number";
            },
            isArray: $.isArray,
            isFunction: $.isFunction,
            isObject: $.isPlainObject,
            isUndefined: function(obj) {
                return typeof obj === "undefined";
            },
            toStr: function toStr(s) {
                return _.isUndefined(s) || s === null ? "" : s + "";
            },
            bind: $.proxy,
            each: function(collection, cb) {
                $.each(collection, reverseArgs);
                function reverseArgs(index, value) {
                    return cb(value, index);
                }
            },
            map: $.map,
            filter: $.grep,
            every: function(obj, test) {
                var result = true;
                if (!obj) {
                    return result;
                }
                $.each(obj, function(key, val) {
                    if (!(result = test.call(null, val, key, obj))) {
                        return false;
                    }
                });
                return !!result;
            },
            some: function(obj, test) {
                var result = false;
                if (!obj) {
                    return result;
                }
                $.each(obj, function(key, val) {
                    if (result = test.call(null, val, key, obj)) {
                        return false;
                    }
                });
                return !!result;
            },
            mixin: $.extend,
            getUniqueId: function() {
                var counter = 0;
                return function() {
                    return counter++;
                };
            }(),
            templatify: function templatify(obj) {
                return $.isFunction(obj) ? obj : template;
                function template() {
                    return String(obj);
                }
            },
            defer: function(fn) {
                setTimeout(fn, 0);
            },
            debounce: function(func, wait, immediate) {
                var timeout, result;
                return function() {
                    var context = this, args = arguments, later, callNow;
                    later = function() {
                        timeout = null;
                        if (!immediate) {
                            result = func.apply(context, args);
                        }
                    };
                    callNow = immediate && !timeout;
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                    if (callNow) {
                        result = func.apply(context, args);
                    }
                    return result;
                };
            },
            throttle: function(func, wait) {
                var context, args, timeout, result, previous, later;
                previous = 0;
                later = function() {
                    previous = new Date();
                    timeout = null;
                    result = func.apply(context, args);
                };
                return function() {
                    var now = new Date(), remaining = wait - (now - previous);
                    context = this;
                    args = arguments;
                    if (remaining <= 0) {
                        clearTimeout(timeout);
                        timeout = null;
                        previous = now;
                        result = func.apply(context, args);
                    } else if (!timeout) {
                        timeout = setTimeout(later, remaining);
                    }
                    return result;
                };
            },
            noop: function() {}
        };
    }();
    var VERSION = "0.10.5";
    var tokenizers = function() {
        "use strict";
        return {
            nonword: nonword,
            whitespace: whitespace,
            obj: {
                nonword: getObjTokenizer(nonword),
                whitespace: getObjTokenizer(whitespace)
            }
        };
        function whitespace(str) {
            str = _.toStr(str);
            return str ? str.split(/\s+/) : [];
        }
        function nonword(str) {
            str = _.toStr(str);
            return str ? str.split(/\W+/) : [];
        }
        function getObjTokenizer(tokenizer) {
            return function setKey() {
                var args = [].slice.call(arguments, 0);
                return function tokenize(o) {
                    var tokens = [];
                    _.each(args, function(k) {
                        tokens = tokens.concat(tokenizer(_.toStr(o[k])));
                    });
                    return tokens;
                };
            };
        }
    }();
    var LruCache = function() {
        "use strict";
        function LruCache(maxSize) {
            this.maxSize = _.isNumber(maxSize) ? maxSize : 100;
            this.reset();
            if (this.maxSize <= 0) {
                this.set = this.get = $.noop;
            }
        }
        _.mixin(LruCache.prototype, {
            set: function set(key, val) {
                var tailItem = this.list.tail, node;
                if (this.size >= this.maxSize) {
                    this.list.remove(tailItem);
                    delete this.hash[tailItem.key];
                }
                if (node = this.hash[key]) {
                    node.val = val;
                    this.list.moveToFront(node);
                } else {
                    node = new Node(key, val);
                    this.list.add(node);
                    this.hash[key] = node;
                    this.size++;
                }
            },
            get: function get(key) {
                var node = this.hash[key];
                if (node) {
                    this.list.moveToFront(node);
                    return node.val;
                }
            },
            reset: function reset() {
                this.size = 0;
                this.hash = {};
                this.list = new List();
            }
        });
        function List() {
            this.head = this.tail = null;
        }
        _.mixin(List.prototype, {
            add: function add(node) {
                if (this.head) {
                    node.next = this.head;
                    this.head.prev = node;
                }
                this.head = node;
                this.tail = this.tail || node;
            },
            remove: function remove(node) {
                node.prev ? node.prev.next = node.next : this.head = node.next;
                node.next ? node.next.prev = node.prev : this.tail = node.prev;
            },
            moveToFront: function(node) {
                this.remove(node);
                this.add(node);
            }
        });
        function Node(key, val) {
            this.key = key;
            this.val = val;
            this.prev = this.next = null;
        }
        return LruCache;
    }();
    var PersistentStorage = function() {
        "use strict";
        var ls, methods;
        try {
            ls = window.localStorage;
            ls.setItem("~~~", "!");
            ls.removeItem("~~~");
        } catch (err) {
            ls = null;
        }
        function PersistentStorage(namespace) {
            this.prefix = [ "__", namespace, "__" ].join("");
            this.ttlKey = "__ttl__";
            this.keyMatcher = new RegExp("^" + _.escapeRegExChars(this.prefix));
        }
        if (ls && window.JSON) {
            methods = {
                _prefix: function(key) {
                    return this.prefix + key;
                },
                _ttlKey: function(key) {
                    return this._prefix(key) + this.ttlKey;
                },
                get: function(key) {
                    if (this.isExpired(key)) {
                        this.remove(key);
                    }
                    return decode(ls.getItem(this._prefix(key)));
                },
                set: function(key, val, ttl) {
                    if (_.isNumber(ttl)) {
                        ls.setItem(this._ttlKey(key), encode(now() + ttl));
                    } else {
                        ls.removeItem(this._ttlKey(key));
                    }
                    return ls.setItem(this._prefix(key), encode(val));
                },
                remove: function(key) {
                    ls.removeItem(this._ttlKey(key));
                    ls.removeItem(this._prefix(key));
                    return this;
                },
                clear: function() {
                    var i, key, keys = [], len = ls.length;
                    for (i = 0; i < len; i++) {
                        if ((key = ls.key(i)).match(this.keyMatcher)) {
                            keys.push(key.replace(this.keyMatcher, ""));
                        }
                    }
                    for (i = keys.length; i--; ) {
                        this.remove(keys[i]);
                    }
                    return this;
                },
                isExpired: function(key) {
                    var ttl = decode(ls.getItem(this._ttlKey(key)));
                    return _.isNumber(ttl) && now() > ttl ? true : false;
                }
            };
        } else {
            methods = {
                get: _.noop,
                set: _.noop,
                remove: _.noop,
                clear: _.noop,
                isExpired: _.noop
            };
        }
        _.mixin(PersistentStorage.prototype, methods);
        return PersistentStorage;
        function now() {
            return new Date().getTime();
        }
        function encode(val) {
            return JSON.stringify(_.isUndefined(val) ? null : val);
        }
        function decode(val) {
            return JSON.parse(val);
        }
    }();
    var Transport = function() {
        "use strict";
        var pendingRequestsCount = 0, pendingRequests = {}, maxPendingRequests = 6, sharedCache = new LruCache(10);
        function Transport(o) {
            o = o || {};
            this.cancelled = false;
            this.lastUrl = null;
            this._send = o.transport ? callbackToDeferred(o.transport) : $.ajax;
            this._get = o.rateLimiter ? o.rateLimiter(this._get) : this._get;
            this._cache = o.cache === false ? new LruCache(0) : sharedCache;
        }
        Transport.setMaxPendingRequests = function setMaxPendingRequests(num) {
            maxPendingRequests = num;
        };
        Transport.resetCache = function resetCache() {
            sharedCache.reset();
        };
        _.mixin(Transport.prototype, {
            _get: function(url, o, cb) {
                var that = this, jqXhr;
                if (this.cancelled || url !== this.lastUrl) {
                    return;
                }
                if (jqXhr = pendingRequests[url]) {
                    jqXhr.done(done).fail(fail);
                } else if (pendingRequestsCount < maxPendingRequests) {
                    pendingRequestsCount++;
                    pendingRequests[url] = this._send(url, o).done(done).fail(fail).always(always);
                } else {
                    this.onDeckRequestArgs = [].slice.call(arguments, 0);
                }
                function done(resp) {
                    cb && cb(null, resp);
                    that._cache.set(url, resp);
                }
                function fail() {
                    cb && cb(true);
                }
                function always() {
                    pendingRequestsCount--;
                    delete pendingRequests[url];
                    if (that.onDeckRequestArgs) {
                        that._get.apply(that, that.onDeckRequestArgs);
                        that.onDeckRequestArgs = null;
                    }
                }
            },
            get: function(url, o, cb) {
                var resp;
                if (_.isFunction(o)) {
                    cb = o;
                    o = {};
                }
                this.cancelled = false;
                this.lastUrl = url;
                if (resp = this._cache.get(url)) {
                    _.defer(function() {
                        cb && cb(null, resp);
                    });
                } else {
                    this._get(url, o, cb);
                }
                return !!resp;
            },
            cancel: function() {
                this.cancelled = true;
            }
        });
        return Transport;
        function callbackToDeferred(fn) {
            return function customSendWrapper(url, o) {
                var deferred = $.Deferred();
                fn(url, o, onSuccess, onError);
                return deferred;
                function onSuccess(resp) {
                    _.defer(function() {
                        deferred.resolve(resp);
                    });
                }
                function onError(err) {
                    _.defer(function() {
                        deferred.reject(err);
                    });
                }
            };
        }
    }();
    var SearchIndex = function() {
        "use strict";
        function SearchIndex(o) {
            o = o || {};
            if (!o.datumTokenizer || !o.queryTokenizer) {
                $.error("datumTokenizer and queryTokenizer are both required");
            }
            this.datumTokenizer = o.datumTokenizer;
            this.queryTokenizer = o.queryTokenizer;
            this.reset();
        }
        _.mixin(SearchIndex.prototype, {
            bootstrap: function bootstrap(o) {
                this.datums = o.datums;
                this.trie = o.trie;
            },
            add: function(data) {
                var that = this;
                data = _.isArray(data) ? data : [ data ];
                _.each(data, function(datum) {
                    var id, tokens;
                    id = that.datums.push(datum) - 1;
                    tokens = normalizeTokens(that.datumTokenizer(datum));
                    _.each(tokens, function(token) {
                        var node, chars, ch;
                        node = that.trie;
                        chars = token.split("");
                        while (ch = chars.shift()) {
                            node = node.children[ch] || (node.children[ch] = newNode());
                            node.ids.push(id);
                        }
                    });
                });
            },
            get: function get(query) {
                var that = this, tokens, matches;
                tokens = normalizeTokens(this.queryTokenizer(query));
                _.each(tokens, function(token) {
                    var node, chars, ch, ids;
                    if (matches && matches.length === 0) {
                        return false;
                    }
                    node = that.trie;
                    chars = token.split("");
                    while (node && (ch = chars.shift())) {
                        node = node.children[ch];
                    }
                    if (node && chars.length === 0) {
                        ids = node.ids.slice(0);
                        matches = matches ? getIntersection(matches, ids) : ids;
                    } else {
                        matches = [];
                        return false;
                    }
                });
                return matches ? _.map(unique(matches), function(id) {
                    return that.datums[id];
                }) : [];
            },
            reset: function reset() {
                this.datums = [];
                this.trie = newNode();
            },
            serialize: function serialize() {
                return {
                    datums: this.datums,
                    trie: this.trie
                };
            }
        });
        return SearchIndex;
        function normalizeTokens(tokens) {
            tokens = _.filter(tokens, function(token) {
                return !!token;
            });
            tokens = _.map(tokens, function(token) {
                return token.toLowerCase();
            });
            return tokens;
        }
        function newNode() {
            return {
                ids: [],
                children: {}
            };
        }
        function unique(array) {
            var seen = {}, uniques = [];
            for (var i = 0, len = array.length; i < len; i++) {
                if (!seen[array[i]]) {
                    seen[array[i]] = true;
                    uniques.push(array[i]);
                }
            }
            return uniques;
        }
        function getIntersection(arrayA, arrayB) {
            var ai = 0, bi = 0, intersection = [];
            arrayA = arrayA.sort(compare);
            arrayB = arrayB.sort(compare);
            var lenArrayA = arrayA.length, lenArrayB = arrayB.length;
            while (ai < lenArrayA && bi < lenArrayB) {
                if (arrayA[ai] < arrayB[bi]) {
                    ai++;
                } else if (arrayA[ai] > arrayB[bi]) {
                    bi++;
                } else {
                    intersection.push(arrayA[ai]);
                    ai++;
                    bi++;
                }
            }
            return intersection;
            function compare(a, b) {
                return a - b;
            }
        }
    }();
    var oParser = function() {
        "use strict";
        return {
            local: getLocal,
            prefetch: getPrefetch,
            remote: getRemote
        };
        function getLocal(o) {
            return o.local || null;
        }
        function getPrefetch(o) {
            var prefetch, defaults;
            defaults = {
                url: null,
                thumbprint: "",
                ttl: 24 * 60 * 60 * 1e3,
                filter: null,
                ajax: {}
            };
            if (prefetch = o.prefetch || null) {
                prefetch = _.isString(prefetch) ? {
                    url: prefetch
                } : prefetch;
                prefetch = _.mixin(defaults, prefetch);
                prefetch.thumbprint = VERSION + prefetch.thumbprint;
                prefetch.ajax.type = prefetch.ajax.type || "GET";
                prefetch.ajax.dataType = prefetch.ajax.dataType || "json";
                !prefetch.url && $.error("prefetch requires url to be set");
            }
            return prefetch;
        }
        function getRemote(o) {
            var remote, defaults;
            defaults = {
                url: null,
                cache: true,
                wildcard: "%QUERY",
                replace: null,
                rateLimitBy: "debounce",
                rateLimitWait: 300,
                send: null,
                filter: null,
                ajax: {}
            };
            if (remote = o.remote || null) {
                remote = _.isString(remote) ? {
                    url: remote
                } : remote;
                remote = _.mixin(defaults, remote);
                remote.rateLimiter = /^throttle$/i.test(remote.rateLimitBy) ? byThrottle(remote.rateLimitWait) : byDebounce(remote.rateLimitWait);
                remote.ajax.type = remote.ajax.type || "GET";
                remote.ajax.dataType = remote.ajax.dataType || "json";
                delete remote.rateLimitBy;
                delete remote.rateLimitWait;
                !remote.url && $.error("remote requires url to be set");
            }
            return remote;
            function byDebounce(wait) {
                return function(fn) {
                    return _.debounce(fn, wait);
                };
            }
            function byThrottle(wait) {
                return function(fn) {
                    return _.throttle(fn, wait);
                };
            }
        }
    }();
    (function(root) {
        "use strict";
        var old, keys;
        old = root.Bloodhound;
        keys = {
            data: "data",
            protocol: "protocol",
            thumbprint: "thumbprint"
        };
        root.Bloodhound = Bloodhound;
        function Bloodhound(o) {
            if (!o || !o.local && !o.prefetch && !o.remote) {
                $.error("one of local, prefetch, or remote is required");
            }
            this.limit = o.limit || 5;
            this.sorter = getSorter(o.sorter);
            this.dupDetector = o.dupDetector || ignoreDuplicates;
            this.local = oParser.local(o);
            this.prefetch = oParser.prefetch(o);
            this.remote = oParser.remote(o);
            this.cacheKey = this.prefetch ? this.prefetch.cacheKey || this.prefetch.url : null;
            this.index = new SearchIndex({
                datumTokenizer: o.datumTokenizer,
                queryTokenizer: o.queryTokenizer
            });
            this.storage = this.cacheKey ? new PersistentStorage(this.cacheKey) : null;
        }
        Bloodhound.noConflict = function noConflict() {
            root.Bloodhound = old;
            return Bloodhound;
        };
        Bloodhound.tokenizers = tokenizers;
        _.mixin(Bloodhound.prototype, {
            _loadPrefetch: function loadPrefetch(o) {
                var that = this, serialized, deferred;
                if (serialized = this._readFromStorage(o.thumbprint)) {
                    this.index.bootstrap(serialized);
                    deferred = $.Deferred().resolve();
                } else {
                    deferred = $.ajax(o.url, o.ajax).done(handlePrefetchResponse);
                }
                return deferred;
                function handlePrefetchResponse(resp) {
                    that.clear();
                    that.add(o.filter ? o.filter(resp) : resp);
                    that._saveToStorage(that.index.serialize(), o.thumbprint, o.ttl);
                }
            },
            _getFromRemote: function getFromRemote(query, cb) {
                var that = this, url, uriEncodedQuery;
                if (!this.transport) {
                    return;
                }
                query = query || "";
                uriEncodedQuery = encodeURIComponent(query);
                url = this.remote.replace ? this.remote.replace(this.remote.url, query) : this.remote.url.replace(this.remote.wildcard, uriEncodedQuery);
                return this.transport.get(url, this.remote.ajax, handleRemoteResponse);
                function handleRemoteResponse(err, resp) {
                    err ? cb([]) : cb(that.remote.filter ? that.remote.filter(resp) : resp);
                }
            },
            _cancelLastRemoteRequest: function cancelLastRemoteRequest() {
                this.transport && this.transport.cancel();
            },
            _saveToStorage: function saveToStorage(data, thumbprint, ttl) {
                if (this.storage) {
                    this.storage.set(keys.data, data, ttl);
                    this.storage.set(keys.protocol, location.protocol, ttl);
                    this.storage.set(keys.thumbprint, thumbprint, ttl);
                }
            },
            _readFromStorage: function readFromStorage(thumbprint) {
                var stored = {}, isExpired;
                if (this.storage) {
                    stored.data = this.storage.get(keys.data);
                    stored.protocol = this.storage.get(keys.protocol);
                    stored.thumbprint = this.storage.get(keys.thumbprint);
                }
                isExpired = stored.thumbprint !== thumbprint || stored.protocol !== location.protocol;
                return stored.data && !isExpired ? stored.data : null;
            },
            _initialize: function initialize() {
                var that = this, local = this.local, deferred;
                deferred = this.prefetch ? this._loadPrefetch(this.prefetch) : $.Deferred().resolve();
                local && deferred.done(addLocalToIndex);
                this.transport = this.remote ? new Transport(this.remote) : null;
                return this.initPromise = deferred.promise();
                function addLocalToIndex() {
                    that.add(_.isFunction(local) ? local() : local);
                }
            },
            initialize: function initialize(force) {
                return !this.initPromise || force ? this._initialize() : this.initPromise;
            },
            add: function add(data) {
                this.index.add(data);
            },
            get: function get(query, cb) {
                var that = this, matches = [], cacheHit = false;
                matches = this.index.get(query);
                matches = this.sorter(matches).slice(0, this.limit);
                matches.length < this.limit ? cacheHit = this._getFromRemote(query, returnRemoteMatches) : this._cancelLastRemoteRequest();
                if (!cacheHit) {
                    (matches.length > 0 || !this.transport) && cb && cb(matches);
                }
                function returnRemoteMatches(remoteMatches) {
                    var matchesWithBackfill = matches.slice(0);
                    _.each(remoteMatches, function(remoteMatch) {
                        var isDuplicate;
                        isDuplicate = _.some(matchesWithBackfill, function(match) {
                            return that.dupDetector(remoteMatch, match);
                        });
                        !isDuplicate && matchesWithBackfill.push(remoteMatch);
                        return matchesWithBackfill.length < that.limit;
                    });
                    cb && cb(that.sorter(matchesWithBackfill));
                }
            },
            clear: function clear() {
                this.index.reset();
            },
            clearPrefetchCache: function clearPrefetchCache() {
                this.storage && this.storage.clear();
            },
            clearRemoteCache: function clearRemoteCache() {
                this.transport && Transport.resetCache();
            },
            ttAdapter: function ttAdapter() {
                return _.bind(this.get, this);
            }
        });
        return Bloodhound;
        function getSorter(sortFn) {
            return _.isFunction(sortFn) ? sort : noSort;
            function sort(array) {
                return array.sort(sortFn);
            }
            function noSort(array) {
                return array;
            }
        }
        function ignoreDuplicates() {
            return false;
        }
    })(this);
    var html = function() {
        return {
            wrapper: '<span class="twitter-typeahead"></span>',
            dropdown: '<span class="tt-dropdown-menu"></span>',
            dataset: '<div class="tt-dataset-%CLASS%"></div>',
            suggestions: '<span class="tt-suggestions"></span>',
            suggestion: '<div class="tt-suggestion"></div>'
        };
    }();
    var css = function() {
        "use strict";
        var css = {
            wrapper: {
                position: "relative",
                display: "inline-block"
            },
            hint: {
                position: "absolute",
                top: "0",
                left: "0",
                borderColor: "transparent",
                boxShadow: "none",
                opacity: "1"
            },
            input: {
                position: "relative",
                verticalAlign: "top",
                backgroundColor: "transparent"
            },
            inputWithNoHint: {
                position: "relative",
                verticalAlign: "top"
            },
            dropdown: {
                position: "absolute",
                top: "100%",
                left: "0",
                zIndex: "100",
                display: "none"
            },
            suggestions: {
                display: "block"
            },
            suggestion: {
                whiteSpace: "nowrap",
                cursor: "pointer"
            },
            suggestionChild: {
                whiteSpace: "normal"
            },
            ltr: {
                left: "0",
                right: "auto"
            },
            rtl: {
                left: "auto",
                right: " 0"
            }
        };
        if (_.isMsie()) {
            _.mixin(css.input, {
                backgroundImage: "url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)"
            });
        }
        if (_.isMsie() && _.isMsie() <= 7) {
            _.mixin(css.input, {
                marginTop: "-1px"
            });
        }
        return css;
    }();
    var EventBus = function() {
        "use strict";
        var namespace = "typeahead:";
        function EventBus(o) {
            if (!o || !o.el) {
                $.error("EventBus initialized without el");
            }
            this.$el = $(o.el);
        }
        _.mixin(EventBus.prototype, {
            trigger: function(type) {
                var args = [].slice.call(arguments, 1);
                this.$el.trigger(namespace + type, args);
            }
        });
        return EventBus;
    }();
    var EventEmitter = function() {
        "use strict";
        var splitter = /\s+/, nextTick = getNextTick();
        return {
            onSync: onSync,
            onAsync: onAsync,
            off: off,
            trigger: trigger
        };
        function on(method, types, cb, context) {
            var type;
            if (!cb) {
                return this;
            }
            types = types.split(splitter);
            cb = context ? bindContext(cb, context) : cb;
            this._callbacks = this._callbacks || {};
            while (type = types.shift()) {
                this._callbacks[type] = this._callbacks[type] || {
                    sync: [],
                    async: []
                };
                this._callbacks[type][method].push(cb);
            }
            return this;
        }
        function onAsync(types, cb, context) {
            return on.call(this, "async", types, cb, context);
        }
        function onSync(types, cb, context) {
            return on.call(this, "sync", types, cb, context);
        }
        function off(types) {
            var type;
            if (!this._callbacks) {
                return this;
            }
            types = types.split(splitter);
            while (type = types.shift()) {
                delete this._callbacks[type];
            }
            return this;
        }
        function trigger(types) {
            var type, callbacks, args, syncFlush, asyncFlush;
            if (!this._callbacks) {
                return this;
            }
            types = types.split(splitter);
            args = [].slice.call(arguments, 1);
            while ((type = types.shift()) && (callbacks = this._callbacks[type])) {
                syncFlush = getFlush(callbacks.sync, this, [ type ].concat(args));
                asyncFlush = getFlush(callbacks.async, this, [ type ].concat(args));
                syncFlush() && nextTick(asyncFlush);
            }
            return this;
        }
        function getFlush(callbacks, context, args) {
            return flush;
            function flush() {
                var cancelled;
                for (var i = 0, len = callbacks.length; !cancelled && i < len; i += 1) {
                    cancelled = callbacks[i].apply(context, args) === false;
                }
                return !cancelled;
            }
        }
        function getNextTick() {
            var nextTickFn;
            if (window.setImmediate) {
                nextTickFn = function nextTickSetImmediate(fn) {
                    setImmediate(function() {
                        fn();
                    });
                };
            } else {
                nextTickFn = function nextTickSetTimeout(fn) {
                    setTimeout(function() {
                        fn();
                    }, 0);
                };
            }
            return nextTickFn;
        }
        function bindContext(fn, context) {
            return fn.bind ? fn.bind(context) : function() {
                fn.apply(context, [].slice.call(arguments, 0));
            };
        }
    }();
    var highlight = function(doc) {
        "use strict";
        var defaults = {
            node: null,
            pattern: null,
            tagName: "strong",
            className: null,
            wordsOnly: false,
            caseSensitive: false
        };
        return function hightlight(o) {
            var regex;
            o = _.mixin({}, defaults, o);
            if (!o.node || !o.pattern) {
                return;
            }
            o.pattern = _.isArray(o.pattern) ? o.pattern : [ o.pattern ];
            regex = getRegex(o.pattern, o.caseSensitive, o.wordsOnly);
            traverse(o.node, hightlightTextNode);
            function hightlightTextNode(textNode) {
                var match, patternNode, wrapperNode;
                if (match = regex.exec(textNode.data)) {
                    wrapperNode = doc.createElement(o.tagName);
                    o.className && (wrapperNode.className = o.className);
                    patternNode = textNode.splitText(match.index);
                    patternNode.splitText(match[0].length);
                    wrapperNode.appendChild(patternNode.cloneNode(true));
                    textNode.parentNode.replaceChild(wrapperNode, patternNode);
                }
                return !!match;
            }
            function traverse(el, hightlightTextNode) {
                var childNode, TEXT_NODE_TYPE = 3;
                for (var i = 0; i < el.childNodes.length; i++) {
                    childNode = el.childNodes[i];
                    if (childNode.nodeType === TEXT_NODE_TYPE) {
                        i += hightlightTextNode(childNode) ? 1 : 0;
                    } else {
                        traverse(childNode, hightlightTextNode);
                    }
                }
            }
        };
        function getRegex(patterns, caseSensitive, wordsOnly) {
            var escapedPatterns = [], regexStr;
            for (var i = 0, len = patterns.length; i < len; i++) {
                escapedPatterns.push(_.escapeRegExChars(patterns[i]));
            }
            regexStr = wordsOnly ? "\\b(" + escapedPatterns.join("|") + ")\\b" : "(" + escapedPatterns.join("|") + ")";
            return caseSensitive ? new RegExp(regexStr) : new RegExp(regexStr, "i");
        }
    }(window.document);
    var Input = function() {
        "use strict";
        var specialKeyCodeMap;
        specialKeyCodeMap = {
            9: "tab",
            27: "esc",
            37: "left",
            39: "right",
            13: "enter",
            38: "up",
            40: "down"
        };
        function Input(o) {
            var that = this, onBlur, onFocus, onKeydown, onInput;
            o = o || {};
            if (!o.input) {
                $.error("input is missing");
            }
            onBlur = _.bind(this._onBlur, this);
            onFocus = _.bind(this._onFocus, this);
            onKeydown = _.bind(this._onKeydown, this);
            onInput = _.bind(this._onInput, this);
            this.$hint = $(o.hint);
            this.$input = $(o.input).on("blur.tt", onBlur).on("focus.tt", onFocus).on("keydown.tt", onKeydown);
            if (this.$hint.length === 0) {
                this.setHint = this.getHint = this.clearHint = this.clearHintIfInvalid = _.noop;
            }
            if (!_.isMsie()) {
                this.$input.on("input.tt", onInput);
            } else {
                this.$input.on("keydown.tt keypress.tt cut.tt paste.tt", function($e) {
                    if (specialKeyCodeMap[$e.which || $e.keyCode]) {
                        return;
                    }
                    _.defer(_.bind(that._onInput, that, $e));
                });
            }
            this.query = this.$input.val();
            this.$overflowHelper = buildOverflowHelper(this.$input);
        }
        Input.normalizeQuery = function(str) {
            return (str || "").replace(/^\s*/g, "").replace(/\s{2,}/g, " ");
        };
        _.mixin(Input.prototype, EventEmitter, {
            _onBlur: function onBlur() {
                this.resetInputValue();
                this.trigger("blurred");
            },
            _onFocus: function onFocus() {
                this.trigger("focused");
            },
            _onKeydown: function onKeydown($e) {
                var keyName = specialKeyCodeMap[$e.which || $e.keyCode];
                this._managePreventDefault(keyName, $e);
                if (keyName && this._shouldTrigger(keyName, $e)) {
                    this.trigger(keyName + "Keyed", $e);
                }
            },
            _onInput: function onInput() {
                this._checkInputValue();
            },
            _managePreventDefault: function managePreventDefault(keyName, $e) {
                var preventDefault, hintValue, inputValue;
                switch (keyName) {
                  case "tab":
                    hintValue = this.getHint();
                    inputValue = this.getInputValue();
                    preventDefault = hintValue && hintValue !== inputValue && !withModifier($e);
                    break;

                  case "up":
                  case "down":
                    preventDefault = !withModifier($e);
                    break;

                  default:
                    preventDefault = false;
                }
                preventDefault && $e.preventDefault();
            },
            _shouldTrigger: function shouldTrigger(keyName, $e) {
                var trigger;
                switch (keyName) {
                  case "tab":
                    trigger = !withModifier($e);
                    break;

                  default:
                    trigger = true;
                }
                return trigger;
            },
            _checkInputValue: function checkInputValue() {
                var inputValue, areEquivalent, hasDifferentWhitespace;
                inputValue = this.getInputValue();
                areEquivalent = areQueriesEquivalent(inputValue, this.query);
                hasDifferentWhitespace = areEquivalent ? this.query.length !== inputValue.length : false;
                this.query = inputValue;
                if (!areEquivalent) {
                    this.trigger("queryChanged", this.query);
                } else if (hasDifferentWhitespace) {
                    this.trigger("whitespaceChanged", this.query);
                }
            },
            focus: function focus() {
                this.$input.focus();
            },
            blur: function blur() {
                this.$input.blur();
            },
            getQuery: function getQuery() {
                return this.query;
            },
            setQuery: function setQuery(query) {
                this.query = query;
            },
            getInputValue: function getInputValue() {
                return this.$input.val();
            },
            setInputValue: function setInputValue(value, silent) {
                this.$input.val(value);
                silent ? this.clearHint() : this._checkInputValue();
            },
            resetInputValue: function resetInputValue() {
                this.setInputValue(this.query, true);
            },
            getHint: function getHint() {
                return this.$hint.val();
            },
            setHint: function setHint(value) {
                this.$hint.val(value);
            },
            clearHint: function clearHint() {
                this.setHint("");
            },
            clearHintIfInvalid: function clearHintIfInvalid() {
                var val, hint, valIsPrefixOfHint, isValid;
                val = this.getInputValue();
                hint = this.getHint();
                valIsPrefixOfHint = val !== hint && hint.indexOf(val) === 0;
                isValid = val !== "" && valIsPrefixOfHint && !this.hasOverflow();
                !isValid && this.clearHint();
            },
            getLanguageDirection: function getLanguageDirection() {
                return (this.$input.css("direction") || "ltr").toLowerCase();
            },
            hasOverflow: function hasOverflow() {
                var constraint = this.$input.width() - 2;
                this.$overflowHelper.text(this.getInputValue());
                return this.$overflowHelper.width() >= constraint;
            },
            isCursorAtEnd: function() {
                var valueLength, selectionStart, range;
                valueLength = this.$input.val().length;
                selectionStart = this.$input[0].selectionStart;
                if (_.isNumber(selectionStart)) {
                    return selectionStart === valueLength;
                } else if (document.selection) {
                    range = document.selection.createRange();
                    range.moveStart("character", -valueLength);
                    return valueLength === range.text.length;
                }
                return true;
            },
            destroy: function destroy() {
                this.$hint.off(".tt");
                this.$input.off(".tt");
                this.$hint = this.$input = this.$overflowHelper = null;
            }
        });
        return Input;
        function buildOverflowHelper($input) {
            return $('<pre aria-hidden="true"></pre>').css({
                position: "absolute",
                visibility: "hidden",
                whiteSpace: "pre",
                fontFamily: $input.css("font-family"),
                fontSize: $input.css("font-size"),
                fontStyle: $input.css("font-style"),
                fontVariant: $input.css("font-variant"),
                fontWeight: $input.css("font-weight"),
                wordSpacing: $input.css("word-spacing"),
                letterSpacing: $input.css("letter-spacing"),
                textIndent: $input.css("text-indent"),
                textRendering: $input.css("text-rendering"),
                textTransform: $input.css("text-transform")
            }).insertAfter($input);
        }
        function areQueriesEquivalent(a, b) {
            return Input.normalizeQuery(a) === Input.normalizeQuery(b);
        }
        function withModifier($e) {
            return $e.altKey || $e.ctrlKey || $e.metaKey || $e.shiftKey;
        }
    }();
    var Dataset = function() {
        "use strict";
        var datasetKey = "ttDataset", valueKey = "ttValue", datumKey = "ttDatum";
        function Dataset(o) {
            o = o || {};
            o.templates = o.templates || {};
            if (!o.source) {
                $.error("missing source");
            }
            if (o.name && !isValidName(o.name)) {
                $.error("invalid dataset name: " + o.name);
            }
            this.query = null;
            this.highlight = !!o.highlight;
            this.name = o.name || _.getUniqueId();
            this.source = o.source;
            this.displayFn = getDisplayFn(o.display || o.displayKey);
            this.templates = getTemplates(o.templates, this.displayFn);
            this.$el = $(html.dataset.replace("%CLASS%", this.name));
        }
        Dataset.extractDatasetName = function extractDatasetName(el) {
            return $(el).data(datasetKey);
        };
        Dataset.extractValue = function extractDatum(el) {
            return $(el).data(valueKey);
        };
        Dataset.extractDatum = function extractDatum(el) {
            return $(el).data(datumKey);
        };
        _.mixin(Dataset.prototype, EventEmitter, {
            _render: function render(query, suggestions) {
                if (!this.$el) {
                    return;
                }
                var that = this, hasSuggestions;
                this.$el.empty();
                hasSuggestions = suggestions && suggestions.length;
                if (!hasSuggestions && this.templates.empty) {
                    this.$el.html(getEmptyHtml()).prepend(that.templates.header ? getHeaderHtml() : null).append(that.templates.footer ? getFooterHtml() : null);
                } else if (hasSuggestions) {
                    this.$el.html(getSuggestionsHtml()).prepend(that.templates.header ? getHeaderHtml() : null).append(that.templates.footer ? getFooterHtml() : null);
                }
                this.trigger("rendered");
                function getEmptyHtml() {
                    return that.templates.empty({
                        query: query,
                        isEmpty: true
                    });
                }
                function getSuggestionsHtml() {
                    var $suggestions, nodes;
                    $suggestions = $(html.suggestions).css(css.suggestions);
                    nodes = _.map(suggestions, getSuggestionNode);
                    $suggestions.append.apply($suggestions, nodes);
                    that.highlight && highlight({
                        className: "tt-highlight",
                        node: $suggestions[0],
                        pattern: query
                    });
                    return $suggestions;
                    function getSuggestionNode(suggestion) {
                        var $el;
                        $el = $(html.suggestion).append(that.templates.suggestion(suggestion)).data(datasetKey, that.name).data(valueKey, that.displayFn(suggestion)).data(datumKey, suggestion);
                        $el.children().each(function() {
                            $(this).css(css.suggestionChild);
                        });
                        return $el;
                    }
                }
                function getHeaderHtml() {
                    return that.templates.header({
                        query: query,
                        isEmpty: !hasSuggestions
                    });
                }
                function getFooterHtml() {
                    return that.templates.footer({
                        query: query,
                        isEmpty: !hasSuggestions
                    });
                }
            },
            getRoot: function getRoot() {
                return this.$el;
            },
            update: function update(query) {
                var that = this;
                this.query = query;
                this.canceled = false;
                this.source(query, render);
                function render(suggestions) {
                    if (!that.canceled && query === that.query) {
                        that._render(query, suggestions);
                    }
                }
            },
            cancel: function cancel() {
                this.canceled = true;
            },
            clear: function clear() {
                this.cancel();
                this.$el.empty();
                this.trigger("rendered");
            },
            isEmpty: function isEmpty() {
                return this.$el.is(":empty");
            },
            destroy: function destroy() {
                this.$el = null;
            }
        });
        return Dataset;
        function getDisplayFn(display) {
            display = display || "value";
            return _.isFunction(display) ? display : displayFn;
            function displayFn(obj) {
                return obj[display];
            }
        }
        function getTemplates(templates, displayFn) {
            return {
                empty: templates.empty && _.templatify(templates.empty),
                header: templates.header && _.templatify(templates.header),
                footer: templates.footer && _.templatify(templates.footer),
                suggestion: templates.suggestion || suggestionTemplate
            };
            function suggestionTemplate(context) {
                return "<p>" + displayFn(context) + "</p>";
            }
        }
        function isValidName(str) {
            return /^[_a-zA-Z0-9-]+$/.test(str);
        }
    }();
    var Dropdown = function() {
        "use strict";
        function Dropdown(o) {
            var that = this, onSuggestionClick, onSuggestionMouseEnter, onSuggestionMouseLeave;
            o = o || {};
            if (!o.menu) {
                $.error("menu is required");
            }
            this.isOpen = false;
            this.isEmpty = true;
            this.datasets = _.map(o.datasets, initializeDataset);
            onSuggestionClick = _.bind(this._onSuggestionClick, this);
            onSuggestionMouseEnter = _.bind(this._onSuggestionMouseEnter, this);
            onSuggestionMouseLeave = _.bind(this._onSuggestionMouseLeave, this);
            this.$menu = $(o.menu).on("click.tt", ".tt-suggestion", onSuggestionClick).on("mouseenter.tt", ".tt-suggestion", onSuggestionMouseEnter).on("mouseleave.tt", ".tt-suggestion", onSuggestionMouseLeave);
            _.each(this.datasets, function(dataset) {
                that.$menu.append(dataset.getRoot());
                dataset.onSync("rendered", that._onRendered, that);
            });
        }
        _.mixin(Dropdown.prototype, EventEmitter, {
            _onSuggestionClick: function onSuggestionClick($e) {
                this.trigger("suggestionClicked", $($e.currentTarget));
            },
            _onSuggestionMouseEnter: function onSuggestionMouseEnter($e) {
                this._removeCursor();
                this._setCursor($($e.currentTarget), true);
            },
            _onSuggestionMouseLeave: function onSuggestionMouseLeave() {
                this._removeCursor();
            },
            _onRendered: function onRendered() {
                this.isEmpty = _.every(this.datasets, isDatasetEmpty);
                this.isEmpty ? this._hide() : this.isOpen && this._show();
                this.trigger("datasetRendered");
                function isDatasetEmpty(dataset) {
                    return dataset.isEmpty();
                }
            },
            _hide: function() {
                this.$menu.hide();
            },
            _show: function() {
                this.$menu.css("display", "block");
            },
            _getSuggestions: function getSuggestions() {
                return this.$menu.find(".tt-suggestion");
            },
            _getCursor: function getCursor() {
                return this.$menu.find(".tt-cursor").first();
            },
            _setCursor: function setCursor($el, silent) {
                $el.first().addClass("tt-cursor");
                !silent && this.trigger("cursorMoved");
            },
            _removeCursor: function removeCursor() {
                this._getCursor().removeClass("tt-cursor");
            },
            _moveCursor: function moveCursor(increment) {
                var $suggestions, $oldCursor, newCursorIndex, $newCursor;
                if (!this.isOpen) {
                    return;
                }
                $oldCursor = this._getCursor();
                $suggestions = this._getSuggestions();
                this._removeCursor();
                newCursorIndex = $suggestions.index($oldCursor) + increment;
                newCursorIndex = (newCursorIndex + 1) % ($suggestions.length + 1) - 1;
                if (newCursorIndex === -1) {
                    this.trigger("cursorRemoved");
                    return;
                } else if (newCursorIndex < -1) {
                    newCursorIndex = $suggestions.length - 1;
                }
                this._setCursor($newCursor = $suggestions.eq(newCursorIndex));
                this._ensureVisible($newCursor);
            },
            _ensureVisible: function ensureVisible($el) {
                var elTop, elBottom, menuScrollTop, menuHeight;
                elTop = $el.position().top;
                elBottom = elTop + $el.outerHeight(true);
                menuScrollTop = this.$menu.scrollTop();
                menuHeight = this.$menu.height() + parseInt(this.$menu.css("paddingTop"), 10) + parseInt(this.$menu.css("paddingBottom"), 10);
                if (elTop < 0) {
                    this.$menu.scrollTop(menuScrollTop + elTop);
                } else if (menuHeight < elBottom) {
                    this.$menu.scrollTop(menuScrollTop + (elBottom - menuHeight));
                }
            },
            close: function close() {
                if (this.isOpen) {
                    this.isOpen = false;
                    this._removeCursor();
                    this._hide();
                    this.trigger("closed");
                }
            },
            open: function open() {
                if (!this.isOpen) {
                    this.isOpen = true;
                    !this.isEmpty && this._show();
                    this.trigger("opened");
                }
            },
            setLanguageDirection: function setLanguageDirection(dir) {
                this.$menu.css(dir === "ltr" ? css.ltr : css.rtl);
            },
            moveCursorUp: function moveCursorUp() {
                this._moveCursor(-1);
            },
            moveCursorDown: function moveCursorDown() {
                this._moveCursor(+1);
            },
            getDatumForSuggestion: function getDatumForSuggestion($el) {
                var datum = null;
                if ($el.length) {
                    datum = {
                        raw: Dataset.extractDatum($el),
                        value: Dataset.extractValue($el),
                        datasetName: Dataset.extractDatasetName($el)
                    };
                }
                return datum;
            },
            getDatumForCursor: function getDatumForCursor() {
                return this.getDatumForSuggestion(this._getCursor().first());
            },
            getDatumForTopSuggestion: function getDatumForTopSuggestion() {
                return this.getDatumForSuggestion(this._getSuggestions().first());
            },
            update: function update(query) {
                _.each(this.datasets, updateDataset);
                function updateDataset(dataset) {
                    dataset.update(query);
                }
            },
            empty: function empty() {
                _.each(this.datasets, clearDataset);
                this.isEmpty = true;
                function clearDataset(dataset) {
                    dataset.clear();
                }
            },
            isVisible: function isVisible() {
                return this.isOpen && !this.isEmpty;
            },
            destroy: function destroy() {
                this.$menu.off(".tt");
                this.$menu = null;
                _.each(this.datasets, destroyDataset);
                function destroyDataset(dataset) {
                    dataset.destroy();
                }
            }
        });
        return Dropdown;
        function initializeDataset(oDataset) {
            return new Dataset(oDataset);
        }
    }();
    var Typeahead = function() {
        "use strict";
        var attrsKey = "ttAttrs";
        function Typeahead(o) {
            var $menu, $input, $hint;
            o = o || {};
            if (!o.input) {
                $.error("missing input");
            }
            this.isActivated = false;
            this.autoselect = !!o.autoselect;
            this.minLength = _.isNumber(o.minLength) ? o.minLength : 1;
            this.$node = buildDom(o.input, o.withHint);
            $menu = this.$node.find(".tt-dropdown-menu");
            $input = this.$node.find(".tt-input");
            $hint = this.$node.find(".tt-hint");
            $input.on("blur.tt", function($e) {
                var active, isActive, hasActive;
                active = document.activeElement;
                isActive = $menu.is(active);
                hasActive = $menu.has(active).length > 0;
                if (_.isMsie() && (isActive || hasActive)) {
                    $e.preventDefault();
                    $e.stopImmediatePropagation();
                    _.defer(function() {
                        $input.focus();
                    });
                }
            });
            $menu.on("mousedown.tt", function($e) {
                $e.preventDefault();
            });
            this.eventBus = o.eventBus || new EventBus({
                el: $input
            });
            this.dropdown = new Dropdown({
                menu: $menu,
                datasets: o.datasets
            }).onSync("suggestionClicked", this._onSuggestionClicked, this).onSync("cursorMoved", this._onCursorMoved, this).onSync("cursorRemoved", this._onCursorRemoved, this).onSync("opened", this._onOpened, this).onSync("closed", this._onClosed, this).onAsync("datasetRendered", this._onDatasetRendered, this);
            this.input = new Input({
                input: $input,
                hint: $hint
            }).onSync("focused", this._onFocused, this).onSync("blurred", this._onBlurred, this).onSync("enterKeyed", this._onEnterKeyed, this).onSync("tabKeyed", this._onTabKeyed, this).onSync("escKeyed", this._onEscKeyed, this).onSync("upKeyed", this._onUpKeyed, this).onSync("downKeyed", this._onDownKeyed, this).onSync("leftKeyed", this._onLeftKeyed, this).onSync("rightKeyed", this._onRightKeyed, this).onSync("queryChanged", this._onQueryChanged, this).onSync("whitespaceChanged", this._onWhitespaceChanged, this);
            this._setLanguageDirection();
        }
        _.mixin(Typeahead.prototype, {
            _onSuggestionClicked: function onSuggestionClicked(type, $el) {
                var datum;
                if (datum = this.dropdown.getDatumForSuggestion($el)) {
                    this._select(datum);
                }
            },
            _onCursorMoved: function onCursorMoved() {
                var datum = this.dropdown.getDatumForCursor();
                this.input.setInputValue(datum.value, true);
                this.eventBus.trigger("cursorchanged", datum.raw, datum.datasetName);
            },
            _onCursorRemoved: function onCursorRemoved() {
                this.input.resetInputValue();
                this._updateHint();
            },
            _onDatasetRendered: function onDatasetRendered() {
                this._updateHint();
            },
            _onOpened: function onOpened() {
                this._updateHint();
                this.eventBus.trigger("opened");
            },
            _onClosed: function onClosed() {
                this.input.clearHint();
                this.eventBus.trigger("closed");
            },
            _onFocused: function onFocused() {
                this.isActivated = true;
                this.dropdown.open();
            },
            _onBlurred: function onBlurred() {
                this.isActivated = false;
                this.dropdown.empty();
                this.dropdown.close();
            },
            _onEnterKeyed: function onEnterKeyed(type, $e) {
                var cursorDatum, topSuggestionDatum;
                cursorDatum = this.dropdown.getDatumForCursor();
                topSuggestionDatum = this.dropdown.getDatumForTopSuggestion();
                if (cursorDatum) {
                    this._select(cursorDatum);
                    $e.preventDefault();
                } else if (this.autoselect && topSuggestionDatum) {
                    this._select(topSuggestionDatum);
                    $e.preventDefault();
                }
            },
            _onTabKeyed: function onTabKeyed(type, $e) {
                var datum;
                if (datum = this.dropdown.getDatumForCursor()) {
                    this._select(datum);
                    $e.preventDefault();
                } else {
                    this._autocomplete(true);
                }
            },
            _onEscKeyed: function onEscKeyed() {
                this.dropdown.close();
                this.input.resetInputValue();
            },
            _onUpKeyed: function onUpKeyed() {
                var query = this.input.getQuery();
                this.dropdown.isEmpty && query.length >= this.minLength ? this.dropdown.update(query) : this.dropdown.moveCursorUp();
                this.dropdown.open();
            },
            _onDownKeyed: function onDownKeyed() {
                var query = this.input.getQuery();
                this.dropdown.isEmpty && query.length >= this.minLength ? this.dropdown.update(query) : this.dropdown.moveCursorDown();
                this.dropdown.open();
            },
            _onLeftKeyed: function onLeftKeyed() {
                this.dir === "rtl" && this._autocomplete();
            },
            _onRightKeyed: function onRightKeyed() {
                this.dir === "ltr" && this._autocomplete();
            },
            _onQueryChanged: function onQueryChanged(e, query) {
                this.input.clearHintIfInvalid();
                query.length >= this.minLength ? this.dropdown.update(query) : this.dropdown.empty();
                this.dropdown.open();
                this._setLanguageDirection();
            },
            _onWhitespaceChanged: function onWhitespaceChanged() {
                this._updateHint();
                this.dropdown.open();
            },
            _setLanguageDirection: function setLanguageDirection() {
                var dir;
                if (this.dir !== (dir = this.input.getLanguageDirection())) {
                    this.dir = dir;
                    this.$node.css("direction", dir);
                    this.dropdown.setLanguageDirection(dir);
                }
            },
            _updateHint: function updateHint() {
                var datum, val, query, escapedQuery, frontMatchRegEx, match;
                datum = this.dropdown.getDatumForTopSuggestion();
                if (datum && this.dropdown.isVisible() && !this.input.hasOverflow()) {
                    val = this.input.getInputValue();
                    query = Input.normalizeQuery(val);
                    escapedQuery = _.escapeRegExChars(query);
                    frontMatchRegEx = new RegExp("^(?:" + escapedQuery + ")(.+$)", "i");
                    match = frontMatchRegEx.exec(datum.value);
                    match ? this.input.setHint(val + match[1]) : this.input.clearHint();
                } else {
                    this.input.clearHint();
                }
            },
            _autocomplete: function autocomplete(laxCursor) {
                var hint, query, isCursorAtEnd, datum;
                hint = this.input.getHint();
                query = this.input.getQuery();
                isCursorAtEnd = laxCursor || this.input.isCursorAtEnd();
                if (hint && query !== hint && isCursorAtEnd) {
                    datum = this.dropdown.getDatumForTopSuggestion();
                    datum && this.input.setInputValue(datum.value);
                    this.eventBus.trigger("autocompleted", datum.raw, datum.datasetName);
                }
            },
            _select: function select(datum) {
                this.input.setQuery(datum.value);
                this.input.setInputValue(datum.value, true);
                this._setLanguageDirection();
                this.eventBus.trigger("selected", datum.raw, datum.datasetName);
                this.dropdown.close();
                _.defer(_.bind(this.dropdown.empty, this.dropdown));
            },
            open: function open() {
                this.dropdown.open();
            },
            close: function close() {
                this.dropdown.close();
            },
            setVal: function setVal(val) {
                val = _.toStr(val);
                if (this.isActivated) {
                    this.input.setInputValue(val);
                } else {
                    this.input.setQuery(val);
                    this.input.setInputValue(val, true);
                }
                this._setLanguageDirection();
            },
            getVal: function getVal() {
                return this.input.getQuery();
            },
            destroy: function destroy() {
                this.input.destroy();
                this.dropdown.destroy();
                destroyDomStructure(this.$node);
                this.$node = null;
            }
        });
        return Typeahead;
        function buildDom(input, withHint) {
            var $input, $wrapper, $dropdown, $hint;
            $input = $(input);
            $wrapper = $(html.wrapper).css(css.wrapper);
            $dropdown = $(html.dropdown).css(css.dropdown);
            $hint = $input.clone().css(css.hint).css(getBackgroundStyles($input));
            $hint.val("").removeData().addClass("tt-hint").removeAttr("id name placeholder required").prop("readonly", true).attr({
                autocomplete: "off",
                spellcheck: "false",
                tabindex: -1
            });
            $input.data(attrsKey, {
                dir: $input.attr("dir"),
                autocomplete: $input.attr("autocomplete"),
                spellcheck: $input.attr("spellcheck"),
                style: $input.attr("style")
            });
            $input.addClass("tt-input").attr({
                autocomplete: "off",
                spellcheck: false
            }).css(withHint ? css.input : css.inputWithNoHint);
            try {
                !$input.attr("dir") && $input.attr("dir", "auto");
            } catch (e) {}
            return $input.wrap($wrapper).parent().prepend(withHint ? $hint : null).append($dropdown);
        }
        function getBackgroundStyles($el) {
            return {
                backgroundAttachment: $el.css("background-attachment"),
                backgroundClip: $el.css("background-clip"),
                backgroundColor: $el.css("background-color"),
                backgroundImage: $el.css("background-image"),
                backgroundOrigin: $el.css("background-origin"),
                backgroundPosition: $el.css("background-position"),
                backgroundRepeat: $el.css("background-repeat"),
                backgroundSize: $el.css("background-size")
            };
        }
        function destroyDomStructure($node) {
            var $input = $node.find(".tt-input");
            _.each($input.data(attrsKey), function(val, key) {
                _.isUndefined(val) ? $input.removeAttr(key) : $input.attr(key, val);
            });
            $input.detach().removeData(attrsKey).removeClass("tt-input").insertAfter($node);
            $node.remove();
        }
    }();
    (function() {
        "use strict";
        var old, typeaheadKey, methods;
        old = $.fn.typeahead;
        typeaheadKey = "ttTypeahead";
        methods = {
            initialize: function initialize(o, datasets) {
                datasets = _.isArray(datasets) ? datasets : [].slice.call(arguments, 1);
                o = o || {};
                return this.each(attach);
                function attach() {
                    var $input = $(this), eventBus, typeahead;
                    _.each(datasets, function(d) {
                        d.highlight = !!o.highlight;
                    });
                    typeahead = new Typeahead({
                        input: $input,
                        eventBus: eventBus = new EventBus({
                            el: $input
                        }),
                        withHint: _.isUndefined(o.hint) ? true : !!o.hint,
                        minLength: o.minLength,
                        autoselect: o.autoselect,
                        datasets: datasets
                    });
                    $input.data(typeaheadKey, typeahead);
                }
            },
            open: function open() {
                return this.each(openTypeahead);
                function openTypeahead() {
                    var $input = $(this), typeahead;
                    if (typeahead = $input.data(typeaheadKey)) {
                        typeahead.open();
                    }
                }
            },
            close: function close() {
                return this.each(closeTypeahead);
                function closeTypeahead() {
                    var $input = $(this), typeahead;
                    if (typeahead = $input.data(typeaheadKey)) {
                        typeahead.close();
                    }
                }
            },
            val: function val(newVal) {
                return !arguments.length ? getVal(this.first()) : this.each(setVal);
                function setVal() {
                    var $input = $(this), typeahead;
                    if (typeahead = $input.data(typeaheadKey)) {
                        typeahead.setVal(newVal);
                    }
                }
                function getVal($input) {
                    var typeahead, query;
                    if (typeahead = $input.data(typeaheadKey)) {
                        query = typeahead.getVal();
                    }
                    return query;
                }
            },
            destroy: function destroy() {
                return this.each(unattach);
                function unattach() {
                    var $input = $(this), typeahead;
                    if (typeahead = $input.data(typeaheadKey)) {
                        typeahead.destroy();
                        $input.removeData(typeaheadKey);
                    }
                }
            }
        };
        $.fn.typeahead = function(method) {
            var tts;
            if (methods[method] && method !== "initialize") {
                tts = this.filter(function() {
                    return !!$(this).data(typeaheadKey);
                });
                return methods[method].apply(tts, [].slice.call(arguments, 1));
            } else {
                return methods.initialize.apply(this, arguments);
            }
        };
        $.fn.typeahead.noConflict = function noConflict() {
            $.fn.typeahead = old;
            return this;
        };
    })();
})(window.jQuery);




/*! bootstrap-timepicker v0.2.5 
* http://jdewit.github.com/bootstrap-timepicker 
* Copyright (c) 2013 Joris de Wit 
* MIT License 
*/!function(a,b,c){"use strict";var d=function(b,c){this.widget="",this.$element=a(b),this.defaultTime=c.defaultTime,this.disableFocus=c.disableFocus,this.disableMousewheel=c.disableMousewheel,this.isOpen=c.isOpen,this.minuteStep=c.minuteStep,this.modalBackdrop=c.modalBackdrop,this.orientation=c.orientation,this.secondStep=c.secondStep,this.showInputs=c.showInputs,this.showMeridian=c.showMeridian,this.showSeconds=c.showSeconds,this.template=c.template,this.appendWidgetTo=c.appendWidgetTo,this.showWidgetOnAddonClick=c.showWidgetOnAddonClick,this._init()};d.prototype={constructor:d,_init:function(){var b=this;this.showWidgetOnAddonClick&&(this.$element.parent().hasClass("input-append")||this.$element.parent().hasClass("input-prepend"))?(this.$element.parent(".input-append, .input-prepend").find(".add-on").on({"click.timepicker":a.proxy(this.showWidget,this)}),this.$element.on({"focus.timepicker":a.proxy(this.highlightUnit,this),"click.timepicker":a.proxy(this.highlightUnit,this),"keydown.timepicker":a.proxy(this.elementKeydown,this),"blur.timepicker":a.proxy(this.blurElement,this),"mousewheel.timepicker DOMMouseScroll.timepicker":a.proxy(this.mousewheel,this)})):this.template?this.$element.on({"focus.timepicker":a.proxy(this.showWidget,this),"click.timepicker":a.proxy(this.showWidget,this),"blur.timepicker":a.proxy(this.blurElement,this),"mousewheel.timepicker DOMMouseScroll.timepicker":a.proxy(this.mousewheel,this)}):this.$element.on({"focus.timepicker":a.proxy(this.highlightUnit,this),"click.timepicker":a.proxy(this.highlightUnit,this),"keydown.timepicker":a.proxy(this.elementKeydown,this),"blur.timepicker":a.proxy(this.blurElement,this),"mousewheel.timepicker DOMMouseScroll.timepicker":a.proxy(this.mousewheel,this)}),this.$widget=this.template!==!1?a(this.getTemplate()).on("click",a.proxy(this.widgetClick,this)):!1,this.showInputs&&this.$widget!==!1&&this.$widget.find("input").each(function(){a(this).on({"click.timepicker":function(){a(this).select()},"keydown.timepicker":a.proxy(b.widgetKeydown,b),"keyup.timepicker":a.proxy(b.widgetKeyup,b)})}),this.setDefaultTime(this.defaultTime)},blurElement:function(){this.highlightedUnit=null,this.updateFromElementVal()},clear:function(){this.hour="",this.minute="",this.second="",this.meridian="",this.$element.val("")},decrementHour:function(){if(this.showMeridian)if(1===this.hour)this.hour=12;else{if(12===this.hour)return this.hour--,this.toggleMeridian();if(0===this.hour)return this.hour=11,this.toggleMeridian();this.hour--}else this.hour<=0?this.hour=23:this.hour--},decrementMinute:function(a){var b;b=a?this.minute-a:this.minute-this.minuteStep,0>b?(this.decrementHour(),this.minute=b+60):this.minute=b},decrementSecond:function(){var a=this.second-this.secondStep;0>a?(this.decrementMinute(!0),this.second=a+60):this.second=a},elementKeydown:function(a){switch(a.keyCode){case 9:case 27:this.updateFromElementVal();break;case 37:a.preventDefault(),this.highlightPrevUnit();break;case 38:switch(a.preventDefault(),this.highlightedUnit){case"hour":this.incrementHour(),this.highlightHour();break;case"minute":this.incrementMinute(),this.highlightMinute();break;case"second":this.incrementSecond(),this.highlightSecond();break;case"meridian":this.toggleMeridian(),this.highlightMeridian()}this.update();break;case 39:a.preventDefault(),this.highlightNextUnit();break;case 40:switch(a.preventDefault(),this.highlightedUnit){case"hour":this.decrementHour(),this.highlightHour();break;case"minute":this.decrementMinute(),this.highlightMinute();break;case"second":this.decrementSecond(),this.highlightSecond();break;case"meridian":this.toggleMeridian(),this.highlightMeridian()}this.update()}},getCursorPosition:function(){var a=this.$element.get(0);if("selectionStart"in a)return a.selectionStart;if(c.selection){a.focus();var b=c.selection.createRange(),d=c.selection.createRange().text.length;return b.moveStart("character",-a.value.length),b.text.length-d}},getTemplate:function(){var a,b,c,d,e,f;switch(this.showInputs?(b='<input type="text" class="bootstrap-timepicker-hour" maxlength="2"/>',c='<input type="text" class="bootstrap-timepicker-minute" maxlength="2"/>',d='<input type="text" class="bootstrap-timepicker-second" maxlength="2"/>',e='<input type="text" class="bootstrap-timepicker-meridian" maxlength="2"/>'):(b='<span class="bootstrap-timepicker-hour"></span>',c='<span class="bootstrap-timepicker-minute"></span>',d='<span class="bootstrap-timepicker-second"></span>',e='<span class="bootstrap-timepicker-meridian"></span>'),f='<table><tr><td><a href="#" data-action="incrementHour"><i class="icon-chevron-up"></i></a></td><td class="separator">&nbsp;</td><td><a href="#" data-action="incrementMinute"><i class="icon-chevron-up"></i></a></td>'+(this.showSeconds?'<td class="separator">&nbsp;</td><td><a href="#" data-action="incrementSecond"><i class="icon-chevron-up"></i></a></td>':"")+(this.showMeridian?'<td class="separator">&nbsp;</td><td class="meridian-column"><a href="#" data-action="toggleMeridian"><i class="icon-chevron-up"></i></a></td>':"")+"</tr>"+"<tr>"+"<td>"+b+"</td> "+'<td class="separator">:</td>'+"<td>"+c+"</td> "+(this.showSeconds?'<td class="separator">:</td><td>'+d+"</td>":"")+(this.showMeridian?'<td class="separator">&nbsp;</td><td>'+e+"</td>":"")+"</tr>"+"<tr>"+'<td><a href="#" data-action="decrementHour"><i class="icon-chevron-down"></i></a></td>'+'<td class="separator"></td>'+'<td><a href="#" data-action="decrementMinute"><i class="icon-chevron-down"></i></a></td>'+(this.showSeconds?'<td class="separator">&nbsp;</td><td><a href="#" data-action="decrementSecond"><i class="icon-chevron-down"></i></a></td>':"")+(this.showMeridian?'<td class="separator">&nbsp;</td><td><a href="#" data-action="toggleMeridian"><i class="icon-chevron-down"></i></a></td>':"")+"</tr>"+"</table>",this.template){case"modal":a='<div class="bootstrap-timepicker-widget modal hide fade in" data-backdrop="'+(this.modalBackdrop?"true":"false")+'">'+'<div class="modal-header">'+'<a href="#" class="close" data-dismiss="modal">×</a>'+"<h3>Pick a Time</h3>"+"</div>"+'<div class="modal-content">'+f+"</div>"+'<div class="modal-footer">'+'<a href="#" class="btn btn-primary" data-dismiss="modal">OK</a>'+"</div>"+"</div>";break;case"dropdown":a='<div class="bootstrap-timepicker-widget dropdown-menu">'+f+"</div>"}return a},getTime:function(){return this.hour||this.minute||this.second?this.hour+":"+(1===this.minute.toString().length?"0"+this.minute:this.minute)+(this.showSeconds?":"+(1===this.second.toString().length?"0"+this.second:this.second):"")+(this.showMeridian?" "+this.meridian:""):""},hideWidget:function(){this.isOpen!==!1&&(this.$element.trigger({type:"hide.timepicker",time:{value:this.getTime(),hours:this.hour,minutes:this.minute,seconds:this.second,meridian:this.meridian}}),"modal"===this.template&&this.$widget.modal?this.$widget.modal("hide"):this.$widget.removeClass("open"),a(c).off("mousedown.timepicker, touchend.timepicker"),this.isOpen=!1,this.$widget.detach())},highlightUnit:function(){this.position=this.getCursorPosition(),this.position>=0&&this.position<=2?this.highlightHour():this.position>=3&&this.position<=5?this.highlightMinute():this.position>=6&&this.position<=8?this.showSeconds?this.highlightSecond():this.highlightMeridian():this.position>=9&&this.position<=11&&this.highlightMeridian()},highlightNextUnit:function(){switch(this.highlightedUnit){case"hour":this.highlightMinute();break;case"minute":this.showSeconds?this.highlightSecond():this.showMeridian?this.highlightMeridian():this.highlightHour();break;case"second":this.showMeridian?this.highlightMeridian():this.highlightHour();break;case"meridian":this.highlightHour()}},highlightPrevUnit:function(){switch(this.highlightedUnit){case"hour":this.showMeridian?this.highlightMeridian():this.showSeconds?this.highlightSecond():this.highlightMinute();break;case"minute":this.highlightHour();break;case"second":this.highlightMinute();break;case"meridian":this.showSeconds?this.highlightSecond():this.highlightMinute()}},highlightHour:function(){var a=this.$element.get(0),b=this;this.highlightedUnit="hour",a.setSelectionRange&&setTimeout(function(){b.hour<10?a.setSelectionRange(0,1):a.setSelectionRange(0,2)},0)},highlightMinute:function(){var a=this.$element.get(0),b=this;this.highlightedUnit="minute",a.setSelectionRange&&setTimeout(function(){b.hour<10?a.setSelectionRange(2,4):a.setSelectionRange(3,5)},0)},highlightSecond:function(){var a=this.$element.get(0),b=this;this.highlightedUnit="second",a.setSelectionRange&&setTimeout(function(){b.hour<10?a.setSelectionRange(5,7):a.setSelectionRange(6,8)},0)},highlightMeridian:function(){var a=this.$element.get(0),b=this;this.highlightedUnit="meridian",a.setSelectionRange&&(this.showSeconds?setTimeout(function(){b.hour<10?a.setSelectionRange(8,10):a.setSelectionRange(9,11)},0):setTimeout(function(){b.hour<10?a.setSelectionRange(5,7):a.setSelectionRange(6,8)},0))},incrementHour:function(){if(this.showMeridian){if(11===this.hour)return this.hour++,this.toggleMeridian();12===this.hour&&(this.hour=0)}return 23===this.hour?(this.hour=0,void 0):(this.hour++,void 0)},incrementMinute:function(a){var b;b=a?this.minute+a:this.minute+this.minuteStep-this.minute%this.minuteStep,b>59?(this.incrementHour(),this.minute=b-60):this.minute=b},incrementSecond:function(){var a=this.second+this.secondStep-this.second%this.secondStep;a>59?(this.incrementMinute(!0),this.second=a-60):this.second=a},mousewheel:function(b){if(!this.disableMousewheel){b.preventDefault(),b.stopPropagation();var c=b.originalEvent.wheelDelta||-b.originalEvent.detail,d=null;switch("mousewheel"===b.type?d=-1*b.originalEvent.wheelDelta:"DOMMouseScroll"===b.type&&(d=40*b.originalEvent.detail),d&&(b.preventDefault(),a(this).scrollTop(d+a(this).scrollTop())),this.highlightedUnit){case"minute":c>0?this.incrementMinute():this.decrementMinute(),this.highlightMinute();break;case"second":c>0?this.incrementSecond():this.decrementSecond(),this.highlightSecond();break;case"meridian":this.toggleMeridian(),this.highlightMeridian();break;default:c>0?this.incrementHour():this.decrementHour(),this.highlightHour()}return!1}},place:function(){if(!this.isInline){var c=this.$widget.outerWidth(),d=this.$widget.outerHeight(),e=10,f=a(b).width(),g=a(b).height(),h=a(b).scrollTop(),i=parseInt(this.$element.parents().filter(function(){}).first().css("z-index"),10)+10,j=this.component?this.component.parent().offset():this.$element.offset(),k=this.component?this.component.outerHeight(!0):this.$element.outerHeight(!1),l=this.component?this.component.outerWidth(!0):this.$element.outerWidth(!1),m=j.left,n=j.top;this.$widget.removeClass("timepicker-orient-top timepicker-orient-bottom timepicker-orient-right timepicker-orient-left"),"auto"!==this.orientation.x?(this.picker.addClass("datepicker-orient-"+this.orientation.x),"right"===this.orientation.x&&(m-=c-l)):(this.$widget.addClass("timepicker-orient-left"),j.left<0?m-=j.left-e:j.left+c>f&&(m=f-c-e));var o,p,q=this.orientation.y;"auto"===q&&(o=-h+j.top-d,p=h+g-(j.top+k+d),q=Math.max(o,p)===p?"top":"bottom"),this.$widget.addClass("timepicker-orient-"+q),"top"===q?n+=k:n-=d+parseInt(this.$widget.css("padding-top"),10),this.$widget.css({top:n,left:m,zIndex:i})}},remove:function(){a("document").off(".timepicker"),this.$widget&&this.$widget.remove(),delete this.$element.data().timepicker},setDefaultTime:function(a){if(this.$element.val())this.updateFromElementVal();else if("current"===a){var b=new Date,c=b.getHours(),d=b.getMinutes(),e=b.getSeconds(),f="AM";0!==e&&(e=Math.ceil(b.getSeconds()/this.secondStep)*this.secondStep,60===e&&(d+=1,e=0)),0!==d&&(d=Math.ceil(b.getMinutes()/this.minuteStep)*this.minuteStep,60===d&&(c+=1,d=0)),this.showMeridian&&(0===c?c=12:c>=12?(c>12&&(c-=12),f="PM"):f="AM"),this.hour=c,this.minute=d,this.second=e,this.meridian=f,this.update()}else a===!1?(this.hour=0,this.minute=0,this.second=0,this.meridian="AM"):this.setTime(a)},setTime:function(a,b){if(!a)return this.clear(),void 0;var c,d,e,f,g;"object"==typeof a&&a.getMonth?(d=a.getHours(),e=a.getMinutes(),f=a.getSeconds(),this.showMeridian&&(g="AM",d>12&&(g="PM",d%=12),12===d&&(g="PM"))):(g=null!==a.match(/p/i)?"PM":"AM",a=a.replace(/[^0-9\:]/g,""),c=a.split(":"),d=c[0]?c[0].toString():c.toString(),e=c[1]?c[1].toString():"",f=c[2]?c[2].toString():"",d.length>4&&(f=d.substr(4,2)),d.length>2&&(e=d.substr(2,2),d=d.substr(0,2)),e.length>2&&(f=e.substr(2,2),e=e.substr(0,2)),f.length>2&&(f=f.substr(2,2)),d=parseInt(d,10),e=parseInt(e,10),f=parseInt(f,10),isNaN(d)&&(d=0),isNaN(e)&&(e=0),isNaN(f)&&(f=0),this.showMeridian?1>d?d=1:d>12&&(d=12):(d>=24?d=23:0>d&&(d=0),13>d&&"PM"===g&&(d+=12)),0>e?e=0:e>=60&&(e=59),this.showSeconds&&(isNaN(f)?f=0:0>f?f=0:f>=60&&(f=59))),this.hour=d,this.minute=e,this.second=f,this.meridian=g,this.update(b)},showWidget:function(){if(!this.isOpen&&!this.$element.is(":disabled")){this.$widget.appendTo(this.appendWidgetTo);var b=this;a(c).on("mousedown.timepicker, touchend.timepicker",function(a){b.$element.parent().find(a.target).length||b.$widget.is(a.target)||b.$widget.find(a.target).length||b.hideWidget()}),this.$element.trigger({type:"show.timepicker",time:{value:this.getTime(),hours:this.hour,minutes:this.minute,seconds:this.second,meridian:this.meridian}}),this.place(),this.disableFocus&&this.$element.blur(),this.hour||(this.defaultTime?this.setDefaultTime(this.defaultTime):this.setTime("0:0:0")),"modal"===this.template&&this.$widget.modal?this.$widget.modal("show").on("hidden",a.proxy(this.hideWidget,this)):this.isOpen===!1&&this.$widget.addClass("open"),this.isOpen=!0}},toggleMeridian:function(){this.meridian="AM"===this.meridian?"PM":"AM"},update:function(a){this.updateElement(),a||this.updateWidget(),this.$element.trigger({type:"changeTime.timepicker",time:{value:this.getTime(),hours:this.hour,minutes:this.minute,seconds:this.second,meridian:this.meridian}})},updateElement:function(){this.$element.val(this.getTime()).change()},updateFromElementVal:function(){this.setTime(this.$element.val())},updateWidget:function(){if(this.$widget!==!1){var a=this.hour,b=1===this.minute.toString().length?"0"+this.minute:this.minute,c=1===this.second.toString().length?"0"+this.second:this.second;this.showInputs?(this.$widget.find("input.bootstrap-timepicker-hour").val(a),this.$widget.find("input.bootstrap-timepicker-minute").val(b),this.showSeconds&&this.$widget.find("input.bootstrap-timepicker-second").val(c),this.showMeridian&&this.$widget.find("input.bootstrap-timepicker-meridian").val(this.meridian)):(this.$widget.find("span.bootstrap-timepicker-hour").text(a),this.$widget.find("span.bootstrap-timepicker-minute").text(b),this.showSeconds&&this.$widget.find("span.bootstrap-timepicker-second").text(c),this.showMeridian&&this.$widget.find("span.bootstrap-timepicker-meridian").text(this.meridian))}},updateFromWidgetInputs:function(){if(this.$widget!==!1){var a=this.$widget.find("input.bootstrap-timepicker-hour").val()+":"+this.$widget.find("input.bootstrap-timepicker-minute").val()+(this.showSeconds?":"+this.$widget.find("input.bootstrap-timepicker-second").val():"")+(this.showMeridian?this.$widget.find("input.bootstrap-timepicker-meridian").val():"");this.setTime(a,!0)}},widgetClick:function(b){b.stopPropagation(),b.preventDefault();var c=a(b.target),d=c.closest("a").data("action");d&&this[d](),this.update(),c.is("input")&&c.get(0).setSelectionRange(0,2)},widgetKeydown:function(b){var c=a(b.target),d=c.attr("class").replace("bootstrap-timepicker-","");switch(b.keyCode){case 9:if(this.showMeridian&&"meridian"===d||this.showSeconds&&"second"===d||!this.showMeridian&&!this.showSeconds&&"minute"===d)return this.hideWidget();break;case 27:this.hideWidget();break;case 38:switch(b.preventDefault(),d){case"hour":this.incrementHour();break;case"minute":this.incrementMinute();break;case"second":this.incrementSecond();break;case"meridian":this.toggleMeridian()}this.setTime(this.getTime()),c.get(0).setSelectionRange(0,2);break;case 40:switch(b.preventDefault(),d){case"hour":this.decrementHour();break;case"minute":this.decrementMinute();break;case"second":this.decrementSecond();break;case"meridian":this.toggleMeridian()}this.setTime(this.getTime()),c.get(0).setSelectionRange(0,2)}},widgetKeyup:function(a){(65===a.keyCode||77===a.keyCode||80===a.keyCode||46===a.keyCode||8===a.keyCode||a.keyCode>=46&&a.keyCode<=57)&&this.updateFromWidgetInputs()}},a.fn.timepicker=function(b){var c=Array.apply(null,arguments);return c.shift(),this.each(function(){var e=a(this),f=e.data("timepicker"),g="object"==typeof b&&b;f||e.data("timepicker",f=new d(this,a.extend({},a.fn.timepicker.defaults,g,a(this).data()))),"string"==typeof b&&f[b].apply(f,c)})},a.fn.timepicker.defaults={defaultTime:"current",disableFocus:!1,disableMousewheel:!1,isOpen:!1,minuteStep:15,modalBackdrop:!1,orientation:{x:"auto",y:"auto"},secondStep:15,showSeconds:!1,showInputs:!0,showMeridian:!0,template:"dropdown",appendWidgetTo:"body",showWidgetOnAddonClick:!0},a.fn.timepicker.Constructor=d}(jQuery,window,document);




String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

var TextColumn = function(args) {
    this.args = args
    
    this.get_col_name = function() {
        return this.args.name;
    }
};


var ActionButton = React.createClass({
    getInitialState: function(){
        return {
            obj: this.props.obj,
            title: this.props.title,
            url: this.props.url,
            icon: this.props.icon
        }
    },

    render: function() {
        var col = this.state.col;
        var obj = this.state.obj;

        var url = this.state.url;
        if (typeof(url) == 'function'){
            url = url(obj)
        }

        var button_icon = '';
        if (this.state.icon) {
            button_icon = <span className={'glyphicon glyphicon-' + this.state.icon }></span>;
        }

        return <a href={url} className="btn btn-default">{ button_icon}&nbsp;{ this.state.title }</a>;
    }
});


var ActionGroup = React.createClass({
    getInitialState: function() {
        return {button_defs: this.props.button_defs}
    },

    render: function() {
        var buttons = this.state.button_defs.map(function (button) {
            return <ActionButton title={button.title} url={button.url} icon={button.icon} />
        });
        return <div className="btn-group btn-group" role="group" aria-label="...">{buttons}</div>
    }


});

var ActionColumn = React.createClass({
    getInitialState: function(){
        return {
            col: this.props.col,
            obj: this.props.obj,
            button_defs: this.props.button_defs
        }
    },

    render: function() {
        var col = this.state.col;
        var obj = this.state.obj;

        var buttons = this.state.button_defs.map(function (button) {
            return <ActionButton obj={obj} title={button.title} url={button.url} icon={button.icon} />
        });

        return <div className="btn-group btn-group-xs" role="group" aria-label="...">{buttons}</div>
    }

});

var SimpleColumn = React.createClass({
    getInitialState: function(){
        return {col: this.props.col, obj: this.props.obj}
    },

    render: function() {
        var col = this.state.col;
        var obj = this.state.obj;
        return <span>{ obj[col] }</span>;
    }
});

var DataList = React.createClass(
    {
        render : function() {
            var rowNodes;

            var columns = this.props.columns
            var grid = this.props.grid;

            if (this.props.data.results != undefined) {
                rowNodes = this.props.data.results.map(function (obj) {
                    var columnNodes = columns.map(function (col) {
                        var _widget = SimpleColumn;
                        var props = {col: col, obj: obj}

                        if (grid.state.column_widgets && grid.state.column_widgets[col]) {
                            _widget = grid.state.column_widgets[col];
                        }

                        var widget = React.createElement(_widget, props);

                        


                        if (col == 'actions') {
                            props['button_defs'] = grid.state.inline_actions
                            widget = React.createElement(ActionColumn, props)
                        }
                        return <td>{ widget }</td>;
                    });
                    return (<tr>{ columnNodes }</tr>);
                });
            }

            return  <tbody>{ rowNodes }</tbody>;
        }
});

var DataTableMixin = {
    filter_by_name : function(e) {

        var term = e.target.value;

        this.setState({data:[]}); // This forces the table to render empty...

        $.ajax({
            url: this.state.resource_url + '?q=' + term,
            dataType: 'json',
            success:  function(data) {
                this.setState({data:data});
                
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.state.resource_url, status, err.toString());
            }.bind(this)
            
        });

    },
    componentDidMount: function(){
        $.ajax({
            url: this.state.resource_url,
            dataType: 'json',
            success:  function(data) {
                this.setState({data:data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.state.resource_url, status, err.toString());
            }.bind(this)
            
        });
    },
    
    render_templatexxx: function() {
        var columnNodes = this.state.columns.map(function (col) {
            return <th>{ col }</th>
        });

        return <div>
            <div>
                <div className="pull-right">
                    

                <form className="form-inline" role="form">
                    <div className="form-group">
                        <div className="input-group">
                              <label className="sr-only" for="exampleInputEmail2">Email address</label>
                              <input type="email" className="form-control" id="exampleInputEmail2" placeholder="Filter by Name" onChange={this.filter_by_name} />
                              </div>

                  </div>

                 </form>
                </div>
                
                <div className="pull-left">
                    <ActionGroup button_defs={this.state.global_actions  }/>
                </div>

                
            </div>

            <table className="table table-hover table-striped table-compressed">
                <thead>
                    <tr>
                    { columnNodes }
                    </tr>
                </thead>
                <DataList data={this.state.data} columns={ this.state.columns } grid={ this } />
            </table>
        </div>;
    }
}


var VenuesGrid = React.createClass({
    /* Grid of Venues */
    mixins: [DataTableMixin],

    getInitialState: function(){
        var state = {'data': [], 'resource_url': '/api/galleries'};
        state['columns'] = ['name', 'category', 'actions'];
        
        state['inline_actions'] = [
            {
                'title': 'Google',
                'url': 'http://google.com',
                'icon': 'eye-open'
            },
            {
                title: 'Edit',
                url: function(obj){ return '/admin/venues/' + obj.resource_id + '/edit'; },
                icon: 'pencil'
            },
        ];

        state['global_actions'] = [
            {
                title: 'Add Venue',
                url: '/admin/venues/create',
                icon: 'map-marker'
            },  
        ];

        return state;
    },

    render: function() {
        return <div><h2>Venues</h2>{this.render_templatexxx()}</div>
    }
});
mainApp.value('VenuesGrid', VenuesGrid);



var EventDateColumn = React.createClass({
    getInitialState: function(){
        return {col: this.props.col, obj: this.props.obj}
    },

    render: function() {
        var col = this.state.col;
        var obj = this.state.obj;

        var rendered_event_dates = '';

        if (obj.event_dates) {            
            rendered_event_dates = obj.event_dates.map(function (ed) {
                return <div className="small">
                { ed.category } -
                "{ ed.label }" - 
                { moment(ed.start).format('lll') }  - { moment(ed.end).format('lll') } 
                @ <a href={'/admin/venues/' + ed.venue.resource_id  + '/edit'}>{ ed.venue.name }</a></div>
            });
        }

        return <span>{rendered_event_dates}</span>;
    }
});


var EventsGrid = React.createClass({
    /* Grid of Events */
    mixins: [DataTableMixin],

    getInitialState: function(){
        var state = {'data': [], 'resource_url': '/api/events'};
        state['columns'] = ['name', 'category', 'actions'];

        state['global_actions'] = [
            {
                title: 'Add Event',
                url: '/admin/events/create',
                icon: 'calendar'
            },  
        ];
        state['inline_actions'] = [
            {
                title: 'Edit',
                url: function(obj){ return '/admin/events/' + obj.resource_id + '/edit'; },
                icon: 'pencil'
            },  
        ];

        state['column_widgets'] = {
            'category': EventDateColumn
        }
        

        return state;
    },

    render: function() {
        return <div><h2>Events</h2>{this.render_templatexxx()}</div>
    }
});
mainApp.value('EventsGrid', EventsGrid);




////////////////////////////

BaseWidgetMixin = {
    getInitialState: function() {
        var id = this.props.id;
        var label = this.props.id.capitalize();
        if (this.props.label) {
            label = this.props.label;
        }

        state = {
            'label': label,
            'field_id': id,
            'classes': this.props.classes,
            'placeholder': this.props.placeholder,
            'val': this.props.val,
            'form': this.props.form
        }

        if (typeof(this.addState) == 'function'){
            return this.addState(state);
        }

        return state
    },
     getValue: function() {
        if (typeof(this._getValue) == 'function') {
            return this._getValue();
        }
        return this.refs.input.getDOMNode().value;
     },
      handleChange: function(event) {
          if (typeof(this._handleChange) == 'function') {
              return this._handleChange();
          }
          else {
              this.setState({val: event.target.value});
          }
          
     },
    onBlur: function(e){
        var value = this.getValue();
        var error;
        if (this.props.required && !value)
            error = 'required';
        else if (this.props.oneOf && !(value in this.props.oneOf))
            error = 'oneOf';
        else if (this.props.minLength && value.length < this.props.minLength)
            error = 'minLength';
        this.setState({error: error});
    },

    onFocus: function(e) {
        this.setState({error: false});
        e.stopPropagation();
    },
};

CheckboxWidget = React.createClass({
    mixins: [BaseWidgetMixin],

    addState: function(state) {
        state['choices'] = this.props.choices
        return state;
    },

    _getValue: function() {
        /* This should be run after state chnage???? maybe...*/

        
        for (ref in this.refs) {
            if (this.refs[ref].props.checked) {
                return this.refs[ref].getDOMNode().value;
            }
        }

        return ''
    },
    render: function(){
        var choices_rendered;
        var handleChange = this.handleChange;
        var i = 0;
        var cur_state_val = this.state.val;
        var name = this.state.field_id;

        if (this.state.choices && this.state.choices.length > 0) {
            choices_rendered = this.state.choices.map(function (choice_pair) {
                i += 1;
                var checked = choice_pair[0] == cur_state_val;

                return <div><label><input onChange={handleChange} type="radio" ref={'checkbox_' + i} name={name} checked={checked} value={ choice_pair[0] } onBlur={this.onBlur} onFocus={this.onFocus} /> { choice_pair[1] }</label></div>
            });
        }

        return <div>{ choices_rendered }</div>;
    }
    
    
    
});


AutoCompleteWidget = React.createClass({
    mixins: [BaseWidgetMixin],

    addState: function(state) {
        state['choices'] = [['fart', 'fart'], ['goat', 'goat']]
        return state;
    },

    render: function(){
        var choices_rendered;

        if (this.state.choices && this.state.choices.length > 0) {
            choices_rendered = this.state.choices.map(function (choice_pair) {
                return <option value={ choice_pair[0] }>{ choice_pair[1] }</option>;
            });
        }

        var input = <input value={this.state.val} ref="input" className="form-control" onChange={this.handleChange} onBlur={this.onBlur} onFocus={this.onFocus} />;
        
        return input;
    },

    componentDidMount: function() {
      $(this.getDOMNode()).typeahead(null,
      {
        name: 'states',
        displayKey: 'value',
        remote: '/api/galleries',
        source: function(term, cb){
            $.ajax({
                url: '/api/galleries?q=' + term,
                dataType: 'json',
                success:  function(data) {
                    var results = data.results.map(function(resource){
                        return { value: resource.slug }
                    });
                    
                    
                    cb(results)

                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(status, err.toString());
                }.bind(this)

            });
        }
     });
    }

});

SelectWidget = React.createClass({
    mixins: [BaseWidgetMixin],

    addState: function(state) {
        state['choices'] = this.props.choices
        return state;
    },

    render: function(){
        var choices_rendered;

        if (this.state.choices && this.state.choices.length > 0) {
            choices_rendered = this.state.choices.map(function (choice_pair) {
                return <option value={ choice_pair[0] }>{ choice_pair[1] }</option>;
            });
        }

        return <select value={this.state.val} ref="input" className="form-control" onChange={this.handleChange} onBlur={this.onBlur} onFocus={this.onFocus}>{ choices_rendered }</select>;
    }
});


InputWidget = React.createClass({
    /* General Input Widget */

    mixins: [BaseWidgetMixin],

    render: function() {
        var id = this.state.field_id;
        var label = this.state.label;
        var classes = this.state.classes || "";
        var placeholder = this.state.placeholder || "";
        var val = this.state.val;

        return <input type="text" className={ 'form-control ' + classes } id={'id_' +  id } placeholder={ placeholder } value={ this.state.val } onChange={this.handleChange} onBlur={this.onBlur} onFocus={this.onFocus} ref="input" />;
    }
});


BaseField  = {
    /* Base Rest Field Type */

    getInitialState: function() {
        var id = this.props.id;
        var label = this.props.id.capitalize();
        if (this.props.label) {
            label = this.props.label;
        }

        var widget = InputWidget;
        if (this.props.widget) {
            widget = this.props.widget
        }

        var val = this.props.val;
        if (!val && this.props.defaultValue) {
            val = this.props.defaultValue;
        }

        return {
            'label': label,
            'field_id': id,
            'classes': this.props.classes,
            'placeholder': this.props.placeholder,
            'val': val,
            'form': this.props.form,
            'widget': widget
        }
    },
    toResource: function(field_value) {
        /* Pull raw form date into a REST resource format */

         if (typeof(this.toResourceX) == 'function'){
             return this.toResourceX(field_value);
         }

         if (!field_value) {
             console.log(this.refs.widget); 
             field_value = this.getValue(field_value);
         }

         return field_value;
     },

     fromResource: function() {

         if (typeof(this.fromResourceX) == 'function'){
             return this.fromResourceX();
         }
         
         return this.state.val;
     },

      handleChange: function(event) {
          var value = this.getValue();

          alert('sfsdfsd');

          if (typeof(this._handleChange) == 'function') {
              value = this._handleChange(value);
          }
          else {
              value = event.target.value;
          }

          this.setState({val: this.toResource(value)});
     },

     getValue: function() {
         /* Get value of specific field.. if you have more than one input or need custom
            rendering, implement your own.
         */
        return this.refs.widget.getValue();
     },

    onBlur: function(e){
        var value = this.getValue();
        var error;
        if (this.props.required && !value)
            error = 'required';
        else if (this.props.oneOf && !(value in this.props.oneOf))
            error = 'oneOf';
        else if (this.props.minLength && value.length < this.props.minLength)
            error = 'minLength';
        this.setState({error: error});
    },

    onFocus: function(e) {
        this.setState({error: false});
        e.stopPropagation();
    },
    render: function() {

        var id = this.state.field_id;
        var label = this.state.label;
        var classes = this.state.classes || "";
        var placeholder = this.state.placeholder || "";
        var val = this.state.val;

        var props = {id: id, field: this, form: this.state.form, ref: "widget", val: this.fromResource()}

        if (this.props.choices) {
            props['choices'] = this.props.choices
        }
        var widget = React.createElement(this.state.widget, props);

        return <div className="form-group">
             <label htmlFor={'id_' +  id } className="col-sm-2 control-label">{ label }</label>
             <div className="col-sm-10">
                 { widget }
             </div>
        </div>;
    }
};


ChoiceField = React.createClass({
    mixins: [BaseField],
});

TextField = React.createClass({
    mixins: [BaseField],
});


DateRangeWidget = React.createClass({
    /* General Input Widget */

    mixins: [BaseWidgetMixin],

    _getValue: function() {
        /* Called on blur */
        console.log('in DateRangeWidget._getValue');

        field_value =  this.refs.date_input.getDOMNode().value + ' ' + this.refs.time_input.getDOMNode().value;

        console.log(field_value);
        return field_value;
    },
    _handleChange: function(value){
        
        /* TODO: This is where we can detect if this date is valid or not... */
        var time_val = this.refs.time_input.getDOMNode().value;
        var is_time_valid = moment('2010-10-10 ' + time_val).isValid();
        
        if (is_time_valid) {
        
            field_value =  this.refs.date_input.getDOMNode().value + ' ' + this.refs.time_input.getDOMNode().value;
            this.setState({val: field_value});
        }
        else {
            console.log('Time is not valud...');
        }
    },

    toResourceX: function(field_value) {
        /* Pull raw form date into a REST resource format */
        if (!field_value) {
            field_value = this.refs.date_input.getDOMNode().value + ' ' + this.refs.time_input.getDOMNode().value;
            
            console.log(field_value);
        }
        if (!field_value) {
            return "";
        }

        console.log('hereherehere')

        return field_value;
    },

    fromResourceX: function() {
        /* Push REST resource format into a Form value */
        console.log('hrm????');

        var val = this.state.val;
        if (!val) {
            return '';
        }
        console.log('this is not implemented yet...');
        //date_input
        return 'xxxxxxxx'; // val.lat + ',' + val.lon;
    },

    componentDidMount: function() {
      var date_input = $(this.refs.date_input.getDOMNode());
      var time_input = $(this.refs.time_input.getDOMNode());
      var react_element = this;
      
      $(date_input).datepicker({ format: 'YYYY-MM-DD', autoSize: true }).on('changeDate', function(ev){
          react_element.getValue();
          react_element.handleChange();
      });
  
       console.log(time_input);
       
       // time inputs
      $(time_input).timepicker(
          {defaultTime: false, disableFocus: true})
          .on('changeTime.timepicker', function(e) { 
                react_element.getValue();
                react_element.handleChange();

                console.log(react_element.setState({val: react_element.getValue()}))

      }); 


    },
    show_icon: function() {
        var date_input = $(this.refs.date_input.getDOMNode());
        $(date_input).datepicker('show');

    },
    show_time: function() {

        var time_input = $(this.refs.time_input.getDOMNode());
        $(time_input).timepicker('showWidget');

    },

    render: function() {

        var id = this.state.field_id;
        var label = this.state.label;
        var classes = this.state.classes || "";
        var placeholder = this.state.placeholder || "";
        var val = this.state.val;
        var date_type = this.state.form.refs['field.type'].state.val;

        date_obj = moment(val)

        var show_time = true;
        var time_val = date_obj.format('h:mm a');
        var date_val = date_obj.format('YYYY-MM-DD');

        if ((date_type == 'reoccurring' || date_type == '') || time_val == '12:00 am') {
            show_time = false;
            time_val = '';
        }

        console.log('rendering...')

        return <div className="form-group has-feedback">
                <div className="col-sm-3 input-append date">
                    <input type="text" className={ 'form-control has-success has-feedback ' + classes } id={'id_' +  id } placeholder={ placeholder } value={ date_val } onChange={this.handleChange} onBlur={this.onBlur} onFocus={this.onFocus} ref="date_input" />
                    <span className="glyphicon glyphicon-calendar form-control-feedback" aria-hidden="true" onClick={this.show_icon}></span>
                </div>

                <div className="col-sm-3 input-append bootstrap-timepicker">
                    <input type="text" className={ 'form-control ' + classes } id={'id_' +  id } placeholder={ placeholder } value={ time_val } onChange={this.handleChange} onBlur={this.onBlur} onFocus={this.onFocus} ref="time_input" placeholder="Add Time?" />
                <span className="glyphicon glyphicon-time form-control-feedback" aria-hidden="true" onClick={this.show_time}></span>
                </div>
            </div>;
    }
});



DateTimeField = React.createClass({
    mixins: [BaseField],

    _getValue: function(){
      return 'zorpdorp';
    },

    toResourceX: function(field_value) {
        if (!field_value) {

            console.log('-------------jesus party------------------');
            field_value = this.refs.widget.toResourceX();

            console.log(field_value);

            console.log('------------------------------------------');

            //field_value = 'zebradicks';
        }

        if (!field_value) {
            return "";
        }

        date_obj = moment(field_value); // string is local format
        date_obj.local().utc() //2014-11-15T01:00:00Z

        console.log('---------------xx-x---')
        console.log(date_obj)
        
        return date_obj.format('YYYY-MM-DD[T]HH:mm:ss[Z]')

    },

    fromResourceX: function() {
        // convert to local time for display...

        var date_obj = moment(this.state.val);
        return date_obj.format('lll');
    },    

});


GeoPtField = React.createClass({
    mixins: [BaseField],
    toResourceX: function(field_value) {
        /* Pull raw form date into a REST resource format */
        if (!field_value) {
            field_value = this.getValue();
        }
        if (!field_value) {
            return "";
        }
        var vals = field_value.split(',');
        return {lat: vals[0], lon: vals[1]};
    },

    fromResourceX: function() {
        /* Push REST resource format into a Form value */

        var val = this.state.val;
        if (!val) {
            return '';
        }

        return val.lat + ',' + val.lon;
    }
});


VenuesForm = React.createClass({
    propTypes: {
      resource_url: React.PropTypes.string.isRequired,
      is_edit: React.PropTypes.bool.isRequired
    },

    componentDidMount: function(){
        if (this.state.is_edit) {
            $.ajax({
                url: this.props.resource_url,
                dataType: 'json',
                success:  function(data) {
                    this.setState({data:data});
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.resource_url, status, err.toString());
                }.bind(this)
            });
        }
    },

    getInitialState: function(){
        return {
            save_callback: this.props.save_callback,
            errors: [],
            is_edit: this.props.is_edit,
            data: {'results': {}}
        }
    },

    submitHandler: function(e) {
        var method;

        e.preventDefault();
        e.stopPropagation();

        var restData = {};
        // We need to iterate over all of the rest fields in refs and evaluate them
        // to rest acceptable values (toResource()).

        for (ref in this.refs){
            if (ref.indexOf("field.") == 0) {
                restData[this.refs[ref].state.field_id] = this.refs[ref].toResource();
            }
        }

        method = 'POST';
        if (this.state.is_edit) {
            method = 'PUT';
        }        
        
        // Send Ajax Payload
        $.ajax({
            url: this.props.resource_url,
            type: method,
            dataType: 'json',
            data: JSON.stringify(restData),
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success:  function(data) {
                this.state.save_callback();
            }.bind(this),

            error: function(xhr, status, err) {
                error_body = JSON.parse(xhr.responseText);

                this.setState({errors: error_body.messages}); //messages is always a list

                console.error(this.state.resource_url, status, err.toString());
                
            }.bind(this) 
        });

    },
    render: function(){
        if (this.state.is_edit && !this.state.data.results.name) {
            return <div>Loading...</div>
        }

        var rendered_errors = this.state.errors.map(function (obj) {
            return obj.toString();
        });
        var errors = <p className="bg-danger">{ rendered_errors }</p>;

        var category_choices = [
            ['museum', 'museum'],
            ['gallery', 'gallery'],
            ['business', 'business'],
            ['public', 'public'],
            ['private', 'private'],
            ['studios', 'studios']
        ];

        return <form role="form" className="form-horizontal" action="#" onSubmit={this.submitHandler}>
            { errors }
          <TextField id="name"  ref="field.name" val={this.state.data.results.name } form={this} placeholder="Enter Venue Name"/>
          <TextField id="slug" form={this}  ref="field.slug"  val={this.state.data.results.slug } />
          <ChoiceField id="category" form={this} ref="field.category"  val={this.state.data.results.category } widget={CheckboxWidget} choices={category_choices} />
          <TextField id="address" form={this}  ref="field.address"  val={this.state.data.results.address } />
          <TextField id="address2" form={this}  ref="field.address2"  val={this.state.data.results.address2 } />
          <TextField id="city" form={this}  ref="field.city" val={this.state.data.results.city }   defaultValue="Minneapolis" />
          <TextField id="state" form={this}  ref="field.state"  val={this.state.data.results.state } defaultValue="MN" />
          <TextField id="country" form={this} ref="field.country"  val={this.state.data.results.country } defaultValue="USA"/>
          <GeoPtField id="geo" form={this} ref="field.geo"  val={this.state.data.results.geo } />
          <TextField id="phone" form={this} ref="field.phone"  val={this.state.data.results.phone } />
          <TextField id="email" form={this} ref="field.email"  val={this.state.data.results.email } />
          <TextField id="website" form={this} ref="field.website"  val={this.state.data.results.website } />

          <div className="pull-right">
              <button type="submit" className="btn btn-primary">Submit</button>
              &nbsp;
              &nbsp;
              <a href="/admin/venues/" className="small">cancel</a>
         </div>
        </form> 
    }
    
})

mainApp.value('VenuesForm', VenuesForm);


EventDateForm =  React.createClass({
    toResource: function() {
        return {
            'label': this.refs['field.label'].toResource(),
            'category': this.refs['field.category'].toResource(),
            'start': this.refs['field.start'].toResource(),
            'end': this.refs['field.end'].toResource(),
            'type': this.refs['field.type'].toResource(),
            'venue_slug': this.refs['field.venue_slug'].toResource()
        }
    },
    getInitialState: function() {
        return {
            data: this.props.event_date,
            prefix: this.props.prefix
        }
    },    
    render: function() {

        var category_choices = [
            ['reception', 'Reception/Opening/Closing aka "Concise" Event'],
            ['ongoing', 'Ongoing Event'],
            ['sale', 'Sale - separate category etc'],
            ['hours', 'Gallery/Display Hours (maps to venue hours)'],
        ];

        return <div id={'event_date_container_' + this.state.prefix}>
        <hr />
        <TextField id="type"  ref="field.type" val={this.state.data.type } form={this} />
        <TextField id="label"  ref="field.label" val={this.state.data.label } form={this} />
        <DateTimeField id="start" form={this}  ref="field.start"  val={this.state.data.start } widget={DateRangeWidget} />
        <DateTimeField id="end" form={this}  ref="field.end"  val={this.state.data.end }  widget={DateRangeWidget} />

        <ChoiceField id={'category' + this.state.prefix} form={this} ref="field.category"  val={this.state.data.category } widget={CheckboxWidget} choices={category_choices} />
          
        <ChoiceField id="venue_slug"  ref="field.venue_slug" val={this.state.data.venue_slug } form={this} widget={AutoCompleteWidget}/>
        </div>
    }
});

EventDateFormsInterface = React.createClass({

    getValue: function() {
        /* Get value of specific field.. if you have more than one input or need custom
           rendering, implement your own.
        */
       results = []
 
       var i = 1;
       for (ref in this.refs) {
           results.push(this.refs[ref].toResource());
       }
       
       return results
       return this.refs.input.getValue();
    },

    toResource: function(field_value) {
        if (!field_value) {
            field_value = this.getValue(field_value);
        }
        else {
            console.log('why is this called??');
        }

        return field_value;        
    },

    getInitialState: function() {

        state = { field_id: 'event_dates', form: this.props.form };

        if (this.props.val && this.props.val.length > 0) {
            state.event_dates = this.props.val;
        } else {
            state.event_dates = [{}];
        }
        
        return state;  
    },

    addEventDate: function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        new_event_dates = this.state.event_dates.concat({});
        this.setState({event_dates: new_event_dates})
    },

    render: function() {

        var i = 0;
        var rendered_forms = this.state.event_dates.map(function (event_date) {
            i += 1;
            return <EventDateForm event_date={ event_date } ref={'ed_' + i} prefix={i} />;
        });

        return <div>
                <label className="col-sm-2 control-label">Dates (<a href=""  onClick={this.addEventDate}>add</a>)</label>
                <div className="col-sm-10">{ rendered_forms }</div>
            </div>;


    }
});

EventsForm = React.createClass({
    propTypes: {
      resource_url: React.PropTypes.string.isRequired,
      is_edit: React.PropTypes.bool.isRequired
    },

    componentDidMount: function(){
        if (this.state.is_edit) {
            $.ajax({
                url: this.props.resource_url,
                dataType: 'json',
                success:  function(data) {
                    this.setState({data:data});
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.resource_url, status, err.toString());
                }.bind(this)
            });
        }
    },
    getInitialState: function(){
        return {
            save_callback: this.props.save_callback,
            errors: [],
            is_edit: this.props.is_edit,
            data: {'results': {}}
        }
    },
    submitHandler: function(e) {
        var method;

        e.preventDefault();
        e.stopPropagation();

        var restData = {};
        // We need to iterate over all of the rest fields in refs and evaluate them
        // to rest acceptable values (toResource()).

        for (ref in this.refs){
            if (ref.indexOf("field.") == 0) {
                restData[this.refs[ref].state.field_id] = this.refs[ref].toResource();
            }
        }

        console.log(restData)
        console.log('PREVENTING FORM FROM SUBMITTING...')

        method = 'POST';
        if (this.state.is_edit) {
            method = 'PUT';
        }        
        
        // Send Ajax Payload
        $.ajax({
            url: this.props.resource_url,
            type: method,
            dataType: 'json',
            data: JSON.stringify(restData),
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success:  function(data) {
                this.state.save_callback();
            }.bind(this),

            error: function(xhr, status, err) {
                error_body = JSON.parse(xhr.responseText);

                this.setState({errors: error_body.messages}); //messages is always a list

                console.error(this.state.resource_url, status, err.toString());
                
            }.bind(this) 
        });

    },
    render: function(){
        if (this.state.is_edit && !this.state.data.results.name) {
            return <div>Loading...</div>
        }

        var rendered_errors = this.state.errors.map(function (obj) {
            return obj.toString();
        });
        var errors = <p className="bg-danger">{ rendered_errors }</p>;

        var category_choices = [
            ['museum', 'museum'],
            ['gallery', 'gallery'],
            ['business', 'business'],
            ['public', 'public'],
            ['private', 'private'],
            ['studios', 'studios']
        ];


        var event_date_forms = '';
        
        return <form role="form" className="form-horizontal" action="#" onSubmit={this.submitHandler}>
            { errors }
          <TextField id="name"  ref="field.name" val={this.state.data.results.name } form={this} placeholder="Enter Venue Name"/>
          <TextField id="slug" form={this}  ref="field.slug"  val={this.state.data.results.slug } />
          <TextField id="url" form={this} ref="field.url"  val={this.state.data.results.url } />
          <EventDateFormsInterface id="event_dates" form={this}  ref="field.event_dates"  val={this.state.data.results.event_dates } />


          <div className="pull-right">
              <button type="submit" className="btn btn-primary">Submit</button>
              &nbsp;
              &nbsp;
              <a href="/admin/events/" className="small">cancel</a>
         </div>
        </form> 
    }
    
})

mainApp.value('EventsForm', EventsForm);