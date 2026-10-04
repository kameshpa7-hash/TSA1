/**
 * EntityDetect – Named Entity Recognition (NER)
 * Text & Speech Analysis – Experiment 05
 * Pure Client-side NLP Pattern & Dictionary Matching Engine
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. Curated Dictionaries & Regex Patterns
  // ==========================================================================

  const DICTIONARIES = {
    PERSON: [
      'Dr. Arun', 'Dr. Radhika', 'Dr. Ramesh', 'Dr. Kalam', 'Prof. John',
      'Sundar Pichai', 'Satya Nadella', 'Alan Turing', 'Marie Curie', 'Ada Lovelace',
      'Albert Einstein', 'Elon Musk', 'Steve Jobs', 'Bill Gates', 'Guido van Rossum',
      'Tim Berners-Lee', 'Dennis Ritchie', 'Linus Torvalds', 'Grace Hopper', 'Kamesh',
      'Arun', 'Ramesh', 'Suresh', 'Priya', 'Ananya', 'Rahul', 'Sneha', 'Vikram'
    ],

    ORGANIZATION: [
      'Apollo Hospital', 'Fortis Hospital', 'AIIMS', 'AIIMS Delhi',
      'IIT Madras', 'IIT Bombay', 'IIT Delhi', 'Anna University', 'Stanford University',
      'Harvard University', 'MIT', 'Oxford University', 'Cambridge University',
      'Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'OpenAI', 'IBM',
      'ISRO', 'NASA', 'WHO', 'United Nations', 'UNESCO', 'TCS', 'Infosys',
      'Wipro', 'Cognizant', 'Accenture', 'Intel', 'NVIDIA', 'Tesla',
      'Tata Group', 'Reliance Industries', 'State Bank of India', 'Reserve Bank of India'
    ],

    LOCATION: [
      // Cities
      'Chennai', 'Mumbai', 'Delhi', 'New Delhi', 'Bengaluru', 'Bangalore', 'Hyderabad',
      'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Coimbatore', 'Madurai', 'Trichy',
      'Sriharikota', 'New York', 'London', 'Paris', 'Tokyo', 'San Francisco',
      'Mountain View', 'Berlin', 'Singapore', 'Toronto', 'Sydney', 'Dubai',
      // States / Countries / Regions
      'India', 'USA', 'United States', 'UK', 'United Kingdom', 'Canada', 'Germany',
      'France', 'Japan', 'Australia', 'China', 'Tamil Nadu', 'California', 'Texas',
      'Karnataka', 'Maharashtra', 'Kerala', 'Silicon Valley', 'Mount Everest'
    ],

    TECHNOLOGY: [
      // Programming Languages & Frameworks
      'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'Rust', 'Go', 'Golang',
      'HTML', 'CSS', 'SQL', 'PHP', 'Swift', 'Kotlin', 'React', 'Angular', 'Vue',
      'Node.js', 'Express', 'Django', 'Flask', 'Spring Boot', 'Docker', 'Kubernetes',
      'Git', 'GitHub', 'Linux', 'Android', 'iOS', 'AWS', 'Azure',
      // AI / ML / NLP Concepts & Libraries
      'TensorFlow', 'PyTorch', 'Scikit-learn', 'BERT', 'GPT-4', 'Gemini',
      'Transformer', 'Transformers', 'NLP', 'Natural Language Processing',
      'Machine Learning', 'Deep Learning', 'Computer Vision', 'OpenCV',
      'Pandas', 'NumPy', 'Keras', 'Spacy', 'NLTK'
    ]
  };

  // Rule-based regular expressions
  const PATTERNS = [
    // 1. PERSON: Honorifics / Titles followed by Capitalized Name(s)
    {
      type: 'PERSON',
      regex: /\b(?:Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.|Shri|Smt\.|Sir|Madam)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/g,
      priority: 10
    },

    // 2. ORGANIZATION: Capitalized words ending in suffixes like Hospital, University, Institute, Corp, etc.
    {
      type: 'ORGANIZATION',
      regex: /\b(?:[A-Z][a-zA-Z0-9&.]*(?:\s+[A-Z][a-zA-Z0-9&.]*)*\s+)?(?:Hospital|Hospitals|University|Institute|College|Corp|Corporation|Inc\.?|Ltd\.?|Limited|Technologies|Tech|Foundation|Agency|Organization|Bank|Group|Labs|Enterprises|Solutions)\b/g,
      priority: 9
    },

    // 3. DATE: Years (e.g., 1900-2099)
    {
      type: 'DATE',
      regex: /\b(?:19|20)\d{2}\b/g,
      priority: 6
    },

    // 4. DATE: Formatted dates (e.g., 15th August 2024, July 2023, Oct 4 2026, 2024-05-18, 12/05/2024)
    {
      type: 'DATE',
      regex: /\b(?:\d{1,2}(?:st|nd|rd|th)?\s+)?(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec)(?:\s+\d{1,2}(?:st|nd|rd|th)?)?(?:,?\s+(?:19|20)\d{2})?\b/gi,
      priority: 8
    },
    {
      type: 'DATE',
      regex: /\b\d{4}[-/]\d{1,2}[-/]\d{1,2}\b/g,
      priority: 8
    },
    {
      type: 'DATE',
      regex: /\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b/g,
      priority: 8
    },
    {
      type: 'DATE',
      regex: /\b(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|yesterday|today|tomorrow)\b/gi,
      priority: 7
    }
  ];

  // Pre-configured Examples
  const PRESET_EXAMPLES = {
    default: "Dr. Arun works at Apollo Hospital in Chennai. He started working there in 2024.",
    tech: "Sundar Pichai leads Google in Mountain View. In 2023, the team accelerated development of Gemini using Python and TensorFlow.",
    academic: "Prof. Radhika presented her NLP research at IIT Madras on 15th August 2025, demonstrating deep learning applications with PyTorch.",
    space: "ISRO launched its prestigious lunar mission from Sriharikota, India in July 2023, utilizing advanced satellite technology."
  };

  // State Management
  let detectedEntities = [];
  let rawText = '';

  // ==========================================================================
  // 2. DOM Elements Selection
  // ==========================================================================
  let inputText, exampleSelect, btnLoadExample, btnSampleShortcut, btnAnalyze,
      btnClear, btnCopyHighlighted, btnExportCsv, filterEntityType, charWordCount,
      statusIndicator, annotatedOutput, nerTableBody, tableEntriesCount,
      statTotal, statPerson, statOrg, statLocation, statDate, statTech;

  if (typeof document !== 'undefined') {
    inputText = document.getElementById('ner-input-text');
    exampleSelect = document.getElementById('example-select');
    btnLoadExample = document.getElementById('btn-load-example');
    btnSampleShortcut = document.getElementById('btn-sample-shortcut');
    btnAnalyze = document.getElementById('btn-analyze');
    btnClear = document.getElementById('btn-clear');
    btnCopyHighlighted = document.getElementById('btn-copy-highlighted');
    btnExportCsv = document.getElementById('btn-export-csv');
    filterEntityType = document.getElementById('filter-entity-type');

    charWordCount = document.getElementById('char-word-count');
    statusIndicator = document.getElementById('status-indicator');
    annotatedOutput = document.getElementById('annotated-output');
    nerTableBody = document.getElementById('ner-table-body');
    tableEntriesCount = document.getElementById('table-entries-count');

    // Stats Counters
    statTotal = document.getElementById('stat-total-count');
    statPerson = document.getElementById('stat-person-count');
    statOrg = document.getElementById('stat-org-count');
    statLocation = document.getElementById('stat-location-count');
    statDate = document.getElementById('stat-date-count');
    statTech = document.getElementById('stat-tech-count');
  }


  // ==========================================================================
  // 3. Core NER Extraction Algorithm
  // ==========================================================================

  /**
   * Escape special regex characters
   */
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Extracts entities from text using rule-based and dictionary gazetteers
   */
  function extractEntities(text) {
    if (!text || !text.trim()) {
      return [];
    }

    const candidateSpans = [];

    // Step A: Pattern Matching via Regular Expressions
    PATTERNS.forEach(({ type, regex, priority }) => {
      const re = new RegExp(regex);
      let match;
      while ((match = re.exec(text)) !== null) {
        const matchText = match[0].trim();
        // Ignore single non-informative words in regex matches
        if (matchText.length > 1) {
          candidateSpans.push({
            text: matchText,
            type: type,
            start: match.index,
            end: match.index + match[0].length,
            length: match[0].length,
            priority: priority,
            source: 'pattern'
          });
        }
      }
    });

    // Step B: Gazette / Dictionary Exact Matching
    Object.keys(DICTIONARIES).forEach(type => {
      const dict = DICTIONARIES[type];
      dict.forEach(term => {
        // Word boundary match
        const regexStr = `\\b${escapeRegExp(term)}\\b`;
        const re = new RegExp(regexStr, 'gi');
        let match;
        while ((match = re.exec(text)) !== null) {
          candidateSpans.push({
            text: match[0],
            type: type,
            start: match.index,
            end: match.index + match[0].length,
            length: match[0].length,
            priority: 5 + (term.includes(' ') ? 4 : 0), // Multi-word dictionary matches get higher precedence
            source: 'dictionary'
          });
        }
      });
    });

    // Step C: Disambiguation & Overlap Resolution
    // Sort spans by:
    // 1) Start position ascending
    // 2) Span length descending (longer matches preferred, e.g. "Apollo Hospital" over "Hospital")
    // 3) Priority descending
    candidateSpans.sort((a, b) => {
      if (a.start !== b.start) {
        return a.start - b.start;
      }
      if (b.length !== a.length) {
        return b.length - a.length;
      }
      return b.priority - a.priority;
    });

    const nonOverlapping = [];
    let lastEnd = -1;

    for (const span of candidateSpans) {
      // Check if current span overlaps with previous span
      if (span.start >= lastEnd) {
        nonOverlapping.push(span);
        lastEnd = span.end;
      } else {
        // If there is an overlap, check if current span is strictly within an already accepted span
        // Since we sorted by start ascending and length descending, the earlier one is either longer
        // or starts earlier. So we reject partial overlaps.
      }
    }

    return nonOverlapping;
  }

  // ==========================================================================
  // 4. UI Rendering Functions
  // ==========================================================================

  /**
   * Render the annotated text with colored badges
   */
  function renderAnnotatedText(text, entities) {
    if (!text || text.trim() === '') {
      annotatedOutput.innerHTML = '<p class="placeholder-text">Click <strong>"Analyze Entities"</strong> or <strong>"Load Example"</strong> above to see the highlighted Named Entity Recognition results.</p>';
      return;
    }

    if (entities.length === 0) {
      annotatedOutput.innerHTML = `<p>${escapeHtml(text)}</p><p style="margin-top:0.75rem; font-size:0.85rem; color:var(--text-muted); font-style:italic;">No standard entities detected in the provided input. Try adding recognized names, organizations (e.g. Apollo Hospital), locations (e.g. Chennai), dates (e.g. 2024), or technologies.</p>`;
      return;
    }

    let html = '';
    let currentIndex = 0;

    entities.forEach((entity, index) => {
      // Text before entity
      if (entity.start > currentIndex) {
        html += escapeHtml(text.substring(currentIndex, entity.start));
      }

      // Entity Mark
      const entityCleanText = escapeHtml(text.substring(entity.start, entity.end));
      html += `<mark class="entity-badge entity-${entity.type}" data-index="${index}" data-type="${entity.type}" title="${entity.type}: ${entityCleanText}">
        <span class="entity-text">${entityCleanText}</span>
        <span class="entity-tag">${entity.type}</span>
      </mark>`;

      currentIndex = entity.end;
    });

    // Remainder of text
    if (currentIndex < text.length) {
      html += escapeHtml(text.substring(currentIndex));
    }

    annotatedOutput.innerHTML = html;

    // Attach click listeners to highlighted marks to link with table
    const badges = annotatedOutput.querySelectorAll('.entity-badge');
    badges.forEach(badge => {
      badge.addEventListener('click', () => {
        const idx = badge.getAttribute('data-index');
        highlightTableRow(idx);
      });
    });
  }

  /**
   * Render the results table
   */
  function renderTable(entities, filter = 'ALL') {
    const filtered = filter === 'ALL' 
      ? entities 
      : entities.filter(e => e.type === filter);

    if (filtered.length === 0) {
      nerTableBody.innerHTML = `<tr><td colspan="5" class="empty-table-cell">No entities matching "${filter}".</td></tr>`;
      tableEntriesCount.textContent = 'Showing 0 entities';
      return;
    }

    let rowsHtml = '';
    filtered.forEach((item, displayIdx) => {
      const globalIdx = entities.indexOf(item);
      rowsHtml += `
        <tr data-index="${globalIdx}" id="table-row-${globalIdx}">
          <td><strong>#${displayIdx + 1}</strong></td>
          <td class="entity-cell-name">${escapeHtml(item.text)}</td>
          <td class="entity-type-code">${item.type}</td>
          <td>
            <span class="type-pill pill-${item.type}">
              <span class="pill-dot"></span>
              ${item.type}
            </span>
          </td>
          <td>
            <span class="pos-tag">[${item.start} : ${item.end}]</span>
          </td>
        </tr>
      `;
    });

    nerTableBody.innerHTML = rowsHtml;
    tableEntriesCount.textContent = `Showing ${filtered.length} of ${entities.length} detected entities`;

    // Attach row click listeners to scroll/highlight the entity in text
    const rows = nerTableBody.querySelectorAll('tr[data-index]');
    rows.forEach(row => {
      row.addEventListener('click', () => {
        const idx = row.getAttribute('data-index');
        highlightEntityBadge(idx);
      });
    });
  }

  /**
   * Update statistics counters
   */
  function updateStats(entities) {
    statTotal.textContent = entities.length;

    const counts = {
      PERSON: 0,
      ORGANIZATION: 0,
      LOCATION: 0,
      DATE: 0,
      TECHNOLOGY: 0
    };

    entities.forEach(e => {
      if (counts[e.type] !== undefined) {
        counts[e.type]++;
      }
    });

    statPerson.textContent = counts.PERSON;
    statOrg.textContent = counts.ORGANIZATION;
    statLocation.textContent = counts.LOCATION;
    statDate.textContent = counts.DATE;
    statTech.textContent = counts.TECHNOLOGY;
  }

  /**
   * Interactively link table row with badge
   */
  function highlightTableRow(index) {
    // Remove previous selection
    document.querySelectorAll('.ner-table tbody tr').forEach(r => r.classList.remove('is-selected'));
    document.querySelectorAll('.entity-badge').forEach(b => b.classList.remove('is-selected'));

    const row = document.getElementById(`table-row-${index}`);
    const badge = annotatedOutput.querySelector(`.entity-badge[data-index="${index}"]`);

    if (row) {
      row.classList.add('is-selected');
      row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    if (badge) {
      badge.classList.add('is-selected');
    }
  }

  function highlightEntityBadge(index) {
    highlightTableRow(index);
    const badge = annotatedOutput.querySelector(`.entity-badge[data-index="${index}"]`);
    if (badge) {
      badge.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  /**
   * Helper: Escape HTML to avoid XSS
   */
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Update character and word count in textarea
   */
  function updateInputMetrics() {
    const text = inputText.value;
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    charWordCount.textContent = `${chars} characters | ${words} words`;
  }

  /**
   * Show toast notification
   */
  function showToast(message) {
    let toast = document.querySelector('.toast-notice');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${escapeHtml(message)}</span>
    `;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // ==========================================================================
  // 5. Analysis Trigger & Event Listeners
  // ==========================================================================

  function runAnalysis() {
    rawText = inputText.value;
    if (!rawText.trim()) {
      statusIndicator.textContent = 'Please enter text first';
      statusIndicator.style.color = '#ef4444';
      inputText.focus();
      return;
    }

    statusIndicator.textContent = 'Analyzing entities...';
    statusIndicator.style.color = '#2563eb';

    // Run extraction
    detectedEntities = extractEntities(rawText);

    // Update UI components
    renderAnnotatedText(rawText, detectedEntities);
    renderTable(detectedEntities, filterEntityType.value);
    updateStats(detectedEntities);

    statusIndicator.textContent = `Completed: ${detectedEntities.length} entities identified`;
    statusIndicator.style.color = '#059669';

    // Auto-scroll gently to results if needed
    document.getElementById('results-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function loadExampleText(key = 'default') {
    const text = PRESET_EXAMPLES[key] || PRESET_EXAMPLES.default;
    inputText.value = text;
    updateInputMetrics();
    runAnalysis();
    showToast(`Loaded: ${key === 'default' ? 'Required Lab Example' : key + ' example'}`);
  }

  function clearAll() {
    inputText.value = '';
    rawText = '';
    detectedEntities = [];
    updateInputMetrics();
    renderAnnotatedText('', []);
    renderTable([], 'ALL');
    updateStats([]);
    statusIndicator.textContent = 'Cleared. Ready for new input.';
    statusIndicator.style.color = 'var(--text-muted)';
    filterEntityType.value = 'ALL';
    inputText.focus();
  }

  function exportTableToCsv() {
    if (detectedEntities.length === 0) {
      showToast('No entities to export. Run analysis first.');
      return;
    }

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Index,Entity,Type,Start_Offset,End_Offset\n';

    detectedEntities.forEach((item, index) => {
      const cleanEntity = `"${item.text.replace(/"/g, '""')}"`;
      csvContent += `${index + 1},${cleanEntity},${item.type},${item.start},${item.end}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'NER_Experiment05_Entities.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported entities to CSV');
  }

  function copyAnalyzedText() {
    if (!rawText.trim()) {
      showToast('No text available to copy.');
      return;
    }
    navigator.clipboard.writeText(rawText).then(() => {
      showToast('Analyzed text copied to clipboard!');
    }).catch(() => {
      showToast('Failed to copy to clipboard.');
    });
  }

  // ==========================================================================
  // 6. Initialization
  // ==========================================================================
  function init() {
    // Input Event
    inputText.addEventListener('input', () => {
      updateInputMetrics();
      statusIndicator.textContent = 'Input modified. Click Analyze Entities.';
      statusIndicator.style.color = 'var(--text-muted)';
    });

    // Buttons
    btnAnalyze.addEventListener('click', runAnalysis);
    btnClear.addEventListener('click', clearAll);
    btnLoadExample.addEventListener('click', () => {
      loadExampleText(exampleSelect.value);
    });
    btnSampleShortcut.addEventListener('click', () => {
      exampleSelect.value = 'default';
      loadExampleText('default');
    });
    btnCopyHighlighted.addEventListener('click', copyAnalyzedText);
    btnExportCsv.addEventListener('click', exportTableToCsv);

    filterEntityType.addEventListener('change', () => {
      renderTable(detectedEntities, filterEntityType.value);
    });

    // Support keyboard shortcut: Ctrl+Enter or Cmd+Enter to run analysis
    inputText.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runAnalysis();
      }
    });

    // Auto-load default experiment example on startup for instant demonstration
    loadExampleText('default');
  }

  // Export for testing if run in Node.js
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      extractEntities,
      DICTIONARIES,
      PATTERNS,
      PRESET_EXAMPLES
    };
  }

  // Run on DOM Ready in browser environment
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

})();

