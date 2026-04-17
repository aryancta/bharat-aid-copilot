import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  className?: string
  highlight?: boolean
}

export function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  className,
  highlight = false 
}: FeatureCardProps) {
  return (
    <Card className={cn(
      'group hover:shadow-lg transition-all duration-300 border-2',
      highlight 
        ? 'border-indigo-200 bg-gradient-to-br from-indigo-50 to-white hover:border-indigo-300' 
        : 'border-gray-200 hover:border-indigo-200 hover:-translate-y-1',
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className={cn(
            'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300',
            highlight
              ? 'civic-gradient text-white'
              : 'bg-indigo-100 text-indigo-600 group-hover:civic-gradient group-hover:text-white'
          )}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}