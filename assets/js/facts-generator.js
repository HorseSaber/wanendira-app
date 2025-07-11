// facts-generator.js - Modul khusus untuk Facts Generator

function buildFactsPrompt() {
    const topicInput = document.getElementById('facts-topic').value;
    const factsCount = document.getElementById('facts-count').value;
    const factsStyle = document.getElementById('facts-style').value;
    const targetAudience = document.getElementById('target-audience').value;

    if (topicInput.trim() === '') {
        alert('Kolom topik tidak boleh kosong!');
        return null;
    }

    return `
Anda adalah seorang content creator ahli yang spesialis membuat konten fakta menarik dan viral.
Tugas Anda adalah menghasilkan daftar fakta yang engaging berdasarkan topik yang diberikan.

**Input dari Pengguna:**
*   **Topik:** "${topicInput}"
*   **Jumlah Fakta:** ${factsCount}
*   **Gaya Penyampaian:** "${factsStyle}"
*   **Target Audience:** "${targetAudience}"

**Instruksi Output:**
Hasilkan output dalam format JSON yang valid:
{
  "title": "Judul konten yang menarik dan clickbait-friendly",
  "facts": [
    "Fakta 1 yang mengejutkan dan menarik",
    "Fakta 2 yang unik dan memorable",
    "... dst sesuai jumlah yang diminta"
  ],
  "closing": "Kalimat penutup yang mengajak engagement",
  "hashtags": "#faktamenarik #tahukahkamu #viral #edukasi"
}

Pastikan fakta-fakta yang dihasilkan:
1. Akurat dan dapat diverifikasi
2. Mengejutkan atau tidak umum diketahui
3. Mudah dipahami oleh target audience
4. Menarik untuk dibagikan
5. Menggunakan bahasa Indonesia yang engaging
    `.trim();
}

function displayFactsResults(data) {
    const outputWrapper = document.getElementById('facts-output-wrapper');
    const outputPlaceholder = document.getElementById('facts-output-placeholder');
    
    document.getElementById('facts-title').innerText = data.title || '';
    document.getElementById('facts-closing').innerText = data.closing || '';
    document.getElementById('facts-hashtags').innerText = data.hashtags || '';

    const factsList = document.getElementById('facts-list');
    if (data.facts && Array.isArray(data.facts)) {
        const factsHTML = data.facts.map((fact, index) => 
            `<div class="fact-item">${index + 1}. ${fact}</div>`
        ).join('');
        factsList.innerHTML = factsHTML;
    }

    outputPlaceholder.style.display = 'none';
    outputWrapper.style.display = 'flex';
}

// Event listeners untuk Facts Generator
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('generator-facts.html')) {
        
        const generateBtn = document.querySelector('.generate-btn');
        if (generateBtn) {
            generateBtn.addEventListener('click', async () => {
                const apiKey = localStorage.getItem('geminiApiKey');
                if (!apiKey) {
                    alert('API Key belum diatur. Silakan atur di menu Pengaturan.');
                    document.getElementById('api-key-modal')?.classList.add('open');
                    return;
                }

                const prompt = buildFactsPrompt();
                if (!prompt) return;

                const outputPlaceholder = document.getElementById('facts-output-placeholder');
                const outputWrapper = document.getElementById('facts-output-wrapper');
                
                outputPlaceholder.innerHTML = `<div class="loading-spinner"></div><p style="margin-top: 1rem; color: var(--text-secondary);">AI sedang mencari fakta menarik...</p>`;
                outputPlaceholder.style.display = 'flex';
                outputWrapper.style.display = 'none';

                try {
                    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent`;
                    const requestBody = { contents: [{ parts: [{ text: prompt }] }] };

                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-goog-api-key': apiKey
                        },
                        body: JSON.stringify(requestBody),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error.message || `HTTP error! Status: ${response.status}`);
                    }

                    const responseData = await response.json();
                    const text = responseData.candidates[0].content.parts[0].text;
                    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
                    const data = JSON.parse(cleanedText);
                    
                    displayFactsResults(data);
                    
                } catch (error) {
                    console.error("Error:", error);
                    alert("Terjadi kesalahan: " + error.message);
                    outputPlaceholder.innerHTML = `<p style="color: #ff6b6b;">Gagal. Periksa API Key atau coba lagi.</p>`;
                }
            });
        }
    }
});