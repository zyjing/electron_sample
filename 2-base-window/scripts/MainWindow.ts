import {BaseWindow} from './BaseWindow'
import {remote} from 'electron'
import {ipcRenderer} from 'electron'

export class MainWindow extends BaseWindow {

    get pageFile(): string {
        return "main_window.html";
    } 

    initMenu() {
        let template: Electron.MenuItemOptions = {
        label: 'Electron',
        submenu: [ {
                    label: 'Prefs',
                    click: () => {
                        this._ipcMain.emit('show-sub');
                    }
                }
            ]
        }
        let menu = this._menu.buildFromTemplate([template]);

        console.log('menu is created');

        this._menu.setApplicationMenu(menu);
    }

    createControls() {
        
        let button = document.createElement('button');
        button.addEventListener('click', target => {
            this._ipcMain.emit('show-sub');
        })
        button.textContent = 'hide';


        document.body.appendChild(button);

        let send_button = document.createElement('button');
        send_button.textContent = 'send';
        document.body.appendChild(send_button);

        send_button.addEventListener('click', () => {
                
            let chat_edit:HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById('chat_edit');

            console.log(chat_edit.value);

            this._ipcMain.emit('to-sub', {event: 'message', payload: chat_edit.value});

        })
    }

    initComponents() {
        this.initMenu();
        this.createControls();

        ipcRenderer.on('message', function(event, data:any) {
            console.log('main received message', data)
            let message_fregment:HTMLDivElement = document.createElement('div');
            message_fregment.innerText = data;
            document.body.appendChild(message_fregment);
        })
    }
}