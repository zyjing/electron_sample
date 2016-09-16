import {BrowserWindow} from 'electron';
import {remote, ipcMain} from 'electron'
import * as path from 'path'

export class NotImplementedException extends Error {

}
export class BaseWindow {
    
    static _lastLaunchedID: number;
    readonly _baseFormPath: string = '../forms'

    _owner: any //Parent Window object
    _id: number;
    _browserWindow:Electron.BrowserWindow = null;
    _menu: typeof Electron.Menu;
    _ipcMain: Electron.IpcMain;

    constructor(options) {
        
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
                this._menu = remote.Menu;
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

    get Owner(): Electron.BrowserWindow {throw this.browserWindow.getParentWindow()}
    //set Owner(value: BaseWiElectron.BrowserWindowndow) {throw new NotImplementedException();}

    get top(): number {return 0 /*TODO*/}
    get width(): number {return this.browserWindow.getSize()[0];}
    get height(): number {return this.browserWindow.getSize()[1];}
    get text(): string {return this.browserWindow.getTitle();}

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