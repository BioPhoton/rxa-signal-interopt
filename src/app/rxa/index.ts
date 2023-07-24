import {RxState} from "@rx-angular/state";
import {
    computed, CreateEffectOptions,
    CreateSignalOptions,
    DestroyRef,
    effect, EffectCleanupFn,
    EffectRef, EventEmitter as NativeEventEmitter,
    inject, isSignal,
    signal as originalSignal,
    Signal,
    WritableSignal as originalWritableSignal
} from "@angular/core";
import {Actions, ActionTransforms, RxActions} from "@rx-angular/state/actions/lib/types";
import {
    combineLatest,
    combineLatestWith,
    connect,
    EMPTY,
    from,
    map,
    Observable,
    of,
    OperatorFunction,
    startWith,
    switchMap,
    tap
} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";
import {HttpClient, HttpContext, HttpHeaders, HttpResponse} from "@angular/common/http";
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {Params} from "@angular/router";
import {Movie} from "../model/movie";


type InstanceOrType<T> = T extends abstract new (...args: any) => infer R ? R : T;
type ExtractString<T extends object> = Extract<keyof T, string>;


export type ActionListener<T extends Actions, O = unknown> = {
    [K in ExtractString<T> as `on${Capitalize<K>}`]: (
        behaviour: OperatorFunction<T[K], O>,
        sideEffect: (v: T[K]) => void
    ) => (m: T[K]) => void
};
export type ActionListenerShort<T extends Actions, O = unknown> = {
    [K in ExtractString<T> as `on${Capitalize<K>}`]: (
        sideEffect: (v: T[K]) => void
    ) => (m: T[K]) => void
};


type NewRxActions<T extends Actions, U extends {} = T> = RxActions<T, U> & ActionListener<T> & ActionListenerShort<T>;

export function rxActions<
    T extends Partial<Actions>,
    U extends ActionTransforms<T> = {}
>(setupFn?: (cfg: { transforms: (t: U) => void }) => void): NewRxActions<T> {
    return '' as unknown as NewRxActions<T>
}

export function rxEffects<T>(
    setupFn?: (cfg: {
        register: (v: Observable<T>, t: T) => void,
        onCleanup: (onDestroy: () => void) => void
    }) => void) {
    return () => void 0;
}

type Set<T extends object> = RxState<T>['set'];


export type ConnectProperty<T extends {}, O = unknown> = {
    [K in ExtractString<T> as `connect${Capitalize<K>}`]: (
        source$: Observable<T[K]>,
        reduce: (s: T, v: unknown) => T[K]
    ) => () => void
};
type ConnectSignal<T extends object> = (prop: keyof T, signal: Signal<T[keyof T]> | Observable<T[keyof T]>) => void
type Connector<T extends {}, K extends keyof T> = (
    source$: Observable<T[K]>,
    reduce: (s: T, v: unknown) => T[K]
) => () => void
type Connect<T extends object> = ConnectSignal<T> & ConnectProperty<T> & RxState<T>['connect']

type NewState<T extends object> = {
    [K in ExtractString<T> as `connect${Capitalize<K>}`]: (
        source$: Observable<T[K]>,
        reduce: (s: T[K], v: unknown) => T[K]
    ) => () => void
} & RxState<T> & {
    computedShort: <K extends keyof T = keyof T>(key: K) => Signal<T[K]>,
    computed: <O = T>(fn: (s: T) => O) => Signal<O>,
    connect: Connect<T>
}

export function rxState<T extends object>(setup?: (cfg: {
    set: Set<T>,
    connect: Connect<T>,
}) => void): NewState<T> {
    return '' as unknown as NewState<T>
}

type SignalConnect<T> = (outerSignalFn: Signal<T> | Observable<T>, tr?: (v: unknown) => T) => void;

type WritableSignal<T> = originalWritableSignal<T> & {
    connect: SignalConnect<T>,
    on: (ef: (v: T) => void) => EffectRef
};
export function signal<T>(v: T, options?: CreateSignalOptions<T> & {connect: (signalOrObservable: Signal<T> | Observable<T>, tr?: (v: unknown) => T) => Signal<T> | Observable<T>}): WritableSignal<T> {
    const destroyRef = inject(DestroyRef);
    const innerSignal = originalSignal(v);
    const cbs: (() => void)[] = [];
    const _connect = function (signalOrObservable: Signal<T> | Observable<T>, tr?: (v: unknown) => T) {
        let s: Signal<T> = signalOrObservable as Signal<T>;
        if(!isSignal(signalOrObservable)) {
            s = toSignal(signalOrObservable) as Signal<T>
        }
        effect(() => {
            const v = tr ? tr(s()) : s();
            innerSignal.set(v);
        })
    };

    // TODO options?.connect ? _connect(options.connect()) : void 0;

    innerSignal.prototype.on = function (ef: (v: T) => void): EffectRef {
        return effect(() => {
            const v = innerSignal();
            ef(v);
        })
    };
    innerSignal.prototype.connect = _connect;
    destroyRef.onDestroy(() => {
        for (const i of cbs) {
            i();
        }
    })
    return innerSignal as WritableSignal<T>;
}


type EventEmitterExtensions<T> = {
    on: (
        effectFn: (cleanupFn: EventEmitterEffectCleanupRegisterFn) => void,
        options?: Pick<CreateEventEmitterOptions<T>, 'behaviour'>
    ) => void
}

export declare type EventEmitterCleanupFn = () => void;

declare type EventEmitterEffectCleanupRegisterFn = (cleanupFn: EffectCleanupFn) => void;
export type CreateEventEmitterOptions<T> = CreateEffectOptions & {
    on?: (cleanupFn: EventEmitterEffectCleanupRegisterFn) => void,
    behaviour?: OperatorFunction<any, T>,
    transform?: (v: T) => any
};
export type EventEmitter<T = void> = NativeEventEmitter<T> & EventEmitterExtensions<T>;
export function eventEmitter<T>(
    options?: CreateEventEmitterOptions<T>
): EventEmitter<T> {
    const eE =  new NativeEventEmitter<T>() as unknown as EventEmitter<T>;
    (eE as any).on = (cleanupFn: EventEmitterEffectCleanupRegisterFn): void => {
        const sub = (eE as Observable<T>).subscribe(() => {
            setUpEffect(cleanupFn, sub.unsubscribe)
        })
    }

    // setup

    return eE as unknown as EventEmitter<T>;
}


function setUpEffectSub<T>(obs: Observable<T>, cb:() => T) {
    const sub = obs.subscribe(() => {
        setUpEffect(cb, sub.unsubscribe)
    })
}
function setUpEffect<T>(ef: EventEmitterEffectCleanupRegisterFn, onCleanupCb: () => void) {
    const comp = computed(ef as any);
    effect((onCleanup) => {
        comp();
        onCleanup(onCleanupCb)
    });
}

