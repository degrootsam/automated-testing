import { ReactNode, useEffect, useRef } from "react";
import { animate } from "animejs";

export interface SpinProps {
  /**
   * Child component or elements to rotate
   */
  children: ReactNode;
  /**
   * Rotation direction: 'cw' for clockwise, 'ccw' for counter-clockwise
   * @default 'cw'
   */
  direction?: "cw" | "ccw";
  /**
   * Whether to continuously loop the spin animation
   * @default true
   */
  loop?: boolean;
  /**
   * Duration of one full rotation in milliseconds
   * @default 1000
   */
  duration?: number;
  /**
   * Additional CSS classes for the wrapper
   */
  className?: string;
}

/**
 * `Spin` wraps its children in a container that animates a rotation
 * using anime.js. You can configure direction, looping, and duration.
 */
export default function Spin({
  children,
  direction = "cw",
  loop = true,
  duration = 1000,
  className = "",
}: SpinProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const rotation = direction === "cw" ? "360deg" : "-360deg";
    const animation = animate(ref.current, {
      rotate: rotation,
      duration,
      easing: "linear",
      loop,
    });

    return () => {
      animation.pause();
    };
  }, [direction, loop, duration]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
