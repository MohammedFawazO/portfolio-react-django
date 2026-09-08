import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  motion,
  useAnimate,
  stagger as motionStagger,
} from "framer-motion"

const radiusFromPercent = (w, h, pct) =>
  (Math.min(w, h) / 2) * (Math.max(0, Math.min(100, pct)) / 100)

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect

const TRANSPARENT_SPLIT = "0px 0px 0px rgba(255,0,80,0), 0px 0px 0px rgba(0,220,255,0)"

const SECONDS_AT_SPEED_1 = 10

const SCAN_BAND = 65
const SCAN_FROM = "-100%"
const SCAN_TO = `${(100 / SCAN_BAND) * 100}%`

const IDLE_BRACKET = 8
const HOVER_BRACKET = 65

const armFor = (pct, w, h) => ((pct / 100) * Math.min(w, h)) / 2

const getCornerPaths = (w, h, r, arm) => {
  const clampedR = Math.min(r, w / 2, h / 2)
  const strokeOffset = 0.75
  const R = Math.max(0.01, clampedR - strokeOffset)
  const R_orig = clampedR
  const availH = Math.max(0, h / 2 - R_orig)
  const availW = Math.max(0, w / 2 - R_orig)
  const armH = Math.min(arm, availH)
  const armW = Math.min(arm, availW)
  const tl = `M ${strokeOffset} ${R_orig + armH} L ${strokeOffset} ${R_orig} A ${R} ${R} 0 0 1 ${R_orig} ${strokeOffset} L ${R_orig + armW} ${strokeOffset}`
  const tr = `M ${w - R_orig - armW} ${strokeOffset} L ${w - R_orig} ${strokeOffset} A ${R} ${R} 0 0 1 ${w - strokeOffset} ${R_orig} L ${w - strokeOffset} ${R_orig + armH}`
  const br = `M ${w - strokeOffset} ${h - R_orig - armH} L ${w - strokeOffset} ${h - R_orig} A ${R} ${R} 0 0 1 ${w - R_orig} ${h - strokeOffset} L ${w - R_orig - armW} ${h - strokeOffset}`
  const bl = `M ${R_orig + armW} ${h - strokeOffset} L ${R_orig} ${h - strokeOffset} A ${R} ${R} 0 0 1 ${strokeOffset} ${h - R_orig} L ${strokeOffset} ${h - R_orig - armH}`
  return { tl, tr, br, bl }
}

const borderWidthOf = (b) => {
  const num = (v) => {
    const n = parseFloat(String(v ?? ""))
    return Number.isFinite(n) && n > 0 ? n : 0
  }
  return Math.max(
    num(b?.borderWidth),
    num(b?.borderTopWidth),
    num(b?.borderRightWidth),
    num(b?.borderBottomWidth),
    num(b?.borderLeftWidth)
  )
}

export default function ScanGridButton({
  label = "SCAN GRID",
  font = {
    fontFamily: 'var(--font-sans), "Poppins", sans-serif',
    fontWeight: 500,
    fontSize: 16,
    lineHeight: "1.5em",
    letterSpacing: "0.18em",
    textAlign: "left",
  },
  showText = true,
  padding = "14px 28px",
  rounded = 6,
  colors = {
    fill: "rgba(0,0,0,0)",
    hoverFill: "#0A0A0A",
    textColor: "#FFFFFF",
    hoverTextColor: "#FFFFFF",
  },
  border = {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgba(210,4,45,0.45)",
  },
  glitchIntensity = 4,
  scan = {
    color: "#FF3B47",
    speed: 75,
  },
  link = "",
  newTab = false,
  onClick,
  className = "",
}) {
  const fill = colors?.fill ?? "#000000"
  const textColor = colors?.textColor ?? "#FFFFFF"
  const hoverFill = colors?.hoverFill ?? "#000000"
  const hoverTextColor = colors?.hoverTextColor ?? "#FFFFFF"

  const { color: scanColor = "#FF8400", speed: speedPctProp } = scan

  const speedPct = speedPctProp ?? 50
  const speed = 5 * (Math.max(0, Math.min(100, Math.round(speedPct))) / 50)

  const [scope, animate] = useAnimate()

  const [radiusBox, setRadiusBox] = useState({ w: 0, h: 0 })
  useIsoLayoutEffect(() => {
    const el = scope.current
    if (!el) return
    const read = () =>
      setRadiusBox((prev) =>
        prev.w === el.offsetWidth && prev.h === el.offsetHeight
          ? prev
          : { w: el.offsetWidth, h: el.offsetHeight }
      )
    read()
    const ro = new ResizeObserver(read)
    ro.observe(el)
    return () => ro.disconnect()
  }, [scope])
  const radiusPx = radiusFromPercent(radiusBox.w, radiusBox.h, rounded)

  const [dim, setDim] = useState({ w: 160, h: 48 })
  useLayoutEffect(() => {
    if (!scope.current) return
    const updateDim = () => {
      if (scope.current) {
        const w = scope.current.clientWidth
        const h = scope.current.clientHeight
        if (w > 0 && h > 0) setDim({ w, h })
      }
    }
    updateDim()
    const ro = new ResizeObserver(updateDim)
    ro.observe(scope.current)
    return () => ro.disconnect()
  }, [scope])

  const scanLoopRef = useRef(null)
  const hovered = useRef(false)

  const bw = borderWidthOf(border)
  const bracketRadius = Math.max(0, radiusPx - bw)

  const initialPaths = useMemo(
    () => getCornerPaths(dim.w, dim.h, bracketRadius, armFor(IDLE_BRACKET, dim.w, dim.h)),
    [dim.w, dim.h, bracketRadius]
  )

  const resetToIdle = useCallback(() => {
    if (!scope.current) return
    scanLoopRef.current?.stop()
    scanLoopRef.current = null
    animate(scope.current, { backgroundColor: fill, color: textColor }, { duration: 0 })
    const idlePaths = getCornerPaths(dim.w, dim.h, bracketRadius, armFor(IDLE_BRACKET, dim.w, dim.h))
    const filter = `drop-shadow(0px 0px 0px ${scanColor})`
    animate(".bracket-tl", { d: idlePaths.tl, filter }, { duration: 0 })
    animate(".bracket-tr", { d: idlePaths.tr, filter }, { duration: 0 })
    animate(".bracket-br", { d: idlePaths.br, filter }, { duration: 0 })
    animate(".bracket-bl", { d: idlePaths.bl, filter }, { duration: 0 })
    animate(".scanline", { y: SCAN_FROM, opacity: 0 }, { duration: 0 })
    if (showText)
      animate(".char", { x: 0, textShadow: TRANSPARENT_SPLIT }, { duration: 0 })
  }, [animate, scope, fill, textColor, scanColor, dim.w, dim.h, bracketRadius, showText])

  const runHover = useCallback(() => {
    if (!scope.current) return
    hovered.current = true
    animate(scope.current, { backgroundColor: hoverFill, color: hoverTextColor }, { duration: 0.3, ease: "easeInOut" })
    const hoverPaths = getCornerPaths(dim.w, dim.h, bracketRadius, armFor(HOVER_BRACKET, dim.w, dim.h))
    const filter = `drop-shadow(0px 0px 4px ${scanColor})`
    animate(".bracket-tl", { d: hoverPaths.tl, filter }, { duration: 0.3, ease: "easeInOut" })
    animate(".bracket-tr", { d: hoverPaths.tr, filter }, { duration: 0.3, ease: "easeInOut" })
    animate(".bracket-br", { d: hoverPaths.br, filter }, { duration: 0.3, ease: "easeInOut" })
    animate(".bracket-bl", { d: hoverPaths.bl, filter }, { duration: 0.3, ease: "easeInOut" })

    scanLoopRef.current?.stop()
    animate(".scanline", { opacity: 1 }, { duration: 0.15 })
    scanLoopRef.current = animate(
      ".scanline",
      { y: [SCAN_FROM, SCAN_TO] },
      {
        duration: SECONDS_AT_SPEED_1 / Math.max(1, speed),
        ease: "linear",
        repeat: Infinity,
      }
    )
    const g = glitchIntensity
    if (showText)
      animate(
        ".char",
        {
          x: [0, -g, g, -g, g, -g, 0],
          textShadow: [
            TRANSPARENT_SPLIT,
            `${g}px 0px 0px rgba(255,0,80,0.9), ${-g}px 0px 0px rgba(0,220,255,0.9)`,
            `${-g}px 0px 0px rgba(255,0,80,0.9), ${g}px 0px 0px rgba(0,220,255,0.9)`,
            `${g * 1.3}px 0px 0px rgba(255,0,80,0.9), ${-g * 1.3}px 0px 0px rgba(0,220,255,0.9)`,
            `${-g}px 0px 0px rgba(255,0,80,0.9), ${g}px 0px 0px rgba(0,220,255,0.9)`,
            `${g}px 0px 0px rgba(255,0,80,0.9), ${-g}px 0px 0px rgba(0,220,255,0.9)`,
            TRANSPARENT_SPLIT,
          ],
        },
        {
          duration: 0.6,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 0.1,
          delay: motionStagger(0.04),
        }
      )
  }, [animate, scope, hoverFill, hoverTextColor, scanColor, glitchIntensity, speed, dim.w, dim.h, bracketRadius, showText])

  const runLeave = useCallback(() => {
    if (!scope.current) return
    hovered.current = false
    animate(scope.current, { backgroundColor: fill, color: textColor }, { duration: 0.3, ease: "easeInOut" })
    const idlePaths2 = getCornerPaths(dim.w, dim.h, bracketRadius, armFor(IDLE_BRACKET, dim.w, dim.h))
    const filter = `drop-shadow(0px 0px 0px ${scanColor})`
    animate(".bracket-tl", { d: idlePaths2.tl, filter }, { duration: 0.3, ease: "easeInOut" })
    animate(".bracket-tr", { d: idlePaths2.tr, filter }, { duration: 0.3, ease: "easeInOut" })
    animate(".bracket-br", { d: idlePaths2.br, filter }, { duration: 0.3, ease: "easeInOut" })
    animate(".bracket-bl", { d: idlePaths2.bl, filter }, { duration: 0.3, ease: "easeInOut" })
    const loop = scanLoopRef.current
    const fade = animate(".scanline", { opacity: 0 }, { duration: 0.2 })
    fade.then(() => loop?.stop())
    if (showText)
      animate(".char", { x: 0, textShadow: TRANSPARENT_SPLIT }, { duration: 0.3, ease: "easeInOut" })
  }, [animate, scope, fill, textColor, scanColor, dim.w, dim.h, bracketRadius, showText])

  useEffect(() => {
    if (hovered.current) runHover()
    else resetToIdle()
  }, [resetToIdle, runHover])

  useEffect(() => () => scanLoopRef.current?.stop(), [])

  const fontStyles = font
  const chars = useMemo(() => (label ?? "").split(""), [label])

  const isLink = typeof link === "string" && link.length > 0
  const Tag = isLink ? motion.a : motion.button
  const linkProps = isLink
    ? {
        href: link,
        target: newTab ? "_blank" : undefined,
        rel: newTab ? "noopener noreferrer" : undefined,
      }
    : { type: "button" }

  return (
    <Tag
      ref={scope}
      {...linkProps}
      onClick={onClick}
      aria-label={label}
      className={className}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        flexDirection: "row",
        minWidth: 1,
        minHeight: 1,
        padding,
        ...border,
        borderRadius: radiusPx,
        background: fill,
        color: textColor,
        cursor: "pointer",
        overflow: "hidden",
        textDecoration: "none",
        WebkitTapHighlightColor: "transparent",
        ...fontStyles,
      }}
      onMouseEnter={runHover}
      onMouseLeave={runLeave}
    >
      <svg
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          overflow: "visible",
          zIndex: 2,
        }}
        viewBox={`0 0 ${dim.w} ${dim.h}`}
        preserveAspectRatio="none"
      >
        <motion.path
          className="bracket-tl"
          d={initialPaths.tl}
          stroke={scanColor}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <motion.path
          className="bracket-tr"
          d={initialPaths.tr}
          stroke={scanColor}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <motion.path
          className="bracket-br"
          d={initialPaths.br}
          stroke={scanColor}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <motion.path
          className="bracket-bl"
          d={initialPaths.bl}
          stroke={scanColor}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      <div
        className="scanline"
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: `${SCAN_BAND}%`,
          opacity: 0,
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, transparent 0%, color-mix(in srgb, ${scanColor} 45%, transparent) 100%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "100%",
            height: 2,
            background: scanColor,
            boxShadow: `0px 0px 6px 0px ${scanColor}`,
          }}
        />
      </div>

      {showText && (
        <span
          aria-hidden="true"
          style={{
            position: "relative",
            zIndex: 3,
            display: "inline-block",
            whiteSpace: "pre-wrap",
          }}
        >
          {chars.map((char, i) => (
            <motion.span
              key={i}
              className="char"
              style={{ display: "inline-block" }}
            >
              {char === " " ? " " : char}
            </motion.span>
          ))}
        </span>
      )}
    </Tag>
  )
}