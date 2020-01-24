import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ChatComponent } from './chat/chat.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';


@NgModule({
  declarations: [ChatComponent],
  imports: [
    CommonModule,
    ChatRoutingModule,
    FormsModule,
    IonicModule,
    

  ]
})
export class ChatModule { }
