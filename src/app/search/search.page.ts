import {Component, OnInit} from '@angular/core';
import {BookProvider} from './../../providers/book-provider';
import {Router} from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'app-search',
    templateUrl: './search.page.html',
    styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
    public searchQuery: string;

    constructor(private storage: Storage, public router: Router, public bookProvider: BookProvider) {

    }

    ngOnInit() {
        this.searchQuery = '';
    }

    doSearch() {
        console.log('this.searchQuery: ', this.searchQuery);
        this.bookProvider.getBooks(this.searchQuery).subscribe((data) => {
            this.storage.set('searchQuery', this.searchQuery);
            this.storage.set('books', data['items']);
            this.router.navigateByUrl('list');
        }, (error) => {
            console.log(error);
        });
    }
}
