import * as React from 'react'
import * as fs from 'fs'
import * as path from 'path'
import {folderStore} from '../FolderStore'

interface FileProps {
    folderPath?: string;
}

interface FileState {
    folderPath?: string;
}

export class FolderPath extends React.Component<FileProps, FileState> {

    constructor(props: FileProps, context) {
        super(props);
        this.state = {folderPath: this.props.folderPath};
    }

    formSubmit(event: React.FormEvent) {
        event.preventDefault();

        folderStore.setFolderPath(this.state.folderPath);
    }

    onChange() {
        //console.log('FileProperty onChange', folderStore.getFolderPath())
        this.setState({folderPath: folderStore.getFolderPath()});
    }

    componentWillMount() {
        folderStore.addChangeListener(this.onChange.bind(this));
    }

    componentWillUnmount() {
        folderStore.remoteChangeListener(this.onChange.bind(this));
    }

    inputChange(event: React.FormEvent) {
        let folderPath = (event.target as HTMLInputElement).value;
        this.setState({folderPath: folderPath});
    }

    render() {
        return (<form class="form-inline" onSubmit={this.formSubmit.bind(this)}>
            <div className="row form-group" style={{'width': '100%'}} >
            
                <label className="col-sm-2 control-label" for="path_box">Files:</label>
                <div  className="col-sm-10">
                    <input id="path_box" type="text" className="form-control" style={{'width': '100%'}} onChange={this.inputChange.bind(this)} value={this.state.folderPath} />
                </div>
            </div>
            
        </form>);
    }
}



