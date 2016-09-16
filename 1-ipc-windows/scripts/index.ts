import {remote} from 'electron'
import {ipcRenderer} from 'electron';
let Menu: typeof Electron.Menu = remote.Menu;
let ipc = remote.ipcMain;


let template: Electron.MenuItemOptions = {
    label: 'Electron',
    submenu: [
        {
            label: 'Prefs',
            click: function(){
                ipc.emit('show-sub');
            }
        }
    ]
}
let menu = Menu.buildFromTemplate([template]);

console.log('menu is created');

Menu.setApplicationMenu(menu);

let button = document.createElement('button');
button.addEventListener('click', function(target){
    ipc.emit('show-sub');
})
button.textContent = 'hide';


document.body.appendChild(button);

let send_button = document.createElement('button');
send_button.textContent = 'send';
document.body.appendChild(send_button);

send_button.addEventListener('click', function() {
        
    let chat_edit:HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById('chat_edit');

    console.log(chat_edit.value);

    ipc.emit('to-sub', {event: 'message', payload: chat_edit.value});

})


ipcRenderer.on('message', function(event, data:any) {
    console.log('main received message', data)
    let message_fregment:HTMLDivElement = document.createElement('div');
    message_fregment.innerText = data;
    document.body.appendChild(message_fregment);
})

