
import { useEffect, useRef } from "react";
import { 
  Cpu, 
  BookText, 
  LineChart, 
  MessageSquare, 
  UserCog,
  FileCheck,
  Clock,
  Layers
} from "lucide-react";

const Features = () => {
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    featureRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    
    return () => observer.disconnect();
  }, []);
  
  const features = [
    {
      icon: <BookText />,
      title: "Interactive Learning Materials",
      description: "Access dynamic content with 3D models, animations, and interactive elements that make learning engaging and effective."
    },
    {
      icon: <LineChart />,
      title: "Progress Tracking",
      description: "Visual dashboards show your learning progress, achievements, and areas for improvement with detailed analytics."
    },
    {
      icon: <MessageSquare />,
      title: "AI Study Assistant",
      description: "Get instant help with an AI-powered assistant that answers questions and provides personalized learning guidance."
    },
    {
      icon: <UserCog />,
      title: "Role-Based Access",
      description: "Tailored experiences for students, trainers, and administrators with customized dashboards and tools."
    },
    {
      icon: <Cpu />,
      title: "Advanced 3D Visualizations",
      description: "Complex concepts simplified through interactive 3D models that you can manipulate and explore."
    },
    {
      icon: <FileCheck />,
      title: "Assignments & Feedback",
      description: "Submit assignments directly through the platform and receive detailed feedback from instructors."
    },
    {
      icon: <Clock />,
      title: "Real-time Collaboration",
      description: "Work together with peers and instructors through integrated real-time communication tools."
    },
    {
      icon: <Layers />,
      title: "Multi-format Content",
      description: "Access learning materials in various formats including videos, documents, presentations, and interactive simulations."
    }
  ];
  
  return (
    <section id="features" className="py-24 bg-secondary/30 dark:bg-secondary/10">
      <div className="container px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold">
            Everything you need for an exceptional
            <span className="text-gradient block mt-2">learning experience</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Our platform combines cutting-edge technology with effective educational principles 
            to create a powerful and engaging learning environment.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => (featureRefs.current[index] = el)}
              className="relative animate-on-scroll hover-lift bg-card rounded-2xl p-6 flex flex-col"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-3 bg-primary/10 text-primary w-14 h-14 rounded-xl flex items-center justify-center mb-5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
              
              {/* Decorative gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-b-2xl opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
