"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserRoutes_1 = require("./routes/UserRoutes"); // Note the .js extension for ES modules
const app = (0, express_1.default)();
const port = 5000;
app.get('/', (req, res) => {
    res.send('Hello World!');
});
async function main() {
    const userRouter = await (0, UserRoutes_1.createUserRouter)();
    app.use('/api', userRouter);
    app.listen(port, () => {
        console.log(`Server listening at http://localhost:${port}`);
    });
}
main().catch((err) => {
    console.error('Failed to start server:', err);
});
