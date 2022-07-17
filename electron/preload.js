// preload with contextIsolation enabled
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  closeApp: () => ipcRenderer.send("closeApp"),

  download: (url) => {
    ipcRenderer.send("download", url);
  },

  viewPhoto: (urls, idx) => {
    ipcRenderer.send("viewPhoto", {
      idx,
      urls,
    });
  },

  openLink: (url) => {
    ipcRenderer.send("openLink", url);
  },

  onDownloadFileProgress: (callback) => {
    ipcRenderer.on("downloadProgress", (_event, bytes) => callback(bytes));
  },

  onDownloadFileDone: (callback) => {
    ipcRenderer.on("downloadDone", () => callback());
  },

  onDownloadFileError: (callback) => {
    ipcRenderer.on("downloadError", () => callback());
  },

  removeDownloadFileListener: () => {
    ipcRenderer.removeAllListeners("downloadProgress");
    ipcRenderer.removeAllListeners("downloadDone");
    ipcRenderer.removeAllListeners("downloadError");
  },
});
