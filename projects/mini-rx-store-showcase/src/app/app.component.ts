import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'pm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    private actions1: Subject<void> = new Subject();
    actions1$: Observable<void> = this.actions1.asObservable();
    private actions2: Subject<void> = new Subject();

    constructor() {
        this.actions1.pipe(
            tap(() => console.log('action1'))
        ).subscribe(this.actions2);

        this.actions1.pipe(
            tap(() => console.log('action2'))
        )
    }

    test() {
        this.actions1.next();
    }
}
