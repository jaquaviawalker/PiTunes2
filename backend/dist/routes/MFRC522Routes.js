"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const MFRC522Controller_1 = require("../controllers/MFRC522Controller");
const router = express_1.default.Router();
router.post('/scan', MFRC522Controller_1.handleScanToAlbum);
exports.default = router;
