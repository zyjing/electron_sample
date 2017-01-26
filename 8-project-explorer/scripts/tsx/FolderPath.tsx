import * as React from 'react'
import * as fs from 'fs'
import * as path from 'path'
import {projectStore} from '../project_store'

interface FileProps {
    folderPath?: string;
}

interface FileState {
    folderPath?: string;
}

export class FolderPath extends React.Component<FileProps, FileState> {

    constructor(props: FileProps, context) {
        super(props);
        this.state = {folderPath: this.props.folderPath || ''};
    }

    formSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        projectStore.setFolderPath(this.state.folderPath);
    }

    onChange() {
        this.setState({folderPath: projectStore.getFolderPath()});
    }

    componentWillMount() {
        projectStore.addChangeListener(this.onChange.bind(this));
    }

    componentWillUnmount() {
        projectStore.remoteChangeListener(this.onChange.bind(this));
    }

    inputChange(event: React.FormEvent<HTMLInputElement>) {
        let folderPath = (event.target as HTMLInputElement).value;
        this.setState({folderPath: folderPath});
    }

    render() {
        return (<form className="form-inline" onSubmit={this.formSubmit.bind(this)}>
            <div className="row form-group" style={{'width': '100%'}} >
            
                <label className="col-sm-2 control-label" htmlFor="path_box">Files:</label>
                <div  className="col-sm-10">
                    <input id="path_box" type="text" className="form-control" style={{'width': '100%'}} onChange={this.inputChange.bind(this)} value={this.state.folderPath} />
                </div>
            </div>
            
        </form>);
    }
}



