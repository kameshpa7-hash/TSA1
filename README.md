# EntityDetect – Named Entity Recognition (NER)
### Text & Speech Analysis — Lab Experiment 05

An interactive, client-side Natural Language Processing (NLP) web tool designed to demonstrate **Named Entity Recognition (NER)** by identifying, classifying, and highlighting real-world entities in text.

Built using **pure HTML, CSS, and JavaScript** with zero external backend dependencies or API keys required.

---

## 📌 Objective

To demonstrate the foundational NLP task of **Information Extraction** through Named Entity Recognition (NER), recognizing key entities in unstructured natural language text and categorizing them into predefined semantic classes:

* 👤 **PERSON** — Human names, honorific titles (Dr., Prof., Mr., Ms., Sir)
* 🏢 **ORGANIZATION** — Hospitals, universities, corporations, agencies, and institutions
* 📍 **LOCATION** — Cities, states, countries, and geographical landmarks
* 📅 **DATE** — Calendar years, standard formatted dates, days of the week, and temporal words
* 💻 **TECHNOLOGY** — Programming languages, AI/ML tools, frameworks, and architectures

---

## 💡 What is Named Entity Recognition?

> **“Named Entity Recognition is an NLP technique used to identify real-world entities such as people, locations, organizations and dates from text.”**

In an NLP processing pipeline, NER bridges raw unstructured text and structured semantic data, enabling downstream tasks like information retrieval, automated summarization, knowledge graph construction, and question answering.

---

## 🚀 Key Features

* **Real-time Entity Extraction:** Instant evaluation of input text via rule-based patterns and domain gazetteers.
* **Inline Color-Coded Highlighting:** Discovered entities are visually marked with clear semantic category badges.
* **Tabular Results Summary:** Structured table displaying entity names, classification types, category badges, and exact character offsets `[start : end]`.
* **Category Filtering:** Filter extracted entities in the table by type (`ALL`, `PERSON`, `ORGANIZATION`, `LOCATION`, `DATE`, `TECHNOLOGY`).
* **Bidirectional Interaction:** Click any highlighted badge in the text to jump to its corresponding table entry, and vice-versa.
* **Summary Analytics Cards:** Instant counts of total detected entities and category-wise breakdowns.
* **Preset Laboratory Examples:** One-click loading of standard test cases, including the required Experiment 05 lab test sentence.
* **CSV Export:** Download detected entities and metadata directly to CSV for academic lab reports.
* **Zero Dependencies:** Pure browser execution—works completely offline without server setup.

---

## 🧪 Experiment Demonstration

### Test Input:
```text
"Dr. Arun works at Apollo Hospital in Chennai. He started working there in 2024."
```

### Detected Entities:

| # | Entity | Type | Category Badge | Character Range |
|---|---|---|---|---|
| **1** | **Dr. Arun** | `PERSON` | 🟣 PERSON | `[0 : 8]` |
| **2** | **Apollo Hospital** | `ORGANIZATION` | 🔵 ORGANIZATION | `[18 : 33]` |
| **3** | **Chennai** | `LOCATION` | 🟢 LOCATION | `[37 : 44]` |
| **4** | **2024** | `DATE` | 🟡 DATE | `[74 : 78]` |

**Total Detected Entities:** `4`

---

## 🧠 Methodology & Algorithm Architecture

```
Raw Input Text
      │
      ▼
1. Preprocessing & Tokenization
   ├─ Preserves character offset mappings
   └─ Word boundary detection
      │
      ▼
2. Candidate Extraction
   ├─ Regular Expression Patterns (Honorifics, Date formats, Org suffixes)
   └─ Domain Gazettes / Dictionaries (Cities, Technologies, Institutions)
      │
      ▼
3. Disambiguation & Non-Overlapping Span Resolution
   ├─ Sort by start position ascending
   ├─ Prioritize longest matching span (e.g., "Apollo Hospital" over individual words)
   └─ Discard overlapping conflicting intervals
      │
      ▼
4. Classification & Interactive Rendering
   ├─ Wrap spans in semantic `<mark>` elements
   ├─ Populate dynamic HTML table
   └─ Update metric statistics counters
```

---

## 📁 Project Structure

```
TSA5/
├── index.html       # Application interface & experiment presentation
├── style.css        # Responsive styling, color tokens, and badge designs
├── app.js           # Client-side NER engine, span resolver, and UI logic
├── test_ner.js      # Automated Node.js unit test verification suite
├── .gitignore       # Git exclusion rules (prevents .env and temp files)
└── README.md        # Experiment documentation & usage guide
```

---

## 💻 How to Run

### Method 1: Direct in Browser (No Server Needed)
Simply double-click `index.html` or open it in any modern browser (Chrome, Edge, Firefox, Safari).

### Method 2: Local Static Server (Optional)
```bash
# Using Node.js npx serve
npx serve .

# Or using Python
python -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser.

---

## 🧪 Running Automated Tests

Run the built-in test suite to verify extraction accuracy:

```bash
node test_ner.js
```

Expected output:
```
=== RUNNING NER ENGINE TESTS ===
Test #1: Required Experiment 05 Example
  [PASS] Exactly matched all 4 expected entities!
Test #2: AI & Tech Industry Example
  [PASS] Detected all expected categories: PERSON, ORGANIZATION, LOCATION, DATE, TECHNOLOGY
Test #3: Academic Research Example
  [PASS] Detected all expected categories: PERSON, ORGANIZATION, DATE, TECHNOLOGY
Test #4: Space Mission Example
  [PASS] Detected all expected categories: ORGANIZATION, LOCATION, DATE

=======================================================
SUCCESS: ALL NER ENGINE TESTS PASSED WITH 100% ACCURACY!
=======================================================
```

---

## 🎓 Academic Details

* **Course:** Text & Speech Analysis (TSA)
* **Experiment:** 05 — Named Entity Recognition
* **Department:** Department of Computer Science & Engineering
* **Author:** Kamesh
