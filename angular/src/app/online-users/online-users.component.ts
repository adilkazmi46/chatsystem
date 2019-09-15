import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-online-users',
  templateUrl: './online-users.component.html',
  styleUrls: ['./online-users.component.css']
})
export class OnlineUsersComponent implements OnInit {

 users:any={};
 users_temp:any='';
 inbox_id={};
 
 user:string=localStorage.getItem('name')
  constructor(private socket:Socket,private chat:ChatService,private router:Router) { }

  ngOnInit() {
    
    this.chat.get_users(localStorage.getItem('name'))
    this.socket.on('online_users',(data)=>{
      
      this.users_temp=data;
      

      this.users_temp.forEach(element => {
        
        this.chat.get_inbox_id(localStorage.getItem('name'),element.Name);
        
      });
  
      this.socket.on('inbox_id',(data)=>{ 
        
        this.chat.get_notification(data.inbox_id,data.user_2); 
        this.users[data.user_2]=data.inbox_id; 
      
        
        
      })
    }); 
    this.socket.on('new_user',(data)=>{ 
      if(data.Name!=localStorage.getItem('name')){
      this.chat.get_inbox_id(localStorage.getItem('name'),data.Name);
      }
    }); 
  
     this.socket.on('notifications_1',(data)=>{
          
       if(data.name==localStorage.getItem('name')){
        console.log("45") 
        console.log(data)
        this.inbox_id[data.inbox_id]=data.count;   
       }
        
      
     });
     this.socket.on('notifications',(data)=>{

        this.inbox_id[data.inbox_id]=data.count;   
       
        
      
     } );
 
 
  }    
  ngOnDestroy(){
   // this.chat.leave_chat(localStorage.getItem('name'));
   this.socket.removeListener('notifications');
   this.socket.removeListener('notifications_1');
   this.socket.removeListener('inbox_id');
   this.socket.removeListener('online_users');  
   
  }

  onmessage(name,id){
    localStorage.setItem('frnd_name',name);
    localStorage.setItem('inbox_id',id)
    //this.chat.get_inbox(localStorage.getItem('name'),name);
    this.router.navigate(['/inbox']);
  }  

 
  get_count(id){

    return this.inbox_id[id]
  }

}
  