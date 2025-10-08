"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const MappingController_1 = require("../controllers/MappingController");
const router = express_1.default.Router();
router.get('/mappings', MappingController_1.handleGetAllMappings);
router.delete('/mappings/:tagId', MappingController_1.handleDeleteMapping);
exports.default = router;
