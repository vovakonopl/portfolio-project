import RecentlyViewedProducts from '@/components/product/recently-viewed-products';

export default function Home() {
  return (
    <div className="container">
      <main className="flex flex-col gap-4">
        {/* header with all product categories */}

        {/* section with popular products */}

        <RecentlyViewedProducts />
      </main>
    </div>
  );
}
