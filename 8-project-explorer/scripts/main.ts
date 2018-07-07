import * as electron from 'electron'
import { MainWindow } from './MainWindow'

const app: Electron.App = electron.app;
const BrowserWindow: typeof Electron.BrowserWindow = electron.BrowserWindow;

var mainWindow: MainWindow = null;


var ipc = electron.ipcMain;

app.on('ready', () => {
    mainWindow = new MainWindow({width: 800, height: 600});
    mainWindow.openDevTools();
})



