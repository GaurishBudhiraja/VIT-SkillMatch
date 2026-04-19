'use client'

import Link from 'next/link'
import { Github, Linkedin } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 bg-background/50 backdrop-blur-xl glass-effect">
      <div className="container mx-auto px-4 py-12">
        {/* About Section */}
        <div id="footer-about" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">About VIT SkillMatch</h2>
          <p className="text-foreground/70 max-w-2xl mb-4">
            VIT SkillMatch is an AI-powered internship matching platform designed for VIT Vellore students. We connect talented students with internship opportunities from top companies by matching their skills, interests, and academic profile with suitable positions.
          </p>
          <p className="text-foreground/70 max-w-2xl">
            Our intelligent filtering system ensures you see only internships that match your CGPA requirements and technical skills, saving you time and helping you find opportunities perfectly aligned with your career goals.
          </p>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-white/5">
          {/* Brand Section */}
          <div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
              VIT SkillMatch
            </h3>
            <p className="text-sm text-foreground/60">
              Smart internship matching for VIT students
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-foreground/60 hover:text-cyan-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-foreground/60 hover:text-cyan-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/browse" className="text-sm text-foreground/60 hover:text-cyan-400 transition-colors">
                  Browse Internships
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-foreground/60 hover:text-cyan-400 transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-foreground/60 hover:text-cyan-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-foreground/60 hover:text-cyan-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-cyan-400 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-cyan-400 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div id="footer-contact" className="my-12 py-8 border-y border-white/5 scroll-mt-20">
          <h3 className="text-xl font-bold mb-6 gradient-text">Contact Us</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-glow glass-effect p-6 rounded-lg">
              <h4 className="font-semibold text-cyan-400 mb-2">Address</h4>
              <p className="text-sm text-foreground/70">VIT Vellore Campus<br/>Vellore, Tamil Nadu 632014<br/>India</p>
            </div>
            <div className="card-glow glass-effect p-6 rounded-lg">
              <h4 className="font-semibold text-cyan-400 mb-2">Email</h4>
              <p className="text-sm text-foreground/70"><a href="mailto:support@vitskilmatch.com" className="hover:text-cyan-400 transition-colors">support@vitskillmatch.com</a></p>
            </div>
            <div className="card-glow glass-effect p-6 rounded-lg">
              <h4 className="font-semibold text-cyan-400 mb-2">Phone</h4>
              <p className="text-sm text-foreground/70"><a href="tel:+914316-226-4000" className="hover:text-cyan-400 transition-colors">+91 (431) 226-4000</a></p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-8">
          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-foreground/60">
              © {currentYear} VIT SkillMatch. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-foreground/60 hover:text-cyan-400 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-foreground/60 hover:text-cyan-400 transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="text-foreground/60 hover:text-cyan-400 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
