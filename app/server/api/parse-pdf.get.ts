import { parsePdf } from '../utils/pdfParser';

export default defineEventHandler(async (event) => {
    try {
      const text = await parsePdf();
      
      return {
        success: true,
        text: text
      };
    } catch (error) {
      console.error("Error while parsing PDF:", error);
      return createError({ statusCode: 500, message: 'PDF could not be read' });
    }
  });