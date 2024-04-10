import { ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useTouchGestures from 'features/zoom/useTouchGestures';
import { useAppDispatch, useAppSelector } from 'shared/redux/hooks';
import { getArtboardSize, getScaleFactor, setScaleFactor } from 'features/layer/layerOptionsSlice';
import useWheelGestures from 'features/zoom/useWheelGestures';
import throttle from 'lodash.throttle';
import { zoomRange } from 'features/zoom/ZoomControls';

import { Point, Size } from 'utils/types';

import styles from './styles';

const { min, max, abs, sign, round } = Math;

type ArtboardProps = {
  children: ReactElement;
};

function Artboard({ children }: ArtboardProps) {
  const classes = styles();
  const dispatch = useAppDispatch();

  const layerSize: Size = useAppSelector(getArtboardSize);
  const scaleFactor = useAppSelector(getScaleFactor);

  const wheelGestures = useWheelGestures(scaleFactor);
  const touchGestures = useTouchGestures(scaleFactor);

  const [cssTranslate, setCssTranslate] = useState<Point>({ x: 0, y: 0 });

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

  const zoom = useMemo(() => throttle((newScaleFactor: number) => {
    const clampedScaleFactor = min(max(zoomRange.coreMin, newScaleFactor), zoomRange.coreMax);
    dispatch(setScaleFactor(clampedScaleFactor));
  }, 10), [dispatch]);

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

  useEffect(() => {
    wheelGestures.attach({
      zoom,
      scroll,
    });
    touchGestures.attach({
      pinch: zoom,
      pan: scroll,
    });
  }, [wheelGestures, touchGestures, zoom, scroll]);

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
          transform: `scale(${scaleFactor}) translate(${cssTranslate.x}px, ${cssTranslate.y}px)`,
          ...layerSize,
        }}
      >
        {children}
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
