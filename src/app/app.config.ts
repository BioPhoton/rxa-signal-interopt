import { ApplicationConfig } from '@angular/core';
import {routes as feature1 } from "./features/routing";
import {routes as feature2 } from "./features/routing";
import {provideRouter} from "@angular/router";

export const appConfig: ApplicationConfig = {
  providers: [
      provideRouter(
          [
              ...feature1,
              ...feature2
          ]
      )
  ],
};
