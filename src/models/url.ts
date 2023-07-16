import Mongoose, { Document } from 'mongoose';

interface IURLSchema {
	shortURL: string;
	destinationURL: string;
}

export interface URLDocument extends IURLSchema, Document {}

const URLSchema = new Mongoose.Schema<IURLSchema>({
	shortURL: {
		type: String,
		required: true,
	},
	destinationURL: {
		type: String,
		required: true,
	},
});

export default Mongoose.model<URLDocument>('url', URLSchema);
