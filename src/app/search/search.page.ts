import {Component, OnInit} from '@angular/core';
import {BookProvider} from './../../providers/book-provider';
import {Router} from '@angular/router';

@Component({
    selector: 'app-search',
    templateUrl: './search.page.html',
    styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
    public searchQuery: string;

    constructor(public router: Router, public bookProvider: BookProvider) {
        this.searchQuery = '';
    }

    ngOnInit() {
    }

    doSearch(event) {
        console.log('search by searchQuery: ', this.searchQuery);
        this.router.navigateByUrl('list');
        this.bookProvider.getBooks(this.searchQuery).subscribe((data) => {
            console.log('books response: ', data);
        }, (error) => {
            console.log(error);
        });
    }
}
