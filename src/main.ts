import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig, MSALInstanceFactory } from './app/app.config';
import { App } from './app/app';

const msalInstance = MSALInstanceFactory();

msalInstance.initialize().then(() => {
  bootstrapApplication(App, appConfig)
    .catch((err) => console.error(err));
});