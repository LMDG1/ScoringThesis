import React from 'react';
import { SimilarResponse } from '@/lib/types';

interface SimilarResponsesListProps {
  similarResponses: SimilarResponse[];
}

const SimilarResponsesList: React.FC<SimilarResponsesListProps> = ({ similarResponses }) => {
  return (
    <div className="mt-2 bg-gray-50 p-3 rounded border border-gray-200">
      <h4 className="font-medium text-xs text-gray-700 mb-2">Vergelijkbare antwoorden van leerlingen:</h4>
      
      <div className="space-y-2">
        {similarResponses.map((response, index) => (
          <div key={index} className="bg-white p-2 rounded text-xs border">
            <div className="flex justify-between mb-1">
              <span className="font-medium text-gray-700">Voorbeeld {index + 1}:</span>
              <span className={`font-medium ${response.score.total === 2 ? 'text-green-600' : 'text-amber-600'}`}>
                Score: {response.score.total}/2
              </span>
            </div>
            <p className="text-gray-700 mb-1"><strong>Deel 1:</strong> {response.part1}</p>
            <p className="text-gray-700"><strong>Deel 2:</strong> {response.part2}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarResponsesList;
