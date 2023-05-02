import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import config from 'config';
import { code } from 'telegraf/format';
import { ogg } from './ogg.js';
import { openai } from './openai.js';

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'));

bot.command('start', async (ctx) => {
	await ctx.reply(JSON.stringify(ctx.message, null, 2));
});

bot.on(message('text'), async (ctx) => {
	await ctx.reply(JSON.stringify(ctx.message.voice, null, 2));
});

bot.on(message('voice'), async (ctx) => {
	try {
		console.log('--ctx: ', ctx);

		await ctx.reply(code('Сообщение принял. Жду ответ у сервера...'));

		const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
		const userId = String(ctx.message.from.id);
		const oggPath = await ogg.create(link.href, userId);
		const mp3Path = await ogg.toMP3(oggPath, userId);

		const text = await openai.transcription(mp3Path);
		console.log('--text: ', text);

		const messages = [{
			role: openai.roles.USER,
			content: text,
		}];
		const response = await openai.chat(messages);

		// console.log(link.href);
		// await ctx.reply(JSON.stringify(link, null, 2));
		await ctx.reply(response.content);
	} catch (e) {
		console.log('Error while voice message', e.message);
	}
	await ctx.reply(JSON.stringify(ctx.message, null, 2));
});


bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

console.log('working');
