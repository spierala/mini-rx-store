"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[6],{3905:(e,t,r)=>{r.d(t,{Zo:()=>d,kt:()=>f});var o=r(7294);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,o)}return r}function s(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,o,n=function(e,t){if(null==e)return{};var r,o,n={},a=Object.keys(e);for(o=0;o<a.length;o++)r=a[o],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)r=a[o],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var l=o.createContext({}),i=function(e){var t=o.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):s(s({},t),e)),r},d=function(e){var t=i(e.components);return o.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},p=o.forwardRef((function(e,t){var r=e.components,n=e.mdxType,a=e.originalType,l=e.parentName,d=c(e,["components","mdxType","originalType","parentName"]),p=i(r),f=n,m=p["".concat(l,".").concat(f)]||p[f]||u[f]||a;return r?o.createElement(m,s(s({ref:t},d),{},{components:r})):o.createElement(m,s({ref:t},d))}));function f(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var a=r.length,s=new Array(a);s[0]=p;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:n,s[1]=c;for(var i=2;i<a;i++)s[i]=r[i];return o.createElement.apply(null,s)}return o.createElement.apply(null,r)}p.displayName="MDXCreateElement"},6516:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>l,contentTitle:()=>s,default:()=>u,frontMatter:()=>a,metadata:()=>c,toc:()=>i});var o=r(7462),n=(r(7294),r(3905));const a={id:"fs-select",title:"Select State",sidebar_label:"Select",slug:"select-feature-state"},s=void 0,c={unversionedId:"fs-select",id:"fs-select",title:"Select State",description:"Reactive Select",source:"@site/docs/fs-select.md",sourceDirName:".",slug:"/select-feature-state",permalink:"/docs/select-feature-state",draft:!1,editUrl:"https://github.com/spierala/mini-rx-store/edit/master/docs/docs/fs-select.md",tags:[],version:"current",frontMatter:{id:"fs-select",title:"Select State",sidebar_label:"Select",slug:"select-feature-state"},sidebar:"docs",previous:{title:"Update State",permalink:"/docs/update-feature-state"},next:{title:"Effects",permalink:"/docs/effects-for-feature-store"}},l={},i=[{value:"Reactive Select",id:"reactive-select",level:2},{value:"Memoized Selectors",id:"memoized-selectors",level:2}],d={toc:i};function u(e){let{components:t,...r}=e;return(0,n.kt)("wrapper",(0,o.Z)({},d,r,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h2",{id:"reactive-select"},"Reactive Select"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="todo-feature-store.ts"',title:'"todo-feature-store.ts"'},"import { Observable } from 'rxjs';\n\ntodos$: Observable<Todo[]> = this.select(state => state.todos);\n")),(0,n.kt)("p",null,(0,n.kt)("inlineCode",{parentName:"p"},"select")," takes a callback function which gives you access to the current ",(0,n.kt)("strong",{parentName:"p"},"feature state")," (see the ",(0,n.kt)("inlineCode",{parentName:"p"},"state")," parameter).\nWithin that function you can pick a specific piece of state.\n",(0,n.kt)("inlineCode",{parentName:"p"},"select")," returns an Observable which will emit as soon as the selected state changes."),(0,n.kt)("h2",{id:"memoized-selectors"},"Memoized Selectors"),(0,n.kt)("p",null,"You can use memoized selectors also with the Feature Store...\nYou only have to omit the feature key when using ",(0,n.kt)("inlineCode",{parentName:"p"},"createFeatureSelector"),".\nThis is because the Feature Store is operating on a specific feature state already\n(the corresponding feature key has been provided in the constructor)."),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="todo-feature-store.ts"',title:'"todo-feature-store.ts"'},"import { createFeatureSelector, createSelector } from 'mini-rx-store';\n\n// Memoized Selectors\nconst getTodoFeatureState = createFeatureSelector<TodoState>(); // Omit the feature key!\n\nconst getTodos = createSelector(\n  getTodoFeatureState,\n  state => state.todos\n);\n\nconst getSelectedTodoId = createSelector(\n  getTodoFeatureState,\n  state => state.selectedTodoId\n)\n\nconst getSelectedTodo = createSelector(\n  getTodos,\n  getSelectedTodoId,\n  (todos, id) => todos.find(item => item.id === id)\n)\n\nclass TodoFeatureStore extends FeatureStore<TodoState> {\n\n  // State Observables\n  todoState$: Observable<TodoState> = this.select(getTodoFeatureState);\n  todos$: Observable<Todo[]> = this.select(getTodos);\n  selectedTodo$: Observable<Todo> = this.select(getSelectedTodo);\n\n  constructor() {\n    super('todoFs', initialState) // Feature key 'todosFs' is provided here already...\n  }\n\n  addTodo(todo: Todo) {\n    this.setState(state => ({\n      todos: [...state.todos, todo]\n    }))\n  }\n\n  selectTodo(id: number) {\n    this.setState({selectedTodoId: id});\n  }\n}\n")))}u.isMDXComponent=!0}}]);