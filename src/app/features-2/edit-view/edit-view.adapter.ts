import {inject, Injectable, InjectionToken} from "@angular/core";
import {rxActions, rxState} from "../../rxa";
import {Movie} from "../../model/movie";
import {LocalStorage} from "../../shared/localStorage";
import {MovieService} from "../../state/movie.state";
import {rxEffects} from "../../rxa";
import {Observable, timer} from "rxjs";


type EditViewAdapterState = {
    movies: Movie[]
}
type EditViewActions = {
    refresh: void
}

const UpdateTick = new InjectionToken<Observable<unknown>>('UpdateTick');
@Injectable({
    providedIn: 'root',
    deps: [
        {
            provide: UpdateTick,
            useFactory: () => timer(0, 3000)
        }
    ]
})
export class EditViewAdapter {

    private localStorage = inject(LocalStorage);
    private movieState = inject(MovieService);
    protected actions = rxActions<EditViewActions>();
    private state = rxState<EditViewAdapterState>(({connect}) => {
            connect('movies', this.movieState.movies);
    })

    movie = this.movieState.movie
    updateMovie = this.movieState.updateMovie
}
