import {Component, OnInit, ViewChild} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';
import {IonContent, IonInfiniteScroll, ToastController} from '@ionic/angular';
import {BookProvider} from '../../providers/book-provider';
import {File} from '@ionic-native/file';
import {FileTransfer, FileTransferObject} from '@ionic-native/file-transfer/ngx';
import {FileOpener} from '@ionic-native/file-opener/ngx';

@Component({
    selector: 'app-list',
    templateUrl: './list.page.html',
    styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
    public searchQuery: string;
    public books: any;
    public offset: string;
    public limit: string;
    public scrolled: Boolean;
    public categoriesClasses: Object;

    @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
    @ViewChild(IonContent) content: IonContent;

    constructor(private storage: Storage, public router: Router,
                public bookProvider: BookProvider,
                private toastController: ToastController,
                private transfer: FileTransfer,
                private fileOpener: FileOpener) {
    }

    ngOnInit() {
        this.categoriesClasses = {
            'History': 'history',
            'Biography & Autobiography': 'biography',
        };
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
                this.books = this.parseCategories(books);
                this.offset = offset;
                this.limit = limit;
                this.scrolled = false;
                console.log('books: ', this.books);
            })
            .catch(error => {
                console.log(error);
            });
    }

    backToSearch() {
        this.router.navigateByUrl('search');
    }

    downloadBook(book) {
        const fileTransfer: FileTransferObject = this.transfer.create();
        if (book.accessInfo.pdf && book.accessInfo.pdf.downloadLink) {
            const downloadLink2 = book.accessInfo.pdf.downloadLink;
            const downloadLink = 'http://www.pdf995.com/samples/pdf.pdf';
            console.log('file transfer: ', downloadLink2);
            this.toastController.create({
                message: 'Descargando...',
                color: 'success'
            }).then((messageLoading) => {
                messageLoading.present();
                fileTransfer.download(downloadLink, File.dataDirectory + 'book.pdf').then((entry) => {
                    messageLoading.dismiss();
                    console.log('download complete: ' + entry.toURL());
                    this.fileOpener.open(entry.toURL(), 'application/pdf')
                        .then(() => console.log('File is opened'))
                        .catch(e => {
                            console.log(e);
                            this.toastController.create({
                                message: 'No se puede descargar el libro',
                                duration: 5000,
                                color: 'danger'
                            }).then((message) => {
                                message.present();
                            });
                        });
                }, (error) => {
                    messageLoading.dismiss();
                    console.log(error);
                    this.toastController.create({
                        message: 'No se puede descargar el libro',
                        duration: 5000,
                        color: 'danger'
                    }).then((message) => {
                        message.present();
                    });
                });
            });

        } else {
            this.toastController.create({
                message: 'No se puede descargar el libro',
                duration: 5000,
                color: 'danger'
            }).then((message) => {
                message.present();
            });
        }


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
            let newBooks = this.parseCategories(data['items']);
            this.books = this.books.concat(newBooks);
            event.target.complete();
        }, (error) => {
            console.log(error);
            this.toastController.create({
                message: 'No se ha podido establecer conexión con el servidor.',
                duration: 5000,
                color: 'danger'
            }).then((message) => {
                event.target.complete();
                message.present();
            });
        });
    }

    scrollEvent() {
        this.content.getScrollElement().then((scrollElement) => {
            if (scrollElement.scrollTop > 0) {
                this.scrolled = true;
            } else {
                this.scrolled = false;
            }
        });
    }

    goToTop() {
        this.content.scrollToTop(500);
    }


    parseCategories(books) {
        let that = this;
        books.forEach(function (book) {
            if (book.volumeInfo.categories) {
                let arrayCategories = book.volumeInfo.categories;
                let classesCategories = [];
                arrayCategories.forEach(function (entry) {
                    let classEntry = 'other';
                    if (that.categoriesClasses.hasOwnProperty(entry)) {
                        classEntry = that.categoriesClasses[entry];
                    }
                    if (classesCategories.indexOf(classEntry) === -1) {
                        classesCategories.push(classEntry);
                    }
                });
                book.customCategories = classesCategories;
            }

        });
        return books;
    }
}
