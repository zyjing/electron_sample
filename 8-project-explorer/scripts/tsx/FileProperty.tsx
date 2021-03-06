import * as React from 'react'
import * as fs from 'fs'
import * as path from 'path'
import {fileStore} from '../file_store'

interface FileProps {
    filePath?: string;
}

interface FileState {
    filePath?: string;
}

export class FileProperty extends React.Component<FileProps, FileState> {

    constructor(props: FileProps, state: FileState) {
        super(props);
        this.state = {filePath: props.filePath};
    }

/*
    componentWillReceiveProps(nextProps: FileProps) {
        this.setState({filePath: nextProps.filePath});
    }
*/
    onChange() {
        this.setState({filePath: fileStore.getFilePath()});
    }

    componentWillMount() {
        fileStore.addChangeListener(this.onChange.bind(this));
    }

    componentWillUnmount() {
        fileStore.remoteChangeListener(this.onChange.bind(this));
    }

    shouldComponentUpdate(nextProps: FileProps, nextState: FileState) {
        console.log('File Property shouldComponentUpdate', this.state, nextState)
        return this.state.filePath != nextState.filePath;
    }

    getFileProperties(filePath: string): {
            fileName: string,
            filePath: string,
            type: string,
            size: number,
            createTime: Date
        } {
        let stats: fs.Stats = fs.statSync(filePath);

        let fileDetails = {
            fileName: path.basename(filePath),
            filePath: filePath,
            type: stats.isDirectory() ? 'directory': 'file',
            size: stats.size,
            createTime: stats.birthtime
        }

        return fileDetails;
    }

    render() {

        let filePath = this.state.filePath;
        if (filePath == null) return (<div>File is not selected</div>);

        let fileDetails = this.getFileProperties(filePath);

        return (<div>
            <div>Type: <input type="text" className="form-control" readOnly value={fileDetails.type}></input></div>
            <div>Name: <input type="text" className="form-control" readOnly value={fileDetails.fileName}></input></div>
            <div>Created: <input type="text" className="form-control" readOnly value={fileDetails.createTime.toDateString()}></input></div>
            <div>Path: <input type="text" className="form-control" readOnly value={fileDetails.filePath}></input></div>
            <div>Size: <input type="text" className="form-control" readOnly value={fileDetails.size.toString()}></input></div>
        
        </div>);
    }
} 
