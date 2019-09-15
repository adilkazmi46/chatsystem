import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router'
import { ChatService } from '../chat.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  user_form:FormGroup;
  name:FormControl;
  users:any;
  isLoggedin:boolean=false;

  constructor(private socket:Socket,private router:Router,private chat:ChatService) { }
  
  ngOnInit() {
  
    this.user_form=new FormGroup({
      'name':new FormControl(null,[Validators.required])
    });
     
    if(localStorage.getItem('name')){ 
      this.isLoggedin=true;
    }
    else{
      this.isLoggedin=false;
    }  
  } 

  onSubmit(){
    localStorage.setItem('name',this.user_form.get('name').value);
    this.chat.add_user(localStorage.getItem('name'));
    this.router.navigate(['/online_users']); 
  }       
 
  onchat(){
    this.router.navigate(['/chat']);
  }

  onlogout(){
    this.chat.logout(localStorage.getItem('name'));
    localStorage.removeItem('name');
    this.isLoggedin=false;
  }

}
