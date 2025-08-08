const socket = io();
 
const form=document.getElementById('form');
const stockInput=document.getElementById('stock-symbol');
const priceInput=document.getElementById('target-price');
const statusDiv=document.getElementById('status');
const historyLog=document.getElementById('history-log');
const voiceMessage=document.getElementById('voice-message');

form.addEventListener('submit',(e)=>{
e.preventDefualt();//prevent default page load
const symbol=stockInput.value.trim().toUpperCase();
const price=parseFloat(priceInput.value);
if(!symbol|| isNaN(price))
{
alert('please enter a valid type of stock and price');
return;
}
socket.emit('track-stock',{symbol,price});
stockInput.value='';
priceInput.value='';
statusDiv.textContent='tracking  started for'+symbol+'at $'+price;
});
socket.on('stock-update', ({ symbol, price, status, message, audioUrl }) => {
const listItem=document.createElement('li');
listItem.textContent='${symbol} :${price}->${status}';
historyLog.prepend(listItem);
});  
statusDiv.textContent='Status:${symbol} is now ${status}';
//voice message
if(audioUrl){
    voiceMessage.src=audioUrl;
    voiceMessage.play();
}
if(message){
    alert(message);
}