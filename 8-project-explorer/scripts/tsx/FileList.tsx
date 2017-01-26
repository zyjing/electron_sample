import * as React from 'react'
import * as ReactDom from 'react-dom'
import * as fs from 'fs'
import * as path from 'path'
import {fileStore} from '../file_store'

interface FileListProps {
    files?: string[];
}

interface FileListState {
    files?: string[];
}

export class FileList extends React.Component<FileListProps, FileListState> {

    constructor(props: FileListProps, state: FileListState) {
        super(props);
        this.state = {files: []};
    }

    render() {
        return (<ul className="list-group">
            <li className="list-group-item">First item</li>
            <li className="list-group-item">Second item</li>
            <li className="list-group-item">Third item</li>
        </ul>)
    }

}