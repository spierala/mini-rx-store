(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{75:function(e,t,r){"use strict";r.r(t),r.d(t,"frontMatter",(function(){return c})),r.d(t,"metadata",(function(){return s})),r.d(t,"toc",(function(){return i})),r.d(t,"default",(function(){return d}));var n=r(3),o=r(7),a=(r(0),r(98)),c={id:"fs-select",title:"Select State",sidebar_label:"Select",slug:"select-feature-state"},s={unversionedId:"fs-select",id:"fs-select",isDocsHomePage:!1,title:"Select State",description:"Reactive Select",source:"@site/docs/fs-select.md",slug:"/select-feature-state",permalink:"/mini-rx-store/docs/select-feature-state",editUrl:"https://github.com/spierala/mini-rx-store/edit/master/docs/docs/fs-select.md",version:"current",sidebar_label:"Select",sidebar:"docs",previous:{title:"Update State",permalink:"/mini-rx-store/docs/update-feature-state"},next:{title:"Effects",permalink:"/mini-rx-store/docs/effects-for-feature-store"}},i=[{value:"Reactive Select",id:"reactive-select",children:[]},{value:"Memoized Selectors",id:"memoized-selectors",children:[]}],l={toc:i};function d(e){var t=e.components,r=Object(o.a)(e,["components"]);return Object(a.b)("wrapper",Object(n.a)({},l,r,{components:t,mdxType:"MDXLayout"}),Object(a.b)("h2",{id:"reactive-select"},"Reactive Select"),Object(a.b)("pre",null,Object(a.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts",metastring:'title="todo-feature-store.ts"',title:'"todo-feature-store.ts"'}),"import { Observable } from 'rxjs';\n\ntodos$: Observable<Todo[]> = this.select(state => state.todos);\n")),Object(a.b)("p",null,Object(a.b)("inlineCode",{parentName:"p"},"select")," takes a callback function which gives you access to the current ",Object(a.b)("strong",{parentName:"p"},"feature state")," (see the ",Object(a.b)("inlineCode",{parentName:"p"},"state")," parameter).\nWithin that function you can pick a specific piece of state.\n",Object(a.b)("inlineCode",{parentName:"p"},"select")," returns an Observable which will emit as soon as the selected state changes."),Object(a.b)("h2",{id:"memoized-selectors"},"Memoized Selectors"),Object(a.b)("p",null,"You can use memoized selectors also with the Feature Store...\nYou only have to omit the feature name when using ",Object(a.b)("inlineCode",{parentName:"p"},"createFeatureSelector"),".\nThis is because the Feature Store is operating on a specific feature state already\n(the corresponding feature key has been provided in the constructor)."),Object(a.b)("pre",null,Object(a.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts",metastring:'title="todo-feature-store.ts"',title:'"todo-feature-store.ts"'}),"import { createFeatureSelector, createSelector } from 'mini-rx-store';\n\n// Memoized Selectors\nconst getTodoFeatureState = createFeatureSelector<TodoState>(); // Omit the feature key!\n\nconst getTodos = createSelector(\n  getTodoFeatureState,\n  state => state.todos\n);\n\nconst getSelectedTodoId = createSelector(\n  getTodoFeatureState,\n  state => state.selectedTodoId\n)\n\nconst getSelectedTodo = createSelector(\n  getTodos,\n  getSelectedTodoId,\n  (todos, id) => todos.find(item => item.id === id)\n)\n\nclass TodoFeatureStore extends FeatureStore<TodoState> {\n\n  // State Observables\n  todoState$: Observable<TodoState> = this.select(getTodoFeatureState);\n  todos$: Observable<Todo[]> = this.select(getTodos);\n  selectedTodo$: Observable<Todo> = this.select(getSelectedTodo);\n\n  constructor() {\n    super('todoFs', initialState) // Feature key 'todosFs' is provided here already...\n  }\n\n  addTodo(todo: Todo) {\n    this.setState(state => ({\n      todos: [...state.todos, todo]\n    }))\n  }\n\n  selectTodo(id: number) {\n    this.setState({selectedTodoId: id});\n  }\n}\n")))}d.isMDXComponent=!0},98:function(e,t,r){"use strict";r.d(t,"a",(function(){return u})),r.d(t,"b",(function(){return f}));var n=r(0),o=r.n(n);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function c(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function s(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?c(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):c(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var l=o.a.createContext({}),d=function(e){var t=o.a.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):s(s({},t),e)),r},u=function(e){var t=d(e.components);return o.a.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},b=o.a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,a=e.originalType,c=e.parentName,l=i(e,["components","mdxType","originalType","parentName"]),u=d(r),b=n,f=u["".concat(c,".").concat(b)]||u[b]||p[b]||a;return r?o.a.createElement(f,s(s({ref:t},l),{},{components:r})):o.a.createElement(f,s({ref:t},l))}));function f(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var a=r.length,c=new Array(a);c[0]=b;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s.mdxType="string"==typeof e?e:n,c[1]=s;for(var l=2;l<a;l++)c[l]=r[l];return o.a.createElement.apply(null,c)}return o.a.createElement.apply(null,r)}b.displayName="MDXCreateElement"}}]);