const toggleBtn = document.getElementById('toggleBtn');
const callList = document.getElementById('callList');
const completedCount = document.getElementById('completedCount');
const waitingCount = document.getElementById('waitingCount');
const simStatusText = document.getElementById('simStatusText');

// একদম শুরুতে থাকা Variable-গুলোর নিচে এই নতুন ৩টি লাইন যুক্ত করুন:
const logBoxContainer = document.getElementById('logBoxContainer');
const logBox = document.getElementById('logBox');
let logInterval = null;

let isSimulating = false;
const API_BASE_URL = 'https://ai-voice-analysis-dashboard.onrender.com';

// ডাটা এবং স্ট্যাটাস আনার ফাংশন
async function fetchData() {
    try {
        // Stats কল করা
        const statsRes = await fetch(`${API_BASE_URL}/api/stats`);
        const stats = await statsRes.json();
        
        completedCount.innerText = stats.completed;
        waitingCount.innerText = stats.waiting;
        isSimulating = stats.is_running;
        
        updateButtonUI();

        // Calls ডাটা কল করা
        const callsRes = await fetch(`${API_BASE_URL}/api/calls`);
        const callData = await callsRes.json();
        
        if (callData.data && callData.data.length > 0) {
            displayCallsTable(callData.data);
        } else {
            callList.innerHTML = "<tr><td colspan='5' style='text-align:center;'>No calls analyzed yet.</td></tr>";
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}



// লগ মেসেজগুলোর একটি তালিকা
const logMessages = [
    "Checking for new audio in Hugging Face dataset...",
    "Downloading customer call audio...",
    "Passing voice record to Gemini AI...",
    "AI is reading and processing audio data...",
    "Analyzing tone, call quality, and keywords...",
    "Extracting full transcript...",
    "Saving AI report to Supabase database...",
    "Process complete! Waiting for the next call..."
];



// টেবিলে ডাটা দেখানোর ফাংশন
function displayCallsTable(calls) {
    let htmlContent = "";
    
    calls.forEach(call => {
        // টাইম ফরমেটিং
        const date = new Date(call.created_at).toLocaleString();
        
        htmlContent += `
            <tr>
                <td>${date}</td>
                <td><strong><span style="color: ${call.rating >= 7 ? 'green' : 'red'}; font-size:18px;">${call.rating}/10</span></strong></td>
                <td>${call.call_quality}</td>
                <td>${call.tone}</td>
                <td>
                    <div style="font-size: 13px; max-height: 80px; overflow-y: auto; background: #f4f4f4; padding: 5px; border-radius: 4px;">
                        <strong>Keywords:</strong> ${call.keywords}<br>
                        <strong>Transcript:</strong> ${call.transcript}
                    </div>
                </td>
            </tr>
        `;
    });
    
    callList.innerHTML = htmlContent;
}

// সিমুলেশন টগল ফাংশন
async function toggleSimulation() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/simulation/toggle`, { method: 'POST' });
        const data = await response.json();
        isSimulating = data.is_running;
        updateButtonUI();
    } catch (error) {
        alert("Failed to connect to simulation server.");
    }
}

function updateButtonUI() {
    if (isSimulating) {
        toggleBtn.textContent = "⏹ Stop Live Simulation";
        toggleBtn.className = "btn-stop";
        simStatusText.innerHTML = "🟢 RUNNING";
        if (!logInterval) startSimulatedLogs(); // লগ শুরু করবে
    } else {
        toggleBtn.textContent = "▶ Start Live Simulation";
        toggleBtn.className = "btn-start";
        simStatusText.innerHTML = "🔴 OFF";
        stopSimulatedLogs(); // লগ বন্ধ করবে
    }
}

// লগ বক্সে লেখা যুক্ত করার ফাংশন
function addLog(message) {
    const time = new Date().toLocaleTimeString();
    logBox.innerHTML += `<p>[${time}] > ${message}</p>`;
    logBox.scrollTop = logBox.scrollHeight; // স্বয়ংক্রিয়ভাবে নিচে স্ক্রল করবে
}

// লগ এনিমেশন শুরু করার ফাংশন
function startSimulatedLogs() {
    logBoxContainer.style.display = 'block';
    let step = 0;
    
    logBox.innerHTML = '<p>> Simulation Engine Started...</p>';
    
    logInterval = setInterval(() => {
        if (!isSimulating) {
            clearInterval(logInterval);
            return;
        }
        
        addLog(logMessages[step]);
        step++;
        
        // সব মেসেজ দেখানো হলে আবার প্রথম থেকে শুরু করবে
        if (step >= logMessages.length) {
            step = 0; 
        }
    }, 4500); // প্রতি ৪.৫ সেকেন্ড পরপর একটি নতুন লগ আসবে
}

// লগ বন্ধ করার ফাংশন
function stopSimulatedLogs() {
    if (logInterval) {
        clearInterval(logInterval);
        logInterval = null;
    }
    addLog("Simulation stopped by user. Engine turned off.");
}

function downloadAllReportsPDF() {
    const element = document.getElementById('reportData');
    const opt = {
      margin:       0.3,
      filename:     'AI_Call_Reports.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' } // ল্যান্ডস্কেপ মোড টেবিলের জন্য ভালো
    };
    html2pdf().set(opt).from(element).save();
}

// পেজ লোড হলে কল হবে এবং প্রতি ১০ সেকেন্ড পর পর রিফ্রেশ হবে
fetchData();
setInterval(fetchData, 10000);