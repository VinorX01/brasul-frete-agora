
import { useIsMobile } from "@/hooks/useIsMobile";
import BackButton from "./BackButton";

interface MobilePageWrapperProps {
  children: React.ReactNode;
  showBackButton?: boolean;
}

const MobilePageWrapper = ({ children, showBackButton = true }: MobilePageWrapperProps) => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f4f4fc' }}>
      <div className="p-4">
        {showBackButton && <BackButton />}
        {children}
      </div>
    </div>
  );
};

export default MobilePageWrapper;
