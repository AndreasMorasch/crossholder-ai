export default defineEventHandler(async (event) => {
    try {
      // 1. Die Frage aus dem Frontend auslesen
      const body = await readBody(event);
      const userQuestion = body.question;
  
      if (!userQuestion) {
        return createError({ statusCode: 400, message: 'Bitte eine Frage stellen' });
      }
  
      // 2. Schritt 1: Frage vektorisieren
      const queryEmbedding = await generateQueryEmbedding(userQuestion);
  
      // 3. Schritt 2: Supabase nach den 3 besten Treffern durchsuchen
      // matchThreshold auf 0.3 setzen, damit wir auch bei leichten Abweichungen Treffer kriegen
      const searchResults = await searchSimilarDocuments(queryEmbedding, 0.2, 1);
  
      return {
        success: true,
        question: userQuestion,
        results: searchResults
      };
  
    } catch (error) {
      console.error("Fehler in der Such-Route:", error);
      return createError({ statusCode: 500, message: 'Suche fehlgeschlagen' });
    }
  });