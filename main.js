const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

let store;
const APP_VERSION = app.getVersion();

async function getStore() {
    if (!store) {
        const { default: Store } = await import('electron-store');
        store = new Store();
    }
    return store;
}

async function createWindow() {
    const s = await getStore();

    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 900,
        minHeight: 600,
        icon: path.join(__dirname, 'assets/icon-512.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
        title: 'Sisky',
    });

    const subdomain = s.get('subdomain');

    if (!subdomain) {
        win.loadFile('setup.html');
    } else {
        win.loadURL(`https://${subdomain}.sisky.com.br?appVersion=${APP_VERSION}`);
    }

    return win;
}

app.whenReady().then(async () => {
    await createWindow();

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

ipcMain.on('set-subdomain', async (event, subdomain) => {
    const s = await getStore();
    s.set('subdomain', subdomain);
    const win = BrowserWindow.getFocusedWindow();
    win.loadURL(`https://${subdomain}.sisky.com.br?appVersion=${APP_VERSION}`);
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