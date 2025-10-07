"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserRouter = createUserRouter;
const UserControllers_1 = require("../controllers/UserControllers");
const UserAuth_1 = require("../src/UserAuth");
const express_1 = __importDefault(require("express"));
async function createUserRouter() {
    const router = express_1.default.Router();
    const auth = new UserAuth_1.UserAuth();
    await auth.initializeSpotifyAPI();
    router.get('/login', (0, UserControllers_1.handleLogin)(auth));
    router.get('/callback', (0, UserControllers_1.handleCallback)(auth));
    return router;
}
