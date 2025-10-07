"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
const MFRC522Routes_1 = __importDefault(require("./routes/MFRC522Routes"));
const PlaybackRoutes_1 = __importDefault(require("./routes/PlaybackRoutes"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/api', UserRoutes_1.default);
app.use('/api', MFRC522Routes_1.default);
app.use('/api', PlaybackRoutes_1.default);
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
