# 🔥 Analyse Intelligente des CV – Projet IA (Recrutement)

## 📌 Description du projet
Ce projet consiste à développer une **application intelligente d’analyse et de matching de CVs avec des offres d’emploi**, basée sur des techniques de **NLP (Traitement Automatique du Langage Naturel)** et de **Machine Learning**.

L’objectif est d’aider les recruteurs à :
- analyser automatiquement les CV,
- extraire les informations clés,
- comparer les profils candidats avec une offre d’emploi,
- classer les candidats selon leur pertinence.

## 🎯 Objectifs
- Automatiser l’analyse des CV (PDF, DOCX)
- Extraire des informations structurées (nom, email, compétences, diplômes, expérience)
- Appliquer un matching intelligent CV ↔ Job
- Fournir une API backend prête à être consommée par un frontend web

## 🧠 Fonctionnalités principales
- 📤 Upload de CV
- 📄 Extraction du texte
- 🧩 Extraction NLP avancée (nom, email, skills, diplômes, expérience)
- 🧹 Prétraitement du texte
- 🔢 Vectorisation (BERT)
- 🔍 Matching CV ↔ Offre d’emploi
- 🏆 Classement automatique des CV
- 💾 Sauvegarde des données et scores en base MySQL

## 🏗️ Architecture technique du projet

### Backend
Le backend assure la gestion des données, le traitement IA et l’exposition des services via une API REST.

- **Framework** : FastAPI (Python)
- **Base de données** : MySQL (hébergée sur Clever Cloud)
- **ORM** : SQLAlchemy
- **Traitement IA / NLP** :
  - spaCy (extraction d’informations)
  - HuggingFace Transformers – BERT (vectorisation sémantique)
  - Scikit-learn (similarité et scoring)

### Frontend
Le frontend fournit une interface web intuitive destinée aux recruteurs pour exploiter les résultats de l’analyse intelligente.

**Fonctionnalités principales :**
- Upload des CV et des offres d’emploi
- Analyse et matching automatique des profils
- Classement des candidats par pertinence
- Visualisation des scores et des informations extraites

**Technologies utilisées :**
- Angular
- TypeScript
- Bootstrap / Tailwind CSS
- Chart.js (visualisation des statistiques)


### 👩‍💻 Aya Essouiri
Étudiante en **Transformation Digitale & Intelligence Artificielle**  
**ENSAH – Al Hoceima**



