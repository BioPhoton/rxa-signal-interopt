import {RxState} from "@rx-angular/state";
import {Signal} from "@angular/core";
import {Actions, ActionTransforms, RxActions} from "@rx-angular/state/actions/lib/types";
import {Observable, OperatorFunction} from "rxjs";


type InstanceOrType<T> = T extends abstract new (...args: any) => infer R ? R : T;
type ExtractString<T extends object> = Extract<keyof T, string>;


export type ActionListener<T extends Actions, O = unknown> = {
    [K in ExtractString<T> as `on${Capitalize<K>}`]: (
        behaviour: OperatorFunction<T[K], O>,
        sideEffect: (v: T[K]) => void
    ) => () => void
};


type NewRxActions<T extends Actions, U extends {} = T>  = RxActions<T, U> & ActionListener<T>;

export function rxActions<
    T extends Partial<Actions>,
    U extends ActionTransforms<T> = {}
>(setupFn?: (cfg: { transforms: (t: U) => void }) => void): NewRxActions<T>  {
    return '' as unknown as NewRxActions<T>
}
export function rxEffects<T>(setupFn?: (cfg: { register: (v: Observable<T>, t: T) => void }) => void): () => void {
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
type Connect<T extends object> = ConnectSignal<T> &  ConnectProperty<T> & RxState<T>['connect']

type NewState<T extends object> = {
    [K in ExtractString<T> as `connect${Capitalize<K>}`]: (
        source$: Observable<T[K]>,
        reduce: (s: T[K], v: unknown) => T[K]
    ) => () => void
} & RxState<T> & {
    computedShort: <K extends keyof T = keyof T>(key: K) => Signal<T[K]>,
    computed: <O = T>( fn: (s: T) => O) => Signal<O>,
    connect: Connect<T>
}
export function rxState<T extends object>(setup?: (cfg: {
    set: Set<T>,
    connect: Connect<T>,
}) => void): NewState<T> {
    return '' as unknown as NewState<T>
}
