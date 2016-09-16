import * as electron from 'electron'
const app: Electron.App = electron.app;
const BrowserWindow: typeof Electron.BrowserWindow = electron.BrowserWindow;

var mainWindow: Electron.BrowserWindow = null;
var subWindow: Electron.BrowserWindow = null;
var ipc = electron.ipcMain;

app.on('ready', ()=> {
    mainWindow = new BrowserWindow({width: 800, height: 600});
    mainWindow.loadURL('file://' + __dirname + '/../forms/index.html');
    mainWindow.webContents.openDevTools();

    subWindow = new BrowserWindow({width: 400, height: 300, show: false});
    subWindow.loadURL('file://' + __dirname + '/../forms/sub.html');
    subWindow.webContents.openDevTools();
    subWindow.on('close', function(event){
        event.preventDefault();
        subWindow.isVisible() ? subWindow.hide(): subWindow.show();
    })
})

ipc.on('show-sub', function() {
    if (!subWindow.isDestroyed()) {
        subWindow.isVisible() ? subWindow.hide(): subWindow.show();
    }
});


ipc.on('hide-sub', function() {
    if (!subWindow.isDestroyed()) {
        subWindow.hide();
    }
});




ipc.on('to-sub', function(data:any) {
    console.log('to-sub', data)
    if (data.event == 'message') {
        console.log('forwarding to sub');
        
        subWindow.send('message', data.payload)
    }
});

ipc.on('to-main', function(data:any) {
    console.log('to-main', data)
    if (data.event == 'message') {
        console.log('forwarding to main')
        mainWindow.send('message', data.payload)
    }
});




