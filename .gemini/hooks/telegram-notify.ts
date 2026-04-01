
async function notifyTelegram() {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    console.error("❌ Telegram Bot Token or Chat ID is missing in .env");
    return;
  }

  const message = `🚀 *Project: Web-App Keuangan*\n\n✅ *Status Update:*\nBackend APIs implemented and integrated with Frontend.\nPrisma, ElysiaJS, and FinanceContext refactor completed.\n\n🔔 *Action:* Project is ready for push!`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    const result = await response.json();
    if (result.ok) {
      console.log("✅ Notification sent to Telegram!");
    } else {
      console.error("❌ Failed to send Telegram notification:", result.description);
    }
  } catch (error) {
    console.error("❌ Error sending Telegram notification:", error);
  }
}

notifyTelegram();
