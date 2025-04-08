import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SimilarResponsesList from "./SimilarResponsesList";
import { StudentResponse, TeacherScore, SimilarResponse } from "@/lib/types";
import { ChevronDown, ChevronUp, Info, Layers } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface StudentResponseCardProps {
  student: StudentResponse;
  teacherScore: TeacherScore;
  isExpanded: boolean;
  showSimilarResponses: boolean;
  onScoreChange: (
    studentId: number,
    part: "part1" | "part2" | "total",
    score: string | number,
  ) => void;
  onToggleExplanation: () => void;
  onToggleSimilarResponses: () => void;
}

const StudentResponseCard: React.FC<StudentResponseCardProps> = ({
  student,
  teacherScore,
  isExpanded,
  showSimilarResponses,
  onScoreChange,
  onToggleExplanation,
  onToggleSimilarResponses,
}) => {
  const [activePart, setActivePart] = useState<"part1" | "part2" | null>(null);

  // Render text with or without highlighting for a specific part
  const renderStudentResponse = (part: "part1" | "part2") => {
    const responsePart = student.response[part];
    const fullText = `${responsePart.prefix} ${responsePart.completion}`;

    if (!isExpanded) {
      return (
        <div>
          <p className="text-sm">
            <span className="font-medium">{responsePart.prefix}</span>{" "}
            {responsePart.completion}
          </p>
        </div>
      );
    }

    let highlightedText = fullText;
    const textWithHighlights = student.featureImportance[part].reduce(
      (acc, { word, importance }) => {
        const regex = new RegExp(`\\b${word}\\b`, "gi");

        // Different background colors based on importance, avoid green/red to prevent confusion with score colors
        const bgColor = importance === "high" ? "bg-blue-300" : "bg-blue-100";

        return acc.replace(
          regex,
          `<span class="${bgColor} font-medium">$&</span>`,
        );
      },
      fullText,
    );

    return (
      <div>
        <p
          className="text-sm"
          dangerouslySetInnerHTML={{ __html: textWithHighlights }}
        />
      </div>
    );
  };

  // Calculate confidence color
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600";
    if (confidence >= 75) return "text-amber-600";
    return "text-red-500";
  };

  // Create default empty score if teacherScore is undefined
  const score = teacherScore || { part1: "", part2: "", total: "" };

  // Combine both part scores for the total AI score
  const totalAIScore = student.aiScore.total;

  // Functie voor het weergeven van vergelijkbare antwoorden per antwoorddeel
  const renderSimilarResponsesForPart = (part: "part1" | "part2") => {
    // We gebruiken de label "Niet goed", "Misschien goed", "Wel goed" in plaats van punten
    const goodCount = student.similarResponses.filter(
      (r) => r.score[part] === 1,
    ).length;
    const badCount = student.similarResponses.filter(
      (r) => r.score[part] === 0,
    ).length;

    return (
      <div className="text-xs bg-white p-2 rounded border border-gray-200 mt-1">
        <div className="flex items-center gap-1 mb-1">
          <span>
            {student.similarResponses.length} soortgelijke antwoorden voor deel{" "}
            {part === "part1" ? "1" : "2"}:
          </span>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span>{goodCount} wel goed</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-amber-400"></span>
            <span>
              {Math.max(
                0,
                student.similarResponses.length - goodCount - badCount,
              )}{" "}
              misschien goed
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-red-400"></span>
            <span>{badCount} niet goed</span>
          </div>
        </div>
      </div>
    );
  };

  // Functie voor het weergeven van vergelijkbare antwoorden details per deel
  const renderDetailedSimilarResponsesForPart = (part: "part1" | "part2") => {
    return (
      <div className="mt-2 border-l-2 border-primary pl-4">
        <h3 className="text-sm font-semibold mb-2">
          Vergelijkbare antwoorden voor deel {part === "part1" ? "1" : "2"}:
        </h3>
        {student.similarResponses.map((response, index) => (
          <div
            key={index}
            className="mb-2 p-2 bg-white rounded border border-gray-200"
          >
            <div className="mb-1 text-xs text-gray-700">{response[part]}</div>
            <div className="flex items-center gap-2">
              <div
                className={`rounded-full w-2 h-2 ${
                  response.score[part] === 1
                    ? "bg-green-500"
                    : response.score[part] === 0
                      ? "bg-red-400"
                      : "bg-amber-400"
                }`}
              ></div>
              <span className="text-xs">
                {response.score[part] === 1
                  ? "Wel goed"
                  : response.score[part] === 0
                    ? "Niet goed"
                    : "Misschien goed"}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="response-card bg-white rounded-lg shadow p-4 border-2 border-gray-300 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-lg text-gray-800">
          Leerling: {student.name}
        </h2>
      </div>

      {/* Combined response */}
      <div className="border border-gray-200 rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-start">
            <h3 className="font-medium text-sm text-gray-700 mr-2">
              Antwoord:
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center mr-2">
              <div className="p-1 rounded bg-gray-50 border border-gray-200">
                <span
                  className={`${getConfidenceColor(student.confidence)} text-xs font-medium`}
                >
                  AI score: {totalAIScore}/2
                </span>
              </div>

              {isExpanded && (
                <div className="ml-2 p-1 rounded bg-gray-50 border border-gray-200">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-600">
                      Betrouwbaarheid: {student.confidence}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="text-xs h-6 mr-2 bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700"
              onClick={onToggleExplanation}
            >
              <Info className="h-3 w-3 mr-1" />
              {isExpanded ? "Verberg" : "Waarom?"}
            </Button>

            <div className="flex border rounded overflow-hidden">
              <div
                className={`px-2 h-7 text-xs font-medium border-r flex items-center justify-center ${(score.part1 === "0" || score.part1 === 0) && (score.part2 === "0" || score.part2 === 0) ? "bg-primary text-white" : "bg-gray-100"}`}
              >
                0
              </div>
              <div
                className={`px-2 h-7 text-xs font-medium border-r flex items-center justify-center ${((score.part1 === "1" || score.part1 === 1) && (score.part2 === "0" || score.part2 === 0)) || ((score.part1 === "0" || score.part1 === 0) && (score.part2 === "1" || score.part2 === 1)) ? "bg-primary text-white" : "bg-gray-100"}`}
              >
                1
              </div>
              <div
                className={`px-2 h-7 text-xs font-medium flex items-center justify-center ${(score.part1 === "1" || score.part1 === 1) && (score.part2 === "1" || score.part2 === 1) ? "bg-primary text-white" : "bg-gray-100"}`}
              >
                2
              </div>
            </div>
          </div>
        </div>

        {/* Part 1 response */}
        <div className="mb-4 border border-gray-100 rounded-md p-3">
          <div className="flex justify-between items-center mb-1">
            <h4 className="text-xs font-semibold text-gray-500">Deel 1:</h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                AI score deel 1: {student.aiScore.part1}/1
              </span>
              <div className="flex border rounded overflow-hidden">
                <Button
                  variant={
                    score.part1 === "0" || score.part1 === 0
                      ? "default"
                      : "ghost"
                  }
                  className={`px-2 h-6 text-xs font-medium border-r ${score.part1 === "0" || score.part1 === 0 ? "bg-primary text-white" : ""}`}
                  onClick={() => onScoreChange(student.id, "part1", "0")}
                >
                  0
                </Button>
                <Button
                  variant={
                    score.part1 === "1" || score.part1 === 1
                      ? "default"
                      : "ghost"
                  }
                  className={`px-2 h-6 text-xs font-medium ${score.part1 === "1" || score.part1 === 1 ? "bg-primary text-white" : ""}`}
                  onClick={() => onScoreChange(student.id, "part1", "1")}
                >
                  1
                </Button>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-700 mb-2 bg-gray-50 p-2 rounded-md">
            {renderStudentResponse("part1")}
          </div>

          {isExpanded && (
            <div className="mt-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-6 bg-white hover:bg-gray-50 w-full my-2"
                onClick={() => {
                  setActivePart("part1");
                  onToggleSimilarResponses();
                }}
              >
                <Layers className="h-3 w-3 mr-1" />
                {activePart === "part1"
                  ? "Verberg vergelijkbare antwoorden deel 1"
                  : "Toon vergelijkbare   antwoorden deel 1"}
              </Button>

              {activePart === "part1" && (
                <div>
                  {renderSimilarResponsesForPart("part1")}
                  {showSimilarResponses &&
                    renderDetailedSimilarResponsesForPart("part1")}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Part 2 response */}
        <div className="border border-gray-100 rounded-md p-3">
          <div className="flex justify-between items-center mb-1">
            <h4 className="text-xs font-semibold text-gray-500">Deel 2:</h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                AI score deel 2: {student.aiScore.part2}/1
              </span>
              <div className="flex border rounded overflow-hidden">
                <Button
                  variant={
                    score.part2 === "0" || score.part2 === 0
                      ? "default"
                      : "ghost"
                  }
                  className={`px-2 h-6 text-xs font-medium border-r ${score.part2 === "0" || score.part2 === 0 ? "bg-primary text-white" : ""}`}
                  onClick={() => onScoreChange(student.id, "part2", "0")}
                >
                  0
                </Button>
                <Button
                  variant={
                    score.part2 === "1" || score.part2 === 1
                      ? "default"
                      : "ghost"
                  }
                  className={`px-2 h-6 text-xs font-medium ${score.part2 === "1" || score.part2 === 1 ? "bg-primary text-white" : ""}`}
                  onClick={() => onScoreChange(student.id, "part2", "1")}
                >
                  1
                </Button>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-700 mb-2 bg-gray-50 p-2 rounded-md">
            {renderStudentResponse("part2")}
          </div>

          {isExpanded && (
            <div className="mt-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-6 bg-white hover:bg-gray-50 w-full my-2"
                onClick={() => {
                  setActivePart("part2");
                  onToggleSimilarResponses();
                }}
              >
                <Layers className="h-3 w-3 mr-1" />
                {activePart === "part1"
                  ? "Verberg vergelijkbare antwoorden deel 1"
                  : "Toon vergelijkbare   antwoorden deel 1"}
              </Button>

              {activePart === "part2" && (
                <div>
                  {renderSimilarResponsesForPart("part2")}
                  {showSimilarResponses &&
                    renderDetailedSimilarResponsesForPart("part2")}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StudentResponseCard;
