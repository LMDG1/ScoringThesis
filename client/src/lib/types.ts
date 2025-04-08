export interface ModelAnswer {
  part1: {
    prefix: string;
    completion: string;
  };
  part2: {
    prefix: string;
    completion: string;
  };
}

export interface ResponsePart {
  prefix: string;
  completion: string;
}

export interface StudentResponse {
  id: number;
  name: string;
  response: {
    part1: ResponsePart;
    part2: ResponsePart;
  };
  aiScore: {
    part1: number;
    part2: number;
    total: number;
  };
  confidence: number;
  featureImportance: {
    part1: FeatureImportanceItem[];
    part2: FeatureImportanceItem[];
  };
  similarResponses: SimilarResponse[];
}

export interface FeatureImportanceItem {
  word: string;
  importance: "low" | "medium" | "high";
}

export interface SimilarResponse {
  part1: string;
  part2: string;
  score: {
    part1: number;
    part2: number;
    total: number;
  };
}

export interface TeacherScore {
  part1: string | number;
  part2: string | number;
  total: string | number;
}

export interface QuestionData {
  assignmentName: string;
  question: string;
  modelAnswer: ModelAnswer;
  studentResponses: StudentResponse[];
}

export interface ScoringStats {
  totalStudents: number;
  scoredStudents: number;
  pendingStudents: number;
}
