import {Component, OnInit} from '@angular/core';
import {BookProvider} from '../../providers/book-provider';
import {Router} from '@angular/router';

@Component({
    selector: 'app-search',
    templateUrl: './search.page.html',
    styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
    public searchQuery: string;

    constructor(public router: Router) {
        this.searchQuery = '';
    }

    ngOnInit() {
    }

    doSearch(event) {
        console.log('search by searchQuery: ', this.searchQuery);
        this.router.navigateByUrl('list').then((value) => {
            console.log('redirec list response: ', value);
        });
        /*this.bookProvider.getBooks(this.searchQuery).subscribe((data) => {
        }, (error) => {
            console.log(error);
        });
        */

    }
}
