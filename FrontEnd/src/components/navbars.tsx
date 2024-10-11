'use client'
import { tLink } from '@/lib/types'
import { House, Menu, Moon, Sun, User, Users } from 'lucide-react'
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuLabel,
 DropdownMenuSeparator,
 DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'

export function NavbarStudent({ id }: { id: string }) {
 const baseUrl = '/student/#id'
 const url = baseUrl.replace('#id', id)
 const links: tLink[] = [
  {
   label: 'Domů',
   href: `${url}`,
   icon: <House className="w-5" />,
  },
  {
   label: 'Moje termíny',
   href: `${url}/moje`,
   icon: <Menu className="w-5" />,
  },
 ]
 return <NavbarComponent id={id} links={links} url={url} st={false} />
}

export function NavbarTeacher({ id }: { id: string }) {
 const baseUrl = '/ucitel/#id'
 const url = baseUrl.replace('#id', id)
 const links: tLink[] = [
  {
   label: 'Domů',
   href: `${url}`,
   icon: <House className="w-5" />,
  },
  {
   label: 'Procházet',
   href: `${url}/predmety`,
   icon: <Menu className="w-5" />,
  },
  {
   label: 'Studenti',
   href: `${url}/hledat`,
   icon: <Users className="w-5" />,
  },
 ]

 return <NavbarComponent id={id} links={links} url={url} st={true} />
}

function NavbarComponent({
 id,
 links,
 url,
 st,
}: {
 id: string
 links: tLink[]
 url: string
 st: boolean
}) {
 const router = useRouter()
 const { theme, setTheme } = useTheme()
 return (
  <nav className="w-full flex justify-center py-3 border-1 border-transparent border-b-stone-500/50 fixed top-0 backdrop-blur-md">
   <section className="w-full flex max-w-6xl px-3 md:px-6 ">
    <main className="flex flex-row gap-4">
     {links.map((item: tLink) => {
      return (
       <Button key={item.href} onClick={() => router.push(item.href)} variant="ghost">
        {item.icon} &nbsp; {item.label}
       </Button>
      )
     })}
    </main>
    <div className="flex w-full justify-end gap-5">
     <DropdownMenu>
      <DropdownMenuTrigger>
       <div className="w-10 h-10 rounded-full bg-stone-400 dark:bg-stone-600 flex items-center justify-center">
        <User className="text-white w-10" />
       </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
       <DropdownMenuLabel>Můj účet</DropdownMenuLabel>
       <DropdownMenuSeparator />
       {!st && (
        <>
         <DropdownMenuItem
          onClick={() => {
           router.push(`/student/${id}/profil`)
          }}
         >
          Profil
         </DropdownMenuItem>
        </>
       )}
       <DropdownMenuItem
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="flex gap-2"
       >
        {theme === 'dark' ? (
         <Sun className="w-5 text-white fill-white" />
        ) : (
         <Moon className="w-5 text-black fill-black" />
        )}
        Vzhled
       </DropdownMenuItem>
       <DropdownMenuSeparator />
       <DropdownMenuItem
        onClick={() => {
         router.push(`/logout`)
        }}
        className="text-red-600 dark:text-red-400"
       >
        Odhlásit se
       </DropdownMenuItem>
      </DropdownMenuContent>
     </DropdownMenu>
    </div>
   </section>
  </nav>
 )
}
