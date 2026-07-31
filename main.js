const { app, BrowserWindow, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

const APP_VERSION = app.getVersion();

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 900,
        minHeight: 600,
        icon: path.join(__dirname, 'assets/icon-512.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
        title: 'Sisky',
    });

    win.loadURL(`https://default.sisky.com.br?appVersion=${APP_VERSION}`);
}

app.whenReady().then(() => {
    createWindow();

    setTimeout(() => {
        autoUpdater.checkForUpdatesAndNotify();
    }, 3000);

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
        type: 'info',
        title: 'Atualização disponível',
        message: 'Uma nova versão do Sisky está disponível. Será baixada em background.',
        buttons: ['OK'],
    });
});

autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
        type: 'info',
        title: 'Atualização pronta',
        message: 'A atualização foi baixada. O Sisky será reiniciado para aplicar.',
        buttons: ['Reiniciar agora', 'Mais tarde'],
    }).then((result) => {
        if (result.response === 0) {
            autoUpdater.quitAndInstall();
        }
    });
});