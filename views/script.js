import { io } from "socket.io-client"

//後端的位置
const socket = io('http://localhost:3000')

//與後端建立連線後的cb
socket.on('connect' , ()=>{
    displayMessage(`You have Connected with id : ${socket.id}`,true)
})

//當有其他人發送訊息時 會傳送event到後端 在由後端傳送event到這個使用者
socket.on("receive-message", message => {
    displayMessage(`${socket.id} said : ${message}`)
})




//呼叫此function並傳入message來加入message
function displayMessage(message , isSystemMessage = false) {
    const chatbox = document.querySelector(".chatbox")
    const newdiv = document.createElement("div")
    isSystemMessage ? newdiv.classList.add("system-message") : null
    newdiv.textContent = message
    chatbox.appendChild(newdiv)
}


//Message按鈕的觸發事件 發送訊息
const msgbutton = document.querySelector("#send-message")
msgbutton.addEventListener("click",()=>{
    const message = document.querySelector("#message").value
    const room = document.querySelector("#room").value
    displayMessage(message)

    //透過emit發送給伺服器一格send-message event,並附帶message 還有使用者所在的房間
    socket.emit("send-message",message , room)
})

//加入房間按鈕
const joinroonbutton = document.querySelector("#send-room")
joinroonbutton.addEventListener("click",()=>{
    //發送該使用者要join room 的事件到後端
    const room = document.querySelector("#room").value
    socket.emit("join-room",room , message => {
        displayMessage(message)
    })
})