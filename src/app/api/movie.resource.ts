import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError, throwError} from "rxjs";
import {MovieGetDto, MoviePostDto} from "./dto/movie.dto";

@Injectable({
    providedIn: 'root'
})
export class MovieResource {
    url = 'http://tbmd.api.com/';
    http = inject(HttpClient);
    getMovies = () => this.http.get<MovieGetDto[]>(this.url + 'movies')
        .pipe(
            catchError(e => throwError('get movie list error'))
        );
    getMovie = (id: string) => this.http.get<MovieGetDto>(this.url + 'movies/detail/'+id)
        .pipe(
            catchError(e => throwError('get movie list error'))
        );
    updateMovie = (movie: MoviePostDto) => this.http.put<MovieGetDto>(this.url + 'movies', movie)
        .pipe(
            catchError(e => throwError('get movie list error'))
        );

}
