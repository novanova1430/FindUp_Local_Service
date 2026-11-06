import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Home, ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BackNavigationBarProps {
  title?: string;
  fallbackPath?: string;
  breadcrumbs?: BreadcrumbItem[];
  showBreadcrumbs?: boolean;
}

export const BackNavigationBar: React.FC<BackNavigationBarProps> = ({
  title,
  fallbackPath,
  breadcrumbs,
  showBreadcrumbs = true,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else if (fallbackPath) {
      navigate(fallbackPath);
    } else {
      // Intelligently infer fallback parent
      const segments = location.pathname.split('/').filter(Boolean);
      if (segments.length <= 1) {
        navigate('/');
      } else {
        segments.pop();
        navigate(`/${segments.join('/')}`);
      }
    }
  };

  // Generate dynamic breadcrumb segments if none provided
  const dynamicBreadcrumbs: BreadcrumbItem[] = breadcrumbs || (() => {
    const segments = location.pathname.split('/').filter(Boolean);
    const items: BreadcrumbItem[] = [{ label: 'Home', to: '/' }];

    let accPath = '';
    segments.forEach((seg, index) => {
      accPath += `/${seg}`;
      const isLast = index === segments.length - 1;
      const formattedLabel = seg
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());

      items.push({
        label: isLast && title ? title : formattedLabel,
        to: isLast ? undefined : accPath,
      });
    });

    return items;
  })();

  return (
    <div className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs sticky top-16 z-25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Previous Page Back Button */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-[#473C33] bg-[#FEC868] hover:bg-[#FDA769] border border-amber-300 shadow-2xs hover:shadow-sm transition-all duration-200 cursor-pointer group shrink-0 active:scale-95"
            aria-label="Back to previous page"
            title="Go back to previous page (முந்தைய பக்கம்)"
          >
            <ArrowLeft className="w-4 h-4 text-[#473C33] group-hover:-translate-x-0.5 transition-all duration-200" />
            <span>Back</span>
            <span className="hidden sm:inline text-[10px] opacity-75 font-normal border-l border-[#473C33]/30 pl-1.5">
              Previous
            </span>
          </button>

          {/* Breadcrumb Trail */}
          {showBreadcrumbs && (
            <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 truncate">
              <Link
                to="/"
                className="hover:text-blue-600 p-1 rounded-md hover:bg-slate-100 transition-colors shrink-0"
                title="Go to Home"
              >
                <Home className="w-3.5 h-3.5" />
              </Link>

              {dynamicBreadcrumbs.slice(1).map((crumb, idx) => {
                const isLast = idx === dynamicBreadcrumbs.length - 2;
                return (
                  <React.Fragment key={idx}>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    {crumb.to && !isLast ? (
                      <Link
                        to={crumb.to}
                        className="hover:text-blue-600 truncate max-w-[140px] font-medium transition-colors"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="font-semibold text-slate-800 truncate max-w-[200px]" aria-current="page">
                        {crumb.label}
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
          )}
        </div>

        {/* Right: Quick Home shortcut */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/"
            className="text-[11px] font-semibold text-slate-500 hover:text-blue-600 hover:bg-blue-50/80 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Main Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
