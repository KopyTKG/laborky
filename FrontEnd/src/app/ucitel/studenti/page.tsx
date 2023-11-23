'use client'
import {
 Divider,
 Input,
 Button,
 Link,
 Table,
 TableBody,
 TableCell,
 TableColumn,
 TableHeader,
 TableRow,
} from '@nextui-org/react'
import React from 'react'
export default function Page() {
 return (
  <div className="container mx-auto flex flex-col items-center">
   <h1 className="text-3xl font-bold">Vyhledávání studenta</h1>
   <Divider className="my-5 py-[0.075rem]" />
   <div className="w-full flex flex-row gap-5">
    <div className="w-full grid border-r-2 pr-5">
     <div className="text-xl flex flex-col gap-2">
      Vyhledejte studenta:
      <Input placeholder="st-----" size="lg" />
     </div>
     <Button className="w-max py-8 px-10 text-xl justify-self-end" color="primary">
      Vyhledat
     </Button>
    </div>
    <div className="w-full text-xl">
     Seznam studentů:
     <Table hideHeader aria-label="Example static collection table">
      <TableHeader>
       <TableColumn>id</TableColumn>
       <TableColumn>name</TableColumn>
      </TableHeader>
      <TableBody>
       <TableRow
        as={Link}
        href="/ucitel/studenti/st98318"
        className="cursor-pointer hover:bg-gray-700">
        <TableCell className="text-xl">st98318</TableCell>
        <TableCell className="text-xl">Martin Kopecký</TableCell>
       </TableRow>
       <TableRow
        as={Link}
        href="/ucitel/studenti/st98318"
        className="cursor-pointer hover:bg-gray-700">
        <TableCell className="text-xl">st98318</TableCell>
        <TableCell className="text-xl">Martin Kopecký</TableCell>
       </TableRow>
       <TableRow
        as={Link}
        href="/ucitel/studenti/st98318"
        className="cursor-pointer hover:bg-gray-700">
        <TableCell className="text-xl">st98318</TableCell>
        <TableCell className="text-xl">Martin Kopecký</TableCell>
       </TableRow>
       <TableRow
        as={Link}
        href="/ucitel/studenti/st98318"
        className="cursor-pointer hover:bg-gray-700">
        <TableCell className="text-xl">st98318</TableCell>
        <TableCell className="text-xl">Martin Kopecký</TableCell>
       </TableRow>
       <TableRow
        as={Link}
        href="/ucitel/studenti/st98318"
        className="cursor-pointer hover:bg-gray-700">
        <TableCell className="text-xl">st98318</TableCell>
        <TableCell className="text-xl">Martin Kopecký</TableCell>
       </TableRow>
      </TableBody>
     </Table>
    </div>
   </div>
  </div>
 )
}
