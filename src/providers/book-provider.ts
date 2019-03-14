import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BookProvider {
    public apiPath: string;

    constructor(public http: HttpClient) {
        this.apiPath = environment.apiPath + '/books';
    }

    public getBooks(searchQuery) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.get(this.apiPath + '?key_words=' + searchQuery, httpOptions);
    }

}
