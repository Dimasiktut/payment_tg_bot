const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) throw new Error('TELEGRAM_BOT_TOKEN не задан!');

const bot = new TelegramBot(token, { polling: true });

// Обработка /start с параметром
bot.onText(/\/start(?: (.+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const param = match && match[1] ? match[1] : null;
  bot.sendMessage(chatId, `Привет! Ваш параметр: ${param || 'нет параметра'}`);
});

// Обработка любых текстовых сообщений
bot.on('message', msg => {
  const chatId = msg.chat.id;
  if (!msg.text.startsWith('/start')) {
    bot.sendMessage(chatId, 'Бот работает! Используйте /start <параметр>');
  }
});

console.log('✅ Бот запущен!');
