import { Component, OnInit , ViewChild,ElementRef} from '@angular/core';
import { Socket } from 'ngx-socket-io'
import { ChatService } from '../chat.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { isUndefined } from 'util';
import { async } from '@angular/core/testing';
@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {

  name: string;
  frnd_name:string;
  users:any; 
  user_message:string='';
  messages:any[]=[];
  date_tag:string=' '; 
  temp:any=[''];
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  constructor(private socket:Socket, private chat: ChatService) { 
     
      
    
  } 
  
  ngOnDestroy(){
    this.socket.removeListener("inbox_open");
    this.socket.removeListener("all_messages");
    this.socket.removeListener("seen_notification");
    this.socket.removeListener("new_message");  
        
  } 
  ngAfterViewChecked(){
           
    this.scrollToBottom();   
  }
  ngOnInit() {
    
    this.chat.get_messages(localStorage.getItem('inbox_id')); 
    
    this.socket.on('all_messages',async (data)=>{
      console.log("hello")
      if(data[0]){
        console.log(data[0])
      if(data[0].inbox_id==localStorage.getItem('inbox_id'))
      {
      this.messages=data;     
      } 
    }
    else{ 

    }
    }); 

    this.chat.read_notification(localStorage.getItem('inbox_id'),localStorage.getItem('frnd_name'));
    this.name=localStorage.getItem('name')  
    this.frnd_name=localStorage.getItem('frnd_name')
   
  

     this.socket.on('seen_notification',(data)=>{
        console.log("seen noti")
        this.temp=data.data;
        console.log(data.data) 
        this.temp.filter((item)=>{
          this.messages.find(x=>x.id==item.id).seen_time=item.seen_time;  
        })
    });

    this.socket.on('new_message',(data)=>{
      
      if(data.inbox_id==localStorage.getItem('inbox_id'))
      { 
        
         this.messages.push({user_name:data.user_name,Message:data.Message,time:data.time,seen_time:data.seen_time,id:data.id});
         if(data.user_name!=localStorage.getItem('name'))
         {
           console.log("msg_read_emit")
          this.socket.emit('msg_read',{inbox_id:data.inbox_id,user_name:data.user_name}); 
         } 
         
      }   
    });  

  }  
  onsubmit(){
     
this.chat.send_message(this.name,this.user_message,localStorage.getItem('frnd_name'),localStorage.getItem('inbox_id')); 
this.user_message='';
  }

  get_class(name){
   if(localStorage.getItem('name')==name){
     return 'self';
   }
   else{
     return 'message';
   }
  }

  scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
}

check_tag(date){
  var check=this.date_tag;
  this.date_tag=date
if(this.date_tag==check){
  return false;
} 
else{
  return true;
}
}

check_seen(name){
  if(name==localStorage.getItem('name')){
    return true;
  }
  else{
    return false;
  }
}

}

  
 
