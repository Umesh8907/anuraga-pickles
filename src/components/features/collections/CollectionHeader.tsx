'use client'

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCollections } from '@/hooks/useCollections';
import heroBanner from "@/assets/Collection-header.png";



 export default function CollectionHeader() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-10 pt-8">

      {/* ---------------- BANNER ---------------- */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl">
        <Image
          src={heroBanner}
          alt="Collection Banner"
          priority
          className="w-full h-auto object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 90vw, 1200px"
        />
      </div>
    </section>
  );
}