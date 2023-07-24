import { Component } from '@angular/core';
import {ListViewContainerComponent} from "./features/list-view/list-view.container.component";
import {EditViewContainerComponent} from "./features/edit-view/edit-view.container.component";
import {RouterLink, RouterOutlet} from "@angular/router";

@Component({
  standalone: true,
  imports: [RouterOutlet, RouterLink, ListViewContainerComponent, EditViewContainerComponent, RouterLink],
  selector: 'rxa-state-functions-root',
  template: `
    <ul>
      <li><a routerLink="list">Feature 1 - List</a></li>
      <li><a routerLink="edit">Feature 1 - Edit</a></li>
      <li><a routerLink="list-and-edit">Feature 2 - List & Edit</a></li>
    </ul>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  title = 'rxa-state-functions';
}
