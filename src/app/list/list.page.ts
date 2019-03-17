import {Component, OnInit, ViewChild} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';
import {IonInfiniteScroll, ToastController} from '@ionic/angular';
import {BookProvider} from '../../providers/book-provider';

@Component({
    selector: 'app-list',
    templateUrl: './list.page.html',
    styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
    public searchQuery: string;
    public books: any;
    private offset: string;
    private limit: string;

    @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

    constructor(private storage: Storage, public router: Router,
                public bookProvider: BookProvider,
                private toastController: ToastController) {
    }

    ngOnInit() {
    }

    ionViewWillEnter() {
        Promise.all([
            this.storage.get('searchQuery'),
            this.storage.get('books'),
            this.storage.get('offset'),
            this.storage.get('limit')
        ])
            .then(([searchQuery, books, offset, limit]) => {
                this.searchQuery = searchQuery;
                this.books = books;
                this.offset = offset;
                this.limit = limit;
            })
            .catch(error => {
                console.log(error);
            });
    }

    backToSearch() {
        this.router.navigateByUrl('search');
    }

    downloadBook(book) {

    }

    expandDescription(book) {
        book.showCompleteDescription = true;
    }

    contractDescription(book) {
        book.showCompleteDescription = false;
    }

    loadData(event) {
        this.offset += this.limit;
        this.bookProvider.getBooks(this.searchQuery, this.offset, this.limit).subscribe((data) => {
            if (data['items'].length === 0) {
                event.target.disabled = true;
            }
            this.books = this.books.concat(data['items']);
            event.target.complete();
        }, (error) => {
            console.log(error);
            this.toastController.create({
                message: 'No se ha podido establecer conexion con el servidor.',
                duration: 5000,
                color: 'danger'
            }).then((message) => {
                event.target.complete();
                message.present();
            });
        });
    }
}
