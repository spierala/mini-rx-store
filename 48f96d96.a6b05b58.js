(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{78:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return i})),n.d(t,"metadata",(function(){return c})),n.d(t,"toc",(function(){return s})),n.d(t,"default",(function(){return u}));var r=n(3),o=n(7),a=(n(0),n(98)),i={id:"angular",title:"Angular Integration",sidebar_label:"Angular Integration"},c={unversionedId:"angular",id:"angular",isDocsHomePage:!1,title:"Angular Integration",description:"mini-rx-store-ng is a package for better Angular Integration.",source:"@site/docs/angular.md",slug:"/angular",permalink:"/docs/angular",editUrl:"https://github.com/spierala/mini-rx-store/edit/master/docs/docs/angular.md",version:"current",sidebar_label:"Angular Integration",sidebar:"docs",previous:{title:"Logger Extension",permalink:"/docs/ext-logger"}},s=[{value:"Usage",id:"usage",children:[{value:"Requirements",id:"requirements",children:[]},{value:"Installation",id:"installation",children:[]},{value:"Configure the Store in the App Module",id:"configure-the-store-in-the-app-module",children:[]},{value:"Register Feature Reducers in Angular Feature Modules",id:"register-feature-reducers-in-angular-feature-modules",children:[]},{value:"Register Effects",id:"register-effects",children:[]},{value:"Get hold of the store and actions via the Angular Dependency Injection",id:"get-hold-of-the-store-and-actions-via-the-angular-dependency-injection",children:[]},{value:"Redux Dev Tools",id:"redux-dev-tools",children:[]}]}],l={toc:s};function u(e){var t=e.components,n=Object(o.a)(e,["components"]);return Object(a.b)("wrapper",Object(r.a)({},l,n,{components:t,mdxType:"MDXLayout"}),Object(a.b)("p",null,Object(a.b)("a",Object(r.a)({parentName:"p"},{href:"https://www.npmjs.com/package/mini-rx-store-ng"}),"mini-rx-store-ng")," is a package for better Angular Integration."),Object(a.b)("p",null,Object(a.b)("a",Object(r.a)({parentName:"p"},{href:"https://www.npmjs.com/package/mini-rx-store-ng"}),Object(a.b)("img",Object(r.a)({parentName:"a"},{src:"https://badge.fury.io/js/mini-rx-store-ng.svg",alt:"npm version"})))),Object(a.b)("p",null,"With ",Object(a.b)("a",Object(r.a)({parentName:"p"},{href:"https://www.npmjs.com/package/mini-rx-store-ng"}),"mini-rx-store-ng")," we can use MiniRx Store the Angular way:"),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},Object(a.b)("a",Object(r.a)({parentName:"li"},{href:"#configure-the-store-in-the-app-module"}),"Configure the store")," using ",Object(a.b)("inlineCode",{parentName:"li"},"StoreModule.forRoot()")),Object(a.b)("li",{parentName:"ul"},Object(a.b)("a",Object(r.a)({parentName:"li"},{href:"#register-feature-states-in-angular-feature-modules"}),"Register feature reducers")," using ",Object(a.b)("inlineCode",{parentName:"li"},"StoreModule.forFeature()")),Object(a.b)("li",{parentName:"ul"},Object(a.b)("a",Object(r.a)({parentName:"li"},{href:"#register-effects"}),"Register effects")," using ",Object(a.b)("inlineCode",{parentName:"li"},"EffectsModule.register()")),Object(a.b)("li",{parentName:"ul"},Object(a.b)("a",Object(r.a)({parentName:"li"},{href:"#get-hold-of-the-store-and-actions-via-the-angular-dependency-injection"}),"Use Angular Dependency Injection")," for ",Object(a.b)("inlineCode",{parentName:"li"},"Store")," and ",Object(a.b)("inlineCode",{parentName:"li"},"Actions")),Object(a.b)("li",{parentName:"ul"},Object(a.b)("a",Object(r.a)({parentName:"li"},{href:"#redux-dev-tools"}),"Redux Devtools Extension"))),Object(a.b)("h2",{id:"usage"},"Usage"),Object(a.b)("h3",{id:"requirements"},"Requirements"),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},"Angular >= 9 ")),Object(a.b)("h3",{id:"installation"},"Installation"),Object(a.b)("p",null,Object(a.b)("inlineCode",{parentName:"p"},"npm i mini-rx-store-ng")),Object(a.b)("h3",{id:"configure-the-store-in-the-app-module"},"Configure the Store in the App Module"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-ts",metastring:'title="app.module.ts"',title:'"app.module.ts"'}),"import { NgModule } from '@angular/core';\nimport { StoreModule } from 'mini-rx-store-ng';\n\n@NgModule({\n  imports: [\n    StoreModule.forRoot({\n      extensions: [\n        // Add extensions here\n        // new LoggerExtension()\n      ],\n      reducers: {\n        // Add feature reducers here\n        // todo: todoReducer\n      },\n      metaReducers: [\n        // Add meta reducers here\n      ]\n    }),\n  ]\n})\nexport class AppModule {\n}\n")),Object(a.b)("h3",{id:"register-feature-reducers-in-angular-feature-modules"},"Register Feature Reducers in Angular Feature Modules"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-ts",metastring:'title="todo.module.ts"',title:'"todo.module.ts"'}),"import { NgModule } from '@angular/core';\nimport { StoreModule } from 'mini-rx-store-ng';\nimport todoReducer from './todo-reducer';\n\n@NgModule({\n  imports: [\n    StoreModule.forFeature('todo', todoReducer),\n  ]\n})\nexport class TodoModule {\n  constructor() {\n  }\n}\n")),Object(a.b)("h3",{id:"register-effects"},"Register Effects"),Object(a.b)("p",null,'Create an Angular service which holds all effects which belong to a Feature (e.g. "todo").'),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-ts",metastring:'title="todo-effects.service.ts"',title:'"todo-effects.service.ts"'}),"import { Injectable } from '@angular/core';\n\nimport { Actions, ofType } from 'mini-rx-store';\n\nimport { ajax } from 'rxjs/ajax';\nimport { mergeMap, map, catchError } from 'rxjs/operators';\nimport { of } from 'rxjs';\n\nimport { LoadTodosFail, LoadTodosSuccess, TodoActionTypes } from './todo-actions';\n\n@Injectable({providedIn: 'root'})\nexport class TodoEffects {\n  loadTodos$ = this.actions$.pipe(\n    ofType(TodoActionTypes.LoadTodos),\n    mergeMap(() =>\n      ajax('https://jsonplaceholder.typicode.com/todos').pipe(\n        map(res => new LoadTodosSuccess(res.response)),\n        catchError(err => of(new LoadTodosFail(err)))\n      )\n    )\n  );\n\n  constructor(\n    private actions$: Actions\n  ) {\n  }\n}\n")),Object(a.b)("p",null,"Register the effects"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-ts",metastring:'title="todo.module.ts"',title:'"todo.module.ts"'}),"import { NgModule } from '@angular/core';\n\nimport { EffectsModule, StoreModule } from 'mini-rx-store-ng';\n\nimport { TodoEffects } from './todo-effects.service';\nimport { todoReducer } from './todo-reducer';\n\n@NgModule({\n  imports: [\n    StoreModule.forFeature('todo', todoReducer),\n    EffectsModule.register([TodoEffects]),\n  ]\n})\nexport class TodoModule {\n}\n")),Object(a.b)("p",null,"The ",Object(a.b)("inlineCode",{parentName:"p"},"register")," method from the EffectsModule accepts an array of classes with effects and can be used in both, root and feature modules."),Object(a.b)("h3",{id:"get-hold-of-the-store-and-actions-via-the-angular-dependency-injection"},"Get hold of the store and actions via the Angular Dependency Injection"),Object(a.b)("p",null,"After we registered the StoreModule in the AppModule we can use Angular DI to access ",Object(a.b)("inlineCode",{parentName:"p"},"Store")," and ",Object(a.b)("inlineCode",{parentName:"p"},"Actions"),"."),Object(a.b)("p",null,"For example in a component:"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-ts"}),"import { Component } from '@angular/core';\nimport { Store } from 'mini-rx-store';\nimport { Observable } from 'rxjs';\n\n@Component({\n  selector: 'my-component',\n  template: ''\n})\nexport class MyComponent {\n  // Select state from the Store\n  someState$: Observable<any> = this.store.select(state => state);\n\n  constructor(\n    private store: Store,\n  ) {\n\n  }\n\n  doSomething() {\n    this.store.dispatch({type: 'some action'})\n  }\n}\n")),Object(a.b)("h3",{id:"redux-dev-tools"},"Redux Dev Tools"),Object(a.b)("p",null,Object(a.b)("inlineCode",{parentName:"p"},"StoreDevtoolsModule")," is a thin wrapper for the ",Object(a.b)("a",Object(r.a)({parentName:"p"},{href:"/docs/ext-redux-dev-tools"}),"ReduxDevtoolsExtension")," from 'mini-rx-store'.\nIt is needed to trigger Angular Change Detection when using time travel in the Redux Dev Tools Browser PlugIn."),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-ts"}),"import { StoreDevtoolsModule } from 'mini-rx-store-ng';\n\n@NgModule({\n  imports: [\n    // ...\n    StoreDevtoolsModule.instrument({\n      name: 'MiniRx Store',\n      maxAge: 25,\n      latency: 250,\n    }),\n  ]\n})\nexport class AppModule {\n} \n")))}u.isMDXComponent=!0},98:function(e,t,n){"use strict";n.d(t,"a",(function(){return d})),n.d(t,"b",(function(){return b}));var r=n(0),o=n.n(r);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=o.a.createContext({}),u=function(e){var t=o.a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},d=function(e){var t=u(e.components);return o.a.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},m=o.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,i=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),d=u(n),m=r,b=d["".concat(i,".").concat(m)]||d[m]||p[m]||a;return n?o.a.createElement(b,c(c({ref:t},l),{},{components:n})):o.a.createElement(b,c({ref:t},l))}));function b(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,i=new Array(a);i[0]=m;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"==typeof e?e:r,i[1]=c;for(var l=2;l<a;l++)i[l]=n[l];return o.a.createElement.apply(null,i)}return o.a.createElement.apply(null,n)}m.displayName="MDXCreateElement"}}]);