

const chatTextBox = document.getElementById("chatTextBox")
const sendMessageBtn = document.getElementById("sendMessageBtn")
const messagesUL = document.getElementById('messagesUL')
const usernameTextBox = document.getElementById('usernameTextBox')

sendMessageBtn.addEventListener('click', function () {
    const chatText = chatTextBox.value
    const username = usernameTextBox.value
    const chatMessage = { message: chatText, username: username }
    // send message to the server
    socket.emit('Houston', chatMessage)
})

socket.on('Houston', (chat) => {
    console.log(chat)
    const messageItem = `<li>${chat.username}: ${chat.message}</li>`
    messagesUL.insertAdjacentHTML('beforeend', messageItem)
})