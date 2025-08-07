const socket = io();

const form = document.getElementById('numberForm');
const input = document.getElementById('numberInput');
const notification = document.getElementById('notification');
const history = document.getElementById('history');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const value = parseFloat(input.value);
  if (isNaN(value)) {
    alert('Please enter a valid number');
    return;
  }

  socket.emit('new number', value);
  input.value = '';
});

socket.on('numberResult', function (data) {
  notification.textContent = data.message;

  const li = document.createElement('li');
  li.textContent = `Number: ${data.number} - ${data.status.toUpperCase()}`;
  li.classList.add(data.status);
  history.appendChild(li);
});
