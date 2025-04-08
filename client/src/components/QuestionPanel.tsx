import React from 'react';
import { Card } from '@/components/ui/card';
import { ModelAnswer } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Maximize2 } from 'lucide-react';

interface QuestionPanelProps {
  question: string;
  modelAnswer: ModelAnswer;
}

const QuestionPanel: React.FC<QuestionPanelProps> = ({ question, modelAnswer }) => {
  return (
    <div className="col-span-12 md:col-span-4 space-y-4 md:sticky md:top-4 md:self-start">
      {/* Test Question */}
      <Card className="p-4 bg-white rounded-lg shadow-sm border">
        <div className="mb-3">
          <h2 className="font-semibold text-gray-800">Toetsvraag</h2>
        </div>
        <p className="text-sm text-gray-700">{question}</p>
      </Card>
      
      {/* Correctievoorschrift */}
      <Card className="p-4 bg-white rounded-lg shadow-sm border-l-4 border-primary">
        <div className="mb-3">
          <h2 className="font-semibold text-primary">Correctievoorschrift (1 punt per deel)</h2>
        </div>
        
        <div className="space-y-3">
          <div>
            <h3 className="text-xs font-medium text-gray-500 mb-1">Deel 1:</h3>
            <p className="text-sm text-gray-700">
              <span className="font-medium">{modelAnswer.part1.prefix}</span> 
              {' '}{modelAnswer.part1.completion}
            </p>
          </div>
          
          <div>
            <h3 className="text-xs font-medium text-gray-500 mb-1">Deel 2:</h3>
            <p className="text-sm text-gray-700">
              <span className="font-medium">{modelAnswer.part2.prefix}</span> 
              {' '}{modelAnswer.part2.completion}
            </p>
          </div>
        </div>
      </Card>
      
      {/* Word Importance Guide */}
      <Card className="p-4 bg-white rounded-lg shadow-sm border">
        <h2 className="font-semibold text-gray-800 mb-3">Uitleg Woordmarkering</h2>
        <div className="flex flex-col text-xs text-gray-600 space-y-2">
          <div className="flex items-center">
            <span className="inline-block w-4 h-4 mr-2 bg-blue-300 rounded"></span>
            <span>Hoge relevantie</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-4 h-4 mr-2 bg-blue-100 rounded"></span>
            <span>Medium relevantie</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QuestionPanel;
