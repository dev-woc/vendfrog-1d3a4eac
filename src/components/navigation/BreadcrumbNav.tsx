import { useLocation, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbNavProps {
  showBackButton?: boolean;
}

export function BreadcrumbNav({ showBackButton = true }: BreadcrumbNavProps) {
  const location = useLocation();
  const navigate = useNavigate();

  // Define route mappings
  const routeMap: Record<string, { title: string; href: string }> = {
    "/": { title: "Home", href: "/" },
    "/dashboard": { title: "Dashboard", href: "/dashboard" },
    "/markets": { title: "Markets", href: "/markets" },
    "/documents": { title: "Documents", href: "/documents" },
  };

  // Generate breadcrumb items based on current path
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const breadcrumbs: { title: string; href: string; isLast: boolean }[] = [];

    // Always start with Dashboard (unless we're on dashboard itself)
    if (location.pathname !== "/dashboard") {
      breadcrumbs.push({
        title: "Dashboard",
        href: "/dashboard",
        isLast: false,
      });
    }

    // Add current page if it's not dashboard
    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      if (routeMap[currentPath] && currentPath !== "/dashboard") {
        breadcrumbs.push({
          title: routeMap[currentPath].title,
          href: currentPath,
          isLast,
        });
      }
    });

    // Mark the last item correctly
    if (breadcrumbs.length > 0) {
      breadcrumbs[breadcrumbs.length - 1].isLast = true;
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on home page or dashboard page
  if (location.pathname === "/" || location.pathname === "/dashboard") {
    return null;
  }

  return (
    <div className="flex items-center gap-4 mb-4">
      {showBackButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      )}
      
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((breadcrumb, index) => (
            <div key={breadcrumb.href} className="flex items-center">
              <BreadcrumbItem>
                {breadcrumb.isLast ? (
                  <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={breadcrumb.href} className="flex items-center gap-1">
                      {breadcrumb.title}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!breadcrumb.isLast && <BreadcrumbSeparator />}
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}