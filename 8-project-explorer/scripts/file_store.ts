import {EventEmitter} from 'events'

let changeEvent;

const CHANGE_EVENT = 'change';


export class FileStore extends EventEmitter {

    _filePath: string;

    getFilePath(): string {
        return this._filePath;
    }

    setFilePath(filePath: string) {
        this._filePath = filePath;
        this.emit(CHANGE_EVENT);
    }

    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }

    remoteChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
}

export let fileStore: FileStore = new FileStore();
