import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

const scoreInputSchema = z.object({
  scores: z.array(
    z.object({
      studentId: z.number(),
      score: z.object({
        total: z.union([z.string(), z.number()]),
      }),
    })
  ),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get question data with student responses
  app.get('/api/scoring/question-data', async (req, res) => {
    try {
      const questionData = await storage.getQuestionData();
      res.json(questionData);
    } catch (error) {
      console.error('Error fetching question data:', error);
      res.status(500).json({ message: 'Failed to fetch question data' });
    }
  });
  
  // Download voorbeeld CSV bestand
  app.get('/api/scoring/download-example-csv', (req, res) => {
    try {
      res.download('voorbeeld.csv', 'voorbeeld.csv');
    } catch (error) {
      console.error('Error downloading example CSV:', error);
      res.status(500).json({ message: 'Failed to download example file' });
    }
  });
  
  // Download CSV-formaat instructies
  app.get('/api/scoring/download-csv-instructions', (req, res) => {
    try {
      res.download('csv-format-instructies.md', 'csv-format-instructies.md');
    } catch (error) {
      console.error('Error downloading CSV instructions:', error);
      res.status(500).json({ message: 'Failed to download instructions file' });
    }
  });

  // Save teacher scores
  app.post('/api/scoring/save-scores', async (req, res) => {
    try {
      const { scores } = scoreInputSchema.parse(req.body);
      
      for (const item of scores) {
        await storage.saveTeacherScore(item.studentId, item.score);
      }
      
      res.json({ success: true, message: 'Scores saved successfully' });
    } catch (error) {
      console.error('Error saving scores:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid score data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to save scores' });
      }
    }
  });

  // Submit scores (finalize)
  app.post('/api/scoring/submit-scores', async (req, res) => {
    try {
      const { scores } = scoreInputSchema.parse(req.body);
      
      for (const item of scores) {
        await storage.saveTeacherScore(item.studentId, item.score);
      }
      
      // Mark as submitted - in a real application, this would likely update a status field
      await storage.markScoresAsSubmitted();
      
      res.json({ success: true, message: 'Scores submitted successfully' });
    } catch (error) {
      console.error('Error submitting scores:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid score data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to submit scores' });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
