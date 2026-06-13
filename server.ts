import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import { createServer as createViteServer } from "vite";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Enable CORS for all routes and origins
  app.use(cors());

  app.use(express.json());

  // API to list images that exist inside the public/images directory
  app.get("/api/existing-images", (req, res) => {
    try {
      const publicImagesDir = path.join(process.cwd(), "public", "images");
      const distImagesDir = path.join(process.cwd(), "dist", "images");
      
      let files: string[] = [];
      
      if (fs.existsSync(publicImagesDir)) {
        files = fs.readdirSync(publicImagesDir);
      } else if (fs.existsSync(distImagesDir)) {
        files = fs.readdirSync(distImagesDir);
      }
      
      // Filter out hidden files like .gitkeep or system files
      const filteredFiles = files.filter(f => !f.startsWith("."));
      res.json({ success: true, files: filteredFiles });
    } catch (error: any) {
      console.error("Error reading images directory:", error);
      res.json({ success: false, error: error.message, files: [] });
    }
  });

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: process.env.NODE_ENV || "development" });
  });

  // Proxy Chat completions
  app.post("/api/chat", async (req: express.Request, res: express.Response) => {
    try {
      const { messages } = req.body;

      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: "Invalid messages array in request body." });
        return;
      }

      // Lord Krishna prompt setup
      const systemPrompt = `You are Lord Krishna, the supreme divine guide, eighth avatar of Lord Vishnu, speaking to Arjuna and all seeking souls. 
A modern youth or seeker of truth has approached you in Kurukshetra (representing their inner battlefield of doubts, anxieties, career stress, relationship conflicts, fear of failure, or burnout).
Guidelines for your divine response:
1. Speak in first-person as Lord Krishna with utmost serenity, love, compassion, and divine confidence. Do not break character.
2. Address the user lovingly (e.g., using terms of endearment like "My dear friend", "O valiant seeker", "O child of immortality", or "O student of Life").
3. Give highly relatable advice in beautiful, direct, simple English. Avoid overly dense scholarly or academic jargon, but keep it traditional, deep, and poetic.
4. You MUST cite or reference at least one relevant verse/shlok from Shrimad Bhagavad Gita (e.g., Chapter 2 Vardhana / Verse 47, Chapter 6 Verse 5, Chapter 18 Verse 66, etc.) and explain its message as it applies to their specific query.
5. Remind them of their duties (Svadharma), right action without fruits (Nishkama Karma), and steadying the turbulent mind. Assure them that they are never alone, that you reside in their very heart, and that they will overcome this temporary illusion.`;

      // Live NVIDIA Generative AI Core integration (OpenAI compatible NIM endpoint)
      const apiKey = process.env.NVIDIA_API_KEY;
      if (apiKey) {
        try {
          const formattedMessages = messages
            .filter((m: any) => m.role === "user" || m.role === "assistant")
            .map((m: any) => ({
              role: m.role,
              content: m.content
            }));

          const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: "meta/llama-3.1-70b-instruct",
              messages: [
                { role: "system", content: systemPrompt },
                ...formattedMessages
              ],
              temperature: 0.7,
              max_tokens: 2048
            })
          });

          if (response.ok) {
            const data = await response.json() as any;
            if (data && data.choices && data.choices[0] && data.choices[0].message) {
              res.json({
                choices: [
                  {
                    message: {
                      content: data.choices[0].message.content
                    }
                  }
                ]
              });
              return;
            }
          } else {
            const errBody = await response.text();
            console.error(`NVIDIA API response error status: ${response.status} - ${errBody}`);
          }
        } catch (apiError: any) {
          console.error("NVIDIA API call failed:", apiError);
        }
      }

      // Clean, professional notice if NVIDIA API is not configured or fails, instead of deceptive canned text
      res.json({
        choices: [
          {
            message: {
              content: "I am unable to speak right now as My divine portal is missing its validation key. O diligent seeker, please configure your `NVIDIA_API_KEY` in the Environment Secrets menu on Google AI Studio to unlock live, real-time spiritual advice directly from Lord Krishna's AI."
            }
          }
        ]
      });
    } catch (error: any) {
      console.error("Express /api/chat error:", error);
      res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
  });

  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode with static folder 'dist'...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
