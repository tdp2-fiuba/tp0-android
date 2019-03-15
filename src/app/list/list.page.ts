import {Component, OnInit} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';

@Component({
    selector: 'app-list',
    templateUrl: './list.page.html',
    styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
    public searchQuery: object;
    public books: object;

    constructor(private storage: Storage, public router: Router) {
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

    backToSearch(){
        this.router.navigateByUrl('search');

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
