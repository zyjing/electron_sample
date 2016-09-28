
import {remote} from 'electron'
import {BaseMenu} from './BaseWindow'

export class MainWindowCommands {
    static readonly perfs = 'perfs';
    static readonly about = 'about';
}

export class MainWindowMenu extends BaseMenu {

    //menu instance should be created from initComponents of BaseWindow
    constructor() {
        super();

        this._template = [{
        label: 'Electron',
        submenu: [ {
                    label: 'Prefs',
                    click: () => {
                        this.emit(MainWindowCommands.perfs);
                    }
                }
            ]
        },
        {
        label: 'Help',
        submenu: [ {
                    label: 'About',
                    click: () => {
                        this.emit(MainWindowCommands.about);
                    }
                }
            ]
        },
        ];
        this.initMenu();
    }
}
    