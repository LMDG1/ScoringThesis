import React, { useState } from 'react';

const TeacherScoringInterface = () => {
  // Sample data with multiple students responding to the same question
  const questionData = {
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

  // State
  const [teacherScores, setTeacherScores] = useState(
    questionData.studentResponses.map(() => ({ part1: "", part2: "" }))
  );
  const [expandedStudents, setExpandedStudents] = useState({});
  const [activeSimilarResponse, setActiveSimilarResponse] = useState(null);

  // Score input handler
  const handleScoreChange = (studentId, part, score) => {
    const newScores = [...teacherScores];
    const studentIndex = questionData.studentResponses.findIndex(s => s.id === studentId);
    
    if (studentIndex !== -1) {
      newScores[studentIndex] = {
        ...newScores[studentIndex],
        [part]: score
      };
      setTeacherScores(newScores);
    }
  };

  // Toggle explanation for a student
  const toggleExplanation = (studentId) => {
    setExpandedStudents({
      ...expandedStudents,
      [studentId]: !expandedStudents[studentId]
    });
    
    // Close similar responses when toggling
    if (activeSimilarResponse === studentId) {
      setActiveSimilarResponse(null);
    } else if (!expandedStudents[studentId]) {
      setActiveSimilarResponse(null);
    }
  };
  
  // Toggle similar responses
  const toggleSimilarResponses = (studentId) => {
    setActiveSimilarResponse(activeSimilarResponse === studentId ? null : studentId);
  };

  // Calculate total score for a student
  const calculateStudentTotal = (studentIndex) => {
    const currentTeacherScore = teacherScores[studentIndex];
    const part1 = parseInt(currentTeacherScore.part1) || 0;
    const part2 = parseInt(currentTeacherScore.part2) || 0;
    return part1 + part2;
  };

  // Render text with or without highlighting for a specific part
  const renderStudentResponse = (student, part) => {
    const responsePart = student.response[part];
    const fullText = `${responsePart.prefix} ${responsePart.completion}`;
    const isExpanded = expandedStudents[student.id];
    
    if (!isExpanded) {
      return (
        <div>
          <p className="text-sm">
            <span className="font-medium">{responsePart.prefix}</span> {responsePart.completion}
          </p>
        </div>
      );
    }
    
    let highlightedText = fullText;
    student.featureImportance[part].forEach(({ word, importance }) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const color = importance === 'high' ? '#ffcc00' : '#c2f0c2';
      highlightedText = highlightedText.replace(regex, `<span style="background-color: ${color}; font-weight: bold">$&</span>`);
    });
    
    return (
      <div>
        <p className="text-sm" dangerouslySetInnerHTML={{ __html: highlightedText }} />
      </div>
    );
  };

  // Helper to render model answer parts
  const renderModelAnswer = (part) => {
    const answerPart = questionData.modelAnswer[part];
    return (
      <p className="text-sm">
        <span className="font-medium">{answerPart.prefix}</span> {answerPart.completion}
      </p>
    );
  };

  return (
    <div className="mx-auto p-4 bg-gray-50">
      <h1 className="text-xl font-bold mb-3 text-center">AI-Assisted Scoring Interface</h1>
      
      <div className="grid grid-cols-12 gap-4">
        {/* Left Column - Fixed Question and Model Answer */}
        <div className="col-span-4 space-y-3 sticky top-4 self-start">
          {/* Test Question */}
          <div className="p-3 bg-white rounded shadow">
            <h2 className="font-bold text-sm mb-1">Test Question:</h2>
            <p className="text-sm">{questionData.question}</p>
          </div>
          
          {/* Model Answer */}
          <div className="p-3 bg-white rounded shadow border-l-4 border-blue-600">
            <h2 className="font-bold text-sm mb-2 text-blue-600">Model Answer:</h2>
            
            <div className="mb-3">
              <h3 className="text-xs font-medium mb-1">Part 1:</h3>
              {renderModelAnswer('part1')}
            </div>
            
            <div>
              <h3 className="text-xs font-medium mb-1">Part 2:</h3>
              {renderModelAnswer('part2')}
            </div>
          </div>
          
          {/* Legend box */}
          <div className="p-3 bg-white rounded shadow">
            <h2 className="font-bold text-sm mb-2">Word Importance Guide:</h2>
            <div className="flex text-xs text-gray-600 space-x-4">
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 mr-1 bg-yellow-300"></span>
                <span>High Importance</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 mr-1 bg-green-200"></span>
                <span>Medium Importance</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Scrollable Student Responses */}
        <div className="col-span-8 space-y-6 max-h-screen overflow-y-auto pr-2">
          {questionData.studentResponses.map((student, studentIndex) => (
            <div key={student.id} className="bg-white rounded shadow p-3">
              <h2 className="font-bold text-lg mb-3 border-b pb-2">{student.name}</h2>
              
              <div className="space-y-4">
                {/* Part 1 */}
                <div className="border border-gray-200 rounded p-3">
                  <h3 className="font-bold text-sm mb-2">Part 1:</h3>
                  {renderStudentResponse(student, 'part1')}
                  
                  <div className="mt-3 grid grid-cols-12 gap-2">
                    {/* AI Score */}
                    <div className="col-span-8 flex items-center">
                      <span className="text-sm font-medium mr-2">AI Score: {student.aiScore.part1}/1</span>
                      
                      {expandedStudents[student.id] && (
                        <span className="text-xs text-gray-500 mr-2">({student.confidence}% confidence)</span>
                      )}
                      
                      <button 
                        onClick={() => toggleExplanation(student.id)}
                        className={`px-2 py-1 rounded text-xs ${expandedStudents[student.id] ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                      >
                        {expandedStudents[student.id] ? 'Hide' : 'Why?'}
                      </button>
                      
                      {expandedStudents[student.id] && (
                        <button 
                          onClick={() => toggleSimilarResponses(student.id)}
                          className={`ml-2 px-2 py-1 rounded text-xs ${activeSimilarResponse === student.id ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                        >
                          Examples
                        </button>
                      )}
                    </div>
                    
                    {/* Teacher Score */}
                    <div className="col-span-4 flex justify-end items-center">
                      <span className="text-sm mr-2">Your Score:</span>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleScoreChange(student.id, 'part1', '0')}
                          className={`w-8 h-8 rounded-full text-sm ${teacherScores[studentIndex].part1 === '0' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 hover:bg-gray-300'}`}
                        >
                          0
                        </button>
                        <button 
                          onClick={() => handleScoreChange(student.id, 'part1', '1')}
                          className={`w-8 h-8 rounded-full text-sm ${teacherScores[studentIndex].part1 === '1' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 hover:bg-gray-300'}`}
                        >
                          1
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Part 2 */}
                <div className="border border-gray-200 rounded p-3">
                  <h3 className="font-bold text-sm mb-2">Part 2:</h3>
                  {renderStudentResponse(student, 'part2')}
                  
                  <div className="mt-3 grid grid-cols-12 gap-2">
                    {/* AI Score */}
                    <div className="col-span-8 flex items-center">
                      <span className="text-sm font-medium mr-2">AI Score: {student.aiScore.part2}/1</span>
                      
                      {expandedStudents[student.id] && (
                        <span className="text-xs text-gray-500 mr-2">({student.confidence}% confidence)</span>
                      )}
                      
                      {!expandedStudents[student.id] && (
                        <button 
                          onClick={() => toggleExplanation(student.id)}
                          className="px-2 py-1 rounded text-xs bg-gray-200 hover:bg-gray-300"
                        >
                          Why?
                        </button>
                      )}
                    </div>
                    
                    {/* Teacher Score */}
                    <div className="col-span-4 flex justify-end items-center">
                      <span className="text-sm mr-2">Your Score:</span>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleScoreChange(student.id, 'part2', '0')}
                          className={`w-8 h-8 rounded-full text-sm ${teacherScores[studentIndex].part2 === '0' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 hover:bg-gray-300'}`}
                        >
                          0
                        </button>
                        <button 
                          onClick={() => handleScoreChange(student.id, 'part2', '1')}
                          className={`w-8 h-8 rounded-full text-sm ${teacherScores[studentIndex].part2 === '1' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 hover:bg-gray-300'}`}
                        >
                          1
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Total Score */}
                <div className="border border-gray-200 rounded p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-sm">Total AI Score: {student.aiScore.total}/2</span>
                    </div>
                    <div>
                      <span className="font-medium text-sm">Your Total Score: {calculateStudentTotal(studentIndex)}/2</span>
                    </div>
                  </div>
                </div>
                
                {/* Similar Responses (conditionally shown) */}
                {activeSimilarResponse === student.id && (
                  <div className="border border-gray-200 rounded p-3 bg-gray-50">
                    <h3 className="font-bold text-sm mb-2">Similar Response Examples:</h3>
                    <div className="space-y-2">
                      {student.similarResponses.map((similar, index) => (
                        <div key={index} className="p-2 border border-gray-200 rounded text-xs bg-white">
                          <div className="mb-1 font-medium">
                            Score: {similar.score.total}/2 ({similar.score.part1}/1, {similar.score.part2}/1)
                          </div>
                          <div className="mb-1">
                            <span className="font-medium">Part 1:</span> {similar.part1}
                          </div>
                          <div>
                            <span className="font-medium">Part 2:</span> {similar.part2}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherScoringInterface;
