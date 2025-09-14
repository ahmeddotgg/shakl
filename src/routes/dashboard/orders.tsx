import { createFileRoute } from "@tanstack/react-router";
import { useUser } from "@/modules/auth/hooks/use-auth";
import { usePaddleTransactions } from "@/modules/dashboard/hooks/use-orders";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PaddleTransaction } from "@/modules/dashboard/services";

export const Route = createFileRoute("/dashboard/orders")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: user } = useUser();
  const { data, isLoading, error } = usePaddleTransactions(user?.id as string);

  if (isLoading) return <p>Loading transactions...</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;

  return <TransactionsTable data={data ?? []} />;
}

const columns: ColumnDef<PaddleTransaction>[] = [
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date = row.original.createdAt
        ? new Date(row.original.createdAt).toLocaleDateString()
        : "-";
      return <span>{date}</span>;
    },
  },
  {
    id: "items",
    header: "Items",
    cell: ({ row }) => {
      const products = row.original.products ?? [];
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {products.length} items
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent onCloseAutoFocus={(e) => e.preventDefault()}>
            {products.length === 0 ? (
              <DropdownMenuItem key="empty">—</DropdownMenuItem>
            ) : (
              products.map((p) => (
                <DropdownMenuItem key={p.id}>
                  {p.title}
                  {p.quantity ? ` × ${p.quantity}` : ""}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    id: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amt = row.original.amount ?? 0;
      const currency = row.original.currency ?? "USD";
      return (
        <span>
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
          }).format(amt)}
        </span>
      );
    },
  },
  {
    id: "method",
    header: "Method",
    cell: ({ row }) => {
      return <span>{row.original.method ?? "-"}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return <span>{row.original.status}</span>;
    },
  },
];

function TransactionsTable({ data }: { data: PaddleTransaction[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No transactions
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
