export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
        <nav>
            <div className='buttons'>
                <a href="/student">Domů</a>
                <a href="/student/moje">Moje termíny</a>
            </div>
            <div className="title">Laborky UJEP</div>
            <a className="user" href="/student/profil">
                <div className="icon"></div>
                F -----
            </a>
        </nav>
        <>
            {children}
        </>
    </>
  )
}
