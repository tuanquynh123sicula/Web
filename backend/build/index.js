"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const data_1 = require("./data");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    credentials: true,
    origin: ['http://localhost:5173'],
}));
app.get('/api/products', (req, res) => {
    res.json(data_1.sampleProducts);
});
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`server started at http://localhost:${PORT}`);
});
