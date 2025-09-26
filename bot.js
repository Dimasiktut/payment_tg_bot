import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_BOT_TOKEN!;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start(?: (.+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const param = match?.[1];

  if (param) {
    const webAppUrl = `https://payment-city-vehicles.onrender.com/?param=${param}`;
    bot.sendMessage(chatId, `Откройте WebApp для вашего транспорта: ${param}`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Открыть WebApp', web_app: { url: webAppUrl } }]
        ],
      },
    });
  } else {
    bot.sendMessage(chatId, 'Добро пожаловать! Укажите транспорт через deep link.');
  }
});

console.log('✅ Бот запущен...');
