"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { MoreHorizontal, Settings, AlertTriangle } from "lucide-react"

interface TopCategoryData {
  categoryId: number
  categoryName: string
  avgRiskScore: number
  avgDisadvantagePercent: number
  riskClauseCount: number
  latestRiskTitle?: string
  latestLegalBase?: string
}


export function TopCategoriesTable() {
  const [data, setData] = useState<TopCategoryData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTopCategories = async () => {
      try {
        const res = await fetch("/api/dashboard/categories/top?limit=5")
        if (res.ok) {
          const json: TopCategoryData[] = await res.json()
          if (json && json.length > 0) {
            // Fetch latest risks for each category
            const withRisks = await Promise.all(json.map(async (cat) => {
              if (!cat.categoryId) return cat
              try {
                const riskRes = await fetch(`/api/dashboard/${cat.categoryId}/risks-clauses`)
                if (riskRes.ok) {
                  const risks = await riskRes.json()
                  if (risks && risks.length > 0) {
                    return {
                      ...cat,
                      latestRiskTitle: risks[0].riskTitle,
                      latestLegalBase: risks[0].legalBase
                    }
                  }
                }
              } catch(e) {}
              return cat
            }))
            setData(withRisks)
            return
          }
        }
        // Fallback to empty if empty
        setData([])
      } catch (error) {
        console.error("Failed to load top categories", error)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchTopCategories()
  }, [])

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm uppercase tracking-wider text-[#635f79] font-bold">
          위험도 상위 카테고리
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[13px] uppercase bg-slate-50 text-[#635f79] font-bold border-b border-slate-200">
              <tr>
                <th scope="col" className="px-6 py-4 tracking-wider whitespace-nowrap">카테고리명</th>
                <th scope="col" className="px-6 py-4 tracking-wider text-center whitespace-nowrap">평균 위험도</th>
                <th scope="col" className="px-6 py-4 tracking-wider text-center whitespace-nowrap">불리함 비율</th>
                <th scope="col" className="px-6 py-4 tracking-wider text-center whitespace-nowrap">최신 위험 조항 예시</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[#7d7b90] font-medium">
                    데이터를 불러오는 중입니다...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium">
                    분석된 데이터가 없습니다. 새로운 계약서를 등록해주세요.
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr 
                    key={index} 
                    className="bg-white border-b border-slate-50 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <Link 
                        href={item.categoryId ? `/dashboard/category/${item.categoryId}?name=${encodeURIComponent(item.categoryName)}` : '#'}
                        className="font-semibold text-[#3b3260] hover:text-[#5b4db3] transition-colors hover:underline"
                      >
                        {item.categoryName}
                      </Link>
                    </td>
                    <td className="px-6 py-5 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-2">
                        {item.avgRiskScore >= 70 && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                        <span className={`font-semibold ${item.avgRiskScore >= 70 ? 'text-orange-600' : 'text-slate-600'}`}>
                          {item.avgRiskScore.toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center whitespace-nowrap">
                      <span className="font-semibold text-[#4a4175]">
                        {item.avgDisadvantagePercent.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center min-w-[250px] whitespace-normal break-words">
                      {item.latestRiskTitle ? (
                        <div className="flex flex-col items-center justify-center text-xs">
                          <span className="font-bold text-[#b91c1c]">{item.latestRiskTitle}</span>
                          <span className="text-[#64748b] mt-1">{item.latestLegalBase}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
