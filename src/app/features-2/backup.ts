import {InjectionToken, Provider} from "@angular/core";
import {LocalStorage} from "../shared/localStorage";
import {Movie} from "../model/movie";
import {Observable, timer} from "rxjs";

export type Backup<T> ={
    getBackup: <T>() => T,
    updateBackup: <T>(v: T | null) => void,
    clearBackup: () => void,
};
export const BackupHandler = <T>() => new InjectionToken<Backup<T>>('BackupHandler');

export const provideBackupHandler = (key: string): Provider => ({
    provide: BackupHandler<Movie>(),
    useFactory: (localStorage: LocalStorage) => {
        return {
            getBackup(): Movie | null {
                const editMovie = localStorage.getItem(key);
                if(editMovie !== null){
                    return JSON.parse(editMovie) as Movie
                } else {
                    return editMovie;
                }
            },
            clearBackup(): void {
                localStorage.removeItem(key)
            },
            updateBackup(movie:  Movie | null): void {
                localStorage.setItem(key, movie)
            }
        }
    },
    deps: [LocalStorage]
});

export const BackupTick = new InjectionToken<Observable<unknown>>('BackupTick');
export const provideBackupTick = (ms = 3000): Provider => ({
    provide: BackupTick,
    useFactory: ()  => timer(0, ms)
})
