import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { listProducts } from '../data/repository';
import { Product, Category } from '../types';
import { ProductCard } from '../components/shop/ProductCard';
import { VerifiedContactPanel } from '../components/common/VerifiedContactPanel';
import { Filter, Search, Scissors, Check, Sparkles } from 'lucide-react';

export const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = (searchParams.get('category') as Category | 'all') || 'all';
  const [onlyM2M, setOnlyM2M] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { label: string; value: Category | 'all' }[] = [
    { label: 'All Atelier Pieces', value: 'all' },
    { label: 'Anarkali Sets', value: 'anarkali' },
    { label: 'Lehengas', value: 'lehenga' },
    { label: 'Sarees & Blouses', value: 'saree-blouse' },
    { label: 'Kurta Sets', value: 'kurta-set' },
    { label: 'Co-Ords', value: 'co-ord' },
    { label: 'Dupattas', value: 'dupatta' },
  ];

  useEffect(() => {
    setLoading(true);
    listProducts({
      category: activeCategory,
      madeToMeasureOnly: onlyM2M,
      inStockOnly: onlyInStock,
      search: searchQuery,
    }).then((res) => {
      setProducts(res);
      setLoading(false);
    });
  }, [activeCategory, onlyM2M, onlyInStock, searchQuery]);

  const handleCategorySelect = (cat: Category | 'all') => {
    if (cat === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Header */}
      <div className="border-b border-chalk-border dark:border-chalk-dark pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 garment-label text-[10px] mb-2">
              <span>STUDIO CATALOGUE</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-jamun dark:text-kora">
              Bespoke Silks & Small Batches
            </h1>
            <p className="text-sm text-jamun/70 dark:text-kora/70 mt-1 max-w-2xl">
              Each piece is drafted individually. Filter by silhouette or choose Made-to-Measure to provide your exact measurements.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-jamun/40 dark:text-kora/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by fabric or piece..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded bg-white dark:bg-jamun-surface border border-chalk-border dark:border-chalk-dark text-jamun dark:text-kora focus:ring-1 focus:ring-gulab"
            />
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 pb-2 no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => handleCategorySelect(cat.value)}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-jamun dark:bg-kora text-kora dark:text-jamun shadow-sm'
                    : 'bg-chalk-subtle dark:bg-chalk-dark text-jamun/80 dark:text-kora/80 hover:bg-chalk border border-chalk-border dark:border-chalk-dark'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Sub-filters (Toggles) */}
        <div className="flex flex-wrap items-center gap-4 pt-3 text-xs">
          <label className="inline-flex items-center gap-2 cursor-pointer text-jamun/80 dark:text-kora/80">
            <input
              type="checkbox"
              checked={onlyM2M}
              onChange={(e) => setOnlyM2M(e.target.checked)}
              className="rounded text-gulab focus:ring-gulab w-3.5 h-3.5"
            />
            <span className="font-medium">Made to Measure Eligible Only</span>
          </label>

          <label className="inline-flex items-center gap-2 cursor-pointer text-jamun/80 dark:text-kora/80">
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
              className="rounded text-gulab focus:ring-gulab w-3.5 h-3.5"
            />
            <span className="font-medium">Ready to Dispatch (In Stock)</span>
          </label>
        </div>
      </div>

      {/* Trust Notice Compact */}
      <VerifiedContactPanel compact />

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="aspect-[4/5] bg-chalk animate-pulse rounded" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="p-12 text-center bg-chalk-subtle dark:bg-chalk-dark rounded-lg border border-dashed border-chalk-border">
          <p className="font-display text-lg text-jamun dark:text-kora">
            No studio pieces match your filter criteria.
          </p>
          <button
            onClick={() => {
              handleCategorySelect('all');
              setOnlyM2M(false);
              setOnlyInStock(false);
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 bg-jamun dark:bg-kora text-kora dark:text-jamun text-xs font-semibold rounded"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs text-jamun/60 dark:text-kora/60 font-mono">
            Showing {products.length} {products.length === 1 ? 'piece' : 'pieces'} crafted by Kayaa
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
