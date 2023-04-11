"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[875],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>m});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),p=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=p(e.components);return r.createElement(s.Provider,{value:t},e.children)},c="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},f=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),c=p(n),f=a,m=c["".concat(s,".").concat(f)]||c[f]||d[f]||o;return n?r.createElement(m,i(i({ref:t},u),{},{components:n})):r.createElement(m,i({ref:t},u))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=f;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[c]="string"==typeof e?e:a,i[1]=l;for(var p=2;p<o;p++)i[p]=n[p];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}f.displayName="MDXCreateElement"},1158:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>d,frontMatter:()=>o,metadata:()=>l,toc:()=>p});var r=n(7462),a=(n(7294),n(3905));const o={id:"fs-setup",title:"Create a Feature Store",sidebar_label:"Setup",slug:"/feature-store-setup"},i=void 0,l={unversionedId:"fs-setup",id:"fs-setup",title:"Create a Feature Store",description:"There are 2 Options to create a new Feature Store.",source:"@site/docs/fs-setup.md",sourceDirName:".",slug:"/feature-store-setup",permalink:"/docs/feature-store-setup",draft:!1,editUrl:"https://github.com/spierala/mini-rx-store/edit/master/docs/docs/fs-setup.md",tags:[],version:"current",frontMatter:{id:"fs-setup",title:"Create a Feature Store",sidebar_label:"Setup",slug:"/feature-store-setup"},sidebar:"docs",previous:{title:"Quick Start",permalink:"/docs/fs-quick-start"},next:{title:"Update State",permalink:"/docs/update-feature-state"}},s={},p=[{value:"Option 1: Extend <code>FeatureStore</code>",id:"option-1-extend-featurestore",level:3},{value:"Option 2: Functional creation method",id:"option-2-functional-creation-method",level:3},{value:"Lazy state initialization with <code>setInitialState</code>",id:"lazy-state-initialization-with-setinitialstate",level:2}],u={toc:p},c="wrapper";function d(e){let{components:t,...n}=e;return(0,a.kt)(c,(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"There are 2 Options to create a new Feature Store."),(0,a.kt)("h3",{id:"option-1-extend-featurestore"},"Option 1: Extend ",(0,a.kt)("inlineCode",{parentName:"h3"},"FeatureStore")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="todo-feature-store.ts"',title:'"todo-feature-store.ts"'},"import { FeatureStore } from 'mini-rx-store';\nimport { Todo } from './todo';\n\nexport interface TodoState {\n  todos: Todo[];\n  selectedTodoId: number\n}\n\nexport const initialState: TodoState = {\n  todos: [],\n  selectedTodoId: undefined\n};\n\nexport class TodoFeatureStore extends FeatureStore<TodoState> {\n  constructor() {\n    super('todo', initialState)\n  }\n}\n")),(0,a.kt)("p",null,"Extending the ",(0,a.kt)("inlineCode",{parentName:"p"},"FeatureStore")," requires to pass the feature key (e.g. 'todo') and the initial state.\nWe have to provide a TypeScript interface to ",(0,a.kt)("inlineCode",{parentName:"p"},"FeatureStore")," to get type safety: ",(0,a.kt)("inlineCode",{parentName:"p"},"FeatureStore<TodoState>"),"."),(0,a.kt)("h3",{id:"option-2-functional-creation-method"},"Option 2: Functional creation method"),(0,a.kt)("p",null,"We can create a Feature Store with ",(0,a.kt)("inlineCode",{parentName:"p"},"createFeatureStore"),"."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"const todoFs: FeatureStore<TodoState> = createFeatureStore<TodoState>('todo', initialState);\n")),(0,a.kt)("p",null,"The following examples will be based on Option 1 (Extend)."),(0,a.kt)("h2",{id:"lazy-state-initialization-with-setinitialstate"},"Lazy state initialization with ",(0,a.kt)("inlineCode",{parentName:"h2"},"setInitialState")),(0,a.kt)("p",null,"In some situations you do not know yet the initialState when creating a Feature Store.\nFor that reason you can initialize the state later with ",(0,a.kt)("inlineCode",{parentName:"p"},"setInitialState"),". "),(0,a.kt)("p",null,"Example:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"export class TodoFeatureStore extends FeatureStore<TodoState> {\n  constructor() {\n    super('todo', undefined); // Initial state is undefined! \n  }\n  \n  // Called later\n  init(initialState: TodoState) {\n    this.setInitialState(initialState);\n  }\n}\n")),(0,a.kt)("admonition",{type:"warning"},(0,a.kt)("p",{parentName:"admonition"},"An error will be thrown, if you call ",(0,a.kt)("inlineCode",{parentName:"p"},"setState")," before an initial state was set (via the constructor or ",(0,a.kt)("inlineCode",{parentName:"p"},"setInitialState"),").")))}d.isMDXComponent=!0}}]);