# Herzlich willkommen\!

Wir sind die Gruppe FF und stellen hier unser Spiel zum "SEP: Softwareentwicklungspraktikum - Spieleentwicklung
in JavaScript" vor.

## Wie startet man unser Spiel?
1. Clone das Projekt in lokales Repository:  
"git clone https://gitlab.lrz.de/ru95sag/gruppeff.git"  
oder 
"git clone git@gitlab.lrz.de:ru95sag/gruppeff.git" 
2. Installiere NPM Packages:  
"npm install"  
3. Kompiliere nötige Dateien des Clients:  
"npm run watch-client"  
4. Server starten:  
"npm run server"  
5. Clients verbinden:  
Geben Sie in einem Browser "localhost:3000" wenn der verbindende Spieler auch den Server startet.  
Ansonsten stellen Sie eine Verbindung her indem Sie die lokale IP Adresse des Servers gefolgt von  
dem Port 3000 eingeben: "\<lokaleIP-Adresse\>:3000"

## Entwicklungsstatus

Innerhalb der nächsten 6 Wochen wollen wir dieses Projekt fertigstellen.  
Dazu halten wir uns strikt an unseren Milestoneplan:  
- [x] Milestone 0 (-21.05.2019)
- [x] Milestone 1 (21.05.2019-11.06.2019)
- [x] Milestone 2 (11.06.2019-02.07.2019)
- [x] Milestone 3 (02.07.2019-23.07.2019)
- [x] Abschlussprüfung (29/30.07.2019)

### Milestone 0:
Zu Beginnn unseres Projekts wollen wir folgende Dinge klarstellen:  
- **Finalisierung der Spielidee:**  
Das Spiel wird ein 2D Fighting Game und nehmen uns "Super Smash Bros." oder "Ravals of Aether".  
Wir legen Wert auf ein schnelles Spielerlebnis. Der Kern besteht einem 1vs1 Kampfprinzip, was wir jedoch noch erweitern möchten auf andere Spielprinzipien.


- **Modellierung des Spiels:**  
Wir werden unser Spiel Top-Down designen. Dafür fangen wir mit einer Server Client Struktur an.   
Die Logik des Spiels wird am Server ablaufen, der Client bekommt die Informationen und stellt diese bei sich dar.
- **Featureumfang:**  
Wir wollen ein Spiel haben, mit dem zumindest 2 Spieler über einen Server miteinander spielen können.  
Die Features, die unser Projekt haben soll teilen wir in MVP-Features und Erweiterungen ein.  
**MVP-Features:**  
Ein Level, ein steuerbarer Character, Server mit 2 Clients, (minimale) Kampflogik, statische Stage, semidynamische Charaktere, Erweiterbar, Minimal Artwork  
**Erweiterungen:**  
Mehr Levels, mehrere Charactere, Animationen, dynamische Stages, dynamische Figuren, Bots, PowerUps, Story, Sound(effekte), Parallaxeneffekt, Schere Stein Papier Prinzipien umsetzen, mehr Spielmodi
- **Herausforderungen und erwartete Probleme:**  
Wir haben alle einen sehr strengen Terminplan, deswegen müssen wir uns von Anfang an auf die Entwicklung des Spiels konzentrieren. Sonst kommen wir unter Zeitdruck, sobald unsere Klausuren anfangen.
- **Milestone Plan:**  
Ist gerade diese ReadMe File.
- **Festlegung der Herangehensweise:**  
Wir werden das Prinzip Scrum verwenden und unsere Sprints wochenweise einteilen.  
- **Festlegung der Tools:**  
Organisation/Scrum: Trello  
IDE: IntellijWebstorm  
VersionControl: GitLab  
Kommunikation: WhattsApp/Trello  
Testing: Linter  
UML-Tool: Draw.io

### Milestone 1:
- [x] Leveldesign Prototyp
- [x] Characterdesign Prototyp
- [x] Server-Client funktioniert
- [x] 2 Spieler können sich einloggen und interagieren

### Milestone 2:
- [x] Interaktion von Spielern ist möglich
- [x] Logik von Spiel wurde implementiert
- [x] Ladebildschirm
- [x] HUD
- [x] Leveldesign
- [x] Characterdesgin
- [x] MVP

### Milestone 3:
- [x] Gute Interaktion der Spieler
- [x] Attackanimation verbessern
- [x] Punktesystem
- [x] Balancing
- [x] Bugfixing
- [x] Abgabe


### Abschlussprüfung:
- [ ] Abschlussprüfung rocken
- [ ] Betrinken
