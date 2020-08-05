# Programtilpasninger for Prosjektportalen

## Hva er programtilpasninger for Prosjektportalen

Programtilpasninger for Prosjektportalen er en valgfri tilleggspakke som installeres på en områdesamling hvor [Prosjektportalen](https://github.com/Puzzlepart/prosjektportalen) allerede er installert. Etter at tilpasningen er installert kan du opprette programområder i områdesamlingen. Hvert programområde er et eget område ganske likt som et standard prosjektområde, men det har noen ulikheter

* Programområder kan velge prosjekter som skal vises i programområdet
* Etter at prosjekter er lagt til i programmet kan en se nærmere på
  * en portefølje over alle prosjektene i programmet
  * en tidslinje med alle prosjektene i programmet
  * aggregerte statusrapporter fra prosjektene
  * oversikt over gevinstene fra prosjektene i programmet

Prosjektene opprettes og lever i vanlige Prosjektportalen porteføljer, og er sånn sett helt frikoblet og uvitende om programtilpasningene.

## Installering

Programtilpasningene installeres på en egen områdesamling over en Prosjektportalen-installasjon. **Den enkleste metoden er å laste ned siste versjon av Prosjektportalen og siste versjon av program, og så kjøre installasjonen fra program-releasen med en peker til prosjektportalen-releasen.** Merk: Installasjon over en eksisterende Prosjektportalen-installasjon kan føre til dupliserte verdier og felter.  

Programtilpasninger for Prosjektportalen installeres med Powershell. Se [Installation](https://github.com/Puzzlepart/prosjektportalen-program/wiki/Installation) (dokumentert på engelsk)

## Etter installering - tilpassede faser

Programtilpasningene kommer med et egen termsett for _Fase_. Dette finner du under termgruppen _Program_.

For å bruke de tilpassede fasene, må det manuelt endres.

Det er feltene _Fase_ og _Produktfase_ som bruker dette termsettet, og disse må endres til å peke på _Fase_ under _Program_.

## Siste versjon av Prosjektportalen

Siste versjon av Programtilpasninger for Prosjektportalen kan lastes ned [herfra](https://github.com/Puzzlepart/prosjektportalen-program/releases/latest).

## Kontakt

Har du spørsmål vedrørende Programtilpasninger for Prosjektportalen, behov for bistand til installasjon av løsningen eller ønsker om muligheter for videreutvikling og spesialtilpasninger, ta kontakt med [prosjektportalen@puzzlepart.com](mailto:prosjektportalen@puzzlepart.com). For tekniske spørsmål, ta kontakt med [Tarjei Ormestøyl](mailto:tarjeieo@puzzlepart.com) eller [Ole Martin Pettersen](mailto:olemp@puzzlepart.com). Vi gjør oppmerksom på at eventuell bistand vil være en fakturerbar tjeneste.

## Maintainers

Tarjei Ormestøyl [tarjeieo@puzzlepart.com], Ole Martin Pettersen [olemp@puzzlepart.com]
