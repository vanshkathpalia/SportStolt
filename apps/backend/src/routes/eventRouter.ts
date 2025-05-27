import { Hono } from 'hono';
import { 
    createEventHandler,
    getBulkEventsHandler,
    registerUserHandler,
    getRegistrationsHandler,
    deleteEventHandler
 } from '../controllers/eventController';
import { authMiddleware } from '~/middleware/authMiddleware';

export const eventRouter = new Hono();

eventRouter.use('/*', authMiddleware);

eventRouter.post('/', createEventHandler); 
eventRouter.get('/bulk', getBulkEventsHandler);
eventRouter.post('/:id/register', registerUserHandler);
eventRouter.get('/:id/registrations', getRegistrationsHandler);
eventRouter.delete('/:id', deleteEventHandler);

