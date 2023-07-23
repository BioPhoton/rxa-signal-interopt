import {inject, Injectable} from "@angular/core";
import {insert, upsert} from "@rx-angular/cdk/transformations";
import {catchError, EMPTY, exhaustMap} from "rxjs";

import {rxActions, rxState} from "../rxa";
import {MovieResource} from "../api/movie.resource";
import {MovieGetDto, MoviePostDto, MoviePutDto} from "../api/dto/movie.dto";
import {Movie} from "../model/movie";

@Injectable({
    providedIn: 'root'
})
export class LocalStorage {

    setItem(key: string, v: any): void {
        localStorage.setItem(key, JSON.stringify(v))
    }

    removeItem(key: string): void {
        localStorage.removeItem(key)
    }

    getItem<T>(key: string): T {
        return JSON.parse(localStorage.getItem(key) || '')
    }

}
