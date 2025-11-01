"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log("🟢 server.ts started executing...");
var express_1 = require("express");
var cors_1 = require("cors");
var body_parser_1 = require("body-parser");
var mongoose_1 = require("mongoose");
var dotenv_1 = require("dotenv");
console.log("🟢 All modules imported successfully...");
dotenv_1.default.config();
console.log("🟢 Environment variables loaded...");
console.log("MONGO_URI:", process.env.MONGO_URI ? "✅ Loaded" : "❌ Missing");
var app = (0, express_1.default)();
var PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
console.log("🟢 Middleware initialized...");
// === MongoDB Connection ===
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(function () { return console.log("✅ MongoDB connected successfully"); })
    .catch(function (err) {
    console.error("❌ MongoDB connection error:", err);
});
// === Test Route ===
app.get("/", function (req, res) {
    res.send("🚀 Backend API is running successfully!");
});
// === Start Server ===
app.listen(PORT, function () {
    console.log("\u2705 Server running on http://localhost:".concat(PORT));
});
