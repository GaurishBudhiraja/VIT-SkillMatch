'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Phone, MapPin } from 'lucide-react'
import { useState } from 'react'
import { showToast } from '@/lib/toast-utils'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await new Promise(r => setTimeout(r, 1000))
      showToast.success('Message sent!', 'We will get back to you soon')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      showToast.error('Error sending message')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-background to-background/80">
        <div className="container mx-auto px-4 py-12 md:py-20">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Contact Info Cards */}
            <Card className="border-cyan-400/20 bg-gradient-to-br from-cyan-500/5 to-blue-500/5">
              <CardHeader>
                <MapPin className="h-8 w-8 text-cyan-400 mb-2" />
                <CardTitle>Address</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80">
                  VIT Vellore Campus<br />
                  Vellore, Tamil Nadu 632014<br />
                  India
                </p>
              </CardContent>
            </Card>

            <Card className="border-cyan-400/20 bg-gradient-to-br from-cyan-500/5 to-blue-500/5">
              <CardHeader>
                <Phone className="h-8 w-8 text-cyan-400 mb-2" />
                <CardTitle>Phone</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80">
                  +91 (431) 2993 1500<br />
                  +91 9876543210<br />
                  Mon - Fri, 9am - 5pm IST
                </p>
              </CardContent>
            </Card>

            <Card className="border-cyan-400/20 bg-gradient-to-br from-cyan-500/5 to-blue-500/5">
              <CardHeader>
                <Mail className="h-8 w-8 text-cyan-400 mb-2" />
                <CardTitle>Email</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80">
                  support@skillmatch.vit.ac.in<br />
                  careers@skillmatch.vit.ac.in<br />
                  hello@skillmatch.vit.ac.in
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <Card className="border-cyan-400/20 bg-gradient-to-br from-cyan-500/5 to-blue-500/5">
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you shortly</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Name</label>
                      <Input
                        type="text"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                        className="bg-background/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Email</label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="bg-background/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold mb-2 block">Subject</label>
                    <Input
                      type="text"
                      placeholder="Message subject"
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      required
                      className="bg-background/50"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold mb-2 block">Message</label>
                    <textarea
                      placeholder="Your message..."
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      required
                      className="w-full bg-background/50 border border-white/20 rounded-md px-3 py-2 text-sm h-32"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto mt-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: 'How do I create an account?', a: 'Click the Sign Up button and fill in your details. It takes less than 2 minutes!' },
                { q: 'Are all positions on VIT SkillMatch verified?', a: 'Yes, all internship positions are verified by our team and come from established companies.' },
                { q: 'Can I apply to multiple internships?', a: 'Absolutely! You can apply to as many positions as you want and track all applications in one place.' },
                { q: 'Is there a fee to use VIT SkillMatch?', a: 'No, the platform is completely free for all VIT students.' }
              ].map((item, i) => (
                <Card key={i} className="border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg">{item.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/70">{item.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
