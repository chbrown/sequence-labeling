/*! colorjoe - v0.5.7 - 2012-07-08
* http://bebraw.github.com/colorjoe/
* Copyright (c) 2012 Juho Vepsäläinen; Licensed MIT */
function ONECOLOR(a){if(Object.prototype.toString.apply(a)==="[object Array]")return a.length===4?new ONECOLOR.RGB(a[0]/255,a[1]/255,a[2]/255,a[3]/255):new ONECOLOR[a[0]](a.slice(1,a.length));if(typeof a=="string"){var b=a.toLowerCase();namedColors[b]&&(a="#"+namedColors[b]);var c=a.match(cssColorRegExp);if(c){var d=c[1].toUpperCase(),e=undef(c[8])?c[8]:parseFloat(c[8]),f=d[0]==="H",g=c[3]?100:f?360:255,h=c[5]||f?100:255,i=c[7]||f?100:255;if(undef(ONECOLOR[d]))throw new Error("one.color."+d+" is not installed.");return new ONECOLOR[d](parseFloat(c[2])/g,parseFloat(c[4])/h,parseFloat(c[6])/i,e)}a.length<6&&(a=a.replace(/^#?([0-9a-f])([0-9a-f])([0-9a-f])$/i,"$1$1$2$2$3$3"));var j=a.match(/^#?([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])$/i);if(j)return new ONECOLOR.RGB(parseInt(j[1],16)/255,parseInt(j[2],16)/255,parseInt(j[3],16)/255)}else{if(typeof a=="object"&&a.isColor)return a;if(!isNaN(a))return new ONECOLOR.RGB((a&255)/255,((a&65280)>>8)/255,((a&16711680)>>16)/255)}return!1}function installColorSpace(a,b,c){function g(a,b){var c={};c[b.toLowerCase()]=new Function("return this.rgb()."+b.toLowerCase()+"();"),ONECOLOR[b].propertyNames.forEach(function(a,d){c[a]=new Function("value","isDelta","return this."+b.toLowerCase()+"()."+a+"(value, isDelta);")});for(var d in c)c.hasOwnProperty(d)&&ONECOLOR[a].prototype[d]===undefined&&(ONECOLOR[a].prototype[d]=c[d])}ONECOLOR[a]=new Function(b.join(","),"if (Object.prototype.toString.apply("+b[0]+") === '[object Array]') {"+b.map(function(a,c){return a+"="+b[0]+"["+c+"];"}).reverse().join("")+"}"+"if ("+b.filter(function(a){return a!=="alpha"}).map(function(a){return"isNaN("+a+")"}).join("||")+"){"+'throw new Error("['+a+']: Invalid color: ("+'+b.join('+","+')+'+")");}'+b.map(function(a){return a==="hue"?"this._hue=hue<0?hue-Math.floor(hue):hue%1":a==="alpha"?"this._alpha=(isNaN(alpha)||alpha>1)?1:(alpha<0?0:alpha);":"this._"+a+"="+a+"<0?0:("+a+">1?1:"+a+")"}).join(";")+";"),ONECOLOR[a].propertyNames=b;var d=ONECOLOR[a].prototype;["valueOf","hex","css","cssa"].forEach(function(b){d[b]=d[b]||(a==="RGB"?d.hex:new Function("return this.rgb()."+b+"();"))}),d.isColor=!0,d.equals=function(c,d){undef(d)&&(d=1e-10),c=c[a.toLowerCase()]();for(var e=0;e<b.length;e=e+1)if(Math.abs(this["_"+b[e]]-c["_"+b[e]])>d)return!1;return!0},d.toJSON=new Function("return ['"+a+"', "+b.map(function(a){return"this._"+a},this).join(", ")+"];");for(var e in c)if(c.hasOwnProperty(e)){var f=e.match(/^from(.*)$/);f?ONECOLOR[f[1].toUpperCase()].prototype[a.toLowerCase()]=c[e]:d[e]=c[e]}d[a.toLowerCase()]=function(){return this},d.toString=new Function('return "[one.color.'+a+':"+'+b.map(function(a,c){return'" '+b[c]+'="+this._'+a}).join("+")+'+"]";'),b.forEach(function(a,c){d[a]=new Function("value","isDelta","if (typeof value === 'undefined') {return this._"+a+";"+"}"+"if (isDelta) {"+"return new this.constructor("+b.map(function(b,c){return"this._"+b+(a===b?"+value":"")}).join(", ")+");"+"}"+"return new this.constructor("+b.map(function(b,c){return a===b?"value":"this._"+b}).join(", ")+");")}),installedColorSpaces.forEach(function(b){g(a,b),g(b,a)}),installedColorSpaces.push(a)}function gs(){var a=this.rgb(),b=a._red*.3+a._green*.59+a._blue*.11;return new ONECOLOR.RGB(b,b,b,this._alpha)}(function(a,b){typeof define=="function"&&define.amd?define(b):a.drag=b()})(this,function(){function a(a,b){if(!a){console.warn("drag is missing elem!");return}g()?h(a,b,"touchstart","touchmove","touchend"):h(a,b,"mousedown","mousemove","mouseup")}function b(b){var c=e(b["class"]||"",b.parent),f=e("pointer",c);return e("shape shape1",f),e("shape shape2",f),e("bg bg1",c),e("bg bg2",c),a(c,d(b.cbs,f)),{background:c,pointer:f}}function c(b){var c=e(b["class"],b.parent),f=e("pointer",c);return e("shape",f),e("bg",c),a(c,d(b.cbs,f)),{background:c,pointer:f}}function d(a,b){function e(a){return function(c){c.pointer=b,a(c)}}var c={};for(var d in a)c[d]=e(a[d]);return c}function e(a,b){return f("div",a,b)}function f(a,b,c){var d=document.createElement(a);return b&&(d.className=b),c.appendChild(d),d}function g(){return typeof window.ontouchstart!="undefined"}function h(a,b,c,d,e){var f=!1;b=k(b);var g=b.begin,h=b.change,l=b.end;i(a,c,function(b){function k(){f=!1,j(document,d,c),j(document,e,k),n(l,a,b)}f=!0;var c=o(n,h,a);i(document,d,c),i(document,e,k),n(g,a,b)}),i(a,e,function(b){f=!1,n(l,a,b)})}function i(a,b,c){a.addEventListener?a.addEventListener(b,c,!1):a.attachEvent&&a.attachEvent("on"+b,c)}function j(a,b,c){a.removeEventListener?a.removeEventListener(b,c,!1):a.detachEvent&&a.detachEvent("on"+b,c)}function k(a){if(!a){var b,c;return{begin:function(a){b={x:a.elem.offsetLeft,y:a.elem.offsetTop},c=a.cursor},change:function(a){l(a.elem,"left",b.x+a.cursor.x-c.x+"px"),l(a.elem,"top",b.y+a.cursor.y-c.y+"px")},end:m}}return{begin:a.begin||m,change:a.change||m,end:a.end||m}}function l(a,b,c){a.style[b]=c}function m(){}function n(a,b,c){c.preventDefault();var d=p(b),e=b.clientWidth,f=b.clientHeight,g={x:q(b,c),y:r(b,c)},h=(g.x-d.x)/e,i=(g.y-d.y)/f;a({x:isNaN(h)?0:h,y:isNaN(i)?0:i,cursor:g,elem:b,e:c})}function o(a){var b=Array.prototype.slice,c=b.apply(arguments,[1]);return function(){return a.apply(null,c.concat(b.apply(arguments)))}}function p(a){var b=0,c=0;if(a.offsetParent)do b+=a.offsetLeft,c+=a.offsetTop;while(a=a.offsetParent);return{x:b,y:c}}function q(a,b){if(s(a)){var c=parseInt(document.defaultView.getComputedStyle(document.body,"").marginLeft,10);return b.clientX-c}if(b.pageX)return b.pageX;if(b.clientX)return b.clientX+document.body.scrollLeft}function r(a,b){if(s(a)){var c=parseInt(document.defaultView.getComputedStyle(document.body,"").marginTop,10);return b.clientY-c}if(b.pageY)return b.pageY;if(b.clientY)return b.clientY+document.body.scrollTop}function s(a){while(a.nodeName!="HTML"&&t(a,"position")!="fixed")a=a.parentNode;return a.nodeName=="HTML"?!1:!0}function t(a,b){var c;return window.getComputedStyle?c=window.getComputedStyle(a,null):c=a.currentStyle,c[b]}return a.xyslider=b,a.slider=c,a});var installedColorSpaces=[],namedColors={},undef=function(a){return typeof a=="undefined"},channelRegExp=/\s*(\.\d+|\d+(?:\.\d+)?)(%)?\s*/,alphaChannelRegExp=/\s*(\.\d+|\d+(?:\.\d+)?)\s*/,cssColorRegExp=new RegExp("^(rgb|hsl|hsv)a?\\("+channelRegExp.source+","+channelRegExp.source+","+channelRegExp.source+"(?:,"+alphaChannelRegExp.source+")?"+"\\)$","i");ONECOLOR.installMethod=function(a,b){installedColorSpaces.forEach(function(c){ONECOLOR[c].prototype[a]=b})},installColorSpace("RGB",["red","green","blue","alpha"],{hex:function(){var a=(Math.round(255*this._red)*65536+Math.round(255*this._green)*256+Math.round(255*this._blue)).toString(16);return"#"+"00000".substr(0,6-a.length)+a},css:function(){return"rgb("+Math.round(255*this._red)+","+Math.round(255*this._green)+","+Math.round(255*this._blue)+")"},cssa:function(){return"rgba("+Math.round(255*this._red)+","+Math.round(255*this._green)+","+Math.round(255*this._blue)+","+this._alpha+")"}}),typeof module!="undefined"?module.exports=ONECOLOR:typeof define=="function"&&!undef(define.amd)?define([],function(){return ONECOLOR}):(one=window.one||{},one.color=ONECOLOR),namedColors={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"0ff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000",blanchedalmond:"ffebcd",blue:"00f",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"0ff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgrey:"a9a9a9",darkgreen:"006400",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkslategrey:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dimgrey:"696969",dodgerblue:"1e90ff",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"f0f",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",grey:"808080",green:"008000",greenyellow:"adff2f",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgray:"d3d3d3",lightgrey:"d3d3d3",lightgreen:"90ee90",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslategray:"789",lightslategrey:"789",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"0f0",limegreen:"32cd32",linen:"faf0e6",magenta:"f0f",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370d8",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"d87093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",red:"f00",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",slategrey:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",wheat:"f5deb3",white:"fff",whitesmoke:"f5f5f5",yellow:"ff0",yellowgreen:"9acd32"},installColorSpace("HSV",["hue","saturation","value","alpha"],{rgb:function(){var a=this._hue,b=this._saturation,c=this._value,d=Math.min(5,Math.floor(a*6)),e=a*6-d,f=c*(1-b),g=c*(1-e*b),h=c*(1-(1-e)*b),i,j,k;switch(d){case 0:i=c,j=h,k=f;break;case 1:i=g,j=c,k=f;break;case 2:i=f,j=c,k=h;break;case 3:i=f,j=g,k=c;break;case 4:i=h,j=f,k=c;break;case 5:i=c,j=f,k=g}return new ONECOLOR.RGB(i,j,k,this._alpha)},hsl:function(){var a=(2-this._saturation)*this._value,b=this._saturation*this._value,c=a<=1?a:2-a,d;return c<1e-9?d=0:d=b/c,new ONECOLOR.HSL(this._hue,d,a/2,this._alpha)},fromRgb:function(){var a=this._red,b=this._green,c=this._blue,d=Math.max(a,b,c),e=Math.min(a,b,c),f=d-e,g,h=d===0?0:f/d,i=d;if(f===0)g=0;else switch(d){case a:g=(b-c)/f/6+(b<c?1:0);break;case b:g=(c-a)/f/6+1/3;break;case c:g=(a-b)/f/6+2/3}return new ONECOLOR.HSV(g,h,i,this._alpha)}}),installColorSpace("HSL",["hue","saturation","lightness","alpha"],{hsv:function(){var a=this._lightness*2,b=this._saturation*(a<=1?a:2-a),c;return a+b<1e-9?c=0:c=2*b/(a+b),new ONECOLOR.HSV(this._hue,c,(a+b)/2,this._alpha)},rgb:function(){return this.hsv().rgb()},fromRgb:function(){return this.hsv().hsl()}}),installColorSpace("CMYK",["cyan","magenta","yellow","black","alpha"],{rgb:function(){return new ONECOLOR.RGB(1-this._cyan*(1-this._black)-this._black,1-this._magenta*(1-this._black)-this._black,1-this._yellow*(1-this._black)-this._black,this._alpha)},fromRgb:function(){var a=this._red,b=this._green,c=this._blue,d=1-a,e=1-b,f=1-c,g=1;return a||b||c?(g=Math.min(d,Math.min(e,f)),d=(d-g)/(1-g),e=(e-g)/(1-g),f=(f-g)/(1-g)):g=1,new ONECOLOR.CMYK(d,e,f,g,this._alpha)}}),ONECOLOR.installMethod("clearer",function(a){return this.alpha(isNaN(a)?-0.1:-a,!0)}),ONECOLOR.installMethod("darken",function(a){return this.lightness(isNaN(a)?-0.1:-a,!0)}),ONECOLOR.installMethod("saturate",function(a){return this.saturation(isNaN(a)?-0.1:-a,!0)}),ONECOLOR.installMethod("greyscale",gs),ONECOLOR.installMethod("grayscale",gs),ONECOLOR.installMethod("lighten",function(a){return this.lightness(isNaN(a)?.1:a,!0)}),ONECOLOR.installMethod("mix",function(a,b){a=ONECOLOR(a).rgb(),b=1-(b||.5);var c=b*2-1,d=this._alpha-a._alpha,e=((c*d===-1?c:(c+d)/(1+c*d))+1)/2,f=1-e,g=this.rgb();return new ONECOLOR.RGB(this._red*e+a._red*f,this._green*e+a._green*f,this._blue*e+a._blue*f,this._alpha*b+a._alpha*(1-b))}),ONECOLOR.installMethod("negate",function(){var a=this.rgb();return new ONECOLOR.RGB(1-a._red,1-a._green,1-a._blue,this._alpha)}),ONECOLOR.installMethod("opaquer",function(a){return this.alpha(isNaN(a)?.1:a,!0)}),ONECOLOR.installMethod("rotate",function(a){return this.hue((a||0)/360,!0)}),ONECOLOR.installMethod("saturate",function(a){return this.saturation(isNaN(a)?.1:a,!0)}),ONECOLOR.installMethod("toAlpha",function(a){var b=this.rgb(),c=ONECOLOR(a).rgb(),d=1e-10,e=new ONECOLOR.RGB(0,0,0,b._alpha),f=["_red","_green","_blue"];return f.forEach(function(a){b[a]<d?e[a]=b[a]:b[a]>c[a]?e[a]=(b[a]-c[a])/(1-c[a]):b[a]>c[a]?e[a]=(c[a]-b[a])/c[a]:e[a]=0}),e._red>e._green?e._red>e._blue?b._alpha=e._red:b._alpha=e._blue:e._green>e._blue?b._alpha=e._green:b._alpha=e._blue,b._alpha<d?b:(f.forEach(function(a){b[a]=(b[a]-c[a])/b._alpha+c[a]}),b._alpha*=e._alpha,b)}),function(a,b){typeof exports=="object"?module.exports=b():typeof define=="function"&&define.amd?define(b):a.elemutils=b()}(this,function(){function b(a,b,c){var d=document.createElement(a);return d.className=b,c.appendChild(d),d}function c(a){var b=Array.prototype.slice,c=b.apply(arguments,[1]);return function(){return a.apply(null,c.concat(b.apply(arguments)))}}function d(b,c,d,g){var h=a(b,d),i=e(c,h),j=f("text",h,g);return{label:i,input:j}}function e(a,c){var d=b("label","",c);return d.innerHTML=a,d}function f(a,c,d){var e=b("input","",c);return e.type=a,d&&(e.maxLength=d),e}function g(a,b){a.style.left=j(b*100,0,100)+"%"}function h(a,b){a.style.top=j(b*100,0,100)+"%"}function i(a,b){a.style.background=b}function j(a,b,c){return Math.min(Math.max(a,b),c)}var a=c(b,"div");return{e:b,div:a,partial:c,labelInput:d,X:g,Y:h,BG:i}}),function(a,b){typeof define=="function"&&define.amd?define(["./onecolor","./elemutils"],b):a.colorjoeextras=b(a.ONECOLOR,a.elemutils)}(this,function(a,b){function c(a){var c=b.div("currentColor",a);return{change:function(a){b.BG(c,a.cssa())}}}function d(c,d,e){d=d||255,e=e>=0?e:2;var f={R:"red",G:"green",B:"blue",H:"hue",S:"saturation",V:"value",L:"lightness",C:"cyan",M:"magenta",Y:"yellow",K:"black"},g=(""+d).length+e;g=e?g+1:g;var h=!1,i=c.split("").map(function(a){return a.toUpperCase()});return["RGB","HSL","HSV","CMYK"].indexOf(c)<0?console.warn("Invalid field names",c):function(j,k){function n(){var b=[c];m.forEach(function(a){b.push(a.e.input.value/d)}),h=!0,k.set(a(b))}var l=b.div("colorFields",j),m=i.map(function(a,c){var d=b.labelInput("color "+f[a],a,l,g);return d.input.onkeyup=n,{name:a,e:d}});return{change:function(a){h||m.forEach(function(b){b.e.input.value=(a[f[b.name]]()*d).toFixed(e)}),h=!1}}}}function e(a,c){var d=b.labelInput("hex","",a,6),e=!1;return d.input.onkeyup=function(a){e=!0,c.set("#"+f(a.target.value,6,"0"))},{change:function(a){e||(d.input.value=a.hex().slice(1)),e=!1}}}function f(a,b,c){var d=a;for(var e=a.length,f=b;e<b;e++)d+=c;return d}return{currentColor:c,fields:d,hex:e}}),function(a,b){typeof define=="function"&&define.amd?define(["./onecolor","./drag","./elemutils","./extras"],b):a.colorjoe=b(a.ONECOLOR,a.drag,a.elemutils,a.colorjoeextras)}(this,function(a,b,c,d){function f(b,d){c.BG(b,(new a.HSV(d,1,1)).cssa())}function g(a){function f(a){k=d.xy(k,a,e,g),m()}function i(a){k=d.z(k,a.y,e,g),m()}function m(){for(var a=0,b=l.change.length;a<b;a++)l.change[a](k)}function n(){for(var a=0,b=l.done.length;a<b;a++)l.done[a](k)}if(!a.e)return console.warn("colorjoe: missing element");var c=j(a.e)?document.getElementById(a.e):a.e;c.className="colorPicker";var d=a.cbs,e=b.xyslider({parent:c,"class":"twod",cbs:{begin:f,change:f,end:n}}),g=b.slider({parent:c,"class":"oned",cbs:{begin:i,change:i,end:n}}),k=d.init(a.color,e,g),l={change:[],done:[]},o={e:c,update:function(){return m(),o},get:function(){return k},set:function(a){var b=this.get();return k=d.init(a,e,g),b.hex()!=k.hex()&&m(),o},on:function(a,b){return a=="change"||a=="done"?l[a].push(b):console.warn('Passed invalid evt name "'+a+'" to colorjoe.on'),o},removeAllListeners:function(a){if(a)delete l[a];else for(var b in l)delete l[b]}};return h(c,o,a.extras),m(),o}function h(a,b,d){if(!d)return;var e=c.div("extras",a),f;d.forEach(function(a){f=a(e,b);for(var c in f)b.on(c,f[c])})}function i(a,b){return b.map(a).filter(l).length==b.length}function j(a){return typeof a=="string"}function k(a){return typeof a=="function"}function l(a){return a}var e=function(a){return i(k,[a.init,a.xy,a.z])?function(b,c,d){return g({e:b,color:c,cbs:a,extras:d})}:console.warn("colorjoe: missing cb")};return e.rgb=e({init:function(b,c,d){var e=a(b).hsl();return this.xy(e,{x:e.saturation(),y:1-e.value()},c,d),this.z(e,e.hue(),c,d),e},xy:function(a,b,d,e){return c.X(d.pointer,b.x),c.Y(d.pointer,b.y),a.saturation(b.x).value(1-b.y)},z:function(a,b,d,e){return c.Y(e.pointer,b),f(d.background,b),a.hue(b)}}),e.hsl=e({init:function(b,c,d){var e=a(b).hsl();return this.xy(e,{x:e.hue(),y:1-e.saturation()},c,d),this.z(e,1-e.lightness(),c,d),e},xy:function(a,b,d,e){return c.X(d.pointer,b.x),c.Y(d.pointer,b.y),f(e.background,b.x),a.hue(b.x).saturation(1-b.y)},z:function(a,b,d,e){return c.Y(e.pointer,b),a.lightness(1-b)}}),e.extras=d,e});