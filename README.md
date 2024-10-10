# UJEP Laboratorní cvičení

Práce na projektový seminář.

Popis: Vytvořete přihlašovací systém na laboratorní cvičení, kde vyučující vypisuje termíny a student se k nim přihlašuje. Přihlášení k platformě je nutno zřídit přes [stag](http://stag.ujep.cz/).


## Tým

**FrontEnd** - [Martin](https://github.com/kopytkg)

**BackEnd** -
[Alex](https://github.com/Bumross), [Dan](https://github.com/DanielRiha8906)

**Database** - [Adam](https://github.com/Midiros) 


## Instalace

Windows / Linux:
```bash
./install.sh
```

## Spuštění

### Před spuštěním
1. Vytvoření obou `.env` souborů
- `BackEnd/.env`
```env
PORT=9999 # Pro testovani bylo pouzito 3010
HOST=0.0.0.0 # neboli all
DB_URL=postgresql://postgres:postgres@localhost:56131/railway # connection string pro připojení k databázi
INTERVAL_VYPISU_DNY=14 #(7-14-30....etc)vami zvoleny pocet dnu, dle kterych se budou zobrazovat nadchazejici terminy
STAG_URL="https://ws.ujep.cz/ws"
```
- `FrontEnd/.env`
```env
NEXT_PUBLIC_BASE=`http://localhost:3000`

# url je určená v BackEnd env
NEXT_PUBLIC_API_URL=`http://localhost:9999`

# DEV VALUE NEED TO BE CHANGED
NEXT_PUBLIC_STAG_SERVER=`https://ws.ujep.cz/ws/`
```

2. Nainstalování všech balíčků viz [Instalace](#instalace)

### Spuštění
- windows / linux: `./run.sh`
- linux(gnome) + tmux: `./run.sh -tmux`
