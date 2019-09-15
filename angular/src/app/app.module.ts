import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ChatComponent } from './chat/chat.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InboxComponent } from './inbox/inbox.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OnlineUsersComponent } from './online-users/online-users.component';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} }; 
@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    InboxComponent,
    OnlineUsersComponent
  ],
  imports: [ 
    BrowserModule,
    FormsModule,
    SocketIoModule.forRoot(config),
    ReactiveFormsModule,
    RouterModule.forRoot([
      {
        path:'',
        redirectTo:'chat',
        pathMatch:'full'
      },
      {
        path:'chat',
        component:ChatComponent,
      },
      {
        path:'inbox',
        component:InboxComponent,
      },
      {
        path:'online_users',
        component:OnlineUsersComponent
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
 