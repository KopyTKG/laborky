import {
	Navbar,
	NavbarItem,
	NavbarContent,
	NavbarBrand,
	Link,
	Button,
	Avatar,
} from '@nextui-org/react'
import Icon from '@/components/icon'
import { tLink } from '@/lib/types'

export function NavbarStudent({ id }: { id: string }) {
	const baseUrl = '/student/#id'
	const url = baseUrl.replace('#id', id)
	const links: tLink[] = [
		{
			label: 'Domů',
			href: `${url}`,
			icon: 'house',
		},
		{
			label: 'Moje termíny',
			href: `${url}/moje`,
			icon: 'menu',
		},
	]
	return <NavbarComponent id={id} links={links} url={url} />
}

export function NavbarTeacher({ id }: { id: string }) {
	const baseUrl = '/ucitel/#id'
	const url = baseUrl.replace('#id', id)
	const links: tLink[] = [
		{
			label: 'Domů',
			href: `${url}`,
			icon: 'house',
		},
		{
			label: 'Moje předměty',
			href: `${url}/predmety`,
			icon: 'menu',
		},
		{
			label: 'Studenti',
			href: `${url}/studenti`,
			icon: 'users',
		},
	]

	return <NavbarComponent id={id} links={links} url={url} />
}



function NavbarComponent({ id, links, url }: { id: string; links: tLink[]; url: string }) {
	return (
		<Navbar className="w-full flex" isBordered isBlurred>
			<NavbarContent>
				{links.map((item: tLink) => {
					return (
						<NavbarItem key={item.href}>
							<Button
								as={Link}
								href={item.href}
								color="primary"
								endContent={<Icon name={item.icon as any} className="w-5" />}
								variant="solid"
							>
								{item.label}
							</Button>
						</NavbarItem>
					)
				})}
			</NavbarContent>
			<NavbarBrand className="flex w-full justify-end gap-5">
				<NavbarItem>
					<Button as={Link} href="/logout" className="flex gap-2" color="danger">
						Odhlásit se
						<Icon name="log-out" />
					</Button>
				</NavbarItem>
				<NavbarItem>
					<Link href={`${url}/profil`} className="flex gap-2">
						<Avatar size="sm" color="default" />
						{id}
					</Link>
				</NavbarItem>
			</NavbarBrand>
		</Navbar>
	)
}
