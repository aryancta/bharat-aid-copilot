import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/components/stat-card'
import { 
  MessageCircle, 
  CheckCircle, 
  Search, 
  FileText,
  TrendingUp,
  Clock,
  Users,
  Shield,
  ArrowRight,
  Star,
  Calendar,
  MapPin
} from 'lucide-react'

export default function DashboardPage() {
  // Mock data - in production these would come from API calls
  const quickStats = [
    {
      title: 'Eligible Schemes',
      value: 8,
      subtitle: 'Based on your profile',
      icon: CheckCircle,
      variant: 'success' as const,
      trend: { value: 12, label: 'New this month', type: 'up' as const }
    },
    {
      title: 'Chat Sessions',
      value: 12,
      subtitle: 'Questions answered',
      icon: MessageCircle,
      variant: 'primary' as const
    },
    {
      title: 'Applications Started',
      value: 3,
      subtitle: 'In progress',
      icon: FileText,
      variant: 'warning' as const
    },
    {
      title: 'Success Rate',
      value: '92%',
      subtitle: 'Application approval',
      icon: TrendingUp,
      variant: 'default' as const
    }
  ]

  const quickActions = [
    {
      icon: MessageCircle,
      title: 'Ask a Question',
      description: 'Get instant answers about schemes and eligibility',
      href: '/chat',
      color: 'bg-indigo-600'
    },
    {
      icon: CheckCircle,
      title: 'Check Eligibility',
      description: 'Find schemes you qualify for with our wizard',
      href: '/eligibility',
      color: 'bg-teal-600'
    },
    {
      icon: Search,
      title: 'Browse Schemes',
      description: 'Explore our comprehensive scheme database',
      href: '/schemes',
      color: 'bg-indigo-500'
    }
  ]

  const recentConversations = [
    {
      id: '1',
      title: 'PM-KISAN eligibility criteria',
      preview: 'What are the eligibility criteria for PM-KISAN scheme?',
      timestamp: '2 hours ago',
      status: 'completed'
    },
    {
      id: '2', 
      title: 'Scholarship application process',
      preview: 'How do I apply for national scholarship portal?',
      timestamp: '1 day ago',
      status: 'completed'
    },
    {
      id: '3',
      title: 'Documents for housing scheme',
      preview: 'What documents do I need for PM Awas Yojana?',
      timestamp: '3 days ago',
      status: 'completed'
    }
  ]

  const recommendedSchemes = [
    {
      id: 'pm-kisan-samman-nidhi',
      name: 'PM-KISAN Samman Nidhi',
      category: 'Agriculture',
      match: 95,
      description: 'Financial support for farmers',
      status: 'eligible'
    },
    {
      id: 'pradhan-mantri-mudra-yojana',
      name: 'Pradhan Mantri MUDRA Yojana',
      category: 'Financial Inclusion',
      match: 88,
      description: 'Micro-finance for small businesses',
      status: 'eligible'
    },
    {
      id: 'skill-india-mission',
      name: 'Skill India Mission',
      category: 'Skill Development',
      match: 75,
      description: 'Skill development programs',
      status: 'partial'
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'eligible':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Eligible</Badge>
      case 'partial':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Partial Match</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's your government scheme assistance overview.
          </p>
        </div>
        <Badge variant="outline" className="flex items-center space-x-2">
          <MapPin className="w-4 h-4" />
          <span>All India</span>
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-saffron-500" />
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription>
                Get started with these popular actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href} className="block">
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                    <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900">{action.title}</div>
                      <div className="text-sm text-gray-500 truncate">{action.description}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Conversations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-indigo-600" />
                  <span>Recent Conversations</span>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/chat">
                    View All
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentConversations.length > 0 ? (
                <div className="space-y-4">
                  {recentConversations.map((conversation) => (
                    <div key={conversation.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {conversation.title}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {conversation.preview}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-400">{conversation.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No conversations yet</p>
                  <Button className="mt-4" asChild>
                    <Link href="/chat">Start Chatting</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommended Schemes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-teal-600" />
                  <span>Recommended for You</span>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/eligibility">
                    Check More
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardTitle>
              <CardDescription>
                Schemes that match your profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendedSchemes.map((scheme) => (
                  <div key={scheme.id} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{scheme.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">{scheme.description}</p>
                      </div>
                      {getStatusBadge(scheme.status)}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline" className="text-xs">
                          {scheme.category}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {scheme.match}% match
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/schemes/${scheme.id}`}>
                          View Details
                          <ArrowRight className="ml-1 w-3 h-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}