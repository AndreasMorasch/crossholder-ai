// server/utils/voyage.ts
import { saveDocumentEmbedding } from './supabase';

// 1. Der Parameter ist jetzt ein Array von Strings (texts: string[])
export const generateEmbeddings = async (texts: string[]) => {
  const config = useRuntimeConfig();

  if (!texts || texts.length === 0) return [];

  // 2. Wir schicken das komplette Array an Voyage
  const response = await $fetch<{ data: { embedding: number[], index: number }[] }>('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.voyageKey}`,
      'Content-Type': 'application/json'
    },
    body: {
      input: texts, // Voyage iteriert automatisch über diese Liste
      model: "voyage-3"
    }
  });

  const embeddingsData = response.data;
  if (!embeddingsData) return [];

  // 3. Wir durchlaufen unsere Original-Texte und verknüpfen sie mit dem passenden Vektor
  // Voyage liefert die Vektoren in exakt derselben Reihenfolge zurück!
  const savePromises = texts.map((text, index) => {
    const embedding = embeddingsData[index]?.embedding;
    
    // Wenn alles gut ging, rufen wir unsere Supabase-Util auf
    if (embedding) {
      return saveDocumentEmbedding(text, embedding, {
        source: 'API Batch Test',
        model: 'voyage-3'
      });
    }
  });

  // 4. Promise.all führt alle Speicher-Vorgänge parallel (!) aus
  const savedResults = await Promise.all(savePromises);

  return savedResults;
};

export const generateQueryEmbedding = async (text: string) => {
    const config = useRuntimeConfig();
  
    const response = await $fetch<{ data: { embedding: number[] }[] }>('https://api.voyageai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.voyageKey}`,
        'Content-Type': 'application/json'
      },
      body: {
        input: text,
        model: "voyage-3"
      }
    });
  
    const embedding = response.data?.[0]?.embedding;
    if (!embedding) throw new Error("Kein Embedding von Voyage erhalten");
  
    return embedding;
  };