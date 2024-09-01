const { Telegraf } = require('telegraf');
const axios = require('axios');
const express = require('express');
const app = express();

// Telegram bot token
const BOT_TOKEN = '7127811523:AAGp8Ow2XkoFEqpszsMH8nzYw72lsQXhkfU';

// API base URL
const API_BASE_URL = 'https://letmesee.onrender.com/';

// Create a new Telegraf instance
const bot = new Telegraf(BOT_TOKEN);

// /start command
bot.command('start', async (ctx) => {
    console.log(`Received /start command from ${ctx.from.username}`);
    await ctx.reply('Bot is up and running!');
});

// /which command
bot.command('which', async (ctx) => {
    console.log(`Received /which command from ${ctx.from.username}`);
    try {
        const response = await axios.get(`${API_BASE_URL}/current_id`);
        if (response.status === 200) {
            const currentId = response.data.current_id || 'Unknown';
            await ctx.reply(`Current ID: ${currentId}`);
        } else {
            await ctx.reply('Failed to fetch current ID.');
        }
    } catch (error) {
        await ctx.reply(`An error occurred: ${error.message}`);
    }
});

// /show_logged_in command
bot.command('show_logged_in', async (ctx) => {
    console.log(`Received /show_logged_in command from ${ctx.from.username}`);
    try {
        const response = await axios.get(`${API_BASE_URL}/get_succeeded`);
        if (response.status === 200) {
            const succeededAttempts = response.data;
            if (succeededAttempts.length > 0) {
                const messages = succeededAttempts.map(attempt => `Username: ${attempt.username}`).join('\n');
                await ctx.reply(`Successful logins:\n${messages}`);
            } else {
                await ctx.reply('No successful logins yet.');
            }
        } else {
            await ctx.reply('Failed to fetch successful logins.');
        }
    } catch (error) {
        await ctx.reply(`An error occurred: ${error.message}`);
    }
});

// Start the bot
bot.launch().then(() => {
    console.log('Bot is up and running!');
}).catch(err => {
    console.error('Failed to start the bot:', err);
});

// Express server
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Express server is running on http://localhost:${PORT}`);
});
