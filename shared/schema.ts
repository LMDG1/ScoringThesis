import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  modelAnswer: jsonb("model_answer").notNull(),
});

export const studentResponses = pgTable("student_responses", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").notNull(),
  studentName: text("student_name").notNull(),
  response: jsonb("response").notNull(),
  aiScore: jsonb("ai_score").notNull(),
  confidence: integer("confidence").notNull(),
  featureImportance: jsonb("feature_importance").notNull(),
  similarResponses: jsonb("similar_responses"),
  teacherScore: jsonb("teacher_score"),
});

export const responseSchema = z.object({
  part1: z.object({
    prefix: z.string(),
    completion: z.string()
  }),
  part2: z.object({
    prefix: z.string(),
    completion: z.string()
  })
});

export const scoreSchema = z.object({
  part1: z.number().min(0).max(1),
  part2: z.number().min(0).max(1),
  total: z.number().min(0).max(2)
});

export const teacherScoreSchema = z.object({
  total: z.union([z.string(), z.number()])
});

export const featureImportanceSchema = z.object({
  part1: z.array(z.object({
    word: z.string(),
    importance: z.enum(["low", "medium", "high"])
  })),
  part2: z.array(z.object({
    word: z.string(),
    importance: z.enum(["low", "medium", "high"])
  }))
});

export const similarResponseSchema = z.object({
  part1: z.string(),
  part2: z.string(),
  score: scoreSchema
});

export const insertQuestionSchema = createInsertSchema(questions);
export const insertResponseSchema = createInsertSchema(studentResponses);

export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type InsertResponse = z.infer<typeof insertResponseSchema>;
export type Question = typeof questions.$inferSelect;
export type StudentResponse = typeof studentResponses.$inferSelect;
export type Response = z.infer<typeof responseSchema>;
export type Score = z.infer<typeof scoreSchema>;
export type TeacherScore = z.infer<typeof teacherScoreSchema>;
export type FeatureImportance = z.infer<typeof featureImportanceSchema>;
export type SimilarResponse = z.infer<typeof similarResponseSchema>;
