
const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

let win = null;

const {autoUpdater} = require('electron-updater');

autoUpdater.on('update-downloaded', (info) => {
  setTimeout(function() {
    autoUpdater.quitAndInstall();  
  }, 5000)
});

app.on('ready', function () {

  autoUpdater.checkForUpdates();

  // Initialize the window to our specified dimensions
  win = new BrowserWindow({width: 1000, height: 600});

  // Specify entry point
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  win.webContents.openDevTools({ mode: 'detach' });

  // Remove window once app is closed
  win.on('closed', function () {
    win = null;
  });

});

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
});
