import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
 
  constructor(private socket:Socket) {
       }
test(){
  
}

  send_message(Name,Msg,receiver,inbox_id){
    this.socket.emit('message',
    {name:Name,
      msg:Msg,
      frnd_name:receiver,
      inbox_id:inbox_id}); 
    
  }
  join_chat(id){ 
    this.socket.emit('join_chat',{inbox_id:id})
  }
  logout(name){
    this.socket.emit('disconnection',{name:name})
  }
  
  add_user(name){
   this.socket.emit('add_user',{name:name});
  }

  get_users(name){
    console.log("askjkas:"+name)
    this.socket.emit('get_users',{name:name});
  }

  get_inbox(name1,name2){
    console.log(name2)  
    this.socket.emit('get_inbox',{user_1:name1,
                                user_2:name2})
  }

  
  get_inbox_id(name1,name2){
    console.log(name2)
    this.socket.emit('inbox_id',{user_1:name1,
                                user_2:name2})
  }
  get_messages(id){
    this.socket.emit('get_messages',{inbox_id:id})
  }

  read_message(id,name){
    this.socket.emit('msg_read',{inbox_id:id,user_name:name})
  } 
  
  get_notification(id,name){
    console.log("get_notification")
    console.log(id)   
    console.log(name)
    this.socket.emit('get_notification',{inbox_id:id,user_name:name,name:localStorage.getItem('name')});
  }

  read_notification(id,name){
    
    this.socket.emit('read_notification',{inbox_id:id,user_name:name});
  }
}
 