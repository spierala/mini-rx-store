"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[474],{3905:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>m});var a=r(7294);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,a,n=function(e,t){if(null==e)return{};var r,a,n={},i=Object.keys(e);for(a=0;a<i.length;a++)r=i[a],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)r=i[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var s=a.createContext({}),u=function(e){var t=a.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},c=function(e){var t=u(e.components);return a.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,i=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),d=u(r),m=n,f=d["".concat(s,".").concat(m)]||d[m]||p[m]||i;return r?a.createElement(f,o(o({ref:t},c),{},{components:r})):a.createElement(f,o({ref:t},c))}));function m(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var i=r.length,o=new Array(i);o[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:n,o[1]=l;for(var u=2;u<i;u++)o[u]=r[u];return a.createElement.apply(null,o)}return a.createElement.apply(null,r)}d.displayName="MDXCreateElement"},8933:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>s,contentTitle:()=>o,default:()=>p,frontMatter:()=>i,metadata:()=>l,toc:()=>u});var a=r(7462),n=(r(7294),r(3905));const i={id:"fs-quick-start",title:"Feature Store",sidebar_label:"Quick Start"},o=void 0,l={unversionedId:"fs-quick-start",id:"fs-quick-start",title:"Feature Store",description:"Feature Stores offer simple yet powerful (global) state management.",source:"@site/docs/fs-quick-start.md",sourceDirName:".",slug:"/fs-quick-start",permalink:"/docs/fs-quick-start",draft:!1,editUrl:"https://github.com/spierala/mini-rx-store/edit/master/docs/docs/fs-quick-start.md",tags:[],version:"current",frontMatter:{id:"fs-quick-start",title:"Feature Store",sidebar_label:"Quick Start"},sidebar:"docs",previous:{title:"ts-action",permalink:"/docs/ts-action"},next:{title:"Setup",permalink:"/docs/feature-store-setup"}},s={},u=[{value:"Key Principles",id:"key-principles",level:2},{value:"What&#39;s Included",id:"whats-included",level:2}],c={toc:u};function p(e){let{components:t,...r}=e;return(0,n.kt)("wrapper",(0,a.Z)({},c,r,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("p",null,"Feature Stores offer simple yet powerful (global) state management."),(0,n.kt)("h2",{id:"key-principles"},"Key Principles"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("strong",{parentName:"li"},"Less Boilerplate"),": With the ",(0,n.kt)("inlineCode",{parentName:"li"},"FeatureStore")," API you can update state without writing actions and reducers"),(0,n.kt)("li",{parentName:"ul"},"A Feature Store ",(0,n.kt)("strong",{parentName:"li"},"manages feature state")," directly"),(0,n.kt)("li",{parentName:"ul"},"The state of a Feature Store ",(0,n.kt)("strong",{parentName:"li"},"integrates into the global state")),(0,n.kt)("li",{parentName:"ul"},"Feature Stores are ",(0,n.kt)("strong",{parentName:"li"},"destroyable"))),(0,n.kt)("h2",{id:"whats-included"},"What's Included"),(0,n.kt)("p",null,"The MiniRx ",(0,n.kt)("inlineCode",{parentName:"p"},"FeatureStore")," API:"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("inlineCode",{parentName:"li"},"setState()")," update the feature state"),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("inlineCode",{parentName:"li"},"setInitialState()")," initialize feature state lazily"),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("inlineCode",{parentName:"li"},"select()")," select state from the feature state object as RxJS Observable"),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("inlineCode",{parentName:"li"},"effect()")," run side effects like API calls and update feature state"),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("inlineCode",{parentName:"li"},"undo()")," easily undo setState actions (requires the UndoExtension)"),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("inlineCode",{parentName:"li"},"destroy()")," remove the feature state from the global state object"),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("inlineCode",{parentName:"li"},"tapResponse")," operator: handle the response in Feature Store ",(0,n.kt)("inlineCode",{parentName:"li"},"effect")," consistently and with less boilerplate")),(0,n.kt)("admonition",{type:"info"},(0,n.kt)("p",{parentName:"admonition"},(0,n.kt)("strong",{parentName:"p"},"How the Feature Store works")),(0,n.kt)("p",{parentName:"admonition"},'Feature Stores make use of Redux too: Behind the scenes a Feature Store is creating a feature reducer and a "setState" action. MiniRx dispatches that action when calling ',(0,n.kt)("inlineCode",{parentName:"p"},"setState()")," and the corresponding feature reducer will update the feature state accordingly.")))}p.isMDXComponent=!0}}]);