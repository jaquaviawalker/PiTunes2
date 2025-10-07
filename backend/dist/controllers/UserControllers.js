"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLogin = handleLogin;
exports.handleCallback = handleCallback;
const UserAuth_1 = require("../src/UserAuth");
function handleLogin(req, res) {
    const auth = new UserAuth_1.UserAuth();
    const authUrl = auth.startAuthFlow();
    res.redirect(authUrl);
}
async function handleCallback(req, res) {
    const code = req.query.code;
    if (!code) {
        res.status(400).send('Missing authorization code');
        return;
    }
    try {
        const auth = new UserAuth_1.UserAuth();
        auth.setCode(code);
        await auth.authenticateWithAuthCode();
        res.send('Authorization successful!');
    }
    catch (error) {
        res.status(500).send('Authorization failed');
    }
}
