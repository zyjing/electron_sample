import {BaseWindow} from './BaseWindow'
import {remote} from 'electron'
import {ipcRenderer} from 'electron'

export class SubWindow extends BaseWindow {

    get pageFile(): string {
        return "sub_window.html";
    } 

    constructor(options:any) {
        super(options);
        this.parentWindow = this.browserWindow.getParentWindow();
    }

    parentWindow: Electron.BrowserWindow;

    public initComponents() {
        let ipc = remote.ipcMain;

        let button = document.createElement('button');
        button.addEventListener('click', (target) => {
            this.visible = !this.visible;  
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

        send_button.addEventListener('click', () => {
                
            let chat_edit:HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById('chat_edit');

            console.log(chat_edit.value);
            (this.parentWindow as any).send('message', chat_edit.value);
        })

        ipcRenderer.on('message', function(event, data) {
            let message_fregment:HTMLDivElement = document.createElement('div');
            console.log('sub received message', data)
            message_fregment.innerText = data;
            document.body.appendChild(message_fregment);
        })
    }

}