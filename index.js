const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--single-process'
    ],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || null
  }
});

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ Bot is ready!');
});

client.on('message', async msg => {
  if (msg.body.startsWith('!ask')) {
    const prompt = msg.body.slice(5);
    try {
      const response = await axios.post(
        'https://api.deepseek.com/v1/chat/completions',
        { messages: [{ role: 'user', content: prompt }] },
        { headers: { 'Authorization': `Bearer ${process.env.API_KEY}` } }
      );
      msg.reply(response.data.choices[0].message.content);
    } catch (error) {
      console.error(error);
      msg.reply('حدث خطأ أثناء معالجة طلبك.');
    }
  }
});

client.initialize();