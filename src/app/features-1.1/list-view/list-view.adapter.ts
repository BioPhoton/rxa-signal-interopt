import {MovieService} from "../../state/movie.state";

import {inject, Injectable} from "@angular/core";
import {rxActions, rxState} from "../../rxa";
import {Movie} from "../../model/movie";


type ListViewAdapterState = {
    movies: Movie[]
}
type ListViewActions = {
    refresh: void
}
@Injectable({
    providedIn: 'root'
})
export class ListViewAdapter {

    private movieState =  inject(MovieService);
    protected actions = rxActions<ListViewActions>();
    private state = rxState<ListViewAdapterState>(({connect}) => {
            connect('movies', this.movieState.movies);
    })

    movies = this.state.computedShort('movies');
    private refreshEf = this.actions.onRefresh(refresh$ => refresh$, () => this.movieState.refreshMovies());
    refreshMovies(): void {
        this.movieState.refreshMovies()
    }

}
