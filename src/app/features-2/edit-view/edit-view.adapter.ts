import {computed, inject, Injectable} from "@angular/core";
import {rxActions, rxEffects, rxState} from "../../rxa";
import {Movie} from "../../model/movie";
import {MovieService} from "../../state/movie.state";
import {BackupHandler, BackupTick, provideBackupHandler, provideBackupTick} from "../backup";
import {debounceTime} from "rxjs";

type EditViewAdapterState = {
    activeId: Movie['id']
}
type EditViewActions = {
    edit: Movie
}

@Injectable({
    providedIn: 'root',
    deps: [
        provideBackupHandler('editMovie'),
        provideBackupTick()
    ]
})
export class EditViewAdapter {
    private backupHandler = inject(BackupHandler);
    private backupTick$ = inject(BackupTick);
    private movieState = inject(MovieService);
    private state = rxState<EditViewAdapterState>(({set}) => {
        set('activeId', this.backupHandler.getBackup());
    });
    protected actions = rxActions<EditViewActions>();

    private backUpEffect = rxEffects(({register, onCleanup}) => {
        const updateMovieBackup = () => this.backupHandler.updateBackup(this.movie())
        register(this.backupTick$, updateMovieBackup);
        onCleanup(updateMovieBackup)
    });

    edit = this.actions.onEdit(
        $ => $.pipe(debounceTime(300)),
        (m: Movie) => this.backupHandler.updateBackup(m)
    );
    movie = computed((): Movie | null => {
        const id = this.state.computed(({activeId}) => activeId);
        return this.movieState.movie(id())();
    })
    updateMovie = this.movieState.updateMovie
}
