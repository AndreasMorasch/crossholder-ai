import { SpeedInsights } from "@vercel/speed-insights/nuxt"

<script setup lang="ts">
const parsedText = ref("");

const triggerParser = async () => {
  console.log("Sending request to backend...");

  // $fetch is Nuxt's built-in method to call API routes
  const response = await $fetch("/api/parse-pdf");

  console.log(response);

  if (response.success) {
    parsedText.value = response.text;
    console.log("Successfully received response from backend!");
  }
};

const userEmbedding = ref("");

const testVoyageAPI = async () => {
  // Check, ob das Feld leer ist
  if (!userEmbedding.value.trim()) {
    console.warn("Bitte gib zuerst einen Text ein!");
    return;
  }

  console.log("Sending text to Voyage AI...");

  try {
    const response = await $fetch("/api/embed", {
      method: "POST",
      body: {
        sentences: [userEmbedding.value],
      },
    });

    if (response.success) {
      console.log(`Original text:`, response.text);
      console.log("Generated embedding:", response.embedding);

      userEmbedding.value = "";
    }
  } catch (error) {
    console.error("Fehler bei der Anfrage:", error);
  }
};

const userQuestion = ref("");
const searchResults = ref<any[]>([]);

const testSearch = async () => {
  if (!userQuestion.value.trim()) {
    console.warn("Bitte zuerst eine Frage eingeben!");
    return;
  }

  console.log("Starte Vektor-Suche für:", userQuestion.value);

  try {
    const response = await $fetch("/api/search", {
      method: "POST",
      body: {
        question: userQuestion.value,
      },
    });

    if (response.success || response.results) {
      console.log("Gefundene Antworten aus der Datenbank:", response.results);
      searchResults.value = response.results;
      userQuestion.value = "";
    }
  } catch (error) {
    console.error("Fehler bei der Vektor-Suche:", error);
  }
};
</script>

<template>
  <div class="app-container">
    <header class="header">
      <h1 class="title">Welcome to CrossHolder AI</h1>
      <h2 class="subtitle">Currently Building... 🚧🛠️</h2>
    </header>

    <div class="card">
      <div class="section">
        <h3 class="section-title">1. Dokument vorbereiten</h3>
        <button @click="triggerParser" class="btn btn-secondary" disabled>
          Beispiel-PDF jetzt parsen
        </button>

        <div v-if="parsedText" class="result-box">
          {{ parsedText }}
        </div>
      </div>

      <hr class="divider" />

      <div class="section">
        <h3 class="section-title">2. Wissen hinzufügen (per Input Feld)</h3>
        <div class="input-group">
          <input
            v-model="userEmbedding"
            type="text"
            placeholder="Dein Text für die Datenbank..."
            class="input-field"
            @keyup.enter="testVoyageAPI"
          />
          <button @click="testVoyageAPI" class="btn btn-primary">
            Embedding Einspeisen
          </button>
        </div>
      </div>

      <hr class="divider" />

      <div class="section">
        <h3 class="section-title">3. Wissen abfragen</h3>
        <div class="input-group">
          <input
            v-model="userQuestion"
            type="text"
            placeholder="Deine Frage an das RAG-System..."
            class="input-field"
            @keyup.enter="testSearch"
          />
          <button @click="testSearch" class="btn btn-primary">
            Match finden
          </button>
        </div>

        <div v-if="searchResults.length > 0" class="results-container">
          <h4 class="results-title">Gefundene Textstellen:</h4>

          <div
            v-for="(result, index) in searchResults"
            :key="index"
            class="result-card"
          >
            <div class="result-header">
              <span class="result-badge">Match {{ index + 1 }}</span>
              <span class="result-score"
                >{{ (result.similarity * 100).toFixed(1) }}% Ähnlichkeit</span
              >
            </div>
            <p class="result-text">"{{ result.content }}"</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Globale Container-Einstellungen für eine zentrierte App */
.app-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family:
    "Inter",
    system-ui,
    -apple-system,
    sans-serif;
  color: #1f2937;
  min-height: 100vh;
  box-sizing: border-box;
}

/* Header Design */
.header {
  text-align: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #4f46e5, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.2rem;
  font-weight: 500;
  color: #6b7280;
}

/* Die weiße "Karte" in der die Funktionen liegen */
.card {
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #f3f4f6;
}

.section {
  margin: 1.5rem 0;
}

.section-title {
  font-size: 1rem;
  color: #4b5563;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.divider {
  border: 0;
  height: 1px;
  background: #e5e7eb;
  margin: 2rem 0;
}

/* Layout für Eingabefelder und Buttons */
.input-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* Inputs und Buttons modern stylen */
.input-field {
  flex: 1;
  padding: 12px 16px;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.input-field:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
}

.btn {
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn:active {
  transform: scale(0.98);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-primary {
  background-color: #4f46e5;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #4338ca;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #e5e7eb;
}

/* Die Box für den geparsten PDF-Text */
.result-box {
  margin-top: 1rem;
  padding: 1.5rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  line-height: 1.5;
  color: #334155;
  max-height: 250px;
  overflow-y: auto;
}

/* Magie für Mobile-Geräte (Responsive Design) */
@media (max-width: 600px) {
  .input-group {
    flex-direction: column;
    align-items: stretch;
  }

  .btn {
    width: 100%;
  }

  .card {
    padding: 1.5rem;
  }
}

/* Styling für die Suchergebnisse */
.results-container {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: fadeIn 0.4s ease-out; /* Weiches Einblenden */
}

.results-title {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.result-card {
  background: #f8fafc;
  border-left: 4px solid #4f46e5; /* Der schicke farbige Rand */
  padding: 1.2rem;
  border-radius: 0 8px 8px 0; /* Links eckig für den Rand, rechts rund */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}

.result-card:hover {
  transform: translateX(4px); /* Kleiner Hover-Effekt */
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}

.result-badge {
  font-size: 0.75rem;
  font-weight: 700;
  background: #e0e7ff;
  color: #4338ca;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  text-transform: uppercase;
}

.result-score {
  font-size: 0.85rem;
  font-weight: 600;
  color: #10b981; /* Ein sattes Grün für den Prozentwert */
}

.result-text {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #334155;
  margin: 0;
  font-style: italic;
}

/* Eine kleine Animation, damit die Ergebnisse nicht so hart aufpoppen */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
