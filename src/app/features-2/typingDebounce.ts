import {InjectionToken} from "@angular/core";

export const TypingDebounceTime = new InjectionToken<number>('TypingDebounceTime');
export const provideTypingDebounceTime = (ms = 300) => ({
    provide: TypingDebounceTime,
    useValue: ms
});
