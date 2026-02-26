'use client';
import React from 'react';
import { Table, TableBody, TableRow, TableCell, TableHeader, TableHead } from '@/components/ui/table';
import { Check, X } from 'lucide-react';
type FileStructTableProps = {
  exTitles: boolean;
};
export default function FileStructTable({ exTitles }: FileStructTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table className="border">
        {exTitles ? (
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Example 1</TableHead>
              <TableHead className="text-center">Example 2</TableHead>
              <TableHead className="text-center">Example 3</TableHead>
              <TableHead className="text-center">Example 4</TableHead>
            </TableRow>
          </TableHeader>
        ) : null}
        <TableBody>
          <TableRow>
            <TableCell>
              DevTools-master.zip
              <br />
              &nbsp;&nbsp;&#11377; src
              <br />
              &nbsp;&nbsp;&#11377; plugin.yml
            </TableCell>
            <TableCell>
              DevTools-master.zip
              <br />
              &nbsp;&nbsp;&#11377; DevTools-master
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&#11377; src
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&#11377; plugin.yml
            </TableCell>
            <TableCell>
              DevTools-master.zip
              <br />
              &nbsp;&nbsp;&#11377; DevTools-master
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&#11377;{' '}
              <span className="bg-destructive text-destructive-foreground">OtherFolder</span>
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#11377; src
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#11377; plugin.yml
            </TableCell>
            <TableCell>
              DevTools-master.zip
              <br />
              &nbsp;&nbsp;&#11377; DevTools-
              <span className="bg-destructive text-destructive-foreground">other</span>
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&#11377; src
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&#11377; plugin.yml
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-center text-green-600">
              Valid <Check className="inline size-5" />
            </TableCell>
            <TableCell className="text-center text-green-600">
              Valid <Check className="inline size-5" />
            </TableCell>
            <TableCell className="text-center text-destructive">
              Invalid <X className="inline size-5" />
            </TableCell>
            <TableCell className="text-center text-destructive">
              Invalid <X className="inline size-5" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
