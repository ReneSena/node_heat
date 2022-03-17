import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

interface IPayload {
	sub: string;
}

export interface IRequestCustom extends Request {
	user_id: string
}

export function ensureAuthenticated(request: IRequestCustom, response: Response, next: NextFunction) {
	const authToken = request.headers.authorization;

	if(!authToken) {
		return response.status(401).json({
			errorCode: "token.invalid",
		});
	}

	// [0] Bearer [1] token number
	const [, token ] = authToken.split(" ");


	try {
		const { sub } = verify(token, process.env.JWT_SECRET) as IPayload;

		request.user_id = sub;

		return next();

	} catch(err) {
		return response.status(401).json({ errorCode: "token.expired" })
	}
}