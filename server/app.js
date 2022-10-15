const { instrument } = require("@socket.io/admin-ui")

//Cors放置前端的位置及ui位置(固定的)
const io = require('socket.io')(3000 , {
    cors:{
        origin: ["http://localhost:8080" , "https://admin.socket.io"],
        credentials: true
    }
})

//前端連線至成伺服器成功時觸發
io.on("connection", socket => {

    //當有人發送訊息時後端接收send-message event
    socket.on("send-message",(message,room) => {
        //如果使用io.emit會傳送給包含自己在內所有連線到伺服器的使用者
        //使用socket.broadcast.emit會傳送不包含自己所有連線到伺服器的使用者
        if (room === '') {
            socket.broadcast.emit("receive-message",message)
        } else {
            //使用socket.to進到特定room 只有在這個room的人收的到訊息
            //每個人自己預設都在自己id的room裡
            socket.to(room).emit("receive-message",message)
        }
    })

    //當有人想要進入到特定的房間時
    socket.on("join-room",(room , cb) => {
        socket.join(room)
        cb(`You have joined room id: ${room}`)
    })

    
})

//提供ui介面可以查看socket情況
instrument(io, {auth : false})