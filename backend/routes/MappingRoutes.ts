import express from 'express';
import { handleGetAllMappings } from '../controllers/MappingController';

const router = express.Router();

router.get('/mappings', handleGetAllMappings);

export default router;
