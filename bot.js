import TelegramBot from "node-telegram-bot-api";
import fs from "fs";

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Файл для хранения истории
const DB_FILE = "tickets.json";
let tickets = {};

// Загружаем сохранённые данные
if (fs.existsSync(DB_FILE)) {
  tickets = JSON.parse(fs.readFileSync(DB_FILE));
}

// Сохраняем билеты
function saveTickets() {
  fs.writeFileSync(DB_FILE, JSON.stringify(tickets, null, 2));
}

// Команда старт
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  if (!tickets[chatId]) tickets[chatId] = [];
  saveTickets();

  bot.sendMessage(chatId, "Привет! Здесь будут твои билеты.\n\nКоманды:\n/history — показать билеты");
});

// Команда история
bot.onText(/\/history/, (msg) => {
  const chatId = msg.chat.id;
  const userTickets = tickets[chatId] || [];

  if (userTickets.length === 0) {
    bot.sendMessage(chatId, "У тебя пока нет билетов 🚍");
  } else {
    let history = userTickets.map(
      (t, i) => `#${i + 1} — ${t.vehicle} | ${t.time} | ID: ${t.id}`
    ).join("\n");

    bot.sendMessage(chatId, "🧾 Твои билеты:\n\n" + history);
  }
});

// 🚀 API для сайта: POST /addTicket
import express from "express";
const app = express();
app.use(express.json());

app.post("/addTicket", (req, res) => {
  const { userId, id, vehicle, time } = req.body;

  if (!tickets[userId]) tickets[userId] = [];
  tickets[userId].push({ id, vehicle, time });
  saveTickets();

  bot.sendMessage(userId, `✅ Новый билет!\n${vehicle} | ${time}\nID: ${id}`);
  res.json({ status: "ok" });
});

// Запускаем API
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Bot server running on " + PORT));
