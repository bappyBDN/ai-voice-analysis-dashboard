# 🎧 Real-Time AI Call Center Analytics Dashboard

> A production-ready AI-powered SaaS application that performs **real-time customer support call analysis** using **Google Gemini AI**, **Hugging Face Datasets**, and **Supabase**, providing automated sentiment analysis, quality scoring, keyword extraction, and live business analytics through an interactive dashboard.

---

## 📸 Dashboard Preview

> Replace the image path below with your actual screenshot.

![AI Call Center Dashboard](./Screenshot%202026-07-09%20203746.png)

---

# 🚀 Features

### 🎙️ Automated Audio Processing
- Automatically fetches customer support call recordings from Hugging Face Datasets.
- Processes audio asynchronously using Google Gemini AI.
- Eliminates manual intervention in the analysis workflow.

### 🤖 AI-Powered Call Analysis
Each call is analyzed to generate:

- Customer sentiment
- Agent performance score
- Call quality rating
- Emotion detection
- Key conversation topics
- Business insights
- AI-generated summary
- Keyword extraction

### 🔄 Smart Processing Queue
- Prevents duplicate processing using local tracking.
- Maintains an efficient processing pipeline.
- Supports continuous automated execution.

### ⏳ Intelligent Polling System
- Waits between **1–3 minutes** after processing a call.
- Automatically checks for newly available audio.
- Simulates a real-world streaming call center environment.

### 🛡️ Safety & Error Handling
- Gracefully handles Gemini AI safety filters.
- Logs blocked or invalid audio.
- Continues processing without interrupting the pipeline.

### 📊 Live Analytics Dashboard
Interactive dashboard displaying:

- Total processed calls
- Average quality score
- Sentiment distribution
- Agent performance
- Customer satisfaction metrics
- Keyword frequency analysis
- Recent call history

### 📄 One-Click PDF Reports
Generate professional PDF reports directly from the dashboard for sharing or business reporting.

---

# 🛠️ Tech Stack

## Backend
- FastAPI
- Python
- Uvicorn
- Google Gemini API
- Requests
- Python Dotenv

## AI & Machine Learning
- Google Gemini 1.5 Flash
- Hugging Face Datasets API

## Database
- Supabase (PostgreSQL)

## Frontend
- HTML5
- CSS3
- Vanilla JavaScript
- html2pdf.js

## Deployment
- Render Web Service (Backend)
- Render Static Site (Frontend)

---

# ⚙️ System Architecture

```text
                  Hugging Face Dataset
                          │
                          ▼
               Audio Fetching Service
                          │
                          ▼
                 FastAPI Backend Server
                          │
                          ▼
              Google Gemini 1.5 Flash AI
                          │
                          ▼
            Structured Call Analysis Output
                          │
                          ▼
             Supabase PostgreSQL Database
                          │
                          ▼
          Real-Time Analytics Dashboard
                          │
                          ▼
               PDF Report Generation
```

---

# 📂 Project Structure

```text
Voice_Call_Analysis-System/
│
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── requirements.txt
│   ├── processed_audio.json    # Duplicate tracking
│   ├── .env
│   └── ...
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   └── ...
│
└── README.md
```

---

# 🚀 Live Demo

## 🌐 Frontend Dashboard

**Live Demo**

https://ai-voice-analysis-dashboard-1.onrender.com

---

## 📘 Backend API (Swagger)

https://ai-voice-analysis-dashboard.onrender.com/docs

> **Note:** Render Free Tier services may require **30–60 seconds** to wake up after periods of inactivity.

---

# 📈 Example AI Output

```json
{
  "customer_sentiment": "Positive",
  "agent_score": 92,
  "call_quality": 89,
  "emotion": "Satisfied",
  "summary": "Customer requested account information and the issue was successfully resolved.",
  "keywords": [
    "account",
    "verification",
    "billing"
  ]
}
```

---

# 🔥 Highlights

- Production-ready FastAPI backend
- Google Gemini AI integration
- Automated audio ingestion pipeline
- Real-time analytics dashboard
- Smart duplicate detection
- AI-generated summaries
- Keyword extraction
- PDF report generation
- Responsive frontend
- Supabase cloud database
- Deployable on Render

---

# 🖥️ Local Installation

## Clone the repository

```bash
git clone https://github.com/your-username/Voice_Call_Analysis-System.git

cd Voice_Call_Analysis-System
```

---

## Backend Setup

```bash
cd backend

python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Create a `.env` file

```env
GEMINI_API_KEY=YOUR_API_KEY

SUPABASE_URL=YOUR_SUPABASE_URL

SUPABASE_KEY=YOUR_SUPABASE_KEY
```

Run the backend

```bash
uvicorn main:app --reload
```

---

## Frontend Setup

Simply open:

```text
frontend/index.html
```

or serve it using a local web server.

---

# 📊 Future Improvements

- Live microphone streaming
- WebSocket-based real-time updates
- Multi-language transcription
- Speaker diarization
- Role-based authentication
- AI-powered anomaly detection
- Admin dashboard
- Docker deployment
- Kubernetes support

---

# 👨‍💻 Author

**Bappy Chandra Debnath**

Computer Science & Engineering Student

AI Engineer | Backend Developer | FastAPI | Generative AI | RAG | LLM Applications

---

## ⭐ If you found this project useful, consider giving it a star on GitHub!
