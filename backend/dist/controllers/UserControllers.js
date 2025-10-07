"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLogin = handleLogin;
exports.handleCallback = handleCallback;
function handleLogin(userAuth) {
    return (req, res) => {
        const authUrl = userAuth.startAuthFlow();
        res.redirect(authUrl);
    };
}
function handleCallback(userAuth) {
    return async (req, res) => {
        const code = req.query.code;
        if (!code) {
            res.status(400).send('Missing authorization code');
            return;
        }
        try {
            userAuth['code'] = code;
            await userAuth.authenticateWithAuthCode();
            res.send('Authorization successful!');
        }
        catch (error) {
            res.status(500).send('Authorization failed');
        }
    };
}
