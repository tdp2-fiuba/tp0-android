import {Component} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Network} from '@ionic-native/network/ngx';
import {ToastController} from '@ionic/angular';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private network: Network,
        public toastController: ToastController
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.checkConectivity();
        });
    }

    checkConectivity() {
        if (this.network.type === 'unknown' || this.network.type === 'none') {
            this.toastController.create({
                message: 'No tiene acceso a internet',
                duration: 2000,
                color: 'danger'

            }).then((message) => {
                message.present();
            });
        }
        this.network.onDisconnect().subscribe(() => {
            this.toastController.create({
                message: 'No tiene acceso a internet',
                duration: 2000,
                color: 'danger'
            }).then((message) => {
                message.present();
            });
        });
        this.network.onConnect().subscribe(() => {
            this.toastController.create({
                message: 'Ya tiene acceso a internet!',
                duration: 2000,
                color: 'success'
            }).then((message) => {
                message.present();
            });
        });
    }
}
