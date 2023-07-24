import {Route} from "@angular/router";
import {ListAndEditViewContainerComponent} from "./list-and-edit-view/list-view-and-edit.component";
import {provideTypingDebounceTime} from "./typingDebounc";

export const routes: Route[] = [
    {
        path: 'list-and-edit',
        component: ListAndEditViewContainerComponent,
        providers: [
            provideTypingDebounceTime()
        ]
    }
]
