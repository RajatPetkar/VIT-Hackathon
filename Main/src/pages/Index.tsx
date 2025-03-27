
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import { Button } from "@/components/ui/button";
import { PlusCircle, BookOpen, Users, Medal, ArrowRight } from "lucide-react";

const Index = () => {
  // Initialize scroll animations
  useEffect(() => {
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      
      elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight * 0.85) {
          element.classList.add('visible');
        }
      });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on page load
    
    return () => window.removeEventListener('scroll', animateOnScroll);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        <Features />
        
        {/* How It Works Section */}
        <section className="py-24">
          <div className="container px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                How It Works
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold">
                Learning reimagined for the 
                <span className="text-gradient block mt-2">digital age</span>
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                Our platform combines advanced technology with proven educational methods
                to create an immersive learning experience like no other.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              {[
                {
                  icon: <PlusCircle size={32} />,
                  title: "Create Your Account",
                  description: "Sign up as a student, trainer, or administrator and access your personalized dashboard."
                },
                {
                  icon: <BookOpen size={32} />,
                  title: "Access Course Materials",
                  description: "Browse and interact with a wide range of learning materials in multiple formats."
                },
                {
                  icon: <Medal size={32} />,
                  title: "Track Your Progress",
                  description: "Monitor your learning journey with detailed analytics and achievement badges."
                }
              ].map((step, index) => (
                <div 
                  key={index} 
                  className="animate-on-scroll flex flex-col items-center text-center"
                >
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {step.icon}
                    </div>
                    {index < 2 && (
                      <div className="hidden md:block absolute top-8 left-full w-full border-t-2 border-dashed border-primary/30" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-24 bg-secondary/30 dark:bg-secondary/10">
          <div className="container px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                Testimonials
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold">What our users say</h2>
              <p className="mt-6 text-lg text-muted-foreground">
                Discover how EduVerse has transformed learning experiences for students and educators alike.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  role: "Computer Science Student",
                  image: "https://i.pravatar.cc/150?img=32",
                  content: "The 3D interactive models helped me understand complex algorithms in ways that traditional textbooks never could. A game-changer for visual learners!"
                },
                {
                  name: "David Chen",
                  role: "Physics Instructor",
                  image: "https://i.pravatar.cc/150?img=12",
                  content: "As an educator, I can now create immersive learning experiences that bring physics concepts to life. My students' engagement has increased dramatically."
                },
                {
                  name: "Maya Patel",
                  role: "Medical Student",
                  image: "https://i.pravatar.cc/150?img=29",
                  content: "The AR anatomy models allowed me to explore human anatomy in incredible detail. This platform has revolutionized my study methods completely."
                }
              ].map((testimonial, index) => (
                <div 
                  key={index} 
                  className="animate-on-scroll glass-panel rounded-2xl p-6 hover-lift"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="italic text-muted-foreground">{testimonial.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/10 dark:from-primary/10 dark:to-secondary/20" />
          
          <div className="container px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto bg-card rounded-3xl p-8 md:p-12 shadow-xl glass-panel">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Ready to transform your learning experience?</h2>
                  <p className="text-muted-foreground mb-8">
                    Join thousands of students and educators already using our platform to achieve their educational goals.
                  </p>
                  <Button asChild size="lg" className="rounded-full px-6">
                    <a href="/login?signup=true">
                      Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
                
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-52 h-52 rounded-full bg-primary/30 absolute -top-6 -right-6 blur-3xl animate-pulse" />
                    <div className="w-40 h-40 rounded-full bg-blue-400/30 absolute -bottom-8 -left-8 blur-3xl animate-pulse [animation-delay:2s]" />
                    
                    <div className="relative z-10 flex items-center justify-center">
                      <div className="text-center">
                        <div className="flex gap-4 justify-center mb-4">
                          <div className="w-20 h-20 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                            <Users size={32} className="text-primary" />
                          </div>
                          <div className="w-20 h-20 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                            <BookOpen size={32} className="text-primary" />
                          </div>
                        </div>
                        <div className="w-20 h-20 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center mx-auto">
                          <Medal size={32} className="text-primary" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="py-12 bg-secondary dark:bg-secondary/20">
          <div className="container px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="col-span-2 md:col-span-1">
                <h3 className="text-xl font-bold mb-4">EduVerse</h3>
                <p className="text-muted-foreground mb-4">
                  Revolutionizing educational experiences through immersive technology and innovative learning methods.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Platform</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Courses</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Features</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Pricing</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-primary">About Us</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Careers</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Terms of Service</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} EduVerse. All rights reserved.
              </p>
              
              <div className="flex gap-4 mt-4 md:mt-0">
                <a href="#" className="text-muted-foreground hover:text-primary">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                
                <a href="#" className="text-muted-foreground hover:text-primary">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                
                <a href="#" className="text-muted-foreground hover:text-primary">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
