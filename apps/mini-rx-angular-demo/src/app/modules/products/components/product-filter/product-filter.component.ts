import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-product-filter',
    templateUrl: './product-filter.component.html',
    styleUrls: ['./product-filter.component.css'],
})
export class ProductFilterComponent implements OnInit, OnDestroy {
    private unsubscribe$: Subject<void> = new Subject();

    @Input()
    set search(search: string) {
        this.formGroup.setValue({ search }, { emitEvent: false });
    }

    @Output()
    searchChanged = new EventEmitter<string>();

    searchInput: UntypedFormControl = new UntypedFormControl();
    formGroup: UntypedFormGroup = new UntypedFormGroup({
        search: this.searchInput,
    });

    constructor() {}

    ngOnInit(): void {
        this.searchInput.valueChanges
            .pipe(debounceTime(350), takeUntil(this.unsubscribe$))
            .subscribe((value) => {
                this.searchChanged.emit(value);
            });
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
