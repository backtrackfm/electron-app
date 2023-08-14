import { app, dialog, ipcMain } from "electron";
import serve from "electron-serve";
import os from "os";
import { createWindow } from "./helpers";

const isProd: boolean = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

let mainWindow;

(async () => {
  await app.whenReady();

  mainWindow = await createWindow("backtrack", {
    width: 1000,
    height: 600,
    minHeight: 600,
    minWidth: 400,
  });

  if (isProd) {
    await mainWindow.loadURL("app://./home.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});

ipcMain.on("select-folder", (event, arg) => {
  if (os.platform() === "linux" || os.platform() === "win32") {
    dialog
      .showOpenDialog({
        properties: ["openDirectory"],
      })
      .then((result) => {
        if (result)
          mainWindow.webContents.send("select-folder-return", result.filePaths);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    dialog
      .showOpenDialog({
        properties: ["openDirectory"],
      })
      .then((result) => {
        console.log(result.filePaths);
        if (result)
          mainWindow.webContents.send("select-folder-return", result.filePaths);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});
