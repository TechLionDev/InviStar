"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react"
import {
  Area,
  AreaChart as RechartsAreaChart,
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  RadialBar,
  RadialBarChart as RechartsRadialBarChart,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { cn } from "@/lib/utils"

interface LineChartProps extends React.ComponentProps<typeof RechartsLineChart> {
  className?: string
  series: {
    name: string
    data: number[]
    color?: string
  }[]
  categories: string[]
  yAxisWidth?: number
  showTooltip?: boolean
  showLegend?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  showCartesianGrid?: boolean
}

const LineChart = ({
  className,
  series,
  categories,
  yAxisWidth = 56,
  showTooltip = true,
  showLegend = true,
  showXAxis = true,
  showYAxis = true,
  showCartesianGrid = true,
  ...props
}: LineChartProps) => {
  const formatData = () => {
    return categories.map((category, index) => {
      const dataPoint: { [key: string]: string | number } = {
        name: category,
      }
      series.forEach((s) => {
        dataPoint[s.name] = s.data[index] || 0
      })
      return dataPoint
    })
  }

  const data = formatData()

  return (
    <div className={cn("w-full h-[300px]", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 0,
            bottom: 5,
          }}
          {...props}
        >
          {showCartesianGrid && (
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
          )}
          {showXAxis && (
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              stroke="#888888"
              fontSize={12}
            />
          )}
          {showYAxis && (
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              stroke="#888888"
              fontSize={12}
              width={yAxisWidth}
            />
          )}
          {showTooltip && <Tooltip cursor={false} content={<CustomTooltip />} />}
          {showLegend && (
            <Legend
              content={
                <CustomLegend
                  series={series.map((s) => ({
                    name: s.name,
                    color: s.color,
                  }))}
                />
              }
            />
          )}
          {series.map((s, i) => (
            <Line
              key={`${s.name}-${i}`}
              type="monotone"
              dataKey={s.name}
              stroke={s.color || getDefaultColor(i)}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, style: { fill: "var(--color-background)" } }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}

interface BarChartProps extends React.ComponentProps<typeof RechartsBarChart> {
  className?: string
  series: {
    name: string
    data: number[]
    color?: string
  }[]
  categories: string[]
  yAxisWidth?: number
  showTooltip?: boolean
  showLegend?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  showCartesianGrid?: boolean
}

const BarChart = ({
  className,
  series,
  categories,
  yAxisWidth = 56,
  showTooltip = true,
  showLegend = true,
  showXAxis = true,
  showYAxis = true,
  showCartesianGrid = true,
  ...props
}: BarChartProps) => {
  const formatData = () => {
    return categories.map((category, index) => {
      const dataPoint: { [key: string]: string | number } = {
        name: category,
      }
      series.forEach((s) => {
        dataPoint[s.name] = s.data[index] || 0
      })
      return dataPoint
    })
  }

  const data = formatData()

  return (
    <div className={cn("w-full h-[300px]", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 0,
            bottom: 5,
          }}
          {...props}
        >
          {showCartesianGrid && (
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
          )}
          {showXAxis && (
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              stroke="#888888"
              fontSize={12}
            />
          )}
          {showYAxis && (
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              stroke="#888888"
              fontSize={12}
              width={yAxisWidth}
            />
          )}
          {showTooltip && <Tooltip cursor={false} content={<CustomTooltip />} />}
          {showLegend && (
            <Legend
              content={
                <CustomLegend
                  series={series.map((s) => ({
                    name: s.name,
                    color: s.color,
                  }))}
                />
              }
            />
          )}
          {series.map((s, i) => (
            <Bar
              key={`${s.name}-${i}`}
              dataKey={s.name}
              fill={s.color || getDefaultColor(i)}
              radius={[4, 4, 0, 0]}
              shape={<Rectangle />}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}

interface AreaChartProps extends React.ComponentProps<typeof RechartsAreaChart> {
  className?: string
  series: {
    name: string
    data: number[]
    color?: string
  }[]
  categories: string[]
  yAxisWidth?: number
  showTooltip?: boolean
  showLegend?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  showCartesianGrid?: boolean
}

const AreaChart = ({
  className,
  series,
  categories,
  yAxisWidth = 56,
  showTooltip = true,
  showLegend = true,
  showXAxis = true,
  showYAxis = true,
  showCartesianGrid = true,
  ...props
}: AreaChartProps) => {
  const formatData = () => {
    return categories.map((category, index) => {
      const dataPoint: { [key: string]: string | number } = {
        name: category,
      }
      series.forEach((s) => {
        dataPoint[s.name] = s.data[index] || 0
      })
      return dataPoint
    })
  }

  const data = formatData()

  return (
    <div className={cn("w-full h-[300px]", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 0,
            bottom: 5,
          }}
          {...props}
        >
          {showCartesianGrid && (
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
          )}
          {showXAxis && (
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              stroke="#888888"
              fontSize={12}
            />
          )}
          {showYAxis && (
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              stroke="#888888"
              fontSize={12}
              width={yAxisWidth}
            />
          )}
          {showTooltip && <Tooltip cursor={false} content={<CustomTooltip />} />}
          {showLegend && (
            <Legend
              content={
                <CustomLegend
                  series={series.map((s) => ({
                    name: s.name,
                    color: s.color,
                  }))}
                />
              }
            />
          )}
          {series.map((s, i) => (
            <Area
              key={`${s.name}-${i}`}
              type="monotone"
              dataKey={s.name}
              fill={s.color || getDefaultColor(i)}
              stroke={s.color || getDefaultColor(i)}
              fillOpacity={0.3}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  )
}

interface PieChartProps extends React.ComponentProps<typeof RechartsPieChart> {
  className?: string
  series: {
    name: string
    data: number
    color?: string
  }[]
  showTooltip?: boolean
  showLegend?: boolean
}

const PieChart = ({
  className,
  series,
  showTooltip = true,
  showLegend = true,
  ...props
}: PieChartProps) => {
  const formatData = () => {
    return series.map((s) => ({
      name: s.name,
      value: s.data,
      color: s.color,
    }))
  }

  const data = formatData()

  return (
    <div className={cn("w-full h-[300px]", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 5,
          }}
          {...props}
        >
          {showTooltip && <Tooltip content={<CustomTooltip />} />}
          {showLegend && (
            <Legend
              content={
                <CustomLegend
                  series={series.map((s) => ({
                    name: s.name,
                    color: s.color,
                  }))}
                />
              }
            />
          )}
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || getDefaultColor(index)}
              />
            ))}
          </Pie>
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  )
}

interface RadialBarChartProps
  extends React.ComponentProps<typeof RechartsRadialBarChart> {
  className?: string
  series: {
    name: string
    data: number
    color?: string
  }[]
  showTooltip?: boolean
  showLegend?: boolean
}

const RadialBarChart = ({
  className,
  series,
  showTooltip = true,
  showLegend = true,
  ...props
}: RadialBarChartProps) => {
  const formatData = () => {
    return series.map((s) => ({
      name: s.name,
      value: s.data,
      fill: s.color || getDefaultColor(series.indexOf(s)),
    }))
  }

  const data = formatData()

  return (
    <div className={cn("w-full h-[300px]", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadialBarChart
          innerRadius="10%"
          outerRadius="80%"
          data={data}
          startAngle={180}
          endAngle={0}
          {...props}
        >
          {showTooltip && <Tooltip content={<CustomTooltip />} />}
          {showLegend && (
            <Legend
              content={
                <CustomLegend
                  series={series.map((s) => ({
                    name: s.name,
                    color: s.color,
                  }))}
                />
              }
            />
          )}
          <RadialBar
            label={{ fill: "#666", position: "insideStart" }}
            background
            dataKey="value"
          />
        </RechartsRadialBarChart>
      </ResponsiveContainer>
    </div>
  )
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border-border text-popover-foreground rounded-md border p-2 shadow-md">
        <p className="mb-2 text-sm font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div
            key={`tooltip-item-${index}`}
            className="flex items-center gap-2 text-sm"
          >
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="font-medium">{entry.name}:</span>
            <span>{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }

  return null
}

const CustomLegend: React.FC<{
  series: { name: string; color?: string }[]
}> = ({ series }) => {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
      {series.map((item, index) => (
        <div key={`legend-item-${index}`} className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: item.color || getDefaultColor(index) }}
          />
          <span className="text-sm">{item.name}</span>
        </div>
      ))}
    </div>
  )
}

function getDefaultColor(index: number): string {
  const colors = [
    "var(--color-chart-1)",
    "var(--color-chart-2)",
    "var(--color-chart-3)",
    "var(--color-chart-4)",
    "var(--color-chart-5)",
  ]
  return colors[index % colors.length]
}

export {
  AreaChart,
  BarChart,
  LineChart,
  PieChart,
  RadialBarChart,
  CustomLegend,
  CustomTooltip,
}
