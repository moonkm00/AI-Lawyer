"use client"

import React, { useEffect, useState } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"


export function DailyCategoryTrendChart() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/dashboard/contracts/daily")
        if (res.ok) {
          const json = await res.json()
          if (json && json.length > 0) {
            setData(json)
            return
          }
        }
        setData([])
      } catch (e) {
        console.error("Failed to fetch daily trend", e)
        setData([])
      } finally {
        setLoading(false)
      }
    }
    fetchRealData()
  }, [])

  return (
    <Card className="w-full">
      <CardHeader className="pb-6">
        <div>
          <CardTitle className="text-sm uppercase tracking-wider text-[#635f79] font-bold">
            핵심 분석 트렌드
          </CardTitle>
          <p className="text-[12px] text-[#7d7b90] mt-1 font-medium">최근 14일간 접수된 일일 분석 건수 (전체 계약서)</p>
        </div>
      </CardHeader>
      <CardContent className="px-2 pb-6">
        <div className="h-[320px] w-full">
          {loading ? (
            <div className="flex items-center justify-center h-full text-[#7d7b90] font-medium">
              데이터를 불러오는 중입니다...
            </div>
          ) : data.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-400 font-medium">
              분석된 트렌드 데이터가 없습니다. 새로운 계약서를 등록해주세요.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 30, left: -10, bottom: 30 }}
              >
                <defs>
                  <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6d28d9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6d28d9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#7d7b90", fontSize: 12, fontWeight: 700 }} 
                  dy={15}
                  tickMargin={5}
                  minTickGap={20}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#7d7b90", fontSize: 12, fontWeight: 600 }}
                  allowDecimals={false} // Force integers (0, 1, 2, 3...)
                />
                <Tooltip 
                  cursor={{ stroke: '#c4b5fd', strokeWidth: 1, strokeDasharray: '4 4' }}
                  contentStyle={{ 
                    borderRadius: "12px", 
                    border: "none", 
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    fontWeight: "bold",
                    color: "#2f2054",
                    fontSize: "13px"
                  }}
                  itemStyle={{ color: "#6d28d9", fontWeight: "bold" }}
                  formatter={(value: any) => [`${value}건`, "전체 분석 기록"]}
                  labelStyle={{ color: "#7d7b90", marginBottom: "4px" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="Total" 
                  stroke="#6d28d9" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorPrimary)" 
                  activeDot={{ r: 6, fill: "#6d28d9", stroke: "#fff", strokeWidth: 2 }}
                  animationDuration={800}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
