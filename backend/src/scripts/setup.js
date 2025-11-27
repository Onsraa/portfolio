import { config as dotenvConfig } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import crypto from 'crypto';
import fs from 'fs';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement
dotenvConfig({ path: join(__dirname, '../../.env') });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));

async function setup() {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   🔧 Configuration initiale du Portfolio                 ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
  `);

  // Import dynamique après le chargement de dotenv
  const { initDatabase } = await import('../config/database.js');
  const { User, Experience, Project, Skill, Settings } = await import('../models/index.js');
  const config = (await import('../config/index.js')).default;

  // Initialiser la base de données
  await initDatabase();
  console.log('✓ Base de données initialisée\n');

  // Vérifier si un admin existe déjà
  if (User.adminExists()) {
    console.log('⚠️  Un administrateur existe déjà.');
    const answer = await question('Voulez-vous créer un nouvel admin ? (o/n) ');
    if (answer.toLowerCase() !== 'o') {
      console.log('\nConfiguration terminée.');
      rl.close();
      process.exit(0);
    }
  }

  // Créer l'admin
  console.log('\n📝 Création du compte administrateur\n');
  
  let username = await question(`Nom d'utilisateur [${config.admin.username}]: `);
  username = username || config.admin.username;
  
  let email = await question(`Email [${config.admin.email}]: `);
  email = email || config.admin.email;
  
  let password = await question('Mot de passe (min 8 caractères): ');
  while (password.length < 8) {
    console.log('⚠️  Le mot de passe doit contenir au moins 8 caractères');
    password = await question('Mot de passe (min 8 caractères): ');
  }

  try {
    const user = User.create({ username, email, password, role: 'admin' });
    console.log(`\n✓ Administrateur créé: ${user.username}`);
  } catch (error) {
    if (error.message && error.message.includes('UNIQUE')) {
      console.log('\n⚠️  Cet utilisateur existe déjà');
    } else {
      throw error;
    }
  }

  // Initialiser les paramètres
  Settings.initDefaults();
  console.log('✓ Paramètres initialisés');

  // Demander si on veut importer les données de démo
  const importDemo = await question('\nImporter les données de démonstration ? (o/n) ');
  
  if (importDemo.toLowerCase() === 'o') {
    await importDemoData(Experience, Project, Skill);
  }

  // Générer une clé JWT si le fichier .env n'existe pas
  const envPath = join(__dirname, '../../.env');
  if (!fs.existsSync(envPath)) {
    const jwtSecret = crypto.randomBytes(64).toString('hex');
    const envContent = `# Configuration générée automatiquement
PORT=3001
NODE_ENV=development

# JWT - Clé secrète générée automatiquement
JWT_SECRET=${jwtSecret}
JWT_EXPIRES_IN=7d

# Admin
ADMIN_USERNAME=${username}
ADMIN_EMAIL=${email}

# CORS
FRONTEND_URL=http://localhost:5173

# Base de données
DATABASE_PATH=./data/portfolio.db

# Upload
UPLOAD_MAX_SIZE=5242880
UPLOAD_PATH=./uploads
`;
    fs.writeFileSync(envPath, envContent);
    console.log('✓ Fichier .env créé');
  }

  console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   ✅ Configuration terminée !                            ║
║                                                          ║
║   Démarrez le serveur avec: npm run dev                  ║
║                                                          ║
║   Connexion admin:                                       ║
║   - URL:      http://localhost:5173/admin                ║
║   - Username: ${username.padEnd(39)}║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
  `);

  rl.close();
  process.exit(0);
}

async function importDemoData(Experience, Project, Skill) {
  console.log('\n📦 Import des données de démonstration...\n');

  // Expériences
  const experiences = [
    {
      period: '2025 — présent',
      company: 'UQAC',
      role: 'Développeur Unity',
      description: 'Développement du jeu sérieux Cogni-Actif qui a pour but de simplifier l\'intégration d\'activité physique en milieu scolaire.',
      tech: ['C#', 'Unity'],
      is_current: true,
      is_internship: false,
    },
    {
      period: '2023 — 2025',
      company: 'SNCF Réseau',
      role: 'Apprenti Ingénieur Logiciel',
      description: 'Développement d\'outils afin d\'accélérer la productivité des ingénieurs AutoCAD/BricsCAD. Mise en place d\'outils d\'analyses permettant d\'optimiser les dépenses.',
      tech: ['C#', 'VB (.NET)', 'Lisp (AutoLisp)', 'AutoCAD', 'BricsCAD', 'Python', 'Power Automate'],
      is_current: false,
      is_internship: true,
    },
    {
      period: '2022 — 2023',
      company: 'Numérique Gagnant',
      role: 'Apprenti Développeur',
      description: 'Développement d\'applications et d\'outils pour améliorer la productivité des entreprises collaboratrices.',
      tech: ['PHP', 'NodeJS', 'MySQL', 'Powershell', 'VBA', 'Windev28', 'Power Automate'],
      is_current: false,
      is_internship: true,
    },
  ];

  for (const exp of experiences) {
    Experience.create(exp);
  }
  console.log(`✓ ${experiences.length} expériences importées`);

  // Projets
  const projects = [
    {
      project_id: '001',
      title: 'Robozzle',
      description: 'Reproduction du jeu Robozzle créé par Igor Ostrovsky sous forme d\'un test technique.',
      tech: ['Rust', 'Bevy'],
      year: '2025',
      link: 'https://github.com/Onsraa/robozzle',
    },
    {
      project_id: '002',
      title: 'Particle Life Simulator',
      description: 'Simulateur de particules de vie en 3D avec pour objectif de déterminer la meilleure population qui pourrait survivre.',
      tech: ['Rust', 'Bevy', 'Algorithme génétique'],
      year: '2025',
      link: 'https://github.com/Onsraa/particle-life',
    },
    {
      project_id: '003',
      title: 'Machine Learning',
      description: 'Projet permettant de tester différents algorithmes d\'apprentissage sur des cas d\'études simples.',
      tech: ['Rust', 'Bevy'],
      year: '2025',
      link: 'https://github.com/Onsraa/machine-learning',
    },
  ];

  for (const proj of projects) {
    Project.create(proj);
  }
  console.log(`✓ ${projects.length} projets importés`);

  // Compétences
  const skills = {
    langages: ['Rust', 'C++', 'C#'],
    crates: ['bevy', 'tokio', 'thiserror'],
    softwares: ['Unity', 'AutoCAD', 'BricsCAD'],
  };

  for (const [category, names] of Object.entries(skills)) {
    Skill.replaceCategory(category, names);
  }
  console.log('✓ Compétences importées');
}

setup().catch(console.error);
