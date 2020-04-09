/* jshint strict: false */
/* jshint bitwise: false */
/* jshint eqnull:true */
/* jshint camelcase: false */
/* jshint browser: true */
/* global Modernizr, piwik, require */
var Core = {},
    Cookies = {},
    Cookiebar = {},
    _paq = _paq || []; // piwik variable

(function(d, w) {

    /* -----------------------------------
    IE 7-8 fixes
    ----------------------------------*/
    if (typeof String.prototype.trim !== 'function') {
        String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, '');
        };
    }

    if (typeof w.console === 'undefined' || typeof w.console.log === 'undefined') {
        w.console = {
            log: function() {}
        };
    }

    if (!d.getElementsByClassName) {
        w.getElementsByClassName = function(sClassName, oNode) {
            if (oNode === null) {
                oNode = document;
            }
            var aoFoundElements = [],
                aoAllChildElements = oNode.getElementsByTagName('*');

            for (var i = 0, j = aoAllChildElements.length; i < j; i++) {
                if (isClassInElement(aoAllChildElements[i], sClassName)) {
                    aoFoundElements.push(aoAllChildElements[i]);
                }
            }
            return aoFoundElements;
        };

        d.getElementsByClassName = function(className) {
            return w.getElementsByClassName(className, document);
        };
    }

    /* -----------------------------------
    COMMONS
    ----------------------------------*/
    /**
     *   This function checks if a class is in a specified element
     *   @param {object} oElement    element
     *   @param {string} sClassName  classname
     *   @returns    {boolean}
     */

    function isClassInElement(oElement, sClassName) {
        var reg = new RegExp('\\b' + sClassName + '\\b');
        return (sClassName === '*' || reg.test(oElement.className));
    }

    /**
     * removes a class from an element
     *   @param {node} oElement    domelement
     *   @param {string} sClassName  classname
     */

    function removeClassFromElement(oElement, sClassName) {
        if (oElement === null) {
            return false;
        }
        if (isClassInElement(oElement, sClassName)) {
            var oPattern = oElement.className.match(' ' + sClassName) ? (' ' + sClassName) : sClassName;
            oElement.className = oElement.className.replace(oPattern, '');
        }
        return oElement;
    }

    /**
     *   adds a class on an element
     *   @param {node} oElement    element
     *   @param {string} sClassName  added classname
     */

    function addClassToElement(oElement, sClassName) {
        if (oElement === null) {
            return false;
        }
        if (!isClassInElement(oElement, sClassName)) {
            oElement.className += oElement.className ? (' ' + sClassName) : sClassName;
        }
        return oElement;
    }

    /**
     *   adds or removes a class on an element if its there
     *   @param {Object} oElement    domelement
     *   @param {string} sClassName  classname
     */

    function toggleClassInElement(oElement, sClassName) {
        if (oElement === null) {
            return false;
        }
        if (isClassInElement(oElement, sClassName)) {
            removeClassFromElement(oElement, sClassName);
        } else {
            addClassToElement(oElement, sClassName);
        }
        return oElement;
    }

    //for example www.beta.example.com get the domain name for example example.com
    var getDomainName = function(hostName) {
        return hostName.substring(hostName.lastIndexOf('.', hostName.lastIndexOf('.') - 1) + 1);
    };

    function getCurrDomainName() {
        var hostName = window.location.hostname;
        return hostName.substring(hostName.lastIndexOf('.', hostName.lastIndexOf('.') - 1) + 1);
    }

    /**
     *  COOKIE scripting
     */
    /*  HASH METHOD
     *  Generates unique id from string passed in
     *  Used in cookiescript to register if cookiebar is shown, as required by dutch law
     *
     */
    String.prototype.hashCode = function() {
        var ha = 0,
            i, ch, l = this.length;
        if (l === 0) {
            return ha;
        }
        for (i = 0; i < l; i++) {
            ch = this.charCodeAt(i);
            ha = ((ha << 5) - ha) + ch;
            ha = ha & ha; // Convert to 32bit integer
        }
        return ha;
    };


    /**
     * START OF COOKIES OBJECT
     * Read, set or delete cookies.
     * @type {Object}
     */
    Cookies = {
        supported: false,
        domain: '',

        init: function() {
            var ck = this,
                //ckdatadmn = d.getElementsByTagName('body')[0].getAttribute('data-cookiedomain'),
                host = w.location.hostname.split('.'),
                hl = host.length,
                i, l,
                pos, cookieName, cookieValue, allCookies;

            // Erase old cookies if present
            for (i in this) {
                if (this.hasOwnProperty(i)) {
                    if (typeof this[i] === 'function') {
                        continue;
                    }
                    this[i] = undefined;
                }
            }

            // ck.domain = (host[hl - 1] === 'nl') ? '.' + host[hl - 2] + '.' + host[hl - 1] : '.' + host[hl - 1];
            ck.domain = w.location.hostname;

            if (ck.test()) {
                allCookies = document.cookie.split('; ');
                for (i = 0, l = allCookies.length; i < l; i++) {
                    pos = allCookies[i].indexOf('=');
                    if (pos !== -1) {
                        cookieName = allCookies[i].substr(0, pos);
                        cookieValue = allCookies[i].substr(pos + 1, allCookies[i].length);
                        ck[cookieName] = cookieValue;
                    }
                }
            }
        },

        test: function() {
            var ck = this;
            // Try a test cookie to check support
            ck.create('deeg', 'waar', 1);
            if (ck.read('deeg') !== null) {
                ck.supported = true;
                ck.erase('deeg');
            }
            return ck;
        },

        create: function(name, value, days) {
            var ck = this,
                date,
                domain,
                expires = '';

            // Calculate expire date
            if (days) {
                date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = '; expires=' + date.toGMTString();
            }

            // var siteUrl = window.location.href;
            // var uriParts = siteUrl.split("://");
            // var protocol = uriParts[0]
            var secureFlag = '';

            if (document.location.protocol === 'https:') {
                secureFlag = 'secure;';
            }
            // Build syntax to add domain to cookie.
            // domain = (ck.domain !== '') ? '; domain=' + ck.domain : '';
            document.cookie = name + '=' + value + expires + '; path=/ ; domain=' + ck.domain + '; ' + secureFlag;
            this[name] = value;
        },

        read: function(name) {
            var nameEQ = name + '=',
                ca = document.cookie.split(';'),
                c;
            for (var i = 0, j = ca.length; i < j; i++) {
                c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1, c.length);
                }
                if (c.indexOf(nameEQ) === 0) {
                    return c.substring(nameEQ.length, c.length);
                }
            }
            return null;
        },

        erase: function(name) {
            this.create(name, '', -1);
            this[name] = undefined;
        },

        eraseAll: function() {
            for (var i in this) {
                if (this.hasOwnProperty(i)) {
                    if (typeof this[i] === 'function') {
                        continue;
                    } // Let's not erase the object's methods
                    this.erase(i);
                }
            }
        }
    };


    /**
     * START OF COOKIEBAR OBJECT
     * Show cookiebar and register any click for implicit consent (as required by law).
     * @type {Object}
     */

    Cookiebar = {
        cookiename: 'toestemmingvoorcookies',

        cookievalues: {
            'accept': 'ja',
            'deny': 'nee',
            'implicit': 'ja' // New one, to discern from first cookiebar's explicit consent.
        },

        lifespan: 5 * 365,

        callback: function(result) {
            var cb = this;
            Cookies.create(cb.cookiename, cb.cookievalues[result], cb.lifespan);
        },

        init: function(options) {
            var cb = this,
                h = d.getElementsByTagName('html')[0],
                b = d.getElementsByTagName('body')[0],
                msg, msgLine, msgText, msgLink, msgLinkText, msgFullStop, wrp;

            // Get options if passed in; override for langauge setting if required.
            for (var i in options) {
                if (this.hasOwnProperty(i)) {
                    cb[i] = options[i] || cb[i];
                }
            }

            // If Cookies object is not initialized, skip.
            // If cookies are not supported, skip.
            // If browser 'do not track' is enabled, skip.
            // Note: Firefox sends a 'yes' value even if preferences is set to 'do track me'. In th
            // If blocking class on body is present, skip.
            // If consent cookie already exists, skip.
            // If message is not available in the chosen language, skip.
            if ((typeof Cookies !== 'object') ||
                (!Cookies.supported) ||
                (typeof window.navigator.doNotTrack !== 'undefined' && window.navigator.doNotTrack === 'yes') ||
                (typeof window.navigator.msDoNotTrack !== 'undefined' && window.navigator.msDoNotTrack === 'yes') ||
                (b.className.indexOf('nocookiebar') > -1) ||
                (Cookies.read(cb.cookiename) !== null)) {
                return;
            }

            // From here, we have a go, so build a cookie jar.
            //msgText = d.createTextNode(Core.txt.cookiebar.bodytxt);

            var cookieTxt = b.getAttribute('data-cookiebody') || '{sitenaam} gebruikt cookies om het gebruik van de website te analyseren en het gebruiksgemak te verbeteren. Lees meer over';
            var cookieBtn = b.getAttribute('data-cookieurltext') || 'cookies';
            msgText = d.createTextNode(cookieTxt.replace("{sitenaam}", getCurrDomainName()) + ' ');
            msgFullStop = d.createTextNode('.');
            msgLinkText = d.createTextNode(cookieBtn);
            msgLink = d.createElement('a');
            //msgLink.setAttribute('href', cb.languages[cb.langcode].url);
            msgLink.setAttribute('href', b.getAttribute('data-cookieinfourl') ? b.getAttribute('data-cookieinfourl') : '/cookies/');
            msgLink.setAttribute('id', 'cookieinfo');
            msgLink.onclick = function(evt) {
                var event = evt || window.event;
                if (event.stopPropagation) {
                    event.stopPropagation();
                } else {
                    event.cancelBubble = true;
                }
            };
            msgLink.appendChild(msgLinkText);
            msgLine = d.createElement('p');
            msgLine.appendChild(msgText);
            msgLine.appendChild(msgLink);
            msgLine.appendChild(msgFullStop);

            msg = d.createElement('div');
            msg.className = 'site message cookie';
            wrp = d.createElement('div');
            wrp.className = 'wrapper';

            msg.appendChild(wrp);
            wrp.appendChild(msgLine);

            b.insertBefore(msg, b.getElementsByTagName('div')[0]);

            function setDelayLink(link) {
                link.onclick = function(evt) {
                    var hl = this.href;
                    setTimeout(function() {
                        window.location.href = hl;
                    }, 500);

                    // Set cookie
                    cb.callback('implicit');
                    var event = evt || window.event;
                    if (event.stopPropagation) {
                        event.stopPropagation();
                    } else {
                        event.cancelBubble = true;
                    }
                    return false;
                };
            }

            // Set a half second delay on links on page where cookiebar is shown to allow processing of cookie, piwik, survey
            var links = d.getElementById('mainwrapper').getElementsByTagName('a');
            for (var li = 0, lj = links.length; li < lj; li++) {
                if (typeof(links[li].href) === 'string') {
                    if (links[li].href.indexOf('#') < 0) { // Only apply to real hyperlinks, not anchors within page.
                        setDelayLink(links[li]);
                    }
                }
            }
        }
    };



    /* -----------------------------------
    CORE OBJECT
    ----------------------------------*/

    Core = {
        debug: false,
        minify: '.min',
        showcookiebar: 'false',
        navtype: 'reg',
        viewport: 'screen-xxs',


        testSingleSelector: function(selector) {
            return (selector.charAt(0) === '.') ? (d.getElementsByClassName(selector.substr(1)).length > 0) : (selector.charAt(0) === '#') ? (d.getElementById(selector.substr(1))) : (d.getElementsByTagName(selector).length > 0);
        },

        testSelectors: function(selectors) {
            var result = false;
            for (var i = 0; i < selectors.length; i++) {
                result = result || this.testSingleSelector(selectors[i]);
            }
            return result;
        },

        fixSkiplinks: function() {
            if (window.addEventListener) {
                window.addEventListener("hashchange", function() {
                    var element = document.getElementById(location.hash.substring(1));
                    if (element) {
                        if (!/^(?:a|select|input|button|textarea)$/i.test(element.tagName)) {
                            element.tabIndex = -1;
                        }
                        element.focus();
                    }
                }, false);
            }
        },

        fold: function(element, trigger) {
            toggleClassInElement(element, 'hide');

            if (trigger === null) {
                return false;
            }
            //toggle(trigger, 'active');
            trigger.onclick = function() {
                toggleClassInElement(element, 'hide');
                toggleClassInElement(trigger, 'active');
                return false;
            };
        },



        copyUUID: function() {
            if (window.clipboardData) {
                window.clipboardData.clearData();
                window.clipboardData.setData('text', document.getElementById('copytext').innerText);
            }
            return false;
        },


        loadJsScripts: function() {

            var scripts = {
                'jquery': {
                    path: 'shared-ro/jquery-2.2.3'
                },
                'jquery-ui': {
                    path: 'shared-ro/jquery-ui',
                    deps: ['jquery']
                },
                'jqueryMobile': {
                    path: 'shared-ro/jquery.mobile.custom',
                    triggers: ['.touchevents']
                },
                'forms': {
                    path: 'shared-ro/forms',
                    deps: ['jquery-ui'],
                    triggers: ['.form']
                },

                'swipebox': {
                    path: 'shared-ro/jquery-swipebox',
                    triggers: ['.block-photo-gallery', '.swbox', '.videoLightbox']
                },

                'scriptjs': {
                    path: 'shared-ro/script'
                },



                'highchartScript': {
                    path: 'shared-ro/highcharts',
                    deps: ['miscellaneous'],
                    triggers: ['.hchart']
                },
                'highmapsScript': {
                    path: 'shared-ro/highmaps',
                    deps: ['highchartScript'],
                    triggers: ['.hmap']
                },

                'leaflet': {
                    path: 'shared-ro/leaflet',
                    triggers: ['.mapsComponent']
                },
                'mapsComponent': {
                    path: 'shared-ro/mapsComponent',
                    deps: ['leaflet', 'miscellaneous'],
                    triggers: ['.mapsComponent']
                }
            };

            var scriptPaths = {};
            var bundles = {};
            var triggers = {};
            for (var script in scripts) {

                scriptPaths[script] = {};
                scriptPaths[script] = this.scriptpath + scripts[script].path + this.scriptversion + this.minify;

                bundles[script] = {};
                bundles[script].exports = script;

                if (scripts[script].deps) {
                    bundles[script].deps = scripts[script].deps;
                }

                if (scripts[script].triggers) {
                    triggers[script] = scripts[script].triggers;
                }

            }

            require.config({
                // define paths to all external scripts
                paths: scriptPaths,
                // define bundles so scripts can be loaded in the right order
                shim: bundles
            });


            for (var loadscript in triggers) {
                if (this.testSelectors(triggers[loadscript])) {
                    require([loadscript]);
                }
            }

            var urlParts = w.location.host.split('.');
            for (var i = 0, l = urlParts.length; i < l; i++) {
                if ((urlParts[i] === 'git') || (urlParts[i] === 'localhost:2000') || (urlParts[i] === '192')) {
                    require(['styleTogglr']);
                }
            }

        },

				resetBgVisuals: function()
				{
					this.resetBgVisual('blur');					
					this.resetBgVisual('blur-none');					
				},

        resetBgVisual: function(clName)
        {
        	var bgvisuals = d.getElementsByClassName(clName);
        	        	
        	if (bgvisuals.length < 1) return false;
        	
					for (i = 0, bgl = bgvisuals.length; i < bgl; i++)
					{
            // Set height of visual.
            var bgvisual = bgvisuals[i];

            if (!bgvisual) return;

            var bgvisualparent = bgvisual.parentNode;

            if (bgvisualparent.clientHeight !== bgvisual.clientHeight)
            {
                var bgvisualstyle = bgvisual.getAttribute('style') || "",
                    bgvisualheight = bgvisualstyle.indexOf('height');
                if (bgvisualheight > 0) {
                    bgvisualstyle = bgvisualstyle.substring(0, bgvisualheight);
                }
                if (w.innerWidth > 640)
                {
                    bgvisualstyle += "height:"+ bgvisualparent.clientHeight+"px;";
                }
                bgvisual.setAttribute('style', bgvisualstyle);
            }

            // Set height of columns if necessary.
            var sheets = bgvisualparent.getElementsByClassName('sheet'),
                sheetslen = sheets.length,
                visual = bgvisualparent.getElementsByClassName('visual')[0],
                newheight = 0,
                sheetstyle = "";

            if (sheetslen > 1) {
                // There are two columns, so resize these to the same, longest, length.
                newheight = sheets[0].clientHeight;
                if (sheets[1].clientHeight > newheight) { newheight = sheets[1].clientHeight; }
            } else if (visual && sheetslen === 1) {
                // There is a visual, so make visual and sheet the same height
                newheight = visual.clientHeight;
                if (sheets[0].clientHeight > newheight) { newheight = sheets[0].clientHeight; }
            }

            if (w.innerWidth > 640)
            {
	              sheetstyle = "height:" + newheight + "px;";
            }

            if (newheight > 0)
            {
              for (j = 0; j < sheetslen; j++) {
                  sheets[j].setAttribute('style', sheetstyle);
              }
            }
          }
        },


        /**
         * Init Core object
         * @return none
         */
        init: function() {

            var c = this,
                h = d.getElementsByTagName('html')[0],
                b = d.getElementsByTagName('body')[0],
                ie = (h.className.indexOf('ie') > -1);


            //  SET CORE GLOBALS
            c.debug = c.debug || (w.location.hash.indexOf('debug') > -1);
            c.scriptpath = b.getAttribute('data-scriptpath') ? b.getAttribute('data-scriptpath') + '/' : 'behaviour/';
            c.scriptversion = b.getAttribute('data-scriptversion') ? '-' + b.getAttribute('data-scriptversion') : '';
            c.minify = !c.debug ? '.min' : '';


            // Fix skiplink focus for crome
            c.fixSkiplinks();

            // Load needes External JS files
            c.loadJsScripts();


            //Cookies.init();

            //  SHOW COOKIEBAR IF ENABLED
            /*c.showcookiebar = b.getAttribute('data-showcookiebar') ? b.getAttribute('data-showcookiebar').toString() === 'true' : false;
            if (c.showcookiebar) {
                //Cookies.init();

                Cookiebar.cookieurl = b.getAttribute('data-cookieimg') ? b.getAttribute('data-cookieimg') : '/presentation/shared-ro/images/cookie.png';

                Cookiebar.init({

                    callback: function(result) {
                        // Set cookie.
                        Cookies.create(Cookiebar.cookiename, Cookiebar.cookievalues[result], Cookiebar.lifespan);

                        var agent = navigator.userAgent.hashCode(),
                            timestamp = (new Date()).getTime(),
                            uniqueid = timestamp + agent.toString(),
                            //lifespan = Cookiebar.lifespan || 5 * 365,
                            consent = Cookiebar.cookievalues[result],
                            cookielog = new Image();

                        consent = consent + '.' + uniqueid;


                        cookielog.src = Cookiebar.cookieurl + '?' + Cookiebar.cookiename + '=' + consent;
                    }
                });
            }*/

            c.resetBgVisuals();
            w.addEventListener("orientationchange", c.resetBgVisuals, false);
            w.addEventListener('resize', c.resetBgVisuals, false);


        }
    };
    Core.init();


})(document, window);
