// server/utils/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Helfer-Funktion, um den Client sauber zu initialisieren
const getSupabaseClient = () => {
  const config = useRuntimeConfig();
  return createClient(config.supabaseUrl, config.supabaseKey);
};

// Unsere ausgelagerte Speicher-Funktion
export const saveDocumentEmbedding = async (text: string, embedding: number[], metadata: any = {}) => {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('documents')
    .insert({
      content: text,
      embedding: embedding,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString()
      }
    })
    .select();

  if (error) {
    console.error("Fehler beim Speichern in Supabase:", error);
    throw new Error("Datenbank-Fehler beim Speichern des Embeddings.");
  }

  return data;
};

export const searchSimilarDocuments = async (queryEmbedding: number[], matchThreshold = 0.5, matchCount = 5) => {
    const supabase = getSupabaseClient();
  
    // .rpc() ruft exakt die Funktion auf, die wir vorhin im SQL Editor erstellt haben!
    const { data, error } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: matchThreshold,
      match_count: matchCount
    });
  
    if (error) {
      console.error("Fehler bei der Vektorsuche:", error);
      throw new Error("Fehler beim Durchsuchen der Datenbank");
    }
  
    return data;
  };