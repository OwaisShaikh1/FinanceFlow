import { Star, Quote, Sparkles } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Small Business Owner",
      company: "StyleHub",
      content:
        "TaxEase made GST filing so simple! I used to spend hours with my CA, now I can do it myself in minutes.",
      rating: 5,
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      name: "Rajesh Kumar",
      role: "Freelancer",
      company: "Digital Marketer",
      content: "The tax calculator is incredibly accurate. Saved me thousands in advance tax planning this year.",
      rating: 5,
      gradient: "from-purple-500 to-pink-600",
    },
    {
      name: "CA Meera Patel",
      role: "Chartered Accountant",
      company: "TaxPro Services",
      content: "Managing 50+ clients is now effortless. The client dashboard and deadline tracking are game-changers.",
      rating: 5,
      gradient: "from-cyan-500 to-blue-600",
    },
  ]

  return (
    <section id="testimonials" className="py-24 px-4 bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #06b6d4 0.5px, transparent 0.5px)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      <div className="absolute top-1/3 left-20 w-96 h-96 bg-blue-300 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-1/3 right-20 w-96 h-96 bg-cyan-300 rounded-full filter blur-3xl opacity-30 animate-pulse delay-1000"></div>

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full px-5 py-2 mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-900">Customer Stories</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-gray-900 leading-tight">
            Trusted by
            <span className="block bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent mt-2">
              Thousands of Users
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            See what our customers say about their experience with our platform. Real stories from real users.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`group relative reveal reveal-delay-${index}`}
            >
              {/* Card */}
              <div className="relative h-full p-8 rounded-3xl bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden">
                
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                <div className="relative">
                  {/* Quote icon */}
                  <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                    <Quote className="h-6 w-6 text-white" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-gray-700 text-lg leading-relaxed mb-8 italic">
                    "{testimonial.content}"
                  </p>

                  {/* Author info */}
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <span className="text-white font-bold text-lg">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {testimonial.role}
                      </div>
                      <div className="text-xs text-gray-500">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shimmer effect on hover */}
                <div aria-hidden className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 rounded-3xl animate-shimmer" style={{ background: "linear-gradient(90deg, rgba(59,130,246,0) 0%, rgba(59,130,246,0.1) 50%, rgba(59,130,246,0) 100%)", backgroundSize: "200% 100%" }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              10,000+
            </div>
            <div className="text-gray-600 font-medium">Happy Customers</div>
          </div>
          <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              4.9/5
            </div>
            <div className="text-gray-600 font-medium">Average Rating</div>
          </div>
          <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
              99.9%
            </div>
            <div className="text-gray-600 font-medium">Accuracy Rate</div>
          </div>
        </div>
      </div>
    </section>
  )
}
