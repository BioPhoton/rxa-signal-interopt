import {Route} from "@angular/router";
import {EditViewContainerComponent} from "./edit-view/edit-view.container.component";
import {ListViewContainerComponent} from "./list-view/list-view.container.component";

export const routes: Route[] = [
    {
        path: 'list',
        component: EditViewContainerComponent
    },
    {
        path: 'edit',
        component: ListViewContainerComponent
    }
]
