(window.webpackJsonp=window.webpackJsonp||[]).push([[21],{100:function(e,t,n){"use strict";n.d(t,"a",(function(){return l})),n.d(t,"b",(function(){return f}));var o=n(0),a=n.n(o);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,o,a=function(e,t){if(null==e)return{};var n,o,a={},r=Object.keys(e);for(o=0;o<r.length;o++)n=r[o],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(o=0;o<r.length;o++)n=r[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var u=a.a.createContext({}),d=function(e){var t=a.a.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},l=function(e){var t=d(e.components);return a.a.createElement(u.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},b=a.a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,r=e.originalType,s=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),l=d(n),b=o,f=l["".concat(s,".").concat(b)]||l[b]||p[b]||r;return n?a.a.createElement(f,c(c({ref:t},u),{},{components:n})):a.a.createElement(f,c({ref:t},u))}));function f(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var r=n.length,s=new Array(r);s[0]=b;var c={};for(var i in t)hasOwnProperty.call(t,i)&&(c[i]=t[i]);c.originalType=e,c.mdxType="string"==typeof e?e:o,s[1]=c;for(var u=2;u<r;u++)s[u]=n[u];return a.a.createElement.apply(null,s)}return a.a.createElement.apply(null,n)}b.displayName="MDXCreateElement"},91:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return s})),n.d(t,"metadata",(function(){return c})),n.d(t,"toc",(function(){return i})),n.d(t,"default",(function(){return d}));var o=n(3),a=n(7),r=(n(0),n(100)),s={id:"fs-set-state",title:"Update State",sidebar_label:"Set State",slug:"/update-feature-state"},c={unversionedId:"fs-set-state",id:"fs-set-state",isDocsHomePage:!1,title:"Update State",description:"Use setState to update the state of a Feature Store right away.",source:"@site/docs/fs-set-state.md",slug:"/update-feature-state",permalink:"/docs/update-feature-state",editUrl:"https://github.com/facebook/docusaurus/edit/master/website/docs/fs-set-state.md",version:"current",sidebar_label:"Set State",sidebar:"docs",previous:{title:"Create a FeatureStore",permalink:"/docs/fs-setup"},next:{title:"Select State",permalink:"/docs/select-feature-state"}},i=[{value:"Undo setState Actions with <code>undo</code>",id:"undo-setstate-actions-with-undo",children:[]}],u={toc:i};function d(e){var t=e.components,n=Object(a.a)(e,["components"]);return Object(r.b)("wrapper",Object(o.a)({},u,n,{components:t,mdxType:"MDXLayout"}),Object(r.b)("p",null,"Use ",Object(r.b)("inlineCode",{parentName:"p"},"setState")," to update the state of a Feature Store right away.\n",Object(r.b)("inlineCode",{parentName:"p"},"setState")," accepts a Partial Type. This allows us to pass only some properties of a bigger state interface."),Object(r.b)("pre",null,Object(r.b)("code",Object(o.a)({parentName:"pre"},{className:"language-ts",metastring:'title="todo-feature-store.ts"',title:'"todo-feature-store.ts"'}),"selectTodo(id: number) {\n    this.setState({selectedTodoId: id});\n}\n")),Object(r.b)("p",null,"Do you need to update the new state based on the current state?\n",Object(r.b)("inlineCode",{parentName:"p"},"setState")," accepts a callback function which gives you access to the current state."),Object(r.b)("pre",null,Object(r.b)("code",Object(o.a)({parentName:"pre"},{className:"language-ts",metastring:'title="todo-feature-store.ts"',title:'"todo-feature-store.ts"'}),"// Update state based on current state\naddTodo(todo: Todo) {\n    this.setState(state => ({\n        todos: [...state.todos, todo]\n    }))\n}\n")),Object(r.b)("p",null,"For better logging in the JS Console / Redux Dev Tools you can provide an optional name to the ",Object(r.b)("inlineCode",{parentName:"p"},"setState")," function:"),Object(r.b)("pre",null,Object(r.b)("code",Object(o.a)({parentName:"pre"},{className:"language-ts"}),"this.setState({selectedTodoId: id}, 'selectTodo');\n")),Object(r.b)("h3",{id:"undo-setstate-actions-with-undo"},"Undo setState Actions with ",Object(r.b)("inlineCode",{parentName:"h3"},"undo")),Object(r.b)("p",null,"We can easily undo setState Actions with the ",Object(r.b)("a",Object(o.a)({parentName:"p"},{href:"ext-undo-extension"}),"Undo Extension")," installed."),Object(r.b)("p",null,"Calling ",Object(r.b)("inlineCode",{parentName:"p"},"setState")," returns an Action which can be used to perform an Undo."),Object(r.b)("pre",null,Object(r.b)("code",Object(o.a)({parentName:"pre"},{className:"language-ts",metastring:'title="todo-feature-store.ts"',title:'"todo-feature-store.ts"'}),'import { Action } from "mini-rx-store";\n\nremoveTodo(id: number): Action {\n    return this.setState(state => ({\n        todos: state.todos.filter(item => item.id !== id)\n    }))\n}\n\nremoveAndUndo() {\n    const todoRemoveAction: Action = this.removeTodo(2);\n    this.undo(todoRemoveAction);   \n}\n')))}d.isMDXComponent=!0}}]);