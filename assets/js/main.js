// main.js - FASE 2 FINAL (Dengan "Lihat Teks Lengkap")

const getPathPrefixForMain = () => {
    const depth = (window.location.pathname.match(/\//g) || []).length - 1;
    if (depth <= 0) return './';
    return '../'.repeat(depth);
};

function setActiveLink() {
    const pathPrefix = getPathPrefixForMain();
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

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const appOverlay = document.getElementById('app-overlay');
    if (menuToggle && sidebar && appOverlay) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            appOverlay.classList.toggle('visible');
        });
        appOverlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            appOverlay.classList.remove('visible');
        });
    }
    const tabsContainer = document.querySelector('.tabs');
    if (tabsContainer) {
        const tabLinks = document.querySelectorAll('.tab-link');
        const tabContents = document.querySelectorAll('.tab-content');
        const showTab = (tabId) => {
            tabContents.forEach(content => content.classList.remove('active'));
            tabLinks.forEach(link => link.classList.remove('active'));
            const targetContent = document.getElementById(tabId);
            const targetLink = document.querySelector(`.tab-link[data-tab="${tabId}"]`);
            if (targetContent && targetLink) {
                targetContent.classList.add('active');
                targetLink.classList.add('active');
            }
        };
        const initialActiveTab = document.querySelector('.tabs .tab-link.active');
        if (initialActiveTab) {
            showTab(initialActiveTab.dataset.tab);
        }
        tabLinks.forEach(tab => {
            tab.addEventListener('click', () => { showTab(tab.dataset.tab); });
        });
    }
    const profileToggle = document.getElementById('user-profile-toggle');
    const profileDropdown = document.getElementById('profile-dropdown');
    if (profileToggle && profileDropdown) {
        profileToggle.addEventListener('click', () => { profileDropdown.classList.toggle('open'); });
    }
    window.addEventListener('click', (e) => {
        if (profileToggle && profileDropdown && !profileToggle.contains(e.target) && !profileDropdown.contains(e.target)) {
            profileDropdown.classList.remove('open');
        }
    });
    const apiKeyModal = document.getElementById('api-key-modal');
    const manageApiKeyBtn = document.getElementById('manage-api-key');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const saveApiKeyBtn = document.getElementById('save-api-key-btn');
    const apiKeyInput = document.getElementById('api-key-input');
    if (manageApiKeyBtn && apiKeyModal) {
        manageApiKeyBtn.addEventListener('click', () => {
            apiKeyModal.classList.add('open');
            if (profileDropdown) profileDropdown.classList.remove('open');
        });
    }
    if (closeModalBtn && apiKeyModal) {
        closeModalBtn.addEventListener('click', () => apiKeyModal.classList.remove('open'));
    }
    if (apiKeyModal) {
        apiKeyModal.addEventListener('click', (e) => {
            if (e.target === apiKeyModal) apiKeyModal.classList.remove('open');
        });
    }
    if (saveApiKeyBtn && apiKeyInput) {
        saveApiKeyBtn.addEventListener('click', () => {
            const apiKey = apiKeyInput.value;
            if (apiKey.trim() === '') {
                alert('API Key tidak boleh kosong!');
            } else {
                alert('API Key "' + apiKey + '" berhasil disimpan (simulasi).');
                apiKeyModal.classList.remove('open');
            }
        });
    }
    const generateBtn = document.querySelector('.generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            const outputPlaceholder = document.getElementById('output-placeholder');
            const outputWrapper = document.getElementById('output-wrapper');
            const outputJudul = document.getElementById('output-judul');
            const outputDeskripsi = document.getElementById('output-deskripsi');
            const outputHashtag = document.getElementById('output-hashtag');
            const outputTags = document.getElementById('output-tags');
            const outputThumbnail = document.getElementById('output-thumbnail');
            const outputNarasi = document.getElementById('output-narasi');
            outputPlaceholder.innerHTML = `<div class="loading-spinner"></div>`;
            outputPlaceholder.style.display = 'flex';
            outputWrapper.style.display = 'none';
            setTimeout(() => {
                outputPlaceholder.style.display = 'none';
                const dummyData = {
                    judul: "3 Kebiasaan Pria yang Bikin Wanita Tertarik (Kamu Wajib Tahu!)",
                    deskripsi: "Pernah merasa bingung kenapa beberapa pria punya aura yang menarik? Ternyata rahasianya ada di kebiasaan sederhana setiap hari. Di video ini, kita akan bedah 3 kebiasaan pria dewasa yang tanpa sadar bikin wanita nyaman dan tertarik. Tonton sampai habis, Bro!",
                    hashtag: "#pengembangandiri #priaidaman #psikologiwanita",
                    tags: "pengembangan diri, tips pria, cara menjadi menarik, psikologi cinta, hubungan",
                    thumbnail: "PRIA INI LAKUKAN 3 HAL INI",
                    narasi: [
                        { segmen: "SEGMENT 01: HOOK", waktu: "0-5s", teks: "Bro, lu tau nggak, pria dewasa itu suka ngelakuin tiga hal ini setiap hari.", prompt: "Seorang pria keren berusia 30-an, menatap langsung ke kamera dengan senyum percaya diri, latar belakang apartemen modern yang rapi, cinematic lighting." },
                        { segmen: "SEGMENT 02: MASALAH", waktu: "5-15s", teks: "Meskipun terlihat sederhana, tapi ini yang bikin aura pria jadi beda dan banyak disukai sama cewek-cewek di sekitarnya.", prompt: "Close-up seorang wanita yang tersenyum kagum saat berbicara dengan seorang pria, soft focus, warm tones." },
                        { segmen: "SEGMENT 03: SOLUSI 1", waktu: "15-28s", teks: "Pertama, dia selalu menjaga penampilannya. Bukan soal mahal, tapi soal bersih dan rapi. Ini menunjukkan dia menghargai dirinya sendiri.", prompt: "Montage cepat: seorang pria sedang menyetrika kemeja, menyemir sepatu, dan menyisir rambutnya. Clean, sharp shots." },
                        { segmen: "SEGMENT 04: CALL TO ACTION", waktu: "28-35s", teks: "Kalau kamu mau tahu dua kebiasaan lainnya yang lebih penting, jangan lupa subscribe, Bro. Karena ini akan mengubah caramu dilihat orang.", prompt: "Animasi tombol Subscribe YouTube muncul di layar dengan suara 'klik' yang memuaskan." }
                    ]
                };
                outputJudul.innerText = dummyData.judul;
                outputDeskripsi.innerText = dummyData.deskripsi;
                outputHashtag.innerText = dummyData.hashtag;
                outputTags.innerText = dummyData.tags;
                outputThumbnail.innerText = dummyData.thumbnail;
                outputNarasi.innerHTML = '';
                dummyData.narasi.forEach(item => {
                    const segmentHTML = `<div class="segment"><div class="segment-title">${item.segmen} [${item.waktu}]</div><div class="segment-narasi" contenteditable="true">${item.teks}</div><div class="segment-prompt" contenteditable="true">${item.prompt}</div></div>`;
                    outputNarasi.innerHTML += segmentHTML;
                });
                outputWrapper.style.display = 'flex';
            }, 2000);
        });
        const copyBtn = document.getElementById('copy-btn');
        const viewTextBtn = document.getElementById('view-text-btn'); // Menggunakan ID baru
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const textToCopy = generateTextForExport();
                navigator.clipboard.writeText(textToCopy).then(() => { alert('Semua teks berhasil disalin!'); }).catch(err => { console.error('Gagal menyalin teks: ', err); alert('Gagal menyalin. Coba lagi.'); });
            });
        }
        if (viewTextBtn) { // Menggunakan ID baru
            viewTextBtn.addEventListener('click', () => {
                try {
                    const textToView = generateTextForExport();
                    const newTab = window.open();
                    newTab.document.write('<pre style="white-space: pre-wrap; word-wrap: break-word;">' + textToView + '</pre>');
                    newTab.document.close();
                } catch (error) {
                    console.error('Gagal membuka tab baru:', error);
                    alert('Gagal membuka tab baru. Pastikan browser Anda tidak memblokir pop-up.');
                }
            });
        }
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
});