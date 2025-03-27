const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

// تهيئة العميل
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox'] } // مهم لـ Render
});

// طباعة QR Code عند الحاجة
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

// التأكد من اتصال البوت
client.on('ready', () => {
    console.log('✅ Bot is ready!');
});

// الرد على الرسائل
client.on('message', async msg => {
    if (msg.body.startsWith('!ask')) {
        const prompt = msg.body.slice(5); // إزالة الأمر !ask
        try {
            // إرسال الطلب إلى DeepSeek API (أو OpenAI)
            const response = await axios.post(
                'https://api.deepseek.com/v1/chat/completions', // أو OpenAI
                {
                    messages: [{ role: 'user', content: prompt }]
                },
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.API_KEY}` // احتفظ بالمفتاح سريًّا
                    }
                }
            );
            msg.reply(response.data.choices[0].message.content);
        } catch (error) {
            console.error(error);
            msg.reply('حدث خطأ أثناء معالجة طلبك.');
        }
    }
});

// تشغيل البوت
client.initialize();