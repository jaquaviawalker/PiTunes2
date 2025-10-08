"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetAllMappings = handleGetAllMappings;
exports.handleDeleteMapping = handleDeleteMapping;
const AlbumMapping_1 = require("../src/AlbumMapping");
const logger_1 = __importDefault(require("../utils/logger"));
async function handleGetAllMappings(req, res) {
    try {
        const instance = await AlbumMapping_1.AlbumMapping.create();
        const mappings = await instance.listAllMappings();
        res.json({
            success: true,
            mappings,
        });
    }
    catch (error) {
        logger_1.default.error('Error getting album mappings', {
            error: error instanceof Error ? error.message : 'Unknown error',
        });
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}
async function handleDeleteMapping(req, res) {
    const { tagId } = req.params;
    if (!tagId) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid TagId to remove',
        });
    }
    try {
        const instance = await AlbumMapping_1.AlbumMapping.create();
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
    }
    catch (error) {
        logger_1.default.error('Error deleting mapping', {
            error: error instanceof Error ? error.message : 'Unknown error',
        });
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}
