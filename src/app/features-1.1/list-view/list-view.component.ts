import {Component, Input, Output, Signal} from '@angular/core';
import {NgFor} from "@angular/common";
import {debounceTime} from "rxjs";
import {rxState, rxActions} from "../../rxa";
import {eventValue} from "@rx-angular/state/actions";
import {Movie} from "../../model/movie";

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
        
      <input name="search" (change)="ui.searchInput($event)" /><br/>
      <button (click)="ui.refresh($event)">Refresh Movies</button>
      <ul>
        <li *ngFor="let movie of displayedList()">{{movie.name}}</li>
      </ul>
  `
})
export class ListViewComponent {
    protected ui = rxActions<ListViewUi>(({transforms}) =>
        transforms({searchInput: eventValue, refresh: (_?: unknown) => void 0}),
    );
    private state = rxState<ListViewState>(({connect}) => {
        connect('query', this.ui.searchInput$.pipe(debounceTime(300)));
    });
    protected displayedList = this.state.computed(({list, query}) => list.filter(m => m.name.includes(query)));

    @Input({
        required: true
    })
    set list(movies: Signal<Movie[]>) {
      this.state.connect('list', movies)
    }

    @Output()
    refresh = this.ui.refresh$;
}
