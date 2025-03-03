// src/index.js
export default {
  async email(message, env, ctx) {
    try {
      // Извлекаем содержимое email
      const from = message.from;
      const to = message.to;
      const subject = message.headers.get("subject") || "Без темы";
      
      // Декодируем тему, если она содержит закодированные символы
      let decodedSubject = subject;
      if (subject.includes("=?") && subject.includes("?=")) {
        decodedSubject = decodeEmailSubject(subject);
      }
      
      // Получаем текст сообщения
      let rawText = "";
      let contentType = "";
      
      if (message.raw) {
        const rawEmail = await new Response(message.raw).text();
        
        // Определяем Content-Type и кодировку
        const contentTypeMatch = rawEmail.match(/Content-Type: text\/plain(?:;\s*charset=([^\s;]+))?/i);
        if (contentTypeMatch) {
          contentType = contentTypeMatch[0];
          const charset = contentTypeMatch[1] || "utf-8";
        }
        
        // Извлекаем тело сообщения с учетом Content-Transfer-Encoding
        const transferEncodingMatch = rawEmail.match(/Content-Transfer-Encoding: ([^\s]+)/i);
        const transferEncoding = transferEncodingMatch ? transferEncodingMatch[1].toLowerCase() : "7bit";
        
        // Извлекаем текстовую часть
        const textMatch = rawEmail.match(/Content-Type: text\/plain[\s\S]*?\r\n\r\n([\s\S]*?)(?:\r\n--|\r\n\r\n|$)/i);
        
        if (textMatch && textMatch[1]) {
          let extractedText = textMatch[1].trim();
          
          // Удаляем ID сообщения Cloudflare, если он есть
          extractedText = extractedText.replace(/\[\w{8}-\w{4}-\w{4}-\w{4}-\w{12}\]/g, '');
          
          // Декодируем в зависимости от типа кодирования
          if (transferEncoding === "base64") {
            try {
              extractedText = atob(extractedText.replace(/\s/g, ""));
              // Попытка преобразования из двоичного представления в UTF-8
              const bytes = new Uint8Array(extractedText.length);
              for (let i = 0; i < extractedText.length; i++) {
                bytes[i] = extractedText.charCodeAt(i);
              }
              extractedText = new TextDecoder("utf-8").decode(bytes);
            } catch (e) {
              console.error("Error decoding base64:", e);
            }
          } else if (transferEncoding === "quoted-printable") {
            extractedText = decodeQuotedPrintable(extractedText);
          }
          
          rawText = extractedText;
        }
      }

      // Формируем сообщение для Telegram
      const statusMatch = decodedSubject.match(/(UP|DOWN)/i);
      const status = statusMatch ? statusMatch[1].toUpperCase() : "ALERT";
      
      // Эмодзи для статуса
      const emoji = status === "UP" ? "✅" : status === "DOWN" ? "❌" : "⚠️";
      
      let messageText = `${emoji} *${decodedSubject}*\n\n`;
      
      // Добавляем текст из письма, если он есть
      if (rawText) {
        messageText += `Детали:\n\`\`\`\n${rawText}\n\`\`\``;
      } else {
        messageText += `Проверьте статус сервисов uptime.fh.spb.ru.`;
      }
      
      // Отправляем сообщение в Telegram
      const telegramResponse = await fetch(
        `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: env.TELEGRAM_CHAT_ID,
            text: messageText,
            parse_mode: "Markdown",
          }),
        }
      );

      const telegramResult = await telegramResponse.json();
      
      // Логируем результат
      console.log("Telegram API response:", JSON.stringify(telegramResult));
      
      return new Response("OK");
    } catch (error) {
      console.error("Error processing email:", error.stack || error);
      return new Response("Error occurred, but accepted");
    }
  },
};

// Функция для декодирования quoted-printable
function decodeQuotedPrintable(input) {
  return input
    .replace(/=\r?\n/g, '') // Удаляем переносы строк с =
    .replace(/=([0-9A-F]{2})/g, (match, hex) => {
      return String.fromCharCode(parseInt(hex, 16));
    });
}

// Функция для декодирования темы письма
function decodeEmailSubject(subject) {
  // Регулярное выражение для поиска закодированных частей формата =?encoding?type?encoded_text?=
  const regex = /=\?([^?]+)\?([QB])\?([^?]+)\?=/gi;
  
  return subject.replace(regex, (match, charset, encoding, text) => {
    try {
      if (encoding.toUpperCase() === 'B') {
        // Base64
        const decoded = atob(text);
        const bytes = new Uint8Array(decoded.length);
        for (let i = 0; i < decoded.length; i++) {
          bytes[i] = decoded.charCodeAt(i);
        }
        return new TextDecoder(charset).decode(bytes);
      } else if (encoding.toUpperCase() === 'Q') {
        // Quoted-printable
        return decodeQuotedPrintable(text.replace(/_/g, ' '));
      }
    } catch (e) {
      console.error('Error decoding subject:', e);
    }
    return match; // Возвращаем исходную строку в случае ошибки
  });
}
