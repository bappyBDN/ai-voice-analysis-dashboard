# Real-Time AI Call Center Analytics Dashboard

A full-stack, production-ready AI SaaS application that performs real-time audio analysis of customer support calls using **Google Gemini AI** and **Hugging Face Datasets**, with data persistence managed via **Supabase**.



## 🌟 Features
* **Automated Audio Pipeline:** Fetches audio datasets from Hugging Face, uploads and processes them asynchronously via Gemini.
* **Smart Queue & Deduplication:** Tracks processed audio locally to prevent duplicate processing.
* **Intelligent Gaps:** Automatically pauses between 1 to 3 minutes post-analysis to check for incoming calls.
* **Safety Filter Integration:** Handles and bypasses/logs safety blocks for anomalous audio content gracefully.
* **Live Analytics & Reporting:** Real-time dashboard displaying call metrics, tone, quality ratings, and keyword breakdowns with 1-click PDF export functionality.

---

## 🛠️ Tech Stack
* **Backend:** FastAPI, Python, Uvicorn, Google GenAI SDK (`google-generativeai`), Requests, Python-Dotenv
* **Database & Cloud:** Supabase (PostgreSQL)
* **AI Engine:** Google Gemini 1.5 Flash
* **Dataset Provider:** Hugging Face Datasets Server
* **Frontend:** Vanilla JavaScript, HTML5, CSS3, `html2pdf.js` for report generation
* **Deployment:** Render (Web Service for Backend, Static Site for Frontend)

---

## 🚀 Live Demo URLs
* **Frontend Dashboard:** [https://ai-voice-analysis-dashboard-1.onrender.com](https://ai-voice-analysis-dashboard-1.onrender.com)
* **Backend API Docs (Swagger UI):** [https://ai-voice-analysis-dashboard.onrender.com/docs](https://ai-voice-analysis-dashboard.onrender.com/docs) *(Note: Free tier instances on Render may take ~50 seconds to spin up on initial cold start)*

---

## 📂 Project Structure
```text
Voice_Call_Analysis-System/
├── backend/
│   ├── main.py              # FastAPI core logic & simulation loop
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment variables (Local only)
└── frontend/
    ├── index.html           # Main dashboard UI
    ├── style.css            # Custom responsive styles
    └── app.js               # Frontend fetch and rendering logic
