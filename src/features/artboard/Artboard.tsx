import { ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTouchGestures, useWheelGestures, Point } from 'react-gestures';
import throttle from 'lodash.throttle';
import { zoomRange } from 'features/zoom/ZoomControls';

import styles from './styles';
import useArtboard from './useArtboard';

const { min, max, abs, sign, round } = Math;

type ArtboardProps = {
  scaleFactor: number;
  onZoom: (scaleFactor: number) => void;
  children: ReactElement;
};

function Artboard({ scaleFactor, onZoom, children }: ArtboardProps) {
  const classes = styles();

  const { artboardSize: layerSize } = useArtboard();

  const wheelGestures = useWheelGestures();
  const touchGestures = useTouchGestures();

  const [cssTranslate, setCssTranslate] = useState<Point>({ x: 0, y: 0 });
  const [cssRotate, setCssRotate] = useState<number>(0);

  const scrollPaneRef = useRef<null | HTMLDivElement>(null);
  const artboardRef = useRef<null | HTMLElement>(null);

  const resetToCenter = useCallback(() => {
    setCssTranslate({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    scaleFactor <= 1 && resetToCenter();
  }, [resetToCenter, scaleFactor]);

  useEffect(() => {
    const scrollPane = scrollPaneRef.current;
    if (!scrollPane) return;
    const resizeObserver = new ResizeObserver(() => resetToCenter());
    resizeObserver.observe(scrollPane);
    return () => resizeObserver.unobserve(scrollPane);
  }, [resetToCenter]);

  const zoom = useMemo(() => throttle((scaleFactorDelta: number) => {
    const zoomIntensity = scaleFactor >= 1 ? 100 : 200;
    const newScaleFactor = scaleFactor + scaleFactorDelta / zoomIntensity;
    const clampedScaleFactor = min(max(zoomRange.coreMin, newScaleFactor), zoomRange.coreMax);
    onZoom(Number(clampedScaleFactor.toFixed(2)));
  }, 10), [scaleFactor, onZoom]);

  const scroll = useMemo(() => throttle((
    deltaX: number,
    deltaY: number,
  ) => {
    if (!artboardRef.current || scaleFactor <= 1) return;

    const { width, height } = artboardRef.current.getBoundingClientRect();
    const xMax = width / (2.5 * scaleFactor);
    const yMax = height / (2.5 * scaleFactor);

    setCssTranslate(translate => ({
      x: min(max(translate.x - deltaX / scaleFactor, -xMax), xMax),
      y: min(max(translate.y - deltaY / scaleFactor, -yMax), yMax),
    }));
  }, 10), [scaleFactor]);

  const rotate = useMemo(() => throttle((angleDelta: number) => {
    setCssRotate(angle => angle + angleDelta);
  }, 10), []);

  useEffect(() => {
    wheelGestures.attach({
      zoom,
      scroll,
    });
    touchGestures.attach({
      pinch: zoom,
      pan: scroll,
      rotate,
    });
  }, [wheelGestures, touchGestures, zoom, scroll, rotate]);

  useEffect(() => {
    const scrollPane = scrollPaneRef.current;
    if (!scrollPane) return;

    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      wheelGestures.next(e);
    };
    scrollPane.addEventListener('wheel', wheel, { passive: false });

    const touch = (event: TouchEvent) => touchGestures.next(event);
    scrollPane.addEventListener('touchstart', touch, { passive: true });
    scrollPane.addEventListener('touchmove', touch, { passive: true });
    scrollPane.addEventListener('touchend', touch);

    return () => {
      scrollPane.removeEventListener('wheel', wheel);
      scrollPane.removeEventListener('touchstart', touch);
      scrollPane.removeEventListener('touchmove', touch);
      scrollPane.removeEventListener('touchend', touch);
    };
  }, [touchGestures, wheelGestures, scaleFactor, scroll]);

  const verticalScrollPos = useMemo(() => {
    if (!scrollPaneRef.current || !artboardRef.current) return 50;
    const scrollRect = scrollPaneRef.current.getBoundingClientRect();
    const artboard = artboardRef.current.getBoundingClientRect();

    const artboardCenterY = (artboard.top - scrollRect.top) + artboard.height / 2;

    const dy = scrollRect.height / 2 - artboardCenterY;
    const dyMax = artboard.height / 2;
    const clamped = min(dyMax, abs(dy));
    const clampedPercents = clamped / dyMax * 50; // 0..50%

    return 50 + sign(dy) * round(clampedPercents); // scrollbar position 0..100%
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scaleFactor, cssTranslate]);

  const horizontalScrollPos = useMemo(() => {
    if (!scrollPaneRef.current || !artboardRef.current) return 50;
    const scrollRect = scrollPaneRef.current.getBoundingClientRect();
    const artboard = artboardRef.current.getBoundingClientRect();

    const artboardCenterX = (artboard.left - scrollRect.left) + artboard.width / 2;

    const dx = scrollRect.width / 2 - artboardCenterX;
    const dxMax = artboard.width / 2;
    const clamped = max(-dxMax, min(dxMax, dx));
    const clampedPercents = (clamped / (2 * dxMax)) * 100; // -50..50%

    return 50 + round(clampedPercents); // scrollbar position 0..100%
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scaleFactor, cssTranslate]);

  const isScrollbarHidden = useMemo(() => scaleFactor <= 1, [scaleFactor]);
  const scrollerSize = useMemo(() => round(100 / scaleFactor), [scaleFactor]);
  const scrollerTop = useMemo(() => min(98.5 - scrollerSize, max(0, verticalScrollPos - scrollerSize / 2)), [scrollerSize, verticalScrollPos]);
  const scrollerLeft = useMemo(() => min(98.5 - scrollerSize, max(0, horizontalScrollPos - scrollerSize / 2)), [scrollerSize, horizontalScrollPos]);

  // prevents canvas re-rendering when zooming
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const _children = useMemo(() => children, []);

  return (
    <div
      className={classes.scrollPane}
      ref={scrollPaneRef}
    >
      <section
        ref={artboardRef}
        className={classes.artboard}
        style={{
          aspectRatio: `${layerSize.width} / ${layerSize.height}`,
          transform: `scale(${scaleFactor}) translate(${cssTranslate.x}px, ${cssTranslate.y}px) rotate(${cssRotate}deg)`,
          ...layerSize,
        }}
      >
        {_children}
      </section>
      <i
        className={classes.verticalScroll}
        style={isScrollbarHidden ? { display: 'none' } : {}}
      >
        <i
          className={classes.scroller}
          style={{
            top: `${scrollerTop}%`,
            height: `${scrollerSize}%`,
          }}
        />
      </i>
      <i
        className={classes.horizontalScroll}
        style={isScrollbarHidden ? { display: 'none' } : {}}
      >
        <i
          className={classes.scroller}
          style={{
            left: `${scrollerLeft}%`,
            width: `${scrollerSize}%`,
          }}
        />
      </i>
    </div>
  );
}

export default Artboard;
