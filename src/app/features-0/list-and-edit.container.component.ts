import {Component, computed, effect, EventEmitter, inject} from '@angular/core';
import {debounceTime, map, timer} from "rxjs";
import {eventValue} from "@rx-angular/state/actions";
import {toSignal} from "@angular/core/rxjs-interop";
import {signal} from "@angular/core";
import {Movie} from "../model/movie";
import {MovieService} from "../state/movie.state";
import {LocalStorage} from "../shared/localStorage";

@Component({
    standalone: true,
    imports: [],
    selector: 'edit-view',
    template: `
        <section class="list">
            <h1>Movie List</h1>
            <input name="search" (change)="searchInput.emit($event)"/><br/>
            <button (click)="refresh($event)">Refresh Movies</button>
            <ul>
                <li *ngFor="let movie of movies()">{{movie.name}}</li>
            </ul>
        </section>
        <section class="list">
            <h1>Edit Movie</h1>
            <form *ngIf="movie(); else: noMovie" (submit)="save()">
                <label>Movie Name</label>
                <input (ngModel)="movie().name" (ngModelChange)="movie.update(movie => ({...movie, name: $event}))"/>
                <br/>
                <button type="submit">Save Movies</button>
            </form>

            <ng-template #noMovie>
                No Movie
            </ng-template>
        </section>
    `,
    styleUrls: ['./app.component.scss'],
})
export class ListAndEditContainerComponent {
    // services
    private localStorage = inject(LocalStorage);
    private movieState = inject(MovieService);

    // actions
    protected searchInput = new EventEmitter<string>();

    // state
    protected movie = signal<Movie | null>(this.localStorage.getItem<Movie>('editMovie'));
    private movieUpdateFromStateEf = effect(() => this.movie.set(this.movieState.movie('2')()));
    protected list = signal<Movie[]>([]);
    private listUpdateFromStateEf = effect(() => this.list.set(this.movieState.movies()));
    protected query = signal('');
    private queryChange = toSignal(this.searchInput.pipe(map(eventValue), debounceTime(300)), {initialValue: ''});
    private queryUpdateFromStateEf = effect(() => this.query.set(this.queryChange()));
    // state derivation
    protected movies = computed(() => this.list().filter(m => m.name.includes(this.query())));

    // effects
    private tick = toSignal<void>(timer(0, 3000).pipe(map(_ => void 0)));
    private updateBackup = () => this.localStorage.setItem('editMovie', this.movie());
    private backUpEffect = effect((onCleanup) => {
        this.tick(); // on tick execute side effect
        this.updateBackup(); // side effect
        onCleanup(this.updateBackup);
    });

    // normal functions
    protected refresh = () => this.movieState.refreshMovies()
    protected save = () => {
        const m = this.movie();
        if (m !== null) {
            this.movieState.updateMovie(m);
            this.localStorage.removeItem('editMovie');
        }
    }
}
