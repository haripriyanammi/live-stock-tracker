import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server);

const ALPHA_KEY = process.env.ALPHA_VANTAGE_KEY;
if (!ALPHA_KEY) {
  console.error('❌ ALPHA_VANTAGE_KEY missing in .env');
  process.exit(1);
}

// Serve static files from public/
app.use(express.static(path.join(__dirname, '..', 'public')));

io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);

  socket.on('checkStock', async ({ symbol, target }) => {
    try {
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_KEY}`;
      const response = await axios.get(url);

      const priceStr = response.data?.['Global Quote']?.['05. price'];
      if (!priceStr) {
        socket.emit('stockResult', { error: `No data for ${symbol}` });
        return;
      }

      const price = parseFloat(priceStr);
      let status: 'rise' | 'fall' | 'equal' = 'equal';

      if (price > target) status = 'rise';
      else if (price < target) status = 'fall';

      // Example voice text — could be replaced with real data
      const voiceText = `${symbol} is currently trading at ${price} dollars. Last year was a strong performance year for ${symbol}.`;

      socket.emit('stockResult', {
        symbol,
        price,
        target,
        status,
        voiceText
      });

    } catch (err) {
      socket.emit('stockResult', { error: 'API fetch failed' });
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});
