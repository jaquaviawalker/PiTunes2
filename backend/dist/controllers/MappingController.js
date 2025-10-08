"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetAllMappings = handleGetAllMappings;
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
// handleCreateMapping for POST /api/mappings
//handleDeleteMapping for DELETE /api/mappings/:tagId
