import classNames from "classnames";

type HeadingProps = {
  size: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children: React.ReactNode;
  className?: string;
};

const headingStyles: Record<HeadingProps["size"], string> = {
  h1: "text-4xl md:text-5xl font-extrabold tracking-tight",
  h2: "text-3xl md:text-4xl font-bold tracking-tight",
  h3: "text-2xl font-semibold",
  h4: "text-xl font-medium",
  h5: "text-lg font-medium text-base-content/80",
  h6: "text-base font-medium uppercase text-base-content/60 tracking-wide",
};

export default function Heading({
  size = "h2",
  children,
  className = "",
}: HeadingProps) {
  const Tag = size;
  return (
    <Tag className={classNames(headingStyles[size], className)}>{children}</Tag>
  );
}
