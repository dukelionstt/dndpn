
window.menuChannel.handleCommand((event, value) => {
    console.log(`got the message from electron`)
    const commandEvent = new CustomEvent('command', { 
        bubbles: true,
        detail: { text: () => value}}
    )
    let bridge = document.getElementById('bridgeDiv');
    bridge.dispatchEvent(commandEvent);
    console.log(event)
    console.log(value)
})