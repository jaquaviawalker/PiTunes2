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

//handleDeleteMapping for DELETE /api/mappings/:tagId

export async function handleDeleteMapping(req: Request, res: Response) {
  const { tagId } = req.params as { tagId: string };
  if (!tagId) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid TagId to remove',
    });
  }
  try {
    const instance = await AlbumMapping.create();
    const mappings = await instance.listAllMappings();
    const result = mappings.find((mapping) => mapping.tagId === tagId);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: `Mapping with TagId ${tagId} not found`,
      });
    }

    await instance.removeMapping(tagId); // Proceed to remove the mapping
    res.json({
      success: true,
      message: `Mapping with TagId ${tagId} successfully removed`,
    });
  } catch (error) {
    logger.error('Error deleting mapping', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
