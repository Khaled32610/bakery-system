import { app, BrowserWindow } from 'electron'
import path from 'path'

// إجبار النظام على تعطيل الرسوميات لتخطي تعارض كروت الشاشة على لينكس
app.disableHardwareAcceleration()
app.commandLine.appendSwitch('disable-gpu')
app.commandLine.appendSwitch('disable-software-rasterizer')
app.commandLine.appendSwitch('no-sandbox')

process.env['ELECTRON_DISABLE_SANDBOX'] = 'true'

console.log("🚀 Starting Electron App...")

function createWindow() {
  console.log("🖥️ Creating window...")
  try {
    const mainWindow = new BrowserWindow({
      width: 1280,
      height: 800,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    })

    if (process.env.VITE_DEV_SERVER_URL) {
      mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    } else {
      mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
    }
  } catch (err) {
    console.error("❌ Error:", err)
  }
}

app.whenReady().then(() => {
  console.log("✅ App is ready!")
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})