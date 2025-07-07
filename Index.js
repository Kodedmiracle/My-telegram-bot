const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const bodyParser = require('body-parser');

// === CONFIG ===
const TELEGRAM_BOT_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';
const TELEGRAM_CHAT_ID = 'YOUR_TELEGRAM_CHAT_ID';

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON from TradingView
app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  const { asset, price, signal } = req.body;

  if (!asset || !price || !signal) {
    return res.status(400).send('Missing required data');
  }

  const entry = parseFloat(price);
  const tp = (entry * 1.025).toFixed(2);
  const sl = (entry * 0.985).toFixed(2);

  const message = `
🔔 New Signal – ${asset}
📢 Signal: ${signal.toUpperCase()}
💵 Entry: $${entry}
🎯 Take Profit: $${tp}
🛑 Stop Loss: $${sl}
⏰ Source: TradingView
`;

  bot.sendMessage(TELEGRAM_CHAT_ID, message.trim());
  res.status(200).send('Signal sent');
});

// Default route
app.get('/', (req, res) => {
  res.send('Pivot Pulse Bot is running...');
});

app.listen(PORT, () => {
  console.log(`Bot server listening on port ${PORT}`);
});
