import { Router } from 'express';
import { getZones } from './controller';

export const router = Router();

router.get('/zone', getZones);
