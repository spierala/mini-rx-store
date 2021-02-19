(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{100:function(e,t,r){"use strict";r.d(t,"a",(function(){return p})),r.d(t,"b",(function(){return m}));var n=r(0),a=r.n(n);function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function c(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){i(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var l=a.a.createContext({}),u=function(e){var t=a.a.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):c(c({},t),e)),r},p=function(e){var t=u(e.components);return a.a.createElement(l.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},d=a.a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,i=e.originalType,o=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),p=u(r),d=n,m=p["".concat(o,".").concat(d)]||p[d]||b[d]||i;return r?a.a.createElement(m,c(c({ref:t},l),{},{components:r})):a.a.createElement(m,c({ref:t},l))}));function m(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var i=r.length,o=new Array(i);o[0]=d;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"==typeof e?e:n,o[1]=c;for(var l=2;l<i;l++)o[l]=r[l];return a.a.createElement.apply(null,o)}return a.a.createElement.apply(null,r)}d.displayName="MDXCreateElement"},86:function(e,t,r){"use strict";r.r(t),r.d(t,"frontMatter",(function(){return i})),r.d(t,"metadata",(function(){return o})),r.d(t,"toc",(function(){return c})),r.d(t,"default",(function(){return l}));var n=r(3),a=(r(0),r(100));const i={id:"fs-quick-start",title:"Feature Store",sidebar_label:"Quick Start"},o={unversionedId:"fs-quick-start",id:"fs-quick-start",isDocsHomePage:!1,title:"Feature Store",description:"Feature Stores offer simple yet powerful state management.",source:"@site/docs/fs-quick-start.md",slug:"/fs-quick-start",permalink:"/mini-rx-store/docs/fs-quick-start",editUrl:"https://github.com/facebook/docusaurus/edit/master/website/docs/fs-quick-start.md",version:"current",sidebar_label:"Quick Start",sidebar:"docs",previous:{title:"ts-action",permalink:"/mini-rx-store/docs/ts-action"},next:{title:"Create a FeatureStore",permalink:"/mini-rx-store/docs/fs-setup"}},c=[{value:"Key Principles",id:"key-principles",children:[]},{value:"What&#39;s Included",id:"whats-included",children:[]}],s={toc:c};function l({components:e,...t}){return Object(a.b)("wrapper",Object(n.a)({},s,t,{components:e,mdxType:"MDXLayout"}),Object(a.b)("p",null,"Feature Stores offer simple yet powerful state management."),Object(a.b)("h2",{id:"key-principles"},"Key Principles"),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},Object(a.b)("strong",{parentName:"li"},"Less Boilerplate"),": With the ",Object(a.b)("inlineCode",{parentName:"li"},"FeatureStore")," API you can update state without writing actions and reducers"),Object(a.b)("li",{parentName:"ul"},"A Feature Store ",Object(a.b)("strong",{parentName:"li"},"manages feature state")," directly"),Object(a.b)("li",{parentName:"ul"},"The state of a Feature Store ",Object(a.b)("strong",{parentName:"li"},"integrates into the global state"))),Object(a.b)("h2",{id:"whats-included"},"What's Included"),Object(a.b)("p",null,"The MiniRx ",Object(a.b)("inlineCode",{parentName:"p"},"FeatureStore")," API:"),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"setState()")," update the feature state"),Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"select()")," select state from the feature state object as RxJS Observable"),Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"effect()")," run side effects like API calls and update feature state"),Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"undo()")," easily undo setState actions (requires UndoExtension)")),Object(a.b)("div",{className:"admonition admonition-info alert alert--info"},Object(a.b)("div",Object(n.a)({parentName:"div"},{className:"admonition-heading"}),Object(a.b)("h5",{parentName:"div"},Object(a.b)("span",Object(n.a)({parentName:"h5"},{className:"admonition-icon"}),Object(a.b)("svg",Object(n.a)({parentName:"span"},{xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"}),Object(a.b)("path",Object(n.a)({parentName:"svg"},{fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"})))),"info")),Object(a.b)("div",Object(n.a)({parentName:"div"},{className:"admonition-content"}),Object(a.b)("p",{parentName:"div"},Object(a.b)("strong",{parentName:"p"},"How the FeatureStore works")),Object(a.b)("p",{parentName:"div"},'Feature Stores make use of Redux too: Behind the scenes a Feature Store is creating a feature reducer and a "setState" action. MiniRx dispatches that action when calling ',Object(a.b)("inlineCode",{parentName:"p"},"setState()")," and the corresponding feature reducer will update the feature state accordingly."))))}l.isMDXComponent=!0}}]);