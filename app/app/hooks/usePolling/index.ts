import { useState, useEffect, useRef } from "react";
import { parseErrorToMessage } from "~/utils";

export default function usePolling<T>(
  shouldPoll: boolean,
  endpoint: string,
  delayMs: number = 1000,
  fetchOptions?: RequestInit,
): { data?: T; error?: string } {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<string>();
  const pollingRef = useRef(shouldPoll);
  pollingRef.current = shouldPoll;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let cancelled = false;

    const poll = async () => {
      if (!pollingRef.current || cancelled) return;

      try {
        const res = await fetch(endpoint, fetchOptions);
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
        const json = (await res.json()) as T;
        if (!cancelled) setData(json);
      } catch (err) {
        const message = parseErrorToMessage(err);
        if (!cancelled) setError(message);
      }

      if (!cancelled && pollingRef.current) {
        timer = setTimeout(poll, delayMs);
      }
    };

    if (shouldPoll) poll();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [shouldPoll, endpoint, delayMs]);

  return { data, error };
}
