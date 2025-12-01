import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaChevronDown } from "react-icons/fa";

type Range = { start: Date | null; end: Date | null };

interface Props {
  onClose: () => void;
  onApply: (range: Range) => void;
  onDateSelect?: (selected: Range) => void;
  initialRange?: Range;
  monthsShown?: number;
}

const BROWN = "bg-[#5C2E1E]";
const BROWN_PILL = "rounded-full " + BROWN + " text-white";
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function addMonths(d: Date, n: number) { return new Date(d.getFullYear(), d.getMonth() + n, 1); }
function daysInMonth(year: number, month: number) { return new Date(year, month + 1, 0).getDate(); }
function sameDay(a?: Date | null, b?: Date | null) {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function dateLess(a: Date, b: Date) { return a.getTime() < b.getTime(); }
function dateGreater(a: Date, b: Date) { return a.getTime() > b.getTime(); }

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const years = Array.from({ length: 50 }, (_, i) => 2000 + i);

export default function SelectDateModal({
  onClose,
  onApply,
  onDateSelect,
  initialRange,
  monthsShown = 2,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  const initialMonth = 10;
  const initialYear = 2025;

  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const [currentYear, setCurrentYear] = useState(initialYear);
  const [anchorMonth, setAnchorMonth] = useState(() =>
    initialRange?.start ? startOfMonth(initialRange.start) : new Date(initialYear, initialMonth, 1)
  );

  const [range, setRange] = useState<Range>({
    start: initialRange?.start ?? null,
    end: initialRange?.end ?? null
  });

  /** Close modal on ESC */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  /** Close modal when clicking outside */
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) onClose();
      setShowMonthDropdown(false);
      setShowYearDropdown(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [onClose]);

  // Handle date clicks (range logic)
  const onDayClick = (d: Date) => {
    let newRange: Range;

    if (!range.start || (range.start && range.end)) {
      newRange = { start: d, end: null };
    } else {
      newRange = dateLess(d, range.start)
        ? { start: d, end: range.start }
        : { start: range.start, end: d };
    }

    setRange(newRange);
    onDateSelect?.(newRange);
  };

  const isInRange = (d: Date) => {
    if (!range.start) return false;
    if (range.start && !range.end) return sameDay(range.start, d);
    if (range.end)
      return !dateLess(d, range.start) && !dateGreater(d, range.end);
    return false;
  };

  const isStart = (d: Date) => !!range.start && sameDay(range.start, d);
  const isEnd = (d: Date) => !!range.end && sameDay(range.end, d);

  /** Reset */
  const handleReset = () => {
    const cleared: Range = { start: null, end: null };
    setRange(cleared);
    setCurrentMonth(initialMonth);
    setCurrentYear(initialYear);
    setAnchorMonth(new Date(initialYear, initialMonth, 1));
    
    onApply(cleared);
    onDateSelect?.(cleared);
  };

  /** Render a month */
  const renderMonth = (base: Date) => {
    const year = base.getFullYear();
    const month = base.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = daysInMonth(year, month);

    const cells: (null | Date)[] = [];
    for (let i = 0; i < firstDayIndex; i++) cells.push(null);
    for (let d = 1; d <= totalDays; d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);

    return (
      <div key={`${year}-${month}`} className="w-full">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium">{months[month]}</div>
          <div className="text-sm text-gray-500">{year}</div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-xs text-center">
          {dayNames.map((dn) => (
            <div key={dn} className="text-gray-400 py-1">{dn}</div>
          ))}

          {cells.map((cell, i) => {
            if (!cell) return <div key={i} className="py-2" />;

            const inRange = isInRange(cell);
            const start = isStart(cell);
            const end = isEnd(cell);

            let styleClass = "text-sm text-gray-700";
            if (start && end) styleClass = `px-3 ${BROWN_PILL}`;
            else if (start) styleClass = `pl-3 pr-6 ${BROWN_PILL} rounded-l-full`;
            else if (end) styleClass = `pl-6 pr-3 ${BROWN_PILL} rounded-r-full`;
            else if (inRange) styleClass = `${BROWN} text-white`;

            return (
              <div
                key={i}
                onClick={() => onDayClick(cell)}
                className="py-2 flex items-center justify-center cursor-pointer select-none"
              >
                <div className={`${styleClass} w-full text-center`}>{cell.getDate()}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const setMonth = (m: number) => {
    setCurrentMonth(m);
    setAnchorMonth(new Date(currentYear, m, 1));
  };

  const setYear = (y: number) => {
    setCurrentYear(y);
    setAnchorMonth(new Date(y, currentMonth, 1));
  };

  const prev = () => setAnchorMonth((m) => addMonths(m, -1));
  const next = () => setAnchorMonth((m) => addMonths(m, 1));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
      <div className="absolute inset-0 bg-black/30" />

      <div ref={ref} className="relative z-50 w-full max-w-4xl bg-white rounded-xl shadow-xl p-4">
        
        {/* Display selected date range */}
        <div className="mb-4 text-center text-gray-700 font-medium">
          {range.start
            ? `${range.start.toLocaleDateString(undefined, {
                day: "numeric",
                month: "short",
                year: "numeric",
              })} — ${
                range.end
                  ? range.end.toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : range.start.toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
              }`
            : "Select Dates"}
        </div>

        {/* Month NAVIGATION */}
        <div className="flex mb-4 items-center justify-between">
          <button onClick={prev} className="p-2 rounded-md border">
            <FaChevronLeft size={8} />
          </button>

          <div className="flex items-center gap-3">

            {/* MONTH SELECT */}
            <div className="relative">
              <button
                onClick={() => setShowMonthDropdown((v) => !v)}
                className="flex items-center gap-1 text-sm font-medium"
              >
                {months[currentMonth]} <FaChevronDown size={10} />
              </button>

              {showMonthDropdown && (
                <div className="absolute mt-1 bg-white shadow-lg rounded-md p-2 z-10">
                  {months.map((m, idx) => (
                    <div
                      key={m}
                      className="px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer rounded"
                      onClick={() => { setMonth(idx); setShowMonthDropdown(false); }}
                    >
                      {m}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* YEAR SELECT */}
            <div className="relative">
              <button
                onClick={() => setShowYearDropdown((v) => !v)}
                className="flex items-center gap-1 text-sm font-medium"
              >
                {currentYear} <FaChevronDown size={10} />
              </button>

              {showYearDropdown && (
                <div className="absolute mt-1 bg-white shadow-lg rounded-md p-2 z-10 max-h-48 overflow-y-auto">
                  {years.map((y) => (
                    <div
                      key={y}
                      className="px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer rounded"
                      onClick={() => { setYear(y); setShowYearDropdown(false); }}
                    >
                      {y}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button onClick={next} className="p-2 rounded-md border">
            <FaChevronRight size={8} />
          </button>
        </div>

        {/* CALENDAR GRID */}
        <div className="grid grid-cols-2 gap-6">
          {Array.from({ length: monthsShown }).map((_, idx) =>
            renderMonth(addMonths(anchorMonth, idx))
          )}
        </div>

        {/* RESET + APPLY */}
        <div className="mt-6 flex items-start gap-4">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            Reset
          </button>

           
        </div>
      </div>
    </div>
  );
}
