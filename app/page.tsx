import { SiteNavigation } from "@/components/navigation/site-navigation";
import { HeroSection } from "@/components/hero/hero-section";
import { Marquee } from "@/components/ui/marquee";
import { EmployeeGallery } from "@/components/products/employee-gallery";
import { HowItWorks } from "@/components/how-it-works/how-it-works";
import { WhyLexi } from "@/components/why-lexi/why-lexi";
import { UseCases } from "@/components/use-cases/use-cases";
import { AboutSection } from "@/components/about/about-section";
import { Pricing } from "@/components/pricing/pricing";
import { DemoForm } from "@/components/contact/demo-form";
import { SiteFooter } from "@/components/footer/site-footer";

/**
 * One continuous narrative:
 * curiosity → understanding → proof → trust → value → purchase intent.
 */
export default function Home() {
  return (
    <>
      <SiteNavigation />
      <main id="main">
        <HeroSection />

        {/* ticker — the pulse between the hero and the workforce */}
        <div className="border-b border-line bg-paper-2/70 py-3.5">
          <Marquee
            className="meta text-grey"
            speed={38}
            items={[
              <span key="a" className="text-ink-2">NINE AI EMPLOYEES</span>,
              <span key="b" className="grad-spectral display-md text-[1.05rem] tracking-normal uppercase">One Fleen runtime</span>,
              <span key="c" className="text-ink-2">DEPLOY IN DAYS</span>,
              <span key="d" className="grad-spectral display-md text-[1.05rem] tracking-normal uppercase">Works every shift</span>,
              <span key="e" className="text-ink-2">VERIFIED ON EVERY ACTION</span>,
              <span key="f" className="grad-spectral display-md text-[1.05rem] tracking-normal uppercase">Priced in INR ₹</span>,
            ]}
          />
        </div>

        <EmployeeGallery />
        <HowItWorks />
        <WhyLexi />
        <UseCases />
        <AboutSection />
        <Pricing />
        <DemoForm />
      </main>
      <SiteFooter />
    </>
  );
}
