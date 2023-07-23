import {InjectionToken} from "@angular/core";
import {LocalStorage} from "../../shared/localStorage";
import {Movie} from "../../model/movie";


type BackupHandler<T> ={
    getBackup: <T>() => T,
    updateBackup: <T>(v: T) => void,
    clearBackup: () => void,
};
export const BackupHandler = <T>() => new InjectionToken<BackupHandler<T>>('BackupHandler');

export const provideBackupHandler = (key: string) => ({
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
            updateBackup(movie:  Movie): void {
                localStorage.setItem(key, movie)
            }
        }
    },
    deps: [LocalStorage]
})
