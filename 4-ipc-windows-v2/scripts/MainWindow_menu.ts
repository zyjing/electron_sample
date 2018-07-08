
import {remote} from 'electron'
import {BaseMenu} from './BaseWindow'

export class MainWindowCommands {
    static readonly perfs = 'perfs';
    static readonly about = 'about';
}

export class MainWindowMenu extends BaseMenu {

    _template: Electron.MenuItemConstructorOptions[] = [{
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
        ]


    //menu instance should be created from initComponents of BaseWindow
    constructor() {
        super();
    }
}
    