document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('mainVideo');
    const videoSource = document.getElementById('videoSource');
    const overlay = document.getElementById('videoOverlay');
    const playBtn = document.getElementById('playBtn');
    const chapterListEl = document.getElementById('chapterList');
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const mobileOverlay = document.getElementById('mobileOverlay');

    // === 98チャプター定義 (DVD IFO + PDF TOC照合済み) ===
    const chapters = [
        // Unit 1
        { ch:1, unit:1, title:'U1-1 Song "Hello! How Are You?"', type:'song' },
        { ch:2, unit:1, title:'U1-2 Dialogue "Hi, Henry! (1)"', type:'dialogue' },
        { ch:3, unit:1, title:'U1-3 Song "Goodbye"', type:'song' },
        { ch:4, unit:1, title:'U1-4 Dialogue "Hi, Henry! (2)"', type:'dialogue' },
        { ch:5, unit:1, title:'U1-5 Song "The ABC Song"', type:'song' },
        { ch:6, unit:1, title:'U1-6 Dialogue "Hi, Henry! (3)"', type:'dialogue' },
        { ch:7, unit:1, title:'U1-7 Practice Q&A / My Speech', type:'practice' },
        { ch:8, unit:1, title:'U1-8 Dialogue "Hi, Henry! (4)"', type:'dialogue' },
        { ch:9, unit:1, title:'U1-9 Keyword Chants', type:'chant' },
        { ch:10, unit:1, title:'U1-10 Think Globally "Baby Animals"', type:'global' },
        { ch:11, unit:1, title:'U1-11 Keyword Chants', type:'chant' },
        { ch:12, unit:1, title:'U1-12 Song "The Hokey-Pokey"', type:'song' },
        // Unit 2
        { ch:13, unit:2, title:'U2-1 Dialogue "Hi, Henry! (5)"', type:'dialogue' },
        { ch:14, unit:2, title:'U2-2 Dialogue "Hi, Henry! (6)"', type:'dialogue' },
        { ch:15, unit:2, title:'U2-3 Dialogue "Hi, Henry! (7)"', type:'dialogue' },
        { ch:16, unit:2, title:'U2-4 Song "The Phonics Song"', type:'song' },
        { ch:17, unit:2, title:'U2-5 Dialogue "Hi, Henry! (8)"', type:'dialogue' },
        { ch:18, unit:2, title:'U2-6 Dialogue "Hi, Henry! (9)"', type:'dialogue' },
        { ch:19, unit:2, title:'U2-7 Phonics "a, b, c"', type:'phonics' },
        { ch:20, unit:2, title:'U2-8 Practice Q&A / My Speech', type:'practice' },
        { ch:21, unit:2, title:'U2-9 Dialogue "Hi, Henry! (10)"', type:'dialogue' },
        { ch:22, unit:2, title:'U2-10 Dialogue "Hi, Henry! (11)"', type:'dialogue' },
        { ch:23, unit:2, title:'U2-11 Phonics "d, e, f"', type:'phonics' },
        { ch:24, unit:2, title:'U2-12 Think Globally "World Food"', type:'global' },
        { ch:25, unit:2, title:'U2-13 Song "The Calendar Song"', type:'song' },
        { ch:26, unit:2, title:'U2-14 Phonics "g, h, i, j"', type:'phonics' },
        // Unit 3
        { ch:27, unit:3, title:'U3-1 Dialogue "Hi, Henry! (12)"', type:'dialogue' },
        { ch:28, unit:3, title:'U3-2 Phonics "k, l, m, n"', type:'phonics' },
        { ch:29, unit:3, title:'U3-3 Dialogue "Hi, Henry! (13)"', type:'dialogue' },
        { ch:30, unit:3, title:'U3-4 Phonics "o, p, q, r"', type:'phonics' },
        { ch:31, unit:3, title:'U3-5 Dialogue "Hi, Henry! (14)"', type:'dialogue' },
        { ch:32, unit:3, title:'U3-6 Dialogue "Hi, Henry! (15)"', type:'dialogue' },
        { ch:33, unit:3, title:'U3-7 Phonics "s, t, u, v"', type:'phonics' },
        { ch:34, unit:3, title:'U3-8 Practice Q&A / My Speech', type:'practice' },
        { ch:35, unit:3, title:'U3-9 Phonics "w, x, y, z"', type:'phonics' },
        { ch:36, unit:3, title:'U3-10 Think Globally "Outdoor Activities"', type:'global' },
        // Unit 4
        { ch:37, unit:4, title:'U4-1 Song "The Months of the Year"', type:'song' },
        { ch:38, unit:4, title:'U4-2 Skit "At the Park"', type:'dialogue' },
        { ch:39, unit:4, title:'U4-3 Target Chant', type:'chant' },
        { ch:40, unit:4, title:'U4-4 Phonics "The Rhyming Chant"', type:'phonics' },
        { ch:41, unit:4, title:'U4-5 Phonics "-an, -en"', type:'phonics' },
        { ch:42, unit:4, title:'U4-6 Think Globally "Wild Animals"', type:'global' },
        { ch:43, unit:4, title:'U4-7 Skit "The Pencil Case (2)"', type:'dialogue' },
        { ch:44, unit:4, title:'U4-8 Target Chant', type:'chant' },
        { ch:45, unit:4, title:'U4-9 Phonics "-it, -ot"', type:'phonics' },
        { ch:46, unit:4, title:'U4-10 Skit "Where\'s the Key? (3)"', type:'dialogue' },
        { ch:47, unit:4, title:'U4-11 Target Chant', type:'chant' },
        { ch:48, unit:4, title:'U4-12 Phonics "-ug, -ig"', type:'phonics' },
        { ch:49, unit:4, title:'U4-13 Practice Q&A / My Speech', type:'practice' },
        { ch:50, unit:4, title:'U4-14 Think Globally "Rare Animals"', type:'global' },
        // Unit 5
        { ch:51, unit:5, title:'U5-1 Song "Twinkle, Twinkle, Little Star"', type:'song' },
        { ch:52, unit:5, title:'U5-2 Skit "Grandma Likes Flowers (4)"', type:'dialogue' },
        { ch:53, unit:5, title:'U5-3 Target Chant', type:'chant' },
        { ch:54, unit:5, title:'U5-4 Phonics "p, b"', type:'phonics' },
        { ch:55, unit:5, title:'U5-5 Think Globally "Plants and Seeds"', type:'global' },
        { ch:56, unit:5, title:'U5-6 Skit "Mr. Hatrick (5)"', type:'dialogue' },
        { ch:57, unit:5, title:'U5-7 Target Chant', type:'chant' },
        { ch:58, unit:5, title:'U5-8 Phonics "t, d"', type:'phonics' },
        { ch:59, unit:5, title:'U5-9 Skit "Band-Aids and Erasers (6)"', type:'dialogue' },
        { ch:60, unit:5, title:'U5-10 Target Chant', type:'chant' },
        { ch:61, unit:5, title:'U5-11 Phonics "c, g"', type:'phonics' },
        { ch:62, unit:5, title:'U5-12 Practice Q&A / My Speech', type:'practice' },
        { ch:63, unit:5, title:'U5-13 Think Globally "Yummy Fruits"', type:'global' },
        // Unit 6
        { ch:64, unit:6, title:'U6-1 Song "Bingo"', type:'song' },
        { ch:65, unit:6, title:'U6-2 Skit "Lunchtime with Grandma (7)"', type:'dialogue' },
        { ch:66, unit:6, title:'U6-3 Target Chant', type:'chant' },
        { ch:67, unit:6, title:'U6-4 Phonics "m, n"', type:'phonics' },
        { ch:68, unit:6, title:'U6-5 Think Globally "Work Vehicles"', type:'global' },
        { ch:69, unit:6, title:'U6-6 Skit "The Cute Dress (8)"', type:'dialogue' },
        { ch:70, unit:6, title:'U6-7 Target Chant', type:'chant' },
        { ch:71, unit:6, title:'U6-8 Phonics "f, v"', type:'phonics' },
        { ch:72, unit:6, title:'U6-9 Skit "Whose Hat Is This? (9)"', type:'dialogue' },
        { ch:73, unit:6, title:'U6-10 Target Chant', type:'chant' },
        { ch:74, unit:6, title:'U6-11 Phonics "s, z"', type:'phonics' },
        { ch:75, unit:6, title:'U6-12 Practice Q&A / My Speech', type:'practice' },
        { ch:76, unit:6, title:'U6-13 Think Globally "People and Work Vehicles"', type:'global' },
        // Unit 7
        { ch:77, unit:7, title:'U7-1 Skit "The Birthday Poster (10)"', type:'dialogue' },
        { ch:78, unit:7, title:'U7-2 Target Chant', type:'chant' },
        { ch:79, unit:7, title:'U7-3 Phonics "l, r"', type:'phonics' },
        { ch:80, unit:7, title:'U7-4 Think Globally "Marine Life"', type:'global' },
        { ch:81, unit:7, title:'U7-5 Skit "Can You Do It? (11)"', type:'dialogue' },
        { ch:82, unit:7, title:'U7-6 Target Chant', type:'chant' },
        { ch:83, unit:7, title:'U7-7 Phonics "w, y"', type:'phonics' },
        { ch:84, unit:7, title:'U7-8 Skit "The Kazoo (12)"', type:'dialogue' },
        { ch:85, unit:7, title:'U7-9 Target Chant', type:'chant' },
        { ch:86, unit:7, title:'U7-10 Phonics "j, h"', type:'phonics' },
        { ch:87, unit:7, title:'U7-11 Phonics "k, x"', type:'phonics' },
        { ch:88, unit:7, title:'U7-12 Practice My Speech (1-16)', type:'practice' },
        { ch:89, unit:7, title:'U7-13 Think Globally "Amazing Aquatic Life"', type:'global' },
        // Unit 8
        { ch:90, unit:8, title:'U8-1 Skit "Let\'s Have Dinner (13)"', type:'dialogue' },
        { ch:91, unit:8, title:'U8-2 Target Chant', type:'chant' },
        { ch:92, unit:8, title:'U8-3 Introduction "Art and Music"', type:'global' },
        { ch:93, unit:8, title:'U8-4 Skit "Nice to Meet You (14)"', type:'dialogue' },
        { ch:94, unit:8, title:'U8-5 Target Chant', type:'chant' },
        { ch:95, unit:8, title:'U8-6 Practice My Speech (All)', type:'practice' },
        { ch:96, unit:8, title:'U8-7 Skit "Mr. Hatrick\'s New Song (15)"', type:'dialogue' },
        { ch:97, unit:8, title:'U8-8 Target Chant', type:'chant' },
        { ch:98, unit:8, title:'U8-9 Think Globally "Native Art"', type:'global' },
    ];

    let showEnglish = false;
    let showJapanese = false;

    // === サイドバー描画 ===
    let currentUnit = 0;
    chapters.forEach(chapter => {
        if (chapter.unit !== currentUnit) {
            const unitTitle = document.createElement('div');
            unitTitle.className = 'unit-title';
            unitTitle.textContent = `Unit ${chapter.unit}`;
            chapterListEl.appendChild(unitTitle);
            currentUnit = chapter.unit;
        }
        const item = document.createElement('div');
        item.className = 'chapter-item';
        const icons = { song:'🎵', dialogue:'💬', phonics:'🔤', practice:'🎯', chant:'🎶', global:'🌍' };
        const icon = icons[chapter.type] || '📄';
        item.innerHTML = `<span class="ch-icon">${icon}</span> ${chapter.title}`;
        item.dataset.chapter = chapter.ch;
        item.addEventListener('click', () => {
            document.querySelectorAll('.chapter-item').forEach(el => el.classList.remove('active'));
            item.classList.add('active');
            playChapter(chapter.ch);
            if (window.innerWidth <= 900) {
                sidebar.classList.remove('open');
                if (mobileOverlay) mobileOverlay.classList.remove('visible');
            }
        });
        chapterListEl.appendChild(item);
    });

    const playChapter = (chapterNum) => {
        document.querySelector('.video-and-script').style.display = 'flex';
        videoSource.src = `videos/chapter_${chapterNum}.mp4`;
        video.load();
        video.play().catch(e => console.log('Autoplay prevented:', e));
        overlay.classList.add('hidden');
        updateScriptDisplay(chapterNum);
    };

    const updateScriptDisplay = (chapterNum) => {
        const enPanel = document.getElementById('scriptEn');
        const jaPanel = document.getElementById('scriptJa');
        if (!enPanel || !jaPanel) return;
        const data = (typeof SCRIPT_DATA !== 'undefined') ? SCRIPT_DATA[chapterNum] : null;
        if (data) {
            enPanel.innerHTML = data.en || '<p class="no-script">Script not available</p>';
            jaPanel.innerHTML = data.ja || '<p class="no-script">スクリプトなし</p>';
        } else {
            enPanel.innerHTML = '<p class="no-script">Script not yet available for this chapter.</p>';
            jaPanel.innerHTML = '<p class="no-script">このチャプターのスクリプトはまだありません。</p>';
        }
    };

    const toggleEnBtn = document.getElementById('toggleEn');
    const toggleJaBtn = document.getElementById('toggleJa');
    const scriptPanel = document.getElementById('scriptPanel');

    if (toggleEnBtn) {
        toggleEnBtn.addEventListener('click', () => {
            showEnglish = !showEnglish;
            toggleEnBtn.classList.toggle('active', showEnglish);
            document.getElementById('scriptEn').classList.toggle('visible', showEnglish);
            updatePanelVisibility();
        });
    }
    if (toggleJaBtn) {
        toggleJaBtn.addEventListener('click', () => {
            showJapanese = !showJapanese;
            toggleJaBtn.classList.toggle('active', showJapanese);
            document.getElementById('scriptJa').classList.toggle('visible', showJapanese);
            updatePanelVisibility();
        });
    }

    const updatePanelVisibility = () => {
        if (scriptPanel) scriptPanel.classList.toggle('has-content', showEnglish || showJapanese);
    };

    const togglePlay = () => { video.paused ? video.play() : video.pause(); };
    playBtn.addEventListener('click', (e) => { e.stopPropagation(); togglePlay(); });
    overlay.addEventListener('click', togglePlay);
    video.addEventListener('play', () => overlay.classList.add('hidden'));
    video.addEventListener('pause', () => overlay.classList.remove('hidden'));

    const toggleSidebar = () => {
        if (sidebar) sidebar.classList.toggle('open');
        if (mobileOverlay) mobileOverlay.classList.toggle('visible');
    };
    if (menuToggle) menuToggle.addEventListener('click', toggleSidebar);
    if (mobileOverlay) mobileOverlay.addEventListener('click', toggleSidebar);
});
