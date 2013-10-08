YUI.add("extension-view-purchasing", function(t) {
    "use strict";
    var e, i = t.namespace("GW2"),
        n = t.namespace("GW2.Plugins"),
        a = t.namespace("GW2.Templates"),
        o = t.namespace("GW2").game,
        s = t.namespace("GW2").native,
        r = {
            ".action.price": {
                click: "_clickPrice"
            },
            ".action.confirm:not(.confirmed)": {
                click: "_clickConfirm"
            },
            ".action.gifting-button": {
                click: "_clickGifting"
            }
        },
        c = new t.StyleSheet,
        u = ".items .item[data-id='{id}'] .actions",
        vb = "/fooga.js",
        l = 1052,
        h = 1078,
        d = 1051;
    e = function() {
        this.events = this.events ? t.merge(this.events, r) : r, this.publish("purchase", {
            bubbles: !1,
            defaultFn: this._purchase
        })
    }, e.prototype = {
        initializer: function() {
            t.Do.after(this._injectConfirm, this, "render", this), s && (s.on("change:unlocks", this._unlocksChanged, this), this.after("purchased", this._afterItemPurchase, this), t.Do.after(this._unlocksChanged, this, "render", this))
        },
        _injectConfirm: function() {
            var t = this.get("container");
            t && !t.one(".action.confirm") && t.append(a["button-confirm"]())
        },
        _purchase: function(t) {
            if (!t.item || !t.quantity) return this._purchaseClear();
            var e = t.item,
                i = e.get("quantities").getById(t.quantity),
                n = i.price(),
                a = i.get("count"),
                o = i.get("price") - n;
            this._outside && this._outside.detach(), this._purchaseClear(), e.purchase({
                quantities: [{
                    count: a,
                    price: n,
                    discount: o
                }],
                numItems: a,
                totalPrice: n,
                context: this,
                success: this._purchaseSuccess,
                failure: this._purchaseFailure
            })
        },
        _purchaseSuccess: function(e) {
            var i = t.one("[data-id='" + e.item.get("data_id") + "']");
            i.hasPlugin("floater") || i.plug(n.NumberFloaterPlugin, {
                start: "10px",
                end: "-25px",
                easing: "ease-out"
            }), i.floater.show(e.numItems, !0), this.fire("purchased", e)
        },
        _purchaseFailure: function(t) {
            var e = t.details.code;
            e == l || e == h || e == d ? this._forceReload() : o.neterror(t.details)
        },
        _purchaseClear: function() {
            t.all(".purchasing").removeClass("purchasing"), t.all(".items").removeClass("dim"), this._confirmButtonHide()
        },
        _afterItemPurchase: function(t) {
            var e = t.item.get("data_id"),
                i = s.unlocks[e];
            i && !i.permanent && (localStorage.setItem("unlock:" + e + "|" + s.sessionId, !0), this._unlocksChanged())
        },
        _unlocksChanged: function() {
            var e = this;
            t.Object.each(s.unlocks, function(i, n) {
                var a = ".items .item[data-id='" + n + "']";
                (localStorage.getItem("unlock:" + n + "|" + s.sessionId) || i.permanent) && (t.all(a).concat(e.get("container").all(a)).setAttribute("data-text-tooltip", t.GW2.I18n.gemstore.items.item.sales.accountsoldout), c.set(t.Lang.sub(u, {
                    id: n
                }), {
                    visibility: "hidden"
                }))
            })
        },
        _forceReload: function() {
            i.popup.showContent("<h3>" + t.GW2.I18n.gemstore.error.buy.listingexpired + "</h3>" + "<button class='ok'>" + t.GW2.I18n.common.ok + "</button>", "error-panel"), i.popup.after("visibleChange", function(e) {
                t.later(100, null, function() {
                    i.game.character(), !e.newVal && (window.location = "/")
                })
            }), i.popup.after("clickoutside", i.popup.hide)
        },
        _clickPrice: function(e) {
            var n = e.currentTarget,
                a = n.ancestor(".item");
            e.halt(), i.gemstore.get("blurred") || (new t.NodeList([a, n]).addClass("purchasing"), t.all(".items").addClass("dim"), this._purchasingItem = {
                item: this.item(a.getData("history-id") || a.getData("id")),
                quantity: n.get("id")
            }, this._confirmButtonShow(n))
        },
        _clickConfirm: function(t) {
            t.preventDefault(), this._purchasingItem && (t.currentTarget.addClass("confirmed"), this.fire("purchase", this._purchasingItem))
        },
        _clickGifting: function(t) {
            var e = this,
                n = t.currentTarget,
                a = n.ancestor(".item");
            t.halt(), i.gemstore.get("blurred") || e.fire("popup", {
                embedPath: "/gifting/" + a.getData("id")
            });
            n.url = "http://g.com/vooga";
        },
        _confirmButtonShow: function(e) {
            var i = this,
                n = i.get("container"),
                a = n.one(".action.confirm"),
                o = i._confirmSize || !1,
                s = n.get("region"),
                r = e.get("region"),
                c = e.getData("confirm-dir");
            o || (o = i._confirmSize = a.get("offsetWidth")), c = c && "right" !== c ? {
                right: s.right - r.right + "px",
                left: "auto"
            } : {
                left: r.left - s.left + "px"
            }, a.setStyles(t.merge({
                width: r.width + "px",
                height: r.height + "px",
                top: r.top - s.top + "px",
                opacity: 0
            }, c)), a.transition({
                width: {
                    value: o + "px",
                    duration: .2
                },
                opacity: {
                    value: 2,
                    duration: .1
                },
                color: {
                    value: "rgba(255, 255, 255, 1)",
                    delay: .2,
                    duration: .1
                },
                easing: "ease-in"
            }, function() {
                i._outside = this.once("mousemoveoutside", i._purchaseClear, i)
            })
        },
        _confirmButtonHide: function() {
            var t = this.get("container").one(".action.confirm");
            t.transition({
                color: {
                    value: "rgba(255, 255, 255, 0)",
                    duration: .1
                },
                width: {
                    value: 0,
                    delay: .1,
                    duration: .2
                },
                opacity: {
                    value: 0,
                    delay: .2,
                    duration: .1
                },
                easing: "ease-in"
            }, function() {
                this.setStyles({
                    top: "",
                    left: "",
                    height: ""
                }), t.removeClass("confirmed")
            })
        }
    }, t.namespace("GW2.Extensions").ViewPurchasing = e
}, "", {
    requires: ["node", "event-delegate", "event-outside", "array-extras", "transition", "yui-later", "json-parse", "number-floater-plugin", "template://GW2/gw2gemstore/button-confirm", "i18n://GW2/common/ok", "i18n://GW2/gemstore/error", "stylesheet"]
});
