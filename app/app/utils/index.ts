import { Option } from "./types";
/**
 * A type guard to check if a given value is a plain object.
 */
export function isObject(item: unknown): item is Record<string, unknown> {
  return item !== null && typeof item === "object" && !Array.isArray(item);
}

/**
 * Deeply merge source objects into a target object.
 * The target and sources are constrained to objects with string keys.
 *
 * @param target The base object to merge properties into.
 * @param sources One or more source objects.
 * @returns The target object after merging.
 */
export function deepMerge<T = Record<string, unknown>>(
  target: T,
  ...sources: Array<T>
): T {
  if (!sources.length) {
    return target;
  }
  const source = sources.shift();
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        // Ensure that target[key] is an object (or initialize as an empty object).
        if (!target[key] || !isObject(target[key])) {
          Object.assign(target, { [key]: {} });
        }
        // Recursively merge the nested objects.
        deepMerge(
          target[key] as Record<string, unknown>,
          source[key] as Record<string, unknown>,
        );
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return deepMerge(target, ...sources);
}

export function parseName(name: string) {
  const lowercase = name.toLowerCase();
  const normalized = lowercase
    .replaceAll("_", "-")
    .replaceAll(" ", "-")
    .replaceAll(/[^-A-Za-z]/g, "");
  return normalized;
}

export function parseErrorToMessage(err: unknown): string {
  return isErrorWithMessage(err)
    ? err.message
    : isServerErrorWithMessage(err)
      ? err.error.message
      : "";
}

/**
 * Type guard for unknown values that have a string‐typed `.message` property.
 */
export function isErrorWithMessage(
  error: unknown,
): error is { message: string } {
  if (typeof error === "object" && error !== null && "message" in error) {
    const maybeMessage = (error as { message?: unknown }).message;
    return typeof maybeMessage === "string";
  }
  return false;
}

export function isServerErrorWithMessage(
  error: unknown,
): error is { error: { message: string } } {
  if (typeof error === "object" && error !== null && "error" in error) {
    const maybeError = (error as { error: { message?: unknown } }).error;
    return typeof maybeError === "object" && "message" in maybeError;
  }
  return false;
}

/**
 * Makes time in ms readable to humans
 *
 * @author Gazorpazorp
 */
export function humanizeMSTime(ms: number): string {
  // pmUptime is the timestamp (ms) when the process was launched
  const elapsed = Date.now() - ms;
  const sec = Math.floor((elapsed / 1000) % 60);
  const min = Math.floor((elapsed / (1000 * 60)) % 60);
  const hrs = Math.floor(elapsed / (1000 * 60 * 60));
  return `${hrs}h ${min}m ${sec}s`;
}

/**
 * Format a Date according to simple tokens:
 *
 * d    → day of month, 1-31
 * dd   → zero-padded day, 01-31
 * M    → month, 1-12
 * MM   → zero-padded month, 01-12
 * yy   → two-digit year, 00-99
 * yyyy → four-digit year
 *
 * h    → hour (24h), 0-23
 * hh   → zero-padded hour, 00-23
 * m    → minutes, 0-59
 * mm   → zero-padded minutes, 00-59
 * s    → seconds, 0-59
 * ss   → zero-padded seconds, 00-59
 * ms   → zero-padded milliseconds, 000-999
 */
export function parseDate(date: Date | undefined, format: string): string {
  if (!date) {
    return "";
  }
  let d = date;
  if (typeof d === "number" || typeof d === "string") {
    d = new Date(d);
  }

  const pad = (num: number, size: number) => String(num).padStart(size, "0");

  const map: Record<string, string> = {
    // year
    yyyy: pad(d.getFullYear(), 4),
    yy: pad(d.getFullYear() % 100, 2),

    // month
    MM: pad(d.getMonth() + 1, 2),
    M: String(d.getMonth() + 1),

    // day
    dd: pad(d.getDate(), 2),
    d: String(d.getDate()),

    // hour
    hh: pad(d.getHours(), 2),
    h: String(d.getHours()),

    // minute
    mm: pad(d.getMinutes(), 2),
    m: String(d.getMinutes()),

    // second
    ss: pad(d.getSeconds(), 2),
    s: String(d.getSeconds()),

    // millisecond (always 3 digits)
    ms: pad(d.getMilliseconds(), 3),
  };

  // replace longest tokens first
  return Object.keys(map)
    .sort((a, b) => b.length - a.length)
    .reduce((str, token) => {
      return str.replace(new RegExp(token, "g"), map[token]);
    }, format);
}

export function upperCaseFirstLetter(value?: string) {
  if (!value) {
    return value;
  }
  const firstChar = value.at(0) as string;
  const firstCharCapitalized = firstChar.toUpperCase() as string;

  return value.replace(firstChar, firstCharCapitalized);
}

/**
 * Takes N cleanup functions and returns a single cleanup
 * that, when invoked, calls each one in turn.
 */
export function combine(...cleanups: Array<() => void>): () => void {
  return () => {
    for (const cleanup of cleanups) {
      try {
        cleanup();
      } catch (e) {
        // swallow errors so one bad cleanup doesn't block the rest
        console.warn("Error during cleanup", e);
      }
    }
  };
}

/**
 * Escape a user‐supplied string so it’s safe in a RegExp.
 */
export function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Returns only those options whose label contains the query (case‐insensitive).
 */
export function filterOptions(options: Option[], query: string): Option[] {
  if (!query || query.length === 0) return options;
  const re = new RegExp(escapeRegExp(query), "i");
  return options.filter((opt) => re.test(opt.label));
}

/**
 * Returns true if *any* option’s label contains the query (case‐insensitive).
 */
export function hasMatch(options: Option[], query: string): boolean {
  if (!query) return false;
  const re = new RegExp(escapeRegExp(query), "i");
  return options.some((opt) => re.test(opt.label));
}

export function simplifyURL(url: string) {
  return url.replace(/(http:\/\/)|(https:\/\/)|(www\.)/, "");
}
