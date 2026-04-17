import React from 'react'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  Github, 
  MessageCircle, 
  CheckCircle, 
  Search, 
  BarChart3, 
  Info,
  AlertTriangle,
  ExternalLink
} from 'lucide-react'

export function SiteFooter() {
  const currentYear = new Date().getFullYear()

  const links = {
    services: [
      { name: 'Chat Assistant', href: '/chat', icon: MessageCircle },
      { name: 'Eligibility Checker', href: '/eligibility', icon: CheckCircle },
      { name: 'Scheme Explorer', href: '/schemes', icon: Search },
      { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    ],
    resources: [
      { name: 'Evaluation Dashboard', href: '/evaluation', icon: BarChart3 },
      { name: 'About & Methodology', href: '/about', icon: Info },
      { name: 'GitHub Repository', href: 'https://github.com/aryancta/bharat-aid-copilot', icon: Github, external: true },
    ],
    government: [
      { name: 'MyGov.in', href: 'https://www.mygov.in', external: true },
      { name: 'Digital India', href: 'https://digitalindia.gov.in', external: true },
      { name: 'Scholarships Portal', href: 'https://scholarships.gov.in', external: true },
      { name: 'PM-KISAN Portal', href: 'https://pmkisan.gov.in', external: true },
    ]
  }

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="container py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg civic-gradient text-white">
                <span className="text-sm font-bold">BA</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-indigo-900">BharatAid</span>
                <span className="text-xs text-gray-600 -mt-1">Copilot</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Find the right government scheme, check eligibility, and get step-by-step help in your language.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                12+ Schemes Indexed
              </Badge>
              <Badge variant="secondary" className="text-xs">
                10 Languages
              </Badge>
              <Badge variant="secondary" className="text-xs">
                AI-Powered
              </Badge>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Services</h3>
            <ul className="space-y-2">
              {links.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <link.icon className="h-3 w-3" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Resources</h3>
            <ul className="space-y-2">
              {links.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <link.icon className="h-3 w-3" />
                    <span>{link.name}</span>
                    {link.external && <ExternalLink className="h-3 w-3" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Government Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Official Portals</h3>
            <ul className="space-y-2">
              {links.government.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Disclaimer Section */}
        <div className="space-y-4">
          <div className="flex items-start space-x-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm space-y-2">
              <p className="font-medium text-yellow-800">Important Disclaimer</p>
              <p className="text-yellow-700">
                BharatAid Copilot is a hackathon demonstration project. While we strive for accuracy, 
                please verify all scheme information, eligibility criteria, and application processes 
                on official government websites before applying. This tool is for informational purposes only.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500">
            <div>
              <p className="font-medium text-gray-700 mb-1">Data Sources</p>
              <p>Information sourced from official government portals, scheme guidelines, and public FAQs. Last updated: January 2024.</p>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-1">Technology Stack</p>
              <p>Built with Next.js, TypeScript, Tailwind CSS, SQLite, and powered by retrieval-augmented generation for accurate responses.</p>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>© {currentYear} BharatAid Copilot</span>
            <Separator orientation="vertical" className="h-4" />
            <span>Hackathon Project</span>
            <Separator orientation="vertical" className="h-4" />
            <span>Built by Aryan Choudhary</span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="https://github.com/aryancta/bharat-aid-copilot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-indigo-600 transition-colors duration-200 flex items-center space-x-1"
            >
              <Github className="h-4 w-4" />
              <span>View Source Code</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}