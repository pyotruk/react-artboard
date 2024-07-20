import { useCallback, useEffect, useState } from 'react';

import { scaleValue } from 'utils/range';

import styles from './styles';

const SCALE_FACTOR_STEP = 0.25;

export const zoomRange = {
  coreMin: 0.25,
  coreMax: 5,
  uiMin: 25,
  uiMax: 500,
};

const { min, max } = Math;

type ZoomControlsProps = {
  scaleFactor: number;
  onZoom: (scaleFactor: number) => void;
};

function ZoomControls({ scaleFactor, onZoom }: ZoomControlsProps) {
  const classes = styles();
  const [inputValue, setInputValue] = useState(100);

  useEffect(() => {
    setInputValue(scaleValue({
      value: scaleFactor,
      originalRange: [zoomRange.coreMin, zoomRange.coreMax],
      targetRange: [zoomRange.uiMin, zoomRange.uiMax],
    }));
  }, [scaleFactor]);

  const handleZoom = useCallback((newScaleFactor: number) => {
    const clampedScaleFactor = max(zoomRange.coreMin, min(newScaleFactor, zoomRange.coreMax));
    onZoom(Number(clampedScaleFactor.toFixed(2)));
  }, [onZoom]);

  const handleInputConfirm = useCallback((event: any) => {
    if (event.key === 'Enter') {
      const newInputValue = max(zoomRange.uiMin, min(zoomRange.uiMax, inputValue));
      setInputValue(newInputValue);
      const newScaleFactor = scaleValue({
        value: newInputValue,
        originalRange: [zoomRange.uiMin, zoomRange.uiMax],
        targetRange: [zoomRange.coreMin, zoomRange.coreMax],
      });
      handleZoom(newScaleFactor);
    }
  }, [handleZoom, inputValue]);

  return (
    <div className={classes.wrapper}>
      <button
        className={classes.zoomButton}
        onClick={() => handleZoom(scaleFactor - SCALE_FACTOR_STEP)}
      >
        -
      </button>
      <input
        value={`${Math.round(inputValue)}%`}
        className={classes.zoomInput}
        onChange={e => {
          let num = Number(e.target.value.replace('%', ''));
          if (!Number.isNaN(num)) {
            num = max(0, min(Number.MAX_SAFE_INTEGER, num));
            setInputValue(num);
          }
        }}
        onKeyDown={handleInputConfirm}
      />
      <button
        className={classes.zoomButton}
        onClick={() => handleZoom(scaleFactor + SCALE_FACTOR_STEP)}
      >
        +
      </button>
    </div>
  );
}

export default ZoomControls;
