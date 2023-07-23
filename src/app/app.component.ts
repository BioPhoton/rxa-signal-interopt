import { Component } from '@angular/core';
import { NxWelcomeComponent } from './nx-welcome.component';
import {ListViewContainerComponent} from "./features/list-view/list-view.container.component";
import {ListViewContainerComponent} from "./features/edit-view/edit-view.container.component";

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, ListViewContainerComponent, ListViewContainerComponent],
  selector: 'rxa-state-functions-root',
  template: `
  <section class="list">
    <list-view></list-view>
  </section>
  <section class="edit">
    <edit-view></edit-view>
  </section>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'rxa-state-functions';
}
