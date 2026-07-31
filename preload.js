const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('sisky', {
    setSubdomain: (subdomain) => ipcRenderer.send('set-subdomain', subdomain),
    validateSubdomain: (subdomain) => ipcRenderer.invoke('validate-subdomain', subdomain),
});