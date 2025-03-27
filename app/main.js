const { app, BrowserWindow } = require('electron');
const path = require('path');

// Instead of using electron-is-dev, define a simple alternative
const isDev = process.env.NODE_ENV !== 'production';

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    
    if (isDev) {
        win.loadURL('http://localhost:5173/');
    } else {
        win.loadFile(path.join(__dirname, '/builder/index.html'));
    }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});