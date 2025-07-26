"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const medication_routes_1 = __importDefault(require("./routes/medication.routes"));
const appoitment_routes_1 = __importDefault(require("./routes/appoitment.routes"));
const symptom_routes_1 = __importDefault(require("./routes/symptom.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const mood_routes_1 = __importDefault(require("./routes/mood.routes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
// Routes
app.use("/users", user_routes_1.default);
app.use("/medications", medication_routes_1.default);
app.use("/appointments", appoitment_routes_1.default);
app.use("/symptoms", symptom_routes_1.default);
app.use("/login", auth_routes_1.default);
app.use("/moods", mood_routes_1.default);
app.get("/", (_req, res) => {
    res.send("OncoTrack API is running");
});
app.listen(3000, "0.0.0.0", () => {
    console.log("Servidor rodando em http://192.168.15.119:3000");
});
