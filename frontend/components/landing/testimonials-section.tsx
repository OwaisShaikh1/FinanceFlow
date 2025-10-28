import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Small Business Owner",
      content:
        "TaxEase made GST filing so simple! I used to spend hours with my CA, now I can do it myself in minutes.",
      rating: 5,
    },
    {
      name: "Rajesh Kumar",
      role: "Freelancer",
      content: "The tax calculator is incredibly accurate. Saved me thousands in advance tax planning this year.",
      rating: 5,
    },
    {
      name: "CA Meera Patel",
      role: "Chartered Accountant",
      content: "Managing 50+ clients is now effortless. The client dashboard and deadline tracking are game-changers.",
      rating: 5,
    },
  ]

  return (
    <section id="testimonials" className="py-20 px-4 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4 text-slate-900">
            Trusted by <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Thousands</span> of Users
          </h2>
          <p className="text-xl text-slate-600 text-pretty max-w-2xl mx-auto">
            See what our customers say about their experience with TaxPro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="group bg-white/80 backdrop-blur-sm border-blue-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/50 hover:scale-105 transition-all duration-300 rounded-2xl overflow-hidden">
              <CardContent className="p-8 relative">
                {/* Quote decoration */}
                <div className="absolute -top-2 -left-2 text-6xl text-blue-100 font-serif">"</div>
                
                <div className="flex items-center mb-4 relative z-10">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500 group-hover:animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                  ))}
                </div>
                
                <p className="text-slate-700 mb-6 text-pretty leading-relaxed italic relative z-10 group-hover:text-slate-900 transition-colors">
                  {testimonial.content}
                </p>
                
                <div className="flex items-center space-x-3 relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-slate-500 group-hover:text-slate-600 transition-colors">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-indigo-50/0 group-hover:from-blue-50/30 group-hover:to-indigo-50/30 transition-all duration-300 pointer-events-none"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
