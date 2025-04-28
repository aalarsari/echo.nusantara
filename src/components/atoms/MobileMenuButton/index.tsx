import { Bars3Icon } from "@heroicons/react/20/solid";

interface MobileMenuButtonProps {
  onClick: () => void;
}

export const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({
  onClick,
}) => {
  return (
    <div className="block lg:hidden">
      <Bars3Icon onClick={onClick} className="h-6 w-6 text-[#252525]" />
    </div>
  );
};
