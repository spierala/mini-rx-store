"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[776],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>m});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=r.createContext({}),l=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=l(e.components);return r.createElement(p.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},f=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,p=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),f=l(n),m=a,u=f["".concat(p,".").concat(m)]||f[m]||d[m]||o;return n?r.createElement(u,i(i({ref:t},c),{},{components:n})):r.createElement(u,i({ref:t},c))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=f;var s={};for(var p in t)hasOwnProperty.call(t,p)&&(s[p]=t[p]);s.originalType=e,s.mdxType="string"==typeof e?e:a,i[1]=s;for(var l=2;l<o;l++)i[l]=n[l];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}f.displayName="MDXCreateElement"},3034:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>i,default:()=>d,frontMatter:()=>o,metadata:()=>s,toc:()=>l});var r=n(7462),a=(n(7294),n(3905));const o={id:"fs-effect",title:"Effects",sidebar_label:"Effects",slug:"/effects-for-feature-store"},i=void 0,s={unversionedId:"fs-effect",id:"fs-effect",title:"Effects",description:"effect offers an advanced way to trigger side effects (e.g. API calls) for a Feature Store.",source:"@site/docs/fs-effect.md",sourceDirName:".",slug:"/effects-for-feature-store",permalink:"/docs/effects-for-feature-store",draft:!1,editUrl:"https://github.com/spierala/mini-rx-store/edit/master/docs/docs/fs-effect.md",tags:[],version:"current",frontMatter:{id:"fs-effect",title:"Effects",sidebar_label:"Effects",slug:"/effects-for-feature-store"},sidebar:"docs",previous:{title:"Select",permalink:"/docs/select-feature-state"},next:{title:"Local Component State",permalink:"/docs/fs-config"}},p={},l=[{value:"Trigger the effect with an Observable",id:"trigger-the-effect-with-an-observable",level:3},{value:"<code>tapResponse</code>",id:"tapresponse",level:2}],c={toc:l};function d(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"effect")," offers an advanced way to trigger side effects (e.g. API calls) for a Feature Store.\nWhen the side effect completed, we can update feature state straight away (by using ",(0,a.kt)("inlineCode",{parentName:"p"},"setState()"),")."),(0,a.kt)("p",null,"Using ",(0,a.kt)("inlineCode",{parentName:"p"},"effect")," has the following benefits: "),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"you can more easily handle race conditions with RxJS flattening operators (e.g. switchMap, concatMap)"),(0,a.kt)("li",{parentName:"ul"},"the subscriptions are created internally and cleaned up as soon as the Feature Store is destroyed")),(0,a.kt)("p",null,"Example:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="todo-feature-store.ts"',title:'"todo-feature-store.ts"'},"import { EMPTY, pipe } from 'rxjs';\nimport { catchError, mergeMap, tap } from 'rxjs/operators';\nimport { ajax } from 'rxjs/ajax';\n\nloadTodos = this.effect<void>(\n  pipe(\n    mergeMap(() =>\n      ajax('https://jsonplaceholder.typicode.com/todos').pipe(\n        tap((res) => this.setState({ todos: res.response })),\n        catchError((err) => {\n          console.error(err);\n          return EMPTY;\n        })\n      )\n    )\n  )\n);\n\n// Effect using the payload value\nloadTodoById = this.effect<number>(\n  pipe(\n    mergeMap((id) =>\n      ajax('https://jsonplaceholder.typicode.com/todos?id=' + id).pipe(\n        tap((res) => this.setState({ todos: res.response })),\n        catchError((err) => {\n          console.error(err);\n          return EMPTY;\n        })\n      )\n    )\n  )\n);\n\n// Start the effects\nthis.loadTodos();\nthis.loadTodoById(5);\n")),(0,a.kt)("p",null,"The code above creates two effects for fetching todos from an API.\n",(0,a.kt)("inlineCode",{parentName:"p"},"effect")," returns a function which can be called later to start the effect with an optional payload (see ",(0,a.kt)("inlineCode",{parentName:"p"},"this.loadTodoById(5)"),")."),(0,a.kt)("p",null,"Inside the RxJS standalone ",(0,a.kt)("inlineCode",{parentName:"p"},"pipe")," we can define how to handle the side effect.\nWith RxJS flattening operators (mergeMap, switchMap, concatMap, exhaustMap) we can take care of race conditions\n(e.g. if you trigger the same API call within a short period of time)."),(0,a.kt)("p",null,"Inside the RxJS ",(0,a.kt)("inlineCode",{parentName:"p"},"tap")," and ",(0,a.kt)("inlineCode",{parentName:"p"},"catchError")," operators we can call ",(0,a.kt)("inlineCode",{parentName:"p"},"this.setState()")," to update state."),(0,a.kt)("admonition",{type:"warning"},(0,a.kt)("p",{parentName:"admonition"},"It is important to handle possible API errors with ",(0,a.kt)("inlineCode",{parentName:"p"},"catchError")," to make sure that the effect source does not complete. Otherwise, the effect will not work anymore. "),(0,a.kt)("p",{parentName:"admonition"},"The ",(0,a.kt)("inlineCode",{parentName:"p"},"tapResponse")," operator will help you to enforce error handling with less boilerplate.\n",(0,a.kt)("a",{parentName:"p",href:"/docs/effects-for-feature-store#tapresponse"},"Read more about tapResponse"),".")),(0,a.kt)("admonition",{type:"info"},(0,a.kt)("p",{parentName:"admonition"},"We can skip the RxJS standalone ",(0,a.kt)("inlineCode",{parentName:"p"},"pipe")," if we use only one RxJS operator:"),(0,a.kt)("pre",{parentName:"admonition"},(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"loadTodoById = this.effect<number>(\n  mergeMap((id) =>\n    ajax('https://jsonplaceholder.typicode.com/todos?id=' + id).pipe(\n      // ...\n    )\n  )\n);\n"))),(0,a.kt)("h3",{id:"trigger-the-effect-with-an-observable"},"Trigger the effect with an Observable"),(0,a.kt)("p",null,"We demonstrated already how to trigger an effect imperatively, like this: "),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"this.loadTodos();\nthis.loadTodoById(5);\n")),(0,a.kt)("p",null,"Alternatively you can trigger the effect also with an Observable:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"loadTodosTrigger$ = timer(0, 1000);\n\n// Adjust the generic type of effect to support the RxJS timer return type (number)\nloadTodos = this.effect<void | number>(\n    // ...\n);\n\n// Trigger the effect with an Observable\nthis.loadTodos(loadTodosTrigger$); // The todos will be fetched every second\n\n// You can still trigger imperatively whenever you want\nthis.loadTodos();\n")),(0,a.kt)("h2",{id:"tapresponse"},(0,a.kt)("inlineCode",{parentName:"h2"},"tapResponse")),(0,a.kt)("p",null,"When using ",(0,a.kt)("inlineCode",{parentName:"p"},"effect")," it is important to handle possible errors (e.g. when the API call fails).\nThe ",(0,a.kt)("inlineCode",{parentName:"p"},"tapResponse")," operator enforces to handle the error case and reduces boilerplate. "),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"tapResponse")," is a thin wrapper around RxJS ",(0,a.kt)("inlineCode",{parentName:"p"},"tap")," and ",(0,a.kt)("inlineCode",{parentName:"p"},"catchError"),"."),(0,a.kt)("p",null,"Example:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="todo-feature-store.ts"',title:'"todo-feature-store.ts"'},"import { tapResponse } from 'mini-rx-store';\n\nloadTodos = this.effect<void>(\n  pipe(\n    mergeMap(() =>\n      ajax('https://jsonplaceholder.typicode.com/todos').pipe(\n        tapResponse(\n          (res) => this.setState({ todos: res.response }),\n          (err) => console.error(err)\n        )\n      )\n    )\n  )\n);\n")),(0,a.kt)("admonition",{type:"info"},(0,a.kt)("p",{parentName:"admonition"},(0,a.kt)("inlineCode",{parentName:"p"},"tapResponse")," accepts an optional third parameter for handling the ",(0,a.kt)("inlineCode",{parentName:"p"},"finalize")," case.\nFor example, it could be used to set a loading state to ",(0,a.kt)("inlineCode",{parentName:"p"},"false")," if the API call succeeds ",(0,a.kt)("strong",{parentName:"p"},"or")," fails.")))}d.isMDXComponent=!0}}]);