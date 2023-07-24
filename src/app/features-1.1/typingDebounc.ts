import {InjectionToken, Provider} from "@angular/core";

export const TypingDebounceTime = new InjectionToken<number>('TypingDebounceTime');
export const provideTypingDebounceTime = (ms = 300): Provider => ({
    provide: TypingDebounceTime,
    useValue: ms
});
