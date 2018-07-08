import * as electron from 'electron'
import {SubWindow} from './SubWindow'
import {MainWindow} from './MainWindow'

const app: Electron.App = electron.app;
const BrowserWindow: typeof Electron.BrowserWindow = electron.BrowserWindow;

var mainWindow: MainWindow = null;
var subWindow: SubWindow;


var ipc = electron.ipcMain;

app.on('ready', ()=> {
    mainWindow = new MainWindow({width: 800, height: 600});
    mainWindow.openDevTools();

    subWindow = new SubWindow({width: 400, height: 300});
    subWindow.showWindow();
    subWindow.openDevTools();
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

ipc.on('to-sub', function(data:any) {
    console.log('to-sub', data)
    if (data.event == 'message') {
        console.log('forwarding to sub');
        
        (subWindow.browserWindow as any).send('message', data.payload)
    }
});

ipc.on('to-main', function(data:any) {
    console.log('to-main', data)
    if (data.event == 'message') {
        console.log('forwarding to main');
        (mainWindow.browserWindow as any).send('message', data.payload)
    }
});




