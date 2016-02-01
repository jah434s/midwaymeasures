﻿/*
 AngularJS v1.4.7
 (c) 2010-2015 Google, Inc. http://angularjs.org
 License: MIT
*/
(function (G, t, Ra) {
    'use strict'; function va(a, b, c) { if (!a) throw ngMinErr("areq", b || "?", c || "required"); return a } function wa(a, b) { if (!a && !b) return ""; if (!a) return b; if (!b) return a; W(a) && (a = a.join(" ")); W(b) && (b = b.join(" ")); return a + " " + b } function Ha(a) { var b = {}; a && (a.to || a.from) && (b.to = a.to, b.from = a.from); return b } function S(a, b, c) { var d = ""; a = W(a) ? a : a && M(a) && a.length ? a.split(/\s+/) : []; q(a, function (a, u) { a && 0 < a.length && (d += 0 < u ? " " : "", d += c ? b + a : a + b) }); return d } function Ia(a) {
        if (a instanceof J) switch (a.length) {
            case 0: return [];
            case 1: if (1 === a[0].nodeType) return a; break; default: return J(la(a))
        } if (1 === a.nodeType) return J(a)
    } function la(a) { if (!a[0]) return a; for (var b = 0; b < a.length; b++) { var c = a[b]; if (1 == c.nodeType) return c } } function Ja(a, b, c) { q(b, function (b) { a.addClass(b, c) }) } function Ka(a, b, c) { q(b, function (b) { a.removeClass(b, c) }) } function P(a) { return function (b, c) { c.addClass && (Ja(a, b, c.addClass), c.addClass = null); c.removeClass && (Ka(a, b, c.removeClass), c.removeClass = null) } } function ha(a) {
        a = a || {}; if (!a.$$prepared) {
            var b = a.domOperation ||
            L; a.domOperation = function () { a.$$domOperationFired = !0; b(); b = L }; a.$$prepared = !0
        } return a
    } function da(a, b) { xa(a, b); ya(a, b) } function xa(a, b) { b.from && (a.css(b.from), b.from = null) } function ya(a, b) { b.to && (a.css(b.to), b.to = null) } function Q(a, b, c) {
        var d = (b.addClass || "") + " " + (c.addClass || ""), g = (b.removeClass || "") + " " + (c.removeClass || ""); a = La(a.attr("class"), d, g); c.preparationClasses && (b.preparationClasses = X(c.preparationClasses, b.preparationClasses), delete c.preparationClasses); d = b.domOperation !== L ? b.domOperation :
        null; za(b, c); d && (b.domOperation = d); b.addClass = a.addClass ? a.addClass : null; b.removeClass = a.removeClass ? a.removeClass : null; return b
    } function La(a, b, c) {
        function d(a) { M(a) && (a = a.split(" ")); var b = {}; q(a, function (a) { a.length && (b[a] = !0) }); return b } var g = {}; a = d(a); b = d(b); q(b, function (a, b) { g[b] = 1 }); c = d(c); q(c, function (a, b) { g[b] = 1 === g[b] ? null : -1 }); var u = { addClass: "", removeClass: "" }; q(g, function (b, c) { var g, d; 1 === b ? (g = "addClass", d = !a[c]) : -1 === b && (g = "removeClass", d = a[c]); d && (u[g].length && (u[g] += " "), u[g] += c) });
        return u
    } function H(a) { return a instanceof t.element ? a[0] : a } function Ma(a, b, c) { var d = ""; b && (d = S(b, "ng-", !0)); c.addClass && (d = X(d, S(c.addClass, "-add"))); c.removeClass && (d = X(d, S(c.removeClass, "-remove"))); d.length && (c.preparationClasses = d, a.addClass(d)) } function ia(a, b) { var c = b ? "-" + b + "s" : ""; ea(a, [fa, c]); return [fa, c] } function ma(a, b) { var c = b ? "paused" : "", d = T + "PlayState"; ea(a, [d, c]); return [d, c] } function ea(a, b) { a.style[b[0]] = b[1] } function X(a, b) { return a ? b ? a + " " + b : a : b } function Aa(a, b, c) {
        var d = Object.create(null),
        g = a.getComputedStyle(b) || {}; q(c, function (a, b) { var c = g[a]; if (c) { var f = c.charAt(0); if ("-" === f || "+" === f || 0 <= f) c = Na(c); 0 === c && (c = null); d[b] = c } }); return d
    } function Na(a) { var b = 0; a = a.split(/\s*,\s*/); q(a, function (a) { "s" == a.charAt(a.length - 1) && (a = a.substring(0, a.length - 1)); a = parseFloat(a) || 0; b = b ? Math.max(a, b) : a }); return b } function na(a) { return 0 === a || null != a } function Ba(a, b) { var c = N, d = a + "s"; b ? c += "Duration" : d += " linear all"; return [c, d] } function Ca() {
        var a = Object.create(null); return {
            flush: function () { a = Object.create(null) },
            count: function (b) { return (b = a[b]) ? b.total : 0 }, get: function (b) { return (b = a[b]) && b.value }, put: function (b, c) { a[b] ? a[b].total++ : a[b] = { total: 1, value: c } }
        }
    } function Da(a, b, c) { q(c, function (c) { a[c] = U(a[c]) ? a[c] : b.style.getPropertyValue(c) }) } var L = t.noop, za = t.extend, J = t.element, q = t.forEach, W = t.isArray, M = t.isString, oa = t.isObject, pa = t.isUndefined, U = t.isDefined, Ea = t.isFunction, qa = t.isElement, N, ra, T, sa; pa(G.ontransitionend) && U(G.onwebkittransitionend) ? (N = "WebkitTransition", ra = "webkitTransitionEnd transitionend") :
    (N = "transition", ra = "transitionend"); pa(G.onanimationend) && U(G.onwebkitanimationend) ? (T = "WebkitAnimation", sa = "webkitAnimationEnd animationend") : (T = "animation", sa = "animationend"); var ja = T + "Delay", ta = T + "Duration", fa = N + "Delay"; G = N + "Duration"; var Oa = { transitionDuration: G, transitionDelay: fa, transitionProperty: N + "Property", animationDuration: ta, animationDelay: ja, animationIterationCount: T + "IterationCount" }, Pa = { transitionDuration: G, transitionDelay: fa, animationDuration: ta, animationDelay: ja }; t.module("ngAnimate",
    []).directive("ngAnimateChildren", [function () { return function (a, b, c) { a = c.ngAnimateChildren; t.isString(a) && 0 === a.length ? b.data("$$ngAnimateChildren", !0) : c.$observe("ngAnimateChildren", function (a) { b.data("$$ngAnimateChildren", "on" === a || "true" === a) }) } }]).factory("$$rAFScheduler", ["$$rAF", function (a) {
        function b(a) { d = d.concat(a); c() } function c() { if (d.length) { for (var b = d.shift(), z = 0; z < b.length; z++) b[z](); g || a(function () { g || c() }) } } var d, g; d = b.queue = []; b.waitUntilQuiet = function (b) {
            g && g(); g = a(function () {
                g =
                null; b(); c()
            })
        }; return b
    }]).factory("$$AnimateRunner", ["$q", "$sniffer", "$$animateAsyncRun", function (a, b, c) {
        function d(a) { this.setHost(a); this._doneCallbacks = []; this._runInAnimationFrame = c(); this._state = 0 } d.chain = function (a, b) { function c() { if (d === a.length) b(!0); else a[d](function (a) { !1 === a ? b(!1) : (d++, c()) }) } var d = 0; c() }; d.all = function (a, b) { function c(z) { f = f && z; ++d === a.length && b(f) } var d = 0, f = !0; q(a, function (a) { a.done(c) }) }; d.prototype = {
            setHost: function (a) { this.host = a || {} }, done: function (a) {
                2 === this._state ?
                a() : this._doneCallbacks.push(a)
            }, progress: L, getPromise: function () { if (!this.promise) { var b = this; this.promise = a(function (a, c) { b.done(function (b) { !1 === b ? c() : a() }) }) } return this.promise }, then: function (a, b) { return this.getPromise().then(a, b) }, "catch": function (a) { return this.getPromise()["catch"](a) }, "finally": function (a) { return this.getPromise()["finally"](a) }, pause: function () { this.host.pause && this.host.pause() }, resume: function () { this.host.resume && this.host.resume() }, end: function () {
                this.host.end && this.host.end();
                this._resolve(!0)
            }, cancel: function () { this.host.cancel && this.host.cancel(); this._resolve(!1) }, complete: function (a) { var b = this; 0 === b._state && (b._state = 1, b._runInAnimationFrame(function () { b._resolve(a) })) }, _resolve: function (a) { 2 !== this._state && (q(this._doneCallbacks, function (b) { b(a) }), this._doneCallbacks.length = 0, this._state = 2) }
        }; return d
    }]).factory("$$animateAsyncRun", ["$$rAF", function (a) {
        function b(b) { c.push(b); 1 < c.length || a(function () { for (var a = 0; a < c.length; a++) c[a](); c = [] }) } var c = []; return function () {
            var a =
            !1; b(function () { a = !0 }); return function (c) { a ? c() : b(c) }
        }
    }]).provider("$$animateQueue", ["$animateProvider", function (a) {
        function b(a, b, c, q) { return d[a].some(function (a) { return a(b, c, q) }) } function c(a, b) { a = a || {}; var c = 0 < (a.addClass || "").length, d = 0 < (a.removeClass || "").length; return b ? c && d : c || d } var d = this.rules = { skip: [], cancel: [], join: [] }; d.join.push(function (a, b, d) { return !b.structural && c(b.options) }); d.skip.push(function (a, b, d) { return !b.structural && !c(b.options) }); d.skip.push(function (a, b, c) {
            return "leave" ==
            c.event && b.structural
        }); d.skip.push(function (a, b, c) { return c.structural && 2 === c.state && !b.structural }); d.cancel.push(function (a, b, c) { return c.structural && b.structural }); d.cancel.push(function (a, b, c) { return 2 === c.state && b.structural }); d.cancel.push(function (a, b, c) { a = b.options; c = c.options; return a.addClass && a.addClass === c.removeClass || a.removeClass && a.removeClass === c.addClass }); this.$get = ["$$rAF", "$rootScope", "$rootElement", "$document", "$$HashMap", "$$animation", "$$AnimateRunner", "$templateRequest", "$$jqLite",
        "$$forceReflow", function (d, u, z, x, f, k, $, t, h, I) {
            function A() { var a = !1; return function (b) { a ? b() : u.$$postDigest(function () { a = !0; b() }) } } function Y(a, b) { var c = H(a), e = [], d = v[b]; d && q(d, function (a) { a.node.contains(c) && e.push(a.callback) }); return e } function E(a, e, l) {
                function n(b, c, e, v) { z(function () { var b = Y(a, c); b.length && d(function () { q(b, function (b) { b(a, e, v) }) }) }); b.progress(c, e, v) } function v(b) {
                    var c = a, e = l; e.preparationClasses && (c.removeClass(e.preparationClasses), e.preparationClasses = null); e.activeClasses &&
                    (c.removeClass(e.activeClasses), e.activeClasses = null); Ga(a, l); da(a, l); l.domOperation(); f.complete(!b)
                } var s, C; if (a = Ia(a)) s = H(a), C = a.parent(); l = ha(l); var f = new $, z = A(); W(l.addClass) && (l.addClass = l.addClass.join(" ")); l.addClass && !M(l.addClass) && (l.addClass = null); W(l.removeClass) && (l.removeClass = l.removeClass.join(" ")); l.removeClass && !M(l.removeClass) && (l.removeClass = null); l.from && !oa(l.from) && (l.from = null); l.to && !oa(l.to) && (l.to = null); if (!s) return v(), f; var h = [s.className, l.addClass, l.removeClass].join(" ");
                if (!Qa(h)) return v(), f; var E = 0 <= ["enter", "move", "leave"].indexOf(e), x = !F || D.get(s), h = !x && m.get(s) || {}, I = !!h.state; x || I && 1 == h.state || (x = !ka(a, C, e)); if (x) return v(), f; E && w(a); C = { structural: E, element: a, event: e, close: v, options: l, runner: f }; if (I) {
                    if (b("skip", a, C, h)) { if (2 === h.state) return v(), f; Q(a, h.options, l); return h.runner } if (b("cancel", a, C, h)) if (2 === h.state) h.runner.end(); else if (h.structural) h.close(); else return Q(a, h.options, C.options), h.runner; else if (b("join", a, C, h)) if (2 === h.state) Q(a, l, {}); else return Ma(a,
                    E ? e : null, l), e = C.event = h.event, l = Q(a, h.options, C.options), h.runner
                } else Q(a, l, {}); (I = C.structural) || (I = "animate" === C.event && 0 < Object.keys(C.options.to || {}).length || c(C.options)); if (!I) return v(), y(a), f; var t = (h.counter || 0) + 1; C.counter = t; r(a, 1, C); u.$$postDigest(function () {
                    var b = m.get(s), d = !b, b = b || {}, h = 0 < (a.parent() || []).length && ("animate" === b.event || b.structural || c(b.options)); if (d || b.counter !== t || !h) { d && (Ga(a, l), da(a, l)); if (d || E && b.event !== e) l.domOperation(), f.end(); h || y(a) } else e = !b.structural && c(b.options,
                    !0) ? "setClass" : b.event, r(a, 2), b = k(a, e, b.options), b.done(function (b) { v(!b); (b = m.get(s)) && b.counter === t && y(H(a)); n(f, e, "close", {}) }), f.setHost(b), n(f, e, "start", {})
                }); return f
            } function w(a) { a = H(a).querySelectorAll("[data-ng-animate]"); q(a, function (a) { var b = parseInt(a.getAttribute("data-ng-animate")), c = m.get(a); switch (b) { case 2: c.runner.end(); case 1: c && m.remove(a) } }) } function y(a) { a = H(a); a.removeAttribute("data-ng-animate"); m.remove(a) } function e(a, b) { return H(a) === H(b) } function ka(a, b, c) {
                c = J(x[0].body);
                var d = e(a, c) || "HTML" === a[0].nodeName, v = e(a, z), n = !1, y; for ((a = a.data("$ngAnimatePin")) && (b = a) ; b && b.length;) { v || (v = e(b, z)); a = b[0]; if (1 !== a.nodeType) break; var r = m.get(a) || {}; n || (n = r.structural || D.get(a)); if (pa(y) || !0 === y) a = b.data("$$ngAnimateChildren"), U(a) && (y = a); if (n && !1 === y) break; v || (v = e(b, z), v || (a = b.data("$ngAnimatePin")) && (b = a)); d || (d = e(b, c)); b = b.parent() } return (!n || y) && v && d
            } function r(a, b, c) { c = c || {}; c.state = b; a = H(a); a.setAttribute("data-ng-animate", b); c = (b = m.get(a)) ? za(b, c) : c; m.put(a, c) } var m = new f,
            D = new f, F = null, s = u.$watch(function () { return 0 === t.totalPendingRequests }, function (a) { a && (s(), u.$$postDigest(function () { u.$$postDigest(function () { null === F && (F = !0) }) })) }), v = {}, n = a.classNameFilter(), Qa = n ? function (a) { return n.test(a) } : function () { return !0 }, Ga = P(h); return {
                on: function (a, b, c) { b = la(b); v[a] = v[a] || []; v[a].push({ node: b, callback: c }) }, off: function (a, b, c) {
                    function e(a, b, c) { var d = la(b); return a.filter(function (a) { return !(a.node === d && (!c || a.callback === c)) }) } var d = v[a]; d && (v[a] = 1 === arguments.length ?
                    null : e(d, b, c))
                }, pin: function (a, b) { va(qa(a), "element", "not an element"); va(qa(b), "parentElement", "not an element"); a.data("$ngAnimatePin", b) }, push: function (a, b, c, e) { c = c || {}; c.domOperation = e; return E(a, b, c) }, enabled: function (a, b) { var c = arguments.length; if (0 === c) b = !!F; else if (qa(a)) { var e = H(a), d = D.get(e); 1 === c ? b = !d : (b = !!b) ? d && D.remove(e) : D.put(e, !0) } else b = F = !!a; return b }
            }
        }]
    }]).provider("$$animation", ["$animateProvider", function (a) {
        function b(a) { return a.data("$$animationRunner") } var c = this.drivers =
        []; this.$get = ["$$jqLite", "$rootScope", "$injector", "$$AnimateRunner", "$$HashMap", "$$rAFScheduler", function (a, g, u, z, x, f) {
            function k(a) {
                function b(a) { if (a.processed) return a; a.processed = !0; var e = a.domNode, d = e.parentNode; f.put(e, a); for (var r; d;) { if (r = f.get(d)) { r.processed || (r = b(r)); break } d = d.parentNode } (r || c).children.push(a); return a } var c = { children: [] }, d, f = new x; for (d = 0; d < a.length; d++) { var g = a[d]; f.put(g.domNode, a[d] = { domNode: g.domNode, fn: g.fn, children: [] }) } for (d = 0; d < a.length; d++) b(a[d]); return function (a) {
                    var b =
                    [], c = [], d; for (d = 0; d < a.children.length; d++) c.push(a.children[d]); a = c.length; var m = 0, f = []; for (d = 0; d < c.length; d++) { var g = c[d]; 0 >= a && (a = m, m = 0, b.push(f), f = []); f.push(g.fn); g.children.forEach(function (a) { m++; c.push(a) }); a-- } f.length && b.push(f); return b
                }(c)
            } var $ = [], t = P(a); return function (h, x, A) {
                function Y(a) { a = a.hasAttribute("ng-animate-ref") ? [a] : a.querySelectorAll("[ng-animate-ref]"); var b = []; q(a, function (a) { var c = a.getAttribute("ng-animate-ref"); c && c.length && b.push(a) }); return b } function E(a) {
                    var b = [],
                    c = {}; q(a, function (a, e) { var d = H(a.element), v = 0 <= ["enter", "move"].indexOf(a.event), d = a.structural ? Y(d) : []; if (d.length) { var m = v ? "to" : "from"; q(d, function (a) { var b = a.getAttribute("ng-animate-ref"); c[b] = c[b] || {}; c[b][m] = { animationID: e, element: J(a) } }) } else b.push(a) }); var e = {}, d = {}; q(c, function (c, m) {
                        var f = c.from, y = c.to; if (f && y) {
                            var g = a[f.animationID], r = a[y.animationID], s = f.animationID.toString(); if (!d[s]) {
                                var h = d[s] = {
                                    structural: !0, beforeStart: function () { g.beforeStart(); r.beforeStart() }, close: function () {
                                        g.close();
                                        r.close()
                                    }, classes: w(g.classes, r.classes), from: g, to: r, anchors: []
                                }; h.classes.length ? b.push(h) : (b.push(g), b.push(r))
                            } d[s].anchors.push({ out: f.element, "in": y.element })
                        } else f = f ? f.animationID : y.animationID, y = f.toString(), e[y] || (e[y] = !0, b.push(a[f]))
                    }); return b
                } function w(a, b) { a = a.split(" "); b = b.split(" "); for (var c = [], e = 0; e < a.length; e++) { var d = a[e]; if ("ng-" !== d.substring(0, 3)) for (var m = 0; m < b.length; m++) if (d === b[m]) { c.push(d); break } } return c.join(" ") } function y(a) {
                    for (var b = c.length - 1; 0 <= b; b--) {
                        var e =
                        c[b]; if (u.has(e) && (e = u.get(e)(a))) return e
                    }
                } function e(a, c) { a.from && a.to ? (b(a.from.element).setHost(c), b(a.to.element).setHost(c)) : b(a.element).setHost(c) } function ka() { var a = b(h); !a || "leave" === x && A.$$domOperationFired || a.end() } function r(b) { h.off("$destroy", ka); h.removeData("$$animationRunner"); t(h, A); da(h, A); A.domOperation(); s && a.removeClass(h, s); h.removeClass("ng-animate"); D.complete(!b) } A = ha(A); var m = 0 <= ["enter", "move", "leave"].indexOf(x), D = new z({ end: function () { r() }, cancel: function () { r(!0) } });
                if (!c.length) return r(), D; h.data("$$animationRunner", D); var F = wa(h.attr("class"), wa(A.addClass, A.removeClass)), s = A.tempClasses; s && (F += " " + s, A.tempClasses = null); $.push({ element: h, classes: F, event: x, structural: m, options: A, beforeStart: function () { h.addClass("ng-animate"); s && a.addClass(h, s) }, close: r }); h.on("$destroy", ka); if (1 < $.length) return D; g.$$postDigest(function () {
                    var a = []; q($, function (c) { b(c.element) ? a.push(c) : c.close() }); $.length = 0; var c = E(a), d = []; q(c, function (a) {
                        d.push({
                            domNode: H(a.from ? a.from.element :
                            a.element), fn: function () { a.beforeStart(); var c, d = a.close; if (b(a.anchors ? a.from.element || a.to.element : a.element)) { var m = y(a); m && (c = m.start) } c ? (c = c(), c.done(function (a) { d(!a) }), e(a, c)) : d() }
                        })
                    }); f(k(d))
                }); return D
            }
        }]
    }]).provider("$animateCss", ["$animateProvider", function (a) {
        var b = Ca(), c = Ca(); this.$get = ["$window", "$$jqLite", "$$AnimateRunner", "$timeout", "$$forceReflow", "$sniffer", "$$rAFScheduler", "$animate", function (a, g, u, z, x, f, k, t) {
            function Fa(a, b) {
                var c = a.parentNode; return (c.$$ngAnimateParentKey || (c.$$ngAnimateParentKey =
                ++E)) + "-" + a.getAttribute("class") + "-" + b
            } function h(f, e, h, r) { var m; 0 < b.count(h) && (m = c.get(h), m || (e = S(e, "-stagger"), g.addClass(f, e), m = Aa(a, f, r), m.animationDuration = Math.max(m.animationDuration, 0), m.transitionDuration = Math.max(m.transitionDuration, 0), g.removeClass(f, e), c.put(h, m))); return m || {} } function I(a) { w.push(a); k.waitUntilQuiet(function () { b.flush(); c.flush(); for (var a = x(), d = 0; d < w.length; d++) w[d](a); w.length = 0 }) } function A(c, e, f) {
                e = b.get(f); e || (e = Aa(a, c, Oa), "infinite" === e.animationIterationCount &&
                (e.animationIterationCount = 1)); b.put(f, e); c = e; f = c.animationDelay; e = c.transitionDelay; c.maxDelay = f && e ? Math.max(f, e) : f || e; c.maxDuration = Math.max(c.animationDuration * c.animationIterationCount, c.transitionDuration); return c
            } var Y = P(g), E = 0, w = []; return function (a, c) {
                function d() { m() } function r() { m(!0) } function m(b) {
                    if (!(E || ua && l)) {
                        E = !0; l = !1; c.$$skipPreparationClasses || g.removeClass(a, Z); g.removeClass(a, X); ma(n, !1); ia(n, !1); q(w, function (a) { n.style[a[0]] = "" }); Y(a, c); da(a, c); Object.keys(v).length && q(v, function (a,
                        b) { a ? n.style.setProperty(b, a) : n.style.removeProperty(b) }); if (c.onDone) c.onDone(); G && G.complete(!b)
                    }
                } function D(a) { p.blockTransition && ia(n, a); p.blockKeyframeAnimation && ma(n, !!a) } function F() { G = new u({ end: d, cancel: r }); I(L); m(); return { $$willAnimate: !1, start: function () { return G }, end: d } } function s() {
                    function b() {
                        if (!E) {
                            D(!1); q(w, function (a) { n.style[a[0]] = a[1] }); Y(a, c); g.addClass(a, X); if (p.recalculateTimingStyles) {
                                ga = n.className + " " + Z; aa = Fa(n, ga); B = A(n, ga, aa); V = B.maxDelay; C = Math.max(V, 0); K = B.maxDuration;
                                if (0 === K) { m(); return } p.hasTransitions = 0 < B.transitionDuration; p.hasAnimations = 0 < B.animationDuration
                            } p.applyAnimationDelay && (V = "boolean" !== typeof c.delay && na(c.delay) ? parseFloat(c.delay) : V, C = Math.max(V, 0), B.animationDelay = V, ca = [ja, V + "s"], w.push(ca), n.style[ca[0]] = ca[1]); M = 1E3 * C; P = 1E3 * K; if (c.easing) { var s, k = c.easing; p.hasTransitions && (s = N + "TimingFunction", w.push([s, k]), n.style[s] = k); p.hasAnimations && (s = T + "TimingFunction", w.push([s, k]), n.style[s] = k) } B.transitionDuration && h.push(ra); B.animationDuration &&
                            h.push(sa); r = Date.now(); var l = M + 1.5 * P; s = r + l; var k = a.data("$$animateCss") || [], x = !0; if (k.length) { var F = k[0]; (x = s > F.expectedEndTime) ? z.cancel(F.timer) : k.push(m) } x && (l = z(d, l, !1), k[0] = { timer: l, expectedEndTime: s }, k.push(m), a.data("$$animateCss", k)); a.on(h.join(" "), f); c.to && (c.cleanupStyles && Da(v, n, Object.keys(c.to)), ya(a, c))
                        }
                    } function d() { var b = a.data("$$animateCss"); if (b) { for (var c = 1; c < b.length; c++) b[c](); a.removeData("$$animateCss") } } function f(a) {
                        a.stopPropagation(); var b = a.originalEvent || a; a = b.$manualTimeStamp ||
                        b.timeStamp || Date.now(); b = parseFloat(b.elapsedTime.toFixed(3)); Math.max(a - r, 0) >= M && b >= K && (ua = !0, m())
                    } if (!E) if (n.parentNode) { var r, h = [], s = function (a) { if (ua) l && a && (l = !1, m()); else if (l = !a, B.animationDuration) if (a = ma(n, l), l) w.push(a); else { var b = w, c = b.indexOf(a); 0 <= a && b.splice(c, 1) } }, k = 0 < U && (B.transitionDuration && 0 === R.transitionDuration || B.animationDuration && 0 === R.animationDuration) && Math.max(R.animationDelay, R.transitionDelay); k ? z(b, Math.floor(k * U * 1E3), !1) : b(); J.resume = function () { s(!0) }; J.pause = function () { s(!1) } } else m()
                }
                var v = {}, n = H(a); if (!n || !n.parentNode || !t.enabled()) return F(); c = ha(c); var w = [], x = a.attr("class"), k = Ha(c), E, l, ua, G, J, C, M, K, P; if (0 === c.duration || !f.animations && !f.transitions) return F(); var ba = c.event && W(c.event) ? c.event.join(" ") : c.event, Q = "", O = ""; ba && c.structural ? Q = S(ba, "ng-", !0) : ba && (Q = ba); c.addClass && (O += S(c.addClass, "-add")); c.removeClass && (O.length && (O += " "), O += S(c.removeClass, "-remove")); c.applyClassesEarly && O.length && Y(a, c); var Z = [Q, O].join(" ").trim(), ga = x + " " + Z, X = S(Z, "-active"), x = k.to && 0 <
                Object.keys(k.to).length; if (!(0 < (c.keyframeStyle || "").length || x || Z)) return F(); var aa, R; 0 < c.stagger ? (k = parseFloat(c.stagger), R = { transitionDelay: k, animationDelay: k, transitionDuration: 0, animationDuration: 0 }) : (aa = Fa(n, ga), R = h(n, Z, aa, Pa)); c.$$skipPreparationClasses || g.addClass(a, Z); c.transitionStyle && (k = [N, c.transitionStyle], ea(n, k), w.push(k)); 0 <= c.duration && (k = 0 < n.style[N].length, k = Ba(c.duration, k), ea(n, k), w.push(k)); c.keyframeStyle && (k = [T, c.keyframeStyle], ea(n, k), w.push(k)); var U = R ? 0 <= c.staggerIndex ?
                c.staggerIndex : b.count(aa) : 0; (ba = 0 === U) && !c.skipBlocking && ia(n, 9999); var B = A(n, ga, aa), V = B.maxDelay; C = Math.max(V, 0); K = B.maxDuration; var p = {}; p.hasTransitions = 0 < B.transitionDuration; p.hasAnimations = 0 < B.animationDuration; p.hasTransitionAll = p.hasTransitions && "all" == B.transitionProperty; p.applyTransitionDuration = x && (p.hasTransitions && !p.hasTransitionAll || p.hasAnimations && !p.hasTransitions); p.applyAnimationDuration = c.duration && p.hasAnimations; p.applyTransitionDelay = na(c.delay) && (p.applyTransitionDuration ||
                p.hasTransitions); p.applyAnimationDelay = na(c.delay) && p.hasAnimations; p.recalculateTimingStyles = 0 < O.length; if (p.applyTransitionDuration || p.applyAnimationDuration) K = c.duration ? parseFloat(c.duration) : K, p.applyTransitionDuration && (p.hasTransitions = !0, B.transitionDuration = K, k = 0 < n.style[N + "Property"].length, w.push(Ba(K, k))), p.applyAnimationDuration && (p.hasAnimations = !0, B.animationDuration = K, w.push([ta, K + "s"])); if (0 === K && !p.recalculateTimingStyles) return F(); if (null != c.delay) {
                    var ca = parseFloat(c.delay);
                    p.applyTransitionDelay && w.push([fa, ca + "s"]); p.applyAnimationDelay && w.push([ja, ca + "s"])
                } null == c.duration && 0 < B.transitionDuration && (p.recalculateTimingStyles = p.recalculateTimingStyles || ba); M = 1E3 * C; P = 1E3 * K; c.skipBlocking || (p.blockTransition = 0 < B.transitionDuration, p.blockKeyframeAnimation = 0 < B.animationDuration && 0 < R.animationDelay && 0 === R.animationDuration); c.from && (c.cleanupStyles && Da(v, n, Object.keys(c.from)), xa(a, c)); p.blockTransition || p.blockKeyframeAnimation ? D(K) : c.skipBlocking || ia(n, !1); return {
                    $$willAnimate: !0,
                    end: d, start: function () { if (!E) return J = { end: d, cancel: r, resume: null, pause: null }, G = new u(J), I(s), G }
                }
            }
        }]
    }]).provider("$$animateCssDriver", ["$$animationProvider", function (a) {
        a.drivers.push("$$animateCssDriver"); this.$get = ["$animateCss", "$rootScope", "$$AnimateRunner", "$rootElement", "$sniffer", "$$jqLite", "$document", function (a, c, d, g, u, z, x) {
            function f(a) { return a.replace(/\bng-\S+\b/g, "") } function k(a, b) { M(a) && (a = a.split(" ")); M(b) && (b = b.split(" ")); return a.filter(function (a) { return -1 === b.indexOf(a) }).join(" ") }
            function t(c, h, g) {
                function x(a) { var b = {}, c = H(a).getBoundingClientRect(); q(["width", "height", "top", "left"], function (a) { var d = c[a]; switch (a) { case "top": d += I.scrollTop; break; case "left": d += I.scrollLeft } b[a] = Math.floor(d) + "px" }); return b } function e() { var c = f(g.attr("class") || ""), d = k(c, m), c = k(m, c), d = a(r, { to: x(g), addClass: "ng-anchor-in " + d, removeClass: "ng-anchor-out " + c, delay: !0 }); return d.$$willAnimate ? d : null } function z() { r.remove(); h.removeClass("ng-animate-shim"); g.removeClass("ng-animate-shim") } var r =
                J(H(h).cloneNode(!0)), m = f(r.attr("class") || ""); h.addClass("ng-animate-shim"); g.addClass("ng-animate-shim"); r.addClass("ng-anchor"); A.append(r); var D; c = function () { var c = a(r, { addClass: "ng-anchor-out", delay: !0, from: x(h) }); return c.$$willAnimate ? c : null }(); if (!c && (D = e(), !D)) return z(); var F = c || D; return {
                    start: function () {
                        function a() { c && c.end() } var b, c = F.start(); c.done(function () { c = null; if (!D && (D = e())) return c = D.start(), c.done(function () { c = null; z(); b.complete() }), c; z(); b.complete() }); return b = new d({
                            end: a,
                            cancel: a
                        })
                    }
                }
            } function G(a, b, c, f) { var e = h(a, L), g = h(b, L), k = []; q(f, function (a) { (a = t(c, a.out, a["in"])) && k.push(a) }); if (e || g || 0 !== k.length) return { start: function () { function a() { q(b, function (a) { a.end() }) } var b = []; e && b.push(e.start()); g && b.push(g.start()); q(k, function (a) { b.push(a.start()) }); var c = new d({ end: a, cancel: a }); d.all(b, function (a) { c.complete(a) }); return c } } } function h(c) {
                var d = c.element, f = c.options || {}; c.structural && (f.event = c.event, f.structural = !0, f.applyClassesEarly = !0, "leave" === c.event && (f.onDone =
                f.domOperation)); f.preparationClasses && (f.event = X(f.event, f.preparationClasses)); c = a(d, f); return c.$$willAnimate ? c : null
            } if (!u.animations && !u.transitions) return L; var I = x[0].body; c = H(g); var A = J(c.parentNode && 11 === c.parentNode.nodeType || I.contains(c) ? c : I); P(z); return function (a) { return a.from && a.to ? G(a.from, a.to, a.classes, a.anchors) : h(a) }
        }]
    }]).provider("$$animateJs", ["$animateProvider", function (a) {
        this.$get = ["$injector", "$$AnimateRunner", "$$jqLite", function (b, c, d) {
            function g(c) {
                c = W(c) ? c : c.split(" ");
                for (var d = [], f = {}, g = 0; g < c.length; g++) { var q = c[g], u = a.$$registeredAnimations[q]; u && !f[q] && (d.push(b.get(u)), f[q] = !0) } return d
            } var u = P(d); return function (a, b, d, k) {
                function t() { k.domOperation(); u(a, k) } function G(a, b, d, f, e) { switch (d) { case "animate": b = [b, f.from, f.to, e]; break; case "setClass": b = [b, A, H, e]; break; case "addClass": b = [b, A, e]; break; case "removeClass": b = [b, H, e]; break; default: b = [b, e] } b.push(f); if (a = a.apply(a, b)) if (Ea(a.start) && (a = a.start()), a instanceof c) a.done(e); else if (Ea(a)) return a; return L }
                function h(a, b, d, e, f) { var g = []; q(e, function (e) { var h = e[f]; h && g.push(function () { var e, f, g = !1, k = function (a) { g || (g = !0, (f || L)(a), e.complete(!a)) }; e = new c({ end: function () { k() }, cancel: function () { k(!0) } }); f = G(h, a, b, d, function (a) { k(!1 === a) }); return e }) }); return g } function I(a, b, d, e, f) {
                    var g = h(a, b, d, e, f); if (0 === g.length) {
                        var k, u; "beforeSetClass" === f ? (k = h(a, "removeClass", d, e, "beforeRemoveClass"), u = h(a, "addClass", d, e, "beforeAddClass")) : "setClass" === f && (k = h(a, "removeClass", d, e, "removeClass"), u = h(a, "addClass",
                        d, e, "addClass")); k && (g = g.concat(k)); u && (g = g.concat(u))
                    } if (0 !== g.length) return function (a) { var b = []; g.length && q(g, function (a) { b.push(a()) }); b.length ? c.all(b, a) : a(); return function (a) { q(b, function (b) { a ? b.cancel() : b.end() }) } }
                } 3 === arguments.length && oa(d) && (k = d, d = null); k = ha(k); d || (d = a.attr("class") || "", k.addClass && (d += " " + k.addClass), k.removeClass && (d += " " + k.removeClass)); var A = k.addClass, H = k.removeClass, E = g(d), w, y; if (E.length) {
                    var e, J; "leave" == b ? (J = "leave", e = "afterLeave") : (J = "before" + b.charAt(0).toUpperCase() +
                    b.substr(1), e = b); "enter" !== b && "move" !== b && (w = I(a, b, k, E, J)); y = I(a, b, k, E, e)
                } if (w || y) return { start: function () { function b(c) { f = !0; t(); da(a, k); g.complete(c) } var d, e = []; w && e.push(function (a) { d = w(a) }); e.length ? e.push(function (a) { t(); a(!0) }) : t(); y && e.push(function (a) { d = y(a) }); var f = !1, g = new c({ end: function () { f || ((d || L)(void 0), b(void 0)) }, cancel: function () { f || ((d || L)(!0), b(!0)) } }); c.chain(e, b); return g } }
            }
        }]
    }]).provider("$$animateJsDriver", ["$$animationProvider", function (a) {
        a.drivers.push("$$animateJsDriver");
        this.$get = ["$$animateJs", "$$AnimateRunner", function (a, c) { function d(c) { return a(c.element, c.event, c.classes, c.options) } return function (a) { if (a.from && a.to) { var b = d(a.from), t = d(a.to); if (b || t) return { start: function () { function a() { return function () { q(d, function (a) { a.end() }) } } var d = []; b && d.push(b.start()); t && d.push(t.start()); c.all(d, function (a) { g.complete(a) }); var g = new c({ end: a(), cancel: a() }); return g } } } else return d(a) } }]
    }])
})(window, window.angular);
//# sourceMappingURL=angular-animate.min.js.map