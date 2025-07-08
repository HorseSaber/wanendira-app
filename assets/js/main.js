// main.js - FASE 3 FINAL (Menggunakan fetch dengan model yang ditemukan)

function getPathPrefixForMain() {
    const depth = (window.location.pathname.match(/\//g) || []).length - 1;
    if (depth <= 0) return './';
    return '../'.repeat(depth);
}

function setActiveLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPagePath = window.location.pathname;
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPath = new URL(link.href).pathname;
        if (currentPagePath === linkPath) {
            link.classList.add('active');
        }
    });
    const isAppHomepage = currentPagePath.endsWith('/app.html') || currentPagePath.endsWith('/');
    if (isAppHomepage) {
        const homeLink = document.querySelector(`a[href$="app.html"]`);
        if (homeLink) homeLink.classList.add('active');
    }
}

function buildPrompt() {
    const kutipanInput = document.getElementById('kutipan-input').value;
    const gayaBahasaSelect = document.getElementById('gaya-bahasa-select');
    const gayaVisualSelect = document.getElementById('gaya-visual-select');
    const gayaBahasa = gayaBahasaSelect.options[gayaBahasaSelect.selectedIndex].text;
    const gayaVisual = gayaVisualSelect.options[gayaVisualSelect.selectedIndex].text;

    if (kutipanInput.trim() === '') {
        alert('Kolom kutipan atau ide tidak boleh kosong!');
        return null;
    }

    return `
Anda adalah seorang ahli pembuat konten dan penulis skrip video viral untuk YouTube Shorts.
Tugas Anda adalah mengubah sebuah kutipan atau ide menjadi sebuah skrip video pendek (60 detik) yang lengkap dan teroptimasi.

**Input dari Pengguna:**
*   **Kutipan/Ide Utama:** "${kutipanInput}"
*   **Gaya Bahasa Narasi yang Diinginkan:** "${gayaBahasa}"
*   **Gaya Visual yang Diinginkan:** "${gayaVisual}"

**Instruksi Output:**
Hasilkan output dalam format JSON yang valid dan hanya JSON saja, tanpa tambahan teks atau format markdown. JSON harus memiliki struktur sebagai berikut:
{
  "judul": "Judul video pendek yang kuat, tegas, dan mencuri perhatian. Maksimal 70 karakter.",
  "deskripsi": "Deskripsi singkat yang mengandung ketegasan, daya tarik pria dewasa, serta mengajak penonton berpikir dan berinteraksi. Gunakan bahasa langsung dan ajakan penuh wibawa. Maksimal 300 karakter.",
  "hashtag": "#maskulin #mindsetlelaki #alphaenergy #shorts #wibawa",
  "tags": "maskulinitas, pria berkelas, mindset alpha, pengembangan diri pria, ketegasan hidup, video inspirasi pendek, energi dominan",
  "ide_thumbnail": "Jangan Hidup Jadi Lemah!",
  "narasi_segmen": [
    { "segmen": "SEGMENT 01: HOOK MASKULIN", "durasi": "0-5s", "narasi_teks": "Kalo lo masih mikir semua orang bakal ngerti lo... lo salah besar.", "visual_prompt": "Pria dewasa berdiri sendirian di rooftop malam hari, city lights di belakang, tatapan tajam. Gaya visual '${gayaVisual}' dengan pencahayaan kontras dan nuansa dominan." },
    { "segmen": "SEGMENT 02: SETUP REALITA KEHIDUPAN", "durasi": "6-10s", "narasi_teks": "Nggak semua orang akan ngerti perjuangan lo. Dan lo gak butuh validasi itu.", "visual_prompt": "Lelaki berjalan perlahan di lorong sepi, tangan di saku, siluet tubuh tegap. Tone gelap, elegan." },
    { "segmen": "SEGMENT 03: PERNYATAAN PRINSIP", "durasi": "11-17s", "narasi_teks": "Lo hidup bukan buat nyenengin semua orang. Lo hidup buat jadi versi terbaik diri lo.", "visual_prompt": "Close-up tatapan fokus pria di depan cermin. Refleksi dirinya tampak lebih tegas dan dominan." },
    { "segmen": "SEGMENT 04: KONFLIK BATIN PRIA MODERN", "durasi": "18-25s", "narasi_teks": "Banyak pria kehilangan arah cuma karena pengakuan dari orang yang gak penting.", "visual_prompt": "Suasana meja kerja malam hari, pria menatap layar kosong, lampu remang, wajah lelah tapi tertahan." },
    { "segmen": "SEGMENT 05: MOMEN PENCERAHAN", "durasi": "26-33s", "narasi_teks": "Waktu lo sadar... hidup itu soal kontrol diri. Lo menang saat lo berhenti cari pengakuan.", "visual_prompt": "Langkah kaki perlahan menuju cahaya pagi. Pria bangkit dari duduk dengan ekspresi mantap." },
    { "segmen": "SEGMENT 06: KODE HIDUP PRIA KUAT", "durasi": "34-43s", "narasi_teks": "Laki-laki sejati itu tenang... bukan karena dia gak punya masalah. Tapi karena dia tau cara ngadepin semua itu.", "visual_prompt": "Visual simbolik pria berdiri tegak di tepi jurang pegunungan, angin meniup jaketnya, latar matahari terbit." },
    { "segmen": "SEGMENT 07: JAB PERINGATAN", "durasi": "44-52s", "narasi_teks": "Lo punya dua pilihan: dikendalikan dunia... atau lo yang kendaliin hidup lo. Pilihannya cuma itu.", "visual_prompt": "Transisi cepat dari layar gelap ke sorotan wajah tegas dan fokus. Suasana intens." },
    { "segmen": "SEGMENT 08: CLOSING & COMMAND", "durasi": "53-60s", "narasi_teks": "Subscribe kalo lo pria yang siap ngelangkah tanpa keraguan. Karena dunia ini gak ngasih ruang buat yang setengah-setengah.", "visual_prompt": "Animasi tombol subscribe bergaya elegan maskulin, disertai logo channel dengan efek ledakan kecil." }
  ]
}
    `.trim();
}

function displayResults(data) {
    const outputWrapper = document.getElementById('output-wrapper');
    const outputPlaceholder = document.getElementById('output-placeholder');
    
    document.getElementById('output-judul').innerText = data.judul || '';
    document.getElementById('output-deskripsi').innerText = data.deskripsi || '';
    document.getElementById('output-hashtag').innerText = data.hashtag || '';
    document.getElementById('output-tags').innerText = data.tags || '';
    document.getElementById('output-thumbnail').innerText = data.ide_thumbnail || '';

    const outputNarasi = document.getElementById('output-narasi');
    outputNarasi.innerHTML = '';
    if (data.narasi_segmen && Array.isArray(data.narasi_segmen)) {
        data.narasi_segmen.forEach(item => {
            const segmentHTML = `<div class="segment"><div class="segment-title">${item.segmen || ''} [${item.durasi || ''}]</div><div class="segment-narasi" contenteditable="true">${item.narasi_teks || ''}</div><div class="segment-prompt" contenteditable="true">${item.visual_prompt || ''}</div></div>`;
            outputNarasi.innerHTML += segmentHTML;
        });
    }
    
    outputPlaceholder.style.display = 'none';
    outputWrapper.style.display = 'flex';
}

function generateTextForExport() {
    const judul = document.getElementById('output-judul').innerText;
    const deskripsi = document.getElementById('output-deskripsi').innerText;
    const hashtag = document.getElementById('output-hashtag').innerText;
    const tags = document.getElementById('output-tags').innerText;
    const thumbnail = document.getElementById('output-thumbnail').innerText;
    let narasiText = "";
    document.querySelectorAll('#output-narasi .segment').forEach(segment => {
        const title = segment.querySelector('.segment-title').innerText;
        const narasi = segment.querySelector('.segment-narasi').innerText;
        const prompt = segment.querySelector('.segment-prompt').innerText;
        narasiText += `${title}\nNarasi: ${narasi}\nVisual Prompt: ${prompt}\n\n`;
    });
    return `--- JUDUL ---\n${judul}\n\n--- DESKRIPSI ---\n${deskripsi}\n\n--- HASHTAG ---\n${hashtag}\n\n--- TAGS ---\n${tags}\n\n--- IDE THUMBNAIL ---\n${thumbnail}\n\n--- NARASI & PROMPT ---\n${narasiText.trim()}`.trim();
}

document.addEventListener('DOMContentLoaded', () => {

    // --- LOGIKA UI UMUM ---
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const appOverlay = document.getElementById('app-overlay');
    if (menuToggle && sidebar && appOverlay) {
        menuToggle.addEventListener('click', () => { sidebar.classList.toggle('open'); appOverlay.classList.toggle('visible'); });
        appOverlay.addEventListener('click', () => { sidebar.classList.remove('open'); appOverlay.classList.remove('visible'); });
    }
    const profileToggle = document.getElementById('user-profile-toggle');
    const profileDropdown = document.getElementById('profile-dropdown');
    if (profileToggle && profileDropdown) { profileToggle.addEventListener('click', () => { profileDropdown.classList.toggle('open'); }); }
    window.addEventListener('click', (e) => { if (profileToggle && profileDropdown && !profileToggle.contains(e.target) && !profileDropdown.contains(e.target)) { profileDropdown.classList.remove('open'); } });
    const apiKeyModal = document.getElementById('api-key-modal');
    const manageApiKeyBtn = document.getElementById('manage-api-key');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const saveApiKeyBtn = document.getElementById('save-api-key-btn');
    const apiKeyInput = document.getElementById('api-key-input');
    if (manageApiKeyBtn && apiKeyModal) {
        manageApiKeyBtn.addEventListener('click', () => {
            const savedApiKey = localStorage.getItem('geminiApiKey');
            if (savedApiKey) { apiKeyInput.value = savedApiKey; }
            apiKeyModal.classList.add('open');
        });
    }
    if (closeModalBtn && apiKeyModal) { closeModalBtn.addEventListener('click', () => apiKeyModal.classList.remove('open')); }
    if (apiKeyModal) { apiKeyModal.addEventListener('click', (e) => { if (e.target === apiKeyModal) apiKeyModal.classList.remove('open'); }); }
    if (saveApiKeyBtn && apiKeyInput) {
        saveApiKeyBtn.addEventListener('click', () => {
            const apiKey = apiKeyInput.value.trim();
            if (apiKey === '') { alert('API Key tidak boleh kosong!'); return; }
            localStorage.setItem('geminiApiKey', apiKey);
            alert('API Key berhasil disimpan!'); // Alert yang jujur
            apiKeyModal.classList.remove('open');
        });
    }
    const tabsContainer = document.querySelector('.tabs');
    if (tabsContainer) {
        const tabLinks = document.querySelectorAll('.tab-link');
        const tabContents = document.querySelectorAll('.tab-content');
        const showTab = (tabId) => { tabContents.forEach(c => c.classList.remove('active')); tabLinks.forEach(l => l.classList.remove('active')); const tc = document.getElementById(tabId); const tl = document.querySelector(`.tab-link[data-tab="${tabId}"]`); if (tc && tl) { tc.classList.add('active'); tl.classList.add('active'); } };
        const initialActiveTab = document.querySelector('.tabs .tab-link.active');
        if (initialActiveTab) { showTab(initialActiveTab.dataset.tab); }
        tabLinks.forEach(tab => { tab.addEventListener('click', () => { showTab(tab.dataset.tab); }); });
    }

    // --- LOGIKA KHUSUS HALAMAN GENERATOR ---
    const generateBtn = document.querySelector('.generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            const apiKey = localStorage.getItem('geminiApiKey');
            if (!apiKey) {
                alert('API Key belum diatur. Silakan atur di menu Pengaturan.');
                document.getElementById('api-key-modal')?.classList.add('open');
                return;
            }
            const prompt = buildPrompt();
            if (!prompt) return;

            const outputPlaceholder = document.getElementById('output-placeholder');
            const outputWrapper = document.getElementById('output-wrapper');
            
            outputPlaceholder.innerHTML = `<div class="loading-spinner"></div><p style="margin-top: 1rem; color: var(--text-secondary);">AI sedang berpikir...</p>`;
            outputPlaceholder.style.display = 'flex';
            outputWrapper.style.display = 'none';

            try {
                // Menggunakan kombinasi yang sudah kamu temukan dan terbukti berhasil
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
                
                displayResults(data);
                
            } catch (error) {
                console.error("Error saat menghubungi AI:", error);
                alert("Terjadi kesalahan: " + error.message);
                outputPlaceholder.innerHTML = `<p style="color: #ff6b6b;">Gagal. Periksa API Key atau lihat console untuk detail.</p>`;
            }
        });

        // Event Listener untuk Tombol Aksi
        const copyBtn = document.getElementById('copy-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const textToCopy = generateTextForExport();
                navigator.clipboard.writeText(textToCopy).then(() => { alert('Semua teks berhasil disalin!'); }).catch(err => { console.error('Gagal menyalin teks: ', err); alert('Gagal menyalin. Coba lagi.'); });
            });
        }
        // Tombol Download kembali ke nama ID dan teks aslinya
        const downloadBtn = document.getElementById('download-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                try {
                    const textToDownload = generateTextForExport();
                    const downloadLink = document.createElement('a');
                    downloadLink.download = 'wanendira_hasil_generate.txt';
                    const dataUri = 'data:text/plain;charset=utf-8,' + encodeURIComponent(textToDownload);
                    downloadLink.href = dataUri;
                    downloadLink.click();
                } catch (error) {
                    console.error('Gagal men-download file:', error);
                    alert('Gagal men-download file.');
                }
            });
        }
    }
});
