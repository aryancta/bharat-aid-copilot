import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, 
  MessageCircle, 
  CheckCircle, 
  Search,
  Globe,
  Shield,
  Zap,
  Users,
  BookOpen,
  Star
} from 'lucide-react'

export function Hero() {
  const features = [
    { icon: Globe, text: '10 Indian Languages' },
    { icon: Shield, text: 'Official Source Grounded' },
    { icon: Zap, text: 'AI-Powered Assistance' },
    { icon: Users, text: '12+ Schemes Indexed' },
  ]

  const quickActions = [
    {
      icon: MessageCircle,
      title: 'Ask Questions',
      description: 'Chat with our AI assistant',
      href: '/chat',
      color: 'bg-indigo-600 hover:bg-indigo-700'
    },
    {
      icon: CheckCircle,
      title: 'Check Eligibility',
      description: 'Find your matching schemes',
      href: '/eligibility',
      color: 'bg-teal-600 hover:bg-teal-700'
    },
    {
      icon: Search,
      title: 'Browse Schemes',
      description: 'Explore all programs',
      href: '/schemes',
      color: 'bg-indigo-500 hover:bg-indigo-600'
    }
  ]

  return (
    <div className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 civic-gradient-subtle"></div>
      <div className="absolute inset-0 bg-white/60"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-saffron-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>

      <div className="relative container py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="flex justify-center">
            <Badge 
              variant="secondary" 
              className="px-4 py-2 text-sm bg-white/80 border border-indigo-200 text-indigo-800"
            >
              <Star className="w-4 h-4 mr-2 text-saffron-500" />
              Hackathon Project - Built for Social Impact
            </Badge>
          </div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">
              Find the{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-teal-600 bg-clip-text text-transparent">
                right government scheme
              </span>
              , check eligibility, and get step-by-step help
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Your multilingual AI copilot for navigating India's government programs. 
              Get personalized guidance backed by official sources.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-center space-x-2 bg-white/80 backdrop-blur border border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-gray-700"
              >
                <feature.icon className="w-4 h-4 text-indigo-600" />
                <span>{feature.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              asChild
              className="civic-gradient hover:opacity-90 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <Link href="/eligibility">
                <CheckCircle className="mr-2 h-5 w-5" />
                Check Your Eligibility
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              asChild
              className="border-2 border-indigo-200 bg-white/80 backdrop-blur hover:bg-indigo-50 text-indigo-700 font-semibold px-8 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <Link href="/schemes">
                <Search className="mr-2 h-5 w-5" />
                Browse Schemes
              </Link>
            </Button>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mt-12">
            {quickActions.map((action, index) => (
              <Link 
                key={index}
                href={action.href}
                className="group"
              >
                <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-xl p-6 hover:border-indigo-300 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {action.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="border-t border-gray-200 pt-8 mt-12">
            <p className="text-sm text-gray-500 mb-4">Powered by official government sources</p>
            <div className="flex flex-wrap justify-center gap-6 text-gray-400">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span className="text-xs">Official Guidelines</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span className="text-xs">Source Citations</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span className="text-xs">Real-time Updates</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}