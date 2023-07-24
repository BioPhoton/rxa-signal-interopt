import {Component, inject, Signal} from '@angular/core';
import {rxEffects, rxState} from "../../rxa";
import {Movie} from "../../model/movie";
import {MovieService} from "../../state/movie.state";
import {timer} from "rxjs";
import {LocalStorage} from "../../shared/localStorage";


type EditState = {
    movie: Movie | null
};

@Component({
    standalone: true,
    imports: [],
    selector: 'edit-view',
    template: `
  <h1>Edit Movie</h1>
  <form *ngIf="movie(); else: noMovie" (submit)="save()">
      <label>Movie Name</label>
      <input (ngModel)="movie().name" (ngModelChange)="state.set('movie', movie => ({...movie, name: $event}))" />
      <br/>
      <button type="submit">Save Movies</button>
  </form>
  
  <ng-template #noMovie>
  No Movie
</ng-template>
  `,
    styleUrls: ['./app.component.scss'],
})
export class EditViewContainerComponent {
    private localStorage = inject(LocalStorage);
    private movieState = inject(MovieService);
    private backUpEffect = rxEffects(({register, onCleanup}) => {
        const updateBackup = () => this.localStorage.setItem('editMovie', this.movie())
        register(timer(0, 3000), updateBackup);
        onCleanup(updateBackup);
    });
    state = rxState<EditState>(({set, connect}) => {
        set({movie: this.localStorage.getItem<Movie>('editMovie')})
        connect('movie', this.movieState.movie('2'));
    });

    movie = this.state.computed('movie') as Signal<Movie>;
    save() {
        const m = this.movie();
        if(m !== null) {
            this.movieState.updateMovie(m);
            this.localStorage.removeItem('editMovie');
        }
    }

}
