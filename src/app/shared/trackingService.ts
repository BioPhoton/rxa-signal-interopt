import {inject, Injectable} from "@angular/core";
import {TrackingResource} from "../api/tracking.resource";
import {rxEffects} from "../rxa";
import {timer} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TrackingService {

    tracking =  inject(TrackingResource);

    trackingInterval$ = timer(0, 3000);

    private sendData(content: string): void {
        requestIdleCallback(() => this.tracking.sendBeacon(content));
    }
    private ef = rxEffects(({register}) => {
        register(this.trackingInterval$, this.sendData);
    })

}
