# CSV-formaat voor AI-Ondersteunde Beoordelingsinterface

## Bestandsstructuur
Het CSV-bestand bestaat uit twee secties:
1. Header-informatie met vraag en modelantwoord gegevens
2. Studentgegevens met antwoorden, AI-scores en extra informatie

## Header-velden
Deze velden staan bovenaan het bestand:

| Veld | Beschrijving |
| --- | --- |
| `opdracht_naam` | Naam van de opdracht |
| `vraag` | De volledige tekst van de vraag |
| `modelantwoord_deel1_prefix` | Start van het eerste deel van het modelantwoord |
| `modelantwoord_deel1_completion` | Vervolg van het eerste deel van het modelantwoord |
| `modelantwoord_deel2_prefix` | Start van het tweede deel van het modelantwoord |
| `modelantwoord_deel2_completion` | Vervolg van het tweede deel van het modelantwoord |

## Studentgegevens
Na de header volgt een rij met kolomkoppen voor de studentgegevens:

| Veld | Beschrijving |
| --- | --- |
| `student_id` | Uniek ID-nummer van de leerling |
| `naam` | Naam van de leerling |
| `antwoord_deel1_prefix` | Start van het eerste deel van het leerlingantwoord |
| `antwoord_deel1_completion` | Vervolg van het eerste deel van het leerlingantwoord |
| `antwoord_deel2_prefix` | Start van het tweede deel van het leerlingantwoord |
| `antwoord_deel2_completion` | Vervolg van het tweede deel van het leerlingantwoord |
| `ai_score_deel1` | AI-score voor deel 1 (0 of 1) |
| `ai_score_deel2` | AI-score voor deel 2 (0 of 1) |
| `ai_confidence` | Betrouwbaarheid van de AI-score (0-100) |
| `feature_importance_deel1` | Belangrijke woorden in deel 1, format: `woord:importance,woord:importance` |
| `feature_importance_deel2` | Belangrijke woorden in deel 2, format: `woord:importance,woord:importance` |
| `similar_responses_deel1` | Vergelijkbare antwoorden voor deel 1, format: `antwoord:tekst|score:0/0.5/1` per antwoord gescheiden door puntkomma's |
| `similar_responses_deel2` | Vergelijkbare antwoorden voor deel 2, format: `antwoord:tekst|score:0/0.5/1` per antwoord gescheiden door puntkomma's |

## Importance waarden
Voor feature importance worden de volgende waarden gebruikt:
- `high`: Hoge relevantie, wordt gemarkeerd met blauwe achtergrond
- `medium`: Gemiddelde relevantie, wordt gemarkeerd met lichtblauwe achtergrond
- `low`: Lage relevantie, wordt niet gemarkeerd

## Score waarden voor vergelijkbare antwoorden
- `0`: Niet goed
- `0.5`: Misschien goed
- `1`: Wel goed

## Voorbeeld
```csv
opdracht_naam,vraag,modelantwoord_deel1_prefix,modelantwoord_deel1_completion,modelantwoord_deel2_prefix,modelantwoord_deel2_completion,student_id,naam,antwoord_deel1_prefix,antwoord_deel1_completion,antwoord_deel2_prefix,antwoord_deel2_completion,ai_score_deel1,ai_score_deel2,ai_confidence,feature_importance_deel1,feature_importance_deel2,similar_responses_deel1,similar_responses_deel2
"Economie: Handelsimpact","Welke impact heeft de invoering van een minimumprijs voor CO2-uitstoot op de Europese economie?","De invoering van een minimumprijs voor CO2-uitstoot heeft als doel","bedrijven te stimuleren om te investeren in schonere technologieën en processen.","Op korte termijn kan dit leiden tot hogere kosten voor","energie-intensieve industrieën, maar op langere termijn stimuleert het innovatie en duurzame groei.",1,"Emma de Vries","De invoering van een minimumprijs voor CO2-uitstoot heeft als doel","landen te dwingen hun uitstoot te verminderen","Op korte termijn kan dit leiden tot hogere kosten voor","bedrijven die veel CO2 uitstoten",1,1,95,"uitstoot:high,verminderen:high","kosten:high,bedrijven:medium","Bedrijven worden gedwongen uitstoot te verminderen|score:1;CO2-reductie wordt afgedwongen|score:0.5","Hogere kosten voor vervuilende industrie|score:1;Bedrijven moeten aanpassen of stoppen|score:1"
```

## Opmerkingen
- Tekstvelden met komma's moeten tussen aanhalingstekens staan
- Feature importance velden bevatten komma-gescheiden paren van woord:belang
- Vergelijkbare antwoorden worden gescheiden door puntkomma's, met score gekoppeld via pipe-symbool