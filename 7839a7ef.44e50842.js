(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{83:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return a})),n.d(t,"metadata",(function(){return i})),n.d(t,"toc",(function(){return s})),n.d(t,"default",(function(){return l}));var r=n(3),o=n(7),c=(n(0),n(98)),a={id:"effects",title:"Effects",slug:"/effects"},i={unversionedId:"effects",id:"effects",isDocsHomePage:!1,title:"Effects",description:"Effects trigger side effects like API calls and handle the result:",source:"@site/docs/effects.md",slug:"/effects",permalink:"/mini-rx-store/docs/effects",editUrl:"https://github.com/spierala/mini-rx-store/edit/master/docs/docs/effects.md",version:"current",sidebar:"docs",previous:{title:"Selectors",permalink:"/mini-rx-store/docs/selectors"},next:{title:"ts-action",permalink:"/mini-rx-store/docs/ts-action"}},s=[],f={toc:s};function l(e){var t=e.components,n=Object(o.a)(e,["components"]);return Object(c.b)("wrapper",Object(r.a)({},f,n,{components:t,mdxType:"MDXLayout"}),Object(c.b)("p",null,"Effects trigger side effects like API calls and handle the result:"),Object(c.b)("ul",null,Object(c.b)("li",{parentName:"ul"},"An Effect listens for a specific action"),Object(c.b)("li",{parentName:"ul"},"That action triggers the actual side effect"),Object(c.b)("li",{parentName:"ul"},"The Effect needs to return a new action as soon as the side effect completed")),Object(c.b)("pre",null,Object(c.b)("code",Object(r.a)({parentName:"pre"},{className:"language-ts"}),"import { actions$, ofType } from 'mini-rx-store';\nimport {\n  LoadTodos,\n  LoadTodosSuccess,\n  LoadTodosFail,\n  TodoActionTypes\n} from './todo-actions';\nimport { mergeMap, map, catchError } from 'rxjs/operators';\nimport { ajax } from 'rxjs/ajax';\nimport { of } from 'rxjs';\n\nexport const loadEffect = actions$.pipe(\n  ofType(TodoActionTypes.LoadTodos),\n  mergeMap(() =>\n    ajax('https://jsonplaceholder.typicode.com/todos').pipe(\n      map(res => new LoadTodosSuccess(res.response)),\n      catchError(err => of(new LoadTodosFail(err)))\n    )\n  )\n);\n\n// Register the effect\nstore.effect(loadEffect);\n\n// Trigger the effect\nstore.dispatch(new LoadTodos())\n")),Object(c.b)("p",null,"The code above creates an effect. As soon as the ",Object(c.b)("inlineCode",{parentName:"p"},"LoadTodos")," action has been dispatched the API call will be executed.\nDepending on the result of the API call a new action will be dispatched:\n",Object(c.b)("inlineCode",{parentName:"p"},"LoadTodosSuccess")," or ",Object(c.b)("inlineCode",{parentName:"p"},"LoadTodosFail"),"."),Object(c.b)("p",null,"The effect needs to be registered using ",Object(c.b)("inlineCode",{parentName:"p"},"store.effect"),"."))}l.isMDXComponent=!0},98:function(e,t,n){"use strict";n.d(t,"a",(function(){return p})),n.d(t,"b",(function(){return m}));var r=n(0),o=n.n(r);function c(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){c(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},c=Object.keys(e);for(r=0;r<c.length;r++)n=c[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(r=0;r<c.length;r++)n=c[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var f=o.a.createContext({}),l=function(e){var t=o.a.useContext(f),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=l(e.components);return o.a.createElement(f.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},u=o.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,c=e.originalType,a=e.parentName,f=s(e,["components","mdxType","originalType","parentName"]),p=l(n),u=r,m=p["".concat(a,".").concat(u)]||p[u]||d[u]||c;return n?o.a.createElement(m,i(i({ref:t},f),{},{components:n})):o.a.createElement(m,i({ref:t},f))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var c=n.length,a=new Array(c);a[0]=u;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:r,a[1]=i;for(var f=2;f<c;f++)a[f]=n[f];return o.a.createElement.apply(null,a)}return o.a.createElement.apply(null,n)}u.displayName="MDXCreateElement"}}]);