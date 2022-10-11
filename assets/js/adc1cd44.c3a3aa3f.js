"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[413],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>d});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),c=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=c(e.components);return r.createElement(s.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},p=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),p=c(n),d=a,b=p["".concat(s,".").concat(d)]||p[d]||m[d]||o;return n?r.createElement(b,i(i({ref:t},u),{},{components:n})):r.createElement(b,i({ref:t},u))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=p;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:a,i[1]=l;for(var c=2;c<o;c++)i[c]=n[c];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}p.displayName="MDXCreateElement"},1448:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>m,frontMatter:()=>o,metadata:()=>l,toc:()=>c});var r=n(7462),a=(n(7294),n(3905));const o={id:"ext-immutable",title:"Immutable State Extension",sidebar_label:"Immutable State"},i=void 0,l={unversionedId:"ext-immutable",id:"ext-immutable",title:"Immutable State Extension",description:"Let's make sure that the state is not mutated accidentally. State should only be changed explicitly by dispatching an",source:"@site/docs/ext-immutable.md",sourceDirName:".",slug:"/ext-immutable",permalink:"/docs/ext-immutable",draft:!1,editUrl:"https://github.com/spierala/mini-rx-store/edit/master/docs/docs/ext-immutable.md",tags:[],version:"current",frontMatter:{id:"ext-immutable",title:"Immutable State Extension",sidebar_label:"Immutable State"},sidebar:"docs",previous:{title:"Redux DevTools",permalink:"/docs/ext-redux-dev-tools"},next:{title:"Undo",permalink:"/docs/ext-undo-extension"}},s={},c=[{value:"Register the extension",id:"register-the-extension",level:2}],u={toc:c};function m(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Let's make sure that the state is not mutated accidentally. State should only be changed explicitly by dispatching an\naction or by using ",(0,a.kt)("inlineCode",{parentName:"p"},"setState"),"."),(0,a.kt)("p",null,"The Immutable State Extension will throw an error if you mutate state."),(0,a.kt)("h2",{id:"register-the-extension"},"Register the extension"),(0,a.kt)("p",null,"Configure the store with the ",(0,a.kt)("inlineCode",{parentName:"p"},"ImmutableStateExtension"),":"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { ImmutableStateExtension } from 'mini-rx-store';\n\nconst store: Store = configureStore({\n  extensions: [\n    new ImmutableStateExtension()\n  ]\n});\n")))}m.isMDXComponent=!0}}]);