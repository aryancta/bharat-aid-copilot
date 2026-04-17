'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { SUPPORTED_LANGUAGES } from '@/types'
import { 
  MessageCircle, 
  CheckCircle, 
  Search, 
  BarChart3, 
  Info, 
  Github, 
  Globe,
  Menu,
  X
} from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

interface SiteHeaderProps {
  currentLanguage?: string
  onLanguageChange?: (language: string) => void
}

export function SiteHeader({ currentLanguage = 'en', onLanguageChange }: SiteHeaderProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const navigation = [
    {
      name: 'Chat Assistant',
      href: '/chat',
      icon: MessageCircle,
      description: 'Ask questions about government schemes'
    },
    {
      name: 'Check Eligibility',
      href: '/eligibility',
      icon: CheckCircle,
      description: 'Find schemes you qualify for'
    },
    {
      name: 'Browse Schemes',
      href: '/schemes',
      icon: Search,
      description: 'Explore all available schemes'
    },
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: BarChart3,
      description: 'Your personalized dashboard'
    }
  ]

  const isActive = (href: string) => {
    if (href === '/' && pathname === '/') return true
    if (href !== '/' && pathname.startsWith(href)) return true
    return false
  }

  const currentLang = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg civic-gradient text-white">
            <span className="text-sm font-bold">BA</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-indigo-900">BharatAid</span>
            <span className="text-xs text-gray-600 -mt-1">Copilot</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Services</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[600px] grid-cols-2 gap-3 p-4">
                  {navigation.map((item) => (
                    <ListItem
                      key={item.name}
                      title={item.name}
                      href={item.href}
                      className={isActive(item.href) ? 'bg-indigo-50 border-indigo-200' : ''}
                    >
                      <div className="flex items-start space-x-2">
                        <item.icon className="h-4 w-4 mt-0.5 text-indigo-600" />
                        <span className="text-sm text-gray-600">{item.description}</span>
                      </div>
                    </ListItem>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/evaluation" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Evaluation
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/about" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <Info className="mr-2 h-4 w-4" />
                  About
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Globe className="mr-2 h-4 w-4" />
                <span className="min-w-[50px] text-left">
                  {currentLang?.nativeName || 'English'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {SUPPORTED_LANGUAGES.map((language) => (
                <DropdownMenuItem
                  key={language.code}
                  onClick={() => onLanguageChange?.(language.code)}
                  className={cn(
                    'flex items-center justify-between cursor-pointer',
                    currentLanguage === language.code && 'bg-indigo-50'
                  )}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{language.label}</span>
                    <span className="text-sm text-gray-500">{language.nativeName}</span>
                  </div>
                  {currentLanguage === language.code && (
                    <Badge variant="secondary" className="text-xs">
                      Active
                    </Badge>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* GitHub Link */}
          <Button variant="ghost" size="sm" asChild>
            <Link href="https://github.com/aryancta/bharat-aid-copilot" target="_blank">
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub Repository</span>
            </Link>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center space-x-3 rounded-lg p-3 text-sm font-medium transition-colors',
                      isActive(item.href)
                        ? 'bg-indigo-100 text-indigo-900'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <div className="flex flex-col">
                      <span>{item.name}</span>
                      <span className="text-xs text-gray-500">{item.description}</span>
                    </div>
                  </Link>
                ))}

                <div className="border-t pt-4">
                  <Link
                    href="/evaluation"
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center space-x-3 rounded-lg p-3 text-sm font-medium transition-colors',
                      isActive('/evaluation')
                        ? 'bg-indigo-100 text-indigo-900'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    <BarChart3 className="h-5 w-5" />
                    <span>Evaluation Dashboard</span>
                  </Link>

                  <Link
                    href="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center space-x-3 rounded-lg p-3 text-sm font-medium transition-colors',
                      isActive('/about')
                        ? 'bg-indigo-100 text-indigo-900'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    <Info className="h-5 w-5" />
                    <span>About & Methodology</span>
                  </Link>
                </div>

                {/* Mobile Language Selector */}
                <div className="border-t pt-4">
                  <div className="text-sm font-medium text-gray-900 mb-2">Language</div>
                  <div className="grid grid-cols-2 gap-2">
                    {SUPPORTED_LANGUAGES.slice(0, 6).map((language) => (
                      <Button
                        key={language.code}
                        variant={currentLanguage === language.code ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          onLanguageChange?.(language.code)
                          setMobileMenuOpen(false)
                        }}
                        className="text-xs"
                      >
                        {language.nativeName}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & { title: string }
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          href={href || '#'}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground border border-transparent',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})