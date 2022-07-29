// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, webContents, shell } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const fs = require("fs");

let photoViewWindow = null;

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 400,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.webContents.session.on(
    "will-download",
    (event, item, webContents) => {
      item.on("updated", (event, state) => {
        item.setSavePath(
          app.getPath("downloads") +
            "/" +
            new Date().getTime() +
            item.getFilename()
        );

        if (state === "interrupted") {
          console.log("Download is interrupted but can be resumed");
        } else if (state === "progressing") {
          if (item.isPaused()) {
            console.log("Download is paused");
          } else {
            mainWindow.webContents.send(
              "downloadProgress",
              (item.getReceivedBytes() / item.getTotalBytes()) * 100
            );
            mainWindow.setProgressBar(
              item.getReceivedBytes() / item.getTotalBytes()
            );

            console.log(`Received bytes: ${item.getReceivedBytes()}`);
          }
        }
      });

      item.once("done", (event, state) => {
        if (state === "completed") {
          mainWindow.webContents.send("downloadProgress", 0);
          mainWindow.webContents.send("downloadDone", 0);
          mainWindow.setProgressBar(-1);
        } else {
          mainWindow.webContents.send("downloadProgress", 0);
          mainWindow.webContents.send("downloadError", 0);
          mainWindow.setProgressBar(-1);
        }
      });
    }
  );

  ipcMain.on("closeApp", (event, title) => {
    mainWindow.close();
  });

  ipcMain.on("download", (event, url) => {
    mainWindow.webContents.downloadURL(url);
  });

  ipcMain.on("openLink", (event, url) => {
    shell.openExternal(url);
  });

  ipcMain.handle("openFile", async (event, { path, type }) => {
    try {
      const res = await fs.promises.readFile(path, { encoding: "base64" });

      return `data:${type};base64,` + res;
    } catch (e) {
      throw e;
    }
  });

  ipcMain.on("viewPhoto", (event, { idx, urls }) => {
    if (!photoViewWindow) {
      photoViewWindow = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 400,
        webPreferences: {
          preload: path.join(__dirname, "photo-view.preload.js"),
        },
      });

      photoViewWindow.loadURL(
        isDev
          ? `file://${path.join(__dirname, "/../public/photo-view.html")}`
          : `file://${path.join(__dirname, "photo-view.html")}`
      );

      photoViewWindow.on("close", () => {
        photoViewWindow = null;
      });

      photoViewWindow.webContents.once("dom-ready", () => {
        photoViewWindow.webContents.send("img-src", { idx, urls });
      });
    } else {
      photoViewWindow.webContents.send("img-src", { idx, urls });
    }

    photoViewWindow.focus();
  });

  // and load the index.html of the app.
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "index.html")}`
  );

  //Show in dev mode to use devTools
  if (!isDev) mainWindow.setMenu(null);

  // Open the DevTools.
  // if (isDev) mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  app.setAppUserModelId("Chat app");

  if (isDev) {
    const {
      default: installExtension,
      REDUX_DEVTOOLS,
      REACT_DEVELOPER_TOOLS,
    } = require("electron-devtools-installer");

    installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS])
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log("An error occurred: ", err));
  }

  createWindow();

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
