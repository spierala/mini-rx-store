[![npm version](https://badge.fury.io/js/mini-rx-ng-devtools.svg)](https://www.npmjs.com/package/mini-rx-ng-devtools)

# MiniRx Redux DevTools for Angular

Angular Integration of the Redux DevTools for [MiniRx](https://www.npmjs.com/package/mini-rx-store).

## Usage
#### Installation:

`npm i mini-rx-ng-devtools`

#### Add to Angular
```
import { NgReduxDevtoolsModule } from 'mini-rx-ng-devtools';

@NgModule({
    imports: [
        NgReduxDevtoolsModule.instrument({
            name: 'MiniRx Showcase',
            maxAge: 25,
            latency: 1000
        })
    ]
    ...
})
export class AppModule {}
```
