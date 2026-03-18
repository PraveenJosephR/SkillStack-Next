"use client"

import { useEffect, useState } from "react"
import { useAtomValue } from "jotai"
import { tokenAtom } from "@/store/atoms"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import { Crown, Medal, Award } from "lucide-react"

// Types
interface LeaderboardStudent {
  id: string
  rank: number
  name: string
  tokenCount: number
  isEligible: boolean
  department: string
  year: string
  section: string
}

// Mock Data Fallback
const mockLeaderboardData: LeaderboardStudent[] = [
  { id: "1", rank: 1, name: "Arjun Kumar", tokenCount: 25, isEligible: true, department: "CSE", year: "3rd Year", section: "C1" },
  { id: "2", rank: 2, name: "Meera Sharma", tokenCount: 22, isEligible: true, department: "ECE", year: "3rd Year", section: "E1" },
  { id: "3", rank: 3, name: "Rahul Verma", tokenCount: 20, isEligible: true, department: "IT", year: "4th Year", section: "I2" },
  { id: "4", rank: 4, name: "Sneha Reddy", tokenCount: 18, isEligible: true, department: "CSE", year: "2nd Year", section: "C2" },
  { id: "5", rank: 5, name: "Karthik Das", tokenCount: 16, isEligible: true, department: "ECE", year: "1st Year", section: "E2" },
  { id: "6", rank: 6, name: "Ananya Gupta", tokenCount: 15, isEligible: true, department: "IT", year: "2nd Year", section: "I1" },
  { id: "7", rank: 7, name: "Vikram Singh", tokenCount: 14, isEligible: true, department: "CSE", year: "1st Year", section: "C3" },
  { id: "8", rank: 8, name: "Priya Menon", tokenCount: 13, isEligible: true, department: "ECE", year: "4th Year", section: "E1" },
]

export default function LeaderboardPage() {
  const token = useAtomValue(tokenAtom)
  
  // State
  const [data, setData] = useState<LeaderboardStudent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filters State
  const [department, setDepartment] = useState("All")
  const [year, setYear] = useState("All")
  const [section, setSection] = useState("All")

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoading(true)
        setError(null)
        
        // Build query string based on filters
        const params = new URLSearchParams()
        if (department !== "All") params.append("department", department)
        if (year !== "All") params.append("year", year)
        if (section !== "All") params.append("section", section)

        const response = await fetch(`http://127.0.0.1:8000/api/v1/leaderboard?${params.toString()}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard")
        }

        const backendData = await response.json()
        setData(backendData)
      } catch (err) {
        console.error("Backend fetch failed, falling back to mock data", err)
        
        // Apply local filtering to mock data if backend fails
        let filteredMock = [...mockLeaderboardData]
        if (department !== "All") filteredMock = filteredMock.filter(s => s.department === department)
        if (year !== "All") filteredMock = filteredMock.filter(s => s.year === year)
        if (section !== "All") filteredMock = filteredMock.filter(s => s.section === section)
        
        // Ensure ranks remain sequential in filtered view to match visual expectations
        filteredMock = filteredMock.map((student, index) => ({
          ...student,
          rank: index + 1
        }))
        
        setData(filteredMock)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [token, department, year, section])

  // Extract Top 3 uniquely for podium
  const top3 = data.slice(0, 3)
  const remainingRanks = data.slice(3)
  
  // Safely grab the top 3 with optional chaining in case there aren't enough students
  const rank1 = top3[0]
  const rank2 = top3[1]
  const rank3 = top3[2]

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-6xl mx-auto w-full">
      
      {/* Header Card */}
      <Card className="shadow-sm border-border/50">
        <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Leaderboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Top performing students by token count</p>
          </div>
          
          <div className="flex gap-3">
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="w-[100px] bg-background">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="CSE">CSE</SelectItem>
                <SelectItem value="ECE">ECE</SelectItem>
                <SelectItem value="IT">IT</SelectItem>
              </SelectContent>
            </Select>

            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-[110px] bg-background">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="1st Year">1st Year</SelectItem>
                <SelectItem value="2nd Year">2nd Year</SelectItem>
                <SelectItem value="3rd Year">3rd Year</SelectItem>
                <SelectItem value="4th Year">4th Year</SelectItem>
              </SelectContent>
            </Select>

            <Select value={section} onValueChange={setSection}>
              <SelectTrigger className="w-[90px] bg-background">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="C1">C1</SelectItem>
                <SelectItem value="C2">C2</SelectItem>
                <SelectItem value="C3">C3</SelectItem>
                <SelectItem value="E1">E1</SelectItem>
                <SelectItem value="E2">E2</SelectItem>
                <SelectItem value="I1">I1</SelectItem>
                <SelectItem value="I2">I2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Loading & Error States */}
      {loading && data.length === 0 && (
        <div className="min-h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground animate-pulse">Loading leaderboard...</p>
        </div>
      )}

      {/* Main Content Area */}
      {!loading && data.length > 0 && (
        <>
          {/* Chart Podium Area */}
          <div className="bg-[#eef5ff] dark:bg-[#0b1021] rounded-xl p-8 border border-blue-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-end min-h-[400px]">
             
            <ChartContainer 
              config={{
                tokens: {
                  label: "Tokens",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="w-full max-w-2xl h-[300px]"
            >
              <BarChart
                data={[
                  // Reorder so visually Rank 2 is left, Rank 1 is middle, Rank 3 is right
                  ...(rank2 ? [{ name: rank2.name, tokens: rank2.tokenCount, fill: "#94a3b8", rank: 2 }] : []),
                  ...(rank1 ? [{ name: rank1.name, tokens: rank1.tokenCount, fill: "#facc15", rank: 1 }] : []),
                  ...(rank3 ? [{ name: rank3.name, tokens: rank3.tokenCount, fill: "#f97316", rank: 3 }] : []),
                ]}
                margin={{ top: 40, right: 0, left: 0, bottom: 0 }}
              >
                
                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="name" 
                  tickLine={false} 
                  axisLine={false} 
                  tickMargin={12} 
                  fontSize={14} 
                  fontWeight="bold"
                  className="fill-foreground font-semibold"
                />
                <YAxis hide domain={[0, 'dataMax + 5']} />
                
                <ChartTooltip
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  content={<ChartTooltipContent hideLabel />}
                />
                
                <Bar 
                  dataKey="tokens" 
                  radius={[8, 8, 0, 0]} 
                  barSize={120}
                >
                  <LabelList
                    dataKey="tokens"
                    position="top"
                    offset={12}
                    className="fill-foreground text-lg font-bold"
                  />
                  <LabelList
                    dataKey="rank"
                    position="inside"
                    offset={20}
                    className="fill-white text-4xl font-black drop-shadow-md"
                    fill="white"
                  />
                </Bar>
              </BarChart>
            </ChartContainer>

          </div>

          {/* Rankings List */}
          {remainingRanks.length > 0 && (
            <Card className="shadow-sm border-border/50">
              <div className="p-4 border-b bg-muted/20">
                <h3 className="font-semibold text-sm text-foreground">Rankings</h3>
              </div>
              <div className="flex flex-col divide-y">
                {remainingRanks.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 hover:bg-muted/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300">
                        {student.rank}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{student.name}</span>
                        {student.isEligible && (
                          <span className="text-xs text-green-600 dark:text-green-500 font-medium">Eligible</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-blue-500" />
                      <span className="font-bold text-blue-600 dark:text-blue-400">{student.tokenCount}</span>
                      <span className="text-xs text-muted-foreground ml-1">tokens</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}

      {/* No Data State */}
      {!loading && data.length === 0 && (
        <Card className="shadow-sm border-border/50">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <h3 className="text-xl font-bold text-foreground">No records found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your filters or checking back later.</p>
          </CardContent>
        </Card>
      )}

    </div>
  )
}
