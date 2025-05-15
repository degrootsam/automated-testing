var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable, createCookieSessionStorage } from "@remix-run/node";
import { RemixServer, useLocation, Link, useOutletContext, useFetcher, Meta, Links, Outlet, ScrollRestoration, Scripts, useRouteError, isRouteErrorResponse, useActionData, useLoaderData, redirect, useNavigation, Form, useRevalidator } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { v4 } from "uuid";
import classNames from "classnames";
import { MdNightlight, MdSunny, MdError, MdFiberManualRecord, MdStop } from "react-icons/md";
import { useRef, useEffect, forwardRef, useState, createElement, useId, useCallback } from "react";
import { FaHome, FaPlus, FaTrash, FaCheckCircle, FaArrowAltCircleRight, FaGitAlt, FaSync, FaFolder, FaSave, FaFolderOpen, FaUser, FaQuestionCircle, FaPencilAlt } from "react-icons/fa";
import { FaPlay, FaQuestion, FaGithub, FaPlus as FaPlus$1, FaLink, FaTrash as FaTrash$1, FaArrowRight, FaGear, FaCheck, FaXmark } from "react-icons/fa6";
import fs from "fs";
import path from "path";
import { randomBytes } from "crypto";
import { tmpdir } from "os";
import { Octokit } from "@octokit/rest";
import { execSync } from "node:child_process";
import { VscVscode } from "react-icons/vsc";
import { execSync as execSync$1 } from "child_process";
import { Project as Project$1, SyntaxKind, Node } from "ts-morph";
import { Position, ReactFlow, Background, BackgroundVariant, Controls } from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import pm2 from "pm2";
import { RiRecordCircleLine, RiTestTubeFill } from "react-icons/ri";
import { animate, createTimer } from "animejs";
import { TiFlowChildren } from "react-icons/ti";
import Markdown from "react-markdown";
import { Prism } from "react-syntax-highlighter";
import atomDark from "react-syntax-highlighter/dist/esm/styles/prism/atom-dark.js";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isbot(request.headers.get("user-agent") || "") ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const tailwindStyleSheetURL = "/assets/tailwind-CBqQ_KaR.css";
const baseClass$1 = "btn";
const sizeMapping$2 = {
  xs: "btn-xs",
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
  xl: "btn-xl"
};
const variantMapping = {
  default: "",
  outline: "btn-outline",
  ghost: "btn-ghost",
  link: "btn-link",
  active: "btn-active"
};
const colorMapping$3 = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  accent: "btn-accent",
  info: "btn-info",
  success: "btn-success",
  warning: "btn-warning",
  error: "btn-error",
  neutral: "btn-neutral"
};
const Button = ({
  size,
  variant = "default",
  color,
  loading = false,
  square = false,
  className = "",
  children,
  ghost,
  ...props
}) => {
  const sizeClass = size ? sizeMapping$2[size] : "";
  const variantClass = variantMapping[variant];
  const colorClass = color ? colorMapping$3[color] : "";
  const ghostClass = ghost ? "btn-ghost" : "";
  const shapeClass = square ? "btn-square" : "";
  const loadingClass = loading ? "loading" : "";
  const finalClassName = [
    baseClass$1,
    sizeClass,
    variantClass,
    colorClass,
    shapeClass,
    ghostClass,
    className
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsxs("button", { className: finalClassName, ...props, disabled: loading, children: [
    loading && /* @__PURE__ */ jsx("span", { className: loadingClass }),
    children
  ] });
};
const colorMapping$2 = {
  primary: "alert-primary",
  secondary: "alert-secondary",
  success: "alert-success",
  warning: "alert-warning",
  error: "alert-error",
  info: "alert-info",
  accent: "alert-accent",
  neutral: "alert-neutral"
};
const outlineMapping = {
  dash: "alert-dash",
  outline: "alert-outline"
};
const layoutMapping = {
  horizontal: "alert-horizontal",
  vertical: "alert-vertical"
};
function Alert({
  message,
  color,
  outline,
  icon: Icon,
  className,
  soft = true,
  layout = "horizontal",
  buttons = []
}) {
  const colorClass = colorMapping$2[color];
  const outlineClass = outline ? outlineMapping[outline] : "";
  const softClass = soft ? "alert-soft" : "";
  const layoutClass = layoutMapping[layout];
  const finalClass = `alert ${colorClass} ${outlineClass} ${softClass} ${layoutClass} ${className}`;
  return /* @__PURE__ */ jsxs("div", { role: "alert", className: finalClass, children: [
    Icon && /* @__PURE__ */ jsx(Icon, { className: "stroke-info h-6 w-6 shrink-0" }),
    /* @__PURE__ */ jsx("span", { children: message }),
    /* @__PURE__ */ jsx("div", { children: buttons.map((b) => /* @__PURE__ */ jsx(Button, { className: "btn-sm", ...b }, v4())) })
  ] });
}
function Spin({
  children,
  direction = "cw",
  loop = true,
  duration = 1e3,
  className = ""
}) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const rotation = direction === "cw" ? "360deg" : "-360deg";
    const animation = animate(ref.current, {
      rotate: rotation,
      duration,
      easing: "linear",
      loop
    });
    return () => {
      animation.pause();
    };
  }, [direction, loop, duration]);
  return /* @__PURE__ */ jsx("div", { ref, className, children });
}
function Timer({ countTo, options }) {
  const ref = useRef(null);
  createTimer({
    onUpdate: (self) => ref.current && (ref.current.innerHTML = self.currentTime.toString()),
    frameRate: 60,
    duration: countTo,
    ...options
  });
  return /* @__PURE__ */ jsx("span", { ref, children: "0" });
}
const sizeClassMapping = {
  xs: "badge-xs",
  sm: "badge-sm",
  md: "badge-md",
  lg: "badge-lg",
  xl: "badge-xl"
};
const colorClassMapping = {
  primary: "badge-primary",
  secondary: "badge-secondary",
  accent: "badge-accent",
  info: "badge-info",
  success: "badge-success",
  warning: "badge-warning",
  error: "badge-error",
  neutral: "badge-neutral"
};
const outlinedColorClassMapping = {
  primary: "badge-outline badge-primary",
  secondary: "badge-outline badge-secondary",
  accent: "badge-outline badge-accent",
  info: "badge-outline badge-info",
  success: "badge-outline badge-success",
  warning: "badge-outline badge-warning",
  error: "badge-outline badge-error",
  neutral: "badge-outline badge-neutral"
};
function Badge({
  size,
  color,
  outline = false,
  className = "",
  children,
  soft = false,
  buttonProps
}) {
  const baseClass2 = "badge";
  const sizeClasses = size ? sizeClassMapping[size] : "";
  const softClass = soft ? "badge-soft" : "";
  let colorClasses = "";
  if (color) {
    colorClasses = outline ? outlinedColorClassMapping[color] : colorClassMapping[color];
  }
  const finalClasses = `${baseClass2} ${sizeClasses} ${colorClasses} ${softClass} ${className}`.trim();
  const B = () => /* @__PURE__ */ jsx("span", { className: finalClasses, children });
  if (buttonProps == null ? void 0 : buttonProps.onClick) {
    return /* @__PURE__ */ jsx("button", { ...buttonProps, type: "button", children: /* @__PURE__ */ jsx(B, {}) });
  }
  return /* @__PURE__ */ jsx(B, {});
}
function Card({ children, className }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: classNames(className, "p-8 rounded-lg bg-base-100 shadow-md"),
      children
    }
  );
}
function MockCode({ code }) {
  const markdown = `~~~typescript
${code}
~~~`;
  return /* @__PURE__ */ jsx(
    Markdown,
    {
      components: {
        code(props) {
          const { children } = props;
          return /* @__PURE__ */ jsx(
            Prism,
            {
              PreTag: "div",
              language: "typescript",
              style: atomDark,
              children: String(children).replace(/\n$/, "")
            }
          );
        }
      },
      children: markdown
    }
  );
}
const variantClassMapping = {
  arrow: "collapse-arrow",
  plus: "collapse-plus"
};
const bgClassMapping = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  accent: "bg-accent",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
  neutral: "bg-neutral",
  transparent: ""
};
const borderColorClassMapping = {
  primary: "border-primary",
  secondary: "border-secondary",
  accent: "border-accent",
  info: "border-info",
  success: "border-success",
  warning: "border-warning",
  error: "border-error",
  neutral: "border-neutral",
  transparent: ""
};
const Collapse = forwardRef((props, ref) => {
  const {
    title,
    children,
    variant,
    bordered = true,
    color,
    bgClassName = "bg-base-300",
    className = "",
    open,
    readonly,
    onChange
  } = props;
  const classes = classNames(
    "collapse",
    variant && variantClassMapping[variant],
    color ? bgClassMapping[color] : "bg-base-100",
    bordered && "border",
    color ? borderColorClassMapping[color] : "border-base-300",
    className
  );
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    /* @__PURE__ */ jsxs("div", { tabIndex: 0, className: classes, ref, children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "checkbox",
          checked: open,
          onChange,
          readOnly: readonly
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "collapse-title font-semibold", children: title }),
      /* @__PURE__ */ jsx("div", { className: classNames("collapse-content text-sm ", bgClassName), children })
    ] })
  );
});
const headingStyles = {
  h1: "text-4xl md:text-5xl font-extrabold tracking-tight",
  h2: "text-3xl md:text-4xl font-bold tracking-tight",
  h3: "text-2xl font-semibold",
  h4: "text-xl font-medium",
  h5: "text-lg font-medium text-base-content/80",
  h6: "text-base font-medium uppercase text-base-content/60 tracking-wide"
};
function Heading({
  size = "h2",
  children,
  className = ""
}) {
  const Tag = size;
  return /* @__PURE__ */ jsx(Tag, { className: classNames(headingStyles[size], className), children });
}
const baseToggleClass = "toggle";
const toggleSizeMapping = {
  xs: "toggle-xs",
  sm: "toggle-sm",
  md: "toggle-md",
  lg: "toggle-lg",
  xl: "toggle-xl"
};
const toggleColorMapping = {
  primary: "toggle-primary",
  secondary: "toggle-secondary",
  accent: "toggle-accent",
  neutral: "toggle-neutral",
  info: "toggle-info",
  success: "toggle-success",
  warning: "toggle-warning",
  error: "toggle-error"
};
function Toggle({
  size,
  color,
  indeterminate = false,
  label,
  legend,
  iconEnabled: IconEnabled,
  iconDisabled: IconDisabled,
  className = "",
  ...props
}) {
  const inputRef = useRef(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);
  const classes = [baseToggleClass];
  if (size && toggleSizeMapping[size]) {
    classes.push(toggleSizeMapping[size]);
  }
  if (color && toggleColorMapping[color]) {
    classes.push(toggleColorMapping[color]);
  }
  if (className) {
    classes.push(className);
  }
  const finalClassName = !IconEnabled && !IconEnabled && classes.join(" ") || "";
  const inputElement = /* @__PURE__ */ jsx(
    "input",
    {
      ref: inputRef,
      type: "checkbox",
      className: finalClassName,
      ...props
    }
  );
  let content;
  if (IconEnabled && IconDisabled) {
    content = /* @__PURE__ */ jsxs("label", { className: "toggle text-base-content", children: [
      inputElement,
      /* @__PURE__ */ jsx(IconDisabled, { "aria-label": "disabled" }),
      /* @__PURE__ */ jsx(IconEnabled, { "aria-label": "enabled" })
    ] });
  } else if (label) {
    content = /* @__PURE__ */ jsxs("label", { className: "flex items-center space-x-2", children: [
      inputElement,
      /* @__PURE__ */ jsx("span", { children: label })
    ] });
  } else {
    content = inputElement;
  }
  if (legend) {
    content = /* @__PURE__ */ jsxs("fieldset", { className: "fieldset p-4 bg-base-100 border border-base-300 rounded-box w-64", children: [
      /* @__PURE__ */ jsx("legend", { className: "fieldset-legend", children: legend }),
      content
    ] });
  }
  return content;
}
function useTheme(initialTheme) {
  const getInitialTheme = () => {
    if (initialTheme) return initialTheme;
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  };
  const [theme, setThemeState] = useState(getInitialTheme());
  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", newTheme);
      console.log(`Theme set to ${newTheme}`);
    }
  };
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);
  return [theme, setTheme];
}
function parseName(name) {
  const lowercase = name.toLowerCase();
  const normalized = lowercase.replaceAll("_", "-").replaceAll(" ", "-").replaceAll(/[^-A-Za-z]/g, "");
  return normalized;
}
function parseErrorToMessage(err) {
  return isErrorWithMessage(err) ? err.message : isServerErrorWithMessage(err) ? err.error.message : "";
}
function isErrorWithMessage(error) {
  if (typeof error === "object" && error !== null && "message" in error) {
    const maybeMessage = error.message;
    return typeof maybeMessage === "string";
  }
  return false;
}
function isServerErrorWithMessage(error) {
  if (typeof error === "object" && error !== null && "error" in error) {
    const maybeError = error.error;
    return typeof maybeError === "object" && "message" in maybeError;
  }
  return false;
}
function humanizeMSTime(ms) {
  const elapsed = Date.now() - ms;
  const sec = Math.floor(elapsed / 1e3 % 60);
  const min = Math.floor(elapsed / (1e3 * 60) % 60);
  const hrs = Math.floor(elapsed / (1e3 * 60 * 60));
  return `${hrs}h ${min}m ${sec}s`;
}
function parseDate(date, format) {
  if (!date) {
    return "";
  }
  let d = date;
  if (typeof d === "number" || typeof d === "string") {
    d = new Date(d);
  }
  const pad = (num, size) => String(num).padStart(size, "0");
  const map = {
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
    ms: pad(d.getMilliseconds(), 3)
  };
  return Object.keys(map).sort((a, b) => b.length - a.length).reduce((str, token) => {
    return str.replace(new RegExp(token, "g"), map[token]);
  }, format);
}
function upperCaseFirstLetter(value) {
  if (!value) {
    return value;
  }
  const firstChar = value.at(0);
  const firstCharCapitalized = firstChar.toUpperCase();
  return value.replace(firstChar, firstCharCapitalized);
}
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function filterOptions(options, query) {
  if (!query || query.length === 0) return options;
  const re = new RegExp(escapeRegExp(query), "i");
  return options.filter((opt) => re.test(opt.label));
}
function simplifyURL(url) {
  return url.replace(/(http:\/\/)|(https:\/\/)|(www\.)/, "");
}
function usePolling(shouldPoll, endpoint, delayMs = 1e3, fetchOptions) {
  const [data, setData] = useState();
  const [error, setError] = useState();
  const pollingRef = useRef(shouldPoll);
  pollingRef.current = shouldPoll;
  useEffect(() => {
    let timer;
    let cancelled = false;
    const poll = async () => {
      if (!pollingRef.current || cancelled) return;
      try {
        const res = await fetch(endpoint, fetchOptions);
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
        const json = await res.json();
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
function ThemeSwitcher({
  preferredTheme
}) {
  const [theme, setTheme] = useTheme(preferredTheme);
  const toggleTheme = async () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    const formData = new FormData();
    formData.append("theme", newTheme);
    await fetch("/theme/set", { method: "POST", body: formData });
    setTheme(newTheme);
  };
  return /* @__PURE__ */ jsx(
    Toggle,
    {
      iconEnabled: MdSunny,
      iconDisabled: MdNightlight,
      checked: theme === "light",
      onChange: toggleTheme
    }
  );
}
function Drawer({
  children,
  drawerItems,
  id = "my-drawer",
  title,
  preferredTheme
}) {
  var _a;
  const inputId = `${id}-toggle`;
  const location = useLocation();
  const activeLink = (_a = drawerItems.find(
    ({ baseURL }) => location.pathname.includes(baseURL)
  )) == null ? void 0 : _a.baseURL;
  return /* @__PURE__ */ jsxs("div", { className: "drawer lg:drawer-open", children: [
    /* @__PURE__ */ jsx("input", { id: inputId, type: "checkbox", className: "drawer-toggle" }),
    /* @__PURE__ */ jsxs("div", { className: "drawer-content flex flex-col items-center justify-center", children: [
      /* @__PURE__ */ jsx(
        "label",
        {
          htmlFor: inputId,
          className: "btn btn-primary drawer-button lg:hidden mt-4 absolute right-0 top-0",
          children: "Open drawer"
        }
      ),
      children
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "drawer-side", children: [
      /* @__PURE__ */ jsx(
        "label",
        {
          htmlFor: inputId,
          "aria-label": "close sidebar",
          className: "drawer-overlay"
        }
      ),
      /* @__PURE__ */ jsxs("ul", { className: "menu bg-base-200 text-base-content min-h-full w-80 p-4", children: [
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsxs("p", { className: "text-sm opacity-30 text-neutral flex flex-row gap-2 items-center", children: [
          /* @__PURE__ */ jsx(FaHome, {}),
          "Projects /"
        ] }) }) }),
        title && /* @__PURE__ */ jsx("li", { className: "mb-4", children: /* @__PURE__ */ jsx(Heading, { size: "h3", className: "text-center", children: title }) }),
        drawerItems.map((item, idx) => /* @__PURE__ */ jsx(
          "li",
          {
            className: activeLink === item.baseURL ? "bg-base-300" : "",
            children: /* @__PURE__ */ jsx(Link, { to: item.baseURL + item.href, children: item.label })
          },
          idx
        ))
      ] }),
      /* @__PURE__ */ jsx("div", { className: "relative flex items-center justify-center w-full", children: /* @__PURE__ */ jsx("div", { className: "absolute bottom-8", children: /* @__PURE__ */ jsx(ThemeSwitcher, { preferredTheme }) }) })
    ] })
  ] });
}
const baseClass = "status";
const statusSizeMapping = {
  xs: "status-xs",
  sm: "status-sm",
  md: "status-md",
  lg: "status-lg",
  xl: "status-xl"
};
const statusColorMapping = {
  primary: "status-primary",
  secondary: "status-secondary",
  accent: "status-accent",
  neutral: "status-neutral",
  info: "status-info",
  success: "status-success",
  warning: "status-warning",
  error: "status-error"
};
const animationMapping = {
  ping: "animate-ping",
  bounce: "animate-bounce"
};
function Status({
  size,
  color,
  animate: animate2,
  overlay = false,
  ariaLabel,
  className = "",
  ...props
}) {
  const classes = [baseClass];
  if (size && statusSizeMapping[size]) {
    classes.push(statusSizeMapping[size]);
  }
  if (color && statusColorMapping[color]) {
    classes.push(statusColorMapping[color]);
  }
  if (animate2 && !overlay && animationMapping[animate2]) {
    classes.push(animationMapping[animate2]);
  }
  if (className) {
    classes.push(className);
  }
  const finalClassName = classes.join(" ");
  if (overlay && animate2 === "ping") {
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: "inline-grid",
        "aria-label": ariaLabel,
        ...props,
        style: { gridTemplateAreas: `"overlap"`, position: "relative" },
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: [
                baseClass,
                color ? statusColorMapping[color] : "",
                animationMapping["ping"]
              ].filter(Boolean).join(" "),
              style: { gridArea: "overlap" }
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: [baseClass, color ? statusColorMapping[color] : ""].filter(Boolean).join(" "),
              style: { gridArea: "overlap" }
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsx("span", { "aria-label": ariaLabel, className: finalClassName, ...props });
}
function Tooltip({
  children,
  message,
  className
}) {
  return /* @__PURE__ */ jsx("div", { className: classNames("tooltip", className), "data-tip": message, children });
}
function List({
  title,
  items,
  button,
  noResultsText,
  className
}) {
  return /* @__PURE__ */ jsxs(
    "ul",
    {
      className: classNames(
        "list bg-base-100 rounded-box shadow-md w-full",
        className
      ),
      children: [
        title ? /* @__PURE__ */ jsx("li", { className: "p-4 pb-2 text-xs opacity-60 tracking-wide", children: button ? /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-between", children: [
          title,
          button
        ] }) : title }) : /* @__PURE__ */ jsx(Fragment, {}),
        items.length > 0 ? items.map((item) => /* @__PURE__ */ createElement(ListItem, { ...item, key: v4() })) : /* @__PURE__ */ jsx("div", { className: "p-8 bg-base-200", children: /* @__PURE__ */ jsx("p", { className: "text-center font-medium text-neutral opacity-50", children: noResultsText }) })
      ]
    }
  );
}
function ListItem({
  title,
  subtitle,
  icon: Icon,
  buttons,
  status,
  statusPosition = "end"
}) {
  function StatusComponent(props) {
    return /* @__PURE__ */ jsx("div", { className: "h-full flex items-center", children: /* @__PURE__ */ jsx(Tooltip, { message: props.ariaLabel || "", children: /* @__PURE__ */ jsx(Status, { ...props }) }) });
  }
  return /* @__PURE__ */ jsxs("li", { className: "list-row", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center gap-4", children: [
      statusPosition === "start" && status && /* @__PURE__ */ jsx(StatusComponent, { ...status }),
      Icon && /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Icon, { className: "size-10 rounded-box text-neutral-content" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: !subtitle ? "flex flex-col justify-center" : "", children: [
      /* @__PURE__ */ jsx("div", { children: title }),
      subtitle && /* @__PURE__ */ jsx("div", { className: "text-xs uppercase font-semibold opacity-60", children: subtitle })
    ] }),
    buttons && buttons.length && buttons.map((button) => /* @__PURE__ */ jsx(ListItemButton, { ...button }, v4())),
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center", children: statusPosition === "end" && status && /* @__PURE__ */ jsx(StatusComponent, { ...status }) })
  ] });
}
const ListItemButton = ({
  onClick,
  href,
  icon: BtnIcon,
  tooltip,
  target,
  ...props
}) => {
  const ButtonComponent = () => {
    if (href) {
      return /* @__PURE__ */ jsx(
        Link,
        {
          to: href,
          target,
          referrerPolicy: target === "_blank" ? "no-referrer" : "",
          children: /* @__PURE__ */ jsx(Button, { onClick, className: "btn-square btn-ghost", ...props, children: /* @__PURE__ */ jsx(BtnIcon, { className: "size-[1.2em]  opacity-60" }) })
        }
      );
    }
    return /* @__PURE__ */ jsx(Button, { onClick, square: true, className: "btn-ghost", ...props, children: /* @__PURE__ */ jsx(BtnIcon, { className: "size-[1.2em] opacity-60" }) });
  };
  if (tooltip) {
    return /* @__PURE__ */ jsx(Tooltip, { message: tooltip, children: /* @__PURE__ */ jsx(ButtonComponent, {}) });
  }
  return /* @__PURE__ */ jsx(ButtonComponent, {});
};
function Modal({
  showModal,
  children,
  title,
  onHideModal,
  buttons = [],
  className
}) {
  const id = useId();
  useEffect(() => {
    const modal = document.getElementById(id);
    if (!modal) return;
    if (showModal) {
      modal.showModal();
    } else {
      modal.close();
    }
  }, [showModal, id]);
  useEffect(() => {
    function handlePressEscape(event) {
      if (event.key === "Escape" && showModal && onHideModal) {
        onHideModal();
      }
    }
    document.addEventListener("keydown", handlePressEscape);
    return () => {
      document.removeEventListener("keydown", handlePressEscape);
    };
  }, [showModal, onHideModal]);
  const handleClose = (event) => {
    event.preventDefault();
    onHideModal && onHideModal();
  };
  return /* @__PURE__ */ jsx("dialog", { id, className: "modal", children: /* @__PURE__ */ jsxs("div", { className: classNames("modal-box max-w-xl w-full", className), children: [
    /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg", children: title }),
    /* @__PURE__ */ jsx("div", { className: "py-4", children }),
    /* @__PURE__ */ jsxs("div", { className: "modal-action", children: [
      /* @__PURE__ */ jsx(Button, { onClick: handleClose, children: "Close" }),
      buttons.map((b) => /* @__PURE__ */ createElement(Button, { ...b, key: v4() }))
    ] })
  ] }) });
}
const progressColorMapping = {
  neutral: "progress-neutral",
  primary: "progress-primary",
  secondary: "progress-secondary",
  accent: "progress-accent",
  info: "progress-info",
  success: "progress-success",
  warning: "progress-warning",
  error: "progress-error"
};
function Progress({
  color = "primary",
  value,
  max,
  className = "",
  ...props
}) {
  const finalClassName = ["progress", progressColorMapping[color], className].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsx("progress", { className: finalClassName, value, max, ...props });
}
const colorMapping$1 = {
  primary: "input-primary",
  secondary: "input-secondary",
  accent: "input-accent",
  info: "input-info",
  neutral: "input-neutral",
  success: "input-success",
  warning: "input-warning",
  error: "input-error",
  ghost: "input-ghost"
};
const sizeMapping$1 = {
  xs: "input-xs",
  sm: "input-sm",
  md: "input-md",
  lg: "input-lg",
  xl: "input-xl"
};
function TextField({
  color = "primary",
  size = "md",
  placeholder = "Type something",
  icon: Icon,
  iconPlacement = "start",
  name,
  className,
  label,
  labelPlacement = "start",
  children,
  ...inputProps
}) {
  const colorClass = colorMapping$1[color];
  const sizeClass = sizeMapping$1[size];
  const finalClassName = `input ${colorClass} ${sizeClass} ${className}`;
  if (Icon || label) {
    return /* @__PURE__ */ jsxs("label", { className: finalClassName, htmlFor: name, children: [
      Icon && iconPlacement === "start" && /* @__PURE__ */ jsx(Icon, { size: 24, className: " opacity-50" }),
      label && labelPlacement === "start" && /* @__PURE__ */ jsx("span", { className: "label", children: label }),
      children,
      /* @__PURE__ */ jsx(
        "input",
        {
          ...inputProps,
          name,
          className: "grow",
          placeholder
        }
      ),
      Icon && iconPlacement === "end" && /* @__PURE__ */ jsx(Icon, { size: 24, className: " opacity-50" }),
      label && labelPlacement === "end" && /* @__PURE__ */ jsx("span", { className: "label", children: label })
    ] });
  }
  return /* @__PURE__ */ jsx(
    "input",
    {
      ...inputProps,
      name,
      className: finalClassName,
      placeholder
    }
  );
}
function Autocomplete({
  className,
  textfieldClassName,
  options,
  onSearchChange,
  name,
  value = "",
  debounce = 0,
  ...props
}) {
  const [search, setSearch] = useState("");
  const [currentValue, setCurrentValue] = useState(value.toString());
  const [showOptions, setShowOptions] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);
  const containerRef = useRef(null);
  const onBlur = (event) => {
    var _a;
    if (event.relatedTarget != null && ((_a = containerRef.current) == null ? void 0 : _a.contains(event.relatedTarget))) {
      return;
    }
    setShowOptions(false);
  };
  const onFocus = () => {
    setShowOptions(true);
  };
  const onClick = (event) => {
    const { dataset } = event.currentTarget;
    const value2 = dataset.value;
    const label = dataset.label;
    if (!value2 || !label) return;
    setCurrentValue(value2);
    setSearch(label);
    setShowOptions(false);
  };
  const OptionComponent = ({ option }) => {
    return /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick,
        className: "w-full py-2 px-4 flex flex-row hover:bg-base-200",
        "data-value": option.value,
        "data-label": option.label,
        children: option.label
      }
    );
  };
  useEffect(() => {
    setFilteredOptions(filterOptions(options, search));
    const timer = setTimeout(() => {
      onSearchChange(search);
    }, debounce);
    return () => clearTimeout(timer);
  }, [search]);
  const onChangeSearch = (event) => {
    const value2 = event.currentTarget.value;
    setSearch(value2);
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: containerRef,
      className: classNames(className),
      onBlur,
      onFocus,
      tabIndex: -1,
      children: [
        /* @__PURE__ */ jsx("input", { type: "hidden", name, value: currentValue }),
        /* @__PURE__ */ jsx(
          TextField,
          {
            ...props,
            className: classNames("w-full", textfieldClassName),
            onChange: onChangeSearch,
            value: search,
            children: "Test"
          }
        ),
        showOptions && /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsxs("div", { className: "absolute pt-2 z-10 bg-base-100 w-full border-l border-r border-b border-neutral", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs opacity-30 mx-2", children: "Choose an option:" }),
          filteredOptions.map((option) => /* @__PURE__ */ jsx(OptionComponent, { option }, option.value))
        ] }) })
      ]
    }
  );
}
function RunTestButton({
  type
}) {
  const { project, suite, testName } = useOutletContext();
  const fetcher = useFetcher({
    key: "run-test"
  });
  const handleClick = (event) => {
    event.preventDefault();
    let action2 = "";
    switch (type) {
      case "test":
        action2 = `/api/tests/${project.name}/${suite}/${testName}/run`;
        break;
      case "suite":
        action2 = `/api/tests/${project.name}/${suite}/run`;
        break;
      case "project":
        action2 = `/api/tests/${project.name}/run`;
        break;
      default:
        throw new Error(
          `${type} is not a valid type for <RunSingleTestButton />`
        );
    }
    fetcher.submit(null, {
      action: action2,
      method: "POST",
      preventScrollReset: true
    });
  };
  useEffect(() => {
    if (fetcher.data) {
      const process2 = fetcher.data.process;
      if (process2 && (process2 == null ? void 0 : process2.stderr)) {
        throw new Error(`Unable to start test: ${(process2 == null ? void 0 : process2.stderr) || "unkown"}`);
      }
    }
  }, [fetcher.data]);
  return /* @__PURE__ */ jsxs(
    Button,
    {
      type: "submit",
      color: "primary",
      onClick: handleClick,
      loading: fetcher.state !== "idle",
      children: [
        /* @__PURE__ */ jsx(FaPlay, {}),
        "Run"
      ]
    }
  );
}
function CreateTestSuiteModal({
  showModal,
  onHideModal,
  project,
  onSuccess
}) {
  const formRef = useRef(null);
  const fetcher = useFetcher();
  const handleClickCreate = (event) => {
    event.preventDefault();
    if (!formRef.current) return;
    fetcher.submit(formRef.current, { method: "POST" });
  };
  const handleFetcherResponse = useCallback(() => {
    if (fetcher.data) {
      if (!isServerErrorWithMessage(fetcher.data)) {
        onHideModal && onHideModal();
        onSuccess();
        fetcher.data = void 0;
      }
    }
  }, [onHideModal, onSuccess, fetcher]);
  useEffect(() => {
    handleFetcherResponse();
  }, [handleFetcherResponse]);
  return /* @__PURE__ */ jsx(
    Modal,
    {
      showModal,
      onHideModal,
      title: "Create Test Suite",
      buttons: [
        {
          children: /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(FaPlus, {}),
            "Create"
          ] }),
          color: "primary",
          onClick: handleClickCreate,
          loading: fetcher.state !== "idle"
        }
      ],
      children: /* @__PURE__ */ jsxs(fetcher.Form, { action: "../suites/create", method: "POST", ref: formRef, children: [
        /* @__PURE__ */ jsxs("p", { className: "text-sm mb-4", children: [
          "Most Betty Blocks applications are secured with",
          " ",
          /* @__PURE__ */ jsx("b", { children: "Role Based Access Control" }),
          ". Therefore, the test suites you create should be based on the roles in your application."
        ] }),
        isServerErrorWithMessage(fetcher.data) && /* @__PURE__ */ jsx(Alert, { message: fetcher.data.error.message, color: "error" }),
        /* @__PURE__ */ jsx("input", { type: "hidden", name: "project", value: project.name }),
        /* @__PURE__ */ jsx(
          TextField,
          {
            name: "name",
            disabled: fetcher.state !== "idle",
            className: "w-full",
            placeholder: "E.g: Admin",
            required: true
          }
        )
      ] })
    }
  );
}
function DeleteDependencyModal({
  dependency,
  project,
  showModal,
  onSuccess,
  onHideModal
}) {
  const formRef = useRef(null);
  const fetcher = useFetcher({ key: "delete-test" });
  const handleClickConfirm = (event) => {
    event.preventDefault();
    if (!formRef.current) return;
    fetcher.submit(formRef.current, {
      method: "POST",
      action: `/api/projects/${project.name}/setup/delete`
    });
  };
  const handleFetcherResponse = useCallback(() => {
    if (fetcher.data) {
      if (isServerErrorWithMessage(fetcher.data)) return;
      onHideModal && onHideModal();
      onSuccess();
      fetcher.data = void 0;
    }
  }, [onHideModal, onSuccess, fetcher]);
  useEffect(() => {
    handleFetcherResponse();
  }, [handleFetcherResponse]);
  return /* @__PURE__ */ jsxs(
    Modal,
    {
      showModal,
      onHideModal,
      title: "Are you sure?",
      buttons: [
        {
          children: /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(FaTrash, {}),
            "Confirm"
          ] }),
          color: "error",
          onClick: handleClickConfirm,
          loading: fetcher.state !== "idle"
        }
      ],
      children: [
        /* @__PURE__ */ jsxs("p", { className: "text-sm", children: [
          "Are you sure you want to delete dependency ",
          /* @__PURE__ */ jsx("b", { children: dependency }),
          "?"
        ] }),
        isServerErrorWithMessage(fetcher.data) && /* @__PURE__ */ jsx(
          Alert,
          {
            message: fetcher.data.error.message,
            className: "mt-2",
            color: "error"
          }
        ),
        /* @__PURE__ */ jsx(fetcher.Form, { ref: formRef, children: /* @__PURE__ */ jsx("input", { type: "hidden", name: "setup", value: dependency }) })
      ]
    }
  );
}
function DeleteTestSuiteModal({
  suite,
  project,
  showModal,
  onSuccess,
  onHideModal
}) {
  const formRef = useRef(null);
  const fetcher = useFetcher();
  const handleClickDelete = (event) => {
    event.preventDefault();
    if (!formRef.current) return;
    fetcher.submit(formRef.current, {
      method: "DELETE",
      action: `/projects/${project.name}/suites/delete`
    });
  };
  const handleFetcherResponse = useCallback(() => {
    if (fetcher.data) {
      if (isServerErrorWithMessage(fetcher.data)) return;
      onHideModal && onHideModal();
      onSuccess();
      fetcher.data = void 0;
    }
  }, [onHideModal, onSuccess, fetcher]);
  useEffect(() => {
    handleFetcherResponse();
  }, [handleFetcherResponse]);
  return /* @__PURE__ */ jsxs(
    Modal,
    {
      showModal,
      onHideModal,
      title: "Are you sure?",
      buttons: [
        {
          children: /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(FaTrash, {}),
            "Confirm"
          ] }),
          color: "error",
          onClick: handleClickDelete,
          loading: fetcher.state !== "idle"
        }
      ],
      children: [
        /* @__PURE__ */ jsxs("p", { className: "text-sm", children: [
          "Are you sure you want to delete test suite ",
          /* @__PURE__ */ jsx("b", { children: suite }),
          "?"
        ] }),
        isServerErrorWithMessage(fetcher.data) && /* @__PURE__ */ jsx(
          Alert,
          {
            message: fetcher.data.error.message,
            className: "mt-2",
            color: "error"
          }
        ),
        /* @__PURE__ */ jsx(fetcher.Form, { ref: formRef, children: /* @__PURE__ */ jsx("input", { type: "hidden", name: "suite", value: suite }) })
      ]
    }
  );
}
function DeleteTestModal({
  test,
  suite,
  project,
  showModal,
  onSuccess,
  onHideModal
}) {
  const formRef = useRef(null);
  const fetcher = useFetcher({ key: "delete-test" });
  const handleClickConfirm = (event) => {
    event.preventDefault();
    if (!formRef.current) return;
    console.log(`/projects/${project.name}/suites/${suite}/tests/delete`);
    fetcher.submit(formRef.current, {
      method: "POST",
      action: `/projects/${project.name}/suites/${suite}/tests/delete`
    });
  };
  const handleFetcherResponse = useCallback(() => {
    if (fetcher.data) {
      if (isServerErrorWithMessage(fetcher.data)) return;
      onHideModal && onHideModal();
      onSuccess();
      fetcher.data = void 0;
    }
  }, [onHideModal, onSuccess, fetcher]);
  useEffect(() => {
    handleFetcherResponse();
  }, [handleFetcherResponse]);
  return /* @__PURE__ */ jsxs(
    Modal,
    {
      showModal,
      onHideModal,
      title: "Are you sure?",
      buttons: [
        {
          children: /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(FaTrash, {}),
            "Confirm"
          ] }),
          color: "error",
          onClick: handleClickConfirm,
          loading: fetcher.state !== "idle"
        }
      ],
      children: [
        /* @__PURE__ */ jsxs("p", { className: "text-sm", children: [
          "Are you sure you want to delete test ",
          /* @__PURE__ */ jsx("b", { children: test }),
          "?"
        ] }),
        isServerErrorWithMessage(fetcher.data) && /* @__PURE__ */ jsx(
          Alert,
          {
            message: fetcher.data.error.message,
            className: "mt-2",
            color: "error"
          }
        ),
        /* @__PURE__ */ jsx(fetcher.Form, { ref: formRef, children: /* @__PURE__ */ jsx("input", { type: "hidden", name: "test", value: test }) })
      ]
    }
  );
}
function HelpDependencyModal(props) {
  return /* @__PURE__ */ jsx(Modal, { ...props, title: "Help: Dependencies", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-4", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "font-bold", children: "What are dependencies?" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Dependencies are simply “pre-tests” you record once and then re-run automatically whenever you run or record a suite. By turning common setup flows (like logging in) into dependencies, you avoid repeating them in every test." })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "font-bold", children: "Nested dependencies" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Each dependency can itself depend on other tests, forming a dependency tree. For example, you might have a User Login dependency which in turn depends on Admin Login." })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "font-bold", children: "Parallel vs. Chained Execution" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm", children: "By default, all dependencies of a suite run in parallel—they start at the same time. If you need a true “step 1 → step 2 → step 3” setup (a chained flow), give each setup test its own dependency." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "text-sm", children: [
      /* @__PURE__ */ jsx("p", { className: "font-bold", children: "Example: " }),
      /* @__PURE__ */ jsxs("ul", { children: [
        /* @__PURE__ */ jsx("li", { children: "Create Admin Login" }),
        /* @__PURE__ */ jsx("li", { children: "Create User Login and set it to depend on Admin Login" })
      ] }),
      /* @__PURE__ */ jsx("p", { children: "That way, you get:" }),
      /* @__PURE__ */ jsxs("ul", { children: [
        /* @__PURE__ */ jsx("li", { children: "Reusability: record your login flow once, reuse everywhere" }),
        /* @__PURE__ */ jsx("li", { children: "Flexibility: spin up multiple setups in parallel for speed, or chain them for strict order" })
      ] })
    ] })
  ] }) });
}
const colorMapping = {
  primary: "radio-primary",
  secondary: "radio-secondary",
  success: "radio-success",
  warning: "radio-warning",
  error: "radio-error",
  accent: "radio-accent",
  info: "radio-info",
  neutral: "radio-neutral"
};
const sizeMapping = {
  xs: "radio-xs",
  sm: "radio-sm",
  md: "radio-md",
  lg: "radio-lg",
  xl: "radio-xl"
};
function Radio({ color, size, ...rest }) {
  const sizeClass = size ? sizeMapping[size] : "";
  const colorClass = color ? colorMapping[color] : "";
  return /* @__PURE__ */ jsx(
    "input",
    {
      ...rest,
      type: "radio",
      className: classNames(sizeClass, colorClass, "radio")
    }
  );
}
function Page({
  title,
  children,
  preferredTheme,
  withDrawer,
  drawerItems = [],
  className
}) {
  if (withDrawer) {
    return /* @__PURE__ */ jsx(
      Drawer,
      {
        drawerItems,
        title,
        preferredTheme,
        children: /* @__PURE__ */ jsx("div", { className: "w-full h-full p-8 bg-base-300", children })
      }
    );
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: classNames(
        "flex-col flex h-screen items-center justify-center bg-base-300",
        className
      ),
      children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-10 right-10", children: /* @__PURE__ */ jsx(ThemeSwitcher, { preferredTheme }) }),
        /* @__PURE__ */ jsx("div", { className: "max-w-2xl", children: !withDrawer && title && /* @__PURE__ */ jsx(Heading, { size: "h1", className: "mb-10 text-center", children: title }) }),
        children
      ]
    }
  );
}
const links$2 = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
  },
  {
    rel: "stylesheet",
    href: tailwindStyleSheetURL
  }
];
function App() {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx(Outlet, {}),
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
      /* @__PURE__ */ jsxs("head", { children: [
        /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
        /* @__PURE__ */ jsx(
          "meta",
          {
            name: "viewp;ort",
            content: "width=device-width, initial-scale=1"
          }
        ),
        /* @__PURE__ */ jsx(Meta, {}),
        /* @__PURE__ */ jsx(Links, {})
      ] }),
      /* @__PURE__ */ jsxs("body", { children: [
        /* @__PURE__ */ jsx(
          Page,
          {
            title: `${error.status}: ${error.statusText}`,
            className: "text-error",
            children: /* @__PURE__ */ jsxs(Card, { className: "max-w-xl w-full", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold  mb-4", children: "The back-end produced the following error:" }),
              /* @__PURE__ */ jsx(
                Alert,
                {
                  color: "error",
                  message: error.data || error.statusText,
                  className: "mb-4",
                  icon: MdError
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "flex flex-row justify-end gap-1" })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(Scripts, {})
      ] })
    ] });
  }
  const errorMessage = error && typeof error === "object" && "message" in error ? error.message : "Unkown error";
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx(Page, { title: "Uh ohhh....", className: "bg-base-300", children: /* @__PURE__ */ jsxs("div", { className: "max-w-xl w-full bg-base-100 p-8 rounded-lg shadow-md", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold  mb-4", children: "Something went wrong and we we're unable to recover. Here's what we know:" }),
        /* @__PURE__ */ jsx(Alert, { color: "error", message: errorMessage, icon: MdError })
      ] }) }),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  default: App,
  links: links$2
}, Symbol.toStringTag, { value: "Module" }));
class Director {
  static delay(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  static makeDir(dirPath, options) {
    const dirExists = fs.existsSync(dirPath);
    if (!dirExists) {
      fs.mkdirSync(dirPath, options);
    }
  }
  static readDir(dirPath, options = "utf-8") {
    const dirExists = fs.existsSync(dirPath);
    if (!dirExists) {
      return null;
    }
    return fs.readdirSync(dirPath, options);
  }
  static readFile(filePath) {
    const fileExists = fs.existsSync(filePath);
    if (!fileExists) return void 0;
    return fs.readFileSync(filePath, "utf-8");
  }
  static deletePath(pathToDelete) {
    console.log(`Deleting ${pathToDelete}`);
    if (fs.existsSync(pathToDelete)) {
      fs.rmSync(pathToDelete, { recursive: true });
    }
  }
  static writeFile(filePath, contents, options) {
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }
    fs.writeFileSync(filePath, contents, options);
  }
  static copyFile(from, to, mode2) {
    const dirname = path.dirname(to);
    if (!fs.existsSync(dirname)) {
      this.makeDir(dirname, { recursive: true });
    }
    return fs.copyFileSync(from, to, mode2);
  }
}
const DEFAULT_CONFIG = {
  tmpPath: tmpdir() || ".tmp",
  projects: {
    path: "projects"
  },
  git: {
    pat: "",
    upstream: "https://github.com/Betty-Blocks-Services/bb-testing.git"
  },
  session: ""
};
class Config {
  constructor() {
    __publicField(this, "configPath", path.resolve("config.json"));
    __publicField(this, "config");
    this.ensureConfigFile();
    this.config = this.loadConfig();
    this.ensureProjectsDir();
  }
  get userDataDir() {
    return process.env.USER_DATA_DIR || "";
  }
  isObject(item) {
    return item !== null && typeof item === "object" && !Array.isArray(item);
  }
  ensureProjectsDir() {
    const projectsDir = path.join(this.userDataDir, this.projectsPath);
    console.info({ projectsDir });
    Director.makeDir(path.join(this.userDataDir, this.projectsPath), {
      recursive: true
    });
  }
  /**
   * Deeply merge source objects into a target object.
   * The target and sources are constrained to objects with string keys.
   *
   * @param target The base object to merge properties into.
   * @param sources One or more source objects.
   * @returns The target object after merging.
   */
  deepMerge(target, ...sources) {
    if (!sources.length) {
      return target;
    }
    const source = sources.shift();
    if (this.isObject(target) && this.isObject(source)) {
      for (const key in source) {
        if (this.isObject(source[key])) {
          if (!target[key] || !this.isObject(target[key])) {
            Object.assign(target, { [key]: {} });
          }
          this.deepMerge(
            target[key],
            source[key]
          );
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }
    return this.deepMerge(target, ...sources);
  }
  /**
   * If the config file doesn't exist, write the DEFAULT_CONFIG to it.
   */
  ensureConfigFile() {
    if (!fs.existsSync(this.configPath)) {
      try {
        fs.writeFileSync(
          this.configPath,
          JSON.stringify(DEFAULT_CONFIG, null, 2),
          { encoding: "utf-8" }
        );
        console.log("No config file found. Created a new one.");
      } catch (error) {
        console.error("Error writing config file:", error);
      }
    }
  }
  loadConfig() {
    const configContent = Director.readFile(this.configPath);
    if (configContent) {
      try {
        const parsed = JSON.parse(configContent);
        return this.deepMerge(DEFAULT_CONFIG, parsed);
      } catch (err) {
        const message = parseErrorToMessage(err);
        throw new Error(`Unable to parse the config.json file: ${message}`);
      }
    } else {
      return DEFAULT_CONFIG;
    }
  }
  updateConfig(newConfig) {
    this.config = this.deepMerge({ ...this.config }, newConfig);
    console.log("Updated config:", this.config);
    this.saveConfig();
  }
  /**
   * Ensures that a session secret exists in the config.
   * If not, generates a new one, updates the config, and persists it.
   */
  ensureSessionSecret() {
    if (!this.config.session || this.config.session.trim() === "") {
      const newSessionSecret = randomBytes(32).toString("hex");
      this.updateConfig({ session: newSessionSecret });
      console.log("Generated a new session secret.");
      return newSessionSecret;
    }
    return this.config.session;
  }
  saveConfig() {
    try {
      Director.writeFile(
        this.configPath,
        JSON.stringify(this.config, null, 2),
        { encoding: "utf-8" }
      );
      console.log("Config saved to", this.configPath);
    } catch (error) {
      console.error("Error saving config file:", error);
    }
  }
  get projects() {
    return this.config.projects;
  }
  get projectsPath() {
    return path.resolve(this.config.projects.path);
  }
  get git() {
    return this.config.git;
  }
  get suitePath() {
    return path.resolve(path.dirname(process.cwd()));
  }
  get tmpPath() {
    return this.config.tmpPath;
  }
}
class Git {
  constructor() {
    __publicField(this, "octokit", null);
  }
  /**
   * Signs in the user.
   *
   * If the token exists in the config, it uses that; otherwise, if you provide a token,
   * it will store it and initialize Octokit.
   *
   * @throws if no token is provided.
   */
  async signIn(token) {
    const key = token || config.git.pat;
    if (!key)
      throw new Error("Unable to connect with GitHub! No PAT available...");
    this.octokit = new Octokit({ auth: key });
    return await this.octokit.auth();
  }
  listConflicts(repoPath) {
    const modified = execSync("git status --porcelain", { cwd: repoPath }).toString().trim().split("\n").filter(Boolean).map((line) => line.slice(3));
    const untracked = execSync("git ls-files --others --exclude-standard", {
      cwd: repoPath
    }).toString().trim().split("\n").filter(Boolean);
    execSync("git fetch origin", { cwd: repoPath });
    const remoteChanges = execSync("git diff --name-only HEAD upstream/main", {
      cwd: repoPath
    }).toString().trim().split("\n").filter(Boolean);
    const localSet = /* @__PURE__ */ new Set([...modified, ...untracked]);
    const conflicts = remoteChanges.filter((f) => localSet.has(f));
    return conflicts;
  }
  async listRepositories() {
    var _a;
    if (!this.octokit) {
      await this.signIn();
    }
    const response = await ((_a = this.octokit) == null ? void 0 : _a.request("GET /orgs/{org}/repos", {
      org: "Betty-Blocks-Services"
    }));
    return response == null ? void 0 : response.data.map((repo) => ({
      name: repo.full_name,
      url: repo.url
    }));
  }
  /**
   * Creates a new repository from a template repository using the GitHub API.
   *
   * @param options Configuration for the repository creation.
   * @returns The GitHub response data from the created repository.
   */
  async createRepoFromTemplate(options) {
    var _a;
    if (!this.octokit) {
      await this.signIn();
    }
    const {
      templateOwner,
      templateRepo,
      newRepoName,
      description = "",
      private: isPrivate = true,
      includeAllBranches = false
    } = options;
    try {
      const response = await ((_a = this.octokit) == null ? void 0 : _a.rest.repos.createUsingTemplate({
        template_owner: templateOwner,
        template_repo: templateRepo,
        name: newRepoName,
        owner: "Betty-Blocks-Services",
        description,
        include_all_branches: includeAllBranches,
        private: isPrivate
      }));
      console.log(
        `Created repository ${newRepoName} using template ${templateRepo}.`
      );
      return response == null ? void 0 : response.data;
    } catch (err) {
      const error = err;
      return { error: { message: error.response.data.message } };
    }
  }
  /**
   * Tries to clone a repository using retries. This function:
   *  - Removes any existing target directory.
   *  - Clones the repository.
   *  - Runs a "git pull" (to ensure everything is up-to-date).
   *  - Checks if the repository is not empty (i.e. HEAD exists).
   *
   * @param repoUrl The repository URL to clone.
   * @param targetPath The local path where the repo should be cloned.
   * @param maxAttempts Maximum attempts (default 5).
   * @param delayMs Delay in milliseconds between attempts (default 100ms).
   * @returns An object with success (boolean), attempts (number), and an optional message.
   */
  async cloneRepository(repoUrl, targetPath, maxAttempts = 5, delayMs = 100) {
    let attempt = 0;
    while (attempt < maxAttempts) {
      attempt++;
      try {
        console.log(
          `Attempt ${attempt}: Cloning ${repoUrl} into ${targetPath}...`
        );
        Director.deletePath(targetPath);
        execSync(`git clone ${repoUrl} ${targetPath}`, {
          stdio: "inherit",
          cwd: config.projectsPath
        });
        execSync("git pull", {
          stdio: "inherit",
          cwd: targetPath
        });
        try {
          const localHash = execSync("git rev-parse HEAD", {
            cwd: targetPath,
            encoding: "utf-8"
          }).trim();
          if (localHash) {
            console.log("Repository cloned and populated successfully.");
            return { success: true, attempts: attempt };
          }
        } catch (e) {
          console.warn("Repository appears to be empty; will retry...");
        }
      } catch (error) {
        console.error("Error cloning repository on attempt", attempt, error);
      }
      await Director.delay(delayMs);
    }
    return {
      success: false,
      attempts: attempt,
      message: `Repository did not populate after ${maxAttempts} attempts.`
    };
  }
  /**
   * Sets or adds a remote with the given URL.
   * If the remote already exists, its URL will be updated.
   * Otherwise, a new remote is added.
   *
   * @param repoPath The local repository path.
   * @param remote The name of the remote (e.g. "upstream" or "origin").
   * @param url The URL for the remote.
   * @returns True if the operation succeeds, false otherwise.
   */
  setOrAddRemote(repoPath, remote, url) {
    try {
      let remoteExists = false;
      try {
        execSync(`git remote get-url ${remote}`, {
          cwd: repoPath,
          stdio: "ignore"
        });
        remoteExists = true;
      } catch (err) {
        remoteExists = false;
      }
      if (remoteExists) {
        execSync(`git remote set-url ${remote} ${url}`, {
          cwd: repoPath,
          stdio: "inherit"
        });
        console.log(`Remote '${remote}' updated to URL: ${url}`);
      } else {
        execSync(`git remote add ${remote} ${url}`, {
          cwd: repoPath,
          stdio: "inherit"
        });
        console.log(`Remote '${remote}' added with URL: ${url}`);
      }
      return true;
    } catch (error) {
      console.error("Error setting remote URL:", error);
      return false;
    }
  }
  /**
   * Checks whether the given branch exists on the specified remote.
   *
   * @param repoPath The local repository path.
   * @param remote The remote name (e.g. "origin" or "upstream").
   * @param branch The branch name (e.g. "main" or "master").
   * @returns True if the branch exists on the remote, false otherwise.
   */
  remoteBranchExists(repoPath, remote, branch) {
    try {
      const output = execSync(`git ls-remote --heads ${remote} ${branch}`, {
        cwd: repoPath,
        encoding: "utf-8"
      });
      return output.trim().length > 0;
    } catch (error) {
      return false;
    }
  }
  /**
   * Checks whether updates are available in the repository at the given path.
   *
   * @param repoPath The local repository path.
   * @param remote Optional: The name of the remote (e.g. "origin" or "upstream"). Default: origin.
   * @param branch Optional: The branch name (e.g. "main")—used with the remote. Default: main.
   * @returns True if there are updates (i.e. if local and remote commits differ), false otherwise.
   */
  checkForUpdates(repoPath, remote = "origin", branch = "main") {
    try {
      execSync(`git fetch ${remote} ${branch}`, {
        cwd: repoPath,
        stdio: "ignore"
      });
      let compareTarget;
      if (remote && branch) {
        compareTarget = `${remote}/${branch}`;
      } else if (remote) {
        compareTarget = `${remote}/HEAD`;
      } else {
        compareTarget = "@{u}";
      }
      const localHash = execSync("git rev-parse @ --", {
        cwd: repoPath,
        encoding: "utf-8"
      }).trim();
      const remoteHash = execSync(`git rev-parse ${compareTarget} --`, {
        cwd: repoPath,
        encoding: "utf-8"
      }).trim();
      if (localHash !== remoteHash) {
        console.log("Updates are available for repository:", repoPath);
        return true;
      } else {
        console.log("Repository is up-to-date:", repoPath);
        return false;
      }
    } catch (error) {
      console.error(
        "Error checking for updates in repository:",
        repoPath,
        error
      );
      return false;
    }
  }
  /**
   * Synchronizes the repository at repoPath. This method pulls the latest changes
   * and, if there are any local modifications (tracked or untracked), adds them,
   * commits with the message "sync", and pushes the changes.
   *
   * @param repoPath The local repository path.
   * @returns True if synchronization succeeds; false otherwise.
   */
  syncRepository(repoPath) {
    try {
      console.log(`Syncing repository at ${repoPath}`);
      execSync("git pull", { cwd: repoPath, stdio: "inherit" });
      const statusOutput = execSync("git status --porcelain", {
        cwd: repoPath,
        encoding: "utf-8"
      }).trim();
      if (statusOutput === "") {
        console.log("Repository is clean. Nothing to sync.");
        return {
          updated: true
        };
      }
      console.log("\n---- Adding changes and committing ----\n");
      execSync("git status", { cwd: repoPath, stdio: "inherit" });
      execSync("git add .", { cwd: repoPath, stdio: "inherit" });
      execSync("git commit -m 'sync'", { cwd: repoPath, stdio: "inherit" });
      execSync("git push", { cwd: repoPath, stdio: "inherit" });
      console.log("Repository synchronized successfully.");
      return { updated: true };
    } catch (error) {
      const message = error && typeof error === "object" && "message" in error ? error.message : error;
      console.error("Error during repository sync:", error);
      return { updated: false, message };
    }
  }
  /**
   * Updates the local repository by fetching updates and rebasing the local branch.
   *
   * The method behaves as follows:
   * - If both a remote and branch are provided, it verifies whether the branch exists.
   *    - If the branch exists, it fetches that branch and rebases onto it.
   *    - If not, it logs a warning and falls back to fetching the entire remote and rebasing onto remote/HEAD.
   * - If only a remote is provided, it fetches that remote and rebases onto remote/HEAD.
   * - If neither is provided, it fetches all remotes and rebases onto the tracked upstream (@{u}).
   *
   * Local changes are not merged—only rebasing is performed so that user changes are not preserved.
   *
   * @param repoPath The local repository path.
   * @param remote Optional remote name (e.g. "origin" or "upstream"). Default: origin
   * @param branch Optional branch name (e.g. "main") to rebase onto. Default: main
   * @returns True if the update (with rebase) succeeds; false otherwise.
   */
  updateRepository(repoPath, remote = "origin", branch = "main") {
    try {
      console.log(
        `Updating repository at ${repoPath} from ${remote}/${branch}`
      );
      let fetchCmd = "";
      let rebaseTarget = "";
      if (this.remoteBranchExists(repoPath, remote, branch)) {
        fetchCmd = `git fetch ${remote} ${branch}`;
        rebaseTarget = `${remote}/${branch}`;
      } else {
        console.warn(
          `Remote branch ${remote}/${branch} does not exist. Falling back to ${remote}/HEAD.`
        );
        fetchCmd = `git fetch ${remote}`;
        rebaseTarget = `${remote}/HEAD`;
      }
      console.log(`Executing fetch: "${fetchCmd}" in ${repoPath}`);
      execSync(fetchCmd, { cwd: repoPath, stdio: "inherit" });
      console.log(`Removing local changes`);
      execSync("git checkout .", { cwd: repoPath, stdio: "inherit" });
      const rebaseCmd = `git rebase ${rebaseTarget}`;
      console.log(`Executing rebase: "${rebaseCmd}" in ${repoPath}`);
      execSync(rebaseCmd, { cwd: repoPath, stdio: "inherit" });
      console.log("Repository updated successfully with rebase.");
      return {
        updated: true
      };
    } catch (error) {
      const message = error && typeof error === "object" && "message" in error ? error.message : error;
      console.error(`Error updating repository at ${repoPath}:`, message);
      return {
        updated: false,
        message
      };
    }
  }
  isGitHttpError(obj) {
    if (typeof obj !== "object" || obj === null || !("name" in obj) || obj.name !== "HttpError") {
      return false;
    }
    const maybeError = obj;
    return typeof maybeError.status === "number" && typeof maybeError.request === "object" && maybeError.request !== null && typeof maybeError.request.method === "string" && typeof maybeError.request.url === "string" && typeof maybeError.request.headers === "object" && maybeError.request.headers !== null && typeof maybeError.response === "object" && maybeError.response !== null && typeof maybeError.response.status === "number" && typeof maybeError.response.url === "string" && typeof maybeError.response.headers === "object" && maybeError.response.headers !== null && typeof maybeError.response.data === "object" && maybeError.response.data !== null && "message" in maybeError.response.data && typeof maybeError.response.data.message === "string";
  }
}
class ProcessManager {
  constructor(config2) {
    __publicField(this, "config");
    this.config = config2;
  }
  connect() {
    return new Promise((resolve, reject) => {
      pm2.connect((err) => err ? reject(err) : resolve());
    });
  }
  disconnect() {
    pm2.disconnect();
  }
  async describe(name) {
    return new Promise((resolve, reject) => {
      pm2.describe(name, (err, descs) => {
        if (err) return reject(err);
        resolve(descs && descs[0] ? descs[0] : null);
      });
    });
  }
  async readLogFile(path2) {
    if (!path2) return void 0;
    return Director.readFile(path2);
  }
  async start(wait = false) {
    if (!this.config || !this.config.name) {
      throw new Error("Cannot start a new process without a config");
    }
    await this.connect();
    await new Promise(
      (res) => pm2.flush(this.config.name, () => res())
    );
    await new Promise(
      (res, rej) => pm2.delete(
        this.config.name,
        (err) => err && err.message !== "process or namespace not found" ? rej(err) : res()
      )
    );
    await new Promise(
      (res, rej) => pm2.start(this.config, (err) => err ? rej(err) : res())
    );
    if (wait) {
      return new Promise((resolve) => {
        const interval = setInterval(async () => {
          var _a;
          const info = await this.describe(this.config.name || "");
          if (((_a = info == null ? void 0 : info.pm2_env) == null ? void 0 : _a.status) === "stopped") {
            clearInterval(interval);
            resolve(info);
          }
        }, 500);
      });
    } else {
      const info = await this.status(this.config.name);
      this.disconnect();
      return info;
    }
  }
  async stop(name) {
    await this.connect();
    await new Promise(
      (res, rej) => pm2.stop(name, (err) => err ? rej(err) : res())
    );
    const info = await this.status(name);
    this.disconnect();
    return info;
  }
  async status(name) {
    await this.connect();
    const desc = await this.describe(name);
    this.disconnect();
    if (!desc) {
      return { status: "stopped" };
    }
    const env = desc.pm2_env;
    const info = {
      status: env == null ? void 0 : env.status,
      pid: desc.pid,
      uptime: humanizeMSTime((env == null ? void 0 : env.pm_uptime) || 0),
      stdout: await this.readLogFile(env == null ? void 0 : env.pm_out_log_path),
      stderr: await this.readLogFile(env == null ? void 0 : env.pm_err_log_path)
    };
    return info;
  }
  static getTestprojectProcessName(projectName) {
    return `bb-testing:${projectName}`;
  }
  static getProcessName(projectName, suiteName, testName) {
    if (suiteName) {
      if (testName) {
        return `bb-testing:${projectName}>${suiteName}>${testName}`;
      }
      return `bb-testing:${projectName}>${suiteName}`;
    }
    return `bb-testing:${projectName}`;
  }
}
class Project {
  constructor(projectName) {
    __publicField(this, "details");
    __publicField(this, "reservedNames", ["list", "create"]);
    this.details = this.getDetails(projectName);
  }
  get path() {
    return this.details.path;
  }
  get name() {
    return path.basename(this.path);
  }
  /**
   * Normalizes a given string to adhere to the BB Services standard
   * customername-projectname
   */
  static parseProjectName(name) {
    const parsed = parseName(name);
    return parsed.includes("test") ? parsed : `${parsed}-test`;
  }
  get playwrightConfigPath() {
    return path.resolve(this.details.path, "playwright.config.ts");
  }
  /**
   * Creates a new project in the /projects folder
   */
  static async createProject(name) {
    const parsedName = this.parseProjectName(name);
    fs.mkdirSync(config.projectsPath, { recursive: true });
    const projectPath = path.resolve(config.projectsPath, parsedName);
    const projectExists = fs.existsSync(projectPath);
    if (projectExists) {
      return {
        error: {
          message: `Test project: ${parsedName} already exists locally! Please try a different name or remove the existing project`
        }
      };
    }
    const git = new Git();
    const result = await git.createRepoFromTemplate({
      newRepoName: parsedName,
      templateOwner: "Betty-Blocks-Services",
      description: "This project was created using the bb-testing dashboard tool",
      templateRepo: "bb-testing-playwright-template"
    });
    if (!result) {
      return {
        error: {
          message: "Something went wrong while trying to create the project! Please try again later"
        }
      };
    }
    if ("error" in result) {
      return result;
    }
    const { html_url, clone_url } = result;
    const { success, attempts, message } = await git.cloneRepository(
      clone_url,
      projectPath
    );
    console.log({ success, attempts, message });
    const vscodePath = `vscode://file/${projectPath}`;
    if (!success) {
      return {
        error: {
          message
        }
      };
    }
    git.setOrAddRemote(projectPath, "origin", clone_url);
    execSync$1("npm install", { cwd: projectPath, stdio: "inherit" });
    return {
      name: parsedName,
      git: {
        initialized: true,
        branch: "origin",
        remoteUrl: "main",
        remoteHasChanges: success,
        localHasChanges: false,
        error: message
      },
      path: projectPath,
      urls: {
        git: html_url,
        vscode: vscodePath
      }
    };
  }
  getDetails(projectName) {
    const projectPath = path.resolve(config.projectsPath, projectName);
    if (Director.readDir(projectPath) === null) {
      throw new Error(`Project ${projectName} cannot be found!`);
    }
    const gitFolderPath = path.join(projectPath, ".git");
    const isGitInitialized = fs.existsSync(gitFolderPath);
    let remoteUrl;
    let branch;
    let error;
    if (isGitInitialized) {
      const gitConfigPath = path.join(gitFolderPath, "config");
      const configContent = Director.readFile(gitConfigPath);
      if (!configContent) {
        error = "Unable to read git's config! Please re-initialize the projects git repository";
      }
      const remoteMatch = configContent && configContent.match(/\[remote "origin"\]\s+url\s*=\s*(.+)/);
      if (remoteMatch) {
        remoteUrl = remoteMatch[1].trim();
      }
      branch = "main";
    }
    const vscodeUrl = `vscode://file/${projectPath}`;
    const gitUrl = remoteUrl || "";
    return {
      name: projectName,
      path: projectPath,
      git: {
        initialized: isGitInitialized,
        remoteUrl,
        branch,
        remoteHasChanges: false,
        localHasChanges: false,
        error
      },
      urls: {
        vscode: vscodeUrl,
        git: gitUrl
      }
    };
  }
  /**
   * Scans the projects directory and converts each project folder into a Project object.
   */
  static listProjects() {
    var _a;
    const projectDirs = ((_a = Director.readDir(config.projectsPath, { withFileTypes: true })) == null ? void 0 : _a.filter((value) => value.isDirectory()).map((dir) => dir.name)) || [];
    const projects = [];
    for (const projectName of projectDirs) {
      const projectDetails = new Project(projectName).details;
      if (projectDetails) {
        projects.push(projectDetails);
      }
    }
    return projects;
  }
  /**
   * Returns the defined config in playwright.config.ts for the current project
   */
  async getPlaywrightConfig() {
    const project = new Project$1();
    const source = project.addSourceFileAtPath(this.playwrightConfigPath);
    const exportAssign = source.getExportAssignmentOrThrow(
      (assignment) => assignment.isExportEquals() === false
    );
    const callExpr = exportAssign.getExpressionIfKindOrThrow(
      SyntaxKind.CallExpression
    );
    const objLit = callExpr.getArguments()[0].asKindOrThrow(SyntaxKind.ObjectLiteralExpression);
    function parseNode(node) {
      if (Node.isStringLiteral(node)) {
        return node.getLiteralText();
      }
      if (Node.isNumericLiteral(node)) {
        return parseFloat(node.getText());
      }
      const kind = node.getKind();
      if (kind === SyntaxKind.TrueKeyword) return true;
      if (kind === SyntaxKind.FalseKeyword) return false;
      if (Node.isObjectLiteralExpression(node)) {
        const obj = {};
        for (const prop of node.getProperties()) {
          if (Node.isPropertyAssignment(prop)) {
            const key = prop.getName();
            const valNode = prop.getInitializerOrThrow();
            obj[key] = parseNode(valNode);
          }
        }
        return obj;
      }
      if (Node.isArrayLiteralExpression(node)) {
        return node.getElements().map((elem) => parseNode(elem));
      }
      return node.getText();
    }
    const result = {};
    for (const prop of objLit.getProperties()) {
      if (!Node.isPropertyAssignment(prop)) continue;
      const name = prop.getName();
      const init = prop.getInitializerOrThrow();
      result[name] = parseNode(init);
    }
    return result;
  }
  /**
   * Updates the playwright config for the current project.
   */
  async updatePlaywrightConfig(updates) {
    const project = new Project$1();
    const source = project.addSourceFileAtPath(this.playwrightConfigPath);
    const defaultExport = source.getExportAssignmentOrThrow(
      (assignment) => assignment.isExportEquals() === false
    );
    const callExpr = defaultExport.getExpressionIfKindOrThrow(
      SyntaxKind.CallExpression
    );
    const objLit = callExpr.getArguments()[0].asKindOrThrow(SyntaxKind.ObjectLiteralExpression);
    function toCode(val) {
      if (val === void 0) return "undefined";
      if (typeof val === "string") return JSON.stringify(val);
      if (typeof val === "number" || typeof val === "boolean")
        return String(val);
      if (Array.isArray(val)) {
        const items = val.map((item) => toCode(item)).join(", ");
        return `[${items}]`;
      }
      if (val && typeof val === "object") {
        const entries = Object.entries(val).map(([k, v]) => {
          const key = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k) ? k : JSON.stringify(k);
          return `${key}: ${toCode(v)}`;
        }).join(", ");
        return `{ ${entries} }`;
      }
      return JSON.stringify(val);
    }
    for (const [key, value] of Object.entries(updates)) {
      const valText = toCode(value);
      const prop = objLit.getProperty(key);
      if (prop && Node.isPropertyAssignment(prop)) {
        prop.setInitializer(valText);
      } else {
        objLit.addPropertyAssignment({ name: key, initializer: valText });
      }
    }
    await source.save();
  }
}
const config$1 = new Config();
const sessionSecret = config$1.ensureSessionSecret();
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "strict",
    path: "/",
    httpOnly: true
  }
});
const { getSession, commitSession, destroySession } = sessionStorage;
function buildDependencyGraph(configs) {
  var _a;
  const nodes = configs.map((cfg) => {
    var _a2, _b;
    return {
      id: cfg.name,
      data: { label: cfg.name },
      position: { x: 0, y: 0 },
      // will be updated by layout
      style: ((_a2 = cfg.metadata) == null ? void 0 : _a2.type) === "suite" ? { border: "2px solid var(--color-primary)", padding: 10 } : ((_b = cfg.metadata) == null ? void 0 : _b.type) === "setup" ? { border: "2px solid var(--color-secondary)", padding: 10 } : { border: "2px solid var(--color-accent)", padding: 10 }
    };
  });
  const edges = [];
  for (const cfg of configs) {
    for (const dep of cfg.dependencies ?? []) {
      if (configs.some((c) => c.name === dep)) {
        edges.push({
          id: `e-${dep}-${cfg.name}`,
          source: dep,
          target: cfg.name,
          animated: ((_a = cfg.metadata) == null ? void 0 : _a.type) === "setup"
        });
      }
    }
  }
  const dependentSet = new Set(edges.map((e) => e.target));
  const roots = nodes.filter((n) => !dependentSet.has(n.id));
  const sourceSet = new Set(edges.map((e) => e.source));
  const leaves = nodes.filter((n) => !sourceSet.has(n.id));
  nodes.push({
    id: "start",
    data: { label: "Start" },
    position: { x: 0, y: 0 },
    style: {
      border: "2px dashed #2563eb",
      padding: 10,
      background: "#eff6ff"
    }
  });
  roots.forEach(
    (root) => edges.push({
      id: `e-start-${root.id}`,
      source: "start",
      target: root.id,
      animated: false,
      style: { stroke: "#2563eb", strokeDasharray: "4 2" }
    })
  );
  nodes.push({
    id: "finish",
    data: { label: "Finish" },
    position: { x: 0, y: 0 },
    style: {
      border: "2px dashed #dc2626",
      padding: 10,
      background: "#fee2e2"
    }
  });
  leaves.forEach(
    (leaf) => edges.push({
      id: `e-${leaf.id}-finish`,
      source: leaf.id,
      target: "finish",
      animated: false,
      style: { stroke: "#dc2626", strokeDasharray: "4 2" }
    })
  );
  return { nodes, edges };
}
const getLayoutedElements = (nodes, edges, dir = "TB") => {
  const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  const nodeWidth = 172;
  const nodeHeight = 36;
  const isHorizontal = dir === "LR";
  dagreGraph.setGraph({ rankdir: dir });
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });
  dagre.layout(dagreGraph);
  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2
      }
    };
    return newNode;
  });
  return { nodes: newNodes, edges };
};
class TestHelper {
  constructor(project, config2) {
    __publicField(this, "project");
    __publicField(this, "config");
    __publicField(this, "reservedNames", ["list", "create", "edit", "delete", "view"]);
    this.project = project;
    this.config = config2;
    this.ensureDashboardReporter();
  }
  saveConfig() {
    Director.writeFile(this.staticConfigPath, JSON.stringify(this.config), {
      encoding: "utf-8"
    });
  }
  ensureDashboardReporter() {
    Director.makeDir(path.dirname(this.customReporterPath), {
      recursive: true
    });
    const originalReporterPath = path.join(
      process.cwd(),
      "app/utils/test-helper/reporter/index.ts"
    );
    Director.copyFile(originalReporterPath, this.customReporterPath);
  }
  /**
   * @returns Path to the directory containing tests (can be configured in the playwright.config.ts)
   */
  get testPath() {
    return path.resolve(this.project.path, this.config.testDir || "./src");
  }
  /**
   * @returns The path in which the test reporters are stored
   */
  get reportsPath() {
    return path.resolve(this.project.path, this.reportsDirname);
  }
  get customReporterPath() {
    return path.resolve(this.reportsPath, "reporters", "dashboard-reporter.ts");
  }
  /**
   * @returns The directory name in which to store the reporters
   */
  get reportsDirname() {
    return "reports";
  }
  /**
   * @returns Path to the playwright.static.json file in the current project
   */
  get staticConfigPath() {
    return path.resolve(this.project.path, "playwright.static.json");
  }
  /**
   * @returns Path to the playwright.config.ts in the current project
   */
  get playwrightConfigPath() {
    return path.resolve(this.project.path, "playwright.config.ts");
  }
  /**
   * @returns Relative path from the project's folder to the tests directory
   *
   * @example src/tests/admin
   */
  get relativeTestPath() {
    return path.relative(this.project.path, this.testPath);
  }
  /**
   * @returns the appUrl from the playwright config
   */
  get appURL() {
    var _a;
    return (_a = this.config.metadata) == null ? void 0 : _a.appURL;
  }
  /**
   * Returns the absolute path to the test directory for the given suite
   */
  getTestPathForSuite(suiteName) {
    return path.resolve(this.testPath, suiteName, "tests");
  }
  getSetupPath(suite, test) {
    return path.join(this.getSetupDir(suite), test);
  }
  getSetupDir(suite) {
    return path.join(this.relativeTestPath, suite, "setup");
  }
  getProjectDir(projectName) {
    return path.join(this.testPath, projectName);
  }
  getTestPath(suite, test) {
    return path.join(this.testPath, suite, "tests", test);
  }
  /**
   * @returns List of tests suites (directories) in the configured 'testDir'.
   */
  listSuites() {
    var _a;
    return ((_a = this.config.projects) == null ? void 0 : _a.filter(
      (project) => {
        var _a2;
        return ((_a2 = project.metadata) == null ? void 0 : _a2.type) === "suite" && Boolean(project.name);
      }
    ).map((suite) => ({
      name: suite.name,
      config: suite,
      results: this.getTestResults(suite.name, "suite", true)
    }))) || [];
  }
  /**
   * Creates a new test suite (directory) at the configured 'testDir'
   *
   * Also saves the suite as a new project into the config
   * @returns returns the path
   */
  async createSuite(name) {
    var _a;
    const parsedName = parseName(name);
    if (this.reservedNames.includes(parsedName)) {
      throw new Error(`${parsedName} is a reserved key word.`);
    }
    const newSuitePath = path.resolve(this.testPath, parsedName);
    const existingProject = (_a = this.config.projects) == null ? void 0 : _a.find(
      (project) => project.name === parsedName
    );
    if (existingProject) {
      throw new Error(`Test suite "${name}" already exists.`);
    }
    const newProject = {
      name: parsedName,
      dependencies: [],
      testDir: path.join("./", this.relativeTestPath, parsedName, "tests"),
      metadata: {
        type: "suite"
      }
    };
    await this.addProject(newProject);
    Director.makeDir(newSuitePath, { recursive: true });
    return newSuitePath;
  }
  async deleteSuite(suite) {
    var _a;
    const projectsToRemove = [];
    const suiteAsProject = (_a = this.config.projects) == null ? void 0 : _a.find(
      (project) => project.name === suite
    );
    if (suiteAsProject) {
      projectsToRemove.push(suiteAsProject);
    }
    const setupAsProject = this.getSetup(suite);
    if (setupAsProject) {
      projectsToRemove.push(setupAsProject);
    }
    if (projectsToRemove.length > 0) {
      await this.removeProjectFromConfig(projectsToRemove);
    }
    const suitePath = path.resolve(this.testPath, suite);
    console.log({ suitePath });
    Director.deletePath(suitePath);
  }
  matchTestName(testName) {
    return testName.match(/(\.spec\.ts)|(\.spec\.js)/);
  }
  /**
   *
   * @param suiteName (optional) Name of the suite to list tests from
   * @returns if suiteName is provided, lists all tests within that suite else it returns all tests according to the config.
   */
  listTests(suiteName) {
    var _a;
    if (suiteName) {
      const testsForSuitePath = this.getTestPathForSuite(suiteName);
      const tests = Director.readDir(testsForSuitePath, {
        recursive: true,
        withFileTypes: true
      });
      return (tests == null ? void 0 : tests.filter((value) => this.matchTestName(value.name)).map((test) => ({
        name: test.name,
        path: path.join(test.parentPath, test.name),
        suite: suiteName
      }))) || [];
    } else {
      const tests = [];
      const suites = ((_a = this.config.projects) == null ? void 0 : _a.filter(
        (proj) => {
          var _a2;
          return ((_a2 = proj.metadata) == null ? void 0 : _a2.type) === "suite";
        }
      )) || [];
      for (const suite of suites) {
        if (!suite.name) {
          console.warn("WARNING: Project contains no name", suite);
          continue;
        }
        const testPath = this.getTestPathForSuite(suite.name);
        const files = Director.readDir(testPath, {
          recursive: true,
          withFileTypes: true
        }) || [];
        for (const file of files) {
          file.isFile() && this.matchTestName(file.name) && tests.push({
            name: file.name,
            path: path.join(file.parentPath, file.name),
            suite: path.basename(path.dirname(file.parentPath))
          });
        }
      }
      return tests;
    }
  }
  /**
   *
   * @param name Name of the setup
   * @param suite Name of the suite the setup belongs to
   * @param test Path to the test file
   * @param dependencies Optional dependency array
   * @param storageState Whether or not the storage state should be shaved at the and of a test
   */
  async createSetup(name, suite, test, dependencies, storageState) {
    var _a;
    const existingProject = (_a = this.config.projects) == null ? void 0 : _a.find(
      (project) => project.name === name
    );
    if (existingProject) {
      throw new Error(`Setup "${name}" already exists!`);
    } else {
      const testName = path.basename(test);
      const setupPath = path.join(
        this.project.path,
        this.getSetupPath(suite, testName)
      );
      Director.copyFile(test, setupPath);
      Director.deletePath(test);
      if (storageState) {
        this.injectStorageState(setupPath, "storage-state.json");
      }
      const setupDir = this.getSetupDir(suite);
      const newProject = {
        name,
        testMatch: path.basename(test),
        testDir: setupDir,
        metadata: {
          type: "setup"
        },
        dependencies
      };
      await this.addProject(newProject);
      return newProject;
    }
  }
  async deleteSetup(name) {
    const setup = this.getSetup(name);
    if (!setup.testDir || !setup.testMatch) return;
    const relativeTestPath = path.join(setup.testDir, String(setup.testMatch));
    const setupPath = path.join(this.project.path, relativeTestPath);
    const testPath = path.join(
      this.project.path,
      path.dirname(setup.testDir || ""),
      "tests",
      String(setup.testMatch)
    );
    await this.removeProjectFromConfig(setup);
    Director.copyFile(setupPath, testPath);
    Director.deletePath(setupPath);
  }
  /**
   * Deletes a test from both the path and the config
   */
  async deleteTest(suite, test) {
    var _a, _b;
    const testPath = this.getTestPath(suite, test);
    const dependentProjects = (_a = this.config.projects) == null ? void 0 : _a.filter(
      (project) => {
        var _a2;
        return (_a2 = project.dependencies) == null ? void 0 : _a2.includes(test);
      }
    );
    const isDependency = dependentProjects && dependentProjects.length > 0;
    if (isDependency) {
      const newNonDependentProjects = dependentProjects.map((project) => {
        var _a2;
        return {
          ...project,
          dependencies: ((_a2 = project.dependencies) == null ? void 0 : _a2.filter((dependency) => dependency !== test)) || []
        };
      });
      const newProjects = ((_b = this.config.projects) == null ? void 0 : _b.map((project) => {
        const projectToReplace = newNonDependentProjects.find(
          (p) => p.name === project.name
        );
        if (projectToReplace) {
          return projectToReplace;
        }
        return project;
      })) || [];
      this.config.projects = newProjects;
      await this.project.updatePlaywrightConfig({ projects: newProjects });
    }
    Director.deletePath(testPath);
  }
  async addProject(project) {
    const newProjects = this.config.projects || [];
    newProjects.push(project);
    this.config.projects = newProjects;
    await this.project.updatePlaywrightConfig({ projects: newProjects });
  }
  /**
   * Removes a project (or projects) from the Playwright config
   */
  async removeProjectFromConfig(project) {
    var _a, _b;
    if (Array.isArray(project)) {
      let newProjects = this.config.projects;
      for (let i = 0; i < project.length; i++) {
        const proj = project[i];
        newProjects = ((_a = this.config.projects) == null ? void 0 : _a.filter((p) => p.name !== proj.name)) || [];
      }
      this.config.projects = newProjects;
      await this.project.updatePlaywrightConfig({ projects: newProjects });
    } else {
      const newProjects = ((_b = this.config.projects) == null ? void 0 : _b.filter((p) => project.name !== p.name)) || [];
      this.config.projects = newProjects;
      await this.project.updatePlaywrightConfig({ projects: newProjects });
    }
  }
  /**
   * @param name Name of the project
   */
  getSetup(name) {
    var _a;
    const pwProject = (_a = this.config.projects) == null ? void 0 : _a.find(
      (project) => project.name === name
    );
    if (!pwProject) {
      throw new Error(`Project "${name}" does not exists`);
    }
    return pwProject;
  }
  /**
   * Gets all dependencies related to a setup
   * @param setup name of the setup to get the dependencies from
   */
  getSetupDependencies(setup) {
    const seen = /* @__PURE__ */ new Set();
    const result = [];
    const visit = (name) => {
      if (!name || seen.has(name)) return;
      seen.add(name);
      const cfg = this.getSetup(name);
      if (!cfg) return;
      result.push(cfg);
      for (const dep of cfg.dependencies ?? []) {
        visit(dep);
      }
    };
    visit(setup);
    return result.filter((cfg) => cfg.name !== setup);
  }
  generateDependencyTree(suite) {
    let projects = this.config.projects || [];
    if (suite) {
      projects = projects.filter(
        (dep) => {
          var _a;
          return dep.name !== suite && ((_a = dep.metadata) == null ? void 0 : _a.type) === "setup";
        }
      );
    }
    const configMap = new Map(
      projects.map((p) => [p.name, p])
    );
    function buildNode(projectName, seen) {
      var _a;
      if (seen.has(projectName)) {
        throw new Error(
          `Circular dependency detected: ${projectName}. Please remove "${projectName}" from the dependencies of the "${projectName}" project`
        );
      }
      const cfg = configMap.get(projectName);
      if (!cfg) {
        throw new Error(`Dependency not found: "${projectName}"`);
      }
      seen.add(projectName);
      const dependencies = cfg.dependencies ?? [];
      const childNames = dependencies.filter(Boolean);
      const children = childNames.filter((dep) => dep !== suite).map((dep) => buildNode(dep, new Set(seen)));
      return {
        name: cfg.name,
        metadata: { type: (_a = cfg.metadata) == null ? void 0 : _a.type },
        dependencies: children
      };
    }
    const consumed = /* @__PURE__ */ new Set();
    const results = [];
    function mark(node) {
      for (const child of node.dependencies) {
        if (!child.name) continue;
        consumed.add(child.name);
        mark(child);
      }
    }
    for (const suite2 of projects.filter((p) => {
      var _a;
      return ((_a = p.metadata) == null ? void 0 : _a.type) === "suite";
    })) {
      if (!suite2.name) continue;
      const root = buildNode(suite2.name, /* @__PURE__ */ new Set());
      mark(root);
      results.push(root);
    }
    for (const setup of projects.filter((p) => {
      var _a;
      return ((_a = p.metadata) == null ? void 0 : _a.type) === "setup";
    })) {
      if (!setup.name) continue;
      if (!consumed.has(setup.name)) {
        results.push(buildNode(setup.name, /* @__PURE__ */ new Set()));
      }
    }
    return results;
  }
  getDependencyGraph(suite, direction = "TB") {
    const subConfigs = this.getSetupDependencies(suite).reverse();
    const { nodes, edges } = buildDependencyGraph(subConfigs);
    return getLayoutedElements(nodes, edges, direction);
  }
  async addOrRemoveDependencyFromSuite(suite, dependency) {
    var _a;
    const pwProject = this.getSetup(suite);
    let dependencies = pwProject.dependencies || [];
    if (dependencies.includes(dependency)) {
      dependencies = dependencies.filter((dep) => dep !== dependency);
    } else {
      dependencies.push(dependency);
    }
    const updatedProject = { ...pwProject, dependencies };
    console.log({ updatedProject, pwProject, dependencies });
    const projects = (_a = this.config.projects) == null ? void 0 : _a.map((project) => {
      if (project.name === pwProject.name) {
        return updatedProject;
      }
      return project;
    });
    await this.project.updatePlaywrightConfig({ projects });
  }
  /**
   * Useful utility function to check if a Dirent matches the test pattern.
   *
   * E.g.:
   * - Is a file
   * - Matches <name>.spec.ts
   */
  matchDirentToTest(dirent) {
    return dirent.isFile() && this.matchTestName(dirent.name);
  }
  getTestsForSetup(setup) {
    var _a, _b, _c;
    if (setup.testDir) {
      const directory = path.join(this.project.path, setup.testDir);
      return ((_b = (_a = Director.readDir(directory, {
        withFileTypes: true,
        recursive: true
      })) == null ? void 0 : _a.filter(this.matchDirentToTest, this)) == null ? void 0 : _b.map((dirent) => dirent.name)) || [];
    }
    if (setup.testMatch) {
      const directory = this.testPath;
      return ((_c = Director.readDir(directory, {
        recursive: true,
        withFileTypes: true
      })) == null ? void 0 : _c.filter(this.matchDirentToTest, this).map((dirent) => dirent.name)) || [];
    }
  }
  /**
   * Retursn all project's in the PlaywrightConfig that have the metadata type "setup"
   */
  listSetups() {
    var _a;
    return ((_a = this.config.projects) == null ? void 0 : _a.filter(
      (project) => {
        var _a2;
        return ((_a2 = project.metadata) == null ? void 0 : _a2.type) === "setup";
      }
    )) || [];
  }
  /**
   *
   * Simply splits the given name on each period (.) and
   * returns the first item of the produced array
   *
   * @param fileName the filename of the test
   *
   * @example getTestName("my-test.spec.ts") // "my-test"
   */
  getTestName(fileName) {
    return fileName.split(".")[0];
  }
  getResultPath(name, type, summary = false) {
    if (name.includes(".")) {
      throw new Error(
        "Please parse the name of the test file first with getTestName()"
      );
    }
    const resultName = summary ? `${type}-${name}.summary.json` : `${type}-${name}.json`;
    return path.join(this.reportsPath, resultName);
  }
  /**
   *
   * Simply runs a test with PlaywrightDashboardReporter as the reporter
   *
   * @param suiteName Name of the suite that contains the test
   * @param testName Name of the test file
   */
  async runTest(suiteName, fileName) {
    const testPath = path.resolve(this.testPath, suiteName, "tests", fileName);
    const testName = this.getTestName(fileName);
    const procName = ProcessManager.getProcessName(
      this.project.name,
      suiteName,
      testName
    );
    const testResultPath = this.getResultPath(testName, "test");
    const pm = new ProcessManager({
      name: procName,
      script: "npm",
      args: [
        "run",
        "test",
        "--",
        testPath,
        "--project",
        suiteName,
        "--reporter",
        this.customReporterPath
      ],
      env: {
        CUSTOM_REPORTER_OUTPUT_PATH: testResultPath
      },
      cwd: this.project.path,
      autorestart: false
    });
    return await pm.start(true);
  }
  // Implementation signature
  getTestResults(name, type, summary) {
    const testResultPath = this.getResultPath(name, type, summary);
    const content = Director.readFile(testResultPath);
    if (!content) {
      return;
    }
    try {
      const results = JSON.parse(content);
      if (summary) {
        return results;
      }
      return results;
    } catch (err) {
      const message = parseErrorToMessage(err);
      throw new Error(
        `Unable to parse results for ${testResultPath}: ${message}`
      );
    }
  }
  /**
   *
   * Simply runs a test suite with PlaywrightDashboardReporter as the reporter
   *
   * @param suiteName Name of the suite that contains the test
   */
  async runTestSuite(suiteName) {
    const procName = ProcessManager.getProcessName(
      this.project.name,
      suiteName
    );
    const testResultPath = this.getResultPath(suiteName, "suite", false);
    const pm = new ProcessManager({
      name: procName,
      script: "npm",
      args: [
        "run",
        "test",
        "--",
        "--project",
        suiteName,
        "--reporter",
        this.customReporterPath
      ],
      env: {
        CUSTOM_REPORTER_OUTPUT_PATH: testResultPath
      },
      cwd: this.project.path,
      autorestart: false
    });
    return await pm.start(true);
  }
  async runTestProject() {
    const procName = ProcessManager.getProcessName(this.project.name);
    const resultPath = this.getResultPath(this.project.name, "project");
    console.log({ resultPath, name: this.project.name });
    const pm = new ProcessManager({
      name: procName,
      script: "npm",
      args: ["run", "test", "--", "--reporter", this.customReporterPath],
      env: {
        CUSTOM_REPORTER_OUTPUT_PATH: resultPath
      },
      cwd: this.project.path,
      autorestart: false
    });
    return await pm.start(true);
  }
  /**
   *
   * Update a test file after it has been recorded inject:
   *
   *   await page.context().storageState({ path: "path-to-storage-state.json" }); // Store the auth state in storage-state.json
   *
   * @param filePath - The path to the test file.
   * @param storageStatePath - The path to where to store the storage state file
   *
   * @example
   * // … after saving the generated test file …
   * await injectStorageState(outputTestFilePath, authJsonPath);
   */
  async injectStorageState(filePath, storageStatePath) {
    const project = new Project$1();
    const source = project.addSourceFileAtPath(filePath);
    const testCalls = source.getDescendantsOfKind(SyntaxKind.CallExpression).filter((c) => {
      const expr = c.getExpression();
      return Node.isIdentifier(expr) && expr.getText() === "test";
    });
    if (testCalls.length === 0) return;
    const testCall = testCalls[0];
    const [, callback] = testCall.getArguments();
    if (Node.isArrowFunction(callback) || Node.isFunctionExpression(callback)) {
      const body = callback.getBody();
      if (Node.isBlock(body)) {
        const injectText = `await page.context().storageState({ path: "${storageStatePath}" });`;
        const exists = body.getStatements().some((stmt) => stmt.getText().includes(injectText));
        if (!exists) {
          body.addStatements(
            `await page.context().storageState({ path: "${storageStatePath}" });`
          );
        }
      }
    }
    await source.save();
  }
  async renameTestTitle(filePath, newTitle) {
    const project = new Project$1();
    const source = project.addSourceFileAtPath(filePath);
    const testCalls = source.getDescendantsOfKind(SyntaxKind.CallExpression).filter((call) => {
      const expr = call.getExpression();
      return Node.isIdentifier(expr) && expr.getText() === "test";
    });
    if (testCalls.length === 0) return;
    const testCall = testCalls[0];
    const args = testCall.getArguments();
    if (args.length === 0) return;
    const firstArg = args[0];
    if (Node.isStringLiteral(firstArg)) {
      firstArg.setLiteralValue(newTitle);
    } else {
      testCall.insertArgument(0, `"${newTitle}"`);
      testCall.removeArgument(1);
    }
    await source.save();
  }
}
const config = new Config();
const action$j = async ({ request }) => {
  var _a;
  const formData = await request.formData();
  const pat = (_a = formData.get("pat")) == null ? void 0 : _a.toString();
  if (!pat) {
    return {
      error: {
        message: "Please sumbit a Personal Access Token"
      }
    };
  }
  const PAT_REGEX = /^github_pat_[A-Za-z0-9_]{50,}$/;
  if (!PAT_REGEX.test(pat.toString())) {
    return {
      error: {
        message: "Invalid PAT token submitted"
      }
    };
  }
  const git = new Git();
  git.signIn(pat);
  const newGitConfig = {
    ...config.git,
    pat
  };
  config.updateConfig({ git: newGitConfig });
  return redirect("/");
};
const loader$i = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const preferredTheme = session.get("preferredTheme") || "";
  const pat = config.git.pat;
  if (pat) {
    const git = new Git();
    git.signIn();
  }
  return Response.json({ preferredTheme });
};
function AuthorizeGit() {
  const formData = useActionData();
  const { preferredTheme } = useLoaderData();
  const fetcher = useFetcher();
  const [showHelpModal, setShowHelpModal] = useState(false);
  const handleHideHelpModal = () => {
    setShowHelpModal(false);
  };
  const handleShowHelpModal = (event) => {
    event.preventDefault();
    setShowHelpModal(true);
  };
  return /* @__PURE__ */ jsx(Page, { title: "Authorize your GitHub Account", preferredTheme, children: /* @__PURE__ */ jsxs(Card, { className: "max-w-xl w-full", children: [
    /* @__PURE__ */ jsxs(
      Modal,
      {
        className: "w-128",
        title: "How to obtain a fine grained access token",
        showModal: showHelpModal,
        onHideModal: handleHideHelpModal,
        children: [
          /* @__PURE__ */ jsx(
            Alert,
            {
              color: "info",
              className: "mb-4",
              message: "The PAT (Personal Access Token) cannot have a lifetime longer than 365 days"
            }
          ),
          /* @__PURE__ */ jsxs("ol", { className: "space-y-2 text-sm", children: [
            /* @__PURE__ */ jsxs("li", { children: [
              "1. Go to",
              " ",
              /* @__PURE__ */ jsxs(
                Link,
                {
                  className: "link",
                  target: "_blank",
                  to: "https://github.com",
                  rel: "noreferrer",
                  children: [
                    /* @__PURE__ */ jsx("b", { children: "GitHub.com" }),
                    "."
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsx("li", { children: "2. Click on your profile icon (top right)." }),
            /* @__PURE__ */ jsx("li", { children: "3. Choose settings." }),
            /* @__PURE__ */ jsx("li", { children: "4. In the menu on the left side, choose “Developer settings” (at the bottom)." }),
            /* @__PURE__ */ jsx("li", { children: "5. Choose “Personal access tokens > Fine-grained token”." }),
            /* @__PURE__ */ jsx("li", { children: "6. Click “Generate new token”." }),
            /* @__PURE__ */ jsx("li", { children: "7. Confirm your login." }),
            /* @__PURE__ */ jsx("li", { children: "8. Enter “bb-testing-dashboard” as the token name and optionally enter a description." }),
            /* @__PURE__ */ jsx("li", {}),
            /* @__PURE__ */ jsx("li", { children: "9. Scroll down to “Repository access”." }),
            /* @__PURE__ */ jsx("li", { children: "10. Choose “All repositories”." }),
            /* @__PURE__ */ jsx("li", { children: "11. At the “Permissions” section, expand “Repository permissions”." }),
            /* @__PURE__ */ jsx("li", { children: "12. Configure “Administration” and “Contents” with Read and Write permissions." }),
            /* @__PURE__ */ jsx("li", { children: "13. Scroll all the way down, and click “Generate token”." }),
            /* @__PURE__ */ jsx("li", { children: "14. Copy/Paste the token in the textfield “Personal Access Token”." })
          ] }),
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsxs("p", { className: "text-sm mb-2", children: [
            "Official documentation on",
            " ",
            /* @__PURE__ */ jsx(
              "a",
              {
                target: "_blank",
                href: "https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token",
                className: "link",
                rel: "noreferrer",
                children: /* @__PURE__ */ jsx("b", { children: "Creating a fine grained personal access token" })
              }
            ),
            ". ",
            /* @__PURE__ */ jsx("br", {})
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "flex flex-row justify-end" }),
    /* @__PURE__ */ jsx(fetcher.Form, { method: "post", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ jsx("p", { className: "font-medium text-sm", children: "Please enter your Personal Access Token from GitHub:" }),
      (formData == null ? void 0 : formData.error) && /* @__PURE__ */ jsx(
        Alert,
        {
          color: "error",
          message: formData == null ? void 0 : formData.error.message,
          icon: MdError
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-row gap-2", children: [
        /* @__PURE__ */ jsx(
          TextField,
          {
            required: true,
            className: "w-full",
            placeholder: "Personal Access Token",
            name: "pat"
          }
        ),
        /* @__PURE__ */ jsx(Tooltip, { message: "Click for help", children: /* @__PURE__ */ jsx(Button, { square: true, onClick: handleShowHelpModal, children: /* @__PURE__ */ jsx(FaQuestion, {}) }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(Button, { loading: fetcher.state !== "idle", color: "primary", children: "Save" }) })
    ] }) })
  ] }) });
}
const route16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$j,
  default: AuthorizeGit,
  loader: loader$i
}, Symbol.toStringTag, { value: "Module" }));
const meta = () => {
  return [
    { title: "Testing Suite Dashboard" },
    { name: "description", content: "Welcome to your personal testing suite!" }
  ];
};
const loader$h = async ({ request }) => {
  const gitAuthorized = config.git.pat ? true : false;
  if (!gitAuthorized) {
    return redirect("/github/auth");
  }
  const session = await getSession(request.headers.get("Cookie"));
  const preferredTheme = session.get("preferredTheme");
  const message = session.get("message");
  session.set("message", "");
  const projects = Project.listProjects();
  return Response.json(
    { projects, message, preferredTheme },
    { headers: { "Set-Cookie": await commitSession(session) } }
  );
};
function Index() {
  const navigation = useNavigation();
  const {
    projects: data,
    upstreamHasChanges,
    message = "",
    preferredTheme
  } = useLoaderData();
  const [projects, setProjects] = useState(data);
  const [isLoading, setIsLoading] = useState(
    navigation.state !== "idle"
  );
  const handleClickSyncProjects = async (event) => {
    event.preventDefault();
    await syncProjects();
  };
  const syncProjects = async () => {
    const response = await fetch("/projects/sync", { method: "POST" });
    if (!response.ok) {
      return;
    }
    try {
      const { projects: projects2 } = await response.json();
      setProjects(projects2);
    } catch (err) {
      console.error(err);
    }
  };
  const hideSyncProjectModal = () => {
    setModal((prev) => ({ ...prev, showModal: false }));
  };
  const [selectedProject, setSelectedProject] = useState(null);
  const syncProject = async (project) => {
    setShowAlert(false);
    setIsLoading(true);
    const { name } = project;
    const response = await fetch(`/projects/sync/${name}`, {
      method: "POST"
    });
    if (!response.ok) {
      setAlertMessage(response.statusText);
      setShowAlert(true);
      setIsLoading(false);
      return;
    }
    try {
      const { projects: projects2 } = await response.json();
      setProjects(projects2);
    } catch (err) {
      setShowAlert(true);
      const message2 = err && typeof err === "object" && "message" in err ? err.message : err;
      setAlertMessage(message2);
      console.error(err);
    }
    setIsLoading(false);
  };
  const handleClickSyncProject = async (event) => {
    event.preventDefault();
    const { dataset } = event.currentTarget;
    if (!dataset.project) return;
    const project = projects.find(
      (project2) => project2.name === dataset.project
    );
    if (!project) {
      setShowAlert(true);
      setAlertMessage(`${project} is not a valid project`);
      return;
    }
    setSelectedProject(project);
    setModal({
      title: "Are you sure?",
      showModal: true,
      onHideModal: hideSyncProjectModal,
      buttons: [
        {
          children: "Confirm",
          color: "primary",
          onClick: handleConfirmSyncProject
        }
      ]
    });
  };
  const handleConfirmSyncProject = async (event) => {
    event.preventDefault();
    hideSyncProjectModal();
    if (!selectedProject) return;
    await syncProject(selectedProject);
  };
  const [modal, setModal] = useState({
    showModal: false,
    title: "",
    buttons: [
      {
        children: "Confirm",
        onClick: handleConfirmSyncProject,
        color: "primary"
      }
    ],
    onHideModal: hideSyncProjectModal
  });
  const [showAlert, setShowAlert] = useState(message ? true : false);
  const [alertMessage, setAlertMessage] = useState(message);
  const hideAlert = (event) => {
    event.preventDefault();
    setShowAlert(false);
  };
  return /* @__PURE__ */ jsxs(
    Page,
    {
      title: "Welcome to your personal testing suite",
      preferredTheme,
      children: [
        /* @__PURE__ */ jsx(Modal, { ...modal, children: "Please make sure you have saved your work before you continue." }),
        /* @__PURE__ */ jsxs(Card, { className: "max-w-xl w-full ", children: [
          /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-row justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-bold opacity-60 text-sm", children: "Suite name" }),
              /* @__PURE__ */ jsx(Heading, { size: "h4", children: "bb-testing" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-row gap-4" })
          ] }) }),
          showAlert && /* @__PURE__ */ jsx("div", { className: "pb-4", children: /* @__PURE__ */ jsx(
            Alert,
            {
              message: alertMessage,
              icon: FaCheckCircle,
              color: "success",
              buttons: [{ children: "Close", onClick: hideAlert }]
            }
          ) }),
          /* @__PURE__ */ jsx(
            List,
            {
              title: "Projects inside",
              button: /* @__PURE__ */ jsxs("div", { className: "flex flex-row gap-2", children: [
                /* @__PURE__ */ jsx(Link, { to: "/projects/create", "aria-disabled": isLoading, children: /* @__PURE__ */ jsxs(Button, { size: "sm", loading: isLoading, children: [
                  /* @__PURE__ */ jsx(FaPlus$1, {}),
                  "Create project"
                ] }) }),
                /* @__PURE__ */ jsxs(
                  Button,
                  {
                    size: "sm",
                    onClick: handleClickSyncProjects,
                    disabled: projects.length === 0,
                    loading: isLoading,
                    children: [
                      /* @__PURE__ */ jsx(FaSync, {}),
                      "Synchronize projects"
                    ]
                  }
                )
              ] }),
              items: projects.map((project) => {
                const buttons = [
                  {
                    "data-project": project.name,
                    tooltip: "View in dashboard",
                    href: `/projects/${project.name}/suites/view`,
                    icon: FaArrowAltCircleRight
                  },
                  {
                    "data-project": project.name,
                    icon: VscVscode,
                    href: project.urls.vscode,
                    tooltip: "Open in VSCode"
                  }
                ];
                if (project.git.initialized) {
                  buttons.push({
                    "data-project": project.name,
                    icon: FaGithub,
                    href: project.urls.git,
                    tooltip: "Open on GitHub"
                  });
                } else {
                  buttons.push({
                    "data-project": project.name,
                    icon: FaGitAlt,
                    loading: isLoading,
                    href: "/projects/init",
                    tooltip: "Initialize repository"
                  });
                }
                if (!project.git.remoteHasChanges) {
                  buttons.push({
                    "data-project": project.name,
                    icon: FaSync,
                    onClick: handleClickSyncProject,
                    loading: isLoading,
                    tooltip: "Sync changes"
                  });
                }
                const color = project.git.remoteHasChanges ? "primary" : project.git.error ? "error" : "success";
                const message2 = project.git.remoteHasChanges ? "An update is available!" : project.git.error ? project.git.error : "Project is up-to-date";
                return {
                  title: project.name,
                  icon: FaFolder,
                  buttons,
                  status: {
                    color,
                    ariaLabel: message2,
                    animate: color === "error" ? "ping" : void 0
                  }
                };
              })
            }
          )
        ] })
      ]
    }
  );
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index,
  loader: loader$h,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const loader$g = async () => {
  const projects = Project.listProjects();
  return Response.json({ projects });
};
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$g
}, Symbol.toStringTag, { value: "Module" }));
const action$i = async ({ request }) => {
  const projects = Project.listProjects();
  const git = new Git();
  const updatedProjects = [];
  for (const project of projects) {
    const { updated, message } = git.syncRepository(project.path);
    const currentGit = project.git;
    updatedProjects.push({
      ...project,
      git: { ...currentGit, remoteHasChanges: !updated, error: message }
    });
  }
  return Response.json({ projects: updatedProjects });
};
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$i
}, Symbol.toStringTag, { value: "Module" }));
const action$h = async ({ params, request }) => {
  var _a, _b, _c;
  const projectName = params.project;
  const formData = await request.formData();
  const name = (_a = formData.get("name")) == null ? void 0 : _a.toString();
  const test = (_b = formData.get("test")) == null ? void 0 : _b.toString();
  const suite = (_c = formData.get("suite")) == null ? void 0 : _c.toString();
  if (!projectName || !name || !test || !suite) {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }
  try {
    const project = new Project(projectName);
    const playwrightConfig = await project.getPlaywrightConfig();
    const testHelper = new TestHelper(project, playwrightConfig);
    await testHelper.createSetup(name, suite, test);
  } catch (err) {
    const message = parseErrorToMessage(err);
    return Response.json({ error: { message } });
  }
  return Response.json({ success: true });
};
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$h
}, Symbol.toStringTag, { value: "Module" }));
const action$g = ({ params }) => {
  const name = params.name;
  const projects = Project.listProjects();
  const project = projects.find((project2) => project2.name === name);
  if (!project) {
    return Response.json({
      error: {
        message: `Unable to find project ${project}`
      }
    });
  }
  const git = new Git();
  const { updated, message } = git.syncRepository(project.path);
  const newGitOptions = {
    ...project.git,
    remoteHasChanges: !updated,
    error: message
  };
  const newProjects = projects.map((project2) => {
    if (project2.name === name) {
      return {
        ...project2,
        git: newGitOptions
      };
    } else {
      return project2;
    }
  });
  return Response.json({ projects: newProjects });
};
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$g
}, Symbol.toStringTag, { value: "Module" }));
const action$f = async ({ params, request }) => {
  var _a;
  const projectName = params.project;
  const formData = await request.formData();
  const setup = (_a = formData.get("setup")) == null ? void 0 : _a.toString();
  if (!projectName || !setup) {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }
  try {
    const project = new Project(projectName);
    const playwrightConfig = await project.getPlaywrightConfig();
    const testHelper = new TestHelper(project, playwrightConfig);
    await testHelper.deleteSetup(setup);
    return Response.json({ success: true });
  } catch (err) {
    const message = parseErrorToMessage(err);
    throw new Response(message, {
      status: 500,
      statusText: "Internal Server Error"
    });
  }
};
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$f
}, Symbol.toStringTag, { value: "Module" }));
const loader$f = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const processName = searchParams.get("process");
    if (!processName) {
      throw new Response(null, { status: 400, statusText: "Bad Request" });
    }
    const pm = new ProcessManager();
    const process2 = await pm.status(processName);
    console.log(process2);
    return Response.json(process2);
  } catch (err) {
    const message = parseErrorToMessage(err);
    throw new Response(message, {
      status: 500,
      statusText: "Internal Server Error"
    });
  }
};
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$f
}, Symbol.toStringTag, { value: "Module" }));
const loader$e = async ({ params, request }) => {
  const projectName = params.project;
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const q = searchParams.get("q");
  if (!projectName) {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }
  try {
    const project = new Project(projectName);
    const playwrightConfig = await project.getPlaywrightConfig();
    const testHelper = new TestHelper(project, playwrightConfig);
    let tests = testHelper.listTests();
    if (q) {
      tests = tests.filter((test) => test.name.match(q) || test.suite.match(q));
    }
    return Response.json({ tests: tests.slice(0, 49) });
  } catch (err) {
    const message = parseErrorToMessage(err);
    throw new Response(message, {
      status: 500,
      statusText: "Internal Server Error"
    });
  }
};
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$e
}, Symbol.toStringTag, { value: "Module" }));
const action$e = async ({ params }) => {
  const projectName = params.project;
  const suite = params.suite;
  const test = params.test;
  if (!projectName || !suite || !test) {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }
  try {
    const project = new Project(projectName);
    const playwrightConfig = await project.getPlaywrightConfig();
    const testHelper = new TestHelper(project, playwrightConfig);
    const startTestStatus = await testHelper.runTest(suite, test);
    return Response.json({ process: startTestStatus });
  } catch (err) {
    const message = parseErrorToMessage(err);
    throw new Response(message, {
      status: 500,
      statusText: "Internal Server Error"
    });
  }
};
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$e
}, Symbol.toStringTag, { value: "Module" }));
const loader$d = async ({ params }) => {
  const projectName = params.project;
  const suite = params.suite;
  const test = params.test;
  if (!projectName || !suite || !test) {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }
  const processName = ProcessManager.getTestProcessName(suite, test);
  const pm = new ProcessManager();
  const process2 = await pm.status(processName);
  return Response.json({ process: process2 });
};
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$d
}, Symbol.toStringTag, { value: "Module" }));
const action$d = async ({ params }) => {
  const projectName = params.project;
  const suite = params.suite;
  if (!projectName || !suite) {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }
  try {
    const project = new Project(projectName);
    const playwrightConfig = await project.getPlaywrightConfig();
    const testHelper = new TestHelper(project, playwrightConfig);
    const startTestStatus = await testHelper.runTestSuite(suite);
    return Response.json({ process: startTestStatus });
  } catch (err) {
    const message = parseErrorToMessage(err);
    throw new Response(message, {
      status: 500,
      statusText: "Internal Server Error"
    });
  }
};
const route12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$d
}, Symbol.toStringTag, { value: "Module" }));
const action$c = async ({ params }) => {
  const projectName = params.project;
  if (!projectName) {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }
  try {
    const project = new Project(projectName);
    const playwrightConfig = await project.getPlaywrightConfig();
    const testHelper = new TestHelper(project, playwrightConfig);
    const process2 = await testHelper.runTestProject();
    return Response.json({ process: process2 });
  } catch (err) {
    const message = parseErrorToMessage(err);
    throw new Response(message, {
      status: 500,
      statusText: "Internal Server Error"
    });
  }
};
const route13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$c
}, Symbol.toStringTag, { value: "Module" }));
const action$b = async ({ request }) => {
  const formData = await request.formData();
  const theme = formData.get("theme");
  if (!theme) {
    return Response.json(null, { status: 400 });
  }
  const session = await getSession(request.headers.get("Cookie"));
  session.set("preferredTheme", theme);
  return Response.json(null, {
    headers: { "Set-Cookie": await commitSession(session) }
  });
};
const route14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$b
}, Symbol.toStringTag, { value: "Module" }));
const action$a = async () => {
  const git = new Git();
  const filesAtRisk = git.listConflicts(config.suitePath);
  if (filesAtRisk.length > 0) {
    return Response.json({
      confirm: {
        message: "If you continue with synchronizing, you will lose progress on the following files: ",
        filesAtRisk
      }
    });
  }
  const { updated, message } = git.updateRepository(
    config.suitePath,
    "upstream",
    "main"
  );
  if (message) {
    return Response.json({ error: { message } });
  }
  return Response.json({ updated });
};
const route15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$a
}, Symbol.toStringTag, { value: "Module" }));
const action$9 = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  const name = formData.get("name");
  if (!name) {
    return Response.json({
      error: {
        message: "Please provide a name"
      }
    });
  }
  const result = await Project.createProject(name.toString());
  if ("error" in result) {
    return Response.json(result);
  }
  session.flash("message", `Project ${result.name} created successfully`);
  return redirect("/", {
    headers: { "Set-Cookie": await commitSession(session) }
  });
};
const loader$c = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const preferredTheme = session.get("preferredTheme") || "";
  return Response.json({ preferredTheme });
};
function Create() {
  var _a;
  const actionData = useActionData();
  const loaderData = useLoaderData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const isLoading = navigation.state === "loading";
  return /* @__PURE__ */ jsx(
    Page,
    {
      title: "Create a new project",
      preferredTheme: loaderData.preferredTheme,
      children: /* @__PURE__ */ jsx(Card, { className: "max-w-xl w-full", children: /* @__PURE__ */ jsxs(Form, { method: "post", children: [
        actionData && actionData.error && /* @__PURE__ */ jsx(
          Alert,
          {
            message: (_a = actionData.error) == null ? void 0 : _a.message,
            color: "error",
            className: "mb-4"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
          isSubmitting ? /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { children: "Please wait while we create your new test project..." }),
            /* @__PURE__ */ jsx(Progress, {})
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("p", { className: "text-sm", children: [
              "Naming your project should be done according to the following convention: ",
              /* @__PURE__ */ jsx("b", { children: "customername-projectname-test" })
            ] }),
            /* @__PURE__ */ jsx(
              TextField,
              {
                name: "name",
                className: "w-full",
                placeholder: "Enter a project name..."
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-row justify-end gap-4", children: [
            /* @__PURE__ */ jsx(Link, { to: "/", "aria-disabled": isSubmitting || isLoading, children: /* @__PURE__ */ jsx(Button, { disabled: isSubmitting || isLoading, children: "Cancel" }) }),
            /* @__PURE__ */ jsxs(
              Button,
              {
                type: "submit",
                color: "primary",
                loading: isSubmitting || isLoading,
                children: [
                  /* @__PURE__ */ jsx(FaPlus$1, {}),
                  "Create"
                ]
              }
            )
          ] })
        ] })
      ] }) })
    }
  );
}
const route17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$9,
  default: Create,
  loader: loader$c
}, Symbol.toStringTag, { value: "Module" }));
const loader$b = async ({ params, request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const preferredTheme = session.get("preferredTheme");
  const projectName = params.name;
  if (!projectName) {
    return Response.json(null, { status: 400 });
  }
  const projectHelper = new Project(projectName);
  return { project: projectHelper.details, preferredTheme };
};
function ViewProject() {
  const { project, preferredTheme } = useLoaderData();
  return /* @__PURE__ */ jsx(
    Page,
    {
      title: project && project.name,
      withDrawer: true,
      preferredTheme,
      drawerItems: [
        // {
        //   label: "Dashboard",
        //   href: "",
        //   baseURL: `/projects/${project.name}/dashboard`,
        // },
        {
          label: "Test suites",
          href: "/view",
          baseURL: `/projects/${project.name}/suites`
        },
        {
          label: "Configuration",
          href: "",
          baseURL: `/projects/${project.name}/configuration`
        }
      ],
      children: /* @__PURE__ */ jsx(Outlet, { context: { project } })
    }
  );
}
const route18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ViewProject,
  loader: loader$b
}, Symbol.toStringTag, { value: "Module" }));
const action$8 = async ({ params, request }) => {
  const projectName = params.name;
  if (!projectName) {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }
  const formData = await request.formData();
  const appURL = formData.get("appURL");
  try {
    const project = new Project(projectName);
    const playwrightConfig = await project.getPlaywrightConfig();
    const { metadata } = playwrightConfig;
    await project.updatePlaywrightConfig({ metadata: { ...metadata, appURL } });
    return Response.json({ success: true });
  } catch (err) {
    const message = parseErrorToMessage(err);
    throw new Response(message, {
      status: 500,
      statusText: "Internal Server Error"
    });
  }
};
const loader$a = async ({ params }) => {
  const projectName = params.name;
  if (!projectName) {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }
  try {
    const project = new Project(projectName);
    const playwrightConfig = await project.getPlaywrightConfig();
    const testHelper = new TestHelper(project, playwrightConfig);
    const appURL = testHelper.appURL;
    return Response.json({
      appURL
    });
  } catch (err) {
    const message = parseErrorToMessage(err);
    throw new Response(message, {
      status: 500,
      statusText: "Internal Server Error"
    });
  }
};
function Configuration() {
  const { appURL } = useLoaderData();
  const formRef = useRef(null);
  const onSave = () => {
    const form = formRef.current;
    if (!form) return;
    if (!form.reportValidity()) {
      return;
    }
    form.submit();
  };
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-between", children: [
      /* @__PURE__ */ jsx(Heading, { size: "h1", children: "Project configuration" }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-row gap-2", children: /* @__PURE__ */ jsxs(Button, { color: "primary", onClick: onSave, children: [
        /* @__PURE__ */ jsx(FaSave, {}),
        " Save"
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Card, { className: "w-full h-full", children: /* @__PURE__ */ jsx(Form, { method: "POST", ref: formRef, children: /* @__PURE__ */ jsxs("div", { className: "grid gap-2 max-w-lg", children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "appURl", className: "text-sm font-bold", children: "App URL" }),
      /* @__PURE__ */ jsx(
        TextField,
        {
          id: "appURL",
          className: "w-full",
          name: "appURL",
          icon: FaLink,
          iconPlacement: "end",
          defaultValue: appURL ? appURL : void 0
        }
      )
    ] }) }) })
  ] });
}
const route19 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$8,
  default: Configuration,
  loader: loader$a
}, Symbol.toStringTag, { value: "Module" }));
function Dashboard() {
  return /* @__PURE__ */ jsx(Fragment, {});
}
const route20 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Dashboard
}, Symbol.toStringTag, { value: "Module" }));
const loader$9 = async ({
  params
}) => {
  const projectName = params.name;
  if (!projectName) {
    throw new Response("Invalid project");
  }
  try {
    const project = new Project(projectName);
    const playwrightConfig = await project.getPlaywrightConfig();
    const testHelper = new TestHelper(project, playwrightConfig);
    const suites = testHelper.listSuites();
    return Response.json({
      suites
    });
  } catch (err) {
    const message = parseErrorToMessage(err);
    throw new Response(message, {
      status: 500,
      statusText: "Internal Server Error"
    });
  }
};
function ProjectDashboard() {
  const { project } = useOutletContext();
  const { suites } = useLoaderData();
  const mapTestSuites = (suites2) => {
    return suites2.map(
      (suite) => {
        var _a, _b;
        return {
          title: suite.name,
          icon: FaUser,
          status: {
            ariaLabel: upperCaseFirstLetter((_a = suite.results) == null ? void 0 : _a.status),
            color: ((_b = suite.results) == null ? void 0 : _b.status) === "passed" ? "success" : "error"
          },
          statusPosition: "start",
          buttons: [
            {
              icon: FaTrash,
              onClick: handleShowDeleteTestSuite,
              color: "error",
              "data-suite": suite.name
            },
            {
              icon: FaFolderOpen,
              href: `/projects/${project.name}/suites/${suite.name}/view`
            }
          ]
        };
      }
    );
  };
  const [showCreateTestSuite, setShowCreateTestSuite] = useState(false);
  const handleShowCreateTestSuite = () => {
    setShowCreateTestSuite(true);
  };
  const handleHideCreateTestSuite = () => {
    setShowCreateTestSuite(false);
  };
  const [selectedSuite, setSelectedSuite] = useState("");
  const [showDeleteTestSuite, setShowDeleteTestSuite] = useState(false);
  const handleShowDeleteTestSuite = (event) => {
    const { dataset } = event.currentTarget;
    if (!dataset.suite) return;
    setSelectedSuite(dataset.suite);
    setShowDeleteTestSuite(true);
  };
  const handleHideDeleteTestSuite = () => {
    setShowDeleteTestSuite(false);
  };
  return /* @__PURE__ */ jsxs("div", { className: "w-full h-screen", children: [
    /* @__PURE__ */ jsx(
      CreateTestSuiteModal,
      {
        project,
        showModal: showCreateTestSuite,
        onHideModal: handleHideCreateTestSuite,
        onSuccess: handleHideCreateTestSuite
      }
    ),
    /* @__PURE__ */ jsx(
      DeleteTestSuiteModal,
      {
        suite: selectedSuite,
        project,
        showModal: showDeleteTestSuite,
        onSuccess: handleHideDeleteTestSuite,
        onHideModal: handleHideDeleteTestSuite
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-row justify-between items-center", children: [
        /* @__PURE__ */ jsx(Heading, { size: "h1", children: "Test Suites" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-row gap-2", children: /* @__PURE__ */ jsx(RunTestButton, { type: "project" }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "w-full", children: [
        /* @__PURE__ */ jsx(Heading, { size: "h5", className: "mb-4", children: "Your Test Suites" }),
        /* @__PURE__ */ jsx(
          List,
          {
            items: mapTestSuites(suites),
            title: `${suites.length} tests suites found`,
            noResultsText: "No tests suites found",
            button: /* @__PURE__ */ jsx(Button, { onClick: handleShowCreateTestSuite, type: "button", children: "Create New Suite" })
          }
        )
      ] })
    ] })
  ] });
}
const route21 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ProjectDashboard,
  loader: loader$9
}, Symbol.toStringTag, { value: "Module" }));
const action$7 = async ({ params, request }) => {
  var _a, _b;
  const formData = await request.formData();
  const name = (_a = formData.get("name")) == null ? void 0 : _a.toString();
  const projectName = (_b = params == null ? void 0 : params.name) == null ? void 0 : _b.toString();
  if (!name) {
    return Response.json({
      error: { message: "Name is required" }
    });
  }
  if (!projectName) {
    return Response.json({
      error: {
        message: "Project is required"
      }
    });
  }
  const project = new Project(projectName);
  const playwrightConfig = await project.getPlaywrightConfig();
  const testHelper = new TestHelper(project, playwrightConfig);
  const newTestSuite = await testHelper.createSuite(name);
  return Response.json(newTestSuite);
};
const route22 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$7
}, Symbol.toStringTag, { value: "Module" }));
const action$6 = async ({ params, request }) => {
  var _a;
  const projectName = params.name;
  const formData = await request.formData();
  const suite = (_a = formData.get("suite")) == null ? void 0 : _a.toString();
  if (!projectName || !suite) {
    return Response.json(
      { error: { message: "Bad Request" } },
      { status: 400 }
    );
  }
  const project = new Project(projectName);
  const playwrightConfig = await project.getPlaywrightConfig();
  const testHelper = new TestHelper(project, playwrightConfig);
  await testHelper.deleteSuite(suite);
  return Response.json({ success: true });
};
const route23 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$6
}, Symbol.toStringTag, { value: "Module" }));
const loader$8 = async ({
  params
}) => {
  var _a;
  const suite = params.suite;
  const projectName = params.name;
  if (!suite || !projectName) {
    throw new Response(null, {
      status: 400,
      statusText: "Internal Server Error"
    });
  }
  try {
    const project = new Project(projectName);
    const playwrightConfig = await project.getPlaywrightConfig();
    const currentSuite = (_a = playwrightConfig.projects) == null ? void 0 : _a.find(
      (project2) => project2.name === suite
    );
    const dependencies = (currentSuite == null ? void 0 : currentSuite.dependencies) || [];
    return Response.json({ suite, dependencies });
  } catch (err) {
    const message = parseErrorToMessage(err);
    throw new Response(message, {
      status: 500,
      statusText: "Internal Server Error"
    });
  }
};
function ViewSuite() {
  const { suite, dependencies } = useLoaderData();
  const { project } = useOutletContext();
  return /* @__PURE__ */ jsx(Outlet, { context: { suite, project, dependencies } });
}
const route24 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ViewSuite,
  loader: loader$8
}, Symbol.toStringTag, { value: "Module" }));
function ListTests({
  tests,
  suite
}) {
  const { project } = useOutletContext();
  const mapTests = (t) => {
    return t.map((test) => ({
      title: test.name,
      status: {
        color: test.failed ? "error" : "success",
        ariaLabel: test.failed ? "This test failed" : "This test passed"
      },
      statusPosition: "start",
      buttons: [
        {
          "data-test": test.name,
          icon: FaTrash$1,
          color: "error",
          onClick: showModal
        },
        {
          "data-test": test.name,
          icon: FaArrowRight,
          href: `../tests/${test.name}/view`
        }
      ],
      icon: RiTestTubeFill
    })) || [];
  };
  const [showDeleteTestModal, setShowDeleteTestModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState("");
  const showModal = (event) => {
    event.preventDefault();
    const { dataset } = event.currentTarget;
    const test = dataset.test;
    if (!test) return;
    setSelectedTest(test);
    setShowDeleteTestModal(true);
  };
  const hideModal = () => {
    setShowDeleteTestModal(false);
  };
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(
      DeleteTestModal,
      {
        onHideModal: hideModal,
        suite,
        test: selectedTest,
        project,
        onSuccess: hideModal,
        showModal: showDeleteTestModal
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxs(Heading, { size: "h5", children: [
        "Tests for ",
        suite
      ] }),
      /* @__PURE__ */ jsx(Link, { to: "../record/start", children: /* @__PURE__ */ jsxs(Button, { children: [
        /* @__PURE__ */ jsx(RiRecordCircleLine, {}),
        " Record Test",
        " "
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(
      List,
      {
        noResultsText: "No tests were found yet",
        title: `${tests.length} tests found`,
        items: mapTests(tests)
      }
    )
  ] });
}
const loader$7 = async ({ params }) => {
  const suite = params.suite;
  const projectName = params.name;
  if (!suite || !projectName) {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }
  const project = new Project(projectName);
  const playwrightConfig = await project.getPlaywrightConfig();
  const testHelper = new TestHelper(project, playwrightConfig);
  const tests = testHelper.listTests(suite);
  const summary = testHelper.getTestResults(suite, "suite", true);
  const mappedTests = tests.map((test) => ({
    ...test,
    failed: Boolean(summary == null ? void 0 : summary.failed.find((t) => t.name === test.name))
  }));
  return Response.json({ tests: mappedTests, summary });
};
function ViewTestSuite() {
  const { project, suite } = useOutletContext();
  const { tests } = useLoaderData();
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row justify-between items-center", children: [
      /* @__PURE__ */ jsxs(Heading, { size: "h1", children: [
        "Test Suite for ",
        suite
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-row gap-2", children: [
        /* @__PURE__ */ jsx(Link, { to: `../../suites/view`, children: /* @__PURE__ */ jsx(Button, { children: "Go back" }) }),
        /* @__PURE__ */ jsx(Link, { to: `/projects/${project.name}/suites/${suite}/configuration`, children: /* @__PURE__ */ jsxs(Button, { children: [
          /* @__PURE__ */ jsx(FaGear, {}),
          "Configure"
        ] }) }),
        /* @__PURE__ */ jsx(RunTestButton, { type: "suite" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(ListTests, { tests, suite })
  ] });
}
const route25 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ViewTestSuite,
  loader: loader$7
}, Symbol.toStringTag, { value: "Module" }));
const reactFlowStyleSheet = "/assets/style-Dl9Bm5cW.css";
const links$1 = () => {
  return [{ rel: "stylesheet", href: reactFlowStyleSheet }];
};
const action$5 = async ({ params, request }) => {
  var _a;
  const projectName = params.name;
  const suite = params.suite;
  const formData = await request.formData();
  const dependency = (_a = formData.get("dependency")) == null ? void 0 : _a.toString();
  if (!dependency || !suite || !projectName) {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }
  if (dependency === suite) {
    throw new Response("Circular dependencies are not allowed", {
      status: 400,
      statusText: "Bad Request"
    });
  }
  try {
    const project = new Project(projectName);
    const playwrightConfig = await project.getPlaywrightConfig();
    const testHelper = new TestHelper(project, playwrightConfig);
    await testHelper.addOrRemoveDependencyFromSuite(suite, dependency);
  } catch (err) {
    const message = parseErrorToMessage(err);
    throw new Response(message, {
      status: 500,
      statusText: "Internal Server Error"
    });
  }
  return Response.json({ success: true });
};
const loader$6 = async ({ params }) => {
  var _a;
  const projectName = params.name;
  const suite = params.suite;
  if (!projectName || !suite) {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }
  try {
    const project = new Project(projectName);
    const playwrightConfig = await project.getPlaywrightConfig();
    const testHelper = new TestHelper(project, playwrightConfig);
    const currentDependencies = testHelper.getSetupDependencies(suite).flatMap((subSetups) => subSetups.name);
    const dependencyGraph = testHelper.getDependencyGraph(suite);
    const fullDependencyTree = testHelper.generateDependencyTree(suite);
    return Response.json({
      suite: {
        name: suite,
        currentDependencies,
        dependencyTree: fullDependencyTree,
        availableDependencies: (_a = playwrightConfig.projects) == null ? void 0 : _a.filter(
          (project2) => {
            var _a2;
            return ((_a2 = project2.metadata) == null ? void 0 : _a2.type) === "setup";
          }
        ),
        dependencyGraph
      }
    });
  } catch (err) {
    const message = parseErrorToMessage(err);
    throw new Response(message, {
      status: 500,
      statusText: "Internal Server Error"
    });
  }
};
function ConfigureDependencies() {
  const { project } = useOutletContext();
  const {
    suite: {
      name,
      dependencyGraph,
      dependencyTree,
      currentDependencies,
      availableDependencies
    }
  } = useLoaderData();
  const [showHelpModal, setShowHelpModal] = useState(false);
  const showModal = () => {
    setShowHelpModal(true);
  };
  const hideHelpModal = () => {
    setShowHelpModal(false);
  };
  const updateDepFetcher = useFetcher({ key: "update-deps" });
  const currentFetcher = useFetcher();
  const onChangeDependencyToggle = (event) => {
    const { dataset } = event.currentTarget;
    const dependency = dataset.dependency;
    if (!dependency) return;
    updateDepFetcher.submit({ dependency }, { method: "POST" });
  };
  useEffect(() => {
    if (currentFetcher.data) {
      if (isServerErrorWithMessage(currentFetcher.data)) return;
      currentFetcher.load("./");
    }
  }, [currentFetcher.data]);
  const mapDependencies = (deps) => deps.map((dep, i) => /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-row gap-4 items-center p-4", children: [
        /* @__PURE__ */ jsx(
          Toggle,
          {
            checked: currentDependencies.includes(dep.name),
            "data-dependency": dep.name,
            onChange: onChangeDependencyToggle
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "font-bold text-sm", children: dep.name }),
        /* @__PURE__ */ jsx(
          Badge,
          {
            color: dep.metadata.type === "suite" ? "primary" : "secondary",
            size: "sm",
            children: dep.metadata.type
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        Button,
        {
          square: true,
          "data-name": dep.name,
          type: "button",
          className: "active:bg-error",
          onClick: showDeleteDepModal,
          children: /* @__PURE__ */ jsx(FaTrash, {})
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "ml-4 bg-base-300 shadow-inner flex flex-row items-center", children: mapDependencies(dep.dependencies) })
  ] }, `${dep.name}-${i}`));
  const [deleteDepModalShown, setDeleteDepModalShow] = useState(false);
  const [depToDelete, setDepToDelete] = useState("");
  const showDeleteDepModal = (event) => {
    const { dataset } = event.currentTarget;
    const name2 = dataset.name;
    if (!name2) return;
    setDepToDelete(name2);
    setDeleteDepModalShow(true);
  };
  const hideDeleteDepModal = () => {
    setDeleteDepModalShow(false);
  };
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-4", children: [
    /* @__PURE__ */ jsx(
      HelpDependencyModal,
      {
        showModal: showHelpModal,
        onHideModal: hideHelpModal
      }
    ),
    /* @__PURE__ */ jsx(
      DeleteDependencyModal,
      {
        showModal: deleteDepModalShown,
        onHideModal: hideDeleteDepModal,
        onSuccess: hideDeleteDepModal,
        project,
        dependency: depToDelete
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-between", children: [
      /* @__PURE__ */ jsx(Heading, { size: "h1", children: "Suite Configuration" }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-row gap-2", children: [
        /* @__PURE__ */ jsx(Link, { to: "../view", children: /* @__PURE__ */ jsx(Button, { children: "Go back" }) }),
        /* @__PURE__ */ jsxs(Button, { onClick: showModal, children: [
          /* @__PURE__ */ jsx(FaQuestionCircle, {}),
          "Help"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", { className: "grid gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm", children: /* @__PURE__ */ jsx("b", { children: "Name" }) }),
        /* @__PURE__ */ jsx(
          TextField,
          {
            className: "w-full",
            placeholder: "name",
            name: "suite",
            value: name,
            disabled: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center gap-2", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm", children: /* @__PURE__ */ jsx("b", { children: "Dependencies" }) }),
          /* @__PURE__ */ jsx(Tooltip, { message: "Dependencies are tests that are executed (in parallel) before each test or recording.", children: /* @__PURE__ */ jsx(FaQuestionCircle, { className: "opacity-30" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-12 gap-4 min-h-64", children: [
          /* @__PURE__ */ jsx("div", { className: "col-span-8 h-full", children: /* @__PURE__ */ jsxs("div", { className: "w-full h-full shadow-lg rounded-lg p-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-between", children: [
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-neutral opacity-60", children: [
                availableDependencies.length || 0,
                " available",
                " ",
                availableDependencies.length > 0 ? "dependencies" : "dependency",
                " ",
                "found"
              ] }),
              /* @__PURE__ */ jsx(Link, { to: "create-setup", children: /* @__PURE__ */ jsxs(Button, { color: "primary", children: [
                /* @__PURE__ */ jsx(FaPlus, {}),
                " Create"
              ] }) })
            ] }),
            mapDependencies(dependencyTree)
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "col-span-4 bg-base-200 rounded-lg", children: /* @__PURE__ */ jsxs(
            ReactFlow,
            {
              fitView: true,
              nodes: dependencyGraph.nodes,
              edges: dependencyGraph.edges,
              children: [
                /* @__PURE__ */ jsx(
                  Background,
                  {
                    color: "#ccc",
                    size: 2,
                    variant: BackgroundVariant.Dots
                  }
                ),
                /* @__PURE__ */ jsx(Controls, {})
              ]
            }
          ) })
        ] })
      ] })
    ] }) })
  ] });
}
const route26 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$5,
  default: ConfigureDependencies,
  links: links$1,
  loader: loader$6
}, Symbol.toStringTag, { value: "Module" }));
const links = () => {
  return [{ rel: "stylesheet", href: reactFlowStyleSheet }];
};
const action$4 = async ({ params, request }) => {
  var _a, _b, _c, _d, _e;
  const projectName = params.name;
  const formData = await request.formData();
  const name = (_a = formData.get("name")) == null ? void 0 : _a.toString();
  const test = (_b = formData.get("test")) == null ? void 0 : _b.toString();
  const suite = (_c = formData.get("suite")) == null ? void 0 : _c.toString();
  const session = (_d = formData.get("session")) == null ? void 0 : _d.toString();
  const dependencies = (_e = formData.get("dependencies")) == null ? void 0 : _e.toString();
  if (!projectName || !name || !test || !suite || !session) {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }
  try {
    const project = new Project(projectName);
    const playwrightConfig = await project.getPlaywrightConfig();
    const testHelper = new TestHelper(project, playwrightConfig);
    const dependencyArray = (dependencies == null ? void 0 : dependencies.split(",").filter(Boolean)) || [];
    const parsedName = parseName(name);
    await testHelper.createSetup(
      parsedName,
      suite,
      test,
      dependencyArray,
      session === "reuse"
    );
    return redirect("../configuration");
  } catch (err) {
    const message = parseErrorToMessage(err);
    return Response.json({ error: { message } });
  }
};
const loader$5 = async ({ params }) => {
  var _a;
  const projectName = params.name;
  const suite = params.suite;
  if (!projectName || !suite) {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }
  try {
    const project = new Project(projectName);
    const playwrightConfig = await project.getPlaywrightConfig();
    const testHelper = new TestHelper(project, playwrightConfig);
    const dependencyGraph = testHelper.getDependencyGraph(suite);
    const fullDependencyTree = testHelper.generateDependencyTree(suite);
    return Response.json({
      suite: {
        name: suite,
        dependencyTree: fullDependencyTree,
        availableDependencies: (_a = playwrightConfig.projects) == null ? void 0 : _a.filter(
          (project2) => {
            var _a2;
            return ((_a2 = project2.metadata) == null ? void 0 : _a2.type) === "setup";
          }
        ),
        dependencyGraph
      }
    });
  } catch (err) {
    const message = parseErrorToMessage(err);
    throw new Response(message, {
      status: 500,
      statusText: "Internal Server Error"
    });
  }
};
function CreateSetup() {
  const actionData = useActionData();
  const {
    suite: { availableDependencies, dependencyGraph: depGraph, dependencyTree }
  } = useLoaderData();
  const { suite, project } = useOutletContext();
  const [sessionBehaviour, setSessionBehaviour] = useState(
    "reuse"
  );
  const [dependencyGraph, setDependencyGraph] = useState(depGraph);
  const onChangeSessionBehaviour = (event) => {
    const name = event.currentTarget.name;
    setSessionBehaviour(name);
  };
  const fetcher = useFetcher();
  const [availableTests, setAvailableTests] = useState([]);
  const testFetcher = useFetcher({ key: "list-tests" });
  const onSearchChange = (q) => {
    testFetcher.load(`/api/tests/${project.name}/list?q=${q}`);
  };
  useEffect(() => {
    if (testFetcher.data) {
      if (isServerErrorWithMessage(testFetcher.data)) return;
      const tests = testFetcher.data.tests;
      setAvailableTests(tests);
    }
  }, [testFetcher.data]);
  const [enabledDeps, setEnabledDeps] = useState(/* @__PURE__ */ new Set());
  const onChangeDependencyToggle = (e) => {
    const name = e.currentTarget.dataset.dependency;
    setEnabledDeps((prev) => {
      const next = new Set(prev);
      if (e.currentTarget.checked) next.add(name);
      else next.delete(name);
      return next;
    });
  };
  function filterTree(nodes, enabled) {
    const out = [];
    for (const node of nodes) {
      if (enabled.has(node.name)) {
        out.push(node);
      } else {
        out.push(...filterTree(node.dependencies, enabled));
      }
    }
    return out;
  }
  function flattenTree(nodes) {
    const projects = [];
    function dfs(n) {
      projects.push({
        name: n.name,
        metadata: n.metadata,
        // only the _names_ of its child dependencies
        dependencies: n.dependencies.map((c) => c.name)
      });
      n.dependencies.forEach(dfs);
    }
    nodes.forEach(dfs);
    return projects;
  }
  useEffect(() => {
    const subtrees = filterTree(dependencyTree, enabledDeps);
    const projects = flattenTree(subtrees);
    const uniqueProjects = Array.from(
      new Map(projects.map((p) => [p.name, p])).values()
    );
    const { nodes, edges } = buildDependencyGraph(uniqueProjects);
    const layoutedDepGraph = getLayoutedElements(nodes, edges);
    setDependencyGraph(layoutedDepGraph);
  }, [enabledDeps]);
  const mapDependencies = (deps, parent) => deps.map((dep, i) => /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row gap-4 items-center p-4", children: [
      /* @__PURE__ */ jsx(
        Toggle,
        {
          className: parent && enabledDeps.has(parent) ? "cursor-not-allowed" : "",
          "data-dependency": dep.name,
          "data-parent": parent,
          onChange: onChangeDependencyToggle,
          id: `${dep.name}-toggle`,
          checked: enabledDeps.has(dep.name) || parent && enabledDeps.has(parent) || false
        }
      ),
      /* @__PURE__ */ jsx(
        "label",
        {
          htmlFor: `${dep.name}-toggle`,
          className: classNames(
            parent && enabledDeps.has(parent) ? "cursor-not-allowed" : "",
            "font-bold text-sm"
          ),
          children: dep.name
        }
      ),
      /* @__PURE__ */ jsx(
        Badge,
        {
          color: dep.metadata.type === "suite" ? "primary" : "secondary",
          size: "sm",
          children: dep.metadata.type
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "ml-4 bg-base-300 shadow-inner flex flex-row items-center", children: mapDependencies(dep.dependencies, dep.name) })
  ] }, `${dep.name}-${i}`));
  return /* @__PURE__ */ jsx(Form, { method: "POST", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-between", children: [
      /* @__PURE__ */ jsx(Heading, { size: "h1", children: "Create dependency" }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-row gap-2", children: [
        /* @__PURE__ */ jsx(Link, { to: "../configuration", children: /* @__PURE__ */ jsx(Button, { type: "button", children: "Go back" }) }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            color: "primary",
            type: "submit",
            loading: fetcher.state !== "idle",
            children: [
              /* @__PURE__ */ jsx(FaSave, {}),
              "Save"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "hidden",
          name: "dependencies",
          value: Array.from(enabledDeps.values()).join(",")
        }
      ),
      /* @__PURE__ */ jsx("input", { type: "hidden", name: "suite", value: suite }),
      /* @__PURE__ */ jsx("input", { type: "hidden", name: "session", value: sessionBehaviour }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm mb-2", children: "A dependency is a test which you can re-use between suites. Each dependency can have its own subset of dependencies." }),
          isServerErrorWithMessage(actionData) && /* @__PURE__ */ jsx(Alert, { message: actionData.error.message, color: "error" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold mb-1", children: "Name" }),
          /* @__PURE__ */ jsx(
            TextField,
            {
              className: "w-full",
              placeholder: "E.g. admin-login",
              required: true,
              name: "name"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-row gap-2 items-center", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-bold mb-1", children: "Session Behaviour" }),
            /* @__PURE__ */ jsx(
              Tooltip,
              {
                message: "Reusing your session data (cookies & local storage) will make\n                        recording and replaying tests much faster—no need to log in every time.\n                        If you need a truly clean slate, choose “Start fresh.” If your not sure, ask your developer!",
                children: /* @__PURE__ */ jsx(FaQuestionCircle, { className: "opacity-30" })
              }
            )
          ] }),
          /* @__PURE__ */ jsx("fieldset", { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-row gap-2 items-center", children: [
              /* @__PURE__ */ jsx(
                Radio,
                {
                  onChange: onChangeSessionBehaviour,
                  checked: sessionBehaviour === "reuse",
                  name: "reuse",
                  defaultChecked: true
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Reuse session data" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-row gap-2 items-center", children: [
              /* @__PURE__ */ jsx(
                Radio,
                {
                  onChange: onChangeSessionBehaviour,
                  checked: sessionBehaviour === "fresh",
                  name: "fresh"
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Start fresh" })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold mb-1", children: "Select a test" }),
          /* @__PURE__ */ jsx(
            Autocomplete,
            {
              debounce: 300,
              name: "test",
              options: availableTests.map((test) => ({
                label: `${test.suite} - ${test.name}`,
                value: test.path
              })),
              onSearchChange
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold mb-1", children: "(Optional) Configure dependencies" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-12 gap-4 min-h-64", children: [
            /* @__PURE__ */ jsx("div", { className: "col-span-8 h-full", children: /* @__PURE__ */ jsxs("div", { className: "w-full h-full shadow-lg rounded-lg p-4", children: [
              /* @__PURE__ */ jsx("div", { className: "p-2", children: /* @__PURE__ */ jsxs("p", { className: "text-xs text-neutral opacity-60", children: [
                availableDependencies.length || 0,
                " available",
                " ",
                availableDependencies.length > 0 ? "dependencies" : "dependency",
                " ",
                "found"
              ] }) }),
              mapDependencies(dependencyTree)
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "col-span-4 bg-base-200 rounded-lg", children: /* @__PURE__ */ jsxs(
              ReactFlow,
              {
                fitView: true,
                nodes: dependencyGraph.nodes,
                edges: dependencyGraph.edges,
                children: [
                  /* @__PURE__ */ jsx(
                    Background,
                    {
                      color: "#ccc",
                      size: 2,
                      variant: BackgroundVariant.Dots
                    }
                  ),
                  /* @__PURE__ */ jsx(Controls, {})
                ]
              }
            ) })
          ] })
        ] })
      ] })
    ] })
  ] }) });
}
const route27 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$4,
  default: CreateSetup,
  links,
  loader: loader$5
}, Symbol.toStringTag, { value: "Module" }));
const action$3 = async ({ params, request }) => {
  var _a;
  const projectName = params.name;
  const suite = params.suite;
  const formData = await request.formData();
  const test = (_a = formData.get("test")) == null ? void 0 : _a.toString();
  if (!projectName || !suite || !test) {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }
  try {
    const project = new Project(projectName);
    const playwrightConfig = await project.getPlaywrightConfig();
    const testHelper = new TestHelper(project, playwrightConfig);
    await testHelper.deleteTest(suite, test);
  } catch (err) {
    const message = parseErrorToMessage(err);
    throw new Response(message, {
      status: 500,
      statusText: "Internal Server Error"
    });
  }
  return Response.json({ success: true });
};
const route28 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$3
}, Symbol.toStringTag, { value: "Module" }));
const loader$4 = async ({
  params
}) => {
  const testName = params.test;
  if (!testName) {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }
  return Response.json({ testName });
};
function TestOutlet() {
  const { testName } = useLoaderData();
  const { suite, project, dependencies } = useOutletContext();
  return /* @__PURE__ */ jsx(Outlet, { context: { testName, project, suite, dependencies } });
}
const route29 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: TestOutlet,
  loader: loader$4
}, Symbol.toStringTag, { value: "Module" }));
function ResultSection({ test }) {
  var _a;
  const runTestFetcher = useFetcher({ key: "run-test" });
  const isTestRunning = runTestFetcher.state !== "idle";
  const testDuration = (_a = test.duration) == null ? void 0 : _a.toString().split(".")[0];
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-between", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center gap-2", children: [
      /* @__PURE__ */ jsx(Heading, { size: "h6", children: "Status:" }),
      runTestFetcher.state === "idle" ? /* @__PURE__ */ jsx(
        Badge,
        {
          size: "xl",
          color: test.status === "passed" ? "success" : "error",
          children: upperCaseFirstLetter(test.status)
        }
      ) : /* @__PURE__ */ jsx(Tooltip, { message: "Your test is currenty running", children: /* @__PURE__ */ jsxs(Badge, { color: "info", size: "xl", children: [
        /* @__PURE__ */ jsx(Spin, { loop: true, duration: 3e3, children: /* @__PURE__ */ jsx(FaGear, { calcMode: "animate-spin" }) }),
        "Running"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center gap-2", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-neutral opacity-30", children: [
        isTestRunning && "dd/MM/yy hh:mm:ss",
        !isTestRunning && parseDate(test.startTime, "dd/MM/yy hh:mm:ss")
      ] }),
      /* @__PURE__ */ jsx(Tooltip, { message: `Your test ran for ${testDuration} ms`, children: /* @__PURE__ */ jsxs(Badge, { size: "xl", color: "neutral", children: [
        isTestRunning && "0",
        !isTestRunning && /* @__PURE__ */ jsx(Timer, { countTo: Number(testDuration) }),
        " ms"
      ] }) })
    ] })
  ] });
}
function TestStepItem({ step }) {
  const hasChildren = Boolean(step.steps && step.steps.length > 0) || Boolean(step.snippet);
  const titleContent = /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      step.status === "passed" ? /* @__PURE__ */ jsx(FaCheck, { className: "text-success" }) : /* @__PURE__ */ jsx(FaXmark, { className: "text-error" }),
      /* @__PURE__ */ jsx("span", { className: "font-bold", children: step.title })
    ] }),
    /* @__PURE__ */ jsxs("span", { className: "text-neutral opacity-30 font-medium", children: [
      step.duration,
      " ms"
    ] })
  ] });
  return /* @__PURE__ */ jsxs(
    Collapse,
    {
      variant: hasChildren ? "arrow" : void 0,
      open: hasChildren ? void 0 : false,
      readonly: !hasChildren,
      bgClassName: "bg-base-100",
      title: titleContent,
      children: [
        step.steps && step.steps.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-2 grid gap-2", children: step.steps.map((child) => /* @__PURE__ */ jsx(
          TestStepItem,
          {
            step: child
          },
          `${child.title}-${child.startTime}-${child.duration}`
        )) }),
        step.snippet && /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsx(MockCode, { code: step.snippet }) })
      ]
    }
  );
}
function TestDetails({ isDependency }) {
  if (!isDependency) return null;
  return /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
      /* @__PURE__ */ jsx(FaLink, { size: 20 }),
      /* @__PURE__ */ jsx(Heading, { size: "h5", children: "Dependency" })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-sm", children: "This test ran because it is marked as a dependency." })
  ] });
}
function TestSteps({ steps }) {
  return /* @__PURE__ */ jsx(
    Collapse,
    {
      title: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(TiFlowChildren, { size: 20 }),
        /* @__PURE__ */ jsx("span", { className: "font-bold", children: "Steps" })
      ] }),
      bgClassName: "bg-base-100",
      children: /* @__PURE__ */ jsx("div", { className: "pt-2 grid gap-2", children: steps.map((step) => /* @__PURE__ */ jsx(
        TestStepItem,
        {
          step
        },
        `${step.title}-${step.startTime}-${step.duration}`
      )) })
    }
  );
}
function TestResult({ result }) {
  const runTestFetcher = useFetcher({ key: "run-test" });
  const isTestRunning = runTestFetcher.state !== "idle";
  const { dependencies } = useOutletContext();
  const isDependency = dependencies.some((dep) => result.file.includes(dep));
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && !isTestRunning) {
      animate(ref.current, {
        translateY: ["-50px", "0px"],
        opacity: [0, 1],
        duration: 600,
        easing: "easeOutExpo"
      });
    }
  }, [isTestRunning]);
  return /* @__PURE__ */ jsx(
    Collapse,
    {
      ref,
      variant: "arrow",
      bgClassName: "bg-base-100",
      title: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx(
            Status,
            {
              color: result.status === "passed" ? "success" : "error",
              animate: result.status !== "passed" ? "ping" : void 0
            }
          ),
          /* @__PURE__ */ jsx(Heading, { size: "h4", children: result.title }),
          isDependency && /* @__PURE__ */ jsx(Badge, { color: "warning", children: "Dependency" })
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "text-neutral opacity-30 font-medium", children: [
          result.duration,
          " ms"
        ] })
      ] }),
      children: /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsx(TestDetails, { isDependency }),
        /* @__PURE__ */ jsx(TestSteps, { steps: result.steps })
      ] })
    }
  );
}
function TestStepsSection({
  testResults
}) {
  var _a;
  return /* @__PURE__ */ jsx("div", { className: "grid gap-4", children: (_a = testResults.results) == null ? void 0 : _a.map((res) => /* @__PURE__ */ jsx(TestResult, { result: res }, `${res.title}-${res.startTime}`)) });
}
const loader$3 = async ({
  params
}) => {
  const projectName = params.name;
  const suite = params.suite;
  const testName = params.test;
  if (!suite || !projectName || !testName) {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }
  try {
    const project = new Project(projectName);
    const playwrightConfig = await project.getPlaywrightConfig();
    const testHelper = new TestHelper(project, playwrightConfig);
    const parsedTestName = testHelper.getTestName(testName);
    const testResults = testHelper.getTestResults(
      parsedTestName,
      "test",
      false
    );
    const result = {
      test: testResults,
      name: parsedTestName
    };
    return Response.json(result);
  } catch (err) {
    const message = parseErrorToMessage(err);
    throw new Response(message, {
      status: 500,
      statusText: "Internal Server Error"
    });
  }
};
function ViewTest() {
  const { project, suite, testName } = useOutletContext();
  const { test, name } = useLoaderData();
  const revalidator = useRevalidator();
  const runTestFetcher = useFetcher({
    key: "run-test"
  });
  const { data: runTestStatus, error: runTestStatusError } = usePolling(
    runTestFetcher.data && runTestFetcher.data.process.status === "stopped" && runTestFetcher.state === "idle" || false,
    `/api/tests/${project.name}/${suite}/${testName}/status`,
    300
  );
  useEffect(() => {
    if (runTestStatusError) {
      alert(runTestStatusError);
      return;
    }
    if ((runTestStatus == null ? void 0 : runTestStatus.process) && (runTestStatus == null ? void 0 : runTestStatus.process.status) === "stopped" && runTestFetcher.state === "idle") {
      revalidator.revalidate();
    }
  }, [revalidator, runTestFetcher, runTestStatus == null ? void 0 : runTestStatus.process, runTestStatusError]);
  if (!(test == null ? void 0 : test.results)) {
    return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center flex-col h-full", children: [
      /* @__PURE__ */ jsx(Heading, { size: "h1", className: "mb-4", children: "No Results!" }),
      /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-xl", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium mb-4", children: [
          "We are unable to find results related to test",
          " ",
          /* @__PURE__ */ jsxs("b", { children: [
            "“",
            testName,
            "”"
          ] }),
          "."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ jsx(Link, { to: "../../view", children: /* @__PURE__ */ jsx(Button, { children: "Go back" }) }),
          /* @__PURE__ */ jsx(RunTestButton, { type: "test" })
        ] })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row justify-between items-center", children: [
      /* @__PURE__ */ jsx(Heading, { size: "h1", children: name }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-row gap-1", children: [
        /* @__PURE__ */ jsxs(Button, { color: "secondary", children: [
          /* @__PURE__ */ jsx(FaPencilAlt, {}),
          " Edit"
        ] }),
        /* @__PURE__ */ jsx(RunTestButton, { type: "test" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(ResultSection, { test }) }),
    /* @__PURE__ */ jsx(Heading, { size: "h3", children: "Details" }),
    /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(TestStepsSection, { testResults: test }) })
  ] });
}
const route30 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ViewTest,
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
const loader$2 = async ({
  params
}) => {
  const projectName = params.name;
  const suite = params.suite;
  if (!suite || !projectName) {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }
  const project = new Project(projectName);
  const playwrightConfig = await project.getPlaywrightConfig();
  const testHelper = new TestHelper(project, playwrightConfig);
  const appURL = simplifyURL(testHelper.appURL);
  const suiteDependencies = testHelper.getSetupDependencies(suite);
  const pm = new ProcessManager();
  const process2 = await pm.status("bb-testing-codegen");
  return Response.json({
    process: process2,
    appURL,
    hasDependencies: (suiteDependencies == null ? void 0 : suiteDependencies.length) > 0 || false
  });
};
const action$2 = async ({ params, request }) => {
  var _a, _b;
  const session = await getSession(request.headers.get("Cookie"));
  const suite = params.suite;
  const projectName = params.name;
  const formData = await request.formData();
  const testName = (_a = formData.get("name")) == null ? void 0 : _a.toString();
  const url = (_b = formData.get("url")) == null ? void 0 : _b.toString();
  if (!suite || !projectName) {
    throw new Response(null, {
      status: 400,
      statusText: "Bad Request"
    });
  }
  try {
    const project = new Project(projectName);
    const playwrightConfig = await project.getPlaywrightConfig();
    const testHelper = new TestHelper(project, playwrightConfig);
    const suiteConfig = testHelper.getSetup(suite);
    const hasDependencies = suiteConfig.dependencies && suiteConfig.dependencies.length > 0;
    if (hasDependencies) {
      const depFlags = suiteConfig.dependencies.map(
        (dep) => `--project=${dep}`
      );
      const baseArgs2 = ["test", "--"];
      const args = [...baseArgs2, ...depFlags];
      const storageStatePM = new ProcessManager({
        name: `bb-testing:${projectName}>${suite}>setup`,
        script: "npm",
        args,
        cwd: project.path,
        autorestart: false
      });
      await storageStatePM.start(true);
    }
    const relativeTestPath = testHelper.relativeTestPath;
    let fileName = "";
    let outputPath = "";
    if (!testName) {
      return Response.json({
        error: { message: "Name is required" }
      });
    }
    fileName = `${parseName(testName)}.spec.ts`;
    outputPath = path.join(relativeTestPath, suite, "tests", fileName);
    Director.makeDir(path.resolve(project.path, path.dirname(outputPath)), {
      recursive: true
    });
    session.set("recordedTest", fileName);
    const startURL = `${testHelper.appURL}${url}`;
    const baseArgs = ["run", "codegen", "--", startURL, "-o", outputPath];
    if (hasDependencies) {
      baseArgs.push("--load-storage");
      baseArgs.push("storage-state.json");
    }
    const recordingPM = new ProcessManager({
      name: `bb-testing:${projectName}>${suite}>${fileName}`,
      script: "npm",
      args: baseArgs,
      cwd: project.path,
      autorestart: false
    });
    const recProcessStatus = await recordingPM.start();
    if (recProcessStatus.status !== "launching" && recProcessStatus.status !== "online") {
      throw new Error("We were unable to start the recording process!");
    }
    return redirect(`../record/status`, {
      headers: { "Set-Cookie": await commitSession(session) }
    });
  } catch (err) {
    const message = parseErrorToMessage(err);
    throw new Response(message, {
      status: 500,
      statusText: "Internal Server Error"
    });
  }
};
function RecordStart$1() {
  const { project, suite } = useOutletContext();
  const startRecording = useFetcher({ key: "start-recording" });
  const startRecordingRef = useRef(null);
  const { appURL, process: process2, hasDependencies } = useLoaderData();
  const [errorMessage] = useState("");
  const handleStartRecording = async (event) => {
    event.preventDefault();
    const form = startRecordingRef.current;
    if (!form) {
      return;
    }
    if (!form.reportValidity()) {
      return;
    }
    const formData = new FormData(form);
    formData.append("project", project.name);
    formData.append("suite", suite);
    startRecording.submit(formData, {
      method: "POST"
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "w-full h-full flex flex-col items-center justify-center", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-4 text-center", children: /* @__PURE__ */ jsx(Heading, { size: "h1", children: "Recording a Test" }) }),
    /* @__PURE__ */ jsx(Card, { className: "w-full max-w-xl", children: /* @__PURE__ */ jsx(startRecording.Form, { ref: startRecordingRef, children: /* @__PURE__ */ jsxs("div", { className: "grid gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-bold mb-2", htmlFor: "name", children: "Test Name" }),
        /* @__PURE__ */ jsx(
          TextField,
          {
            placeholder: "Please enter a strong and clear name for the test",
            required: true,
            name: "name",
            id: "name",
            className: "w-full"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-bold mb-2", htmlFor: "url", children: "URL" }),
        /* @__PURE__ */ jsx(
          TextField,
          {
            name: "url",
            id: "url",
            label: appURL,
            className: "w-full"
          }
        )
      ] }),
      hasDependencies && /* @__PURE__ */ jsx(
        Alert,
        {
          message: "This suite contains dependencies! It might take a little longer to start the recording process.",
          color: "info"
        }
      ),
      errorMessage && /* @__PURE__ */ jsx(Alert, { message: errorMessage, color: "error" }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end flex-row gap-2", children: [
        /* @__PURE__ */ jsx(Link, { to: "../../view", children: /* @__PURE__ */ jsx(Button, { type: "button", children: "Cancel" }) }),
        /* @__PURE__ */ jsx(Tooltip, { message: "The recording starts automatically once the browser opens", children: /* @__PURE__ */ jsxs(
          Button,
          {
            color: "primary",
            type: "button",
            loading: startRecording.state !== "idle",
            onClick: handleStartRecording,
            children: [
              /* @__PURE__ */ jsx(MdFiberManualRecord, {}),
              " Start Recording"
            ]
          }
        ) })
      ] })
    ] }) }) })
  ] });
}
const route31 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$2,
  default: RecordStart$1,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
async function loader$1({
  params,
  request
}) {
  const session = await getSession(request.headers.get("Cookie"));
  const recordedTest = session.get("recordedTest");
  if (!recordedTest) {
    throw new Response("You need to start a recording first!", {
      status: 400,
      statusText: "Bad Request"
    });
  }
  const projectName = params.name;
  const suite = params.suite;
  if (!suite || !projectName) {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }
  const { details: project } = new Project(projectName);
  const pm = new ProcessManager();
  const procName = `bb-testing:${projectName}>${suite}>${recordedTest}`;
  const process2 = await pm.status(procName);
  if (process2.status === "errored") {
    console.error(
      `An error occurred in the recording process!`,
      process2.stderr
    );
    throw new Response(process2.stderr, {
      status: 500,
      statusText: "Internal Server Error"
    });
  }
  return Response.json({
    project,
    procName,
    process: process2,
    suite
  });
}
const action$1 = async ({ params, request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const projectName = params.suite;
  const suite = params.suite;
  const fileName = session.get("recordedTest");
  if (!projectName || !suite || !fileName) {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }
  const pm = new ProcessManager();
  try {
    pm.stop(`bb-testing:${projectName}>${suite}>${fileName}`);
    return redirect(`../record/finish`);
  } catch (err) {
    const message = parseErrorToMessage(err);
    throw new Response(
      `Something went wrong while trying to stop the recording: ${message}`,
      { status: 500, statusText: "Internal Server Error" }
    );
  }
};
function RecordStatus() {
  const stopRecording = useFetcher();
  const loaderData = useLoaderData();
  const [errorMessage, setErrorMessage] = useState("");
  const [shouldPollForStatus, setShouldPollForStatus] = useState(true);
  const { data: recordingStatus, error: recordingStatusError } = usePolling(
    shouldPollForStatus,
    `/api/recording/status?process=${loaderData.procName}`,
    2e3
  );
  useEffect(() => {
    if (recordingStatusError) {
      setShouldPollForStatus(false);
      setErrorMessage(
        `An error occurred while fetching the status: ${recordingStatusError}`
      );
    }
  }, [recordingStatusError]);
  useEffect(() => {
    if ((recordingStatus == null ? void 0 : recordingStatus.status) === "stopped") {
      setShouldPollForStatus(false);
      stopRecording.submit(null, { method: "POST" });
    }
  }, [recordingStatus == null ? void 0 : recordingStatus.status]);
  console.log(recordingStatus);
  return /* @__PURE__ */ jsxs("div", { className: "w-full h-full flex flex-col items-center justify-center", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-4 text-center", children: [
      /* @__PURE__ */ jsx(Heading, { size: "h1", children: "Ssst 🤫" }),
      /* @__PURE__ */ jsx(Heading, { size: "h2", className: "text-primary", children: "RECORDING IN PROGRESS" })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "max-w-xl", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: "Use the Playwright browser to record your moves! Once you're done, close the recorder or use the button below to stop recording." }) }),
      !errorMessage && /* @__PURE__ */ jsx(Tooltip, { message: "Recording in progress...", className: "w-full mb-4", children: /* @__PURE__ */ jsx(Progress, { className: "w-full" }) }),
      errorMessage && /* @__PURE__ */ jsx(Alert, { message: errorMessage, color: "error" }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-end flex-row gap-2", children: !errorMessage && /* @__PURE__ */ jsx(stopRecording.Form, { method: "POST", children: /* @__PURE__ */ jsxs(
        Button,
        {
          color: "error",
          type: "submit",
          loading: stopRecording.state !== "idle",
          children: [
            /* @__PURE__ */ jsx(MdStop, {}),
            "Stop Recording"
          ]
        }
      ) }) })
    ] })
  ] });
}
const route32 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1,
  default: RecordStatus,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
const loader = async ({
  params,
  request
}) => {
  const session = await getSession(request.headers.get("Cookie"));
  const recordedTest = session.get("recordedTest");
  if (!recordedTest) {
    throw new Response("You need to start a recording first!", {
      status: 400,
      statusText: "Bad Request"
    });
  }
  const projectName = params.name;
  const suite = params.suite;
  if (!suite || !projectName) {
    throw new Response(null, { status: 400, statusText: "Bad Request" });
  }
  const pm = new ProcessManager();
  const process2 = await pm.status("bb-testing-codegen");
  return Response.json({
    process: process2
  });
};
const action = async ({ params, request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const projectName = params.name;
  const suite = params.suite;
  try {
    if (!projectName || !suite) {
      throw new Response(null, { status: 400, statusText: "Bad Request" });
    }
    const testFileName = session.get("recordedTest");
    if (!testFileName) {
      throw new Response("No test was found!", {
        status: 400,
        statusText: "Bad Request"
      });
    }
    const project = new Project(projectName);
    const playwrightConfig = await project.getPlaywrightConfig();
    const testHelper = new TestHelper(project, playwrightConfig);
    const testName = testHelper.getTestName(testFileName);
    const testPath = testHelper.getTestPath(suite, testFileName);
    await testHelper.renameTestTitle(testPath, testName);
    session.set("recordedTest", "");
    return redirect("../view", {
      headers: {
        "Set-Cookie": await commitSession(session)
      }
    });
  } catch (err) {
    const message = parseErrorToMessage(err);
    throw new Response(message, {
      status: 500,
      statusText: "Internal Server Errro"
    });
  }
};
function RecordStart() {
  const [errorMessage] = useState();
  return /* @__PURE__ */ jsxs("div", { className: "w-full h-full flex flex-col items-center justify-center", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-4 text-center", children: /* @__PURE__ */ jsx(Heading, { size: "h1", children: "Recording saved 💾" }) }),
    /* @__PURE__ */ jsxs(Card, { className: "max-w-xl w-full", children: [
      errorMessage && /* @__PURE__ */ jsx(Alert, { message: errorMessage, color: "error" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm font-medium mb-4", children: "The recording has been saved successfully! Please click ‘Finish’ to finalize the recording" }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end flex-row gap-2", children: [
        /* @__PURE__ */ jsx(Link, { to: "../record/start", children: /* @__PURE__ */ jsx(Button, { type: "button", color: "secondary", children: "Restart Recording" }) }),
        /* @__PURE__ */ jsx(Form, { method: "POST", children: /* @__PURE__ */ jsx(Button, { type: "submit", color: "primary", children: "Finish" }) })
      ] })
    ] })
  ] });
}
const route33 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action,
  default: RecordStart,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-DiIOoidm.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/components-DAwjMhVV.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/root-L9Hcj5Q6.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/components-DAwjMhVV.js", "/assets/index-D3e8Zo9y.js", "/assets/index-uFqOPUMb.js", "/assets/index-OLZrz1aE.js", "/assets/index-CwcO-kb-.js", "/assets/index-ZxjzPnyj.js", "/assets/index-wfZIODoR.js", "/assets/index-CokscfNF.js", "/assets/iconBase-ViZ73mvc.js"], "css": [] }, "routes/github.auth": { "id": "routes/github.auth", "parentId": "root", "path": "github/auth", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/index-D43y5Wbs.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/components-DAwjMhVV.js", "/assets/index-Cz_0cKVJ.js", "/assets/index-CwcO-kb-.js", "/assets/index-D3e8Zo9y.js", "/assets/index-uFqOPUMb.js", "/assets/index-BmP81L1w.js", "/assets/index-Bre9T0-e.js", "/assets/index-CouqIJUX.js", "/assets/index-OLZrz1aE.js", "/assets/iconBase-ViZ73mvc.js", "/assets/index-ZxjzPnyj.js", "/assets/index-wfZIODoR.js", "/assets/index-CokscfNF.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": "/", "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-BGjEQPb8.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/components-DAwjMhVV.js", "/assets/index-CokscfNF.js", "/assets/index-Cz_0cKVJ.js", "/assets/iconBase-ViZ73mvc.js", "/assets/index-D3e8Zo9y.js", "/assets/index-uFqOPUMb.js", "/assets/index-ZxjzPnyj.js", "/assets/index-BAt5lQ6G.js", "/assets/index-BmP81L1w.js", "/assets/index-OLZrz1aE.js", "/assets/index-Cl9ayPRv.js", "/assets/index-CouqIJUX.js", "/assets/index-CwcO-kb-.js", "/assets/index-wfZIODoR.js"], "css": [] }, "routes/api/projects/list": { "id": "routes/api/projects/list", "parentId": "root", "path": "api/projects/list", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/list-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api/projects/sync/index": { "id": "routes/api/projects/sync/index", "parentId": "root", "path": "api/projects/sync", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/index-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api/projects/$project/setup/create": { "id": "routes/api/projects/$project/setup/create", "parentId": "root", "path": "api/projects/:project/setup/create", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/create-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api/projects/sync/$name": { "id": "routes/api/projects/sync/$name", "parentId": "root", "path": "api/projects/sync/:name", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_name-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api/projects/$project/setup/delete": { "id": "routes/api/projects/$project/setup/delete", "parentId": "root", "path": "api/projects/:project/setup/delete", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/delete-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api/recording/status": { "id": "routes/api/recording/status", "parentId": "root", "path": "api/recording/status", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/status-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api/tests/$project/list": { "id": "routes/api/tests/$project/list", "parentId": "root", "path": "api/tests/:project/list", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/list-DP2rzg_V.js", "imports": [], "css": [] }, "routes/api/tests/$project/$suite/$test/run": { "id": "routes/api/tests/$project/$suite/$test/run", "parentId": "root", "path": "api/tests/:project/:suite/:test/run", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/run-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api/tests/$project/$suite/$test/status": { "id": "routes/api/tests/$project/$suite/$test/status", "parentId": "root", "path": "api/tests/:project/:suite/:test/status", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/status-DP2rzg_V.js", "imports": [], "css": [] }, "routes/api/tests/$project/$suite/run": { "id": "routes/api/tests/$project/$suite/run", "parentId": "root", "path": "api/tests/:project/:suite/run", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/run-DP2rzg_V.js", "imports": [], "css": [] }, "routes/api/tests/$project/run": { "id": "routes/api/tests/$project/run", "parentId": "root", "path": "api/tests/:project/run", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/run-K6Dvbx-E.js", "imports": [], "css": [] }, "routes/api/theme/set": { "id": "routes/api/theme/set", "parentId": "root", "path": "api/theme/set", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/set-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api/update": { "id": "routes/api/update", "parentId": "root", "path": "api/update", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/update-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/github.auth/index": { "id": "routes/github.auth/index", "parentId": "root", "path": "github/auth", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/index-D43y5Wbs.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/components-DAwjMhVV.js", "/assets/index-Cz_0cKVJ.js", "/assets/index-CwcO-kb-.js", "/assets/index-D3e8Zo9y.js", "/assets/index-uFqOPUMb.js", "/assets/index-BmP81L1w.js", "/assets/index-Bre9T0-e.js", "/assets/index-CouqIJUX.js", "/assets/index-OLZrz1aE.js", "/assets/iconBase-ViZ73mvc.js", "/assets/index-ZxjzPnyj.js", "/assets/index-wfZIODoR.js", "/assets/index-CokscfNF.js"], "css": [] }, "routes/projects/create": { "id": "routes/projects/create", "parentId": "root", "path": "projects/create", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/create-CkItVFJu.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/index-Cz_0cKVJ.js", "/assets/index-D3e8Zo9y.js", "/assets/index-uFqOPUMb.js", "/assets/index-D8T7_JUT.js", "/assets/index-Bre9T0-e.js", "/assets/index-OLZrz1aE.js", "/assets/components-DAwjMhVV.js", "/assets/iconBase-ViZ73mvc.js", "/assets/index-ZxjzPnyj.js", "/assets/index-CwcO-kb-.js", "/assets/index-wfZIODoR.js", "/assets/index-CokscfNF.js"], "css": [] }, "routes/projects/$name/index": { "id": "routes/projects/$name/index", "parentId": "root", "path": "projects/:name", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/index-C45Ri7Nh.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/index-OLZrz1aE.js", "/assets/components-DAwjMhVV.js", "/assets/index-ZxjzPnyj.js", "/assets/index-CwcO-kb-.js", "/assets/iconBase-ViZ73mvc.js", "/assets/index-wfZIODoR.js", "/assets/index-CokscfNF.js"], "css": [] }, "routes/projects/$name/configuration/index": { "id": "routes/projects/$name/configuration/index", "parentId": "routes/projects/$name/index", "path": "configuration", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/index-C3wCJPaK.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/components-DAwjMhVV.js", "/assets/index-CokscfNF.js", "/assets/index-Cz_0cKVJ.js", "/assets/index-uFqOPUMb.js", "/assets/index-ZxjzPnyj.js", "/assets/index-Bre9T0-e.js", "/assets/iconBase-ViZ73mvc.js"], "css": [] }, "routes/projects/$name/dashboard/index": { "id": "routes/projects/$name/dashboard/index", "parentId": "routes/projects/$name/index", "path": "dashboard", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/index-CfRSc1PO.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js"], "css": [] }, "routes/projects/$name/suites/view": { "id": "routes/projects/$name/suites/view", "parentId": "routes/projects/$name/index", "path": "suites/view", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/view-DYYV5mhl.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/index-uFqOPUMb.js", "/assets/index-ZxjzPnyj.js", "/assets/index-BAt5lQ6G.js", "/assets/run-test-BMbIBINN.js", "/assets/components-DAwjMhVV.js", "/assets/index-CokscfNF.js", "/assets/index-D3e8Zo9y.js", "/assets/index-BmP81L1w.js", "/assets/index-Bre9T0-e.js", "/assets/index-BhvR20cr.js", "/assets/index-Cl9ayPRv.js", "/assets/index-CouqIJUX.js", "/assets/index-Cz_0cKVJ.js", "/assets/iconBase-ViZ73mvc.js"], "css": [] }, "routes/projects/$name/suites/create": { "id": "routes/projects/$name/suites/create", "parentId": "routes/projects/$name/index", "path": "suites/create", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/create-DP2rzg_V.js", "imports": [], "css": [] }, "routes/projects/$name/suites/delete": { "id": "routes/projects/$name/suites/delete", "parentId": "routes/projects/$name/index", "path": "suites/delete", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/delete-DP2rzg_V.js", "imports": [], "css": [] }, "routes/projects/$name/suites/$suite/index": { "id": "routes/projects/$name/suites/$suite/index", "parentId": "routes/projects/$name/index", "path": "suites/:suite", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/index-BjWdr5S0.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/components-DAwjMhVV.js"], "css": [] }, "routes/projects/$name/suites/$suite/view/index": { "id": "routes/projects/$name/suites/$suite/view/index", "parentId": "routes/projects/$name/suites/$suite/index", "path": "view", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/index-CmPowUQW.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/index-uFqOPUMb.js", "/assets/index-ZxjzPnyj.js", "/assets/run-test-BMbIBINN.js", "/assets/index-Cz_0cKVJ.js", "/assets/iconBase-ViZ73mvc.js", "/assets/index-BAt5lQ6G.js", "/assets/components-DAwjMhVV.js", "/assets/index-CokscfNF.js", "/assets/index-D3e8Zo9y.js", "/assets/index-BmP81L1w.js", "/assets/index-BhvR20cr.js", "/assets/index-Cl9ayPRv.js", "/assets/index-CouqIJUX.js"], "css": [] }, "routes/projects/$name/suites/$suite/configuration/index": { "id": "routes/projects/$name/suites/$suite/configuration/index", "parentId": "routes/projects/$name/suites/$suite/index", "path": "configuration", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/index-C5B1djTc.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/index-DMsUvaHI.js", "/assets/index-uFqOPUMb.js", "/assets/index-ZxjzPnyj.js", "/assets/index-Bre9T0-e.js", "/assets/index-wfZIODoR.js", "/assets/index-CouqIJUX.js", "/assets/components-DAwjMhVV.js", "/assets/index-CokscfNF.js", "/assets/index-D3e8Zo9y.js", "/assets/index-BmP81L1w.js", "/assets/index-BhvR20cr.js", "/assets/index-DEkoM-wp.js", "/assets/iconBase-ViZ73mvc.js"], "css": [] }, "routes/projects/$name/suites/$suite/configuration/create-setup": { "id": "routes/projects/$name/suites/$suite/configuration/create-setup", "parentId": "routes/projects/$name/suites/$suite/index", "path": "configuration/create-setup", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/create-setup-Cu2xCEIM.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/components-DAwjMhVV.js", "/assets/index-D3e8Zo9y.js", "/assets/index-DMsUvaHI.js", "/assets/index-uFqOPUMb.js", "/assets/index-ZxjzPnyj.js", "/assets/index-Bre9T0-e.js", "/assets/index-wfZIODoR.js", "/assets/index-CouqIJUX.js", "/assets/index-BhvR20cr.js", "/assets/index-CokscfNF.js", "/assets/index-DEkoM-wp.js", "/assets/iconBase-ViZ73mvc.js"], "css": [] }, "routes/projects/$name/suites/$suite/tests/delete": { "id": "routes/projects/$name/suites/$suite/tests/delete", "parentId": "routes/projects/$name/suites/$suite/index", "path": "tests/delete", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/delete-K6Dvbx-E.js", "imports": [], "css": [] }, "routes/projects/$name/suites/$suite/tests/$test/index": { "id": "routes/projects/$name/suites/$suite/tests/$test/index", "parentId": "routes/projects/$name/suites/$suite/index", "path": "tests/:test", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/index-DkijEmmt.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/components-DAwjMhVV.js"], "css": [] }, "routes/projects/$name/suites/$suite/tests/$test/view/index": { "id": "routes/projects/$name/suites/$suite/tests/$test/view/index", "parentId": "routes/projects/$name/suites/$suite/tests/$test/index", "path": "view", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/index-nIuXoyhM.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/index-CokscfNF.js", "/assets/index-uFqOPUMb.js", "/assets/index-ZxjzPnyj.js", "/assets/run-test-BMbIBINN.js", "/assets/components-DAwjMhVV.js", "/assets/index-DMsUvaHI.js", "/assets/index-CouqIJUX.js", "/assets/index-BhvR20cr.js", "/assets/index-Cz_0cKVJ.js", "/assets/iconBase-ViZ73mvc.js", "/assets/index-Cl9ayPRv.js", "/assets/index-DWtJuAqr.js"], "css": [] }, "routes/projects/$name/suites/$suite/record/start": { "id": "routes/projects/$name/suites/$suite/record/start", "parentId": "routes/projects/$name/suites/$suite/index", "path": "record/start", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/start-DfbYkTyf.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/components-DAwjMhVV.js", "/assets/index-CwcO-kb-.js", "/assets/index-D3e8Zo9y.js", "/assets/index-uFqOPUMb.js", "/assets/index-ZxjzPnyj.js", "/assets/index-Bre9T0-e.js", "/assets/index-CouqIJUX.js", "/assets/iconBase-ViZ73mvc.js"], "css": [] }, "routes/projects/$name/suites/$suite/record/status": { "id": "routes/projects/$name/suites/$suite/record/status", "parentId": "routes/projects/$name/suites/$suite/index", "path": "record/status", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/status-D48USWmO.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/components-DAwjMhVV.js", "/assets/index-CwcO-kb-.js", "/assets/index-D3e8Zo9y.js", "/assets/index-uFqOPUMb.js", "/assets/index-ZxjzPnyj.js", "/assets/index-D8T7_JUT.js", "/assets/index-CouqIJUX.js", "/assets/index-DWtJuAqr.js", "/assets/iconBase-ViZ73mvc.js", "/assets/index-BhvR20cr.js"], "css": [] }, "routes/projects/$name/suites/$suite/record/finish": { "id": "routes/projects/$name/suites/$suite/record/finish", "parentId": "routes/projects/$name/suites/$suite/index", "path": "record/finish", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/finish-BoannNix.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/components-DAwjMhVV.js", "/assets/index-D3e8Zo9y.js", "/assets/index-uFqOPUMb.js", "/assets/index-ZxjzPnyj.js"], "css": [] } }, "url": "/assets/manifest-043f2f67.js", "version": "043f2f67" };
const mode = "production";
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "v3_routeConfig": false, "v3_singleFetch": true, "v3_lazyRouteDiscovery": true, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/github.auth": {
    id: "routes/github.auth",
    parentId: "root",
    path: "github/auth",
    index: void 0,
    caseSensitive: void 0,
    module: route16
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: "/",
    index: true,
    caseSensitive: void 0,
    module: route2
  },
  "routes/api/projects/list": {
    id: "routes/api/projects/list",
    parentId: "root",
    path: "api/projects/list",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/api/projects/sync/index": {
    id: "routes/api/projects/sync/index",
    parentId: "root",
    path: "api/projects/sync",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/api/projects/$project/setup/create": {
    id: "routes/api/projects/$project/setup/create",
    parentId: "root",
    path: "api/projects/:project/setup/create",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/api/projects/sync/$name": {
    id: "routes/api/projects/sync/$name",
    parentId: "root",
    path: "api/projects/sync/:name",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/api/projects/$project/setup/delete": {
    id: "routes/api/projects/$project/setup/delete",
    parentId: "root",
    path: "api/projects/:project/setup/delete",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/api/recording/status": {
    id: "routes/api/recording/status",
    parentId: "root",
    path: "api/recording/status",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/api/tests/$project/list": {
    id: "routes/api/tests/$project/list",
    parentId: "root",
    path: "api/tests/:project/list",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "routes/api/tests/$project/$suite/$test/run": {
    id: "routes/api/tests/$project/$suite/$test/run",
    parentId: "root",
    path: "api/tests/:project/:suite/:test/run",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  },
  "routes/api/tests/$project/$suite/$test/status": {
    id: "routes/api/tests/$project/$suite/$test/status",
    parentId: "root",
    path: "api/tests/:project/:suite/:test/status",
    index: void 0,
    caseSensitive: void 0,
    module: route11
  },
  "routes/api/tests/$project/$suite/run": {
    id: "routes/api/tests/$project/$suite/run",
    parentId: "root",
    path: "api/tests/:project/:suite/run",
    index: void 0,
    caseSensitive: void 0,
    module: route12
  },
  "routes/api/tests/$project/run": {
    id: "routes/api/tests/$project/run",
    parentId: "root",
    path: "api/tests/:project/run",
    index: void 0,
    caseSensitive: void 0,
    module: route13
  },
  "routes/api/theme/set": {
    id: "routes/api/theme/set",
    parentId: "root",
    path: "api/theme/set",
    index: void 0,
    caseSensitive: void 0,
    module: route14
  },
  "routes/api/update": {
    id: "routes/api/update",
    parentId: "root",
    path: "api/update",
    index: void 0,
    caseSensitive: void 0,
    module: route15
  },
  "routes/github.auth/index": {
    id: "routes/github.auth/index",
    parentId: "root",
    path: "github/auth",
    index: void 0,
    caseSensitive: void 0,
    module: route16
  },
  "routes/projects/create": {
    id: "routes/projects/create",
    parentId: "root",
    path: "projects/create",
    index: void 0,
    caseSensitive: void 0,
    module: route17
  },
  "routes/projects/$name/index": {
    id: "routes/projects/$name/index",
    parentId: "root",
    path: "projects/:name",
    index: void 0,
    caseSensitive: void 0,
    module: route18
  },
  "routes/projects/$name/configuration/index": {
    id: "routes/projects/$name/configuration/index",
    parentId: "routes/projects/$name/index",
    path: "configuration",
    index: void 0,
    caseSensitive: void 0,
    module: route19
  },
  "routes/projects/$name/dashboard/index": {
    id: "routes/projects/$name/dashboard/index",
    parentId: "routes/projects/$name/index",
    path: "dashboard",
    index: void 0,
    caseSensitive: void 0,
    module: route20
  },
  "routes/projects/$name/suites/view": {
    id: "routes/projects/$name/suites/view",
    parentId: "routes/projects/$name/index",
    path: "suites/view",
    index: void 0,
    caseSensitive: void 0,
    module: route21
  },
  "routes/projects/$name/suites/create": {
    id: "routes/projects/$name/suites/create",
    parentId: "routes/projects/$name/index",
    path: "suites/create",
    index: void 0,
    caseSensitive: void 0,
    module: route22
  },
  "routes/projects/$name/suites/delete": {
    id: "routes/projects/$name/suites/delete",
    parentId: "routes/projects/$name/index",
    path: "suites/delete",
    index: void 0,
    caseSensitive: void 0,
    module: route23
  },
  "routes/projects/$name/suites/$suite/index": {
    id: "routes/projects/$name/suites/$suite/index",
    parentId: "routes/projects/$name/index",
    path: "suites/:suite",
    index: void 0,
    caseSensitive: void 0,
    module: route24
  },
  "routes/projects/$name/suites/$suite/view/index": {
    id: "routes/projects/$name/suites/$suite/view/index",
    parentId: "routes/projects/$name/suites/$suite/index",
    path: "view",
    index: void 0,
    caseSensitive: void 0,
    module: route25
  },
  "routes/projects/$name/suites/$suite/configuration/index": {
    id: "routes/projects/$name/suites/$suite/configuration/index",
    parentId: "routes/projects/$name/suites/$suite/index",
    path: "configuration",
    index: void 0,
    caseSensitive: void 0,
    module: route26
  },
  "routes/projects/$name/suites/$suite/configuration/create-setup": {
    id: "routes/projects/$name/suites/$suite/configuration/create-setup",
    parentId: "routes/projects/$name/suites/$suite/index",
    path: "configuration/create-setup",
    index: void 0,
    caseSensitive: void 0,
    module: route27
  },
  "routes/projects/$name/suites/$suite/tests/delete": {
    id: "routes/projects/$name/suites/$suite/tests/delete",
    parentId: "routes/projects/$name/suites/$suite/index",
    path: "tests/delete",
    index: void 0,
    caseSensitive: void 0,
    module: route28
  },
  "routes/projects/$name/suites/$suite/tests/$test/index": {
    id: "routes/projects/$name/suites/$suite/tests/$test/index",
    parentId: "routes/projects/$name/suites/$suite/index",
    path: "tests/:test",
    index: void 0,
    caseSensitive: void 0,
    module: route29
  },
  "routes/projects/$name/suites/$suite/tests/$test/view/index": {
    id: "routes/projects/$name/suites/$suite/tests/$test/view/index",
    parentId: "routes/projects/$name/suites/$suite/tests/$test/index",
    path: "view",
    index: void 0,
    caseSensitive: void 0,
    module: route30
  },
  "routes/projects/$name/suites/$suite/record/start": {
    id: "routes/projects/$name/suites/$suite/record/start",
    parentId: "routes/projects/$name/suites/$suite/index",
    path: "record/start",
    index: void 0,
    caseSensitive: void 0,
    module: route31
  },
  "routes/projects/$name/suites/$suite/record/status": {
    id: "routes/projects/$name/suites/$suite/record/status",
    parentId: "routes/projects/$name/suites/$suite/index",
    path: "record/status",
    index: void 0,
    caseSensitive: void 0,
    module: route32
  },
  "routes/projects/$name/suites/$suite/record/finish": {
    id: "routes/projects/$name/suites/$suite/record/finish",
    parentId: "routes/projects/$name/suites/$suite/index",
    path: "record/finish",
    index: void 0,
    caseSensitive: void 0,
    module: route33
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
