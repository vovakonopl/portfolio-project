import RecentlyViewedProducts from '@/components/product/recently-viewed-products';

export default function Home() {
  return (
    <div className="container">
      <main className="flec-col flex gap-4">
        {/* header with all product categories */}

        {/* section with popular products */}

        {/* section with recently viewed products */}
        <RecentlyViewedProducts />
      </main>
    </div>
  );
}
