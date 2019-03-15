import {Component, OnInit} from '@angular/core';
import {BookProvider} from './../../providers/book-provider';
import {Router} from '@angular/router';
import {Storage} from '@ionic/storage';
import {Platform} from '@ionic/angular';
import {ToastController} from '@ionic/angular';

@Component({
    selector: 'app-search',
    templateUrl: './search.page.html',
    styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
    public searchQuery: string;
    public subscription: any;

    constructor(private platform: Platform, private storage: Storage,
                public router: Router, public bookProvider: BookProvider,
                private toastController: ToastController) {
        this.searchQuery = '';

    }

    ngOnInit() {
    }

    ionViewDidEnter() {
        this.subscription = this.platform.backButton.subscribe(() => {
            navigator['app'].exitApp();
        });
    }

    ionViewWillLeave() {
        this.subscription.unsubscribe();
    }

    doSearch(aca) {
        console.log('search query begin: ', this.searchQuery);
        console.log('search query aca: ',aca);

        this.searchQuery = this.getCleanedString(this.searchQuery);
        console.log('search query: ', this.searchQuery);
        this.bookProvider.getBooks(this.searchQuery).subscribe((data) => {
            console.log(data['items'].length);
            if (data['items'].length === 0) {
                this.toastController.create({
                    message: 'No hay libros que coincidan con la busqueda realizada. Intentelo nuevamente con ' +
                        'alguna palabra clave diferente.',
                    duration: 5000,
                    color: 'tertiary'
                }).then((message) => {
                    message.present();
                });
            } else {
                this.storage.set('searchQuery', this.searchQuery);
                this.storage.set('books', data['items']);
                this.router.navigateByUrl('list');
            }

        }, (error) => {
            console.log(error);
            this.toastController.create({
                message: 'No se ha podido establecer conexion con el servidor.',
                duration: 5000,
                color: 'danger'
            }).then((message) => {
                message.present();
            });
        });
    }

    getCleanedString(text) {
        let specialChars = '!@#$^&%*()+=-[]\/{}|:<>?,.';
        for (let i = 0; i < specialChars.length; i++) {
            text = text.replace(new RegExp('\\' + specialChars[i], 'gi'), '');
        }
        text = text.replace(/á/gi, 'a');
        text = text.replace(/é/gi, 'e');
        text = text.replace(/í/gi, 'i');
        text = text.replace(/ó/gi, 'o');
        text = text.replace(/ú/gi, 'u');
        text = text.replace(/ñ/gi, 'n');
        return text;
    }
}
