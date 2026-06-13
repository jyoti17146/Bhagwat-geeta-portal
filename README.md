# Shrimad Bhagavad Gita Portal & Divine AI Counsel

Welcome! This repository hosts the **Shrimad Bhagavad Gita Portal**, an elegant full-stack application crafted specifically to bridge timeless Hindu spiritual wisdom with the modern seeker. It features translation overlays, comprehensive verse catalogs, and a real-time conversational chat messenger powered by **NVIDIA's Llama-3.1 NIM** endpoints.

This guide is written in clear, simple language so that absolute beginners, tech enthusiasts, or content managers can easily modify the portal, add content, change translations, or customize the AI assistant.

---

## 🗺️ Project File Structure Overview

Understanding where everything lives is the first step to making updates. Here is a directory tree of the key files in this project:

```text
├── .env.example              # Template for configuring secrets (e.g., NVIDIA_API_KEY, APP_URL)
├── .gitignore                # Rules for excluding secondary/temporary files from git
├── README.md                 # This documentation file
├── index.html                # Entry web page template for the client browser
├── metadata.json             # Applet branding and capability settings
├── package.json              # App dependencies, libraries, and script routines
├── server.ts                 # Full-stack backend Express server (handles routing, images, & AI proxies)
├── tsconfig.json             # Core settings for TypeScript type validation
├── vite.config.ts            # Configuration for the Vite compiler and hot-reload tooling
├── public/                   # Static public assets (sounds, logo icons, etc.)
│   └── images/               # Directory containing photographs of Gita warriors/legends
└── src/                      # Source code of the interactive front-end application
    ├── main.tsx              # React mounting entry-point
    ├── index.css             # Global Tailwind CSS stylesheet containing Google Translate overrides
    ├── App.tsx               # Main application controller (houses dashboards, state, and chatbot UI)
    └── components/           # Extracted modular elements to keep the code clean
        ├── LanguageSelector.tsx # Translation wrapper matching with Google Translate API
        └── LegendAvatar.tsx     # Smart avatar component displaying image matches or Facebook half-donut vectors
```

---

## 📂 Detailed File-by-File Guide

### 1. Backend Server (`/server.ts`)
Creates a full-stack Node server using **Express.js**.
- **Port:** Configured to bind exclusively to port `3000` to stream through the platform's ingress proxy.
- **Vite Integration:** Dynamically hooks in the Vite middleware for quick reload during browser testing.
- **AI Router (`/api/chat`):** Exposes a POST endpoint. If an `NVIDIA_API_KEY` exists, it makes a native HTTPS request to NVIDIA's NIM api hosting `meta/llama-3.1-70b-instruct`. If absent (or fails), it safely returns a helpful advice card guiding configuration.

### 2. Main Interface (`/src/App.tsx`)
The heart of the client application.
- Contains state hooks for logged-in users, guests, verse filters, reading history, and chat window toggle.
- Contains the `sendMessageToKrishna` function which sends messages to `/api/chat` and processes responses.
- Renders the responsive dashboard sidebar, verse cards, translation blocks, and the collapsible "Divine AI Counsel" chat panel.

### 3. Smart Avatar Renderer (`/src/components/LegendAvatar.tsx`)
Handles the rendering of photos of historical personalities or deities.
- Feeds off the `/api/existing-images` server endpoint to list local JPGs/PNGs safely.
- If a matching image file exists (matching the character's lowercase name), it renders that image.
- **Facebook Donut Fallback:** If can't find a matching file, it draws a scalable vector (SVG) outline of a "half-donut" placeholder avatar reminiscent of modern social network layouts.

### 4. Language Translator (`/src/components/LanguageSelector.tsx`)
Maintains global reach by letting users switch language on the fly.
- Embeds Google's translation widgets seamlessly.
- Allows dropdown switches that trigger custom translation runs on current webpage nodes dynamically.

### 5. Stylesheet (`/src/index.css`)
- Includes custom layout rules and hides visual noise of default Google widgets to maintain look-and-feel consistency.

---

## 🛠️ Step-by-Step Customization Cookbooks

Follow these simple walkthroughs to update or change features ourselves!

### Recipe A: Adding new Images for Gita Characters and Heroes
If a character doesn't have an image, they will default to the Facebook-style "half-donut" silhouette. To add a custom image for a character:
1. Obtain the image file (preferably a square crop in `.jpg` or `.png` format).
2. Rename the file to match the lowercased, spaces-removed name of the character (e.g. if the character name is `"Lord Krishna"`, name your image `lordkrishna.png`).
3. Place the file inside the `/public/images/` path.
4. Refresh your browser! The system automatically scans the directory and uses the image instead of the half-donut vector.

---

### Recipe B: Modifying the AI prompt or Llama model parameters
To alter how "Lord Krishna" speaks or configure different response restrictions:
1. Open `/server.ts` using any text editor.
2. Locate the variable named `systemPrompt` (around line 58).
3. Update the text string inside. You can specify:
   - "Keep responses under 3 paragraphs."
   - "Cite at least three distinct chapters."
   - "Speak in traditional, warm tone."
4. If you want to use a different Llama/Mistral model, find the `model:` selector inside the NVIDIA fetch options (around line 85) and replace `"meta/llama-3.1-70b-instruct"` with another available model tag (e.g., `"meta/llama-3.3-70b-instruct"`).
5. Restart your dev server to load the new backend parameters.

---

### Recipe C: Setting up the NVIDIA API Key
By default, if the API key environment variable is not defined, the portal will warn you that your credential is unconfigured. To activate live generation:
1. Obtain an API key from [NVIDIA Build API portal](https://build.nvidia.com/).
2. On your **AI Studio workspace**, open the **Settings** or **Secrets** dashboard on the right-hand side.
3. Add a new variable:
   - **Name:** `NVIDIA_API_KEY`
   - **Value:** *Your actual NVIDIA API key string starting with nvapi-...*
4. Restart your application. The chatbot will instantly start streaming real-time divine consciousness conversations!

---

## ⚡ Developer Execution Commands

To build and test things locally, run these quick commands in your workspace shell:

- **Run Dev Server:** Starts the full-stack system with rapid file reload in place:
  ```bash
  npm run dev
  ```
- **Lint Validation:** Inspects typing patterns and catches syntax anomalies early:
  ```bash
  npm run lint
  ```
- **Production Build:** Assembles optimization packages for fast container execution:
  ```bash
  npm run build
  ```
- **Initiate Start:** Boots up the production bundled container image:
  ```bash
  npm run start
  ```

---

## 🙏 Credits & Vision
The Bhagavad Gita Portal is built using React 18, Vite, Express, and Tailwind CSS. May seekers find peaceful answers on their battlefields of daily life!
