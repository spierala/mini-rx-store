(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{100:function(t,e,o){"use strict";o.d(e,"a",(function(){return l})),o.d(e,"b",(function(){return m}));var n=o(0),r=o.n(n);function a(t,e,o){return e in t?Object.defineProperty(t,e,{value:o,enumerable:!0,configurable:!0,writable:!0}):t[e]=o,t}function c(t,e){var o=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),o.push.apply(o,n)}return o}function s(t){for(var e=1;e<arguments.length;e++){var o=null!=arguments[e]?arguments[e]:{};e%2?c(Object(o),!0).forEach((function(e){a(t,e,o[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(o)):c(Object(o)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(o,e))}))}return t}function i(t,e){if(null==t)return{};var o,n,r=function(t,e){if(null==t)return{};var o,n,r={},a=Object.keys(t);for(n=0;n<a.length;n++)o=a[n],e.indexOf(o)>=0||(r[o]=t[o]);return r}(t,e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);for(n=0;n<a.length;n++)o=a[n],e.indexOf(o)>=0||Object.prototype.propertyIsEnumerable.call(t,o)&&(r[o]=t[o])}return r}var p=r.a.createContext({}),d=function(t){var e=r.a.useContext(p),o=e;return t&&(o="function"==typeof t?t(e):s(s({},e),t)),o},l=function(t){var e=d(t.components);return r.a.createElement(p.Provider,{value:e},t.children)},u={inlineCode:"code",wrapper:function(t){var e=t.children;return r.a.createElement(r.a.Fragment,{},e)}},f=r.a.forwardRef((function(t,e){var o=t.components,n=t.mdxType,a=t.originalType,c=t.parentName,p=i(t,["components","mdxType","originalType","parentName"]),l=d(o),f=n,m=l["".concat(c,".").concat(f)]||l[f]||u[f]||a;return o?r.a.createElement(m,s(s({ref:e},p),{},{components:o})):r.a.createElement(m,s({ref:e},p))}));function m(t,e){var o=arguments,n=e&&e.mdxType;if("string"==typeof t||n){var a=o.length,c=new Array(a);c[0]=f;var s={};for(var i in e)hasOwnProperty.call(e,i)&&(s[i]=e[i]);s.originalType=t,s.mdxType="string"==typeof t?t:n,c[1]=s;for(var p=2;p<a;p++)c[p]=o[p];return r.a.createElement.apply(null,c)}return r.a.createElement.apply(null,o)}f.displayName="MDXCreateElement"},88:function(t,e,o){"use strict";o.r(e),o.d(e,"frontMatter",(function(){return c})),o.d(e,"metadata",(function(){return s})),o.d(e,"toc",(function(){return i})),o.d(e,"default",(function(){return d}));var n=o(3),r=o(7),a=(o(0),o(100)),c={id:"ts-action",title:"ts-action",slug:"/ts-action"},s={unversionedId:"ts-action",id:"ts-action",isDocsHomePage:!1,title:"ts-action",description:"MiniRx supports writing and consuming actions with ts-action to reduce boilerplate code.",source:"@site/docs/ts-action.md",slug:"/ts-action",permalink:"/mini-rx-store/docs/ts-action",editUrl:"https://github.com/facebook/docusaurus/edit/master/website/docs/ts-action.md",version:"current",sidebar:"docs",previous:{title:"Effects",permalink:"/mini-rx-store/docs/effects"},next:{title:"Feature Store",permalink:"/mini-rx-store/docs/fs-quick-start"}},i=[],p={toc:i};function d(t){var e=t.components,o=Object(r.a)(t,["components"]);return Object(a.b)("wrapper",Object(n.a)({},p,o,{components:e,mdxType:"MDXLayout"}),Object(a.b)("p",null,"MiniRx supports writing and consuming actions with ",Object(a.b)("a",Object(n.a)({parentName:"p"},{href:"https://www.npmjs.com/package/ts-action"}),"ts-action")," to reduce boilerplate code."),Object(a.b)("p",null,"There are also ",Object(a.b)("a",Object(n.a)({parentName:"p"},{href:"https://www.npmjs.com/package/ts-action-operators"}),"ts-action-operators")," to consume actions in Effects."),Object(a.b)("p",null,"Install the packages using npm:"),Object(a.b)("p",null,Object(a.b)("inlineCode",{parentName:"p"},"npm install ts-action ts-action-operators")),Object(a.b)("h4",{id:"create-actions"},"Create Actions:"),Object(a.b)("pre",null,Object(a.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts",metastring:'title="ts-todo-actions.ts"',title:'"ts-todo-actions.ts"'}),"import { action, payload } from 'ts-action';\nimport { Todo } from './todo';\n\nexport const addTodo = action('ADD_TODO', payload<Todo>());\nexport const loadTodos = action('LOAD_TODOS');\nexport const loadTodosSuccess = action('LOAD_TODOS_SUCCESS', payload<Todo[]>());\nexport const loadTodosFail = action('LOAD_TODOS_FAIL', payload<Error>());\n")),Object(a.b)("h4",{id:"dispatch-an-action"},"Dispatch an Action:"),Object(a.b)("pre",null,Object(a.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),"store.dispatch(addTodo({id: 1, title: 'Use Redux'}))\n")),Object(a.b)("h4",{id:"reducer"},"Reducer"),Object(a.b)("pre",null,Object(a.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),"import { on, reducer } from 'ts-action';\n\nexport interface TodoState {\n    todos: Todo[];\n}\n\nexport const initialState: TodoState = {\n    todos: [],\n};\n\nexport const todoReducer = reducer(\n    initialState,\n    on(addTodo, (state, {payload}) => ({...state, todos: [...state.todos, payload]}))\n);\n")),Object(a.b)("h4",{id:"effects"},"Effects"),Object(a.b)("p",null,"Consume actions in Effects"),Object(a.b)("pre",null,Object(a.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),'import { actions$ } from "mini-rx-store";\nimport { mergeMap, map, catchError } from "rxjs/operators";\nimport { ofType } from "ts-action-operators";\nimport { ajax } from "rxjs/ajax";\nimport { of } from "rxjs";\nimport { loadTodos, loadTodosFail, loadTodosSuccess } from "./ts-todo-actions";\n\nexport const loadEffect = actions$.pipe(\n    ofType(loadTodos), // Use ofType from "ts-action-operators"\n    mergeMap(() =>\n        ajax("https://jsonplaceholder.typicode.com/todos").pipe(\n            map(res => loadTodosSuccess(res.response)),\n            catchError(err => of(loadTodosFail(err)))\n        )\n    )\n);\n\n// Register the effect\nstore.effect(loadEffect);\n')))}d.isMDXComponent=!0}}]);