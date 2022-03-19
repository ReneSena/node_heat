import "dotenv/config";
import express from 'express';
import { router } from "./routes";
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors'; // validate who can access the app

const app = express();
app.use(cors());

const serverHttp = http.createServer(app); // When the server up the app to goes up too

const io = new Server(serverHttp, {
    cors: {
        origin: "*"
    }
});

io.on("connection", socket => {
    console.log(`Conected user in socket ${socket.id}`);
})

app.use(express.json());

app.use(router);

app.get('/github', (request, response) => {
    return response.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`)
});

app.get('/signin/callback', (request, response) => {
    const { code } = request.query;

    return response.json(code);
});

export { serverHttp, io };