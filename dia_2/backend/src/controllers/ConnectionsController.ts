
import {Request, Response} from 'express'

import db from '../database/connections';


export default class ConnectionsController {
    // index como um método que retorna uma lista 
    async index(request:Request, response:Response) {
        const  [{total}] = await db('connections').count('* as total');
        response.status(200).json({total});
    }

    async create(request:Request, response:Response) { 
        const { user_id }  = request.body;

        await db('connections').insert({
            user_id,
        });

        return response.status(200).send();
    }
}