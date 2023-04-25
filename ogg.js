import { createWriteStream } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

class OggConverter {
	constructor() {
	}

	toMP3() {}

	async create(url, filename) {
		try {
			const oggPath = resolve(__dirname, '../voices', `${fileName}.ogg`);
			const response = await axios({
				method: 'get',
				url,
				responseType: 'stream',
			});
			return new Promise((resolve) => {
				const stream = createWriteStream(oggPath);
				response.data.pipe(stream);
				stream.on('finish', () => resolve(oggPath));
			});
		} catch (e) {
			console.log('Error while creating ogg', e.message);
		}
	}
}

export const ogg = new OggConverter();
