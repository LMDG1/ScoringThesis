import { 
  users, 
  type User, 
  type InsertUser, 
  type Question, 
  type StudentResponse,
  type Score,
  type TeacherScore
} from "@shared/schema";

// Sample data with multiple students responding to the same question
const sampleQuestionData = {
  question: "Due to the export of mangoes, the prosperity on both islands is increasing. Explain how the export of mangoes from Tropico to Vistara leads to increased prosperity on both islands.",
  modelAnswer: {
    part1: {
      prefix: "The prosperity on Vistara increases because...",
      completion: "the residents can now satisfy their need for mangoes."
    },
    part2: {
      prefix: "The prosperity on Tropico increases because...",
      completion: "the residents can buy more goods and services with the income from mango exports, thus fulfilling more needs."
    }
  },
  studentResponses: [
    {
      id: 1,
      name: "Student 1",
      response: {
        part1: {
          prefix: "The prosperity on Vistara increases because...",
          completion: "Mangoes are returning to their country, and the farmers who cultivate the mangoes receive money for it, which is also beneficial for them as they might earn more than before. Additionally, they experience increased trade in other goods, allowing the economy to grow in the country."
        },
        part2: {
          prefix: "The prosperity on Tropico increases because...",
          completion: "They have coconuts again, and the farmers who cultivate coconuts benefit from it because they may earn more now than they did before. With increased trade in the country, the economy also grows, and farmers benefit."
        }
      },
      aiScore: {
        part1: 0,
        part2: 1,
        total: 1
      },
      confidence: 87,
      featureImportance: {
        part1: [
          { word: "farmers", importance: "medium" },
          { word: "money", importance: "medium" },
          { word: "trade", importance: "high" },
          { word: "economy", importance: "high" }
        ],
        part2: [
          { word: "farmers", importance: "medium" },
          { word: "earn more", importance: "high" },
          { word: "trade", importance: "high" },
          { word: "economy grows", importance: "high" }
        ]
      },
      similarResponses: [
        {
          part1: "they can now enjoy mangoes which they couldn't grow themselves, adding variety to their diet and fulfilling a need.",
          part2: "they receive income from selling mangoes which allows them to buy more goods and increase their standard of living.",
          score: { part1: 1, part2: 1, total: 2 }
        },
        {
          part1: "they get mangoes which they didn't have before, making people happier.",
          part2: "they make money from selling the mangoes which they can use to buy other things.",
          score: { part1: 1, part2: 1, total: 2 }
        },
        {
          part1: "the economy is growing due to more trade and business opportunities.",
          part2: "farmers earn money from exporting their crops which stimulates their local economy.",
          score: { part1: 0, part2: 1, total: 1 }
        }
      ]
    },
    {
      id: 2,
      name: "Student 2",
      response: {
        part1: {
          prefix: "The prosperity on Vistara increases because...",
          completion: "they now have access to mangoes which they couldn't grow before, so their people can eat them and enjoy them."
        },
        part2: {
          prefix: "The prosperity on Tropico increases because...",
          completion: "they get money from selling their mangoes which they can use to buy other things they need from other countries."
        }
      },
      aiScore: {
        part1: 1,
        part2: 1,
        total: 2
      },
      confidence: 95,
      featureImportance: {
        part1: [
          { word: "access to mangoes", importance: "high" },
          { word: "couldn't grow", importance: "high" },
          { word: "eat", importance: "medium" }
        ],
        part2: [
          { word: "money", importance: "high" },
          { word: "selling", importance: "high" },
          { word: "buy", importance: "high" },
          { word: "need", importance: "medium" }
        ]
      },
      similarResponses: [
        {
          part1: "they can now enjoy mangoes which they couldn't grow themselves, adding variety to their diet and fulfilling a need.",
          part2: "they receive income from selling mangoes which allows them to buy more goods and increase their standard of living.",
          score: { part1: 1, part2: 1, total: 2 }
        },
        {
          part1: "they get mangoes which they didn't have before, making people happier.",
          part2: "they make money from selling the mangoes which they can use to buy other things.",
          score: { part1: 1, part2: 1, total: 2 }
        },
        {
          part1: "the economy is growing due to more trade and business opportunities.",
          part2: "farmers earn money from exporting their crops which stimulates their local economy.",
          score: { part1: 0, part2: 1, total: 1 }
        }
      ]
    },
    {
      id: 3,
      name: "Student 3",
      response: {
        part1: {
          prefix: "The prosperity on Vistara increases because...",
          completion: "more trade with Tropico means their economy is growing and there's more business opportunities for everyone."
        },
        part2: {
          prefix: "The prosperity on Tropico increases because...",
          completion: "the exporters make profit from selling mangoes and this money circulates in their economy creating jobs."
        }
      },
      aiScore: {
        part1: 0,
        part2: 1,
        total: 1
      },
      confidence: 83,
      featureImportance: {
        part1: [
          { word: "trade", importance: "medium" },
          { word: "economy", importance: "medium" },
          { word: "business", importance: "medium" }
        ],
        part2: [
          { word: "profit", importance: "high" },
          { word: "selling", importance: "high" },
          { word: "money", importance: "high" },
          { word: "economy", importance: "medium" }
        ]
      },
      similarResponses: [
        {
          part1: "they can now enjoy mangoes which they couldn't grow themselves, adding variety to their diet and fulfilling a need.",
          part2: "they receive income from selling mangoes which allows them to buy more goods and increase their standard of living.",
          score: { part1: 1, part2: 1, total: 2 }
        },
        {
          part1: "they get mangoes which they didn't have before, making people happier.",
          part2: "they make money from selling the mangoes which they can use to buy other things.",
          score: { part1: 1, part2: 1, total: 2 }
        },
        {
          part1: "the economy is growing due to more trade and business opportunities.",
          part2: "farmers earn money from exporting their crops which stimulates their local economy.",
          score: { part1: 0, part2: 1, total: 1 }
        }
      ]
    }
  ]
};

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getQuestionData(): Promise<any>;
  saveTeacherScore(studentId: number, score: TeacherScore): Promise<void>;
  markScoresAsSubmitted(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private teacherScores: Map<number, TeacherScore>;
  private submitted: boolean;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.teacherScores = new Map();
    this.submitted = false;
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getQuestionData(): Promise<any> {
    // In a real application, this would fetch from a database
    return sampleQuestionData;
  }
  
  async saveTeacherScore(studentId: number, score: TeacherScore): Promise<void> {
    this.teacherScores.set(studentId, score);
  }
  
  async markScoresAsSubmitted(): Promise<void> {
    this.submitted = true;
  }
}

export const storage = new MemStorage();
