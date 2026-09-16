import { AlarmSection } from "@/components/AlarmSection";
import { ClosingSection } from "@/components/ClosingSection";
import { Hero } from "@/components/Hero";
import { NavBar } from "@/components/NavBar";
import { OverviewSection } from "@/components/OverviewSection";
import { PillarsSection } from "@/components/PillarsSection";
import { ProblemSection } from "@/components/ProblemSection";
import { RisksSection } from "@/components/RisksSection";
import { ScrollStage } from "@/components/ScrollStage";
import { SiteFooter } from "@/components/SiteFooter";
import { UseCasesSection } from "@/components/UseCasesSection";

export default function Page() {
  return (
    <>
      <NavBar />
      <main>
        <Hero />
        <ProblemSection />
        <UseCasesSection />
        <ScrollStage />
        <OverviewSection />
        <PillarsSection />
        <AlarmSection />
        <RisksSection />
        <ClosingSection />
      </main>
      <SiteFooter />
    </>
  );
}
