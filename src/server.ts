import { serverHttp } from "./app";

serverHttp.listen(4000,
    () => console.log('Serve is running on PORT 4000'));