import {BaseWindow} from './BaseWindow'
import {remote} from 'electron'
import {ipcRenderer} from 'electron'

import {MainWindowCommands, MainWindowMenu} from './MainWindow_menu'


export class MainWindow extends BaseWindow {

    get pageFile(): string {
        return "main_window.html";
    } 

    _menu: MainWindowMenu;


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
        this._menu = new MainWindowMenu();
        
        this._menu.on(MainWindowCommands.perfs, () => {
            
                this._ipcMain.emit('show-sub');

        }).on(MainWindowCommands.about, () => {
            let dialog: Electron.Dialog =remote.dialog;
            dialog.showMessageBox({message:'This is the 3rd Electron sample in a series', buttons:
                    ['OK','Cancel']},
                    (indexOfButton)=>{if(indexOfButton===0){
                // "OK" was clicked
                }
                else
                {// "Cancel" was clicked
                }});
        });
        this.createControls();

        ipcRenderer.on('message', function(event, data:any) {
            console.log('main received message', data)
            let message_fregment:HTMLDivElement = document.createElement('div');
            message_fregment.innerText = data;
            document.body.appendChild(message_fregment);
        })
    }
}