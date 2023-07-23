import {Component, inject} from '@angular/core';
import {rxState, rxActions} from "../../rxa";
import {eventValue} from "@rx-angular/state/actions";
import {Movie} from "../../model/movie";
import {debounceTime} from "rxjs";
import {NgFor} from "@angular/common";
import {EditViewComponent} from "../edit-view/edit-view.component";
import {EditViewAdapter} from "../edit-view/edit-view.adapter";
import {ListViewComponent} from "../list-view/list-view.component";
import {ListViewAdapter} from "../list-view/list-view.adapter";
import {TypingDebounceTime} from "../typingDebounc";

type ListViewState = {
    movie: Movie,
    list: Movie[],
    query: string
};

type ListViewAndEditUi = {
    edit: Movie;
    save: Movie;
    searchInput: string;
    refresh: void;
};

@Component({
    standalone: true,
    imports: [NgFor, ListViewComponent, EditViewComponent],
    selector: 'list-and-edit-view',
    template: `
        <list-view [list]="computedList" (refresh)="refreshMovies()" (search)="actions.searchInput($event)"></list-view>
        <edit-view (edit)="editMovie($event)" (save)="updateMovie($event)"></edit-view>
  `
})
export class ListAndEditViewContainerComponent {
    private listViewAdapter = inject(ListViewAdapter);
    private editViewAdapter = inject(EditViewAdapter);

    // @TODO add router input

    protected actions = rxActions<ListViewAndEditUi>(({transforms}) =>
        transforms({searchInput: eventValue, refresh: (_?: unknown) => void 0}),
    );
    private state = rxState<ListViewState>(({set, connect}) => {
        connect('list', this.listViewAdapter.movies);
        connect('query', this.actions.searchInput$.pipe(debounceTime(inject(TypingDebounceTime))));
    });
    protected computedList = this.state.computed(({list, query}) => list.filter(m => m.name.includes(query)));

    editMovie = this.editViewAdapter.editMovie;
    updateMovie = this.editViewAdapter.updateMovie;
    refreshMovies = this.listViewAdapter.refreshMovies;
}
