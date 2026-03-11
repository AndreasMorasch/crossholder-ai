// server/utils/pdfParser.ts
import { PDFParse } from 'pdf-parse';

const PDF_URL = 'https://bitcoin.org/bitcoin.pdf';

// 🧠 Unser neuer Algorithmus für sinnvolle RAG-Sätze
function extractMeaningfulSentences(rawText: string): string[] {
  // 1. Reparieren: Harte Zeilenumbrüche mitten im Satz entfernen
  // Wir wandeln echte Absätze (\n\n) kurz um, löschen einzelne \n und holen die Absätze zurück
  let cleanedText = rawText.replace(/\n\n/g, '###PARAGRAPH###');
  cleanedText = cleanedText.replace(/\n/g, ' '); 
  cleanedText = cleanedText.replace(/###PARAGRAPH###/g, '\n\n');

  // Mehrfache Leerzeichen durch ein einzelnes ersetzen
  cleanedText = cleanedText.replace(/\s{2,}/g, ' ').trim();

  // 2. Zerschneiden: Bei Punkt, Fragezeichen oder Ausrufezeichen trennen
  // Dieser Regex sucht nach Text, der mit . ! oder ? endet
  const sentenceMatches = cleanedText.match(/[^.!?]+[.!?]+/g) || [];

  // 3. Filtern: Nur Sätze mit echtem Inhalt behalten
  const validSentences = sentenceMatches
    .map(sentence => sentence.trim())
    .filter(sentence => {
      // Zähle die Wörter im Satz
      const wordCount = sentence.split(' ').length;
      
      // Filtere Quatsch heraus (z. B. "1.", "www.bitcoin.org", "Abstract.")
      // Ein sinnvoller Satz für ein Embedding sollte mindestens 5 Wörter haben
      return wordCount >= 5; 
    });

  return validSentences;
}

export const parsePdf = async () => {
  const response = await fetch(PDF_URL);
  if (!response.ok) {
    throw new Error(`PDF konnte nicht geladen werden: ${response.status} ${response.statusText}`);
  }
  const data = new Uint8Array(await response.arrayBuffer());

  const parser = new PDFParse({ data });
  const result = await parser.getText();
  await parser.destroy();

  // Hier rufen wir unseren neuen Algorithmus auf!
  const sentences = extractMeaningfulSentences(result.text);

  console.log(`PDF erfolgreich geparst. ${sentences.length} sinnvolle Sätze gefunden.`);
  console.log('Beispiel 1:', sentences[0]);
  console.log('Beispiel 2:', sentences[1]);

  return sentences;
};