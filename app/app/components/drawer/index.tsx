import React from "react";
import Heading from "../heading";
import { Link, useLocation } from "@remix-run/react";
import ThemeSwitcher from "../theme-switcher";
import { FaHome } from "react-icons/fa";

export interface DrawerProps {
  /** Content to display in the main area */
  children: React.ReactNode;
  /** Items to display in the sidebar */
  drawerItems: Array<{
    /** The text to display on the Link */
    label: string;
    /** Gets combined with the baseURL to form the href */
    href: string;
    /** The baseURL will be used to match the current path to display the active page in the drawer */
    baseURL: string;
  }>;
  /** Unique ID for the drawer toggle input (to allow multiple instances) */
  id?: string;

  title?: React.ReactNode;
  preferredTheme?: string;
}

export default function Drawer({
  children,
  drawerItems,
  id = "my-drawer",
  title,
  preferredTheme,
}: DrawerProps) {
  const inputId = `${id}-toggle`;
  const location = useLocation();

  const activeLink = drawerItems.find(({ baseURL }) =>
    location.pathname.includes(baseURL),
  )?.baseURL;

  return (
    <div className="drawer lg:drawer-open">
      <input id={inputId} type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col items-center justify-center">
        <label
          htmlFor={inputId}
          className="btn btn-primary drawer-button lg:hidden mt-4 absolute right-0 top-0"
        >
          Open drawer
        </label>
        {/* Main page content */}
        {children}

        {/* Button shown on small screens */}
      </div>

      <div className="drawer-side">
        {/* Overlay to close the drawer when clicked */}
        <label
          htmlFor={inputId}
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        {/* Sidebar menu */}
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          <li>
            <Link to="/">
              <p className="text-sm opacity-30 text-neutral flex flex-row gap-2 items-center">
                <FaHome />
                Projects /
              </p>
            </Link>
          </li>
          {title && (
            <li className="mb-4">
              <Heading size="h3" className="text-center">
                {title}
              </Heading>
            </li>
          )}
          {drawerItems.map((item, idx) => (
            <li
              key={idx}
              className={activeLink === item.baseURL ? "bg-base-300" : ""}
            >
              <Link to={item.baseURL + item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
        <div className="relative flex items-center justify-center w-full">
          <div className="absolute bottom-8">
            <ThemeSwitcher preferredTheme={preferredTheme} />
          </div>
        </div>
      </div>
    </div>
  );
}
