const {app, BrowserWindow,ipcMain, MessageChannelMain, Menu} = require('electron')
const url = require("url");
const path = require("path");
const { fs } = require('fs');

let mainWindow
const isMac = process.platform === "darwin"

const { fork } = require('child_process');
const ps = fork(`${__dirname}/server.js`)

const menuTemplate = [
  (
    isMac ? [
      {
        label: 'Dnd Notebook',
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideOthers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      }
    ] : []
  ),
  {
    lable: 'File',
    submenu: [
      {
        lable: 'New Notebook',
        click: () => mainWindow.webContents.send('TestChannel', 'newNotebook')
      },
      {
        lable: 'New Page',
        click: () => mainWindow.webContents.send('TestChannel', 'newPage')
      },
      { type: 'seperator'},
      isMac ? {role: 'close'} : { role: 'quit' }
      
    ]
  }
]

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: `${__dirname}/middlewhare/dist/preload.js`
    }
  })

  const menu = Menu.buildFromTemplate([
    {
      label: 'test',
      click: () => mainWindow.webContents.send('TestChannel', 'save')
    }
  ])

  Menu.setApplicationMenu(menu)

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/dndpn/index.html`),
      protocol: "file:",
      slashes: true
    })
  );
  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
    
}

app.on('ready', function(){
  createWindow()
  
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})


// ipcMain.addListener('getFileSendElectron', (event) => {
//   console.log("message recieved")
//   console.log(event)
// })

// var channel = new MessageChannel();
// channel.port1.onmessage = onMessage;

// function onMessage(event){
//   console.log("message recieved")
//   console.log(event)
// }

