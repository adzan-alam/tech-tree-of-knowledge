    // =========================================================================
    // GLOBAL APP STATE & BACKEND SYNCHRONIZATION
    // =========================================================================
    let isServerApiAvailable = false;
    let activeChapterFile = 'all';
    let currentChapterRawContent = '';

    // Quick Jump Helpers
    window.jumpToPathway = function(pathwayId) {
      document.querySelector('[data-tab="tab-pathways"]').click();
      document.querySelectorAll('.pathway-card').forEach(c => {
        if (c.getAttribute('data-pathway') === pathwayId) {
          c.classList.add('active');
        } else {
          c.classList.remove('active');
        }
      });
      renderTimeline();
    };

    window.openModuleBySlug = function(slug) {
      let target = null;
      if (window.TECH_TREE_FULL_MODULES && window.TECH_TREE_FULL_MODULES[slug]) {
        target = window.TECH_TREE_FULL_MODULES[slug];
      } else {
        target = REPO_DATA.modules.find(m => m.slug === slug);
      }
      if (target) {
        selectedModule = target;
        activeChapterFile = 'all';
        document.querySelector('[data-tab="tab-reader"]').click();
        renderReaderModule(selectedModule);
      }
    };

    // Dashboard Quick Action Listeners
    const btnResume = document.getElementById('dashBtnResume');
    if (btnResume) {
      btnResume.addEventListener('click', () => {
        openModuleBySlug('math-vectors-2d');
      });
    }

    const btnAllPaths = document.getElementById('dashBtnAllPathways');
    if (btnAllPaths) {
      btnAllPaths.addEventListener('click', () => {
        document.querySelector('[data-tab="tab-pathways"]').click();
      });
    }

    // Backend Health & Progress Sync
    async function initBackendSync() {
      const badgeText = document.getElementById('serverStatusText');
      const badgeDot = document.getElementById('serverPulseDot');
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          isServerApiAvailable = true;
          if (badgeText) badgeText.textContent = '🟢 API Connected (v0.2.0)';
          if (badgeDot) badgeDot.style.background = 'var(--accent-phys)';

          // Fetch server-persisted user progress
          const progRes = await fetch('/api/progress');
          if (progRes.ok) {
            const prog = await progRes.json();
            if (prog && Array.isArray(prog.completedModules)) {
              prog.completedModules.forEach(slug => completedModules.add(slug));
              updateProgress();
            }
          }
        } else {
          throw new Error('API response not ok');
        }
      } catch (e) {
        isServerApiAvailable = false;
        if (badgeText) badgeText.textContent = '⚡ Offline Autonomous Mode';
        if (badgeDot) badgeDot.style.background = 'var(--accent-cs)';
      }
    }

    async function persistProgressToServer(slug) {
      if (!isServerApiAvailable) return;
      try {
        await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            completedModules: Array.from(completedModules),
            currentModule: slug
          })
        });
      } catch (err) {
        console.warn('Failed to sync progress to server:', err);
      }
    }

    // =========================================================================
    // MODULAR CHAPTER NAVIGATION & DOWNLOAD SYSTEM
    // =========================================================================
    const CHAPTERS_METADATA = {
      'math-vectors-2d': [
        { file: 'chapter-01-scalars-and-paradox.md', title: "Chapter 1: The Layman's Genesis — The Scalar Illusion & The Lost Island", words: '4,007' },
        { file: 'chapter-02-coordinates-and-grid.md', title: "Chapter 2: The Grid World — Descartes, The Fly, and Coordinates", words: '3,806' },
        { file: 'chapter-03-components-and-notation.md', title: "Chapter 3: The Anatomy of an Arrow — Components & Basis Vectors", words: '3,320' },
        { file: 'chapter-04-magnitude-and-pythagoras.md', title: "Chapter 4: Pythagoras in Flatland — Distance & Vector Magnitude", words: '2,917' },
        { file: 'chapter-05-vector-addition.md', title: "Chapter 5: The Geometry of Combining — Tip-to-Tail & Parallelograms", words: '3,657' },
        { file: 'chapter-06-subtraction-and-scaling.md', title: "Chapter 6: The Anti-Arrow & Scaling — Relative Velocity", words: '3,516' },
        { file: 'chapter-07-unit-vectors-and-normalization.md', title: "Chapter 7: The Compass Needle — Unit Vectors & Normalization", words: '2,913' },
        { file: 'chapter-08-trigonometry-and-polar.md', title: "Chapter 8: The Dance of Angles — Polar Coordinates & atan2", words: '3,488' },
        { file: 'chapter-09-dot-product-and-work.md', title: "Chapter 9: The Teamwork Meter — Dot Product & Mechanical Work", words: '3,857' },
        { file: 'chapter-10-projections-and-reflections.md', title: "Chapter 10: The Shadow and The Mirror — Projections & Reflections", words: '3,855' },
        { file: 'chapter-11-cross-product-and-steering.md', title: "Chapter 11: Turning in Flatland — 2D Cross Product & Steering", words: '3,026' },
        { file: 'chapter-12-typescript-engine-and-grand-gauntlet.md', title: "Chapter 12: Computational Engine & Civilizational Grand Gauntlet", words: '3,819' }
      ]
    };

    function updateChapterToolbar(modSlug) {
      const toolbar = document.getElementById('chapterToolbar');
      const select = document.getElementById('chapterSelect');
      if (!toolbar || !select) return;

      const chapters = CHAPTERS_METADATA[modSlug];
      if (chapters && chapters.length > 0) {
        toolbar.style.display = 'flex';
        select.innerHTML = '<option value="all">📖 Full Sovereign Treatise (All 12 Chapters • 42,671 Words)</option>';
        chapters.forEach(ch => {
          const opt = document.createElement('option');
          opt.value = ch.file;
          opt.textContent = `${ch.title} (${ch.words} words)`;
          select.appendChild(opt);
        });
        select.value = activeChapterFile;
      } else {
        toolbar.style.display = 'none';
      }
    }

    const chapterSelect = document.getElementById('chapterSelect');
    if (chapterSelect) {
      chapterSelect.addEventListener('change', async (e) => {
        activeChapterFile = e.target.value;
        if (!selectedModule) return;

        if (activeChapterFile === 'all') {
          // Render full content
          renderMarkdownBody(selectedModule.content || '');
          currentChapterRawContent = selectedModule.content || '';
        } else {
          // Attempt to fetch specific chapter from API or extract
          if (isServerApiAvailable) {
            try {
              const res = await fetch(`/api/modules/${selectedModule.slug}/chapters/${activeChapterFile}`);
              if (res.ok) {
                const text = await res.text();
                currentChapterRawContent = text;
                renderMarkdownBody(text);
                return;
              }
            } catch (err) {
              console.warn('API chapter fetch failed, falling back to local extraction:', err);
            }
          }

          // Fallback: extract chapter from full content
          const full = selectedModule.content || '';
          const chIndex = CHAPTERS_METADATA[selectedModule.slug]?.findIndex(c => c.file === activeChapterFile) ?? -1;
          if (chIndex !== -1) {
            const chNum = chIndex + 1;
            const marker = `# CHAPTER ${chNum}:`;
            const nextMarker = `# CHAPTER ${chNum + 1}:`;
            const start = full.indexOf(marker);
            if (start !== -1) {
              let end = nextMarker ? full.indexOf(nextMarker) : -1;
              if (end === -1) end = full.length;
              const chText = full.slice(start, end).replace(/---\s*$/, '').trim();
              currentChapterRawContent = chText;
              renderMarkdownBody(chText);
              return;
            }
          }

          renderMarkdownBody(full);
          currentChapterRawContent = full;
        }
      });
    }

    function renderMarkdownBody(rawContent) {
      const readerBody = document.getElementById('readerBody');
      if (!readerBody) return;
      currentChapterRawContent = rawContent;
      let formattedHtml = '';
      if (window.marked && typeof window.marked.parse === 'function') {
        formattedHtml = window.marked.parse(rawContent);
      } else {
        formattedHtml = rawContent;
      }
      readerBody.innerHTML = formattedHtml;

      if (window.renderMathInElement) {
        renderMathInElement(readerBody, {
          delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false}
          ],
          throwOnError: false
        });
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Download helpers
    function triggerBlobDownload(filename, text) {
      const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    document.getElementById('btnDownloadChapter').addEventListener('click', () => {
      if (!selectedModule) return;
      const fn = activeChapterFile === 'all' 
        ? `${selectedModule.slug}-full-treatise.md`
        : activeChapterFile;
      const content = currentChapterRawContent || selectedModule.content || '';
      triggerBlobDownload(fn, content);
    });

    document.getElementById('btnDownloadExercises').addEventListener('click', () => {
      if (!selectedModule) return;
      const content = currentChapterRawContent || selectedModule.content || '';
      // Extract exercises section
      const idx = content.search(/##\s*\d+\.\d+\s+Chapter Mastery Exercise Set/i);
      let exerciseText = '';
      if (idx !== -1) {
        exerciseText = content.slice(idx);
      } else {
        exerciseText = content;
      }
      const fn = activeChapterFile === 'all'
        ? `${selectedModule.slug}-all-exercises.md`
        : `exercises-${activeChapterFile}`;
      triggerBlobDownload(fn, exerciseText);
    });

    document.getElementById('btnPrintReader').addEventListener('click', () => {
      window.print();
    });

    // =========================================================================
    // NATIVE BROWSER TEXT-TO-SPEECH (READ ALOUD) ENGINE
    // =========================================================================
    let ttsUtterance = null;
    let isTtsSpeaking = false;
    let isTtsPaused = false;
    let ttsSpeechRate = 1.0;
    let ttsVoices = [];
    let ttsQueue = [];
    let ttsCurrentIndex = 0;

    const btnTtsPlay = document.getElementById('btnTtsPlay');
    const btnTtsPause = document.getElementById('btnTtsPause');
    const btnTtsStop = document.getElementById('btnTtsStop');
    const ttsVoiceSelect = document.getElementById('ttsVoiceSelect');
    const ttsStatusText = document.getElementById('ttsStatusText');
    const ttsPulse = document.getElementById('ttsPulse');

    function populateVoices() {
      if (!window.speechSynthesis) return;
      ttsVoices = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
      if (ttsVoiceSelect) {
        ttsVoiceSelect.innerHTML = '<option value="">Default System Voice</option>';
        ttsVoices.forEach((v, i) => {
          const opt = document.createElement('option');
          opt.value = i;
          opt.textContent = `${v.name} (${v.lang})`;
          ttsVoiceSelect.appendChild(opt);
        });
      }
    }

    if (window.speechSynthesis) {
      populateVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = populateVoices;
      }
    }

    // Speech rate selection
    document.querySelectorAll('.tts-speed-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tts-speed-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        ttsSpeechRate = parseFloat(btn.getAttribute('data-speed'));
        if (isTtsSpeaking && !isTtsPaused) {
          window.speechSynthesis.cancel();
          playNextTtsChunk();
        }
      });
    });

    // Clean text for speech synthesis
    function cleanMarkdownForSpeech(text) {
      if (!text) return '';
      return text
        .replace(/\$\$(.*?)\$\$/gs, ' mathematically, $1 ')
        .replace(/\$(.*?)\$/g, '$1')
        .replace(/```[\s\S]*?```/g, ' [code block omitted] ')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/#+\s*(.*)/g, '$1. ')
        .replace(/\*\*|\*|__|_/g, '')
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
        .replace(/\\vec\{([a-zA-Z])\}/g, 'vector $1')
        .replace(/\\hat\{([a-zA-Z])\}/g, '$1-hat')
        .replace(/\\theta/g, 'theta')
        .replace(/\\cdot/g, ' dot ')
        .replace(/\\times/g, ' cross ')
        .replace(/\\approx/g, ' approximately ')
        .replace(/\\le/g, ' less than or equal to ')
        .replace(/\\ge/g, ' greater than or equal to ')
        .replace(/\\sqrt\{([^\}]+)\}/g, 'square root of $1')
        .replace(/[\|\-\+\=]{3,}/g, '')
        .trim();
    }

    function stopTTS() {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      isTtsSpeaking = false;
      isTtsPaused = false;
      ttsQueue = [];
      ttsCurrentIndex = 0;
      btnTtsPlay.style.display = 'inline-flex';
      btnTtsPlay.textContent = '▶ Read Aloud';
      btnTtsPause.style.display = 'none';
      btnTtsStop.style.display = 'none';
      if (ttsPulse) ttsPulse.style.display = 'none';
      if (ttsStatusText) ttsStatusText.textContent = 'Audio TTS Ready';
    }

    function playNextTtsChunk() {
      if (!window.speechSynthesis) return;
      if (ttsCurrentIndex >= ttsQueue.length) {
        stopTTS();
        if (ttsStatusText) ttsStatusText.textContent = '✓ Finished Reading';
        return;
      }

      const chunk = ttsQueue[ttsCurrentIndex];
      ttsUtterance = new SpeechSynthesisUtterance(chunk);
      ttsUtterance.rate = ttsSpeechRate;

      const selectedVoiceIdx = ttsVoiceSelect ? ttsVoiceSelect.value : '';
      if (selectedVoiceIdx !== '' && ttsVoices[parseInt(selectedVoiceIdx, 10)]) {
        ttsUtterance.voice = ttsVoices[parseInt(selectedVoiceIdx, 10)];
      }

      ttsUtterance.onend = () => {
        ttsCurrentIndex++;
        if (isTtsSpeaking && !isTtsPaused) {
          playNextTtsChunk();
        }
      };

      ttsUtterance.onerror = (e) => {
        console.warn('TTS error:', e);
        ttsCurrentIndex++;
        if (isTtsSpeaking && !isTtsPaused) {
          playNextTtsChunk();
        }
      };

      if (ttsPulse) ttsPulse.style.display = 'inline-block';
      if (ttsStatusText) {
        const pct = Math.round(((ttsCurrentIndex + 1) / ttsQueue.length) * 100);
        ttsStatusText.textContent = `Speaking (${pct}%)...`;
      }

      window.speechSynthesis.speak(ttsUtterance);
    }

    function startTTS() {
      if (!window.speechSynthesis) {
        alert('Text-to-Speech is not supported by your browser.');
        return;
      }

      if (isTtsPaused) {
        window.speechSynthesis.resume();
        isTtsPaused = false;
        isTtsSpeaking = true;
        btnTtsPlay.style.display = 'none';
        btnTtsPause.style.display = 'inline-flex';
        btnTtsStop.style.display = 'inline-flex';
        if (ttsPulse) ttsPulse.style.display = 'inline-block';
        if (ttsStatusText) ttsStatusText.textContent = 'Speaking...';
        return;
      }

      const rawText = currentChapterRawContent || (selectedModule ? selectedModule.content : '') || '';
      const clean = cleanMarkdownForSpeech(rawText);
      if (!clean) return;

      const paragraphs = clean.split(/\n\s*\n+/).filter(p => p.trim().length > 0);
      ttsQueue = [];
      paragraphs.forEach(p => {
        if (p.length > 300) {
          const sentences = p.match(/[^.!?]+[.!?]+/g) || [p];
          sentences.forEach(s => {
            if (s.trim()) ttsQueue.push(s.trim());
          });
        } else {
          ttsQueue.push(p.trim());
        }
      });

      if (ttsQueue.length === 0) return;

      ttsCurrentIndex = 0;
      isTtsSpeaking = true;
      isTtsPaused = false;

      btnTtsPlay.style.display = 'none';
      btnTtsPause.style.display = 'inline-flex';
      btnTtsStop.style.display = 'inline-flex';
      btnTtsPause.textContent = '⏸ Pause';

      playNextTtsChunk();
    }

    function pauseTTS() {
      if (window.speechSynthesis && isTtsSpeaking) {
        window.speechSynthesis.pause();
        isTtsPaused = true;
        btnTtsPause.style.display = 'none';
        btnTtsPlay.style.display = 'inline-flex';
        btnTtsPlay.textContent = '▶ Resume';
        if (ttsPulse) ttsPulse.style.display = 'none';
        if (ttsStatusText) ttsStatusText.textContent = 'Audio Paused';
      }
    }

    if (btnTtsPlay) btnTtsPlay.addEventListener('click', startTTS);
    if (btnTtsPause) btnTtsPause.addEventListener('click', pauseTTS);
    if (btnTtsStop) btnTtsStop.addEventListener('click', stopTTS);

    // Stop speech synthesis when changing tabs
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.getAttribute('data-tab') !== 'tab-reader') {
          stopTTS();
        }
      });
    });

    // Hook updateChapterToolbar into renderReaderModule
    const originalRenderReaderModule = renderReaderModule;
    renderReaderModule = function(mod) {
      stopTTS();
      originalRenderReaderModule(mod);
      const activeMod = (window.TECH_TREE_FULL_MODULES && mod && window.TECH_TREE_FULL_MODULES[mod.slug]) || mod;
      if (activeMod) {
        currentChapterRawContent = activeMod.content || '';
        updateChapterToolbar(activeMod.slug);
      }
    };

    // When a quiz or node is completed, persist to backend
    const originalUpdateProgress = updateProgress;
    updateProgress = function() {
      originalUpdateProgress();
      if (selectedModule) {
        persistProgressToServer(selectedModule.slug);
      }
    };

    // Initialize backend sync on page load
    initBackendSync();
