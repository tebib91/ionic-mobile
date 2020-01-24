import { Component, ViewChild } from '@angular/core';
import { Howl } from 'howler';
import { ToastController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';

export interface Track {
  name: string;
  path: string;
}
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  playList: Track[] = [
    {
      name: 'Real-dog-barking',
      path: './assets/mp3/Real-dog-barking.mp3'
    },
    {
      name: 'Real-dog-barking',
      path: './assets/mp3/Real-dog-barking.mp3'
    }
  ];

  activeTrack: Track = null;
  player: Howl = null;
  isPlaying = false;
  progress = 0;
  // SOKET
  message = '';
  messages = [];
  currentUser = '';

  @ViewChild('range', { static: false }) range;
  constructor(private socket: Socket,
              private toastCtrl: ToastController, ) { }

  start(track: Track) {
    if (this.player) {
      this.player.stop();
    }
    this.player = new Howl({
      src: [track.path],
      html5 : true,
      onplay: () => {
        console.log('onplay');

        this.activeTrack = track;
        this.isPlaying = true;
        this.updateProgess();
      },
      onend: () => {
        console.log('onEnd');

      }
    });
    this.player.play();
  }
  togglePlayer(pause) {
    this.isPlaying = !pause;
    if (pause) {
      this.player.pause();
    } else {
      this.player.play();
    }
  }
  next() {
    const index = this.playList.indexOf(this.activeTrack);
    if (index !== this.playList.length - 1) {
      this.start(this.playList[index + 1]);
    } else {
      this.start(this.playList[0]);

    }
  }
  prev() {
    const index = this.playList.indexOf(this.activeTrack);
    if (index > 0) {
      this.start(this.playList[index - 1]);
    } else {
      this.start(this.playList[this.playList.length - 1]);

    }
  }
  seek() {
    const newValue = +this.range.value;
    const duration = this.player.duration();
    this.player.seek(duration * (newValue / 100));
  }
  updateProgess() {
    const seek =  this.player.seek();
    this.progress =  (seek / this.player.duration()) * 100 ;
    setTimeout(() => {
      this.updateProgess();
    }, 1000);
  }
  
}
