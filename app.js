const {app, BrowserWindow,ipcMain, MessageChannelMain, Menu} = require('electron')
const url = require("url");
const path = require("path");
const { fs } = require('fs');
// const { menuTemplate } = require("./middlewhare/dist/menuTemplate")

let mainWindow
const isMac = process.platform === "darwin"

const { fork } = require('child_process');
const ps = fork(`${__dirname}/server.js`)

const menuTemplate = [
  ...(
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
    label: 'File',
    submenu: [
      {
        label: 'New Notebook',
        click: () => mainWindow.webContents.send('menuCommand', 'newNotebook')
      },
      {
        label: 'New Page',
        click: () => mainWindow.webContents.send('menuCommand', 'newPage')
      },
      { type: 'separator'},
      {
        label: 'Open Notebook...',
        click: () => mainWindow.webContents.send('menuCommand', 'openNotebook')
      },
      {
        label: 'Open Page...',
        click: () => mainWindow.webContents.send('menuCommand', 'openPage')
      },
      { type: 'separator'},
      {
        label: 'Save Page...',
        click: () => mainWindow.webContents.send('menuCommand', 'saveNotebook')
      },
      {
        label: 'Save Notebook...',
        click: () => mainWindow.webContents.send('menuCommand', 'savePage')
      },
      { type: 'separator'},
      {
        label: 'Export',
        click: () => mainWindow.webContents.send('menuCommand', 'export')
      },
      {
        label: 'Import',
        click: () => mainWindow.webContents.send('menuCommand', 'import')
      },
      // {
      //   label: 'Open Recent...',
      //   click: () => mainWindow.webContents.send('menuCommand', 'openRecent')
      // },
      { type: 'separator'},
      {
        label: 'Close Current Page',
        click: () => mainWindow.webContents.send('menuCommand', 'closePage')
      },
      {
        label: 'Close All Pages',
        click: () => mainWindow.webContents.send('menuCommand', 'closeAllPages')
      },
      {
        label: 'Close Notebook',
        click: () => mainWindow.webContents.send('menuCommand', 'closeNotebook')
      },
      { type: 'separator'},
      {
          label: 'Exit',
          click: () => exitApp()
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac ? [
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [
            { role: 'startSpeaking' },
            { role: 'stopSpeaking' }
          ]
        }
      ] : [
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ])
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { type: 'separator' },
      {
        label: 'All Widgets',
        click: () => mainWindow.webContents.send('menuCommand', 'allWidgets')
      },
      { label: 'Widgets...',
        submenu: [
          {
            label: 'Person Widget',
            click: () => mainWindow.webContents.send('menuCommand', 'personWidget')
            
          },
          {
            label: 'Place Widget',
            click: () => mainWindow.webContents.send('menuCommand', 'placeWidget')
          },
          {
            label: 'Item Widget',
            click: () => mainWindow.webContents.send('menuCommand', 'itemWidget')
          },
          {
            label: 'Misc Widget',
            click: () => mainWindow.webContents.send('menuCommand', 'miscWidget')
          }
        ]
      },
      {
        label: 'All Tags',
        click: () => mainWindow.webContents.send('menuCommand', 'allTags')
      },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    label: 'Help',
    submenu: [
      //toDo
    ]
  }
]

const menu = Menu.buildFromTemplate(menuTemplate);

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 2000,
    height: 1000,
    webPreferences: {
      nodeIntegration: true,
      preload: `${__dirname}/middlewhare/dist/preload.js`
    }
  })

  // const menu = Menu.buildFromTemplate(menuTemplate);

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

function exitApp(){
  app.quit();
}


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

