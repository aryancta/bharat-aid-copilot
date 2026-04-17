import React from 'react'
import Link from 'next/link'
import { Hero } from '@/components/hero'
import { FeatureCard } from '@/components/feature-card'
import { StatCard } from '@/components/stat-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  MessageCircle, 
  CheckCircle, 
  FileText, 
  Shield, 
  Globe, 
  Zap, 
  Users, 
  BookOpen,
  ArrowRight,
  TrendingUp,
  Target,
  Languages,
  Database,
  Cpu,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      icon: MessageCircle,
      title: 'Multilingual AI Chat',
      description: 'Ask questions about government schemes in English or 9 Indian languages. Get accurate, source-backed answers with citations and confidence scores.',
      highlight: true
    },
    {
      icon: CheckCircle,
      title: 'Smart Eligibility Checker',
      description: 'Complete a guided form to instantly discover which schemes you qualify for, with detailed explanations and missing requirements.',
    },
    {
      icon: FileText,
      title: 'Application Checklists',
      description: 'Get personalized, step-by-step checklists with required documents, application process, and expert tips for successful submissions.',
    }
  ]

  const trustFeatures = [
    {
      icon: Shield,
      title: 'Official Source Grounding',
      description: 'Every answer is backed by official government documents, PDFs, and verified FAQs with transparent citations.'
    },
    {
      icon: Database,
      title: 'Databricks-Powered Pipeline',
      description: 'Advanced data ingestion and vector search built on Databricks for accurate information retrieval.'
    },
    {
      icon: Cpu,
      title: 'MLflow-Tracked Evaluation',
      description: 'Continuous quality monitoring with benchmark testing and performance metrics tracking.'
    }
  ]

  const howItWorks = [
    {
      step: 1,
      title: 'Ask or Explore',
      description: 'Start a conversation with our AI assistant or browse schemes by category',
      icon: MessageCircle
    },
    {
      step: 2,
      title: 'Check Eligibility',
      description: 'Use our guided wizard to match your profile against scheme requirements',
      icon: Target
    },
    {
      step: 3,
      title: 'Get Your Checklist',
      description: 'Receive personalized application guidance with documents and steps',
      icon: CheckCircle2
    }
  ]

  const impactStats = [
    {
      title: 'Schemes Indexed',
      value: '12',
      subtitle: 'Across 8 categories',
      icon: BookOpen,
      variant: 'primary' as const,
      trend: {
        value: 25,
        label: 'Updated this quarter',
        type: 'up' as const
      }
    },
    {
      title: 'Languages Supported',
      value: '10',
      subtitle: 'Including regional languages',
      icon: Languages,
      variant: 'success' as const
    },
    {
      title: 'Retrieval Accuracy',
      value: '85%',
      subtitle: 'Based on benchmark testing',
      icon: TrendingUp,
      variant: 'default' as const
    },
    {
      title: 'Citation Coverage',
      value: '92%',
      subtitle: 'Answers with source references',
      icon: Shield,
      variant: 'warning' as const
    }
  ]

  const featuredSchemes = [
    {
      name: 'PM-KISAN Samman Nidhi',
      category: 'Agriculture',
      description: 'Financial benefit of Rs. 6000 per year for landholding farmers',
      beneficiaries: '11.77 Cr+ Farmers',
      mode: 'Online'
    },
    {
      name: 'Ayushman Bharat PM-JAY',
      category: 'Health',
      description: 'Health insurance coverage of Rs. 5 lakh per family per year',
      beneficiaries: '12+ Cr Families',
      mode: 'Both'
    },
    {
      name: 'National Scholarship Portal',
      category: 'Education',
      description: 'Comprehensive scholarship platform for students',
      beneficiaries: '4+ Cr Students',
      mode: 'Online'
    }
  ]

  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Feature Highlights */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 px-3 py-1">
              Key Features
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Personalized Government Scheme Assistance
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform combines multilingual support, intelligent matching, 
              and official source verification to simplify your scheme discovery journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                highlight={feature.highlight}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Technology */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 px-3 py-1 border-indigo-200 text-indigo-700">
              Powered by Advanced Technology
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Built for Trust & Accuracy
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every response is grounded in official sources with transparent citations, 
              powered by enterprise-grade data infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trustFeatures.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 px-3 py-1">
              Simple Process
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How BharatAid Copilot Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get from confusion to clarity in just three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="relative">
                <Card className="border-2 border-gray-200 hover:border-indigo-300 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="step-indicator active mx-auto mb-4 text-lg font-bold">
                      {step.step}
                    </div>
                    <step.icon className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
                
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 civic-gradient text-white">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 px-3 py-1 bg-white/20 text-white border-white/30">
              Impact Metrics
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              Measurable Results & Performance
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Built with rigorous evaluation and continuous improvement for reliable assistance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactStats.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
                <div className="flex items-center space-x-3 mb-3">
                  <stat.icon className="w-6 h-6 text-white" />
                  <h3 className="text-sm font-medium text-white/80 uppercase tracking-wide">
                    {stat.title}
                  </h3>
                </div>
                <div className="flex items-baseline space-x-2 mb-1">
                  <span className="text-3xl font-bold text-white">
                    {stat.value}
                  </span>
                  {stat.trend && (
                    <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                      +{stat.trend.value}%
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-white/70">
                  {stat.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Schemes */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <Badge variant="outline" className="mb-4 px-3 py-1 border-indigo-200 text-indigo-700">
                Popular Schemes
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Featured Government Programs
              </h2>
              <p className="text-lg text-gray-600">
                Explore some of the most impactful schemes available to Indian citizens
              </p>
            </div>
            <Button variant="outline" asChild className="hidden md:flex">
              <Link href="/schemes">
                View All Schemes
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredSchemes.map((scheme, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {scheme.category}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        scheme.mode === 'Online' ? 'border-green-200 text-green-700' :
                        scheme.mode === 'Both' ? 'border-blue-200 text-blue-700' :
                        'border-gray-200 text-gray-700'
                      }`}
                    >
                      {scheme.mode}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    {scheme.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">
                    {scheme.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      <Users className="w-4 h-4 inline mr-1" />
                      {scheme.beneficiaries}
                    </span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/schemes/${scheme.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                        Learn More
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Button variant="outline" asChild>
              <Link href="/schemes">
                View All Schemes
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Find Your Perfect Government Scheme?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Start with our eligibility checker or chat with our AI assistant. 
              Get personalized guidance in minutes, not hours.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="civic-gradient hover:opacity-90 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/eligibility">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Check Your Eligibility
                </Link>
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                asChild
                className="border-2 border-indigo-200 hover:bg-indigo-50 text-indigo-700 font-semibold px-8 py-3 rounded-xl"
              >
                <Link href="/chat">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Start Chatting
                </Link>
              </Button>
            </div>

            <p className="text-sm text-gray-500 mt-6">
              Free to use • No registration required • Source citations included
            </p>
          </div>
        </div>
      </section>
    </>
  )
}