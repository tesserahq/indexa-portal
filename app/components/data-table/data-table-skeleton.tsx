import type { RowData } from '@tanstack/react-table'
import type { LegacyHeaderGroup } from '@tanstack/react-table/legacy'
import { TableCell, TableRow } from '@shadcn/ui/table'
import { TableCellSkeletonsProps } from './types'
import { cn } from '@shadcn/lib/utils'

export const TableCellSkeletons = <TData extends RowData>({
  table,
  count,
  className,
}: TableCellSkeletonsProps<TData>) => {
  return Array.from({ length: count }).map((_, skeletonIndex) => {
    return table.getHeaderGroups().map((headerGroup: LegacyHeaderGroup<TData>) => (
      <TableRow
        key={`${headerGroup.id}-${skeletonIndex}`}
        className={cn('border-border dark:hover:bg-navy-700', className)}>
        {headerGroup.headers.map((header) => {
          return (
            <TableCell
              key={`${header.id}-${skeletonIndex}`}
              className="text-navy-800 dark:text-navy-100 py-2 ps-4 font-semibold"
              style={{ width: header.column.columnDef.size }}>
              <div className="h-6 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-500"></div>
            </TableCell>
          )
        })}
      </TableRow>
    ))
  })
}
