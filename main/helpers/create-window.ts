import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  screen,
} from "electron";
import {
  default as ElectronStore,
  Schema,
  default as Store,
} from "electron-store";

type BacktrackStoreSchema = {
  winSize: number[];
  persistedCookies: Electron.Cookie[];
};

export default async (
  windowName: string,
  options: BrowserWindowConstructorOptions
): Promise<BrowserWindow> => {
  const schema: Schema<BacktrackStoreSchema> = {
    winSize: {
      type: "array",
      items: {
        type: "number",
      },
    },
    persistedCookies: {
      type: "array",
      items: {
        type: "object",
        properties: {
          domain: { type: "string" },
          expirationDate: { type: "number" },
          hostOnly: { type: "boolean" },
          httpOnly: { type: "boolean" },
          name: { type: "string" },
          path: { type: "string" },
          sameSite: {
            type: "string",
            enum: ["unspecified", "no_restriction", "lax", "strict"],
          },
          secure: { type: "boolean" },
          session: { type: "boolean" },
          value: { type: "string" },
        },
        required: ["name", "sameSite", "value"],
        additionalProperties: false,
      },
    },
  };

  const key = "window-state";
  const name = `window-state-${windowName}`;
  const store = new Store({ name, schema });
  const defaultSize = {
    width: options.width,
    height: options.height,
  };
  let state = {};
  let win: Electron.BrowserWindow;

  const restore = () => store.get(key, defaultSize);

  const getCurrentPosition = () => {
    const position = win.getPosition();
    const size = win.getSize();
    return {
      x: position[0],
      y: position[1],
      width: size[0],
      height: size[1],
    };
  };

  const windowWithinBounds = (windowState, bounds) => {
    return (
      windowState.x >= bounds.x &&
      windowState.y >= bounds.y &&
      windowState.x + windowState.width <= bounds.x + bounds.width &&
      windowState.y + windowState.height <= bounds.y + bounds.height
    );
  };

  const resetToDefaults = () => {
    const bounds = screen.getPrimaryDisplay().bounds;
    return Object.assign({}, defaultSize, {
      x: (bounds.width - defaultSize.width) / 2,
      y: (bounds.height - defaultSize.height) / 2,
    });
  };

  const ensureVisibleOnSomeDisplay = (windowState) => {
    const visible = screen.getAllDisplays().some((display) => {
      return windowWithinBounds(windowState, display.bounds);
    });
    if (!visible) {
      // Window is partially or fully not visible now.
      // Reset it to safe defaults.
      return resetToDefaults();
    }
    return windowState;
  };

  const saveState = async () => {
    if (!win.isMinimized() && !win.isMaximized()) {
      Object.assign(state, getCurrentPosition());
    }
    store.set(key, state);

    const cookies = await win.webContents.session.cookies.get({
      name: "auth-session-cookie",
    });

    store.set("persistedCookies", cookies);
  };

  state = ensureVisibleOnSomeDisplay(restore());

  const resolution = getSizeSettings(store);

  const browserOptions: BrowserWindowConstructorOptions = {
    ...state,
    ...options,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      ...options.webPreferences,
    },
    width: resolution[0],
    height: resolution[1],
  };
  win = new BrowserWindow(browserOptions);

  const storedCookies = store.get("persistedCookies");

  const promises = storedCookies.map((it) =>
    win.webContents.session.cookies.set({ ...it, url: "http://localhost:8888" })
  );

  await Promise.all(promises);

  win.on("resized", () => saveBounds(store, win.getSize()));

  win.on("close", saveState);

  return win;
};

function getSizeSettings(store: ElectronStore<BacktrackStoreSchema>): number[] {
  const defaultSize: number[] = [800, 600];

  const size = store.get("winSize");

  // If the user's already set a size
  if (size) {
    return size;
  }

  store.set("winSize", defaultSize);
  return defaultSize;
}

function saveBounds(
  store: ElectronStore<BacktrackStoreSchema>,
  newSize: number[]
) {
  store.set("winSize", newSize);
}
