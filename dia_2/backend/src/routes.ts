import express, { response } from 'express'; 
import ClassesController from './controllers/ClassesController';
import ConnectionsController from './controllers/ConnectionsController';

const routes = express.Router(); 

const classesController = new ClassesController();
const connectionsController = new ConnectionsController();

routes.post('/classes', classesController.create);
routes.get('/classes', classesController.index);

routes.post('/conections', connectionsController.create);
routes.get('/conections', connectionsController.index)

export default routes;