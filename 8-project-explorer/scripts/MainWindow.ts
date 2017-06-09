import * as fs from 'fs'
import * as path from 'path'

import {BaseWindow} from './BaseWindow'
import {remote} from 'electron'
import {ipcRenderer} from 'electron'
import {projectStore} from './project_store'
import {fileStore} from './file_store'
import {MainWindowCommands, MainWindowMenu} from './MainWindow_menu'

interface NodeData {
    filePath: string;
}
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
        let rootNode = fancytree.getRootNode();
        this.readFolder(folderPath).sort((a, b) => (a.folder?0: 1) - (b.folder?0: 1)).map(childData=> {
                
                let child: Fancytree.FancytreeNode = rootNode.addChildren([childData]);

                // if (child.title == 'tsx') {
                //     console.log('found tsx');
                //     child.lazy = true;
                //     child.resetLazy();
                //     return;
                // }

                // if (childData.folder) {
                //     this.readFolder(childData.data.filePath, child);
                // }
            });

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

    readFolder(parentDir: string) {
        let files = fs.readdirSync(parentDir);

        let data = files.map(file => {
                let filePath = path.join(parentDir, file);

                let isDirectory: boolean = fs.statSync(filePath).isDirectory();

                let isLazy = (isDirectory && !this.isEmptyFolder(filePath) && !this.shouldInclude(file));
                let shouldExpanded = (isDirectory && !isLazy)

                let childData: Fancytree.NodeData = {title: file, key: file, lazy: isLazy, expanded: shouldExpanded, data: {filePath: filePath}};
                childData.folder = isDirectory;

                if (shouldExpanded) {
                    childData.children = this.readFolder(filePath);
                }
                return childData;
            });
            console.error('readFolder', data);
            return data;
    }

    isEmptyFolder(folder: string): boolean {
        let files = fs.readdirSync(folder);
        return (files.length == 0); 
    }

    shouldInclude(folder: string) {
        if (folder == 'res') return true;
    }
    
    initTree(dir?: string) {

        let rootDir = dir || __dirname;
        let self = this;

        let baseDir:string = path.join(rootDir, './');

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
          lazyLoad: (event, data) => {
              let node = data.node;
              let metaData: NodeData = node.data as NodeData;
              data.result = this.readFolder(metaData.filePath);
          },
          source:[
          ]
        });

        self._fancytree = $("#tree").fancytree("getTree");
        projectStore.setFolderPath(baseDir);
        

    }

}