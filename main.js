const { app, BrowserWindow, ipcMain, shell, dialog } = require("electron");
try {
  require("electron-reloader")(module);
} catch (_) {}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    skipTaskbar: true,
  });

  if (process.env.NODE_ENV === "development") {
    win.loadFile("./dist/index.html");
  } else {
    win.loadFile("./dist/index.html");
  }

  ipcMain.on("open-file", (event, filePath) => {
    shell.openPath(filePath);
  });

  ipcMain.on("open-directory", async (event) => {
    const result = await dialog.showOpenDialog(win, {
      properties: ["openDirectory"],
    });

    if (!result.canceled && result.filePaths.length > 0) {
      const selectedPath = result.filePaths[0];

      // Use the selectedPath as needed, for example, display it in the renderer process
      event.sender.send("selected-directory", selectedPath);
    }
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  // if (process.platform !== 'darwin') {
  app.quit();
  // }
});
