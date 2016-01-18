function NanoStateDefaultClass(){this.key="default",this.key=this.key.toLowerCase(),NanoStateManager.addState(this)}function NanoStateClass(){}var NanoUtility=function(){var e={};return{init:function(){var t=$("body");e=t.data("urlParameters")},generateHref:function(t){var n="?";for(var a in e)e.hasOwnProperty(a)&&("?"!==n&&(n+=";"),n+=a+"="+e[a]);for(var a in t)t.hasOwnProperty(a)&&("?"!==n&&(n+=";"),n+=a+"="+t[a]);return n},winset:function(e,t,n){var a,r;return null==n&&(n=NanoStateManager.getData().config.window.ref),a={},a[n+"."+e]=t,r=a,location.href=NanoUtility.href("winset",r)},extend:function(e,t){return Object.keys(t).forEach(function(n){var a;return a=t[n],a&&"[object Object]"===Object.prototype.toString.call(a)?(e[n]=e[n]||{},util.extend(e[n],a)):e[n]=a}),e},href:function(e,t){return null==e&&(e=""),null==t&&(t={}),e=new Url("byond://"+e),NanoUtility.extend(e.query,t),e},close:function(){var t;return t={command:"nanoclose "+e.src},this.winset("is-visible","false"),location.href=util.href("winset",t)}}}();"undefined"==typeof jQuery&&reportError("ERROR: Javascript library failed to load!"),"undefined"==typeof doT&&reportError("ERROR: Template engine failed to load!");var reportError=function(e){window.location="byond://?nano_err="+encodeURIComponent(e),alert(e)};$(document).ready(function(){NanoUtility.init(),NanoStateManager.init(),NanoTemplate.init(),NanoWindow.init()}),Array.prototype.indexOf||(Array.prototype.indexOf=function(e){var t=this.length,n=Number(arguments[1])||0;for(n=0>n?Math.ceil(n):Math.floor(n),0>n&&(n+=t);t>n;n++)if(n in this&&this[n]===e)return n;return-1}),String.prototype.format||(String.prototype.format=function(e){var t=this;return t.replace(String.prototype.format.regex,function(t){var n,a=parseInt(t.substring(1,t.length-1));return n=a>=0?e[a]:-1===a?"{":-2===a?"}":""})},String.prototype.format.regex=new RegExp("{-?[0-9]+}","g")),Object.size=function(e){var t,n=0;for(var t in e)e.hasOwnProperty(t)&&n++;return n},window.console||(window.console={log:function(e){return!1}}),String.prototype.toTitleCase=function(){var e=/^(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|vs?\.?|via)$/i;return this.replace(/([^\W_]+[^\s-]*) */g,function(t,n,a,r){return a>0&&a+n.length!==r.length&&n.search(e)>-1&&":"!==r.charAt(a-2)&&r.charAt(a-1).search(/[^\s-]/)<0?t.toLowerCase():n.substr(1).search(/[A-Z]|\../)>-1?t:t.charAt(0).toUpperCase()+t.substr(1)})},$.ajaxSetup({cache:!1}),Function.prototype.inheritsFrom=function(e){return this.prototype=new e,this.prototype.constructor=this,this.prototype.parent=e.prototype,this},String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")}),String.prototype.ckey||(String.prototype.ckey=function(){return this.replace(/\W/g,"").toLowerCase()}),NanoStateManager=function(){var e=!1,t=null,n={},a={},r={},o=null,i=function(){t=$("body").data("initialData"),null!=t&&t.hasOwnProperty("config")&&t.hasOwnProperty("data")||reportError("Error: Initial data did not load correctly.");var n="default";t.config.hasOwnProperty("stateKey")&&t.config.stateKey&&(n=t.config.stateKey.toLowerCase()),NanoStateManager.setCurrentState(n),$(document).on("templatesLoaded",function(){l(t),e=!0})},s=function(n){var a;try{a=jQuery.parseJSON(n)}catch(r){return void reportError("recieveUpdateData failed. <br>Error name: "+r.name+"<br>Error Message: "+r.message)}a.hasOwnProperty("data")||(t&&t.hasOwnProperty("data")?a.data=t.data:a.data={}),e?l(a):t=a},l=function(e){if(null!=o){if(e=o.onBeforeUpdate(e),e===!1)return void reportError("data is false, return");t=e,o.onUpdate(t),o.onAfterUpdate(t)}},c=function(e,t){for(var n in e)e.hasOwnProperty(n)&&jQuery.isFunction(e[n])&&(t=e[n].call(this,t));return t};return{init:function(){i()},receiveUpdateData:function(e){s(e)},addBeforeUpdateCallback:function(e,t){n[e]=t},addBeforeUpdateCallbacks:function(e){for(var t in e)e.hasOwnProperty(t)&&NanoStateManager.addBeforeUpdateCallback(t,e[t])},removeBeforeUpdateCallback:function(e){n.hasOwnProperty(e)&&delete n[e]},executeBeforeUpdateCallbacks:function(e){return c(n,e)},addAfterUpdateCallback:function(e,t){a[e]=t},addAfterUpdateCallbacks:function(e){for(var t in e)e.hasOwnProperty(t)&&NanoStateManager.addAfterUpdateCallback(t,e[t])},removeAfterUpdateCallback:function(e){a.hasOwnProperty(e)&&delete a[e]},executeAfterUpdateCallbacks:function(e){return c(a,e)},addState:function(e){return e instanceof NanoStateClass?e.key?void(r[e.key]=e):void reportError("ERROR: Attempted to add a state with an invalid stateKey"):void reportError("ERROR: Attempted to add a state which is not instanceof NanoStateClass")},setCurrentState:function(e){if("undefined"==typeof e||!e)return reportError("ERROR: No state key was passed!"),!1;if(!r.hasOwnProperty(e))return reportError("ERROR: Attempted to set a current state which does not exist: "+e),!1;var t=o;return o=r[e],null!=t&&t.onRemove(o),o.onAdd(t),!0},getCurrentState:function(){return o},getData:function(){return t}}}(),NanoBaseCallbacks=function(){var e=!0,t={},n={status:function(t){var n;return 2==t.config.status?(n="good",$(".linkActive").removeClass("inactive")):1==t.config.status?(n="average",$(".linkActive").addClass("inactive")):(n="bad",$(".linkActive").addClass("inactive")),$(".statusicon").each(function(e,t){t.className=t.className.replace(/good|bad|average/g,""),t.classList.add(n)}),$(".linkActive").stopTime("linkPending"),$(".linkActive").removeClass("linkPending"),$(".linkActive").off("click").on("click",function(n){n.preventDefault();var a=$(this).data("href");null!=a&&e&&(e=!1,$("body").oneTime(300,"enableClick",function(){e=!0}),2==t.config.status&&$(this).oneTime(300,"linkPending",function(){$(this).addClass("linkPending")}),window.location.href=a)}),t},nanomap:function(e){return $(".mapIcon").off("mouseenter mouseleave").on("mouseenter",function(e){$("#uiMapTooltip").html($(this).children(".tooltip").html()).show().stopTime().oneTime(5e3,"hideTooltip",function(){$(this).fadeOut(500)})}),$(".zoomLink").off("click").on("click",function(e){e.preventDefault();var t=$(this).data("zoomLevel"),n=$("#uiMap"),a=n.width()*t,r=n.height()*t;n.css({zoom:t,left:"50%",top:"50%",marginLeft:"-"+Math.floor(a/2)+"px",marginTop:"-"+Math.floor(r/2)+"px"})}),$("#uiMapImage").attr("src","nanomap_z"+e.config.mapZLevel+".png"),e}};return{addCallbacks:function(){NanoStateManager.addBeforeUpdateCallbacks(t),NanoStateManager.addAfterUpdateCallbacks(n)},removeCallbacks:function(){for(var e in t)t.hasOwnProperty(e)&&NanoStateManager.removeBeforeUpdateCallback(e);for(var e in n)n.hasOwnProperty(e)&&NanoStateManager.removeAfterUpdateCallback(e)}}}(),NanoBaseHelpers=function(){var e={syndicateMode:function(){return $("body").css("background-color","#8f1414"),$("body").css("background-image","url('uiBackground-Syndicate.png')"),$("body").css("background-position","50% 0"),$("body").css("background-repeat","repeat-x"),$("#uiTitleFluff").css("background-image","url('uiTitleFluff-Syndicate.png')"),$("#uiTitleFluff").css("background-position","50% 50%"),$("#uiTitleFluff").css("background-repeat","no-repeat"),""},combine:function(e,t){return e&&t?e.concat(t):e||t},dump:function(e){return JSON.stringify(e)},link:function(e,t,n,a,r,o){var i="",s="noIcon";"undefined"!=typeof t&&t&&(i='<div class="uiLinkPendingIcon"></div><i class="fa fa-fw fa-'+t+'"></i>',s="hasIcon"),"undefined"!=typeof r&&r||(r="link");var l="";return"undefined"!=typeof o&&o&&(l='id="'+o+'"'),"undefined"!=typeof a&&a?'<div unselectable="on" class="link '+s+" "+r+" "+a+'" '+l+">"+i+e+"</div>":'<div unselectable="on" class="linkActive '+s+" "+r+'" data-href="'+NanoUtility.generateHref(n)+'" '+l+">"+i+e+"</div>"},xor:function(e,t){return e^t},precisionRound:function(e,t){if(0==t)return Math.round(number);var n=Math.pow(10,t);return Math.round(e*n)/n},round:function(e){return Math.round(e)},fixed:function(e){return Math.round(10*e)/10},floor:function(e){return Math.floor(e)},ceil:function(e){return Math.ceil(e)},string:function(){if(0==arguments.length)return"";if(1==arguments.length)return arguments[0];if(arguments.length>1){stringArgs=[];for(var e=1;e<arguments.length;e++)stringArgs.push(arguments[e]);return arguments[0].format(stringArgs)}return""},formatNumber:function(e){var t=e.toString().split(".");return t[0]=t[0].replace(/\B(?=(\d{3})+(?!\d))/g,","),t.join(".")},capitalizeFirstLetter:function(e){return e.charAt(0).toUpperCase()+e.slice(1)},displayBar:function(e,t,n,a,r){n>t?t>e?e=t:e>n&&(e=n):e>t?e=t:n>e&&(e=n),"undefined"!=typeof a&&a||(a=""),"undefined"!=typeof r&&r||(r="");var o=Math.round((e-t)/(n-t)*100);return'<div class="displayBar '+a+'"><div class="displayBarFill '+a+'" style="width: '+o+'%;"></div><div class="displayBarText '+a+'">'+r+"</div></div>"},dangerToClass:function(e){return 0==e?"good":1==e?"average":"bad"},dangerToSpan:function(e){return 0==e?'"<span class="good">Good</span>"':1==e?'"<span class="average">Minor Alert</span>"':'"<span class="bad">Major Alert</span>"'},generateHref:function(e){var t=$("body");_urlParameters=t.data("urlParameters");var n="?";for(var a in _urlParameters)_urlParameters.hasOwnProperty(a)&&("?"!==n&&(n+=";"),n+=a+"="+_urlParameters[a]);for(var a in e)e.hasOwnProperty(a)&&("?"!==n&&(n+=";"),n+=a+"="+e[a]);return n},displayDNABlocks:function(e,t,n,a,r){if(!e)return'<div class="notice">Please place a valid subject into the DNA modifier.</div>';var o=e.split(""),i='<div class="dnaBlock"><div class="link dnaBlockNumber">1</div>',s=1,l=1;for(var c in o)if(o.hasOwnProperty(c)&&"object"!=typeof o[c]){var u;u="UI"==r.toUpperCase()?{selectUIBlock:s,selectUISubblock:l}:{selectSEBlock:s,selectSESubblock:l};var d="linkActive";s==t&&l==n&&(d="selected"),i+='<div class="link '+d+' dnaSubBlock" data-href="'+NanoUtility.generateHref(u)+'" id="dnaBlock'+c+'">'+o[c]+"</div>",c++,c%a==0&&c<o.length?(s++,l=1,i+='</div><div class="dnaBlock"><div class="link dnaBlockNumber">'+s+"</div>"):l++}return i+="</div>"},cMirror:function(e){CodeMirror.fromTextArea(document.getElementById(e),{lineNumbers:!0,indentUnit:4,indentWithTabs:!0,theme:"lesser-dark"})}};return{addHelpers:function(){NanoTemplate.addHelpers(e)},removeHelpers:function(){for(var t in e)e.hasOwnProperty(t)&&NanoTemplate.removeHelper(t)}}}(),NanoStateDefaultClass.inheritsFrom(NanoStateClass);var NanoStateDefault=new NanoStateDefaultClass;NanoStateClass.prototype.key=null,NanoStateClass.prototype.layoutRendered=!1,NanoStateClass.prototype.contentRendered=!1,NanoStateClass.prototype.mapInitialised=!1,NanoStateClass.prototype.isCurrent=function(){return NanoStateManager.getCurrentState()==this},NanoStateClass.prototype.onAdd=function(e){NanoBaseCallbacks.addCallbacks(),NanoBaseHelpers.addHelpers()},NanoStateClass.prototype.onRemove=function(e){NanoBaseCallbacks.removeCallbacks(),NanoBaseHelpers.removeHelpers()},NanoStateClass.prototype.onBeforeUpdate=function(e){return e=NanoStateManager.executeBeforeUpdateCallbacks(e)},NanoStateClass.prototype.onUpdate=function(e){try{(!this.layoutRendered||e.config.hasOwnProperty("autoUpdateLayout")&&e.config.autoUpdateLayout)&&($("#uiLayout").html(NanoTemplate.parse("layout",e)),this.layoutRendered=!0),(!this.contentRendered||e.config.hasOwnProperty("autoUpdateContent")&&e.config.autoUpdateContent)&&($("#uiContent").html(NanoTemplate.parse("main",e)),this.contentRendered=!0),NanoTemplate.templateExists("mapContent")&&(this.mapInitialised||($("#uiMap").draggable(),$("#uiMapTooltip").off("click").on("click",function(e){e.preventDefault(),$(this).fadeOut(400)}),this.mapInitialised=!0),$("#uiMapContent").html(NanoTemplate.parse("mapContent",e)),e.config.hasOwnProperty("showMap")&&e.config.showMap?($("#uiContent").addClass("hidden"),$("#uiMapWrapper").removeClass("hidden")):($("#uiMapWrapper").addClass("hidden"),$("#uiContent").removeClass("hidden"))),NanoTemplate.templateExists("mapHeader")&&$("#uiMapHeader").html(NanoTemplate.parse("mapHeader",e)),NanoTemplate.templateExists("mapFooter")&&$("#uiMapFooter").html(NanoTemplate.parse("mapFooter",e))}catch(t){return void reportError("ERROR: An error occurred while rendering the UI: "+t.message)}},NanoStateClass.prototype.onAfterUpdate=function(e){NanoStateManager.executeAfterUpdateCallbacks(e)},NanoStateClass.prototype.alertText=function(e){alert(e)};var NanoTemplate=function(){var e={},t={},n={},a={},r=function(){e=$("body").data("templateData"),null==e&&reportError("Error: Template data did not load correctly."),o()},o=function(){var t=Object.size(e);if(!t)return void $(document).trigger("templatesLoaded");for(var n in e)if(e.hasOwnProperty(n))return void $.when($.ajax({url:e[n],cache:!1,dataType:"text"})).done(function(t){t+='<div class="clearBoth"></div>';try{NanoTemplate.addTemplate(n,t)}catch(a){return void reportError("ERROR: An error occurred while loading the UI: "+a.message)}delete e[n],o()}).fail(function(){reportError("ERROR: Loading template "+n+"("+e[n]+") failed!")})},i=function(){for(var e in t)try{n[e]=doT.template(t[e],null,t)}catch(a){reportError(a.message)}};return{init:function(){r()},addTemplate:function(e,n){t[e]=n},templateExists:function(e){return t.hasOwnProperty(e)},parse:function(e,r){if(!n.hasOwnProperty(e)||!n[e]){if(!t.hasOwnProperty(e))return reportError('ERROR: Template "'+e+'" does not exist in _compiledTemplates!'),"<h2>Template error (does not exist)</h2>";i()}return"function"!=typeof n[e]?(reportError(n[e]),reportError('ERROR: Template "'+e+'" failed to compile!'),"<h2>Template error (failed to compile)</h2>"):n[e].call(this,r.data,r.config,a)},addHelper:function(e,t){return jQuery.isFunction(t)?void(a[e]=t):void reportError("NanoTemplate.addHelper failed to add "+e+" as it is not a function.")},addHelpers:function(e){for(var t in e)e.hasOwnProperty(t)&&NanoTemplate.addHelper(t,e[t])},removeHelper:function(e){helpers.hasOwnProperty(e)&&delete a[e]}}}(),NanoWindow=function(){var e,t,n,a,r,o,i=function(e,t){NanoUtility.winset("pos",e+","+t)},s=function(e,t){NanoUtility.winset("size",e+","+t)},l=function(){NanoStateManager.getData().config.user.fancy&&(c(),u(),d(),f())},c=function(){NanoUtility.winset("titlebar",0),NanoUtility.winset("can-resize",0),$(".fancy").show(),$("#uiTitleFluff").css("right","65px")},u=function(){var e=function(){return NanoUtility.close()},t=function(){return NanoUtility.winset("is-minimized","true")};$(".close").on("click",function(t){e()}),$(".minimize").on("click",function(e){t()})},d=function(){$("#uiTitleWrapper").on("mousemove",function(e){p()}),$("#uiTitleWrapper").on("mousedown",function(t){e=!0}),$("#uiTitleWrapper").on("mouseup",function(a){e=!1,t=null,n=null})},p=function(a){var r,o;null==a&&(a=window.event),e&&(null==t&&(t=a.screenX),null==n&&(n=a.screenY),r=a.screenX-t+window.screenLeft,o=a.screenY-n+window.screenTop,i(r,o),t=a.screenX,n=a.screenY)},f=function(){$("#resize").on("mousemove",function(e){m()}),$("#resize").on("mousedown",function(e){a=!0}),$("#resize").on("mouseup",function(e){a=!1})},m=function(){var e,t;null==event&&(event=window.event),a&&(null==r&&(r=event.screenX),null==o&&(o=event.screenY),e=Math.max(150,event.screenX-r+window.innerWidth),t=Math.max(150,event.screenY-o+window.innerHeight),s(e,t),r=event.screenX,o=event.screenY)};return{init:function(){$(document).on("templatesLoaded",function(){l()})}}}();