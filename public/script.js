const socket = io();
const historyDiv = document.getElementById('history');

document.getElementById('submit').addEventListener('click', () => {
  
  const symbol = document.getElementById('symbol').value.trim().toUpperCase();
  const target = parseFloat(document.getElementById('target').value);

  if (!symbol || isNaN(target)) {
    alert('Please enter a valid symbol and target price');
    return;
  }

  socket.emit('checkStock', { symbol, target });
});

socket.on('stockResult', (data) => {
  if (data.error) {
    alert(data.error);
    return;
  }

  const { symbol, price, target, status, voiceText } = data;

  // Create history item
  const div = document.createElement('div');
  div.classList.add('history-item');

  const circle = document.createElement('div');
  circle.classList.add('circle');
  if (status === 'rise') circle.classList.add('red');
  else if (status === 'fall') circle.classList.add('green');
  else circle.classList.add('orange');

  div.appendChild(circle);
  div.appendChild(document.createTextNode(`${symbol}: ${price} (Target: ${target})`));

  // Newest on top
  historyDiv.prepend(div);

  // Notification
  if (Notification.permission === 'granted') {
    new Notification(`Stock ${symbol} ${status === 'rise' ? 'has risen above' : 'has fallen below'} target`, {
      body: `Current Price: ${price}, Target: ${target}`
    });
  } else {
    Notification.requestPermission();
  }

  // Voice message
  const utterance = new SpeechSynthesisUtterance(voiceText);
  speechSynthesis.speak(utterance);
});
