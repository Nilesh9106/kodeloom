import { useTheme } from "next-themes";

export const Logo = ({ size }: { size?: number }) => {
  const { theme } = useTheme();
  return (
    <div style={{ width: size ?? 40, height: size ?? 40 }}>
      <svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 300.000000 298.000000"
        preserveAspectRatio="xMidYMid meet"
      >
        <g
          transform="translate(0.000000,298.000000) scale(0.050000,-0.050000)"
          fill={theme === "dark" ? "#fff" : "#000"}
          stroke="none"
        >
          <path d="M1770 5472 c-867 -201 -1369 -1062 -1102 -1887 l54 -165 154 125 c716 583 1778 565 2429 -42 l94 -88 40 92 c439 1025 -575 2219 -1669 1965z" />
          <path d="M3710 5473 c-137 -28 -330 -95 -330 -113 0 -7 28 -39 62 -71 636 -603 649 -1795 25 -2488 -103 -114 -106 -109 123 -180 905 -278 1870 443 1870 1399 0 925 -861 1641 -1750 1453z" />
          <path d="M1860 3568 c-761 -149 -1258 -723 -1260 -1454 -2 -972 955 -1694 1870 -1413 229 71 227 67 126 175 -624 669 -624 1799 0 2468 l87 93 -57 30 c-146 75 -594 134 -766 101z" />
          <path d="M2614 2625 c-448 -1249 825 -2404 2020 -1833 677 323 1014 1181 728 1853 l-32 77 -108 -92 c-723 -617 -1772 -617 -2460 2 -119 107 -107 108 -148 -7z" />
        </g>
      </svg>
    </div>
  );
};
