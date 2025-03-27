
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import { useAuth } from '@/lib/auth-context';
import { 
  Home, 
  UserRound, 
  Users, 
  FileText, 
  BookOpen, 
  ClipboardList, 
  LogOut,
  Settings
} from 'lucide-react';

export function AppSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  if (!user) return null;
  
  // Define navigation items based on user role
  const getNavItems = () => {
    const commonItems = [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: Home,
      },
      {
        title: 'Profile',
        href: '/profile',
        icon: UserRound,
      },
    ];
    
    const adminItems = [
      {
        title: 'User Management',
        href: '/users',
        icon: Users,
      },
      {
        title: 'Batch Management',
        href: '/batches',
        icon: ClipboardList,
      },
      {
        title: 'Settings',
        href: '/settings',
        icon: Settings,
      },
    ];
    
    const trainerItems = [
      {
        title: 'My Batches',
        href: '/batches',
        icon: ClipboardList,
      },
      {
        title: 'Presentations',
        href: '/presentations',
        icon: FileText,
      },
      {
        title: 'Assignments',
        href: '/assignments',
        icon: BookOpen,
      },
    ];
    
    const studentItems = [
      {
        title: 'Presentations',
        href: '/presentations',
        icon: FileText,
      },
      {
        title: 'Assignments',
        href: '/assignments',
        icon: BookOpen,
      },
    ];
    
    switch (user.role) {
      case 'admin':
        return [...commonItems, ...adminItems];
      case 'trainer':
        return [...commonItems, ...trainerItems];
      case 'student':
        return [...commonItems, ...studentItems];
      default:
        return commonItems;
    }
  };
  
  const navItems = getNavItems();
  
  const isActive = (href: string) => {
    if (href === '/dashboard' && location.pathname === '/dashboard') {
      return true;
    }
    return location.pathname.startsWith(href) && href !== '/dashboard';
  };

  return (
    <Sidebar>
      <SidebarContent>
        <div className="px-6 py-4">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 rounded-full bg-primary"></div>
            <div>
              <h3 className="font-medium text-sm">Course Portal</h3>
              <p className="text-xs text-muted-foreground">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
            </div>
          </div>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild className={cn(
                    isActive(item.href) && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}>
                    <Link to={item.href} className="flex items-center">
                      <item.icon className="w-5 h-5 mr-3" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <div className="px-6 pt-6 pb-0">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <button 
                  onClick={logout} 
                  className="flex items-center w-full text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  <span>Log out</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
