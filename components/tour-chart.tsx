"use client"
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
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

interface BookingsByCountryChartProps {
  bookingsByCountry: Array<{ country: string; count: string }>;
}

const countryChartConfig = {
  kenya: {
    label: "Kenya",
    color: "#10b981", // Green
  },
  tanzania: {
    label: "Tanzania",
    color: "#3b82f6", // Blue
  },
  uganda: {
    label: "Uganda",
    color: "#f59e0b", // Orange
  },
} satisfies ChartConfig;

export const BookingsByCountryChart = ({ bookingsByCountry }: BookingsByCountryChartProps) => {
  // Transform the data
  const chartData = bookingsByCountry.map(item => ({
    country: item.country.charAt(0).toUpperCase() + item.country.slice(1),
    bookings: parseInt(item.count),
    fill: countryChartConfig[item.country as keyof typeof countryChartConfig]?.color || "#94a3b8"
  }));

  // Calculate total
  const totalBookings = chartData.reduce((sum, item) => sum + item.bookings, 0);

  return (
    <Card className="rounded-[40px] max-w-full bg-accent/45 backdrop-blur-2xl p-0">
      <CardHeader className="items-center pt-7 pb-0">
        <CardTitle>Bookings by Country</CardTitle>
        <CardDescription>Distribution across East Africa</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-6">
        <ChartContainer
          config={countryChartConfig}
          className="mx-auto aspect-square max-h-62.5"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent 
                labelFormatter={(value) => value}
                formatter={(value) => [`${value} bookings`, '']}
              />}
            />
            <Pie
              data={chartData}
              dataKey="bookings"
              nameKey="country"
              innerRadius={60}
              outerRadius={100}
              strokeWidth={2}
              animationBegin={0}
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        {/* Legend */}
        <div className="mt-6 space-y-2">
          {chartData.map((item) => {
            const percentage = ((item.bookings / totalBookings) * 100).toFixed(1);
            return (
              <div key={item.country} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-muted-foreground">{item.country}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{item.bookings}</span>
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>Total Bookings</span>
            <span>{totalBookings}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}