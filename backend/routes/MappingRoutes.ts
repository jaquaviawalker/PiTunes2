import express from 'express';
import {
  handleGetAllMappings,
  handleDeleteMapping,
} from '../controllers/MappingController';

const router = express.Router();

router.get('/mappings', handleGetAllMappings);
router.delete('/mappings/:tagId', handleDeleteMapping);

export default router;
