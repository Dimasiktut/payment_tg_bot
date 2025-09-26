const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
  console.error("❌ BOT_TOKEN не найден в переменных окружения");
  process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

const DB_FILE = "tickets.json";
let tickets = {};

// Загружаем сохранённые билеты
if (fs.existsSync(DB_FILE)) {
  tickets = JSON.parse(fs.readFileSync(DB_FILE));
}

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `👋 Привет, ${msg.from.first_name}!\n\nЧерез кнопку ниже ты можешь открыть WebApp для покупки билетов.`,
    {
      reply_markup: {
        inline_keyboard: [[{ text: "Открыть сайт", web_app: { url: process.env.WEBAPP_URL } }]]
      }
    }
  );
});

bot.onText(/\/history/, (msg) => {
  const chatId = msg.chat.id;
  const userTickets = tickets[chatId] || [];

  if (userTickets.length === 0) {
    return bot.sendMessage(chatId, "📭 У тебя пока нет билетов");
  }

  let history = userTickets
    .map(
      (t, i) =>
        `#${i + 1} — ${t.vehicleType} | ТС ${t.vehicleNumber} | ${t.amount}₽ | ID: ${t.id} | ${new Date(
          t.dateTime
        ).toLocaleString("ru-RU")}`
    )
    .join("\n\n");

  bot.sendMessage(chatId, "🧾 История билетов:\n\n" + history);
});

console.log("🤖 Bot started");
