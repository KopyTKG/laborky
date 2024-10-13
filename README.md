# UJEP Laboratorní cvičení

![GitHub package.json version](https://img.shields.io/github/package-json/v/kopytkg/laborky/Dev?filename=FrontEnd%2Fpackage.json&label=FrontEnd) ![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/kopytkg/laborky/Dev?filename=BackEnd%2Fversion.json&label=BackEnd)



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
STAG_URL="https://ws.ujep.cz/"
MIN_TIME_ODZAPIS=24 #Hours
```
- `FrontEnd/.env`
```env
NEXT_PUBLIC_BASE=`http://localhost:3000`
NEXT_PUBLIC_API_URL=`http://localhost:9999`

NEXT_PUBLIC_TIME_GAP=12 #Hodiny

# DEV VALUE NEED TO BE CHANGED
NEXT_PUBLIC_STAG_SERVER=`https://stag-demo.zcu.cz/ws`
```

2. Nainstalování všech balíčků viz [Instalace](#instalace)

### Spuštění
- windows / linux: `./run.sh`
- linux(gnome) + tmux: `./run.sh -tmux`
