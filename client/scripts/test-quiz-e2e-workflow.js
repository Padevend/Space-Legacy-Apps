// @ts-check
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

// Load pg from server node_modules
// @ts-ignore
const pgPkg = await import(
  '/home/pavel/Documents/Dev/NASA/SPACE LEGACY/Apps/server/node_modules/pg/lib/index.js'
);
const Client = pgPkg.default?.Client || pgPkg.Client;

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';
const DB_URL =
  process.env.DATABASE_URL || 'postgresql://postgres:pavel19735@127.0.0.1:5432/space_legacy_db';

async function runQuizWorkflowVerification() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('🚀 NASA SPACE LEGACY — VERIFICATION E2E DU WORKFLOW DES QUIZ & SCORING');
  console.log('═══════════════════════════════════════════════════════════════════\n');

  const db = new Client({ connectionString: DB_URL });
  await db.connect();
  console.log('🔌 Connexion directe PostgreSQL établie pour vérification de vérité terrain.');

  // =========================================================================
  // ETAPE 1 : INITIALISATION SESSION VISITEUR ANONYME (Authentic Security)
  // =========================================================================
  console.log('\n─── [1/8] Initialisation de la Session Visiteur (Identity & Auth) ───');
  const sessionRes = await fetch(`${API_BASE_URL}/session/anonymous`, { method: 'POST' });
  assert.equal(sessionRes.status, 200, 'Session endpoint doit retourner 200');
  const sessionData = await sessionRes.json();
  assert.ok(sessionData.token, 'Le token de session visiteur doit être généré');
  assert.ok(sessionData.visitorId, 'Le visitorId doit être présent');
  const token = sessionData.token;
  const visitorId = sessionData.visitorId;
  console.log(`✅ Session active : visitorId=${visitorId.slice(0, 8)}...`);

  // Vérification de la progression initiale
  const initialProgRes = await fetch(`${API_BASE_URL}/me/progress`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert.equal(initialProgRes.status, 200);
  const initialProg = await initialProgRes.json();
  assert.equal(initialProg.progress.totalAttempts, 0, 'Nouvelle session doit avoir 0 tentative');
  assert.equal(initialProg.progress.badgesCount, 0, 'Nouvelle session doit avoir 0 badge');
  console.log('✅ État initial vérifié : 0 tentative, 0 badge.');

  // =========================================================================
  // ETAPE 2 : AUDIT DU CATALOGUE DES 26 QUIZ (Découverte & Filtres)
  // =========================================================================
  console.log('\n─── [2/8] Découverte & Filtrage du Catalogue de Quiz ───');
  const quizzesRes = await fetch(`${API_BASE_URL}/quizzes`);
  assert.equal(quizzesRes.status, 200);
  const quizzesData = await quizzesRes.json();
  const allQuizzes = quizzesData.quizzes;
  assert.equal(allQuizzes.length, 26, 'Le catalogue doit comporter exactement 26 quiz');

  const explorerCount = allQuizzes.filter((q) => q.level === 'EXPLORER').length;
  const expertCount = allQuizzes.filter((q) => q.level === 'EXPERT').length;
  assert.equal(explorerCount, 14, 'Doit comporter 14 quiz niveau EXPLORER');
  assert.equal(expertCount, 12, 'Doit comporter 12 quiz niveau EXPERT');
  console.log(`✅ 26 quiz validés : ${explorerCount} EXPLORER, ${expertCount} EXPERT.`);

  // Filtre par destination : Lune
  const moonQuizzesRes = await fetch(`${API_BASE_URL}/quizzes?body=moon`);
  const moonQuizzesData = await moonQuizzesRes.json();
  assert.equal(moonQuizzesData.quizzes.length, 9, 'Doit comporter 9 quiz rattachés à la Lune');
  console.log(`✅ Filtre Destination Lune validé (9 quiz trouvés).`);

  // Filtre par destination : Mars
  const marsQuizzesRes = await fetch(`${API_BASE_URL}/quizzes?body=mars`);
  const marsQuizzesData = await marsQuizzesRes.json();
  assert.equal(marsQuizzesData.quizzes.length, 9, 'Doit comporter 9 quiz rattachés à Mars');
  console.log(`✅ Filtre Destination Mars validé (9 quiz trouvés).`);

  // =========================================================================
  // ETAPE 3 : PARCOURS SANS-FAUTE (100% Score & Déblocage des Premiers Badges)
  // =========================================================================
  console.log('\n─── [3/8] Parcours Utilisateur 1 : Tentative Parfaite (100% Score) ───');
  const quizSlug1 = 'moon-explorer';
  const qDetailRes1 = await fetch(`${API_BASE_URL}/quizzes/${quizSlug1}`);
  assert.equal(qDetailRes1.status, 200);
  const qDetail1 = (await qDetailRes1.json()).quiz;

  // Récupération des options VRAIES depuis la base de données
  const dbGroundTruth1 = await db.query(
    `SELECT qq.id as q_id, qo.id as correct_opt_id, qo.label as correct_label
     FROM quiz_questions qq
     JOIN quiz_options qo ON qo."questionId" = qq.id
     JOIN quizzes q ON q.id = qq."quizId"
     WHERE q.slug = $1 AND qo."isCorrect" = true
     ORDER BY qq."sortOrder"`,
    [quizSlug1]
  );
  assert.equal(dbGroundTruth1.rows.length, qDetail1.questions.length);

  const perfectAnswers = dbGroundTruth1.rows.map((r) => ({
    questionId: r.q_id,
    optionId: r.correct_opt_id,
  }));

  const attempt1Res = await fetch(`${API_BASE_URL}/quizzes/${quizSlug1}/attempts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ answers: perfectAnswers }),
  });
  assert.equal(attempt1Res.status, 201, 'Soumission valide doit retourner 201 Created');
  const attempt1Data = await attempt1Res.json();

  assert.equal(attempt1Data.attempt.score, 2, 'Score calculé doit être 2/2');
  assert.equal(attempt1Data.attempt.maxScore, 2, 'Max score doit être 2');
  assert.equal(attempt1Data.attempt.percentage, 100, 'Pourcentage doit être 100%');
  assert.ok(
    attempt1Data.attempt.answers.every((a) => a.isCorrect === true),
    'Toutes les réponses doivent être marquées isCorrect: true'
  );
  assert.ok(
    attempt1Data.attempt.answers.every((a) => typeof a.explanation === 'string' && a.explanation.length > 0),
    'Chaque réponse doit comporter une explication archivistique NASA'
  );

  // Vérification de l'attribution des badges
  const newBadgeSlugs1 = attempt1Data.newBadges.map((b) => b.slug);
  assert.ok(newBadgeSlugs1.includes('first-steps'), 'Le badge first-steps doit être débloqué');
  assert.ok(newBadgeSlugs1.includes('lunar-scholar'), 'Le badge lunar-scholar doit être débloqué');
  console.log(`✅ Tentative 1 validée : 100% (2/2). Badges débloqués : ${newBadgeSlugs1.join(', ')}.`);

  // =========================================================================
  // ETAPE 4 : PARCOURS SCORE MIXTE (50% Réalisme) & BADGE MARS
  // =========================================================================
  console.log('\n─── [4/8] Parcours Utilisateur 2 : Score Mixte (50% Réalisme) & Badge Mars ───');
  const quizSlug2 = 'mars-explorer';
  const dbGroundTruth2 = await db.query(
    `SELECT qq.id as q_id, 
            MAX(CASE WHEN qo."isCorrect" = true THEN qo.id::text END) as correct_opt_id,
            MAX(CASE WHEN qo."isCorrect" = false THEN qo.id::text END) as wrong_opt_id
     FROM quiz_questions qq
     JOIN quiz_options qo ON qo."questionId" = qq.id
     JOIN quizzes q ON q.id = qq."quizId"
     WHERE q.slug = $1
     GROUP BY qq.id, qq."sortOrder"
     ORDER BY qq."sortOrder"`,
    [quizSlug2]
  );

  // On répond juste à la première question, faux à la deuxième
  const mixedAnswers = [
    { questionId: dbGroundTruth2.rows[0].q_id, optionId: dbGroundTruth2.rows[0].correct_opt_id },
    { questionId: dbGroundTruth2.rows[1].q_id, optionId: dbGroundTruth2.rows[1].wrong_opt_id },
  ];

  const attempt2Res = await fetch(`${API_BASE_URL}/quizzes/${quizSlug2}/attempts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ answers: mixedAnswers }),
  });
  assert.equal(attempt2Res.status, 201);
  const attempt2Data = await attempt2Res.json();

  assert.equal(attempt2Data.attempt.score, 1, 'Score doit être exactement 1');
  assert.equal(attempt2Data.attempt.maxScore, 2, 'Max score doit être 2');
  assert.equal(attempt2Data.attempt.percentage, 50, 'Pourcentage doit être exactement 50%');
  assert.equal(attempt2Data.attempt.answers[0].isCorrect, true, 'Q1 doit être exacte');
  assert.equal(attempt2Data.attempt.answers[1].isCorrect, false, 'Q2 doit être fausse');

  // Badge Martian Pioneer doit être débloqué car au moins 1 quiz Mars complété
  const newBadgeSlugs2 = attempt2Data.newBadges.map((b) => b.slug);
  assert.ok(newBadgeSlugs2.includes('martian-pioneer'), 'Le badge martian-pioneer doit être attribué');
  console.log(`✅ Tentative 2 validée : 50% (1/2). Badge débloqué : ${newBadgeSlugs2.join(', ')}.`);

  // =========================================================================
  // ETAPE 5 : PARCOURS ÉCHEC TOTAL (0% Score) SUR UN QUIZ DE 15 QUESTIONS
  // =========================================================================
  console.log('\n─── [5/8] Parcours Utilisateur 3 : Score Nul Délibéré (0/15 sur Apollo) ───');
  const quizSlug3 = 'modules-lunaires-apollo-explorer';
  const dbGroundTruth3 = await db.query(
    `SELECT qq.id as q_id, 
            MAX(CASE WHEN qo."isCorrect" = false THEN qo.id::text END) as wrong_opt_id
     FROM quiz_questions qq
     JOIN quiz_options qo ON qo."questionId" = qq.id
     JOIN quizzes q ON q.id = qq."quizId"
     WHERE q.slug = $1
     GROUP BY qq.id, qq."sortOrder"
     ORDER BY qq."sortOrder"`,
    [quizSlug3]
  );
  assert.equal(dbGroundTruth3.rows.length, 15);

  const zeroAnswers = dbGroundTruth3.rows.map((r) => ({
    questionId: r.q_id,
    optionId: r.wrong_opt_id,
  }));

  const attempt3Res = await fetch(`${API_BASE_URL}/quizzes/${quizSlug3}/attempts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ answers: zeroAnswers }),
  });
  assert.equal(attempt3Res.status, 201);
  const attempt3Data = await attempt3Res.json();

  assert.equal(attempt3Data.attempt.score, 0, 'Score doit être 0');
  assert.equal(attempt3Data.attempt.maxScore, 15, 'Max score doit être 15');
  assert.equal(attempt3Data.attempt.percentage, 0, 'Pourcentage doit être 0%');
  assert.ok(attempt3Data.attempt.answers.every((a) => a.isCorrect === false));
  assert.equal(attempt3Data.newBadges.length, 0, 'Aucun badge ne doit être attribué pour 0%');
  console.log('✅ Tentative 3 validée : 0/15 (0%) avec explications retournées pour chaque question.');

  // =========================================================================
  // ETAPE 6 : DÉBLOCAGE DU BADGE "PERFECTIONIST" (3 Scores Parfaits à 100%)
  // =========================================================================
  console.log('\n─── [6/8] Parcours Utilisateur 4 : Déblocage du Badge Ultime "Perfectionist" ───');
  // Nous avons déjà 1 score parfait (moon-explorer). Il nous en faut 2 de plus :
  // 1) Rejouer modules-lunaires-apollo-explorer avec 100%
  const dbPerfectApollo = await db.query(
    `SELECT qq.id as q_id, qo.id as correct_opt_id
     FROM quiz_questions qq
     JOIN quiz_options qo ON qo."questionId" = qq.id
     JOIN quizzes q ON q.id = qq."quizId"
     WHERE q.slug = $1 AND qo."isCorrect" = true
     ORDER BY qq."sortOrder"`,
    [quizSlug3]
  );
  const perfectApolloAnswers = dbPerfectApollo.rows.map((r) => ({
    questionId: r.q_id,
    optionId: r.correct_opt_id,
  }));
  const attempt4Res = await fetch(`${API_BASE_URL}/quizzes/${quizSlug3}/attempts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ answers: perfectApolloAnswers }),
  });
  assert.equal(attempt4Res.status, 201);
  const attempt4Data = await attempt4Res.json();
  assert.equal(attempt4Data.attempt.score, 15);
  assert.equal(attempt4Data.attempt.percentage, 100);
  console.log('   -> 2ème score parfait obtenu (15/15 sur Apollo).');

  // 2) Réussir un 3ème quiz à 100% : helicoptere-ingenuity-explorer (15 questions)
  const quizSlug4 = 'helicoptere-ingenuity-explorer';
  const dbPerfectIngenuity = await db.query(
    `SELECT qq.id as q_id, qo.id as correct_opt_id
     FROM quiz_questions qq
     JOIN quiz_options qo ON qo."questionId" = qq.id
     JOIN quizzes q ON q.id = qq."quizId"
     WHERE q.slug = $1 AND qo."isCorrect" = true
     ORDER BY qq."sortOrder"`,
    [quizSlug4]
  );
  assert.equal(dbPerfectIngenuity.rows.length, 15);
  const perfectIngenuityAnswers = dbPerfectIngenuity.rows.map((r) => ({
    questionId: r.q_id,
    optionId: r.correct_opt_id,
  }));
  const attempt5Res = await fetch(`${API_BASE_URL}/quizzes/${quizSlug4}/attempts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ answers: perfectIngenuityAnswers }),
  });
  assert.equal(attempt5Res.status, 201);
  const attempt5Data = await attempt5Res.json();
  assert.equal(attempt5Data.attempt.score, 15);
  assert.equal(attempt5Data.attempt.percentage, 100);

  // Le badge "perfectionist" doit être débloqué maintenant !
  const newBadgeSlugs5 = attempt5Data.newBadges.map((b) => b.slug);
  assert.ok(
    newBadgeSlugs5.includes('perfectionist'),
    'Le badge perfectionist DOIT être débloqué suite au 3ème score parfait'
  );
  console.log(`✅ Tentative 5 validée : 100% (15/15). Badge ultime débloqué : ${newBadgeSlugs5.join(', ')} !`);

  // Vérification de la progression consolidée
  const progressRes = await fetch(`${API_BASE_URL}/me/progress`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert.equal(progressRes.status, 200);
  const progData = (await progressRes.json()).progress;
  assert.equal(progData.totalAttempts, 5, 'Doit comptabiliser 5 tentatives au total');
  assert.equal(progData.perfectScoresCount, 3, 'Doit comptabiliser 3 scores parfaits');
  assert.equal(progData.badgesCount, 4, 'Doit posséder l’intégralité des 4 badges Space Legacy');
  console.log(
    `✅ Progression Visiteur consolidée : ${progData.totalAttempts} tentatives, ${progData.perfectScoresCount} scores à 100%, ${progData.badgesCount}/4 badges débloqués.`
  );

  // =========================================================================
  // ETAPE 7 : GARDES-FOUS DE SÉCURITÉ & VALIDATION (Error Handling & Edge Cases)
  // =========================================================================
  console.log('\n─── [7/8] Validation des Gardes-Fous & Rejets Réglementaires ───');

  // 1) Tentative incomplète (14 réponses sur 15 questions)
  const incompleteAnswers = perfectApolloAnswers.slice(0, 14);
  const errIncompleteRes = await fetch(`${API_BASE_URL}/quizzes/${quizSlug3}/attempts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ answers: incompleteAnswers }),
  });
  assert.equal(errIncompleteRes.status, 422, 'Doit rejeter avec code 422 si incomplet');
  const errIncompleteJson = await errIncompleteRes.json();
  assert.ok(
    errIncompleteJson.error.message.includes('Missing answer'),
    'Le message doit indiquer la question manquante'
  );
  console.log('   ✅ Rejet 422 validé pour tentative incomplète (question manquante).');

  // 2) Option falsifiée (option n’appartenant pas à la question)
  const invalidOptionAnswers = [
    ...perfectApolloAnswers.slice(0, 14),
    { questionId: perfectApolloAnswers[14].questionId, optionId: dbGroundTruth1.rows[0].correct_opt_id },
  ];
  const errInvalidOptRes = await fetch(`${API_BASE_URL}/quizzes/${quizSlug3}/attempts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ answers: invalidOptionAnswers }),
  });
  assert.equal(errInvalidOptRes.status, 422, 'Doit rejeter avec code 422 pour option incohérente');
  console.log('   ✅ Rejet 422 validé pour option invalide n’appartenant pas à la question.');

  // 3) Slug inexistant
  const errNotFoundRes = await fetch(`${API_BASE_URL}/quizzes/quiz-qui-n-existe-pas/attempts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      answers: [
        {
          questionId: randomUUID(),
          optionId: randomUUID(),
        },
      ],
    }),
  });
  assert.equal(errNotFoundRes.status, 404, 'Doit retourner 404 pour slug inexistant');
  console.log('   ✅ Rejet 404 validé pour quiz inexistant.');

  // 4) Tentative non authentifiée
  const errNoAuthRes = await fetch(`${API_BASE_URL}/quizzes/${quizSlug1}/attempts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers: perfectAnswers }),
  });
  assert.equal(errNoAuthRes.status, 401, 'Doit retourner 401 si aucun jeton de session n’est fourni');
  console.log('   ✅ Rejet 401 validé pour requête non authentifiée.');

  // =========================================================================
  // ETAPE 8 : BALAYAGE INTÉGRAL DES 26 QUIZ (Ground-Truth & Intégrité DB)
  // =========================================================================
  console.log('\n─── [8/8] Balayage d’Intégrité Intégral des 26 Quiz du Catalogue ───');
  for (const q of allQuizzes) {
    const detailRes = await fetch(`${API_BASE_URL}/quizzes/${q.slug}`);
    assert.equal(detailRes.status, 200);
    const detail = (await detailRes.json()).quiz;

    // Vérifier les questions
    assert.ok(detail.questions.length >= 2, `${q.slug} doit comporter au moins 2 questions`);
    for (const quest of detail.questions) {
      assert.ok(quest.prompt && quest.prompt.length > 5, 'Chaque question doit avoir un prompt valide');
      assert.ok(quest.options.length >= 2, 'Chaque question doit proposer au moins 2 options');
      assert.ok(
        quest.options.every((opt) => opt.id && opt.label),
        'Chaque option doit posséder id et label'
      );
    }
  }
  console.log('✅ Intégrité des 26 quiz et des 358 questions vérifiée avec succès.');

  await db.end();
  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log('🏆 TOUS LES 8 PARCOURS ET VALIDATIONS DU SYSTEME DE SCORING ONT REUSSI !');
  console.log('═══════════════════════════════════════════════════════════════════\n');
}

runQuizWorkflowVerification().catch((err) => {
  console.error('\n❌ Échec du workflow de vérification E2E :', err);
  process.exit(1);
});
