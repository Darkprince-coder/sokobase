declare module "lucide-react" {
  import * as React from "react";

  export type LucideProps = React.SVGProps<SVGSVGElement> & {
    size?: number | string;
    strokeWidth?: number | string;
  };

  export const Camera: React.FC<LucideProps>;
  export const X: React.FC<LucideProps>;
  export const ChevronLeft: React.FC<LucideProps>;
  export const ChevronRight: React.FC<LucideProps>;

  export const CircleCheck: React.FC<LucideProps>;
  export const Clock: React.FC<LucideProps>;
  export const CircleX: React.FC<LucideProps>;

  export const ArrowRight: React.FC<LucideProps>;
  export const Target: React.FC<LucideProps>;
  export const ShieldCheck: React.FC<LucideProps>;
  export const Rocket: React.FC<LucideProps>;
  export const MessageCircle: React.FC<LucideProps>;

  export const SearchX: React.FC<LucideProps>;
  export const ListFilter: React.FC<LucideProps>;
  export const Search: React.FC<LucideProps>;
  export const CheckCircle2: React.FC<LucideProps>;

  export const Tag: React.FC<LucideProps>;
  export const MapPinned: React.FC<LucideProps>;
  export const MapPin: React.FC<LucideProps>;
  export const Users: React.FC<LucideProps>;
  export const Sparkles: React.FC<LucideProps>;
  export const HandCoins: React.FC<LucideProps>;

  export const Info: React.FC<LucideProps>;
  export const RefreshCw: React.FC<LucideProps>;
  export const PackagePlus: React.FC<LucideProps>;
  export const ImageOff: React.FC<LucideProps>;
  export const Menu: React.FC<LucideProps>;

  const icons: { [key: string]: React.FC<LucideProps> };
  export default icons;
}
