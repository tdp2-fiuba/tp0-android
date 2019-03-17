import {Component, OnInit} from '@angular/core';
import {BookProvider} from './../../providers/book-provider';
import {Router} from '@angular/router';
import {Storage} from '@ionic/storage';
import {LoadingController, Platform} from '@ionic/angular';
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
                private toastController: ToastController,
                private loadingController: LoadingController) {
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

    ionViewWillEnter() {
        Promise.all([
            this.storage.get('searchQuery')
        ])
            .then(([searchQuery]) => {
                console.log('storage search query: ', searchQuery);
                if (searchQuery) {
                    this.searchQuery = searchQuery;
                } else {
                    this.searchQuery = '';
                }
            })
            .catch(error => {
                console.log(error);
            });

    }

    doSearch() {
        this.searchQuery = this.getCleanedString(this.searchQuery);
        if (this.searchQuery === undefined || this.searchQuery === '') {
            this.toastController.create({
                message: 'Ingrese una palabra clave de búsqueda',
                duration: 5000,
                color: 'danger'
            }).then((message) => {
                message.present();
            });
            return;
        }
        this.loadingController.create({
            message: 'Cargando...',
            spinner: 'crescent'
        }).then((loadingElement) => {
            loadingElement.present();
            let offset = 0;
            let limit = 10;
            this.bookProvider.getBooks(this.searchQuery, offset, limit).subscribe((data) => {
                if (data['items'].length === 0) {
                    this.toastController.create({
                        message: 'No hay libros que coincidan con la búsqueda realizada. Intentelo nuevamente con ' +
                            'alguna palabra clave diferente.',
                        duration: 5000,
                        color: 'tertiary'
                    }).then((message) => {
                        loadingElement.dismiss();
                        message.present();
                    });
                } else {
                    Promise.all([
                        this.storage.set('searchQuery', this.searchQuery),
                        this.storage.set('books', data['items']),
                        this.storage.set('offset', offset),
                        this.storage.set('limit', limit)
                    ])
                        .then(() => {
                            loadingElement.dismiss();
                            this.router.navigateByUrl('list');
                        });
                }

            }, (error) => {
                console.log(error);
                this.toastController.create({
                    message: 'No se ha podido establecer conexión con el servidor.',
                    duration: 5000,
                    color: 'danger'
                }).then((message) => {
                    loadingElement.dismiss();
                    message.present();
                });
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
