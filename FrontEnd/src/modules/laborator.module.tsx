import {
 Chip,
 Divider,
 Spacer,
 Table,
 TableBody,
 TableCell,
 TableColumn,
 TableHeader,
 TableRow,
} from '@nextui-org/react'

export default function laborator(props: any) {
 return (
  <div className="flex flex-col">
   <div className="text-2xl">{props.state.nazev}</div>
   <Table hideHeader>
    <TableHeader>
     <TableColumn>Name</TableColumn>
     <TableColumn>Value</TableColumn>
    </TableHeader>
    <TableBody>
     {/* Tady se vytvori ta tabulka -> info tady mam z tech lab */}
     {props.state.cviceni.map((lab: any, index: any) => (
      <TableRow key={props.state.nazev + index}>
       <TableCell>Laboratorni Cviceni {index + 1}</TableCell>
       <TableCell className="flex justify-end">
        {lab != '' ? (
         <Chip color="success" size="md">
          {new Date(lab).toLocaleDateString()}
         </Chip>
        ) : (
         <Chip color="danger" size="md">
          Nesplnil
         </Chip>
        )}
       </TableCell>
      </TableRow>
     ))}
    </TableBody>
   </Table>
   <Spacer y={2} />
   <Divider />
  </div>
 )
}
