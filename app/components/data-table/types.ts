import { IPagingInfo } from '@/resources/types'
import type { RowData } from '@tanstack/react-table'
import type { LegacyColumnDef, LegacyTable } from '@tanstack/react-table/legacy'

export interface DataTableProps<TData extends RowData> {
  columns: LegacyColumnDef<TData>[]
  data: TData[]
  meta?: IPagingInfo
  empty?: React.ReactNode
  fixed?: boolean
  isLoading?: boolean
  hasFilter?: boolean
  table?: LegacyTable<TData>
  onTableReady?: (table: LegacyTable<TData>) => void
  paginationScope?: string
  callbackPagination?: ({ page, size }: { page: number; size: number }) => void
}

export type TableCellSkeletonsProps<TData extends RowData> = {
  table: LegacyTable<TData>
  count: number
  className?: string
}
