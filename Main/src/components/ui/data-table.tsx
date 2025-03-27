
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface DataTableProps<T> {
  data: T[];
  columns: {
    id: string;
    header: string;
    cell: (item: T) => React.ReactNode;
  }[];
  isLoading?: boolean;
  noResultsMessage?: string;
}

export function DataTable<T>({
  data,
  columns,
  isLoading = false,
  noResultsMessage = "No results found.",
}: DataTableProps<T>) {
  return (
    <div className="relative border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.id}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={`loading-${index}`}>
                {columns.map((column) => (
                  <TableCell key={`loading-cell-${column.id}-${index}`}>
                    <div className="h-4 bg-muted rounded animate-pulse"></div>
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-6 text-muted-foreground">
                {noResultsMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, i) => (
              <TableRow key={`row-${i}`}>
                {columns.map((column) => (
                  <TableCell key={`${i}-${column.id}`}>{column.cell(item)}</TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
