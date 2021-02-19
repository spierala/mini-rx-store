(window.webpackJsonp=window.webpackJsonp||[]).push([[17],{100:function(e,t,r){"use strict";r.d(t,"a",(function(){return l})),r.d(t,"b",(function(){return f}));var n=r(0),o=r.n(n);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function c(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?c(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):c(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function d(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var s=o.a.createContext({}),u=function(e){var t=o.a.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},l=function(e){var t=u(e.components);return o.a.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},b=o.a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,a=e.originalType,c=e.parentName,s=d(e,["components","mdxType","originalType","parentName"]),l=u(r),b=n,f=l["".concat(c,".").concat(b)]||l[b]||p[b]||a;return r?o.a.createElement(f,i(i({ref:t},s),{},{components:r})):o.a.createElement(f,i({ref:t},s))}));function f(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var a=r.length,c=new Array(a);c[0]=b;var i={};for(var d in t)hasOwnProperty.call(t,d)&&(i[d]=t[d]);i.originalType=e,i.mdxType="string"==typeof e?e:n,c[1]=i;for(var s=2;s<a;s++)c[s]=r[s];return o.a.createElement.apply(null,c)}return o.a.createElement.apply(null,r)}b.displayName="MDXCreateElement"},87:function(e,t,r){"use strict";r.r(t),r.d(t,"frontMatter",(function(){return a})),r.d(t,"metadata",(function(){return c})),r.d(t,"toc",(function(){return i})),r.d(t,"default",(function(){return s}));var n=r(3),o=(r(0),r(100));const a={id:"reducers",title:"Reducers",slug:"/reducers"},c={unversionedId:"reducers",id:"reducers",isDocsHomePage:!1,title:"Reducers",description:"Reducers specify how the feature state changes in response to actions sent to the store. A reducer function typically looks like this:",source:"@site/docs/reducers.md",slug:"/reducers",permalink:"/mini-rx-store/docs/reducers",editUrl:"https://github.com/facebook/docusaurus/edit/master/website/docs/reducers.md",version:"current",sidebar:"docs",previous:{title:"Actions",permalink:"/mini-rx-store/docs/actions"},next:{title:"Selectors",permalink:"/mini-rx-store/docs/selectors"}},i=[{value:"Register feature reducer",id:"register-feature-reducer",children:[]},{value:"Update State",id:"update-state",children:[]}],d={toc:i};function s({components:e,...t}){return Object(o.b)("wrapper",Object(n.a)({},d,t,{components:e,mdxType:"MDXLayout"}),Object(o.b)("p",null,"Reducers specify how the feature state changes in response to actions sent to the store. A reducer function typically looks like this:"),Object(o.b)("pre",null,Object(o.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts",metastring:'title="todo-reducer.ts"',title:'"todo-reducer.ts"'}),"import { Todo } from './todo';\nimport { TodoActionTypes, TodoActions } from './todo-actions';\n\nexport interface TodoState {\n    todos: Todo[];\n    selectedTodoId: number\n}\n\nexport const initialState: TodoState = {\n    todos: [],\n    selectedTodoId: undefined\n};\n\nexport function todoReducer(\n    state: TodoState = initialState,\n    action: TodoActions\n): TodoState {\n    switch (action.type) {\n        case TodoActionTypes.AddTodo:\n            return {\n                ...state,\n                todos: [...state.todos, action.payload]\n            };\n        case TodoActionTypes.RemoveTodo:\n            return {\n                ...state,\n                todos: state.todos.filter(item => item.id !== action.payload)\n            };\n        default:\n            return state;\n    }\n}\n\n")),Object(o.b)("h3",{id:"register-feature-reducer"},"Register feature reducer"),Object(o.b)("p",null,"Before we can update state by dispatching actions, we need to add the reducer to the Store.\nThere are 2 options to register a feature reducer:"),Object(o.b)("h4",{id:"option-1-store-config"},"Option 1: Store Config"),Object(o.b)("pre",null,Object(o.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),"import { configureStore, Store } from 'mini-rx-store';\nimport todoReducer from './todo-reducer';\n\nconst store: Store = configureStore({\n    reducers: {\n        todo: todoReducer\n    }\n});\n")),Object(o.b)("p",null,"Like this the reducers are ready when the Store is initialized."),Object(o.b)("h4",{id:"option-2-add-feature-reducers-dynamically"},"Option 2: Add feature reducers dynamically"),Object(o.b)("p",null,"We can add feature reducers at any time with ",Object(o.b)("inlineCode",{parentName:"p"},"store.feature"),"."),Object(o.b)("pre",null,Object(o.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),"import todoReducer from './todo-reducer';\n\nstore.feature('todo', todoReducer)\n")),Object(o.b)("h3",{id:"update-state"},"Update State"),Object(o.b)("p",null,"Now we are all set for updating the ",Object(o.b)("em",{parentName:"p"},"todos")," feature state.\nLet's dispatch the ",Object(o.b)("inlineCode",{parentName:"p"},"AddTodo")," action:"),Object(o.b)("pre",null,Object(o.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),'store.dispatch(new AddTodo({id: 1, title: \'Use Redux\'}));\n\nstore.select(state => state).subscribe(console.log); // Output: {"todo":{"todos":[{id: 1, title: "Use Redux"}]}}\n')),Object(o.b)("p",null,"Yes, we did it! The todoReducer processed the action and the new todo landed in the ",Object(o.b)("inlineCode",{parentName:"p"},"todos")," array."))}s.isMDXComponent=!0}}]);