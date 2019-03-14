import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseProvider } from './base-provider';

@Injectable({
    providedIn: 'root'
})
export class BookProvider {
    public basePath: string;

    constructor(public http: HttpClient) {
    this.basePath = BaseProvider.getApiPath() + '/books';
  }

  public getBooks(searchQuery) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.get(this.basePath + '/' + searchQuery, httpOptions);
  }

}
