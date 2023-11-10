'use client'
import {
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
export default function laborator(props: any) {
  return (
    <div >
      <div className="text-2xl">{props.state.nazev}</div>
        <Table hideHeader className="min-w-max max-w-full mb-6 ">
          <TableHeader>
            <TableColumn>Name</TableColumn>
            <TableColumn>Value</TableColumn>
          </TableHeader>
          <TableBody>
            {/* Tady se vytvori ta tabulka -> info tady mam z tech lab */}
            {props.state.cviceni.map((lab: any, index: any) => (
                <TableRow key={index}>
                  <TableCell className="text-md">
                  Laboratorni Cviceni {index +1}
                  </TableCell>
                  <TableCell className="flex justify-end" >
                    {lab ? (
                      <Chip color="success">
                        Splnil
                      </Chip>
                    ) : (
                      <Chip color="danger">

                        Nesplnil
                      </Chip>
                    )}
                  </TableCell>
                </TableRow>
          ))}
          </TableBody>
        </Table>
    </div>
  );
}
