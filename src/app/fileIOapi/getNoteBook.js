// const { ipcRenderer } = require("electron")



document.addEventListener('getFileSend', (event) => {
    console.log("event recieved")
    console.log(event)

    // ipcRenderer.send('getFileSendElectron', event.detail)
})