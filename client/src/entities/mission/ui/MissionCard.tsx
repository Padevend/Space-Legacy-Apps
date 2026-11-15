// src/entities/mission/ui/MissionCard.tsx
import React from 'react';
import { Mission } from '@/entities/mission/model/types';
import { Button } from '@/shared/ui/Button';

export const MissionCard: React.FC<{ mission: Mission }> = ({ mission }) => {
  const { name } = mission;

  return (
    <div className="p-4 rounded-lg bg-nasa-blue text-white shadow-md mb-4 flex flex-col">
      {/* Video placeholder – 16:9 aspect ratio */}
      <div className="relative w-full" style={{ paddingTop: '56.25%' /* 16:9 */ }}>
        <iframe
          src=""
          title={`Video for ${name}`}
          className="absolute top-0 left-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <h3 className="text-lg font-semibold mb-2 mt-4">{name}</h3>
      <Button
        variant="primary"
        onClick={() => console.log(`Read aloud: ${name}`)}
        className="self-start"
      >
        Read aloud
      </Button>
    </div>
  );
};
