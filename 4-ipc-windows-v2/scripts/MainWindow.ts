import {BaseWindow} from './BaseWindow'
import {remote} from 'electron'
import {ipcRenderer} from 'electron'
import {SubWindow} from './SubWindow'
import {MainWindowCommands, MainWindowMenu} from './MainWindow_menu'


export class MainWindow extends BaseWindow {

    get pageFile(): string {
        return "main_window.html";
    } 

    _menu: MainWindowMenu;

    subWindow: SubWindow;

    createControls() {
        
        let button = document.createElement('button');
        button.addEventListener('click', target => {
            this.subWindow.visible = !this.subWindow.visible;
        })
        button.textContent = 'hide';


        document.body.appendChild(button);

        let send_button = document.createElement('button');
        send_button.textContent = 'send';
        document.body.appendChild(send_button);

        send_button.addEventListener('click', () => {
                
            let chat_edit:HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById('chat_edit');

            console.log(chat_edit.value);

            this.subWindow.browserWindow.send('message', chat_edit.value);

        })
    }

    initComponents() {

        this.subWindow = new SubWindow({parent: this.browserWindow, width: 400, height: 300});
        
        this.subWindow.showWindow();
        this.subWindow.openDevTools();
        
        this._menu = new MainWindowMenu();
        
        this._menu.on(MainWindowCommands.perfs, () => {
                this.subWindow.visible = !this.subWindow.visible;  
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