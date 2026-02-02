'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200',
        className
      )}
      style={style}
    />
  );
}

export function SkeletonText({ className, lines = 1 }: SkeletonProps & { lines?: number }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn('card', className)}>
      <Skeleton className="h-6 w-1/3 mb-4" />
      <div className="space-y-3">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export function SkeletonMetricCard({ className }: SkeletonProps) {
  return (
    <div className={cn('metric-card', className)}>
      <Skeleton className="h-8 w-20 mb-2" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

export function SkeletonChart({ className, height = 200 }: SkeletonProps & { height?: number }) {
  return (
    <div className={cn('card', className)}>
      <Skeleton className="h-6 w-1/4 mb-4" />
      <Skeleton className="w-full rounded-lg" style={{ height }} />
    </div>
  );
}

export function SkeletonTable({ className, rows = 5 }: SkeletonProps & { rows?: number }) {
  return (
    <div className={cn('card', className)}>
      <Skeleton className="h-6 w-1/4 mb-4" />
      <div className="space-y-3">
        {/* Header row */}
        <div className="flex gap-4 pb-2 border-b border-gray-200">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/6" />
          <Skeleton className="h-4 w-1/6" />
          <Skeleton className="h-4 w-1/6" />
        </div>
        {/* Data rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4 py-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/6" />
            <Skeleton className="h-4 w-1/6" />
            <Skeleton className="h-4 w-1/6" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonReportHeader() {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-20 rounded-lg" />
            <Skeleton className="h-9 w-20 rounded-lg" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonExecutiveSummary() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonMetricCard key={i} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonSectionNav() {
  return (
    <div className="flex overflow-x-auto gap-2 pb-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-28 rounded-lg flex-shrink-0" />
      ))}
    </div>
  );
}

export function SkeletonReportContent() {
  return (
    <div className="space-y-6">
      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonMetricCard key={i} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid md:grid-cols-2 gap-6">
        <SkeletonChart height={250} />
        <SkeletonChart height={250} />
      </div>

      {/* Table */}
      <SkeletonTable rows={5} />
    </div>
  );
}

// Full page skeleton for initial load
export function SkeletonReportPage() {
  return (
    <div className="flex-1 bg-gray-50">
      <SkeletonReportHeader />

      {/* Executive Summary */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <SkeletonExecutiveSummary />
      </div>

      {/* Section Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SkeletonSectionNav />
      </div>

      {/* Report Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <SkeletonReportContent />
      </div>
    </div>
  );
}
