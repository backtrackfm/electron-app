import { app, dialog, ipcMain } from "electron";
import serve from "electron-serve";
import fs from "fs";
import os from "os";
import path from "path";
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
        if (result)
          mainWindow.webContents.send("select-folder-return", result.filePaths);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

const getModifiedFiles = (folderPath: string, sinceDate: Date) => {
  try {
    const files = fs.readdirSync(folderPath);
    const modifiedFiles = [];

    console.log(files.length);

    files.forEach((file, i) => {
      const filePath = path.join(folderPath, file);
      const stats = fs.statSync(filePath);

      // make sure that this path is a file & that the modified time is over now
      if (stats.isFile() && stats.mtime > sinceDate) {
        const f = fs.readFileSync(filePath);

        modifiedFiles.push({
          path: filePath,
          stats: stats,
          file: f,
        });
      }
    });

    return modifiedFiles;
  } catch (error) {
    return [];
  }
};

ipcMain.on(
  "spaces:get-changes-made",
  (event, path: string, lastUpdate: Date) => {
    try {
      const modifiedFiles = getModifiedFiles(path, lastUpdate);
      mainWindow.webContents.send(
        "spaces:get-changes-made/return",
        modifiedFiles
      );
    } catch (error) {
      mainWindow.webContents.send("spaces:get-changes-made/return", []);
    }
  }
);
