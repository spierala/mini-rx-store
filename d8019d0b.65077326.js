(window.webpackJsonp=window.webpackJsonp||[]).push([[26],{100:function(e,t,r){"use strict";r.d(t,"a",(function(){return u})),r.d(t,"b",(function(){return m}));var o=r(0),n=r.n(o);function c(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,o)}return r}function s(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){c(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,o,n=function(e,t){if(null==e)return{};var r,o,n={},c=Object.keys(e);for(o=0;o<c.length;o++)r=c[o],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(o=0;o<c.length;o++)r=c[o],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var i=n.a.createContext({}),d=function(e){var t=n.a.useContext(i),r=t;return e&&(r="function"==typeof e?e(t):s(s({},t),e)),r},u=function(e){var t=d(e.components);return n.a.createElement(i.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return n.a.createElement(n.a.Fragment,{},t)}},p=n.a.forwardRef((function(e,t){var r=e.components,o=e.mdxType,c=e.originalType,a=e.parentName,i=l(e,["components","mdxType","originalType","parentName"]),u=d(r),p=o,m=u["".concat(a,".").concat(p)]||u[p]||b[p]||c;return r?n.a.createElement(m,s(s({ref:t},i),{},{components:r})):n.a.createElement(m,s({ref:t},i))}));function m(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var c=r.length,a=new Array(c);a[0]=p;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:o,a[1]=s;for(var i=2;i<c;i++)a[i]=r[i];return n.a.createElement.apply(null,a)}return n.a.createElement.apply(null,r)}p.displayName="MDXCreateElement"},97:function(e,t,r){"use strict";r.r(t),r.d(t,"frontMatter",(function(){return c})),r.d(t,"metadata",(function(){return a})),r.d(t,"toc",(function(){return s})),r.d(t,"default",(function(){return i}));var o=r(3),n=(r(0),r(100));const c={id:"selectors",title:"Selectors",sidebar_label:"Selectors",slug:"/selectors"},a={unversionedId:"selectors",id:"selectors",isDocsHomePage:!1,title:"Selectors",description:"Selectors are used to select a specific piece of state.",source:"@site/docs/selectors.md",slug:"/selectors",permalink:"/mini-rx-store/docs/selectors",editUrl:"https://github.com/facebook/docusaurus/edit/master/website/docs/selectors.md",version:"current",sidebar_label:"Selectors",sidebar:"docs",previous:{title:"Reducers",permalink:"/mini-rx-store/docs/reducers"},next:{title:"Effects",permalink:"/mini-rx-store/docs/effects"}},s=[{value:"Reactive Select",id:"reactive-select",children:[]},{value:"Memoized Selectors",id:"memoized-selectors",children:[{value:"createFeatureSelector",id:"createfeatureselector",children:[]},{value:"createSelector",id:"createselector",children:[]}]}],l={toc:s};function i({components:e,...t}){return Object(n.b)("wrapper",Object(o.a)({},l,t,{components:e,mdxType:"MDXLayout"}),Object(n.b)("p",null,"Selectors are used to select a specific piece of state."),Object(n.b)("h2",{id:"reactive-select"},"Reactive Select"),Object(n.b)("p",null,"We can select state with ",Object(n.b)("inlineCode",{parentName:"p"},"store.select"),". The ",Object(n.b)("inlineCode",{parentName:"p"},"select")," method returns an Observable which emits when the selected state changes."),Object(n.b)("p",null,Object(n.b)("inlineCode",{parentName:"p"},"select")," takes a callback function which gives access to the current global state:"),Object(n.b)("pre",null,Object(n.b)("code",Object(o.a)({parentName:"pre"},{className:"language-ts"}),"import { Observable } from 'rxjs';\nimport { TodoState } from './todo-reducer';\n\nconst globalState$: Observable<any> = store.select(state => state);\nconst todoState$: Observable<TodoState> = store.select(state => state['todo']);\n")),Object(n.b)("h2",{id:"memoized-selectors"},"Memoized Selectors"),Object(n.b)("p",null,"MiniRx comes with memoized selectors out of the box. With the selectors we can easily select and combine state. The MiniRx selectors are memoized to prevent unnecessary calculations."),Object(n.b)("h3",{id:"createfeatureselector"},"createFeatureSelector"),Object(n.b)("p",null,Object(n.b)("inlineCode",{parentName:"p"},"createFeatureSelector")," selects a feature state from the global state object.\nWe have to use the same key that we used for registering the feature reducer (e.g. we used the 'todo' key for the todoReducer)."),Object(n.b)("pre",null,Object(n.b)("code",Object(o.a)({parentName:"pre"},{className:"language-ts",metastring:'title="todo-selectors.ts"',title:'"todo-selectors.ts"'}),"import { createFeatureSelector } from 'mini-rx-store';\nimport { TodoState } from './todo-reducer';\n\nexport const getTodoFeatureState = createFeatureSelector<TodoState>('todo');\n")),Object(n.b)("h3",{id:"createselector"},"createSelector"),Object(n.b)("p",null,"With ",Object(n.b)("inlineCode",{parentName:"p"},"createSelector")," we can require many other selectors to create a new selector.\nThe last argument passed to ",Object(n.b)("inlineCode",{parentName:"p"},"createSelector")," is the projection function.\nIn the projection function we can access the return values of the required selectors."),Object(n.b)("pre",null,Object(n.b)("code",Object(o.a)({parentName:"pre"},{className:"language-ts",metastring:'title="todo-selectors.ts"',title:'"todo-selectors.ts"'}),"import { createSelector } from 'mini-rx-store'\n\nexport const getTodos = createSelector(\n    getTodoFeatureState,\n    state => state.todos\n);\n\nexport const getSelectedTodoId = createSelector(\n    getTodoFeatureState,\n    state => state.selectedTodoId\n)\n\nexport const getSelectedTodo = createSelector(\n    getTodos,\n    getSelectedTodoId,\n    (todos, id) => todos.find(item => item.id === id)\n)\n")),Object(n.b)("p",null,"Let's use the memoized selectors to create our State Observables:"),Object(n.b)("pre",null,Object(n.b)("code",Object(o.a)({parentName:"pre"},{className:"language-ts"}),"import { getTodoFeatureState, getTodos, getTodosCount } from './todo-selectors';\n\nconst todoState$: Observable<TodoState> = store.select(getTodoFeatureState);\nconst todos$: Observable<Todo[]> = store.select(getTodos);\nconst selectedTodo$: Observable<Todo> = store.select(getSelectedTodo);\n")))}i.isMDXComponent=!0}}]);