
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle theme toggle
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Features", path: "/#features" },
    { label: "Pricing", path: "/#pricing" },
    { label: "About", path: "/#about" },
  ];

  return (
    <header
      className={`w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/70 dark:bg-black/70 backdrop-blur-xl shadow-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <NavLink 
          to="/" 
          className="flex items-center gap-2 font-bold text-2xl"
        >
          <span className="text-gradient">Learner's Hub`</span>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `relative text-sm font-medium transition-all duration-200 
                after:content-[''] after:absolute after:w-full after:h-0.5 
                after:bg-primary after:bottom-0 after:left-0 
                after:scale-x-0 after:origin-bottom-right after:transition-transform 
                hover:after:scale-x-100 hover:after:origin-bottom-left
                ${isActive ? "text-primary after:scale-x-100" : "text-foreground"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </Button>

          <div className="hidden md:flex items-center gap-2">
            <Button asChild variant="ghost">
              <NavLink to="/login">Sign In</NavLink>
            </Button>
            <Button asChild>
              <NavLink to="/login?signup=true">Sign Up</NavLink>
            </Button>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden absolute w-full bg-background/95 dark:bg-background/95 backdrop-blur-lg shadow-lg transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "max-h-[500px] py-4" : "max-h-0 overflow-hidden"
        }`}
      >
        <nav className="container flex flex-col gap-4 pb-4">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-primary/5"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          <div className="flex flex-col gap-2 mt-2 px-4">
            <Button asChild variant="outline" className="w-full">
              <NavLink to="/login">Sign In</NavLink>
            </Button>
            <Button asChild className="w-full">
              <NavLink to="/login?signup=true">Sign Up</NavLink>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
