(window.webpackJsonp=window.webpackJsonp||[]).push([[22],{92:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return c})),n.d(t,"metadata",(function(){return i})),n.d(t,"toc",(function(){return s})),n.d(t,"default",(function(){return p}));var o=n(3),r=n(7),a=(n(0),n(98)),c={id:"actions",title:"Actions",sidebar_label:"Actions",slug:"/actions"},i={unversionedId:"actions",id:"actions",isDocsHomePage:!1,title:"Actions",description:"Actions represent unique events in our application. Reducer functions will process the actions in order to update state.",source:"@site/docs/actions.md",slug:"/actions",permalink:"/docs/actions",editUrl:"https://github.com/spierala/mini-rx-store/edit/master/docs/docs/actions.md",version:"current",sidebar_label:"Actions",sidebar:"docs",previous:{title:"Setup",permalink:"/docs/redux-setup"},next:{title:"Reducers",permalink:"/docs/reducers"}},s=[{value:"Action Creators",id:"action-creators",children:[{value:"&quot;Classic&quot; Action Creators",id:"classic-action-creators",children:[]},{value:"Class-based Action Creators (TypeScript)",id:"class-based-action-creators-typescript",children:[]},{value:"Ts-action",id:"ts-action",children:[]}]}],l={toc:s};function p(e){var t=e.components,n=Object(r.a)(e,["components"]);return Object(a.b)("wrapper",Object(o.a)({},l,n,{components:t,mdxType:"MDXLayout"}),Object(a.b)("p",null,"Actions represent unique events in our application. Reducer functions will process the actions in order to update state."),Object(a.b)("p",null,"An action is a simple object with a ",Object(a.b)("inlineCode",{parentName:"p"},"type")," property:"),Object(a.b)("pre",null,Object(a.b)("code",Object(o.a)({parentName:"pre"},{className:"language-ts"}),"const addTodo = {\n  type: 'ADD_TODO',\n  // Besides `type`, the structure of an action object is really up to you.\n  payload: 'Use Redux'\n}\n")),Object(a.b)("p",null,"Now we can dispatch the ",Object(a.b)("inlineCode",{parentName:"p"},"addTodo")," action to the store and let the reducers calculate the new global state."),Object(a.b)("pre",null,Object(a.b)("code",Object(o.a)({parentName:"pre"},{className:"language-ts"}),"store.dispatch(addTodo);\n")),Object(a.b)("h2",{id:"action-creators"},"Action Creators"),Object(a.b)("p",null,'Of course, we do not want to create these action objects "by hand" when we need to dispatch an action.\nAction Creators will do the repetitive work for us.'),Object(a.b)("h3",{id:"classic-action-creators"},'"Classic" Action Creators'),Object(a.b)("pre",null,Object(a.b)("code",Object(o.a)({parentName:"pre"},{className:"language-ts"}),"export function addTodo(payload) {\n  return {\n    type: 'ADD_TODO',\n    payload\n  }\n}\n")),Object(a.b)("p",null,"Dispatch the action:"),Object(a.b)("pre",null,Object(a.b)("code",Object(o.a)({parentName:"pre"},{className:"language-ts"}),"store.dispatch(addTodo({id: 1, title: 'Use Redux'}));\n")),Object(a.b)("h3",{id:"class-based-action-creators-typescript"},"Class-based Action Creators (TypeScript)"),Object(a.b)("pre",null,Object(a.b)("code",Object(o.a)({parentName:"pre"},{className:"language-ts",metastring:'title="todo.ts"',title:'"todo.ts"'}),"export interface Todo {\n  id: number;\n  title: string;\n}\n")),Object(a.b)("pre",null,Object(a.b)("code",Object(o.a)({parentName:"pre"},{className:"language-ts",metastring:'title="todo-actions.ts"',title:'"todo-actions.ts"'}),"import { Action } from 'mini-rx-store';\nimport { Todo } from './todo';\n\nexport enum TodoActionTypes {\n  AddTodo = 'ADD_TODO',\n  RemoveTodo = 'REMOVE_TODO'\n}\n\nexport class AddTodo implements Action {\n  readonly type = TodoActionTypes.AddTodo;\n  constructor(public payload: Todo) {}\n}\n\nexport class RemoveTodo implements Action {\n  readonly type = TodoActionTypes.RemoveTodo;\n  constructor(public payload: number) {}\n}\n\n// Union the valid types\nexport type TodoActions = AddTodo | RemoveTodo;\n")),Object(a.b)("p",null,"Dispatch the actions:"),Object(a.b)("pre",null,Object(a.b)("code",Object(o.a)({parentName:"pre"},{className:"language-ts"}),"store.dispatch(new AddTodo({id: 1, title: 'Use Redux'}));\n\nstore.dispatch(new RemoveTodo(1))\n")),Object(a.b)("p",null,"The upcoming code examples use Class-based Action Creators."),Object(a.b)("h3",{id:"ts-action"},"Ts-action"),Object(a.b)("p",null,"With ts-action you can create actions and reducers with a minimum of boilerplate code.\nRead more in the ",Object(a.b)("a",Object(o.a)({parentName:"p"},{href:"/docs/ts-action"}),"ts-action section"),"."))}p.isMDXComponent=!0},98:function(e,t,n){"use strict";n.d(t,"a",(function(){return d})),n.d(t,"b",(function(){return m}));var o=n(0),r=n.n(o);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?c(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):c(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},a=Object.keys(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=r.a.createContext({}),p=function(e){var t=r.a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},d=function(e){var t=p(e.components);return r.a.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},b=r.a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,c=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),d=p(n),b=o,m=d["".concat(c,".").concat(b)]||d[b]||u[b]||a;return n?r.a.createElement(m,i(i({ref:t},l),{},{components:n})):r.a.createElement(m,i({ref:t},l))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,c=new Array(a);c[0]=b;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:o,c[1]=i;for(var l=2;l<a;l++)c[l]=n[l];return r.a.createElement.apply(null,c)}return r.a.createElement.apply(null,n)}b.displayName="MDXCreateElement"}}]);