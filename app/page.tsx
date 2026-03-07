import Navbar    from "@/components/Navbar";
import Hero      from "@/components/Hero";
import Problem   from "@/components/Problem";
import HowItWorks from "@/components/HowItWorks";
import UseCases  from "@/components/UseCases";
import Mission   from "@/components/Mission";
import Waitlist  from "@/components/Waitlist";
import Footer    from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <UseCases />
        <Mission />
        <Waitlist />
      </main>
      <Footer />
    </>
  );
}
