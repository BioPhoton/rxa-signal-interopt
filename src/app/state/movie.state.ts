import {inject, Injectable} from "@angular/core";
import {upsert} from "@rx-angular/cdk/transformations";
import {catchError, EMPTY, exhaustMap} from "rxjs";

import {rxActions, rxState} from "../rxa";
import {MovieResource} from "../api/movie.resource";
import {MovieGetDto, MoviePostDto, MoviePutDto} from "../api/dto/movie.dto";
import {Movie} from "../model/movie";


type MovieStateActions = {
    refresh: void
    save: MoviePostDto
}
type MovieState = {
    movies: Movie[]
}

function getDtoToModel(dto: MovieGetDto): Movie {
    const {name, id} = dto;
    return {name, id};
}

function modelToPutDto(movie: Movie): MoviePutDto {
    const {name, id} = movie;
    return {name, id};
}

@Injectable({
    providedIn: 'root'
})
export class MovieService {
    private moviesResource = inject(MovieResource);
    private actions = rxActions<MovieStateActions>(({transforms}) => {
        transforms({save: (movie: Movie) => modelToPutDto(movie)})
    });
    private state = rxState<MovieState>(({set, connect}) => {
        set({movies: []});

        connect('movies',
            this.actions.save$.pipe(
                exhaustMap(movie => this.moviesResource.updateMovie(movie))
            ),
            ({movies}, newMovie) => upsert(movies, getDtoToModel(newMovie), 'id')
        );

        connect(
            'movies',
            this.actions.refresh$.pipe(
                exhaustMap(_ => this.moviesResource.getMovies()),
                catchError(e => {
                    // error handling here
                    // snackbar communication here
                    return EMPTY;
                })
            ),
            ({movies}, newMovie) => newMovie.map(movie => getDtoToModel(movie))
        );

    });
    movies = this.state.computedShort('movies');

    movie(id: string) {
        return this.state.computed(({movies}) => movies.find(m => m.id === id) || null);
    }

    refreshMovies(): void {
        this.actions.refresh();
    }

    updateMovie(movie: Movie): void {
        this.actions.save(movie);
    }

    constructor() {
        // TO DISCUSS
       /* this.state.connectMovies(
            this.actions.refresh$.pipe(exhaustMap((movie) => this.moviesResource.getMovies())),
            (newMovie) => newMovie.map(movie => getDtoToModel(movie as ny))
        );*/
    }

}
