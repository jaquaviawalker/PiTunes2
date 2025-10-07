"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PlaybackController_1 = require("../controllers/PlaybackController");
const router = express_1.default.Router();
router.post('/play', PlaybackController_1.handlePlayAlbum);
exports.default = router;
