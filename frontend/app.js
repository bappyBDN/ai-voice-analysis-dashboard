const toggleBtn = document.getElementById('toggleBtn');
const callList = document.getElementById('callList');
const completedCount = document.getElementById('completedCount');
const waitingCount = document.getElementById('waitingCount');
const simStatusText = document.getElementById('simStatusText');

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
    } else {
        toggleBtn.textContent = "▶ Start Live Simulation";
        toggleBtn.className = "btn-start";
        simStatusText.innerHTML = "🔴 OFF";
    }
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