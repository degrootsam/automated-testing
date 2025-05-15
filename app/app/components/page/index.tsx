import { Drawer, Heading } from "..";
import { DrawerProps } from "../drawer";
import classNames from "classnames";
import ThemeSwitcher from "../theme-switcher";

export interface PageProps {
  title: React.ReactNode;
  children?: React.ReactNode;
  preferredTheme?: string;
  withDrawer?: boolean;
  drawerItems?: DrawerProps["drawerItems"];
  className?: React.HTMLAttributes<HTMLDivElement>["className"];
}

export default function Page({
  title,
  children,
  preferredTheme,
  withDrawer,
  drawerItems = [],
  className,
}: PageProps) {
  if (withDrawer) {
    return (
      <Drawer
        drawerItems={drawerItems}
        title={title}
        preferredTheme={preferredTheme}
      >
        <div className="w-full h-full p-8 bg-base-300">{children}</div>
      </Drawer>
    );
  }

  return (
    <div
      className={classNames(
        "flex-col flex h-screen items-center justify-center bg-base-300",
        className,
      )}
    >
      <div className="absolute top-10 right-10">
        {/* Insert <Link> with <Button> here */}
        <ThemeSwitcher preferredTheme={preferredTheme} />
      </div>
      <div className="max-w-2xl">
        {!withDrawer && title && (
          <Heading size="h1" className="mb-10 text-center">
            {title}
          </Heading>
        )}
      </div>
      {children}
    </div>
  );
}
