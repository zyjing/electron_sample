import {EventEmitter} from 'events'

let changeEvent;

const CHANGE_EVENT = 'change';


export class ProjectStore extends EventEmitter {
    
    _folderPath: string;

    getFolderPath(): string {
        return this._folderPath;
    }

    setFolderPath(folderPath: string) {
        this._folderPath = folderPath;
        this.emit(CHANGE_EVENT);
    }

    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }

    remoteChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
}


export let projectStore: ProjectStore = new ProjectStore();
