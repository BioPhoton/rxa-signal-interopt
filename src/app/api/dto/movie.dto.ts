export type MoviePostDto = {
    name: string;
}

export type MoviePutDto = {
    id: string;
    name?: string;
    created?: string;
}

export type MovieGetDto = {
    id: string;
    created: string;
    name: string;
}
