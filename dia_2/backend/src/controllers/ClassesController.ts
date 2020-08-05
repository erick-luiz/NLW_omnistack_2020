
import {Request, Response} from 'express'

import db from '../database/connections';
import convertHoursToMinutes from '../utils/ConvertHourToMinutes';

interface scheduleItem {
    week_day: number, 
    from: string, 
    to: string
}

export default class ClassesController {
    // index como um método que retorna uma lista 
    async index(request:Request, response:Response) { 
        const filters = request.query;

        if(!filters.week_day || !filters.subject || !filters.time){
            return response.status(400).json({
                error: 'Missing filters to search'
            });
        }

        const timeInMinutes = convertHoursToMinutes(filters.time as string); 

        const classes = await db('classes')
            .whereExists(function() {
                this.select('class_schedule.*')
                    .from('class_schedule')
                    .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
                    .whereRaw('`class_schedule`.`week_day` = ??', [Number(filters.week_day)])
                    .whereRaw('`class_schedule`.`from` <= ??', [Number(timeInMinutes)])
                    .whereRaw('`class_schedule`.`to` > ??', [Number(timeInMinutes)])
            })
            .where('classes.subject','=',filters.subject as string)
            .join('users','classes.user_id','=','users.id')
            .select(['classes.*', 'users.*']);

            return response.status(200).json(classes);
    }



    async create(request:Request, response:Response) { 
        const {
        name, 
        avatar, 
        whatsapp, 
        bio, 
        subject, 
        cost,
        schedule
    } = request.body;

    // Usar o transactional é importante para que o commit só seja aplicado em casos que 
    // todas as operações sejam bem sucedidas
    const trx = await db.transaction();
    try {
        const [user_id] = await trx('users').insert({
            name, avatar, whatsapp, bio
        }); 

        const [class_id] = await trx('classes').insert({
            cost, subject, user_id
        });

        const classSchedule = schedule.map((item:scheduleItem) => {
        
            return {
                class_id, 
                week_day: item.week_day, 
                from: convertHoursToMinutes(item.from),
                to: convertHoursToMinutes(item.to)
            };
        });


        await trx('class_schedule').insert(classSchedule);

        trx.commit();

        return response.status(201).json({class_id, ...request.body})
    } catch(err){

        await trx.rollback();

        return response.status(400).json({
            error: 'Unexpected error while creating new class'
        });
    } 
}
}