---
id: ext-logger
title: Logger Extension
sidebar_label: Logger
---

The Logger Extension enables simple Logging: console.log every action and the updated state.

## Register the extension

Configure the store with the `LoggerExtension`:

```ts 
import { LoggerExtension } from 'mini-rx-store';

const store: Store = configureStore({
  extensions: [
    new LoggerExtension()
  ]
});
```
