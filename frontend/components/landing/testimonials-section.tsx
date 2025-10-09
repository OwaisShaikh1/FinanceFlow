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
            <Card key={index} className="bg-white border-blue-200 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-blue-600 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 mb-4 text-pretty">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-slate-900">{testimonial.name}</div>
                  <div className="text-sm text-slate-500">{testimonial.role}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
