---
id: ext-redux-dev-tools
title: Redux DevTools Extension
sidebar_label: Redux DevTools
---
With the Redux DevTools Extension we can easily inspect state and actions.

![Redux DevTools for MiniRx](/img/redux-dev-tools.gif)

MiniRx has basic support for the [Redux DevTools](https://github.com/zalmoxisus/redux-devtools-extension).
These are the current possibilities:
- Inspect current state
- See the history of actions
- Inspect the action payload of all actions in the history
- Time travel to previous actions to restore previous states

## Preparations
You need to install the Browser Plugin to make it work.

-   [Chrome Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
-   [Firefox Redux DevTools](https://addons.mozilla.org/nl/firefox/addon/reduxdevtools/)

## Register the extension

Configure the store with the `ReduxDevtoolsExtension`:

```ts
import { ReduxDevtoolsExtension } from 'mini-rx-store';

const store: Store = configureStore({
  extensions: [
    new ReduxDevtoolsExtension({
      name: 'MiniRx Showcase',
      maxAge: 25,
      latency: 1000
    })
  ]
});
```

### Angular
If you are using Angular you have to register the `StoreDevtoolsModule` from 'mini-rx-store-ng'.
See [Angular Redux DevTools](angular.md#redux-devtools) for more information.

## Options
Currently, these options are available to configure the DevTools:

-   `name`: the instance name to be shown on the DevTools monitor page.
-   `maxAge`: maximum allowed actions to be stored in the history tree. The oldest actions are removed once maxAge is reached. It's critical for performance. Default is 50.
-   `latency`: if more than one action is dispatched in the indicated interval, all new actions will be collected and sent at once. Default is 500 ms.
