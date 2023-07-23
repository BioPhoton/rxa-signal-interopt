import {Component, inject, Injectable} from '@angular/core';
import {rxState, rxActions, rxEffects} from "../../rxa";
import {eventValue} from "@rx-angular/state/actions";
import {Movie} from "../../model/movie";
import {debounceTime, timer} from "rxjs";
import {NgFor} from "@angular/common";
import {EditViewComponent} from "../edit-view/edit-view.component";
import {EditViewAdapter} from "../edit-view/edit-view.adapter";
import {ListViewComponent} from "../list-view/list-view.component";
import {BackupHandler, provideBackupHandler} from "../edit-view/backup-handler";
import {ListViewAdapter} from "../list-view/list-view.adapter";


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

@Injectable({
    providedIn: 'root',
    deps: [
        provideBackupHandler('editModel')
    ]
})

@Component({
    standalone: true,
    imports: [NgFor, ListViewComponent, EditViewComponent],
    selector: 'list-and-edit-view',
    template: `
        <list-view [list]="computedList" (refresh)="onRefresh()" (search)="actions.searchInput($event)"></list-view>
        <edit-view (edit)="actions.edit($event)" (save)="onSave($event)"></edit-view>
  `,
    providers: [
        provideBackupHandler('editMovie')
    ]
})
export class ListAndEditViewContainerComponent {
    private backupHandler = inject(BackupHandler<Movie>());
    private listViewAdapter = inject(ListViewAdapter);
    private editViewAdapter = inject(EditViewAdapter);
    protected actions = rxActions<ListViewAndEditUi>(({transforms}) =>
        transforms({searchInput: eventValue, refresh: (_?: unknown) => void 0}),
    );
    private state = rxState<ListViewState>(({set, connect}) => {
        // initialize from backup (localStorage)
        set('movie', this.backupHandler.getBackup());
        connect('list', this.listViewAdapter.movies);
        connect('query', this.actions.searchInput$.pipe(debounceTime(300)));
    });
    protected computedList = this.state.computed(({list, query}) => list.filter(m => m.name.includes(query)));

    onSave = this.editViewAdapter.updateMovie;
    onRefresh = this.listViewAdapter.refreshMovies;
    private effect = rxEffects(({register}) => {
        // backUpEffect
        register(timer(0, 3000), () => this.backupHandler.updateBackup(this.state.get('movie')));
        // onDestroy
        return this.backupHandler.updateBackup
    });
}
