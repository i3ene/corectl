import { Router } from 'express';
import { getCorefile } from './controller';

export const router = Router();

router.get('/corefile', getCorefile);
