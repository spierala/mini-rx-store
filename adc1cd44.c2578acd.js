(window.webpackJsonp=window.webpackJsonp||[]).push([[21],{91:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return i})),n.d(t,"metadata",(function(){return c})),n.d(t,"toc",(function(){return l})),n.d(t,"default",(function(){return s}));var r=n(3),a=n(7),o=(n(0),n(98)),i={id:"ext-immutable",title:"Immutable State Extension",sidebar_label:"Immutable State"},c={unversionedId:"ext-immutable",id:"ext-immutable",isDocsHomePage:!1,title:"Immutable State Extension",description:"Let's make sure that the state is not mutated accidentally. State should only be changed explicitly by dispatching an",source:"@site/docs/ext-immutable.md",slug:"/ext-immutable",permalink:"/docs/ext-immutable",editUrl:"https://github.com/spierala/mini-rx-store/edit/master/docs/docs/ext-immutable.md",version:"current",sidebar_label:"Immutable State",sidebar:"docs",previous:{title:"Redux Dev Tools Extension",permalink:"/docs/ext-redux-dev-tools"},next:{title:"Undo Extension",permalink:"/docs/ext-undo-extension"}},l=[{value:"Register the extension",id:"register-the-extension",children:[]}],u={toc:l};function s(e){var t=e.components,n=Object(a.a)(e,["components"]);return Object(o.b)("wrapper",Object(r.a)({},u,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("p",null,"Let's make sure that the state is not mutated accidentally. State should only be changed explicitly by dispatching an\naction or by using ",Object(o.b)("inlineCode",{parentName:"p"},"setState"),"."),Object(o.b)("p",null,"The Immutable State Extension will throw an error if you mutate state."),Object(o.b)("h2",{id:"register-the-extension"},"Register the extension"),Object(o.b)("p",null,"Configure the store with the ",Object(o.b)("inlineCode",{parentName:"p"},"ImmutableStateExtension"),":"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-ts"}),"import { ImmutableStateExtension } from 'mini-rx-store';\n\nconst store: Store = configureStore({\n  extensions: [\n    new ImmutableStateExtension()\n  ]\n});\n")))}s.isMDXComponent=!0},98:function(e,t,n){"use strict";n.d(t,"a",(function(){return m})),n.d(t,"b",(function(){return d}));var r=n(0),a=n.n(r);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var u=a.a.createContext({}),s=function(e){var t=a.a.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},m=function(e){var t=s(e.components);return a.a.createElement(u.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},b=a.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,i=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),m=s(n),b=r,d=m["".concat(i,".").concat(b)]||m[b]||p[b]||o;return n?a.a.createElement(d,c(c({ref:t},u),{},{components:n})):a.a.createElement(d,c({ref:t},u))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=b;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:r,i[1]=c;for(var u=2;u<o;u++)i[u]=n[u];return a.a.createElement.apply(null,i)}return a.a.createElement.apply(null,n)}b.displayName="MDXCreateElement"}}]);