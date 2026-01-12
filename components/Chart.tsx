'use client'

import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Visualization, ChartType } from '@/types'

interface ChartProps {
  visualization: Visualization
  embed?: boolean
}

const COLORS = ['#000000', '#666666', '#999999', '#cccccc', '#333333', '#555555', '#777777', '#aaaaaa']

export default function Chart({ visualization, embed = false }: ChartProps) {
  const { chartType, chartData } = visualization

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={embed ? 300 : 500}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#000" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={embed ? 300 : 500}>
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#000" />
            </BarChart>
          </ResponsiveContainer>
        )
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={embed ? 300 : 500}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={embed ? 100 : 150}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )
      
      default:
        return <div>Unsupported chart type</div>
    }
  }

  return (
    <div className="w-full">
      {renderChart()}
    </div>
  )
}
