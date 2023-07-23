import {Component, EventEmitter, inject, Input, Output, Signal} from '@angular/core';
import {rxState} from "../../rxa";
import {Movie} from "../../model/movie";
import {NgModel} from "@angular/forms";
import {BackupHandler} from "../backup";

type EditState = {
    movie: Movie | null
};

/**
 * - input for currently edited movie
 * - output for save edited movie
 * - output for edit edited movie
 * - movie in form
 * - submit form === save output
 */
@Component({
    standalone: true,
    imports: [NgModel],
    selector: 'edit-view',
    template: `
        <h1>Edit Movie</h1>
        <form *ngIf="movie(); else: noMovie" (submit)="movieSave()">
            <label>Movie Name</label>
            <input [ngModel]="movie().name" (ngModelChange)="movieChange($event)"/>
            <br/>
            <button type="submit">Save Movies</button>
        </form>

        <ng-template #noMovie>
            No Movie
        </ng-template>
    `,
    styleUrls: ['./app.component.scss'],
})
export class EditViewComponent {

    backupHandler = inject(BackupHandler);
    state = rxState<EditState>();

    movie = this.state.computed(({movie}) => movie);

    movieChange(update: Movie): void {
        this.state.set('movie', movie => ({...movie, ...update}))
    }

    movieSave(): void {
        const m = this.state.get('movie');
        if (m !== null) {
            this.save.emit(m);
        }
    }

    @Input({
        alias: 'movieInput',
        required: true
    })
    set(movie: Signal<Movie>) {
        this.state.connect('movie', movie)
    }

    @Output()
    save = new EventEmitter<Movie>();

    @Output()
    edit = this.state.select('movie');
}
