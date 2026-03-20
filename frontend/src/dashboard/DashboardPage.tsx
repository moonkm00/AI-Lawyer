"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CircularScoreChart } from "./CircularScoreChart"
import { DailyCategoryTrendChart } from "./DailyCategoryTrendChart"
import { TopCategoriesTable } from "./TopCategoriesTable"

import { Sparkles, Settings as SettingsIcon } from "lucide-react"

interface AveragesResponse {
  riskScore: number
  disadvantagePercent: number
}

// Fallback logic for various API response shapes
const parseAverages = (data: any): AveragesResponse => {
  if (Array.isArray(data) && data.length >= 2) {
    return { riskScore: data[0], disadvantagePercent: data[1] }
  }
  if (data && typeof data === "object") {
    // Assuming keys could vary, we take the first two numbers found
    const values = Object.values(data).filter(v => typeof v === 'number') as number[]
    return {
      riskScore: data.riskScore ?? data.overallRisk ?? values[0] ?? 0,
      disadvantagePercent: data.disadvantagePercent ?? data.disadvantageScore ?? values[1] ?? 0,
    }
  }
  return { riskScore: 0, disadvantagePercent: 0 }
}

import { Navbar } from "@/components/Navbar"

export default function DashboardPage() {
  const [averages, setAverages] = useState<AveragesResponse>({ riskScore: 0, disadvantagePercent: 0 })
  const [contractCount, setContractCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Promise.all to fetch concurrently
        const [averagesRes, contractsRes] = await Promise.all([
          fetch("/api/dashboard/averages/overall").then((res) => res.ok ? res.json() : null).catch(() => null),
          fetch("/api/dashboard/contracts/overall").then((res) => res.ok ? res.json() : null).catch(() => null),
        ])

        if (averagesRes) {
          setAverages(parseAverages(averagesRes))
        } else {
          setAverages({ riskScore: 0, disadvantagePercent: 0 })
        }

        if (contractsRes) {
          // Check if response is just a number or an object
          const count = typeof contractsRes === "number" ? contractsRes : (contractsRes.count ?? contractsRes.total ?? 0)
          setContractCount(count)
        } else {
          setContractCount(0)
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
        setAverages({ riskScore: 0, disadvantagePercent: 0 })
        setContractCount(0)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <>

      <div className="max-w-7xl mx-auto space-y-8 py-12 px-8 relative z-10">
        
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. Left (Risk Score) */}
          <Card className="flex flex-col justify-center items-center py-8">
            <CardContent className="p-0 flex flex-col items-center">
              <CircularScoreChart 
                title="종합 위험도 점수"
                score={averages.riskScore}
                subtitle="위험 수준"
                color="#ea580c" // Orange
              />
            </CardContent>
          </Card>

          {/* 2. Center (Analyzed Contracts Count) */}
          <Card className="flex flex-col justify-center items-center py-8">
            <CardContent className="p-0 flex flex-col items-center text-center space-y-4">
              <h3 className="text-sm font-bold tracking-wider text-[#2f2054] uppercase">
                분석 완료된 계약서
              </h3>
              <div className="flex flex-col items-center justify-center">
                <span className="text-6xl font-extrabold text-[#1a103c] tabular-nums tracking-tighter">
                  {loading ? "..." : contractCount.toLocaleString()}
                </span>
                <span className="text-[13px] font-bold text-[#655b87] mt-2">
                  총 처리된 문서
                </span>
              </div>
            </CardContent>
          </Card>

          {/* 3. Right (Disadvantage Percent) */}
          <Card className="flex flex-col justify-center items-center py-8">
            <CardContent className="p-0 flex flex-col items-center">
              <CircularScoreChart 
                title="종합 불리함 지수"
                score={averages.disadvantagePercent}
                subtitle="평균 수준"
                color="#6d28d9" // Dark Purple
              />
            </CardContent>
          </Card>

        </div>

        {/* Row 2: Daily Category Trend Stacked Bar Chart */}
        <div className="grid grid-cols-1 gap-6">
          <DailyCategoryTrendChart />
        </div>

        {/* Row 3: Top Risk Categories */}
        <div className="grid grid-cols-1 gap-6">
          <TopCategoriesTable />
        </div>

      </div>
    </>
  )
}
