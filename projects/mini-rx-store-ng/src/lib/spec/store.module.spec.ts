import { TestBed } from '@angular/core/testing';
import { StoreModule } from '../store.module';
import { Store } from 'mini-rx-store';

describe(`StoreModule`, () => {
    let store: Store;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({
                    reducers: {
                        bla: (state, action) => {
                            return state;
                        }, // TODO check this in ngrx
                    },
                }),
            ],
        });
    });

    it(`should provide Store`, () => {
        store = TestBed.inject(Store);
        expect(store).toBeTruthy();

        const spy = jest.fn();
        store.select((state) => state).subscribe(spy);
        expect(spy).toHaveBeenCalledWith({});
        expect(spy).toHaveBeenCalledTimes(1);
    });
});
