import { Subject, Subscription } from 'rxjs';
import { useCallback, useRef } from 'react';

import logger from 'utils/logger';

import { TTouchEvent } from '../types';

/**
 * This logic is needed to distinguish single touches from multi-touches (more than one finger).
 * The problem here is that multi-touch always starts with "touchstart" event that contains just one finger (touch).
 * That happens because a human cannot put two fingers on a screen in exactly the same moment of time.
 * Thus, we have to store the very first event and analyze events that come afterwards.
 */

type TouchType = 'single' | 'multi';

type TouchHandlers = {
  start: (event: TTouchEvent) => void;
  move: (event: TTouchEvent) => void;
  end: (event: TTouchEvent) => void;
}

function useTouchEvents() {
  const enabledTypes = useRef<Partial<Record<TouchType, TouchHandlers>>>({});

  const sub = useRef<null | Subscription>(null);
  const events$ = useRef<Subject<TTouchEvent>>();

  const typeResolved = useRef<null | TouchType>(null);
  const tapStart = useRef<null | TTouchEvent>(null);

  const reset = useCallback(() => {
    sub.current?.unsubscribe();
    sub.current = null;
  }, []);

  const init = useCallback(() => {
    if (!Object.keys(enabledTypes.current).length) {
      logger.error('useTouchEvents - no handlers attached.', null);
      return;
    }

    events$.current = new Subject<TTouchEvent>();
    typeResolved.current = null;
    tapStart.current = null;

    sub.current = events$.current.subscribe(event => {
      if (!enabledTypes.current) return;

      switch (event.type) {
        case 'touchstart':
          if (typeResolved.current) {
            return;
          }
          if (event.touches.length >= 2) {
            typeResolved.current = 'multi';
            enabledTypes.current.multi?.start(event);
          } else {
            tapStart.current = event;
          }
          break;
        case 'touchmove':
          if (typeResolved.current) {
            enabledTypes.current[typeResolved.current]?.move(event);
          } else if (event.touches.length === 1 && tapStart.current) {
            typeResolved.current = 'single';
            enabledTypes.current.single?.start(tapStart.current);
            enabledTypes.current.single?.move(event);
          }
          break;
        case 'touchend':
          if (typeResolved.current) {
            enabledTypes.current[typeResolved.current]?.end(event);
          } else if (tapStart.current) {
            typeResolved.current = 'single';
            enabledTypes.current.single?.start(tapStart.current);
            enabledTypes.current.single?.end(event);
          }
          reset();
          break;
        default:
          throw new Error(`useTouchEvents - unexpected event.type = ${event.type}`);
      }
    });
  }, [reset]);

  return {
    attach: (name: TouchType, handlers: TouchHandlers) => {
      enabledTypes.current[name] = handlers;
    },
    next: (event: TTouchEvent) => {
      !sub.current && init();
      events$.current?.next(event);
    },
  };
}

export default useTouchEvents;
