
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

if (!token || !chatId) {
  console.error("TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set in .env");
  process.exit(1);
}

const message = process.argv[2] || "Perubahan kode terdeteksi atau commit tugas telah dilakukan.";

async function sendNotification() {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    if (response.ok) {
      console.log("Notifikasi Telegram berhasil dikirim.");
    } else {
      const errorData = await response.json();
      console.error("Gagal mengirim notifikasi Telegram:", errorData);
    }
  } catch (error) {
    console.error("Terjadi kesalahan saat mengirim notifikasi:", error);
  }
}

sendNotification();
