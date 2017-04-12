import { Injectable } from '@angular/core';
 
const CONFIG = {
  apiUrl: 'http://localhost:8080/api/v1/',
};

// const CONFIG = {
//   apiUrl: 'https://venews-app.herokuapp.com/api/v1/',
// };
 
@Injectable()
export class AppSettings {
 
  constructor() {
  }
 
  public getApiUrl() {
    return CONFIG.apiUrl;
  }
}