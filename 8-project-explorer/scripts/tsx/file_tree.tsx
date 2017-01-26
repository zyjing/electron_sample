import * as React from 'react'
import * as ReactDom from 'react-dom'
import * as fs from 'fs'
import * as path from 'path'
import {projectStore} from '../project_store' 

import {fileStore} from '../file_store'

interface FileTreeProps {
    folderPath?: string;
}

interface FileTreeState {
    folderPath?: string;
}

export class FileTree extends React.Component<FileTreeProps, FileTreeState> {

    constructor(props: FileTreeProps, state: FileTreeState) {
        super(props);
        this.state = {folderPath: __dirname};
    }

    onChange() {
        let folderPath = projectStore.getFolderPath();
        if (this.state.folderPath != folderPath) {
            this.setState({folderPath: folderPath});
        
            let fancytree = $("#tree").fancytree("getTree");
            
            this.readFolder(folderPath, fancytree.getRootNode());
        }
    }

    shouldComponentUpdate(nextProps, nextState: FileTreeState) {
        return this.state.folderPath != nextState.folderPath
    }

    componentWillMount() {
        this.initTree();
    }

    
    initTree() {
        let self = this;

        let baseDir:string = this.state.folderPath || path.join(__dirname, '../../scripts');

        $(function(){
 
        $("#tree").fancytree({
            extensions: ["edit"],
          checkbox: true,
          selectMode: 2,
          click: function(event, data){
            var node = data.node;
            node.editCreateNode("after", {
				title: "Node title",
				folder: true
			});
            let filePath: string =(node.data as any).filePath;

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

        //self._fancytree = $("#tree").fancytree("getTree");
        
        //self.readFolder(baseDir, self._fancytree.getRootNode());
        
    });

    }

    render() {
        let fancytree = $("#tree").fancytree("getTree");
        return null;
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
    
}