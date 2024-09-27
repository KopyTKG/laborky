# UJEP Laboratorní cvičení [![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)

Práce na pojektový seminář. 

Popis: Vytvořete přihlašovací systém na laboratorní cvičení, kde vyučující vypisuje termíny a student se k nim přilašuje. Přihlášení k platformě ne nutno zřídit přes [stag](http://stag.ujep.cz/). 


## Tým

**FrontEnd** - [Martin](https://github.com/kopytkg) , [Dan](https://github.com/DanielRiha8906)

**BackEnd** - 
[Adam](https://github.com/Midiros) , [Alex](https://github.com/Bumross)



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
HOST=`0.0.0.0` # neboli all
```
- `FrontEnd/.env`
```env
NEXT_PUBLIC_BASE=`http://localhost:3000`

# url je určená v BackEnd env
NEXT_PUBLIC_API_URL=`http://localhost:9999` 

# DEV VALUE NEED TO BE CHANGED
NEXT_PUBLIC_STAG_SERVER=`https://stag-demo.zcu.cz/ws/`
```

2. Nainstalování všech balíčků viz [Instalace](#instalace)

### Spuštění
```bash
./run.sh
```
