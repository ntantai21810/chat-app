// preload with contextIsolation enabled
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  closeApp: () => ipcRenderer.send("closeApp"),
  download: (url) => {
    console.log("Preload");
    ipcRenderer.send("download", url);
  },
});
