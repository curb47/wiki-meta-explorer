# WikiMetaExplorer

A Wiki Meta Explorer, fulfilling the requirements described [here](https://github.com/twoporeguys/ui-engineering-test/tree/wiki-meta-explorer).

**Had I more experience with React, that would have been the better JS framework.  The use of Angular here is completely overkill (just witness the size of [node_modules](node_modules)).**

## Assumptions

- Due to smaller size of app, no need to further separate out components into subfolders and such
- Since not a production app, ok to use 'beta' releases of libraries/node modules
- Since not specified, assuming to be used on mobile devices as well
- Using full refresh of any/all data that isn't subscribed to due to the specific requirement about realtime data being linked directly/solely to "subscriptions"
- Since design not the focus, making extremely simple and pseudo-responsive
- Not adding any UI framework (such as boostrap or material design) since that is expressly not the goal of this exercise

## TODO

These would be next steps to take this sample application to the next level.

- Fill out unit tests for [ModelService](src/app/services/model.service.spec.ts) and [DataService](src/app/services/data.service.spec.ts)
- Add configuration for app variables such as URL of websocket server
- True reconnect logic for Websocket
- Get some actual UI/UX design, which might involve:
  - Making truly responsive
  - Add subtle animations
  - Loading indicators for when data is loading from server
  - Make link to Page Revision's parent, perhaps even group by parent and display tree/mapping of revisions

## Angular-CLI

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.4.4.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.
