import { AlbumMapping } from '../src/AlbumMapping';
import logger from '../utils/logger';
import { Response, Request } from 'express';

export async function handleGetAllMappings(req: Request, res: Response) {
  try {
    const instance = await AlbumMapping.create();
    const mappings = await instance.listAllMappings();
    res.json({
      success: true,
      mappings,
    });
  } catch (error) {
    logger.error('Error getting album mappings', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
// handleCreateMapping for POST /api/mappings
//handleDeleteMapping for DELETE /api/mappings/:tagId
