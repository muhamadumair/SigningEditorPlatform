import { useEffect } from 'react';
import { useDragLayer } from 'react-dnd';
import { SignSetFieldTypeArray } from '../models/views/signset.model';
import { debugLog } from '../utils/debug-logger';

/**
 * DragPositionTracker - A component that tracks drag position in real-time
 * from the moment drag starts (even in sidebar) until drop
 */
export const DragPositionTracker = () => {
  const { isDragging, itemType, currentOffset, initialOffset, differenceFromInitialOffset } = useDragLayer(
    (monitor) => ({
      isDragging: monitor.isDragging(),
      itemType: monitor.getItemType(),
      currentOffset: monitor.getClientOffset(),
      initialOffset: monitor.getInitialClientOffset(),
      differenceFromInitialOffset: monitor.getDifferenceFromInitialOffset(),
    })
  );

  useEffect(() => {
    if (isDragging && SignSetFieldTypeArray.includes(itemType as any)) {
      debugLog('🌐 [GLOBAL DRAG TRACKER] Position update');
      debugLog('  📦 Item Type:', itemType);
      debugLog('  📍 Initial Offset:', initialOffset);
      debugLog('  🖱️ Current Offset:', currentOffset);
      debugLog('  📏 Difference from Initial:', differenceFromInitialOffset);
      
      if (currentOffset && initialOffset) {
        const deltaX = currentOffset.x - initialOffset.x;
        const deltaY = currentOffset.y - initialOffset.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        debugLog('  📐 Calculated Delta:', { x: deltaX, y: deltaY });
        debugLog('  📊 Distance Traveled:', Math.round(distance), 'px');
      }
    }
  }, [isDragging, currentOffset, itemType, initialOffset, differenceFromInitialOffset]);

  // This component doesn't render anything
  return null;
};
