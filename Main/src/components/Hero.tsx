
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { ArrowRight, BookOpen, Users, Award } from "lucide-react";
import ThreeCanvas from "./ThreeCanvas";

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (heroRef.current) {
        // Parallax effect for hero background
        heroRef.current.style.backgroundPositionY = `${scrollY * 0.5}px`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      ref={heroRef}
      className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-b from-background to-secondary/30 dark:from-background dark:to-secondary/10 overflow-hidden"
    >
      {/* Background animated shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-blue-400/10 dark:bg-blue-400/5 rounded-full animate-float blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[250px] h-[250px] bg-purple-400/10 dark:bg-purple-400/5 rounded-full animate-float [animation-delay:2s] blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-[200px] h-[200px] bg-primary/10 dark:bg-primary/5 rounded-full animate-float [animation-delay:4s] blur-3xl" />
      </div>

      <div className="container px-4 sm:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Hero content */}
          <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-block animate-fade-in [animation-delay:0.2s] opacity-0 animate-fill-forwards">
              <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
                Next Generation Learning
              </span>
            </div>
            
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in [animation-delay:0.4s] opacity-0 animate-fill-forwards">
              Revolutionize Your 
              <span className="text-gradient block mt-2">Educational Experience</span>
            </h1>
            
            <p className="mt-6 text-lg text-muted-foreground max-w-xl animate-fade-in [animation-delay:0.6s] opacity-0 animate-fill-forwards">
              Immersive learning platform with interactive 3D content, 
              AI-powered assistance, and real-time collaboration tools 
              that transform how students learn.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start animate-fade-in [animation-delay:0.8s] opacity-0 animate-fill-forwards">
              <Button asChild size="lg" className="rounded-full px-6">
                <NavLink to="/login?signup=true">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </NavLink>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-6">
                <NavLink to="/#features">
                  Explore Features
                </NavLink>
              </Button>
            </div>
            
            {/* Key stats */}
            <div className="mt-12 grid grid-cols-3 gap-8 w-full animate-fade-in [animation-delay:1s] opacity-0 animate-fill-forwards">
              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-3">
                  <BookOpen size={20} />
                </div>
                <div className="text-2xl font-bold">300+</div>
                <div className="text-sm text-muted-foreground">Courses</div>
              </div>
              
              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-3">
                  <Users size={20} />
                </div>
                <div className="text-2xl font-bold">20k+</div>
                <div className="text-sm text-muted-foreground">Students</div>
              </div>
              
              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-3">
                  <Award size={20} />
                </div>
                <div className="text-2xl font-bold">98%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>
          
          {/* Hero image - replaced with interactive 3D canvas */}
          <div className="lg:w-1/2 animate-fade-in [animation-delay:0.8s] opacity-0 animate-fill-forwards relative">
            <div className="glass-panel rounded-3xl p-1 overflow-hidden w-full max-w-[600px] mx-auto shadow-xl">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
                {/* Three.js canvas */}
                <div className="absolute inset-0">
                  <ThreeCanvas />
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-xl animate-pulse" />
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-blue-400/10 rounded-full blur-xl animate-pulse [animation-delay:2s]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
