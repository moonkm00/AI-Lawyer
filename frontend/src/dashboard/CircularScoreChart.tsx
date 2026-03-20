import React from "react"

interface CircularScoreChartProps {
  score: number // 0 to 100
  title: string
  subtitle: string
  benchmarkText?: string
  color?: string
}

export function CircularScoreChart({
  score,
  title,
  subtitle,
  benchmarkText,
  color = "#ea580c", // Tailwind orange-600 equivalent
}: CircularScoreChartProps) {
  const radius = 75
  const strokeWidth = 12
  const normalizedRadius = radius - strokeWidth / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h3 className="text-[13px] font-bold tracking-wider text-[#635f79] uppercase">
        {title}
      </h3>
      
      <div className="relative flex items-center justify-center">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          {/* Background Circle */}
          <circle
            stroke="#e2e8f0"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Foreground Circle */}
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + " " + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Inner Text */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-black tabular-nums tracking-tighter" style={{ color }}>
            {score.toFixed(2)}
          </span>
          <span className="text-[12px] font-bold text-[#7d7b90] mt-1">
            {subtitle}
          </span>
        </div>
      </div>

      {benchmarkText && (
        <p className="text-[12px] text-[#7d7b90] font-medium mt-4">
          {benchmarkText}
        </p>
      )}
    </div>
  )
}
