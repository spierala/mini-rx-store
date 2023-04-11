"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[444],{3905:(e,t,r)=>{r.d(t,{Zo:()=>g,kt:()=>f});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var s=n.createContext({}),c=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):a(a({},t),e)),r},g=function(e){var t=c(e.components);return n.createElement(s.Provider,{value:t},e.children)},p="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,i=e.originalType,s=e.parentName,g=l(e,["components","mdxType","originalType","parentName"]),p=c(r),d=o,f=p["".concat(s,".").concat(d)]||p[d]||u[d]||i;return r?n.createElement(f,a(a({ref:t},g),{},{components:r})):n.createElement(f,a({ref:t},g))}));function f(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=r.length,a=new Array(i);a[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[p]="string"==typeof e?e:o,a[1]=l;for(var c=2;c<i;c++)a[c]=r[c];return n.createElement.apply(null,a)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},7370:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>s,contentTitle:()=>a,default:()=>u,frontMatter:()=>i,metadata:()=>l,toc:()=>c});var n=r(7462),o=(r(7294),r(3905));const i={id:"ext-logger",title:"Logger Extension",sidebar_label:"Logger"},a=void 0,l={unversionedId:"ext-logger",id:"ext-logger",title:"Logger Extension",description:"The Logger Extension enables simple Logging: console.log every action and the updated state.",source:"@site/docs/ext-logger.md",sourceDirName:".",slug:"/ext-logger",permalink:"/docs/ext-logger",draft:!1,editUrl:"https://github.com/spierala/mini-rx-store/edit/master/docs/docs/ext-logger.md",tags:[],version:"current",frontMatter:{id:"ext-logger",title:"Logger Extension",sidebar_label:"Logger"},sidebar:"docs",previous:{title:"Undo",permalink:"/docs/ext-undo-extension"},next:{title:"Angular Integration",permalink:"/docs/angular"}},s={},c=[{value:"Register the extension",id:"register-the-extension",level:2}],g={toc:c},p="wrapper";function u(e){let{components:t,...r}=e;return(0,o.kt)(p,(0,n.Z)({},g,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"The Logger Extension enables simple Logging: console.log every action and the updated state."),(0,o.kt)("h2",{id:"register-the-extension"},"Register the extension"),(0,o.kt)("p",null,"Configure the store with the ",(0,o.kt)("inlineCode",{parentName:"p"},"LoggerExtension"),":"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"import { LoggerExtension } from 'mini-rx-store';\n\nconst store: Store = configureStore({\n  extensions: [\n    new LoggerExtension()\n  ]\n});\n")))}u.isMDXComponent=!0}}]);