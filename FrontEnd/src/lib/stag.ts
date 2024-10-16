export const fastHeaders = new Headers({
 accept: 'application/json',
 'Content-Type': 'application/json',
})

export function GetTicket(req: Request): string | null {
 const base = new URL(req.url)
 const rTicket = base.searchParams.get('ticket') || ''

 if (!rTicket) {
  return null
 }

 return rTicket
}
