import {remote} from 'electron'
import {ipcRenderer} from 'electron'

let ipc = remote.ipcMain;

let button = document.createElement('button');
button.addEventListener('click', function(target){
    ipc.emit('hide-sub');
})

button.textContent = 'hide';
document.body.appendChild(button);

ipc.on('message', function(event, args) {
let message_fregment:HTMLDivElement = document.createElement('div');
message_fregment.innerText = args;
})

document.body.appendChild(button);

let send_button = document.createElement('button');
send_button.textContent = 'send';
document.body.appendChild(send_button);

send_button.addEventListener('click', function() {
        
    let chat_edit:HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById('chat_edit');

    console.log(chat_edit.value);

    ipc.emit('to-main', {event: 'message', payload: chat_edit.value});

})


ipcRenderer.on('message', function(event, data) {
    let message_fregment:HTMLDivElement = document.createElement('div');
    console.log('sub received message', data)
    message_fregment.innerText = data;
    document.body.appendChild(message_fregment);
})

