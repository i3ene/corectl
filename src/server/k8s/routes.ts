import { Router } from 'express';
import { addZone } from './controller';

export const router = Router();

router.get('/test', addZone);
