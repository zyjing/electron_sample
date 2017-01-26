import * as fs from 'fs'
import * as path from 'path'

import {BaseWindow} from './BaseWindow'
import {remote} from 'electron'
import {ipcRenderer} from 'electron'
import {projectStore} from './project_store'
import {fileStore} from './file_store'
import {MainWindowCommands, MainWindowMenu} from './MainWindow_menu'


export class MainWindow extends BaseWindow {

    get pageFile(): string {
        return "main_window.html";
    } 

    _menu: MainWindowMenu;
    _fancytree:Fancytree.Fancytree;

    onFolderChange() {
        let folderPath = projectStore.getFolderPath();
        
        let fancytree = $("#tree").fancytree("getTree");
        fancytree.clear();
        this.readFolder(folderPath, fancytree.getRootNode());

    }

    clickItem(itemName) {

    }

    traverseTree(nodeAction: (node: Fancytree.FancytreeNode)=> void) {
        var tree = $("#tree").fancytree("getTree");

        // Expand all tree nodes
        tree.visit(function(node: Fancytree.FancytreeNode) {
            nodeAction(node);
        });
    }

    initComponents() {
        var {remote} = require('electron');
        remote.getCurrentWindow().setTitle("some random name");

        try {
            
            this._menu = new MainWindowMenu();
            
            this._menu.on(MainWindowCommands.perfs, () => {
                
                    this._ipcMain.emit('show-sub');

            }).on(MainWindowCommands.about, () => {

            });

            projectStore.addChangeListener(this.onFolderChange.bind(this));

            this.initTree();
            this.traverseTree(function(node) {
                let filePath: string = (node.data as any).filePath;
                if (filePath && filePath.endsWith('.js')) {
                    console.log(filePath);
                }
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

                let childData: Fancytree.NodeData = {title: file, key: file, data: {filePath: filePath}};

                childData.folder = isDirectory;
                return childData;
            }).sort((a, b) => (a.folder?0: 1) - (b.folder?0: 1)).map(childData=> {
                
                let child: Fancytree.FancytreeNode = node.addChildren([childData]);

                if (childData.folder) {
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
            extensions: ["edit"],
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
        projectStore.setFolderPath(baseDir);
        
    });

    }

}