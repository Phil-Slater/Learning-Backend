const chatTextBox = document.getElementById("chatTextBox")
const sendMessageBtn = document.getElementById("sendMessageBtn")
const messagesUL = document.getElementById('messagesUL')
const usernameElement = document.getElementById('username')
const currentUsers = document.getElementById('currentUsers')


sendMessageBtn.addEventListener('click', function () {
    const chatText = chatTextBox.value
    const username = usernameElement.value
    const chatMessage = { message: chatText, username: username }
    // send message to the server
    socket.emit('Houston', chatMessage)
    chatTextBox.value = ''
})

socket.on('connection', (chatUsers) => {
    console.log(chatUsers)
    currentUsers.innerHTML = `Current number of users chatting: ${chatUsers.length}`
    // usernameElement.value is just grabbing the current user's username, need to fix
    messagesUL.insertAdjacentHTML('beforeend', `<li><b>${chatUsers[chatUsers.length - 1].username} just joined!</b></li>`)
})

socket.on('Houston', (chat) => {
    console.log(chat)

    const messageItem = `<li>${chat.username}: ${chat.message}</li>`
    messagesUL.insertAdjacentHTML('beforeend', messageItem)
})