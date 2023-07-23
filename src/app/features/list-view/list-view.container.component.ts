import {Component, inject} from '@angular/core';
import {rxState, rxActions, rxEffects} from "../../rxa";
import {eventValue} from "@rx-angular/state/actions";
import {Movie} from "../../model/movie";
import {MovieService} from "../../state/movie.state";
import {debounceTime} from "rxjs";
import {NgFor} from "@angular/common";


type ListViewState = {
    list: Movie[],
    query: string
};

type ListViewUi = {
    searchInput: string;
    refresh: void;
};

@Component({
    standalone: true,
    imports: [NgFor],
    selector: 'list-view',
    template: `
      <input name="search" (change)="ui.search($event)" /><br/>
      <button (click)="ui.refresh($event)">Refresh Movies</button>
      <!-- <button (click)="refreshList()">Refresh Movies</button> -->
      
      <ul>
        <li *ngFor="let movie of movies()">{{movie.name}}</li>
      </ul>
  `
})
export class ListViewContainerComponent {
    private movieState = inject(MovieService);
    protected ui = rxActions<ListViewUi>(({transforms}) =>
        transforms({searchInput: eventValue, refresh: (_?: unknown) => void 0}),
    );
    private state = rxState<ListViewState>(({connect}) => {
        connect('list', this.movieState.movies);
        connect('query', this.ui.searchInput$.pipe(debounceTime(300)));
    });

    protected refreshList() {
        this.movieState.refreshMovies();
    }
    protected movies = this.state.computed(({list, query}) => list.filter(m => m.name.includes(query)));

    private refreshEf = this.ui.onRefresh(refresh$ => refresh$, () => this.movieState.refreshMovies());
    // replaces:
    // private refreshEf = rxEffects(({register}) => register(this.ui.refresh$, () => this.movieState.refreshMovies()));
}
