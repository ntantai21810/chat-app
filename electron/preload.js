// preload with contextIsolation enabled
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  closeApp: () => ipcRenderer.send("closeApp"),
  download: (url) => {
    ipcRenderer.send("download", url);
  },
  viewPhoto: (url) => {
    ipcRenderer.send("viewPhoto", url);
  },
});
