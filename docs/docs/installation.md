---
id: installation
title: Installation
sidebar_label: Installation & TypeScript Config
slug: /
---

Install from the NPM repository using npm:

```bash
npm install mini-rx-store
```

Install the RxJS peer dependency:
```bash
npm install rxjs
```

## TypeScript Config

MiniRx itself is written in TypeScript with `compilerOptions.strict = true`.

The typings of MiniRx work best if you use the strict setting as well in your tsconfig.json.

```json title="tsconfig.json"
{
  "compilerOptions": {
    "strict": true
  }
}
```

If you do not want to use the strict setting then it is recommended to enable at least `strictFunctionTypes`.

```json title="tsconfig.json"
{
  "compilerOptions": {
    "strictFunctionTypes": true
  }
}
```
