"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[664],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>m});var o=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},i=Object.keys(e);for(o=0;o<i.length;o++)n=i[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(o=0;o<i.length;o++)n=i[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=o.createContext({}),c=function(e){var t=o.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},u=function(e){var t=c(e.components);return o.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},d=o.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,s=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),d=c(n),m=r,x=d["".concat(s,".").concat(m)]||d[m]||p[m]||i;return n?o.createElement(x,a(a({ref:t},u),{},{components:n})):o.createElement(x,a({ref:t},u))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,a=new Array(i);a[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:r,a[1]=l;for(var c=2;c<i;c++)a[c]=n[c];return o.createElement.apply(null,a)}return o.createElement.apply(null,n)}d.displayName="MDXCreateElement"},4770:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>a,default:()=>p,frontMatter:()=>i,metadata:()=>l,toc:()=>c});var o=n(7462),r=(n(7294),n(3905));const i={id:"ext-redux-dev-tools",title:"Redux DevTools Extension",sidebar_label:"Redux DevTools"},a=void 0,l={unversionedId:"ext-redux-dev-tools",id:"ext-redux-dev-tools",title:"Redux DevTools Extension",description:"With the Redux DevTools Extension we can easily inspect state and actions.",source:"@site/docs/ext-redux-devtools.md",sourceDirName:".",slug:"/ext-redux-dev-tools",permalink:"/docs/ext-redux-dev-tools",draft:!1,editUrl:"https://github.com/spierala/mini-rx-store/edit/master/docs/docs/ext-redux-devtools.md",tags:[],version:"current",frontMatter:{id:"ext-redux-dev-tools",title:"Redux DevTools Extension",sidebar_label:"Redux DevTools"},sidebar:"docs",previous:{title:"Quick Start",permalink:"/docs/ext-quick-start"},next:{title:"Immutable State",permalink:"/docs/ext-immutable"}},s={},c=[{value:"Preparations",id:"preparations",level:2},{value:"Register the extension",id:"register-the-extension",level:2},{value:"Options",id:"options",level:2}],u={toc:c};function p(e){let{components:t,...i}=e;return(0,r.kt)("wrapper",(0,o.Z)({},u,i,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"With the Redux DevTools Extension we can easily inspect state and actions."),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"Redux DevTools for MiniRx",src:n(1195).Z,width:"1387",height:"672"})),(0,r.kt)("p",null,"MiniRx has basic support for the ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/zalmoxisus/redux-devtools-extension"},"Redux DevTools"),".\nThese are the current possibilities:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Inspect current state"),(0,r.kt)("li",{parentName:"ul"},"See the history of actions"),(0,r.kt)("li",{parentName:"ul"},"Inspect the action payload of all actions in the history"),(0,r.kt)("li",{parentName:"ul"},"Time travel to previous actions to restore previous states")),(0,r.kt)("h2",{id:"preparations"},"Preparations"),(0,r.kt)("p",null,"You need to install the Browser Plugin to make it work."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd"},"Chrome Redux DevTools")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://addons.mozilla.org/nl/firefox/addon/reduxdevtools/"},"Firefox Redux DevTools"))),(0,r.kt)("h2",{id:"register-the-extension"},"Register the extension"),(0,r.kt)("p",null,"Configure the store with the ",(0,r.kt)("inlineCode",{parentName:"p"},"ReduxDevtoolsExtension"),":"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { ReduxDevtoolsExtension } from 'mini-rx-store';\n\nconst store: Store = configureStore({\n  extensions: [\n    new ReduxDevtoolsExtension({\n      name: 'MiniRx Showcase',\n      maxAge: 25,\n      latency: 1000\n    })\n  ]\n});\n")),(0,r.kt)("h2",{id:"options"},"Options"),(0,r.kt)("p",null,"Currently, these options are available to configure the DevTools:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"name"),": the instance name to be shown on the DevTools monitor page."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"maxAge"),": maximum allowed actions to be stored in the history tree. The oldest actions are removed once maxAge is reached. It's critical for performance. Default is 50."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"latency"),": if more than one action is dispatched in the indicated interval, all new actions will be collected and sent at once. Default is 500 ms.")))}p.isMDXComponent=!0},1195:(e,t,n)=>{n.d(t,{Z:()=>o});const o=n.p+"assets/images/redux-dev-tools-150200902ec356d9638e05206bbe31a7.gif"}}]);