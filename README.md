# UJEP Laboratorní cvičení

![GitHub package.json version](https://img.shields.io/github/package-json/v/kopytkg/laborky/Dev?filename=FrontEnd%2Fpackage.json&label=FrontEnd) ![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/kopytkg/laborky/Dev?filename=BackEnd%2Fversion.json&label=BackEnd)



Práce na projektový seminář.

Popis: Vytvořete přihlašovací systém na laboratorní cvičení, kde vyučující vypisuje termíny a student se k nim přihlašuje. Přihlášení k platformě je nutno zřídit přes [stag](http://stag.ujep.cz/).


## Tým

**FrontEnd** - [Martin](https://github.com/kopytkg)

**BackEnd** -
[Alex](https://github.com/Bumross), [Dan](https://github.com/DanielRiha8906)

**Database** - [Adam](https://github.com/Midiros) 


## Spuštění

### Před spuštěním
1. Vytvoření obou `.env` souborů
- `BackEnd/.env`
```env
PORT=9999 # Pro testovani bylo pouzito 3010
HOST=0.0.0.0 # neboli all
DB_URL=postgresql://postgres:postgres@172.254.5.4:5432/railway # connection string pro připojení k databázi nutno upravit podle docker configurace (uzivatel/heslo)
INTERVAL_VYPISU_DNY=14 #(7-14-30....etc)vami zvoleny pocet dnu, dle kterych se budou zobrazovat nadchazejici terminy
STAG_URL=https://stag-demo.zcu.cz/
MIN_TIME_ODZAPIS=8 #Hours
INVERVAL_ZOBRAZENI_HODINY= 4
```
- `FrontEnd/.env`
```env
NEXT_PUBLIC_BASE=`http://deviceIP:3000` # je potreba zmeni na IP zarizeni
NEXT_PUBLIC_API_URL=`http://172.254.5.5:9999`

NEXT_PUBLIC_TIME_GAP=8 #Hodiny

# DEV VALUE NEED TO BE CHANGED
NEXT_PUBLIC_STAG_SERVER=`https://stag-demo.zcu.cz/ws`
```

2. Nainstalování všech balíčků viz [Instalace](#instalace)

### Spuštění
- windows / linux: `./run.sh`
- linux(gnome) + tmux: `./run.sh dev`
