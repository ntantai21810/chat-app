// preload with contextIsolation enabled
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("photoViewAPI", {
  onReceiveImgUrl: (callback) => ipcRenderer.on("img-src", callback),
  download: (url) => {
    ipcRenderer.send("download", url);
  },
});
