'use client'
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
export default function laborator(props: any) {
  return (
    <div className="category">
      <div className="title">{props.state.nazev}</div>
      <div className="labs">
        {" "}
        <Table hideHeader>
          <TableHeader>
            <TableColumn>Name</TableColumn>
            <TableColumn>Value</TableColumn>
          </TableHeader>
          <TableBody>
            {/* Tady se vytvori ta tabulka -> info tady mam z tech lab */}
            {props.state.cviceni.map((lab: any, index: any) => (
              <>
                <TableRow>
                  <TableCell>
                  Laboratorni Cviceni {index +1}
                  </TableCell>
                  <TableCell>
                    {lab ? (
                      <div className="done">
                        Splnil
                      </div> /*tady jednotlive radky, tady se bude renderovat*/
                    ) : (
                      <div className="not-done">Nesplnil</div>
                    )}
                  </TableCell>
                </TableRow>
              </>
          ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
