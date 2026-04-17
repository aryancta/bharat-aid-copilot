import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  trend?: {
    value: number
    label: string
    type: 'up' | 'down' | 'neutral'
  }
  className?: string
  variant?: 'default' | 'primary' | 'success' | 'warning'
}

export function StatCard({ 
  title, 
  value, 
  subtitle,
  icon: Icon,
  trend,
  className,
  variant = 'default'
}: StatCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`
      } else if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`
      }
      return val.toLocaleString()
    }
    return val
  }

  const getTrendIcon = () => {
    if (!trend) return null
    
    switch (trend.type) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />
      case 'down':
        return <TrendingDown className="w-4 h-4" />
      default:
        return <Minus className="w-4 h-4" />
    }
  }

  const getTrendColor = () => {
    if (!trend) return ''
    
    switch (trend.type) {
      case 'up':
        return 'text-green-600 bg-green-50'
      case 'down':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'border-indigo-200 bg-gradient-to-br from-indigo-50 to-white'
      case 'success':
        return 'border-green-200 bg-gradient-to-br from-green-50 to-white'
      case 'warning':
        return 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-white'
      default:
        return 'border-gray-200 hover:border-indigo-200'
    }
  }

  return (
    <Card className={cn(
      'transition-all duration-200 hover:shadow-md',
      getVariantStyles(),
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              {Icon && (
                <Icon className={cn(
                  'w-5 h-5',
                  variant === 'primary' ? 'text-indigo-600' :
                  variant === 'success' ? 'text-green-600' :
                  variant === 'warning' ? 'text-yellow-600' :
                  'text-gray-600'
                )} />
              )}
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                {title}
              </h3>
            </div>
            
            <div className="flex items-baseline space-x-2">
              <span className={cn(
                'text-2xl font-bold',
                variant === 'primary' ? 'text-indigo-900' :
                variant === 'success' ? 'text-green-900' :
                variant === 'warning' ? 'text-yellow-900' :
                'text-gray-900'
              )}>
                {formatValue(value)}
              </span>
              
              {trend && (
                <Badge 
                  variant="secondary" 
                  className={cn('text-xs px-2 py-0.5 flex items-center space-x-1', getTrendColor())}
                >
                  {getTrendIcon()}
                  <span>{trend.value > 0 ? '+' : ''}{trend.value}%</span>
                </Badge>
              )}
            </div>
            
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">
                {subtitle}
              </p>
            )}
            
            {trend && trend.label && (
              <p className="text-xs text-gray-400 mt-1">
                {trend.label}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}