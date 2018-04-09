import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';

@Injectable()
export class HttpServiceProvider {

  private headers: any
  private options: any

  private url: string = 'http://10.7.0.103:3000/';

  constructor(private http: Http) {
    this.headers = new Headers({ 'Content-Type': 'application/json'})
    this.headers.append('Authorization', localStorage.getItem('api_token'))
    this.options = new RequestOptions({ headers: this.headers })
  }

  public createNewUser(params) {
    return this.http.post(this.url+'users', params, this.options);
  }

  public getUser(params) {
    return this.http.post(this.url+'user', params, this.options);
  }
}
