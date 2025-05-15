import { createTimer, TimerParams, utils } from "animejs";
import { useRef } from "react";

export interface TimerProps {
  /**
   * If provided, counts up to this number over the total duration
   */
  countTo?: number;
  /** override timer params */
  options?: TimerParams;
}

/**
 * `Timer` can:
 * - count indefinitely, incrementing by 1 every `delay` ms
 * - OR count from 0 to `countTo` over `duration` ms (evenly spaced)
 */
export default function Timer({ countTo, options }: TimerProps) {
  const ref = useRef<HTMLSpanElement>(null);

  createTimer({
    onUpdate: (self) =>
      ref.current && (ref.current!.innerHTML = self.currentTime.toString()),
    frameRate: 60,
    duration: countTo,
    ...options,
  });

  return <span ref={ref}>0</span>;
}
