
"use client"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
  bookings: {  // ✅ Changed to match dataKey
    label: "Bookings",
    color: "#38aecc",
  },
} satisfies ChartConfig

interface TourChartProps {
  monthlyBookings: Array<{ month: string; count: string }>;
}

export function TourChart({ monthlyBookings }: TourChartProps) {
  // Transform the data for the chart
  const chartData = monthlyBookings.map(item => ({
    month: formatMonth(item.month),
    bookings: parseInt(item.count)
  }));

  return (
    <Card className="rounded-[40px] max-w-full bg-accent/45 backdrop-blur-2xl p-0">
      <CardHeader className="p-6">
        <CardTitle>Booking Trends</CardTitle>
        <CardDescription>
          Monthly bookings overview
        </CardDescription>

         <div className="">
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none text-muted-foreground text-xs font-semibold">
              {chartData.length > 0 && `${chartData[0].month} - ${chartData[chartData.length - 1].month}`}
            </div>
          </div>
        </div>
      </div>
      </CardHeader>

        <ChartContainer 
          style={{ height: 255 }} 
          className="w-full" 
          config={chartConfig}
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="bookings"
              type="natural"
                fill={chartConfig.bookings.color}
                fillOpacity={0.4}
                stroke={chartConfig.bookings.color}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>

     
    </Card>
  )
}

// Helper function to format month
function formatMonth(monthStr: string): string {
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}