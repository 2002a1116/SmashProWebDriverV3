// electron/main.js

const { app, BrowserWindow, session } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      sandbox: false
    }
  });
  // 在 main.js 中，创建窗口后

  win.webContents.session.on('select-hid-device', (event, details, callback) => {
    console.log('hid-device-selected ', details.deviceList)
    // Add events to handle devices being added or removed before the callback on
    // `select-hid-device` is called.
    win.webContents.session.on('hid-device-added', (event, device) => {
      console.log('hid-device-added FIRED WITH', device)
      // Optionally update details.deviceList
    })

    win.webContents.session.on('hid-device-removed', (event, device) => {
      console.log('hid-device-removed FIRED WITH', device)
      // Optionally update details.deviceList
    })

    event.preventDefault()
    console.log('hid-device-selected ', details.deviceList)
    if (details.deviceList && details.deviceList.length > 0) {
      callback(details.deviceList[0].deviceId)
    }
  })

  win.webContents.session.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
    if (permission === 'hid' && (details.securityOrigin === 'file:///' || details.securityOrigin.startsWith('http://localhost:'))) {
      return true
    }
  })

  win.webContents.session.setDevicePermissionHandler((details) => {
    if (details.deviceType === 'hid' && (details.origin === 'file://' || details.origin.startsWith('http://localhost:'))) {
      return true
    }
  })
  // 开发环境加载 Vite 服务器，生产环境加载构建后的文件
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173'); // Vite 默认端口
    win.webContents.openDevTools();
  } else {
    //win.loadFile(path.join(__dirname, '../dist/index.html'));
    const indexPath = path.join(app.getAppPath(), 'dist/index.html');
    win.loadFile(indexPath);
  }
}
app.whenReady().then(createWindow);