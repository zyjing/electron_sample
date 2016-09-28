import {EventEmitter} from 'events'

let changeEvent;

export class FileStore extends EventEmitter {

    _filePath: string;

    getFilePath(filePath: string): string {
        return this._filePath;
    }

    setFilePath(filePath: string) {
        this._filePath = filePath;
        this.emit('change');
    }

    addChangeListener(callback) {
        this.on('change', callback);
    }

    remoteChangeListener(callback) {
        this.removeListener('change', callback);
    }
}

export let fileStore: FileStore = new FileStore();
