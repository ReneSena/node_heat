import axios from 'axios';

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

        const response = await axios.get('https://api.github.com/user', {
            headers: {
                authorization: `Bearer ${accessTokenResponse.access_token}`
            }
        });

        return response.data;
    }
}

export { AuthenticateUserService };