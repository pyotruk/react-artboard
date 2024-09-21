import { Subject, Subscription } from 'rxjs';
import { useCallback, useRef } from 'react';

import logger from 'utils/logger';

import { TMouseEvent } from '../types';

type MouseHandlers = {
  start: (event: TMouseEvent) => void;
  move: (event: TMouseEvent) => void;
  end: (event: TMouseEvent) => void;
}

const isLMB = (event: TMouseEvent): boolean => event.button === 0;

function useMouseEvents() {
  const handlers = useRef<MouseHandlers>();

  const sub = useRef<null | Subscription>(null);
  const events$ = useRef<Subject<TMouseEvent>>();

  const mouseStart = useRef<null | TMouseEvent>(null);

  const reset = useCallback(() => {
    sub.current?.unsubscribe();
    sub.current = null;
  }, []);

  const init = useCallback(() => {
    if (!handlers.current) {
      logger.error('useMouseEvents - no handlers attached.', null);
      return;
    }

    events$.current = new Subject<TMouseEvent>();
    mouseStart.current = null;

    sub.current = events$.current.subscribe(event => {
      if (!handlers.current) return;
      if (!isLMB(event)) return;

      switch (event.type) {
        case 'mousedown':
          mouseStart.current = event;
          handlers.current.start(event);
          break;
        case 'mousemove':
          if (!mouseStart.current) return;
          handlers.current.move(event);
          break;
        case 'mouseup':
          if (!mouseStart.current) return;
          handlers.current.end(event);
          reset();
          break;
        default:
          throw new Error(`useMouseEvents - unexpected event.type = ${event.type}`);
      }
    });
  }, [reset]);

  return {
    attach: (mouseHandlers: MouseHandlers) => {
      handlers.current = mouseHandlers;
    },
    next: (event: TMouseEvent) => {
      !sub.current && init();
      events$.current?.next(event);
    },
  };
}

export default useMouseEvents;
