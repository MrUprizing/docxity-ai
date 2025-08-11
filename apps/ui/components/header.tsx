import { Separator } from "@/components/ui/separator";

interface HeaderSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <>
      <header className="space-y-0.5 px-8 py-5 w-full min-h-[100px] max-w-[76rem] mx-auto">
        <h1 className="tracking-tight text-4xl ">{title}</h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </header>
      <Separator />
      <section className="px-8 py-7 w-full min-h-[200px] max-w-[76rem] mx-auto">
        {children}
      </section>
    </>
  );
};
export default HeaderSection;
