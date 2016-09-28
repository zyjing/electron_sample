import * as fs from 'fs'
import * as path from 'path'

import {BaseWindow} from './BaseWindow'
import {remote} from 'electron'
import {ipcRenderer} from 'electron'
import {fileStore} from './FileStore'
import {MainWindowCommands, MainWindowMenu} from './MainWindow_menu'


export class MainWindow extends BaseWindow {

    get pageFile(): string {
        return "main_window.html";
    } 

    _menu: MainWindowMenu;
    _fancytree:Fancytree.Fancytree;



    initComponents() {

        try {
            
            this._menu = new MainWindowMenu();

            this.initTree();
            
            this._menu.on(MainWindowCommands.perfs, () => {
                
                    this._ipcMain.emit('show-sub');

            }).on(MainWindowCommands.about, () => {

            });
        
        } catch(ex) {
            console.log(ex.toString())
        }
    }

    readFolder(parentDir: string, node: Fancytree.FancytreeNode) {
    let files = fs.readdirSync(parentDir);

    files.map(file => {
            let filePath = path.join(parentDir, file);

            let isDirectory: boolean = fs.statSync(filePath).isDirectory();

            let childData: Fancytree.NodeData = {title: file, key: file, data: {filePath: filePath}};

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
          click: function(event, data){
            var node = data.node;
            
            let filePath: string =(node.data as any).filePath;
            console.log(filePath);

            fileStore.setFilePath(filePath);
            return true;
          },
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