import { QuestionData, ModelAnswer, StudentResponse, SimilarResponse, FeatureImportanceItem } from './types';

/**
 * Parst een CSV-bestand met vraag, modelantwoord en studentantwoorden
 * @param csvContent De inhoud van het CSV-bestand
 * @returns Een QuestionData object met alle gegevens
 */
export function parseCSV(csvContent: string): QuestionData {
  const lines = csvContent.split('\n');
  const data: Record<string, string> = {};
  
  // Eerst zoeken we de vraag en modelantwoord
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('student_id')) continue;
    
    const [key, value] = line.split(',').map(s => s.trim());
    
    if (key && value) {
      data[key] = value;
    }
    
    // Als we bij de header van de studentgegevens zijn, stoppen we
    if (key === 'student_id') {
      break;
    }
  }
  
  // Modelantwoorden verzamelen
  const modelAnswer: ModelAnswer = {
    part1: {
      prefix: data['modelantwoord_deel1_prefix'] || '',
      completion: data['modelantwoord_deel1_completion'] || ''
    },
    part2: {
      prefix: data['modelantwoord_deel2_prefix'] || '',
      completion: data['modelantwoord_deel2_completion'] || ''
    }
  };
  
  // Vind de headerregel voor studentgegevens
  let headerIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('student_id')) {
      headerIndex = i;
      break;
    }
  }
  
  if (headerIndex === -1) {
    throw new Error('Geen studentgegevens gevonden in het CSV bestand');
  }
  
  // Headers parsen
  const headers = lines[headerIndex].split(',').map(header => header.trim());
  
  // Studentgegevens verzamelen
  const studentResponses: StudentResponse[] = [];
  
  for (let i = headerIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = splitCSVLine(line);
    
    if (values.length < headers.length) continue;
    
    const studentData: Record<string, string> = {};
    
    // Map de waarden aan de headers
    headers.forEach((header, index) => {
      studentData[header] = values[index];
    });
    
    // Feature importance parsen
    const featureImportancePart1 = parseFeatureImportance(studentData['feature_importance_deel1'] || '');
    const featureImportancePart2 = parseFeatureImportance(studentData['feature_importance_deel2'] || '');
    
    // Vergelijkbare antwoorden parsen
    const similarResponses = parseSimilarResponses(
      studentData['similar_responses_deel1'] || '',
      studentData['similar_responses_deel2'] || ''
    );
    
    // StudentResponse object maken
    const student: StudentResponse = {
      id: parseInt(studentData['student_id'] || '0'),
      name: studentData['naam'] || '',
      response: {
        part1: {
          prefix: studentData['antwoord_deel1_prefix'] || '',
          completion: studentData['antwoord_deel1_completion'] || ''
        },
        part2: {
          prefix: studentData['antwoord_deel2_prefix'] || '',
          completion: studentData['antwoord_deel2_completion'] || ''
        }
      },
      aiScore: {
        part1: parseInt(studentData['ai_score_deel1'] || '0'),
        part2: parseInt(studentData['ai_score_deel2'] || '0'),
        total: parseInt(studentData['ai_score_deel1'] || '0') + parseInt(studentData['ai_score_deel2'] || '0')
      },
      confidence: parseInt(studentData['ai_confidence'] || '0'),
      featureImportance: {
        part1: featureImportancePart1,
        part2: featureImportancePart2
      },
      similarResponses: similarResponses
    };
    
    studentResponses.push(student);
  }
  
  // QuestionData object samenstellen
  return {
    assignmentName: data['opdracht_naam'] || '',
    question: data['vraag'] || '',
    modelAnswer,
    studentResponses
  };
}

/**
 * Parst een string met feature importance items
 * Format: "woord:importance,woord:importance"
 */
function parseFeatureImportance(importanceString: string): FeatureImportanceItem[] {
  if (!importanceString) return [];
  
  // Splitsen op komma's voor elk woord:importance paar
  return importanceString.split(',')
    .map(item => {
      const [word, importance] = item.split(':');
      if (!word || !importance) return null;
      
      return {
        word: word.trim(),
        importance: (importance.trim() as 'high' | 'medium' | 'low')
      };
    })
    .filter((item): item is FeatureImportanceItem => item !== null);
}

/**
 * Parst een string met vergelijkbare antwoorden
 * Format: "deel1:tekst|deel2:tekst|score_deel1:1|score_deel2:0;deel1:tekst|..."
 */
function parseSimilarResponses(part1String: string, part2String: string): SimilarResponse[] {
  const responses: SimilarResponse[] = [];
  
  // Parse deel 1 antwoorden
  if (part1String) {
    const part1Responses = part1String.split(';').map(item => {
      const [answer, score] = item.split('|').map(part => {
        const [key, value] = part.split(':');
        return value.trim();
      });
      return { answer, score: parseFloat(score) };
    });
    
    // Parse deel 2 antwoorden
    const part2Responses = part2String ? part2String.split(';').map(item => {
      const [answer, score] = item.split('|').map(part => {
        const [key, value] = part.split(':');
        return value.trim();
      });
      return { answer, score: parseFloat(score) };
    }) : [];
    
    // Combineer antwoorden
    const maxLength = Math.max(part1Responses.length, part2Responses.length);
    for (let i = 0; i < maxLength; i++) {
      responses.push({
        part1: part1Responses[i]?.answer || '',
        part2: part2Responses[i]?.answer || '',
        score: {
          part1: part1Responses[i]?.score || 0,
          part2: part2Responses[i]?.score || 0,
          total: (part1Responses[i]?.score || 0) + (part2Responses[i]?.score || 0)
        }
      });
    }
  }
  
  return responses;
}

/**
 * Hulpfunctie om CSV regels correct te splitsen, rekening houdend met komma's in waarden
 */
function splitCSVLine(line: string): string[] {
  const result: string[] = [];
  let currentValue = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(currentValue);
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  
  // Laatste waarde toevoegen
  result.push(currentValue);
  
  return result;
}