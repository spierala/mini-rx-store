import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Filter } from '../../models/filter';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent implements OnInit, OnDestroy {
    @Input()
    set filter(filter: Filter) {
        this.formGroup.setValue(filter, { emitEvent: false });
    }

    @Output()
    filterUpdate = new EventEmitter<Filter>();

    formGroup: FormGroup = new FormGroup({
        search: new FormControl(),
        category: new FormGroup({
            isBusiness: new FormControl(),
            isPrivate: new FormControl(),
        }),
    });

    private unsubscribe$: Subject<void> = new Subject();

    constructor() {}

    ngOnInit(): void {
        // Debounce just the text input
        this.formGroup
            .get('search')!
            .valueChanges.pipe(takeUntil(this.unsubscribe$), debounceTime(350))
            .subscribe((value) => {
                this.filterUpdate.emit({
                    ...this.formGroup.value,
                    search: value,
                });
            });

        this.formGroup
            .get('category')!
            .valueChanges.pipe(takeUntil(this.unsubscribe$))
            .subscribe((value) => {
                this.filterUpdate.emit({
                    ...this.formGroup.value,
                    category: value,
                });
            });
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
