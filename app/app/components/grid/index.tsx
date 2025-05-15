import React from "react";
import classNames from "classnames";

// Grid container props
export interface GridProps {
  cols?: number;
  smCols?: number;
  mdCols?: number;
  lgCols?: number;
  xlCols?: number;
  "2xlCols"?: number;
  gap?: number;
  smGap?: number;
  mdGap?: number;
  lgGap?: number;
  xlGap?: number;
  "2xlGap"?: number;
  autoFlow?: "row" | "col" | "row-dense" | "col-dense";
  className?: string;
  children: React.ReactNode;
}

// Grid item props
export interface GridItemProps {
  colSpan?: number;
  smColSpan?: number;
  mdColSpan?: number;
  lgColSpan?: number;
  xlColSpan?: number;
  "2xlColSpan"?: number;
  rowSpan?: number;
  smRowSpan?: number;
  mdRowSpan?: number;
  lgRowSpan?: number;
  xlRowSpan?: number;
  "2xlRowSpan"?: number;
  className?: string;
  children: React.ReactNode;
}

// Maps for grid-cols and gap utilities
const colsMap: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
  8: "grid-cols-8",
  9: "grid-cols-9",
  10: "grid-cols-10",
  11: "grid-cols-11",
  12: "grid-cols-12",
};
const smColsMap = Object.fromEntries(
  Object.entries(colsMap).map(([k, v]) => [k, `sm:${v}`]),
) as Record<number, string>;
const mdColsMap = Object.fromEntries(
  Object.entries(colsMap).map(([k, v]) => [k, `md:${v}`]),
) as Record<number, string>;
const lgColsMap = Object.fromEntries(
  Object.entries(colsMap).map(([k, v]) => [k, `lg:${v}`]),
) as Record<number, string>;
const xlColsMap = Object.fromEntries(
  Object.entries(colsMap).map(([k, v]) => [k, `xl:${v}`]),
) as Record<number, string>;
const x2lColsMap = Object.fromEntries(
  Object.entries(colsMap).map(([k, v]) => [k, `2xl:${v}`]),
) as Record<number, string>;

const gapMap: Record<number, string> = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  7: "gap-7",
  8: "gap-8",
  9: "gap-9",
  10: "gap-10",
};
const smGapMap = Object.fromEntries(
  Object.entries(gapMap).map(([k, v]) => [k, `sm:${v}`]),
) as Record<number, string>;
const mdGapMap = Object.fromEntries(
  Object.entries(gapMap).map(([k, v]) => [k, `md:${v}`]),
) as Record<number, string>;
const lgGapMap = Object.fromEntries(
  Object.entries(gapMap).map(([k, v]) => [k, `lg:${v}`]),
) as Record<number, string>;
const xlGapMap = Object.fromEntries(
  Object.entries(gapMap).map(([k, v]) => [k, `xl:${v}`]),
) as Record<number, string>;
const x2lGapMap = Object.fromEntries(
  Object.entries(gapMap).map(([k, v]) => [k, `2xl:${v}`]),
) as Record<number, string>;

const autoFlowMap: Record<NonNullable<GridProps["autoFlow"]>, string> = {
  row: "grid-flow-row",
  col: "grid-flow-col",
  "row-dense": "grid-flow-row-dense",
  "col-dense": "grid-flow-col-dense",
};

export const Grid: React.FC<GridProps> = ({
  cols,
  smCols,
  mdCols,
  lgCols,
  xlCols,
  "2xlCols": x2lCols,
  gap,
  smGap,
  mdGap,
  lgGap,
  xlGap,
  "2xlGap": x2lGap,
  autoFlow,
  className,
  children,
}) => {
  const classes = classNames(
    "grid",
    cols && colsMap[cols],
    smCols && smColsMap[smCols],
    mdCols && mdColsMap[mdCols],
    lgCols && lgColsMap[lgCols],
    xlCols && xlColsMap[xlCols],
    x2lCols && x2lColsMap[x2lCols],
    gap && gapMap[gap],
    smGap && smGapMap[smGap],
    mdGap && mdGapMap[mdGap],
    lgGap && lgGapMap[lgGap],
    xlGap && xlGapMap[xlGap],
    x2lGap && x2lGapMap[x2lGap],
    autoFlow && autoFlowMap[autoFlow],
    className,
  );

  return <div className={classes}>{children}</div>;
};

// Maps for span utilities
const spanMap: Record<number, string> = {
  1: "span-1",
  2: "span-2",
  3: "span-3",
  4: "span-4",
  5: "span-5",
  6: "span-6",
  7: "span-7",
  8: "span-8",
  9: "span-9",
  10: "span-10",
  11: "span-11",
  12: "span-12",
};

const makeSpanMap = (prefix: string) =>
  Object.fromEntries(
    Object.entries(spanMap).map(([k, v]) => [k, `${prefix}-${v}`]),
  ) as Record<number, string>;

const colSpanMap = makeSpanMap("col");
const smColSpanMap = makeSpanMap("sm:col");
const mdColSpanMap = makeSpanMap("md:col");
const lgColSpanMap = makeSpanMap("lg:col");
const xlColSpanMap = makeSpanMap("xl:col");
const x2lColSpanMap = makeSpanMap("2xl:col");

const rowSpanMap = makeSpanMap("row");
const smRowSpanMap = makeSpanMap("sm:row");
const mdRowSpanMap = makeSpanMap("md:row");
const lgRowSpanMap = makeSpanMap("lg:row");
const xlRowSpanMap = makeSpanMap("xl:row");
const x2lRowSpanMap = makeSpanMap("2xl:row");

export const GridItem: React.FC<GridItemProps> = ({
  colSpan,
  smColSpan,
  mdColSpan,
  lgColSpan,
  xlColSpan,
  "2xlColSpan": x2lC,
  rowSpan,
  smRowSpan,
  mdRowSpan,
  lgRowSpan,
  xlRowSpan,
  "2xlRowSpan": x2lR,
  className,
  children,
}) => {
  const classes = classNames(
    colSpan && colSpanMap[colSpan],
    smColSpan && smColSpanMap[smColSpan],
    mdColSpan && mdColSpanMap[mdColSpan],
    lgColSpan && lgColSpanMap[lgColSpan],
    xlColSpan && xlColSpanMap[xlColSpan],
    x2lC && x2lColSpanMap[x2lC],
    rowSpan && rowSpanMap[rowSpan],
    smRowSpan && smRowSpanMap[smRowSpan],
    mdRowSpan && mdRowSpanMap[mdRowSpan],
    lgRowSpan && lgRowSpanMap[lgRowSpan],
    xlRowSpan && xlRowSpanMap[xlRowSpan],
    x2lR && x2lRowSpanMap[x2lR],
    className,
  );

  return <div className={classes}>{children}</div>;
};
