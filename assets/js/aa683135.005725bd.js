"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[799],{5655:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>c,default:()=>h,frontMatter:()=>i,metadata:()=>o,toc:()=>a});const o=JSON.parse('{"id":"component-store","title":"Component Store","description":"MiniRx supports \\"local\\" state management with Component Store.","source":"@site/docs/component-store.md","sourceDirName":".","slug":"/component-store","permalink":"/docs/component-store","draft":false,"unlisted":false,"editUrl":"https://github.com/spierala/mini-rx-store/edit/master/docs/docs/component-store.md","tags":[],"version":"current","frontMatter":{"id":"component-store","title":"Component Store","sidebar_label":"Component Store"},"sidebar":"docs","previous":{"title":"Local Component State","permalink":"/docs/fs-config"},"next":{"title":"Quick Start","permalink":"/docs/ext-quick-start"}}');var s=n(4848),r=n(8453);const i={id:"component-store",title:"Component Store",sidebar_label:"Component Store"},c=void 0,l={},a=[{value:"Key Principles of Component Store",id:"key-principles-of-component-store",level:2},{value:"Use-cases",id:"use-cases",level:2},{value:"What&#39;s Included",id:"whats-included",level:2},{value:"Create a Component Store",id:"create-a-component-store",level:2},{value:"Option 1: Extend ComponentStore",id:"option-1-extend-componentstore",level:3},{value:"Option 2: Functional creation method",id:"option-2-functional-creation-method",level:3},{value:"Destroy",id:"destroy",level:2},{value:"Extensions",id:"extensions",level:2},{value:"Global extensions setup",id:"global-extensions-setup",level:3},{value:"Local extensions setup",id:"local-extensions-setup",level:3},{value:"Memoized selectors",id:"memoized-selectors",level:2},{value:"<code>createComponentStateSelector</code>",id:"createcomponentstateselector",level:3}];function d(e){const t={a:"a",admonition:"admonition",code:"code",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,r.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(t.p,{children:['MiniRx supports "local" state management with ',(0,s.jsx)(t.strong,{children:"Component Store"}),".\nComponent Store allows you to manage state ",(0,s.jsx)(t.strong,{children:"independently"})," of the global state object (which is used by ",(0,s.jsx)(t.a,{href:"redux",children:"Store"})," and ",(0,s.jsx)(t.a,{href:"fs-quick-start",children:"Feature Store"}),")."]}),"\n",(0,s.jsx)(t.h2,{id:"key-principles-of-component-store",children:"Key Principles of Component Store"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:["Component Store has the ",(0,s.jsxs)(t.strong,{children:["same simple API as ",(0,s.jsx)(t.a,{href:"fs-quick-start",children:"Feature Store"})]})]}),"\n",(0,s.jsxs)(t.li,{children:["Component Store state is ",(0,s.jsx)(t.strong,{children:"independent"})," of the global state object"]}),"\n",(0,s.jsxs)(t.li,{children:["Component Store is ",(0,s.jsx)(t.strong,{children:"destroyable"})]}),"\n"]}),"\n",(0,s.jsx)(t.h2,{id:"use-cases",children:"Use-cases"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.strong,{children:"Local"})," component state:","\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsx)(t.li,{children:"State which is bound to a component"}),"\n",(0,s.jsx)(t.li,{children:"State which has the lifespan of a component"}),"\n",(0,s.jsx)(t.li,{children:"State which can exist multiple times (if the corresponding component exists multiple times)"}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.strong,{children:"Frequent create/destroy:"})," Creating and destroying Component Stores is fast"]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.strong,{children:"Very frequent state changes"})," could lead to performance issues when using ",(0,s.jsx)(t.code,{children:"Store"})," or ",(0,s.jsx)(t.code,{children:"FeatureStore"}),"\n(both update the global state object using actions and reducers, which means more overhead)"]}),"\n"]}),"\n",(0,s.jsxs)(t.admonition,{type:"info",children:[(0,s.jsxs)(t.p,{children:["Component Store is great for the mentioned use-cases. However, in most other cases you will be better off using MiniRx ",(0,s.jsx)(t.a,{href:"fs-quick-start",children:"Feature Store"}),":"]}),(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsx)(t.li,{children:"Better debugging experience: Inspect Feature Store state with Redux DevTools"}),"\n",(0,s.jsxs)(t.li,{children:["Feature Store state can be more easily shared with other interested components/services (with ",(0,s.jsx)(t.code,{children:"store.select()"}),")"]}),"\n",(0,s.jsxs)(t.li,{children:["Feature Store automatically uses the Store extensions (provided via ",(0,s.jsx)(t.code,{children:"configureStore"})," or ",(0,s.jsx)(t.code,{children:"StoreModule.forRoot"})," in Angular)."]}),"\n",(0,s.jsxs)(t.li,{children:["It is even possible to manage local state with Feature Stores (see ",(0,s.jsx)(t.a,{href:"fs-config",children:"Local Component State with Feature Store"}),")."]}),"\n"]}),(0,s.jsx)(t.p,{children:"But don't worry, your Component Store can be easily migrated to a Feature Store and vice versa!"})]}),"\n",(0,s.jsx)(t.h2,{id:"whats-included",children:"What's Included"}),"\n",(0,s.jsxs)(t.p,{children:["The MiniRx ",(0,s.jsx)(t.code,{children:"ComponentStore"})," API:"]}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"setState()"})," update the state"]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"setInitialState()"})," initialize state lazily"]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"select()"})," select state as RxJS Observable"]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"effect()"})," run side effects like API calls and update state"]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"connect()"})," connect external Observables to your Component Store"]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"undo()"})," easily undo setState actions (requires the UndoExtension)"]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"destroy()"})," clean up all internal Observable subscriptions (e.g. from effects)"]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"tapResponse"})," operator: handle the response in Component Store ",(0,s.jsx)(t.code,{children:"effect"})," consistently and with less boilerplate"]}),"\n"]}),"\n",(0,s.jsxs)(t.p,{children:["Since the API of ",(0,s.jsx)(t.code,{children:"ComponentStore"})," is identical to ",(0,s.jsx)(t.code,{children:"FeatureStore"}),", please refer to the\n",(0,s.jsx)(t.a,{href:"fs-quick-start",children:"Feature Store docs"})," for more details."]}),"\n",(0,s.jsx)(t.h2,{id:"create-a-component-store",children:"Create a Component Store"}),"\n",(0,s.jsx)(t.p,{children:"There are 2 Options to create a new Component Store."}),"\n",(0,s.jsx)(t.h3,{id:"option-1-extend-componentstore",children:"Option 1: Extend ComponentStore"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-typescript",children:"import { Observable } from 'rxjs';\nimport { ComponentStore } from 'mini-rx-store';\n\ninterface CounterState {\n    count: number;\n}\n\nconst initialState: CounterState = {\n    count: 42,\n};\n\nexport class CounterStore extends ComponentStore<CounterState> {\n  count$: Observable<number> = this.select((state) => state.count);\n\n  constructor() {\n    super(initialState);\n  }\n\n  increment() {\n    this.setState(state => ({ count: state.count + 1 }));\n  }\n\n  decrement() {\n    this.setState(state => ({ count: state.count - 1 }));\n  }\n}\n"})}),"\n",(0,s.jsx)(t.h3,{id:"option-2-functional-creation-method",children:"Option 2: Functional creation method"}),"\n",(0,s.jsxs)(t.p,{children:["We can create a Component Store with ",(0,s.jsx)(t.code,{children:"createComponentStore"}),"."]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"import { ComponentStore, createComponentStore } from 'mini-rx-store';\n\nconst counterCs: ComponentStore<CounterState> = createComponentStore<CounterState>(initialState);\n"})}),"\n",(0,s.jsx)(t.h2,{id:"destroy",children:"Destroy"}),"\n",(0,s.jsx)(t.admonition,{type:"warning",children:(0,s.jsx)(t.p,{children:"If you manage local component state with Component Store..., please make sure to destroy the Component Store when the corresponding component is destroyed!"})}),"\n",(0,s.jsxs)(t.p,{children:["You can destroy a Component Store with the ",(0,s.jsx)(t.code,{children:"destroy"})," method. The ",(0,s.jsx)(t.code,{children:"destroy"})," method will unsubscribe all internal RxJS subscriptions (e.g. from effects)."]}),"\n",(0,s.jsxs)(t.p,{children:["The Component Store ",(0,s.jsx)(t.code,{children:"destroy"})," method follows the same principles as the ",(0,s.jsx)(t.code,{children:"destroy"})," method of Feature Store. Read more in the ",(0,s.jsx)(t.a,{href:"/docs/fs-config#destroy",children:'Feature Store "Destroy" docs'}),"."]}),"\n",(0,s.jsx)(t.h2,{id:"extensions",children:"Extensions"}),"\n",(0,s.jsxs)(t.p,{children:["You can use most of the ",(0,s.jsx)(t.a,{href:"ext-quick-start",children:"MiniRx extensions"})," with the Component Store."]}),"\n",(0,s.jsx)(t.p,{children:"Extensions with Component Store support:"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsx)(t.li,{children:"Immutable Extension: Enforce state immutability"}),"\n",(0,s.jsxs)(t.li,{children:["Undo Extension: Undo state changes from ",(0,s.jsx)(t.code,{children:"setState"})]}),"\n",(0,s.jsx)(t.li,{children:'Logger Extension: console.log the current "setState" action and updated state'}),"\n"]}),"\n",(0,s.jsx)(t.p,{children:"It's possible to configure the Component Store extensions globally or individually for each Component Store instance."}),"\n",(0,s.jsx)(t.h3,{id:"global-extensions-setup",children:"Global extensions setup"}),"\n",(0,s.jsxs)(t.p,{children:["Configure extensions globally for every Component Store with the ",(0,s.jsx)(t.code,{children:"configureComponentStores"})," function:"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-typescript",children:"import {\n  configureComponentStores,\n} from 'mini-rx-store';\n\nconfigureComponentStores({\n  extensions: [new ImmutableStateExtension()]\n});\n"})}),"\n",(0,s.jsx)(t.p,{children:"Now every Component Store instance will have the ImmutableStateExtension."}),"\n",(0,s.jsx)(t.h3,{id:"local-extensions-setup",children:"Local extensions setup"}),"\n",(0,s.jsx)(t.p,{children:"Configure extensions individually via the Component Store configuration object:"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-typescript",children:"import { ComponentStore, LoggerExtension } from 'mini-rx-store';\n\nexport class CounterStore extends ComponentStore<CounterState> {\n  constructor() {\n    super(initialState, {\n      extensions: [new LoggerExtension()]\n    });\n  }\n}\n"})}),"\n",(0,s.jsxs)(t.p,{children:['"Local" extensions are merged with the (global) extensions from ',(0,s.jsx)(t.code,{children:"configureComponentStores"}),".\nTherefore, every ",(0,s.jsx)(t.code,{children:"CounterStore"})," instance will have the LoggerExtension (from the local extension setup) ",(0,s.jsx)(t.strong,{children:"and"})," the\nImmutableStateExtension (from the ",(0,s.jsx)(t.code,{children:"configureComponentStores"})," extensions)."]}),"\n",(0,s.jsx)(t.p,{children:"If an extension is defined globally and locally, then only the local extension is used."}),"\n",(0,s.jsxs)(t.admonition,{type:"info",children:[(0,s.jsxs)(t.p,{children:["It makes sense to add the ImmutableStateExtension to ",(0,s.jsx)(t.code,{children:"configureComponentStores"})," (",(0,s.jsx)(t.a,{href:"#global-extensions-setup",children:'"Global extensions setup"'}),").\nLike this, every Component Store can benefit from immutable state."]}),(0,s.jsxs)(t.p,{children:["The LoggerExtension can be added to individual Component Stores for debugging purposes (",(0,s.jsx)(t.a,{href:"#local-extensions-setup",children:'"Local extensions setup"'}),")."]}),(0,s.jsxs)(t.p,{children:["Regarding the ",(0,s.jsx)(t.code,{children:"undo"})," API: It is recommended to add the UndoExtension to the Component Stores which need the undo functionality (",(0,s.jsx)(t.a,{href:"#local-extensions-setup",children:'"Local extensions setup"'}),")."]})]}),"\n",(0,s.jsx)(t.h2,{id:"memoized-selectors",children:"Memoized selectors"}),"\n",(0,s.jsx)(t.p,{children:"Of course, you can use memoized selectors also with Component Store!"}),"\n",(0,s.jsx)(t.h3,{id:"createcomponentstateselector",children:(0,s.jsx)(t.code,{children:"createComponentStateSelector"})}),"\n",(0,s.jsxs)(t.p,{children:["You can use ",(0,s.jsx)(t.code,{children:"createComponentStateSelector"})," together with ",(0,s.jsx)(t.code,{children:"createSelector"})," to create your selector functions."]}),"\n",(0,s.jsx)(t.p,{children:"Example:"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"// Memoized Selectors\nconst getComponentState = createComponentStateSelector<TodoState>();\n\nconst getTodos = createSelector(\n  getComponentState,\n  state => state.todos\n);\n\nconst getSelectedTodoId = createSelector(\n  getComponentState,\n  state => state.selectedTodoId\n)\n\nconst getSelectedTodo = createSelector(\n  getTodos,\n  getSelectedTodoId,\n  (todos, id) => todos.find(item => item.id === id)\n)\n\nclass TodoStore extends ComponentStore<TodoState> {\n\n  // State Observables\n  todoState$: Observable<TodoState> = this.select(getComponentState);\n  todos$: Observable<Todo[]> = this.select(getTodos);\n  selectedTodo$: Observable<Todo> = this.select(getSelectedTodo);\n\n  constructor() {\n    super(initialState)\n  }\n}\n"})})]})}function h(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},8453:(e,t,n)=>{n.d(t,{R:()=>i,x:()=>c});var o=n(6540);const s={},r=o.createContext(s);function i(e){const t=o.useContext(r);return o.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function c(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:i(e.components),o.createElement(r.Provider,{value:t},e.children)}}}]);