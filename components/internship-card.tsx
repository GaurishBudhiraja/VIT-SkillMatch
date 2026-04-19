import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Briefcase, DollarSign, Calendar } from 'lucide-react'
import Link from 'next/link'

interface InternshipCardProps {
  id: string
  title: string
  company: string
  location: string
  duration: number
  stipend?: number
  skills: string[]
  description: string
  minCgpa: number
  openings: number
}

export function InternshipCard({
  id,
  title,
  company,
  location,
  duration,
  stipend,
  skills,
  description,
  minCgpa,
  openings,
}: InternshipCardProps) {
  return (
    <div className="border border-border rounded-lg p-6 hover:shadow-lg hover:border-primary/50 transition-all">
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{company}</p>
        </div>

        {/* Description */}
        <p className="text-sm text-foreground line-clamp-2">{description}</p>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{duration} weeks</span>
          </div>
          {stipend && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>₹{stipend.toLocaleString()}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Briefcase className="h-4 w-4" />
            <span>{openings} opening{openings !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Required Skills</p>
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {skills.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{skills.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* CGPA Requirement */}
        <div className="text-xs text-muted-foreground">
          Minimum CGPA: <span className="font-semibold">{minCgpa.toFixed(2)}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <Button asChild className="flex-1">
            <Link href={`/student/internship/${id}`}>View Details</Link>
          </Button>
          <Button variant="outline" className="flex-1">
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
