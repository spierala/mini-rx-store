(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{100:function(e,t,n){"use strict";n.d(t,"a",(function(){return p})),n.d(t,"b",(function(){return f}));var r=n(0),o=n.n(r);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var u=o.a.createContext({}),l=function(e){var t=o.a.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},p=function(e){var t=l(e.components);return o.a.createElement(u.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},b=o.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,a=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),p=l(n),b=r,f=p["".concat(a,".").concat(b)]||p[b]||d[b]||i;return n?o.a.createElement(f,c(c({ref:t},u),{},{components:n})):o.a.createElement(f,c({ref:t},u))}));function f(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,a=new Array(i);a[0]=b;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"==typeof e?e:r,a[1]=c;for(var u=2;u<i;u++)a[u]=n[u];return o.a.createElement.apply(null,a)}return o.a.createElement.apply(null,n)}b.displayName="MDXCreateElement"},83:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return a})),n.d(t,"metadata",(function(){return c})),n.d(t,"toc",(function(){return s})),n.d(t,"default",(function(){return l}));var r=n(3),o=n(7),i=(n(0),n(100)),a={id:"ext-quick-start",title:"Extensions",sidebar_label:"Quick Start"},c={unversionedId:"ext-quick-start",id:"ext-quick-start",isDocsHomePage:!1,title:"Extensions",description:"With extensions, we can extend the functionality of the MiniRx Store",source:"@site/docs/ext-quick-start.md",slug:"/ext-quick-start",permalink:"/mini-rx-store/docs/ext-quick-start",editUrl:"https://github.com/facebook/docusaurus/edit/master/website/docs/ext-quick-start.md",version:"current",sidebar_label:"Quick Start",sidebar:"docs",previous:{title:"Effects",permalink:"/mini-rx-store/docs/effects-for-feature-store"},next:{title:"Redux Dev Tools",permalink:"/mini-rx-store/docs/ext-redux-dev-tools"}},s=[{value:"What&#39;s Included",id:"whats-included",children:[]},{value:"Register Extensions",id:"register-extensions",children:[]}],u={toc:s};function l(e){var t=e.components,n=Object(o.a)(e,["components"]);return Object(i.b)("wrapper",Object(r.a)({},u,n,{components:t,mdxType:"MDXLayout"}),Object(i.b)("p",null,"With extensions, we can extend the functionality of the MiniRx Store"),Object(i.b)("h2",{id:"whats-included"},"What's Included"),Object(i.b)("p",null,"MiniRx Store comes with following extensions:"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},"Redux Dev Tools Extension: Inspect State with the Redux Dev Tools"),Object(i.b)("li",{parentName:"ul"},"Immutable Extension: Enforce state immutability "),Object(i.b)("li",{parentName:"ul"},"Undo Extension: Undo dispatched Actions"),Object(i.b)("li",{parentName:"ul"},"Logger Extension: console.log the current action and updated state")),Object(i.b)("h2",{id:"register-extensions"},"Register Extensions"),Object(i.b)("p",null,"Extensions can be registered by providing a config object to the ",Object(i.b)("inlineCode",{parentName:"p"},"store"),".\nThe ",Object(i.b)("inlineCode",{parentName:"p"},"extensions")," property accepts an array of Extension instances."),Object(i.b)("p",null,"For example:"),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-ts"}),"import { ImmutableStateExtension, LoggerExtension} from 'mini-rx-store';\n\nconst store: Store = configureStore({\n    extensions: [\n        new LoggerExtension(), \n        new ImmutableStateExtension()\n    ]\n});\n")))}l.isMDXComponent=!0}}]);