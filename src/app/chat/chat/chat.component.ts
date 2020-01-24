import { Howl } from 'howler';
import { Socket } from 'ngx-socket-io';
import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

  message = '';
  messages = [];
  currentUser = '';
  player: Howl = null;
  link =  {
    name: 'Real-dog-barking',
    path: './assets/mp3/Real-dog-barking.mp3'
  };

  constructor(private socket: Socket,
              private toastCtrl: ToastController,
              ) { }

  ngOnInit() {
    this.socket.connect();

    let name = `user-${new Date().getTime()}`;
    this.currentUser = name;

    this.socket.emit('set-name', name);

    this.socket.fromEvent('users-changed').subscribe(data => {
      let user = data['user'];
      if (data['event'] === 'left') {
        this.showToast('User left: ' + user);
      } else {
        this.showToast('User joined: ' + user);
      }
    });

    this.socket.fromEvent('message').subscribe(message => {
      this.messages.push(message);
      this.start(this.link)
    });
  }

  sendMessage() {
    this.socket.emit('send-message', { text: this.message });
    this.message = '';
  }

  ionViewWillLeave() {
    this.socket.disconnect();
  }

  async showToast(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }

  start(track: any) {
    if (this.player) {
      this.player.stop();
    }
    this.player = new Howl({
      src: [track.path],
      html5 : true,
      onplay: () => {
        console.log('onplay');
      },
      onend: () => {
        console.log('onEnd');

      }
    });
    this.player.play();
  }
}