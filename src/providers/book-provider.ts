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

    public getBooks(searchQuery, offset?, limit?) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        let path = this.apiPath + '?key_words=' + searchQuery + '&sorted=true';
        if (offset) {
            path += '&start_index=' + offset;
        }
        if (limit) {
            path += '&max_results=' + limit;
        }
        return this.http.get(path, httpOptions);
    }

}
