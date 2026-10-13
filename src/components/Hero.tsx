import Image from "next/image";
import Link from "next/link";
import { ExposureBeacon } from "@/components/ExposureBeacon";
import { evaluateExperiment, HERO_EXPERIMENT, type HeroVariant } from "@/lib/flags";
import { HERO_COPY, type HeroCopy } from "@/lib/hero";
import { getVisitorId } from "@/lib/visitor";

export function HeroFigure() {
  return (
    <figure className="hero-figure">
      <link rel="preload" as="image" href="/images/hero.webp" fetchPriority="high" />
      <Image
        src="/images/hero.webp"
        alt="Screen print of a dusk ridgeline with a canvas tent and a copper sun"
        width={1400}
        height={900}
        priority
        fetchPriority="high"
        decoding="sync"
        sizes="(max-width: 800px) 100vw, 46vw"
      />
      <figcaption>Screen-printed ridgeline from the Northline lookbook.</figcaption>
    </figure>
  );
}

export async function HeroCopy() {
  const visitorId = await getVisitorId();
  const hero = evaluateExperiment(HERO_EXPERIMENT, { targetingKey: visitorId });
  const copy = HERO_COPY[hero.value];
  return (
    <>
      <HeroText variant={hero.value} copy={copy} />
      <ExposureBeacon variant={hero.value} />
    </>
  );
}

function HeroText({ variant, copy }: { variant: HeroVariant; copy: HeroCopy }) {
  return (
    <div className="hero-copy" data-variant={variant}>
      <p className="kicker">{copy.kicker}</p>
      <h1 id="hero-title">{copy.title}</h1>
      <p className="lede">{copy.lede}</p>
      <Link href="/catalog" className="button">
        {copy.cta}
      </Link>
    </div>
  );
}
