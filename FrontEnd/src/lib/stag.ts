export async function getStagUser(ticket: string): Promise<any> {
 const url = `https://stag-demo.zcu.cz/ws/services/rest2/help/getStagUserListForLoginTicketV2?ticket=${ticket}`
 const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Connection: 'keep-alive',
  'Accept-Origin': 'https://stag-demo.zcu.cz',
 }

 const response = await fetch(url, { method: 'GET', headers })

 if (!response.ok) {
  throw new Error(await response.text())
 }

 return await response.json()
}
