(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{63:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return i})),n.d(t,"metadata",(function(){return c})),n.d(t,"toc",(function(){return s})),n.d(t,"default",(function(){return u}));var a=n(3),r=n(7),o=(n(0),n(98)),i={id:"intro",title:"Quick Start",sidebar_label:"Quick Start",slug:"/intro"},c={unversionedId:"intro",id:"intro",isDocsHomePage:!1,title:"Quick Start",description:"Purpose",source:"@site/docs/intro.md",slug:"/intro",permalink:"/docs/intro",editUrl:"https://github.com/spierala/mini-rx-store/edit/master/docs/docs/intro.md",version:"current",sidebar_label:"Quick Start",sidebar:"docs",next:{title:"Installation",permalink:"/docs/"}},s=[{value:"Purpose",id:"purpose",children:[]},{value:"What&#39;s Included",id:"whats-included",children:[]},{value:"Key Concepts",id:"key-concepts",children:[]},{value:"Basic Tutorial",id:"basic-tutorial",children:[{value:"Store (Redux API)",id:"store-redux-api",children:[]},{value:"Feature Store API",id:"feature-store-api",children:[]}]},{value:"Demos",id:"demos",children:[]}],l={toc:s};function u(e){var t=e.components,n=Object(r.a)(e,["components"]);return Object(o.b)("wrapper",Object(a.a)({},l,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("h2",{id:"purpose"},"Purpose"),Object(o.b)("p",null,Object(o.b)("strong",{parentName:"p"},"MiniRx Store")," provides Reactive State Management for JavaScript Applications inspired by ",Object(o.b)("a",Object(a.a)({parentName:"p"},{href:"https://redux.js.org/"}),"Redux"),".\nIt is a global, application-wide solution to manage state and is powered by ",Object(o.b)("a",Object(a.a)({parentName:"p"},{href:"https://rxjs.dev/"}),"RxJS"),"."),Object(o.b)("h2",{id:"whats-included"},"What's Included"),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},"RxJS powered global state management"),Object(o.b)("li",{parentName:"ul"},"State and actions are exposed as RxJS Observable"),Object(o.b)("li",{parentName:"ul"},Object(o.b)("a",Object(a.a)({parentName:"li"},{href:"redux"}),"Store (Redux API)"),":",Object(o.b)("ul",{parentName:"li"},Object(o.b)("li",{parentName:"ul"},"Actions"),Object(o.b)("li",{parentName:"ul"},"Reducers"),Object(o.b)("li",{parentName:"ul"},"Meta Reducers"),Object(o.b)("li",{parentName:"ul"},"Memoized Selectors"),Object(o.b)("li",{parentName:"ul"},"Effects"),Object(o.b)("li",{parentName:"ul"},Object(o.b)("a",Object(a.a)({parentName:"li"},{href:"ts-action"}),"Support for ts-action"),": Create and consume actions with as little boilerplate as possible"))),Object(o.b)("li",{parentName:"ul"},Object(o.b)("a",Object(a.a)({parentName:"li"},{href:"fs-quick-start"}),"Feature Store"),": Update state without actions and reducers:",Object(o.b)("ul",{parentName:"li"},Object(o.b)("li",{parentName:"ul"},Object(o.b)("inlineCode",{parentName:"li"},"setState()")," update the feature state"),Object(o.b)("li",{parentName:"ul"},Object(o.b)("inlineCode",{parentName:"li"},"select()")," read feature state"),Object(o.b)("li",{parentName:"ul"},Object(o.b)("inlineCode",{parentName:"li"},"effect()")," run side effects like API calls and update feature state"),Object(o.b)("li",{parentName:"ul"},Object(o.b)("inlineCode",{parentName:"li"},"undo()")," easily undo ",Object(o.b)("em",{parentName:"li"},"setState")," actions"))),Object(o.b)("li",{parentName:"ul"},Object(o.b)("a",Object(a.a)({parentName:"li"},{href:"ext-quick-start"}),"Extensions"),":",Object(o.b)("ul",{parentName:"li"},Object(o.b)("li",{parentName:"ul"},"Redux Dev Tools Extension: Inspect global state with the Redux Dev Tools"),Object(o.b)("li",{parentName:"ul"},"Immutable Extension: Enforce state immutability"),Object(o.b)("li",{parentName:"ul"},"Undo Extension: Undo dispatched actions"),Object(o.b)("li",{parentName:"ul"},"Logger Extension: console.log the current action and updated state"))),Object(o.b)("li",{parentName:"ul"},"Framework agnostic: MiniRx works with any front-end project built with JavaScript or TypeScript (Angular, Svelte, React, Vue, or anything else)"),Object(o.b)("li",{parentName:"ul"},"TypeScript support: The MiniRx API comes with TypeScript type definitions"),Object(o.b)("li",{parentName:"ul"},Object(o.b)("a",Object(a.a)({parentName:"li"},{href:"angular"}),"Angular Integration"),": Use MiniRx Store the Angular way: ",Object(o.b)("inlineCode",{parentName:"li"},"StoreModule.forRoot()"),", ",Object(o.b)("inlineCode",{parentName:"li"},"StoreModule.forFeature()"),", ...")),Object(o.b)("h2",{id:"key-concepts"},"Key Concepts"),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},'The store is a single object which holds the global application state. It is the "single source of truth"'),Object(o.b)("li",{parentName:"ul"},"State is exposed as RxJS Observable"),Object(o.b)("li",{parentName:"ul"},'State has a flat hierarchy and is divided into "feature states" (also called "slices" in Redux world)'),Object(o.b)("li",{parentName:"ul"},'For each "feature state" we can decide to use the ',Object(o.b)("strong",{parentName:"li"},"Redux API")," with actions and a reducer or the ",Object(o.b)("strong",{parentName:"li"},"Feature Store API")," with ",Object(o.b)("inlineCode",{parentName:"li"},"setState")),Object(o.b)("li",{parentName:"ul"},"State is read-only (immutable) and can only be changed by dispatching actions (Redux API) or by using setState (Feature Store API)")),Object(o.b)("h2",{id:"basic-tutorial"},"Basic Tutorial"),Object(o.b)("p",null,"Let's dive into some code to see MiniRx in action"),Object(o.b)("h3",{id:"store-redux-api"},"Store (Redux API)"),Object(o.b)("p",null,"MiniRx supports the classic Redux API with registering reducers and dispatching actions.\nObservable state can be selected with memoized selectors."),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-ts"}),"import {\n  Action,\n  Store,\n  configureStore,\n  createFeatureSelector,\n  createSelector\n} from 'mini-rx-store';\nimport { Observable } from 'rxjs';\n\n// 1.) State interface\ninterface CounterState {\n  count: number;\n}\n\n// 2.) Initial state\nconst counterInitialState: CounterState = {\n  count: 1\n};\n\n// 3.) Reducer\nfunction counterReducer(\n  state: CounterState = counterInitialState,\n  action: Action\n): CounterState {\n  switch (action.type) {\n    case 'inc':\n      return {\n        ...state,\n        count: state.count + 1\n      };\n    default:\n      return state;\n  }\n}\n\n// 4.) Get hold of the store instance and register root reducers\nconst store: Store = configureStore({\n  reducers: {\n    counter: counterReducer\n  }\n});\n\n// 5.) Create memoized selectors\nconst getCounterFeatureState = createFeatureSelector<CounterState>('counter');\nconst getCount = createSelector(\n  getCounterFeatureState,\n  state => state.count\n);\n\n// 6.) Select state as RxJS Observable\nconst count$: Observable<number> = store.select(getCount);\ncount$.subscribe(count => console.log('count:', count));\n\n// 7.) Dispatch an action\nstore.dispatch({ type: 'inc' });\n\n// OUTPUT: count: 1\n// OUTPUT: count: 2\n")),Object(o.b)("h3",{id:"feature-store-api"},"Feature Store API"),Object(o.b)("p",null,"Feature Stores allow us to manage feature states without actions and reducers.\nThe ",Object(o.b)("inlineCode",{parentName:"p"},"FeatureStore")," API is optimized to select and update a feature state directly with a minimum of boilerplate."),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-ts",metastring:'title="counter-feature-store.ts"',title:'"counter-feature-store.ts"'}),"import { FeatureStore } from 'mini-rx-store';\nimport { Observable } from 'rxjs';\n\n// 1.) State interface\ninterface CounterState {\n  count: number;\n}\n\n// 2.) Initial state\nconst counterInitialState: CounterState = {\n  count: 11\n};\n\nexport class CounterFeatureStore extends FeatureStore<CounterState> {\n  // Select state as RxJS Observable\n  count$: Observable<number> = this.select(state => state.count);\n\n  constructor() {\n    super('counterFs', counterInitialState);\n  }\n\n  // Update state with `setState`\n  inc() {\n    this.setState(state => ({ ...state, count: state.count + 1 }));\n  }\n}\n")),Object(o.b)("p",null,'Use the "counterFs" Feature Store like this:'),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-ts"}),"import { CounterFeatureStore } from \"./counter-feature-store\";\n\nconst counterFs = new CounterFeatureStore();\ncounterFs.count$.subscribe(count => console.log('count:', count));\ncounterFs.inc();\n\n// OUTPUT: count: 11\n// OUTPUT: count: 12\n")),Object(o.b)("div",{className:"admonition admonition-info alert alert--info"},Object(o.b)("div",Object(a.a)({parentName:"div"},{className:"admonition-heading"}),Object(o.b)("h5",{parentName:"div"},Object(o.b)("span",Object(a.a)({parentName:"h5"},{className:"admonition-icon"}),Object(o.b)("svg",Object(a.a)({parentName:"span"},{xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"}),Object(o.b)("path",Object(a.a)({parentName:"svg"},{fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"})))),"info")),Object(o.b)("div",Object(a.a)({parentName:"div"},{className:"admonition-content"}),Object(o.b)("p",{parentName:"div"},Object(o.b)("strong",{parentName:"p"},"The state of a Feature Store becomes part of the global state")),Object(o.b)("p",{parentName:"div"},"Every new Feature Store will show up in the global state with the corresponding feature key (e.g. 'counterFs')."),Object(o.b)("pre",{parentName:"div"},Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-ts"}),'store.select(state => state).subscribe(console.log);\n\n//OUTPUT: {"counter":{"count":2},"counterFs":{"count":12}}\n')))),Object(o.b)("h2",{id:"demos"},"Demos"),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},Object(o.b)("a",Object(a.a)({parentName:"li"},{href:"https://stackblitz.com/edit/mini-rx-store-basic-tutorial?file=index.ts"}),"MiniRx Store - Basic Tutorial"),": See the basic tutorial in action"),Object(o.b)("li",{parentName:"ul"},Object(o.b)("a",Object(a.a)({parentName:"li"},{href:"https://stackblitz.com/edit/mini-rx-store-demo"}),"MiniRx Store Demo"),": See MiniRx Feature Stores, and the MiniRx Redux API in action")))}u.isMDXComponent=!0},98:function(e,t,n){"use strict";n.d(t,"a",(function(){return b})),n.d(t,"b",(function(){return m}));var a=n(0),r=n.n(a);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=r.a.createContext({}),u=function(e){var t=r.a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},b=function(e){var t=u(e.components);return r.a.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},d=r.a.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,i=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),b=u(n),d=a,m=b["".concat(i,".").concat(d)]||b[d]||p[d]||o;return n?r.a.createElement(m,c(c({ref:t},l),{},{components:n})):r.a.createElement(m,c({ref:t},l))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=d;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"==typeof e?e:a,i[1]=c;for(var l=2;l<o;l++)i[l]=n[l];return r.a.createElement.apply(null,i)}return r.a.createElement.apply(null,n)}d.displayName="MDXCreateElement"}}]);