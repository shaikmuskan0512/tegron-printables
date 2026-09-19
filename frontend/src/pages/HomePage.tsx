import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BrandStrip } from '@/components/home/BrandStrip';
import { CategorySection } from '@/components/home/CategorySection';
import { Footer } from '@/components/home/Footer';
import { Hero } from '@/components/home/Hero';
import { Navbar } from '@/components/home/Navbar';
import { ProductsSection } from '@/components/home/ProductsSection';
import { ConnectSection } from '@/components/home/SubmissionForms';
import { scrollToSection } from '@/utils/navigation';

export default function HomePage() {
  const [category, setCategory] = useState('all');
  const { hash } = useLocation();

  // Land on the right section after login redirects or nav from other pages
  useEffect(() => {
    if (!hash) return;
    const t = window.setTimeout(() => scrollToSection(hash.slice(1)), 120);
    return () => window.clearTimeout(t);
  }, [hash]);

  const selectCategory = useCallback((slug: string) => {
    setCategory(slug);
    if (window.matchMedia('(max-width: 767px)').matches) scrollToSection('products');
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:shadow-lift">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <BrandStrip />
        <CategorySection selected={category} onSelect={selectCategory} />
        <ProductsSection category={category} onResetCategory={() => setCategory('all')} />
        <ConnectSection />
      </main>
      <Footer />
    </div>
  );
}
