import {Component, OnInit} from '@angular/core';
import {Storage} from '@ionic/storage';

@Component({
    selector: 'app-list',
    templateUrl: './list.page.html',
    styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
    public searchQuery: object;
    public books: object;

    constructor(private storage: Storage) {
    }

    ngOnInit() {
        Promise.all([
            this.storage.get('searchQuery'),
            this.storage.get('books')
        ])
            .then(([searchQuery, books]) => {
                this.searchQuery = searchQuery;
                this.books = books;
                console.log(this.searchQuery);
                console.log(this.books);
            })
            .catch(error => {
                console.log(error);
            });
    }

    downloadBook(book){
        console.log('download book: ', book);
    }
    expandDescription(book){
        console.log('expand description: ', book);
        book.showCompleteDescription = true;
    }
    contractDescription(book){
        console.log('expand description: ', book);
        book.showCompleteDescription = false;
    }
}
