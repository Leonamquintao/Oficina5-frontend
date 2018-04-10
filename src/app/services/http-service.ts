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

  /*------------------------------- USERS ----------------------------------*/

  public createNewUser(params) {
    return this.http.post(this.url+'users', params, this.options);
  }

  public getUser(params) {
    return this.http.post(this.url+'user', params, this.options);
  }

  /*------------------------------- CONTACTS ----------------------------------*/

  public listAllContactsByUser(id) {
    return this.http.get(this.url+'user/'+id+'/contacts', this.options);
  }

  public saveNewContact(id, dt) {
    return this.http.post(this.url+'user/'+id+'/contact', dt, this.options);
  }

  public updateContact(id, dt) {
    return this.http.put(this.url+'user/'+id.usrId+'/contact/'+dt.id, dt, this.options)
  }

  public deleteContactById(id, conId) {
    return this.http.delete(this.url+'user/'+id+'/contact/'+conId, this.options)
  }


}
