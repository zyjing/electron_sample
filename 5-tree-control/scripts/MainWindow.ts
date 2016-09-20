import * as fs from 'fs'
import * as path from 'path'

import {BaseWindow} from './BaseWindow'
import {remote} from 'electron'
import {ipcRenderer} from 'electron'

import {MainWindowCommands, MainWindowMenu} from './MainWindow_menu'


export class MainWindow extends BaseWindow {

    get pageFile(): string {
        return "main_window.html";
    } 

    _menu: MainWindowMenu;
    _fancytree:Fancytree.Fancytree;


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

        try {
            
        this._menu = new MainWindowMenu();

        this.initTree();
        
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
        
        } catch(ex) {
            console.log(ex.toString())
        }
    }

    readFolder(parentDir: string, node: Fancytree.FancytreeNode) {
    let files = fs.readdirSync(parentDir);
    files.map(file => {
            let filePath = path.join(parentDir, file);

            let isDirectory: boolean = fs.statSync(filePath).isDirectory();
            let childData: Fancytree.NodeData = {title: file, key: file};
            childData.folder = isDirectory;

            let child: Fancytree.FancytreeNode = node.addChildren([childData]);

            if (fs.statSync(filePath).isDirectory()) {

                this.readFolder(filePath, child);
            }

        })
    }

    initTree() {
        let self = this;

        let baseDir:string = path.join(__dirname, '../../');

        $(function(){
 
        $("#tree").fancytree({
          checkbox: true,
          selectMode: 2,
          source:[
    /*                {title: "Item 1 with embedded html: <input type='input' name='node1info'>", key: "node1"},
            {title: "Item 1", key: "node1"},
            {title: "Folder 2", folder: true, expanded: true, key: "node2",
              children: [
                {title: "Sub-item 2.1", key: "node2.1"},
                {title: "Sub-item 2.2", key: "node2.2"}
              ]
            },
            {title: "Item 3", key: "node3"}*/
          ]
        });

        self._fancytree = $("#tree").fancytree("getTree");
        
        self.readFolder(baseDir, self._fancytree.getRootNode());
        
    });

    }

}