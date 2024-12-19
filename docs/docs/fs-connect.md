---
id: fs-connect
title: Connect
sidebar_label: Connect
slug: /connect-feature-state-to-observable
---
Use `connect` to connect external Observables to your Feature Store.

You can connect many Observables via an object which implements the (partial) state interface.

When a connected Observable emits, the corresponding state property will be updated immediately.

```ts
interface ArtState {
    opacity: number;
}

const initialState: ArtState = {
    opacity: 1,
};

@Injectable()
export class ArtStoreService extends FeatureStore<ArtState> {
    opacity$: Observable<number> = this.select((state) => state.opacity);

    constructor() {
        super(initialState);

        const delayedOpacity$: Observable<number> = timer(Math.random() * 5000).pipe(
            map(() => Math.random())
        );
        
        this.connect({ opacity: delayedOpacity$ });
    }
}
```
