"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { TrendingUp, TrendingDown } from "lucide-react"
import { LabelList, Pie, PieChart } from "recharts"
import useApi from "@/services/api"

export function Visitors() {
  const [chartData, setChartData] = useState([])
  const [totalVisitors, setTotalVisitors] = useState(0)
  const [percentageChange, setPercentageChange] = useState(0)
  const [deferent, setDeferent] = useState(0)
  const api = useApi()

  useEffect(() => {
    // Fetch data from the Laravel API
    api.get("/api/visitor-counts/top-countries")
      .then((response) => {
        const data = response.data.chartData
        setChartData(data);
        const total = data.reduce((acc, curr) => acc + curr.visitors, 0)
        setTotalVisitors(total)
        setPercentageChange(response.data.percentageChange)
        setDeferent(response.data.deferent)
      })
      .catch((error) => {
        console.error("Error fetching visitor data:", error)
      })
  }, [])

  // Define colors for consistency
  const colorMapping = {
    // Define colors for specific countries if needed
    // Example: 'USA': '#FF6384',
    // Otherwise, use colors from backend
  }

  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    ...chartData.reduce((acc, curr) => {
      acc[curr.country] = {
        label: curr.country,
        color: colorMapping[curr.country] || curr.fill,
      }
      return acc
    }, {}),
  }

  const renderPercentageChange = () => {
    if (percentageChange > 0) {
      return (
        <div className="flex items-center gap-2 text-center font-medium leading-none text-green-600">
          Trending up by {percentageChange.toFixed(2)}% this month + {deferent}<TrendingUp className="h-4 w-4" />
        </div>
      )
    } else if (percentageChange < 0) {
      return (
        <div className="flex items-center text-center gap-2 font-medium leading-none text-red-600">
          Trending down by {Math.abs(percentageChange).toFixed(2)}% this month  {deferent}<TrendingDown className="h-4 w-4" />
        </div>
      )
    } else {
      return (
        <div className="flex items-center gap-2 text-center font-medium leading-none text-gray-600">
          No change in visitor numbers this month
        </div>
      )
    }
  }

  return (
    <Card className="flex flex-col bg-orange-300 bg-opacity-15">
      <CardHeader className="items-center pb-0">
        <CardTitle>Visitor Distribution</CardTitle>
        <CardDescription>{`Month: ${new Date().toLocaleString('default', { month: 'long' })} ${new Date().getFullYear()}`}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="country"
              innerRadius={60}
              strokeWidth={5}
            >
              <LabelList
                dataKey="visitors"
                position="center"
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    )
                  }
                  return null
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {renderPercentageChange()}
        <div className="leading-none text-muted-foreground">
          Showing number of visitors for the current month
        </div>
      </CardFooter>
    </Card>
  )
}
