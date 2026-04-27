# 🚗 Auto-Loc — Extranet de Location de Véhicules

## Mapping du Thème
| Entité | Table | Description |
|--------|-------|-------------|
| **Table A** | `auth.users` (Supabase Auth) | Les clients qui louent des véhicules |
| **Table B** | `voitures` | Le catalogue des véhicules disponibles |
| **Table C** | `reservations` | Les réservations liant un client à un véhicule |
| **Fichier** | Supabase Storage (`permis`) | Photo du permis de conduire du client |

---

## Analyse d'Architecture

### 1. Vercel + Supabase vs Serveur Classique : CAPEX vs OPEX

Déployer une application sur un serveur physique traditionnel implique
un investissement initial lourd : achat de machines, onduleurs, licences
logicielles, câblage réseau. Ce sont des **charges CAPEX** (Capital
Expenditure) — immobilisées au bilan, amorties sur plusieurs années,
payées avant même d'avoir un seul utilisateur.

Avec Vercel + Supabase, le modèle bascule entièrement en **OPEX**
(Operational Expenditure) : on paie à l'usage, à la consommation réelle.
Le plan gratuit de Vercel couvre des millions de requêtes par mois, et
Supabase offre 500 MB de base de données et 1 GB de storage gratuitement.
Pour un projet en phase de lancement comme Auto-Loc, le coût initial est
**zéro**. On ne paie que si l'application connaît un succès réel, ce qui
aligne le coût sur la valeur générée — c'est la logique fondamentale du
Cloud et du modèle SaaS.

### 2. Scalabilité Vercel vs Data Center Physique

Un data center local nécessite une capacité dimensionnée pour le pic
maximal anticipé : si 1 000 utilisateurs simultanés sont prévus, il faut
des serveurs capables de les absorber, même si 99% du temps seuls 10
utilisateurs sont connectés. La climatisation, les serveurs rack, les
groupes électrogènes tournent en permanence — c'est du gaspillage
structurel.

Vercel repose sur une architecture **Serverless** et **Edge Network** :
les fonctions Next.js s'exécutent à la demande, se multiplient
automatiquement en cas de pic, puis disparaissent. Il n'y a pas de
serveur à "chauffer". La scalabilité est horizontale, automatique et
mondiale : si un client algérien réserve une voiture, Vercel sert la
requête depuis le nœud Edge le plus proche, réduisant la latence sans
aucune configuration manuelle.

### 3. Données Structurées vs Non-Structurées dans Auto-Loc

Les **données structurées** sont celles stockées dans PostgreSQL via
Supabase : les tables `voitures` (marque, modèle, prix/jour) et
`reservations` (dates, statut, clés étrangères). Elles respectent un
schéma strict, sont requêtables en SQL, indexables et relationnelles.

Les **données non-structurées** sont les photos de permis de conduire
uploadées dans **Supabase Storage**. Ce sont des fichiers binaires
(JPEG, PDF) sans schéma interne exploitable par une base de données
relationnelle. Supabase Storage les gère via un système de buckets
compatible S3, découplé du moteur PostgreSQL, ce qui illustre parfaitement
la complémentarité des deux types de stockage dans une architecture
Cloud moderne.