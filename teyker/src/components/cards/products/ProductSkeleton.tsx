import React from 'react'

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton h-48 sm:h-56 w-full" />

      <div className="p-4 space-y-3">
        <div className="skeleton h-3 w-16" />

        <div className="space-y-1">
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-3/4" />
        </div>

        <div className="skeleton h-3 w-24" />

        <div className="space-y-1">
          <div className="skeleton h-3 w-full" />
          <div className="skeleton h-3 w-5/6" />
        </div>

        <div className="skeleton h-5 w-32" />

        <div className="skeleton h-10 w-full rounded-lg" />
      </div>
    </div>
  )
}

export const ProductSkeletonGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(12)].map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  )
}