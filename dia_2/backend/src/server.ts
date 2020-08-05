import express from 'express'; 
import routes from './routes';
import cors from 'cors';

const app = express();

// como o express não entende por padrão json ele precisa aplicar isso em toda chamada 
app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(3333);