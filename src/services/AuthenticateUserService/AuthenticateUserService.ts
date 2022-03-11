import "dotenv/config";
import axios from 'axios';
import prismaClient from '../../prisma';
import { sign } from 'jsonwebtoken';

/**
 * Receive code
 * Recover the access_token on github
 * Recover the user data
 * Verify if the user exist on DB
 * ---Yes = Generate a Token
 * ---No = Create user on DB, Generate a Token
 *
 * -> Return the Token with user infos <-
 */

interface IAcessTokenResponse {
    access_token: string;
}

interface IUserResponse {
	avatar_url: string;
	login: string;
	id: number;
	name: string;
}

class AuthenticateUserService {
    async execute(code: string) {
        const URL = "https://github.com/login/oauth/access_token";

        const { data: accessTokenResponse } = await axios.post<IAcessTokenResponse>(URL, null, {
            params: {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            headers: {
                "Accept": "application/json"
            }
        });

        const response = await axios.get<IUserResponse>('https://api.github.com/user', {
            headers: {
                authorization: `Bearer ${accessTokenResponse.access_token}`
            }
        });

		const { login, id, avatar_url, name } = response.data;

		let user = await prismaClient.user.findFirst(({
			where: {
				github_id: id
			}
		}))

		if(!user) {
			await prismaClient.user.create({
				data: {
					github_id: id,
					login,
					avatar_url,
					name
				}
			})
		}

		const secretKey = process.env.JWT_SECRET;

		// payload and secret key
		const token = sign(
			{
				user: {
					name: user?.name,
					avatar_url: user?.avatar_url,
					id: user?.id
				}
			},
			secretKey,
			{
				subject: user?.id,
				expiresIn: "1d"
			}
		);

        return { token, user };
    }
}

export { AuthenticateUserService };