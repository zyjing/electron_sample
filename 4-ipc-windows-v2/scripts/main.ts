import * as electron from 'electron'
import {SubWindow} from './SubWindow'
import {MainWindow} from './MainWindow'

const app: Electron.App = electron.app;
const BrowserWindow: typeof Electron.BrowserWindow = electron.BrowserWindow;

var mainWindow: MainWindow = null;
var subWindow: SubWindow;


var ipc = electron.ipcMain;

app.on('ready', ()=> {
    console.log('app is ready')
    mainWindow = new MainWindow({width: 800, height: 600});
    mainWindow.openDevTools();

})

ipc.on('show-sub', function() {
    if (!subWindow.browserWindow.isDestroyed()) {
        subWindow.visible = !subWindow.visible;
    }
});


ipc.on('hide-sub', function() {
    if (!subWindow.browserWindow.isDestroyed()) {
        subWindow.hide();
    }
});





