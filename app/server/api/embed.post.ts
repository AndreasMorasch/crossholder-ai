export default defineEventHandler(async (event) => {
    try {
      // 1. Die Daten aus dem Frontend auslesen
      const body = await readBody(event);
      const sentences = body.sentences;

      // Sicherheitscheck
      if (!sentences || !Array.isArray(sentences) || sentences.length === 0) {
        return createError({ statusCode: 400, message: 'Keine Sätze zum Vektorisieren gefunden' });
      }

      // 2. Die dynamischen Sätze an Voyage schicken
      const embedding = await generateEmbeddings(sentences);
      
      // 3. Antwort ans Frontend zurückgeben
      return {
        success: true,
        text: sentences,
        embedding: embedding
      };
    } catch (error) {
      console.error("Voyage API error:", error);
      return createError({ statusCode: 500, message: 'Embedding creation failed' });
    }
});