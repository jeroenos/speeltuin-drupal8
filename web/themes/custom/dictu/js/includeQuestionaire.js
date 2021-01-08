//# sourceMappingURL=questionnaire.js.map
var FormsEngine = FE = function () {
    function l(a, d) {
        if (a.containerId) if (a.publisherUri) if (h) a.version = h, m(a, d); else {
            var b = a.publisherUri + "/publisher/version?" + (new Date).getTime();
            jQuery.support.cors = !0;
            jQuery.ajax({
                url: b,
                type: "GET",
                dataType: "text",
                contentType: "text/plain",
                crossDomain: !0,
                success: function (b) {
                    a.version = h = b;
                    m(a, d)
                },
                error: function (a) {
                }
            })
        } else alert('Form cannot be initialized. Missed "publisherUri" option'); else alert('Form cannot be initialized. Missed "containerId" option')
    }

    function n(a,
               b) {
        0 < a.length && l(a.shift(), 0 === a.length ? b : function () {
            n(a, b)
        })
    }

    function m(a, d) {
        a.debugMode ? b("handlebars", a, function () {
            b("questionnaire", a, function () {
                b("helpers", a, function () {
                    b("contexts", a, function () {
                        b("objects", a, function () {
                            b("services", a, function () {
                                b("support", a, function () {
                                    b("umask", a, function () {
                                        b("upload", a, function () {
                                            b("xmoment", a, function () {
                                                b("combodate", a, function () {
                                                    b("xdr", a, function () {
                                                        b("select2", a, function () {
                                                            k(a, d)
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        }) : g["questionnaire.min"] ? k(a, d) : jQuery.ajax({
            url: a.publisherUri +
            "/assets/questionnaire-module.js?v=" + a.version,
            dataType: "script",
            cache: !0,
            crossDomain: !0,
            success: function () {
                g["questionnaire.min"] = !0;
                k(a, d)
            }
        })
    }

    function b(a, b, c) {
        if (g[a]) c(); else {
            g[a] = !0;
            var e = document.getElementsByTagName("body")[0], f = document.createElement("script");
            f.type = "text/javascript";
            f.src = "handlebars" == a ? b.publisherUri + "/assets/lib/handlebars/handlebars-v1.3.0.js" : b.publisherUri + "/assets/publisher/" + a + ".js";
            f.src += "?v=" + b.version;
            f.onload = c;
            e.appendChild(f)
        }
    }

    function k(a, b) {
        jQuery().questionnaire ?
            setTimeout(function () {
                a.events || (a.events = {});
                var c = a.events.init, e = [];
                null != c && void 0 !== c && (c instanceof Array ? e = c : "function" == typeof c && e.push(c));
                e.push(function () {
                    b && b()
                });
                a.events.init = e;
                jQuery("#" + a.containerId).questionnaire(a)
            }, 50) : setTimeout(function () {
                k(a, b)
            }, 50)
    }

    var h = h || !1, g = g || {};
    return {initForm: l, initForms: n, forms: []}
}(), initQuestionnaire = FE.initForm, initQuestionnaires = FE.initForms;