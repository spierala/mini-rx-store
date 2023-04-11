"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[503],{3905:(t,e,o)=>{o.d(e,{Zo:()=>l,kt:()=>m});var n=o(7294);function r(t,e,o){return e in t?Object.defineProperty(t,e,{value:o,enumerable:!0,configurable:!0,writable:!0}):t[e]=o,t}function a(t,e){var o=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),o.push.apply(o,n)}return o}function s(t){for(var e=1;e<arguments.length;e++){var o=null!=arguments[e]?arguments[e]:{};e%2?a(Object(o),!0).forEach((function(e){r(t,e,o[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(o)):a(Object(o)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(o,e))}))}return t}function c(t,e){if(null==t)return{};var o,n,r=function(t,e){if(null==t)return{};var o,n,r={},a=Object.keys(t);for(n=0;n<a.length;n++)o=a[n],e.indexOf(o)>=0||(r[o]=t[o]);return r}(t,e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);for(n=0;n<a.length;n++)o=a[n],e.indexOf(o)>=0||Object.prototype.propertyIsEnumerable.call(t,o)&&(r[o]=t[o])}return r}var i=n.createContext({}),p=function(t){var e=n.useContext(i),o=e;return t&&(o="function"==typeof t?t(e):s(s({},e),t)),o},l=function(t){var e=p(t.components);return n.createElement(i.Provider,{value:e},t.children)},d="mdxType",u={inlineCode:"code",wrapper:function(t){var e=t.children;return n.createElement(n.Fragment,{},e)}},f=n.forwardRef((function(t,e){var o=t.components,r=t.mdxType,a=t.originalType,i=t.parentName,l=c(t,["components","mdxType","originalType","parentName"]),d=p(o),f=r,m=d["".concat(i,".").concat(f)]||d[f]||u[f]||a;return o?n.createElement(m,s(s({ref:e},l),{},{components:o})):n.createElement(m,s({ref:e},l))}));function m(t,e){var o=arguments,r=e&&e.mdxType;if("string"==typeof t||r){var a=o.length,s=new Array(a);s[0]=f;var c={};for(var i in e)hasOwnProperty.call(e,i)&&(c[i]=e[i]);c.originalType=t,c[d]="string"==typeof t?t:r,s[1]=c;for(var p=2;p<a;p++)s[p]=o[p];return n.createElement.apply(null,s)}return n.createElement.apply(null,o)}f.displayName="MDXCreateElement"},5039:(t,e,o)=>{o.r(e),o.d(e,{assets:()=>i,contentTitle:()=>s,default:()=>u,frontMatter:()=>a,metadata:()=>c,toc:()=>p});var n=o(7462),r=(o(7294),o(3905));const a={id:"ts-action",title:"ts-action",slug:"/ts-action"},s=void 0,c={unversionedId:"ts-action",id:"ts-action",title:"ts-action",description:"MiniRx supports writing and consuming actions with ts-action to reduce boilerplate code.",source:"@site/docs/ts-action.md",sourceDirName:".",slug:"/ts-action",permalink:"/docs/ts-action",draft:!1,editUrl:"https://github.com/spierala/mini-rx-store/edit/master/docs/docs/ts-action.md",tags:[],version:"current",frontMatter:{id:"ts-action",title:"ts-action",slug:"/ts-action"},sidebar:"docs",previous:{title:"Effects",permalink:"/docs/effects"},next:{title:"Quick Start",permalink:"/docs/fs-quick-start"}},i={},p=[{value:"Create actions:",id:"create-actions",level:4},{value:"Dispatch an action:",id:"dispatch-an-action",level:4},{value:"Reducer",id:"reducer",level:4},{value:"Effects",id:"effects",level:4}],l={toc:p},d="wrapper";function u(t){let{components:e,...o}=t;return(0,r.kt)(d,(0,n.Z)({},l,o,{components:e,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"MiniRx supports writing and consuming actions with ",(0,r.kt)("a",{parentName:"p",href:"https://www.npmjs.com/package/ts-action"},"ts-action")," to reduce boilerplate code."),(0,r.kt)("p",null,"There are also ",(0,r.kt)("a",{parentName:"p",href:"https://www.npmjs.com/package/ts-action-operators"},"ts-action-operators")," to consume actions in effects."),(0,r.kt)("p",null,"Install the packages using npm:"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"npm install ts-action ts-action-operators")),(0,r.kt)("h4",{id:"create-actions"},"Create actions:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="ts-todo-actions.ts"',title:'"ts-todo-actions.ts"'},"import { action, payload } from 'ts-action';\nimport { Todo } from './todo';\n\nexport const addTodo = action('ADD_TODO', payload<Todo>());\nexport const loadTodos = action('LOAD_TODOS');\nexport const loadTodosSuccess = action('LOAD_TODOS_SUCCESS', payload<Todo[]>());\nexport const loadTodosFail = action('LOAD_TODOS_FAIL', payload<Error>());\n")),(0,r.kt)("h4",{id:"dispatch-an-action"},"Dispatch an action:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"store.dispatch(addTodo({id: 1, title: 'Use Redux'}))\n")),(0,r.kt)("h4",{id:"reducer"},"Reducer"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { on, reducer } from 'ts-action';\n\nexport interface TodoState {\n  todos: Todo[];\n}\n\nexport const initialState: TodoState = {\n  todos: [],\n};\n\nexport const todoReducer = reducer(\n  initialState,\n  on(addTodo, (state, {payload}) => ({...state, todos: [...state.todos, payload]}))\n);\n")),(0,r.kt)("h4",{id:"effects"},"Effects"),(0,r.kt)("p",null,"Consume actions in effects"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { actions$ } from 'mini-rx-store';\n\nimport { mergeMap, map, catchError } from 'rxjs/operators';\nimport { ajax } from 'rxjs/ajax';\nimport { of } from 'rxjs';\n\nimport { ofType } from 'ts-action-operators';\n\nimport { loadTodos, loadTodosFail, loadTodosSuccess } from './ts-todo-actions';\n\nconst loadEffect = actions$.pipe(\n  ofType(loadTodos), // Use ofType from 'ts-action-operators'\n  mergeMap(() =>\n    ajax('https://jsonplaceholder.typicode.com/todos').pipe(\n      map(res => loadTodosSuccess(res.response)),\n      catchError(err => of(loadTodosFail(err)))\n    )\n  )\n);\n\n// Register the effect\nstore.effect(loadEffect);\n\n// Trigger the effect\nstore.dispatch(loadTodos())\n")))}u.isMDXComponent=!0}}]);