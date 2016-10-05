import * as fs from 'fs'
import * as path from 'path'

import {BaseWindow} from './BaseWindow'
import {remote} from 'electron'
import {ipcRenderer} from 'electron'
import {folderStore} from './FolderStore'
import {fileStore} from './FileStore'
import {MainWindowCommands, MainWindowMenu} from './MainWindow_menu'


export class MainWindow extends BaseWindow {

    get pageFile(): string {
        return "main_window.html";
    } 

    _menu: MainWindowMenu;
    _fancytree:Fancytree.Fancytree;

    onFolderChange() {
        let folderPath = folderStore.getFolderPath();
        
        let fancytree = $("#tree").fancytree("getTree");
        fancytree.clear();
        this.readFolder(folderPath, fancytree.getRootNode());

    }

    initComponents() {

        try {
            
            this._menu = new MainWindowMenu();
            
            this._menu.on(MainWindowCommands.perfs, () => {
                
                    this._ipcMain.emit('show-sub');

            }).on(MainWindowCommands.about, () => {

            });

            folderStore.addChangeListener(this.onFolderChange.bind(this));

            this.initTree();
        
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
                return childData;
            }).sort((a, b) => (a.folder?0: 1) - (b.folder?0: 1)).map(childData=> {
                
                let child: Fancytree.FancytreeNode = node.addChildren([childData]);

                if (childData.folder {
                    this.readFolder(childData.data.filePath, child);
                }
            })
    }
    
    initTree(dir?: string) {

        let rootDir = dir || __dirname;
        let self = this;

        let baseDir:string = path.join(rootDir, './');

        $(function(){
 
        $("#tree").fancytree({
          checkbox: true,
          selectMode: 2,
          click: function(event, data){
            var node = data.node;
            
            let filePath: string =(node.data as any).filePath;

            fileStore.setFilePath(filePath);
            return true;
          },
          source:[
          ]
        });

        self._fancytree = $("#tree").fancytree("getTree");
        folderStore.setFolderPath(baseDir);
        
    });

    }

}