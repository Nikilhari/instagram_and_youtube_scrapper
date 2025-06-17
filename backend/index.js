import express from "express";
import cors from "cors";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import { createReadStream, unlink } from "fs";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execAsync = promisify(exec);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("YouTube Downloader API using yt-dlp");
});


app.post("/download", async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    const videoId = randomUUID();
    const outputPath = path.join(__dirname, `${videoId}.mp4`);

    try {
        await execAsync(`yt-dlp -f best -o "${outputPath}" "${url}"`);

        res.setHeader("Content-Disposition", `attachment; filename="video.mp4"`);
        res.setHeader("Content-Type", "video/mp4");

        const readStream = createReadStream(outputPath);
        readStream.pipe(res);

        readStream.on("close", () => {
            unlink(outputPath, () => { });
        });

    } catch (error) {
        console.error("yt-dlp download error:", error.stderr || error.message);
        res.status(500).json({ error: "Failed to download video" });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
