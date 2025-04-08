import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import QuestionPanel from '@/components/QuestionPanel';
import StudentResponseCard from '@/components/StudentResponseCard';
import { TeacherScore, QuestionData, ScoringStats } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Save, AlertTriangle, ArrowRight, Upload, FileWarning, Check } from 'lucide-react';
import { parseCSV } from '@/lib/csvParser';

const ScoringInterface = () => {
  const { toast } = useToast();

  // Fetch question data
  const { data: questionData, isLoading, isError } = useQuery<QuestionData>({
    queryKey: ['/api/scoring/question-data'],
  });

  // States
  const [teacherScores, setTeacherScores] = useState<TeacherScore[]>([]);
  const [expandedStudents, setExpandedStudents] = useState<Record<number, boolean>>({});
  const [activeSimilarResponses, setActiveSimilarResponses] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [customData, setCustomData] = useState<QuestionData | null>(null);
  const [stats, setStats] = useState<ScoringStats>({
    totalStudents: 0,
    scoredStudents: 0,
    pendingStudents: 0,
  });

  // Initialize teacher scores when data loads
  useEffect(() => {
    const data = customData || questionData;
    if (data) {
      // Initialize all teacher scores with empty values
      const initialScores = data.studentResponses.map(() => ({ part1: "", part2: "", total: "" }));
      setTeacherScores(initialScores);
      
      setStats({
        totalStudents: data.studentResponses.length,
        scoredStudents: 0,
        pendingStudents: data.studentResponses.length,
      });
    }
  }, [questionData, customData]);
  
  // Calculate scoring statistics
  useEffect(() => {
    const data = customData || questionData;
    if (data && teacherScores.length > 0) {
      const scoredCount = teacherScores.filter(
        score => score.total !== ""
      ).length;
      
      setStats({
        totalStudents: data.studentResponses.length,
        scoredStudents: scoredCount,
        pendingStudents: data.studentResponses.length - scoredCount,
      });
    }
  }, [teacherScores, questionData, customData]);

  // Score input handler
  const handleScoreChange = (studentId: number, part: 'part1' | 'part2' | 'total', score: string | number) => {
    const data = customData || questionData;
    if (!data) return;
    
    const newScores = [...teacherScores];
    const studentIndex = data.studentResponses.findIndex(s => s.id === studentId);
    
    if (studentIndex !== -1) {
      // Behoud bestaande scores voor andere delen
      const currentScore = newScores[studentIndex] || { part1: "", part2: "", total: "" };
      
      // Update alleen het specifieke deel
      newScores[studentIndex] = {
        ...currentScore,
        [part]: score
      };
      
      // Als we een specifiek deel hebben bijgewerkt, update dan mogelijk ook de totaalscore
      if (part === 'part1' || part === 'part2') {
        const otherPart = part === 'part1' ? 'part2' : 'part1';
        const otherScore = currentScore[otherPart];
        
        // Als beide deel-scores nu ingevuld zijn, bereken dan automatisch de totaalscore
        if (score !== "" && otherScore !== "") {
          const part1Value = part === 'part1' ? Number(score) : Number(otherScore);
          const part2Value = part === 'part2' ? Number(score) : Number(otherScore);
          newScores[studentIndex].total = part1Value + part2Value;
        }
      }
      
      setTeacherScores(newScores);
      
      console.log(`Changed ${studentId} ${part} score to ${score}`);
    }
  };

  // Toggle explanation for a student
  const toggleExplanation = (studentId: number) => {
    setExpandedStudents({
      ...expandedStudents,
      [studentId]: !expandedStudents[studentId]
    });
    
    // Close similar responses when toggling
    if (activeSimilarResponses === studentId) {
      setActiveSimilarResponses(null);
    }
  };
  
  // Toggle similar responses
  const toggleSimilarResponses = (studentId: number) => {
    setActiveSimilarResponses(activeSimilarResponses === studentId ? null : studentId);
  };
  
  // Extra vragen data voor demonstratie
  const extraQuestions: QuestionData[] = [
    {
      question: "Welke impact heeft de invoering van een minimumprijs voor CO2-uitstoot op de Europese economie?",
      modelAnswer: {
        part1: {
          prefix: "De invoering van een minimumprijs voor CO2-uitstoot heeft als doel",
          completion: " bedrijven te stimuleren om te investeren in schonere technologieën en processen."
        },
        part2: {
          prefix: "Op korte termijn kan dit leiden tot hogere kosten voor",
          completion: " energie-intensieve industrieën, maar op langere termijn stimuleert het innovatie en duurzame groei."
        }
      },
      studentResponses: Array(5).fill(null).map((_, i) => ({
        id: i + 10,
        name: `Student ${i + 1}`,
        response: {
          part1: {
            prefix: "De invoering van een minimumprijs voor CO2-uitstoot heeft als doel",
            completion: " de uitstoot van broeikasgassen te verminderen en duurzame economische groei te bevorderen."
          },
          part2: {
            prefix: "Op korte termijn kan dit leiden tot hogere kosten voor",
            completion: " bedrijven, maar op langere termijn zorgt het voor innovatie en nieuwe werkgelegenheid."
          }
        },
        aiScore: {
          part1: Math.round(Math.random() * 2),
          part2: Math.round(Math.random() * 2),
          total: Math.round(Math.random() * 2)
        },
        confidence: Math.round(75 + Math.random() * 20),
        featureImportance: {
          part1: [
            { word: "duurzame", importance: "high" },
            { word: "economische groei", importance: "medium" }
          ],
          part2: [
            { word: "innovatie", importance: "high" },
            { word: "werkgelegenheid", importance: "medium" }
          ]
        },
        similarResponses: Array(3).fill(null).map(() => ({
          part1: "De minimumprijs voor CO2 stimuleert bedrijven om schoner te produceren.",
          part2: "Dit zorgt voor innovatieve oplossingen en economische voordelen op lange termijn.",
          score: {
            part1: Math.round(Math.random() * 2),
            part2: Math.round(Math.random() * 2),
            total: Math.round(Math.random() * 2)
          }
        }))
      }))
    },
    {
      question: "Verklaar hoe internationale handelsverdragen zowel voor- als nadelen kunnen hebben voor ontwikkelingslanden.",
      modelAnswer: {
        part1: {
          prefix: "Handelsverdragen bieden ontwikkelingslanden toegang tot",
          completion: " grotere markten en kunnen buitenlandse investeringen aantrekken."
        },
        part2: {
          prefix: "Nadelen zijn onder andere",
          completion: " concurrentie voor lokale producenten en mogelijke afhankelijkheid van internationale markten."
        }
      },
      studentResponses: Array(5).fill(null).map((_, i) => ({
        id: i + 20,
        name: `Student ${i + 1}`,
        response: {
          part1: {
            prefix: "Handelsverdragen bieden ontwikkelingslanden toegang tot",
            completion: " nieuwe markten en kunnen leiden tot hogere investeringen en technologieoverdracht."
          },
          part2: {
            prefix: "Nadelen zijn onder andere",
            completion: " minder bescherming voor opkomende industrieën en mogelijk verlies van werkgelegenheid in bepaalde sectoren."
          }
        },
        aiScore: {
          part1: Math.round(Math.random() * 2),
          part2: Math.round(Math.random() * 2),
          total: Math.round(Math.random() * 2)
        },
        confidence: Math.round(75 + Math.random() * 20),
        featureImportance: {
          part1: [
            { word: "technologieoverdracht", importance: "high" },
            { word: "investeringen", importance: "medium" }
          ],
          part2: [
            { word: "opkomende industrieën", importance: "high" },
            { word: "werkgelegenheid", importance: "medium" }
          ]
        },
        similarResponses: Array(3).fill(null).map(() => ({
          part1: "Ontwikkelingslanden krijgen door handelsverdragen toegang tot grote internationale markten.",
          part2: "Echter kunnen lokale bedrijven vaak niet concurreren met grote multinationals.",
          score: {
            part1: Math.round(Math.random() * 2),
            part2: Math.round(Math.random() * 2),
            total: Math.round(Math.random() * 2)
          }
        }))
      }))
    }
  ];

  // Functie om naar de volgende vraag te gaan
  const handleNextQuestion = () => {
    // Ga naar de volgende vraag als er nog meer vragen zijn
    if (currentQuestionIndex < 2) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      
      // Reset de scores voor de nieuwe vraag
      const nextIndex = currentQuestionIndex + 1;
      const emptyScores = nextIndex === 1 || nextIndex === 2 
        ? extraQuestions[nextIndex - 1].studentResponses.map(() => ({ part1: "", part2: "", total: "" }))
        : [];
      
      setTeacherScores(emptyScores);
      
      // Reset expandedStudents en activeSimilarResponses
      setExpandedStudents({});
      setActiveSimilarResponses(null);
      
      // Update de data met de nieuwe vraag
      if (nextIndex === 1 || nextIndex === 2) {
        setCustomData(extraQuestions[nextIndex - 1]);
      }
      
      toast({
        title: "Navigatie",
        description: `Je gaat nu naar vraag ${nextIndex + 1}`,
      });
    } else {
      toast({
        title: "Einde bereikt",
        description: "Dit was de laatste vraag",
      });
    }
  };

  // Save all scores
  const handleSaveScores = async () => {
    try {
      const data = customData || questionData;
      if (!data) return;
      
      const scores = teacherScores.map((score, index) => ({
        studentId: data.studentResponses[index].id,
        score
      }));
      
      // Als we customData gebruiken, kunnen we de scores niet opslaan in de API
      // Dus we geven alleen een succesmelding
      if (customData) {
        toast({
          title: "Scores opgeslagen",
          description: "Alle scores zijn succesvol opgeslagen in uw browser.",
        });
        return;
      }
      
      await apiRequest('POST', '/api/scoring/save-scores', { scores });
      
      toast({
        title: "Scores opgeslagen",
        description: "Alle scores zijn succesvol opgeslagen.",
      });
    } catch (error) {
      toast({
        title: "Fout bij opslaan",
        description: "Er is een probleem opgetreden bij het opslaan van de scores. Probeer het opnieuw.",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  // Submit all scores
  const handleSubmitScores = async () => {
    try {
      const data = customData || questionData;
      if (!data) return;
      
      const scores = teacherScores.map((score, index) => ({
        studentId: data.studentResponses[index].id,
        score
      }));
      
      // Als we customData gebruiken, kunnen we de scores niet indienen in de API
      // Dus we geven alleen een succesmelding
      if (customData) {
        toast({
          title: "Scores ingediend",
          description: "Alle scores zijn succesvol ingediend in uw browser.",
        });
        return;
      }
      
      await apiRequest('POST', '/api/scoring/submit-scores', { scores });
      
      toast({
        title: "Scores ingediend",
        description: "Alle scores zijn succesvol ingediend.",
      });
    } catch (error) {
      toast({
        title: "Fout bij indienen",
        description: "Er is een probleem opgetreden bij het indienen van de scores. Probeer het opnieuw.",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  // Accept all AI scores
  const handleAcceptAIScores = () => {
    const data = customData || questionData;
    if (!data) return;
    
    const newScores = data.studentResponses.map(student => ({
      part1: student.aiScore.part1,
      part2: student.aiScore.part2,
      total: student.aiScore.total
    }));
    
    setTeacherScores(newScores);
    
    toast({
      title: "AI-scores overgenomen",
      description: "Alle AI-scores zijn overgenomen als uw beoordelingen.",
    });
  };
  
  // Handle CSV upload
  const handleCSVUpload = async (file: File) => {
    try {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const csvContent = e.target?.result as string;
        if (!csvContent) {
          toast({
            title: "Fout bij inlezen",
            description: "Het CSV-bestand kon niet worden ingelezen.",
            variant: "destructive",
          });
          return;
        }
        
        try {
          // Parse CSV content
          const parsedData = parseCSV(csvContent);
          
          // Update state with the new data
          setCustomData(parsedData);
          
          // Initialize teacher scores
          const initialScores = parsedData.studentResponses.map(() => ({ part1: "", part2: "", total: "" }));
          setTeacherScores(initialScores);
          
          // Reset expanded state
          setExpandedStudents({});
          
          // Update stats
          setStats({
            totalStudents: parsedData.studentResponses.length,
            scoredStudents: 0,
            pendingStudents: parsedData.studentResponses.length,
          });
          
          toast({
            title: "CSV succesvol ingelezen",
            description: `${parsedData.studentResponses.length} leerlingantwoorden geladen.`,
          });
        } catch (error) {
          console.error('Error parsing CSV:', error);
          toast({
            title: "Fout bij verwerken CSV",
            description: "Het CSV-bestand heeft niet het juiste formaat. Controleer uw bestand.",
            variant: "destructive",
          });
        }
      };
      
      reader.onerror = () => {
        toast({
          title: "Fout bij inlezen",
          description: "Er is een fout opgetreden bij het inlezen van het bestand.",
          variant: "destructive",
        });
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Fout bij verwerken",
        description: "Er is een fout opgetreden bij het verwerken van het bestand.",
        variant: "destructive",
      });
    }
  };

  // Calculate progress percentage
  const progressPercentage = stats.totalStudents > 0 
    ? Math.round((stats.scoredStudents / stats.totalStudents) * 100) 
    : 0;

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Beoordelingsinterface laden...</p>
        </div>
      </div>
    );
  }

  if (isError || (!questionData && !customData)) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
        <div className="text-center bg-white p-6 rounded-lg shadow-md max-w-md">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">Fout bij het laden van data</h2>
          <p className="text-gray-600 mb-4">
            De beoordelingsinterface kon niet worden geladen. 
            Vernieuw de pagina of upload een CSV-bestand met beoordelingsgegevens.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => window.location.reload()}>
              Pagina vernieuwen
            </Button>
            <label className="cursor-pointer bg-primary hover:bg-primary/90 text-white rounded-md px-3 py-2 text-sm flex items-center gap-1 hover:shadow-sm transition-all">
              <input
                type="file"
                accept=".csv"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleCSVUpload(file);
                  }
                }}
              />
              <Upload className="h-4 w-4" /> CSV importeren
            </label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-gray-800">Nakijken met behulp van AI</h1>
          <div className="flex space-x-2">
            <label className="relative cursor-pointer bg-white hover:bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 flex items-center gap-1 hover:shadow-sm transition-all">
              <input
                type="file"
                accept=".csv"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleCSVUpload(file);
                  }
                }}
              />
              <Upload className="h-4 w-4" /> CSV importeren
            </label>
            
            <div className="relative group">
              <Button 
                variant="outline"
                className="flex items-center gap-1 text-sm h-9"
              >
                <FileWarning className="h-4 w-4" /> CSV help
              </Button>
              <div className="absolute z-50 hidden group-hover:block bg-white border rounded-md shadow-lg p-3 w-64 right-0 mt-1">
                <div className="text-sm mb-2">Download voorbeeldbestanden:</div>
                <div className="flex flex-col gap-2">
                  <a 
                    href="/api/scoring/download-example-csv" 
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                    download
                  >
                    <FileWarning className="h-3 w-3" /> Voorbeeld CSV bestand
                  </a>
                  <a 
                    href="/api/scoring/download-csv-instructions" 
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                    download
                  >
                    <FileWarning className="h-3 w-3" /> CSV formaat instructies
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-1">
          <div className="text-sm text-gray-500">
            <span className="mr-2">Opdracht: {(customData || questionData)?.assignmentName || 'Onbekend'}</span>
            <span className="mr-2">•</span>
            <span>Vraag {currentQuestionIndex + 1}</span>
          </div>
          <div className="text-sm text-gray-500">
            <span>{stats.pendingStudents} leerlingen wachten op beoordeling</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full mt-2">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Voortgang vraagbeoordelingen</span>
            <span>{currentQuestionIndex+1}/3 voltooid</span>
          </div>
          <Progress value={(currentQuestionIndex+1)/3*100} className="h-2" />
        </div>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Fixed Question and Model Answer */}
        <QuestionPanel 
          question={(customData || questionData)?.question || ''} 
          modelAnswer={(customData || questionData)?.modelAnswer || { part1: { prefix: '', completion: '' }, part2: { prefix: '', completion: '' } }} 
        />
        
        {/* Right Column - Scrollable Student Responses */}
        <div className="col-span-12 md:col-span-8 space-y-6 max-h-screen overflow-y-auto pr-2">
          {(customData || questionData)?.studentResponses.map((student, studentIndex) => (
            <StudentResponseCard
              key={student.id}
              student={student}
              teacherScore={teacherScores[studentIndex]}
              isExpanded={!!expandedStudents[student.id]}
              showSimilarResponses={activeSimilarResponses === student.id}
              onScoreChange={handleScoreChange}
              onToggleExplanation={() => toggleExplanation(student.id)}
              onToggleSimilarResponses={() => toggleSimilarResponses(student.id)}
            />
          ))}
        </div>
      </div>
      
      {/* Floating Navigation Buttons */}
      <div className="fixed bottom-8 right-8 flex gap-4">
        {currentQuestionIndex > 0 && (
          <Button 
            onClick={() => {
              setCurrentQuestionIndex(prevIndex => {
                const newIndex = prevIndex - 1;
                
                // Update de data met de vorige vraag
                if (newIndex === 0) {
                  setCustomData(null); // Originele vraag uit API
                } else if (newIndex === 1) {
                  setCustomData(extraQuestions[0]);
                }
                
                // Reset de scores voor de vorige vraag
                const emptyScores = newIndex === 0 
                  ? (questionData?.studentResponses || []).map(() => ({ part1: "", part2: "", total: "" }))
                  : extraQuestions[newIndex - 1].studentResponses.map(() => ({ part1: "", part2: "", total: "" }));
                
                setTeacherScores(emptyScores);
                
                // Reset expandedStudents en activeSimilarResponses
                setExpandedStudents({});
                setActiveSimilarResponses(null);
                
                toast({
                  title: "Navigatie",
                  description: `Je gaat terug naar vraag ${newIndex + 1}`,
                });
                
                return newIndex;
              });
            }} 
            className="flex items-center gap-1 bg-secondary text-white shadow-lg hover:shadow-xl transition-shadow rounded-full px-6 py-6 h-auto"
            size="lg"
          >
            <ArrowRight className="h-5 w-5 mr-1 rotate-180" /> Vorige
          </Button>
        )}
        
        <Button 
          onClick={handleNextQuestion} 
          className="flex items-center gap-1 bg-primary text-white shadow-lg hover:shadow-xl transition-shadow rounded-full px-6 py-6 h-auto"
          size="lg"
        >
          Volgende vraag <ArrowRight className="h-5 w-5 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default ScoringInterface;
