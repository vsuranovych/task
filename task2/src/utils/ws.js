// this function is for demo purposes only
// generates echo requests with random timeout
const initWS = (wsCallback) => {
  let ws = new WebSocket('wss://echo.websocket.org');
  let counter = 0; // messages limmit to check last message correct behaviour

  ws.onopen = () => wsEchoMessagesRequest(300);
  ws.onclose = (event) => {
    if (event.wasClean) {
      console.log(`Connection closed, ${event.code}, ${event.reason}`);
    } else {
      console.warn('Connection failed');
    }
  };
  ws.onerror = (error) => console.error(error);
  ws.onmessage = (update) => wsCallback(update.data);

  const wsEchoMessagesRequest = (timeout) => {
    if (counter > 10) {
      return;
    }
    setTimeout(() => {
      const randomTimeout = Math.floor(Math.random() * (1100 - 100) + 1) + 100;
      ws.send('Button ' + randomTimeout);
      wsEchoMessagesRequest(randomTimeout);
      counter++;
    }, timeout);
  };
};

export default initWS;
