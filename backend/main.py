from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import random
import os
import json
import requests
from dotenv import load_dotenv
import google.generativeai as genai
from supabase import create_client, Client
from datetime import datetime

load_dotenv()

supabase: Client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-2.5-flash')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

is_simulating = False
# local memory save the processed calls to avoid reprocessing the same call     
processed_calls = set()
total_api_calls = 0 # 

async def run_simulation_loop():
    global is_simulating, processed_calls
    
    api_url = "https://datasets-server.huggingface.co/rows?dataset=InfoBayAI%2FEnglish-United-Kingdom-Call-Center-Audio-Dataset-Single-Channel&config=default&split=train&offset=0&length=100"
    headers = {"Authorization": f"Bearer {os.getenv('HF_TOKEN')}"}
    
    while is_simulating:
        try:
            print("--- নতুন কলের জন্য চেক করা হচ্ছে ---")
            
            response = requests.get(api_url, headers=headers)
            if response.status_code != 200:
                await asyncio.sleep(10)
                continue
                
            data = response.json()
            rows = data.get("rows", [])
            
            # ১. পেন্ডিং কলগুলো বের করা
            pending_calls = [r["row"] for r in rows if r["row"]["audio"][0]["src"] not in processed_calls]
            
            if not pending_calls:
                print("✅ সব কল প্রসেস হয়ে গেছে! সিমুলেশন বন্ধ করা হলো।")
                is_simulating = False
                break
                
            # ২. পেন্ডিং লিস্ট থেকে দৈবচয়ন করে একটি কল নেওয়া
            selected_call = random.choice(pending_calls)
            audio_url = selected_call["audio"][0]["src"]
            
            print(f"অডিও ডাউনলোড হচ্ছে... (বাকি আছে: {len(pending_calls)} টি)")
            audio_response = requests.get(audio_url, headers=headers)
            temp_filename = f"temp_call_{random.randint(1000, 9999)}.wav"
            
            with open(temp_filename, "wb") as f:
                f.write(audio_response.content)
            
            print("অডিও AI-তে আপলোড হচ্ছে...")
            audio_file = genai.upload_file(path=temp_filename)
            
            while audio_file.state.name == "PROCESSING":
                await asyncio.sleep(2)
                audio_file = genai.get_file(audio_file.name)
            
            prompt = """
            Analyze this customer support call. Return strictly a JSON object with:
            "transcript": (Provide the full word-for-word transcript),
            "call_quality": (Briefly describe audio clarity),
            "keywords": (List any sales/support keywords used),
            "tone": (Describe agent and customer tone),
            "rating": (Give a number from 1 to 10 for the agent's performance)
            """
            
            print("AI অ্যানালাইসিস চলছে...")
            ai_response = model.generate_content(
                [prompt, audio_file],
                generation_config={"response_mime_type": "application/json"}
            )
            
            # ৩. সেফটি চেক
            if getattr(ai_response, 'prompt_feedback', None) and ai_response.prompt_feedback.block_reason:
                print(f"❌ Safety Block: AI অডিওটি ব্লক করেছে। কারণ: {ai_response.prompt_feedback.block_reason}")
            elif not ai_response.parts:
                print("❌ Empty Response: AI কোনো উত্তর দেয়নি। হয়তো অডিওতে কথা অস্পষ্ট।")
            else:
                clean_json = ai_response.text.replace("```json", "").replace("```", "").strip()
                try:
                    ai_data = json.loads(clean_json)
                    supabase.table("call_reports").insert(ai_data).execute()
                    processed_calls.add(audio_url)
                    print("✅ Successfully processed and saved the call report!")
                except json.JSONDecodeError as e:
                    print(f"❌ Gemini JSON Error: {e}")
                    print(f"👉 AI আসলে এই টেক্সটটি পাঠিয়েছিল:\n{clean_json}")

            # ৪. ক্লিনআপ
            if os.path.exists(temp_filename):
                os.remove(temp_filename)
            genai.delete_file(audio_file.name)
            
        except Exception as e:
            print(f"❌ Error during simulation: {e}")

        # ৫. লুপ কন্ট্রোল এবং ব্রেক
        if not is_simulating:
            print("Simulation stopped!")
            break
            
        wait_time = random.randint(60, 180) 
        print(f"wait {wait_time // 60} min {wait_time % 60} sec for next call..\n")
        await asyncio.sleep(wait_time)

@app.post("/api/simulation/toggle")
async def toggle_simulation(background_tasks: BackgroundTasks):
    global is_simulating
    is_simulating = not is_simulating
    
    if is_simulating:
        background_tasks.add_task(run_simulation_loop)
        return {"status": "Simulation Started", "is_running": True}
    else:
        return {"status": "Simulation Stopped", "is_running": False}

@app.get("/api/calls")
async def get_calls():
    try:
        response = supabase.table("call_reports").select("*").order("created_at", desc=True).execute()
        return {"data": response.data}
    except Exception as e:
        return {"data": []}

# 4.new api for the frontend to get the simulation stats
@app.get("/api/stats")
async def get_stats():
    completed = len(processed_calls)
    waiting = total_api_calls - completed
    return {
        "completed": completed,
        "waiting": waiting if waiting > 0 else 0,
        "is_running": is_simulating
    }