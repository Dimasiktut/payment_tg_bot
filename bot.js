const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) throw new Error('TELEGRAM_BOT_TOKEN не задан!');

const bot = new TelegramBot(token, { polling: true });

// Хранилище пользователей, которые начали бота
const users = new Set();

// Обработка /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  users.add(chatId);
  bot.sendMessage(chatId, 'Привет! Открывайте сайт через кнопку "Оплата транспорта".');
});

// Функция для отправки чека пользователю
function sendReceipt(chatId, receiptText) {
  bot.sendMessage(chatId, receiptText, { parse_mode: 'MarkdownV2' });
}

module.exports = { sendReceipt, users };
