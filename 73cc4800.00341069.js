(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{100:function(e,t,r){"use strict";r.d(t,"a",(function(){return d})),r.d(t,"b",(function(){return m}));var n=r(0),a=r.n(n);function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function c(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?c(Object(r),!0).forEach((function(t){i(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):c(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function u(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var l=a.a.createContext({}),s=function(e){var t=a.a.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},d=function(e){var t=s(e.components);return a.a.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},b=a.a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,i=e.originalType,c=e.parentName,l=u(e,["components","mdxType","originalType","parentName"]),d=s(r),b=n,m=d["".concat(c,".").concat(b)]||d[b]||p[b]||i;return r?a.a.createElement(m,o(o({ref:t},l),{},{components:r})):a.a.createElement(m,o({ref:t},l))}));function m(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var i=r.length,c=new Array(i);c[0]=b;var o={};for(var u in t)hasOwnProperty.call(t,u)&&(o[u]=t[u]);o.originalType=e,o.mdxType="string"==typeof e?e:n,c[1]=o;for(var l=2;l<i;l++)c[l]=r[l];return a.a.createElement.apply(null,c)}return a.a.createElement.apply(null,r)}b.displayName="MDXCreateElement"},81:function(e,t,r){"use strict";r.r(t),r.d(t,"frontMatter",(function(){return c})),r.d(t,"metadata",(function(){return o})),r.d(t,"toc",(function(){return u})),r.d(t,"default",(function(){return s}));var n=r(3),a=r(7),i=(r(0),r(100)),c={id:"redux",title:"Redux",sidebar_label:"Quick Start",slug:"/redux"},o={unversionedId:"redux",id:"redux",isDocsHomePage:!1,title:"Redux",description:"MiniRx Store uses the Redux pattern to make state management easy and predictable.",source:"@site/docs/redux.md",slug:"/redux",permalink:"/mini-rx-store/docs/redux",editUrl:"https://github.com/facebook/docusaurus/edit/master/website/docs/redux.md",version:"current",sidebar_label:"Quick Start",sidebar:"docs",previous:{title:"Setup",permalink:"/mini-rx-store/docs/setup"},next:{title:"Setup",permalink:"/mini-rx-store/docs/redux-setup"}},u=[{value:"Redux Pattern",id:"redux-pattern",children:[]},{value:"What&#39;s Included",id:"whats-included",children:[]}],l={toc:u};function s(e){var t=e.components,r=Object(a.a)(e,["components"]);return Object(i.b)("wrapper",Object(n.a)({},l,r,{components:t,mdxType:"MDXLayout"}),Object(i.b)("p",null,"MiniRx Store uses the Redux pattern to make state management easy and predictable."),Object(i.b)("h2",{id:"redux-pattern"},"Redux Pattern"),Object(i.b)("p",null,"The Redux Pattern is based on this 3 key principles:"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},"Single Source of Truth: The Store holds the global application state"),Object(i.b)("li",{parentName:"ul"},"State is read-only and is only changed by dispatching actions"),Object(i.b)("li",{parentName:"ul"},"Changes are made using pure functions called reducers")),Object(i.b)("h2",{id:"whats-included"},"What's Included"),Object(i.b)("p",null,"The MiniRx Redux Store comes with these APIs:"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("inlineCode",{parentName:"li"},"feature()")," add feature state reducers dynamically"),Object(i.b)("li",{parentName:"ul"},Object(i.b)("inlineCode",{parentName:"li"},"dispatch()")," dispatch an action"),Object(i.b)("li",{parentName:"ul"},Object(i.b)("inlineCode",{parentName:"li"},"select()")," select state from the global state object as RxJS Observable"),Object(i.b)("li",{parentName:"ul"},Object(i.b)("inlineCode",{parentName:"li"},"effect()")," register a side effect (e.g. to trigger an API call and handle its result)")))}s.isMDXComponent=!0}}]);