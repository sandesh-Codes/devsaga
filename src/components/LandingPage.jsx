"use client";

import "@/styles/landingpage.css";

import LandingNavbar from "./landing/LandingNavbar"
import HeroSection from "./landing/HeroSection";
import HowItWorksSection from "./landing/HowItWorksSection"
import IrtFeature from "./landing/IrtFeature";
import CallToActionSection from "./landing/CallToActionSection";
import LandingFooter from "./landing/LandingFooter";

export default function LandingPage({ session }) {
  return (
    <>
      <div className="grain" />

      <div className="font-body min-h-screen" style={{ background: "#0c0b09", color: "#f0ece0" }}>

        <LandingNavbar session={session}/>

        <hr className="divider mx-6 md:mx-12" />

        <HeroSection session={session}/>

        <hr className="divider mx-6 md:mx-12" />

        <HowItWorksSection />
        
        <hr className="divider mx-6 md:mx-12" />

        <IrtFeature />

        <hr className="divider mx-6 md:mx-12" />

        <CallToActionSection session={session} />
        
        <LandingFooter />

      </div>
    </>
  );
}