import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  socket:any;
  converted_image: any;
  connected = false;

  constructor(private alertController: AlertController, private base64ToGallery: Base64ToGallery) {}

  connect()
  {
    this.socket = io('http://localhost:3000');

    this.socket.on('openDashboard', () => {
      this.connected = true;
    });

    this.socket.on('providePCStats', (stats) => {
      
      this.alertController.create({
        header: 'PC Stats',
        message: stats,
        buttons: ['OK']
      }).then(alert => {
        alert.present();
      });
    });

    this.socket.on('provideBatteryLevel', (level) => {
      this.alertController.create({
        header: 'Battery level',
        message: level == null ? '100%' : level,
        buttons: ['OK']
      }).then(alert => {
        alert.present();
      });
    });

    this.socket.on('provideScreenshot', (data) => {
      this.converted_image = data;
    });
  }

  requestImage() {
    this.socket.emit('requestImage');
  }

  requestPcStats() {
    this.socket.emit('requestPcStats');
  }

  requestBattery() {
    this.socket.emit('requestBattery');
  }
}