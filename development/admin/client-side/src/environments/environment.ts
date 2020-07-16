// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiEndpoint: "http://172.31.23.205:3001/api",
  // apiEndpoint: "http://cqube.tibilprojects.com/api",
  grafanaEndPoint: "http://172.31.25.50:9000",
  keycloakUrl: "http://localhost:8080/auth",
  realm: "cQube",
  clientId: "cQube_Admin",
  credentials: { secret: 'c45d54f7-b0aa-43c9-a6bb-9b77a47c73a2' }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
