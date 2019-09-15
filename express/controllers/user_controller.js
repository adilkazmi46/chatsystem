var users = {}; 
var sequelize = require('sequelize');
var user = require('../models/user');
var inbox = require('../models/inbox');
var reply = require('../models/reply');
var io='';
var dateFormat = require('dateformat');
const Op = sequelize.Op;

exports.get_io=(data)=>{
io=data; 
}

exports.add_user=(data,socket)=>{
    let user_name=data.name
users[data.name]=socket;
console.log(users);
console.log(data.name+" before insert")
user.findOrCreate({
    where:{ 
    Name:data.name
    } 
}).then((data)=>{
   console.log("23:")
    console.log(data);
    io.emit('new_user',{Name:user_name});

});
}; 
  
exports.del_user=(data)=>{
    delete users[data.name]; 
}; 

exports.get_users=(name,socket)=>{
     
    console.log("get users aksalk")
user.findAll({
    raw:true,
    where:{
     Name:{
        [Op.not]: name  
     }   
    },
    attributes: ['Name']
}).then((data)=>{
    console.log(data)
     socket.emit('online_users',data); 
});

};


exports.get_socket=(data)=>{
    console.log("socket"+users)
    return users[data];
}


exports.inbox_id=(data,socket)=>{
console.log("inbox_id_56")
    var user_1=data.user_1;
    var user_2=data.user_2;
        inbox
      .find(
          {
            raw:true,
            where: {  
        user_1:{
        [Op.or]:[
            user_1, 
            user_2
        ]
    }, 
    user_2:{
        [Op.or]:[
            user_1,
            user_2
        ]
    },  
    },
    attributes: ['id','user_1','user_2']
      
    }).then((data)=>{
        if(data){    
            console.log("inbox_id_81")
        socket.emit('inbox_id',{inbox_id:data.id,user_2}); 
      
    }
    else{
        inbox.create({user_1:user_1,user_2:user_2}).then((data)=>{
            socket.emit("inbox_id",{inbox_id:data.id,user_2})
        });
   
    }
}) 
    
} 
    


exports.get_notification=(data,socket)=>{
    console.log("98 notifications")
    let inbox_id=data.inbox_id
    
    reply.findAndCount({
        raw:true,
    where:{
     inbox_id:data.inbox_id,
     user_name:data.user_name,
     status:'unread'
    }
    }).then((data)=>{
        console.log("106")    
        console.log(data)  
        console.log("111aksjalsklkas")
      socket.emit('notifications',{
          count:data.count, 
          inbox_id:inbox_id,  
          
      })
    }); 
}
 

exports.inbox=(data,socket)=>{
console.log("101")
console.log(data)
var user_1=data.user_1;
var user_2=data.user_2;
    inbox
  .find(
      {
        raw:true,
        where: {  
    user_1:{
    [Op.or]:[
        user_1, 
        user_2
    ]
}, 
user_2:{
    [Op.or]:[
        user_1,
        user_2
    ]
},  
},
attributes: ['id','user_1','user_2']
  
}).then((data)=>{
      
        console.log("72:")
    console.log(data)
    socket.emit('inbox_open',{inbox_id:data.id}); 
    socket1=users[data.user_1];
    if(socket1){
        socket1.emit("inbox_open",{inbox_id:data.id}) 
    }
    socket1=users[data.user_2];
    if(socket1){
        socket1.emit("inbox_open",{inbox_id:data.id}) 
    }
     
    
});
} 

exports.unread_notification=(data)=>{ 
reply.findAndCountAll({
    raw:true,
where:{
    status:data.status,
    inbox_id:data.inbox_id
}
}).then((data)=>{
io.emit('notifications',data);  
});
};

exports.read_msg=(data,socket)=>{
    var now=new Date();
    var inbox_id=data.inbox_id;
    var seen_time= dateFormat(now,"fullDate").toString()+ "   "+dateFormat(now,"shortTime").toString();
reply.update({ 
   status:'read',
   seen_time:seen_time},
    {where:{
        status:'unread',
        inbox_id:data.inbox_id,
        
            user_name:data.user_name
             
    }, 
}   
).then((data)=>{
    reply.findAll({
        raw:true,
        where:{
            inbox_id:inbox_id,
            seen_time:seen_time
        }
    }).then((data)=>{
        console.log("201")
        console.log(data)
        io.emit('seen_notification',{
            data
        });
    })
});  

}; 
exports.message=(data,socket)=>{
 var user_name;
 var Message;
 var inbox_id; 
 var now = new Date();  
 var name=data.frnd_name; 
 var time= dateFormat(now,"shortTime").toString();
 var date= dateFormat(now,"fullDate").toString();
  console.log(typeof(time))
console.log("110:")
console.log(time);  
reply.create({
    inbox_id:data.inbox_id, 
    Message:data.msg,
    user_name:data.name, 
    time:time,  
    status:'unread', 
    date:date,
}).then((data)=>{

    user_name=data.dataValues.user_name;
    Message=data.dataValues.Message;
    inbox_id=data.dataValues.inbox_id;
    
    io.emit('new_message',{id:data.dataValues.id,
                           user_name:user_name, 
                           Message:Message, 
                           inbox_id:inbox_id,
                            time:data.dataValues.time,
                            date:data.dataValues.date,
                            status:data.dataValues.status
                            });
   
}).then((data)=>{
    reply.findAndCount({
        raw:true,
    where:{
     inbox_id:inbox_id,
     user_name:user_name,
     status:'unread'
    }  
    }).then((data)=>{
        console.log("231")    
        console.log(data)  
        console.log("111aksjalsklkas")
      io.emit('notifications_1',{
           name:name,
          count:data.count, 
          inbox_id:inbox_id,  
          
      })
    }); 
});  
  
}
 
exports.get_messages=(data,socket)=>{
    console.log("122:"+data) 
reply.findAll({
    raw:true,
    where:{
        inbox_id:data
    },  
    attributes: ['id','Message','user_name','inbox_id','time','date','seen_time','status']
}).then((data)=>{ 
    console.log("114:") 
    console.log(data)
    socket.emit('all_messages',data);  
   
});  
}

   