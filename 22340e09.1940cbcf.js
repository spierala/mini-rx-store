(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{140:function(e,t,n){"use strict";n.r(t),t.default=n.p+"assets/images/redux-dev-tools-150200902ec356d9638e05206bbe31a7.gif"},74:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return i})),n.d(t,"metadata",(function(){return l})),n.d(t,"toc",(function(){return s})),n.d(t,"default",(function(){return u}));var r=n(3),o=n(7),a=(n(0),n(98)),i={id:"ext-redux-dev-tools",title:"Redux Dev Tools Extension",sidebar_label:"Redux Dev Tools"},l={unversionedId:"ext-redux-dev-tools",id:"ext-redux-dev-tools",isDocsHomePage:!1,title:"Redux Dev Tools Extension",description:"With the Redux Dev Tools Extension we can easily inspect state and actions.",source:"@site/docs/ext-redux-devtools.md",slug:"/ext-redux-dev-tools",permalink:"/docs/ext-redux-dev-tools",editUrl:"https://github.com/spierala/mini-rx-store/edit/master/docs/docs/ext-redux-devtools.md",version:"current",sidebar_label:"Redux Dev Tools",sidebar:"docs",previous:{title:"Extensions",permalink:"/docs/ext-quick-start"},next:{title:"Immutable State Extension",permalink:"/docs/ext-immutable"}},s=[{value:"Preparations",id:"preparations",children:[]},{value:"Register the extension",id:"register-the-extension",children:[{value:"Angular",id:"angular",children:[]}]},{value:"Options",id:"options",children:[]}],c={toc:s};function u(e){var t=e.components,i=Object(o.a)(e,["components"]);return Object(a.b)("wrapper",Object(r.a)({},c,i,{components:t,mdxType:"MDXLayout"}),Object(a.b)("p",null,"With the Redux Dev Tools Extension we can easily inspect state and actions."),Object(a.b)("p",null,Object(a.b)("img",{alt:"Redux Dev Tools for MiniRx",src:n(140).default})),Object(a.b)("p",null,"MiniRx has basic support for the ",Object(a.b)("a",Object(r.a)({parentName:"p"},{href:"https://github.com/zalmoxisus/redux-devtools-extension"}),"Redux Dev Tools"),".\nThese are the current possibilities:"),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},"Inspect current state"),Object(a.b)("li",{parentName:"ul"},"See the history of actions"),Object(a.b)("li",{parentName:"ul"},"Inspect the action payload of all actions in the history"),Object(a.b)("li",{parentName:"ul"},"Time travel to previous actions to restore previous states")),Object(a.b)("h2",{id:"preparations"},"Preparations"),Object(a.b)("p",null,"You need to install the Browser Plugin to make it work."),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},Object(a.b)("a",Object(r.a)({parentName:"li"},{href:"https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd"}),"Chrome Redux Dev Tools")),Object(a.b)("li",{parentName:"ul"},Object(a.b)("a",Object(r.a)({parentName:"li"},{href:"https://addons.mozilla.org/nl/firefox/addon/reduxdevtools/"}),"Firefox Redux Dev Tools"))),Object(a.b)("h2",{id:"register-the-extension"},"Register the extension"),Object(a.b)("p",null,"Configure the store with the ",Object(a.b)("inlineCode",{parentName:"p"},"ReduxDevtoolsExtension"),":"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-ts"}),"import { ReduxDevtoolsExtension } from 'mini-rx-store';\n\nconst store: Store = configureStore({\n  extensions: [\n    new ReduxDevtoolsExtension({\n      name: 'MiniRx Showcase',\n      maxAge: 25,\n      latency: 1000\n    })\n  ]\n});\n")),Object(a.b)("h3",{id:"angular"},"Angular"),Object(a.b)("p",null,"If you are using Angular you have to register the ",Object(a.b)("inlineCode",{parentName:"p"},"StoreDevtoolsModule")," from 'mini-rx-store-ng'.\nSee ",Object(a.b)("a",Object(r.a)({parentName:"p"},{href:"/docs/angular#redux-dev-tools"}),"Angular Redux Dev Tools")," for more information."),Object(a.b)("h2",{id:"options"},"Options"),Object(a.b)("p",null,"Currently, these options are available to configure the DevTools:"),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"name"),": the instance name to be shown on the DevTools monitor page."),Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"maxAge"),": maximum allowed actions to be stored in the history tree. The oldest actions are removed once maxAge is reached. It's critical for performance. Default is 50."),Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"latency"),": if more than one action is dispatched in the indicated interval, all new actions will be collected and sent at once. Default is 500 ms.")))}u.isMDXComponent=!0},98:function(e,t,n){"use strict";n.d(t,"a",(function(){return p})),n.d(t,"b",(function(){return m}));var r=n(0),o=n.n(r);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var c=o.a.createContext({}),u=function(e){var t=o.a.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},p=function(e){var t=u(e.components);return o.a.createElement(c.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},d=o.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,i=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),p=u(n),d=r,m=p["".concat(i,".").concat(d)]||p[d]||b[d]||a;return n?o.a.createElement(m,l(l({ref:t},c),{},{components:n})):o.a.createElement(m,l({ref:t},c))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,i=new Array(a);i[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:r,i[1]=l;for(var c=2;c<a;c++)i[c]=n[c];return o.a.createElement.apply(null,i)}return o.a.createElement.apply(null,n)}d.displayName="MDXCreateElement"}}]);