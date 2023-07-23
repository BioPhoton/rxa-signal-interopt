import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
@Injectable({
    providedIn: 'root'
})
export class TrackingResource {
    url = 'http://tracker.api.com/';
    http = inject(HttpClient);
    sendBeacon = (content: string): void => {
        requestIdleCallback(() => this.http.post<{ content: string }>(this.url, { content}))
    }

}
