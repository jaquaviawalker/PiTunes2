"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLogin = handleLogin;
exports.handleCallback = handleCallback;
const UserAuth_1 = require("../src/UserAuth");
const logger_1 = __importDefault(require("../utils/logger"));
function handleLogin(req, res) {
    const client = new UserAuth_1.UserAuth();
    const authUrl = client.startAuthFlow();
    res.redirect(authUrl);
}
async function handleCallback(req, res) {
    const code = req.query.code;
    if (!code) {
        res.status(400).send('Missing authorization code');
        return;
    }
    try {
        const client = new UserAuth_1.UserAuth();
        client['code'] = code;
        await client.authenticateWithAuthCode();
        res.send('Authorization successful!');
    }
    catch (error) {
        logger_1.default.error('Error during authentication', { error });
        res.status(500).send('Authentication failed');
    }
}
