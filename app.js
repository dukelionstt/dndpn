const {app, BrowserWindow,ipcMain, MessageChannelMain} = require('electron')
const url = require("url");
const path = require("path");
const { fs } = require('fs');

let mainWindow

const { fork } = require('child_process')
const ps = fork(`${__dirname}/server.js`)

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

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

