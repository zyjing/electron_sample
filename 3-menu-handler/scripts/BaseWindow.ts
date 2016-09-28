import {BrowserWindow} from 'electron';
import {remote, ipcMain} from 'electron'
import * as path from 'path'
import {EventEmitter} from 'events'

export class NotImplementedException extends Error {

}


export interface IBaseMenu {
    _template: Electron.MenuItemOptions[];
    initMenu();
}

export class BaseMenu extends EventEmitter implements IBaseMenu{

    _template: Electron.MenuItemOptions[];

    initMenu() {
        if (this._template != null) {
            let menu = remote.Menu.buildFromTemplate(this._template);

            console.log('menu is created');

            remote.Menu.setApplicationMenu(menu);
        }
    }

    constructor() {
        super();
    }



}

export class BaseWindow {
    
    static _lastLaunchedID: number;
    readonly _baseFormPath: string = '../forms'

    _menu: IBaseMenu;
    _owner: any //Parent Window object
    _id: number;
    _browserWindow:Electron.BrowserWindow = null;
    _ipcMain: Electron.IpcMain;

    constructor(options?: any) {
        
        if (options != null) {
            //used for creating Browser window in the main process
            let newOptions = Object.assign({}, options);
            if (typeof options.show == 'undefined') {
                //set to hide by default;
                newOptions.show = false;
            }

            this._browserWindow = new BrowserWindow(options);

            this._browserWindow.loadURL(path.join(__dirname, this._baseFormPath, this.pageFile));
        }
        else {
            if (remote) {
                this._ipcMain = remote.ipcMain;
            } 
            //in render process
            this._id = remote.getCurrentWindow().id
            console.log('this id is', this._id);
        }
    }

    protected get pageFile(): string {
        throw new TypeError('no page file assigned');
    }

    public showWindow()  {
    }

    public get browserWindow(): Electron.BrowserWindow {
        if (this._browserWindow != null) {
            return this._browserWindow;
        }
        else {
            return this._browserWindow = remote.BrowserWindow.fromId(this._id);
        }
    }

    public initComponents() {
        //doing nothing, should be override by sub class
    }

    get owner(): Electron.BrowserWindow {return this.browserWindow.getParentWindow()}
    set owner(value: Electron.BrowserWindow) {this.browserWindow.setParentWindow(value);}

    get top(): number {return 0 /*TODO*/}
    get width(): number {return this.browserWindow.getSize()[0];}
    get height(): number {return this.browserWindow.getSize()[1];}

    get text(): string {return this.browserWindow.getTitle();}
    set text(value: string) {this.browserWindow.setTitle(value);}

    set statusText(value: string) {throw new NotImplementedException();}
    
    get left(): number {return this.browserWindow.getPosition()[0];}

    set visible(value: boolean) {
        console.log('visible', value);
        value ? this.browserWindow.show(): this.browserWindow.hide();
    }

    get visible(): boolean {
        return this.browserWindow.isVisible();
    }

    openDevTools() {
        this.browserWindow.webContents.openDevTools();
    }


    hide() {this.browserWindow.hide();}
    dispose()   {this.browserWindow.close();}
    close() {this.browserWindow.close();}

    Tag: any;
}