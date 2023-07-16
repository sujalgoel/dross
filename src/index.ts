import 'dotenv/config';
import Axios from 'axios';
import Mongoose from 'mongoose';
import ExpressSession from 'express-session';
import URLSchema, { URLDocument } from './models/url';
import Express, { Application, Request, Response } from 'express';

declare module 'express-session' {
  interface SessionData {
    url?: string | null;
    token?: string | null;
  }
}

const app: Application = Express();

Mongoose.connect(process.env.MONGO_URI ?? '')
	.then(() => {
		console.log('Connected to database');
	})
	.catch((err) => {
		console.log(err);
	});

app.use(
	ExpressSession({
		resave: true,
		saveUninitialized: false,
		secret: process.env.SESSION_SECRET ?? '',
		cookie: {
			maxAge: 60000,
		},
	}),
);

app.use(
	Express.urlencoded({
		extended: false,
	}),
);

app.use(Express.json());
app.use(Express.static(__dirname + '/public'));

app.get('/', (req: Request, res: Response) => {
	res.sendFile(__dirname + '/public/index.html');
});

app.post('/shorten', async (req: Request, res: Response) => {
	if (!req.body.long || !req.body.token) {
		return res.redirect('/');
	}

	const token: string = req.body.token;
	const destinationURL: string = req.body.long;

	const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${token}`;

	const response = await Axios.post(url, {
		token,
		secret: process.env.RECAPTCHA_SECRET,
	});

	if (!response.data.success) {
		return res.redirect('/');
	}

	const URLtoLookUp: URLDocument | null = await URLSchema.findOne({ destinationURL });

	if (URLtoLookUp) {
		return res.send({ success: true, shortURL: `${URLtoLookUp.shortURL}` });
	}

	const generateShortURL = (num: number): string => {
		const zeroWidth: string[] = ['\u200c', '\u200d'];
		let result = '';
		for (let i = 1; i <= num; i++) {
			result += zeroWidth[Math.floor(Math.random() * zeroWidth.length)];
		}
		return result + '🙄';
	};

	const shortURL: string = generateShortURL(10);

	await URLSchema.create({
		shortURL,
		destinationURL,
	});

	return res.send({ success: true, shortURL: `${shortURL}` });
});

app.get('/:slug', async (req: Request, res: Response) => {
	const shortURL: string = req.params.slug;
	const URLtoLookUp: URLDocument | null = await URLSchema.findOne({ shortURL });

	if (!URLtoLookUp) {
		return res.redirect('/');
	}

	res.status(301).redirect(URLtoLookUp.destinationURL);
});

app.listen(3000, () => {
	console.log('Listening on port 3000');
});
