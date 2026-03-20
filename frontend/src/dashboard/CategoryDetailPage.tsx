"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, BookOpen, ChevronLeft, ShieldAlert } from "lucide-react"
import { CircularScoreChart } from "./CircularScoreChart"
import Link from "next/link"

interface CategoryScoreDto {
  avgRiskScore: number
  avgDisadvantagePercent: number
}

interface CategoryLatestRiskDto {
  riskTitle: string
  legalBase: string
}

export function CategoryDetailPage({ categoryId }: { categoryId: number }) {
  const searchParams = useSearchParams()
  const categoryName = searchParams.get("name") || "카테고리 상세"

  const [scores, setScores] = useState<CategoryScoreDto>({ avgRiskScore: 0, avgDisadvantagePercent: 0 })
  const [contractCount, setContractCount] = useState<number>(0)
  const [risks, setRisks] = useState<CategoryLatestRiskDto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true)

        const [scoresRes, countRes, risksRes] = await Promise.all([
          fetch(`/api/dashboard/${categoryId}/overall`),
          fetch(`/api/dashboard/${categoryId}/contracts`),
          fetch(`/api/dashboard/${categoryId}/risks-clauses`)
        ])

        if (scoresRes.ok) {
          const json = await scoresRes.json()
          setScores(json || { avgRiskScore: 0, avgDisadvantagePercent: 0 })
        }

        if (countRes.ok) {
          const count = await countRes.json()
          setContractCount(typeof count === "number" ? count : 0)
        }

        if (risksRes.ok) {
          const json = await risksRes.json()
          setRisks(json || [])
        }

      } catch (error) {
        console.error("Failed to fetch category details:", error)
      } finally {
        setLoading(false)
      }
    }

    if (categoryId) {
      fetchCategoryData()
    }
  }, [categoryId])

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Breadcrumb */}
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/dashboard" className="p-2 rounded-full hover:bg-slate-200 transition-colors">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <h1 className="text-2xl font-bold text-[#1a103c] flex items-center gap-3 tracking-tight">
            <span className="bg-[#8b5cf6] text-white px-3 py-1 rounded-md text-sm">{categoryName}</span>
            상세 리포트
          </h1>
        </div>

        {/* Row 1: Scores and Count */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Card className="flex flex-col justify-center items-center py-8">
            <CardContent className="p-0 flex flex-col items-center">
              <CircularScoreChart 
                title="종합 위험도 점수"
                score={scores.avgRiskScore || 0}
                subtitle="평균 위험 수준"
                color="#ea580c" 
              />
            </CardContent>
          </Card>

          <Card className="flex flex-col justify-center items-center py-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <BookOpen className="w-32 h-32" />
            </div>
            <CardContent className="p-0 flex flex-col items-center text-center space-y-4 relative z-10">
              <h3 className="text-sm font-bold tracking-wider text-[#2f2054] uppercase">
                누적 분석된 계약서
              </h3>
              <div className="flex flex-col items-center justify-center">
                <span className="text-6xl font-extrabold text-[#1a103c] tabular-nums tracking-tighter">
                  {loading ? "..." : contractCount.toLocaleString()}
                </span>
                <span className="text-[13px] font-bold text-[#655b87] mt-2">
                  해당 카테고리 내 총 건수
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col justify-center items-center py-8">
            <CardContent className="p-0 flex flex-col items-center">
              <CircularScoreChart 
                title="종합 불리함 지수"
                score={scores.avgDisadvantagePercent || 0}
                subtitle="평균 불리함 비율"
                color="#6d28d9"
              />
            </CardContent>
          </Card>
        </div>

        {/* Row 2: Latest Risk Clauses */}
        <Card className="w-full">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm uppercase tracking-wider text-[#635f79] font-bold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#ea580c]" />
              가장 최근 발견된 위험 조항 (Top 3)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[13px] uppercase bg-slate-50 text-[#635f79] font-bold border-b border-slate-200">
                  <tr>
                    <th scope="col" className="px-6 py-4 w-1/3">위험 조항 제목 (Risk Title)</th>
                    <th scope="col" className="px-6 py-4">관련 법적 근거 (Legal Base)</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={2} className="px-6 py-12 text-center text-[#7d7b90] font-medium">
                        데이터를 불러오는 중입니다...
                      </td>
                    </tr>
                  ) : risks.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="px-6 py-12 text-center text-slate-400 font-medium">
                        최근 발견된 위험 조항이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    risks.map((item, index) => (
                      <tr 
                        key={index} 
                        className="bg-white border-b border-slate-50 hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <span className="font-bold text-[#b91c1c] text-sm leading-relaxed">
                              {item.riskTitle}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-[#4a4175] font-medium text-[13.5px] leading-relaxed">
                            {item.legalBase}
                          </p>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
