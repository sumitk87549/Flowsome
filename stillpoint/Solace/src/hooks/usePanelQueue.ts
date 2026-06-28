// src/hooks/usePanelQueue.ts
//
// Manages cycling through a panel script array.
// Returns the current panel and a callback to advance to the next one.

import { useState, useCallback } from 'react';
import type { Panel } from '@/types/session';

interface UsePanelQueueReturn {
  /** The panel currently being displayed, or null if the script is finished */
  currentPanel: Panel | null;
  /** The index of the current panel (for keying purposes) */
  currentIndex: number;
  /** Whether all panels have finished */
  isComplete: boolean;
  /** Call this when the current panel's onExit fires */
  advanceToNext: () => void;
}

export function usePanelQueue(panels: Panel[]): UsePanelQueueReturn {
  const [currentIndex, setCurrentIndex] = useState(0);

  const isComplete = currentIndex >= panels.length;
  const currentPanel = isComplete ? null : panels[currentIndex];

  const advanceToNext = useCallback(() => {
    setCurrentIndex(prev => prev + 1);
  }, []);

  return { currentPanel, currentIndex, isComplete, advanceToNext };
}
