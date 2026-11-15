// @ts-check
import assert from 'node:assert/strict';

const API_BASE_URL = 'http://localhost:3000/api/v1';

async function runTests() {
  console.log('🧪 Starting Space Legacy Frontend Functional API Tests...\n');

  // Test 1: Health Probe
  console.log('1. Testing GET /health/live ...');
  const healthRes = await fetch(`${API_BASE_URL}/health/live`);
  assert.equal(healthRes.status, 200, 'Health check should return status 200');
  const healthJson = await healthRes.json();
  assert.equal(healthJson.data.status, 'ok', 'Status should be ok');
  console.log('   ✅ Health Probe verified.');

  // Test 2: Anonymous Session
  console.log('\n2. Testing POST /session/anonymous ...');
  const sessionRes = await fetch(`${API_BASE_URL}/session/anonymous`, { method: 'POST' });
  assert.equal(sessionRes.status, 200, 'Session init should return 200');
  const sessionJson = await sessionRes.json();
  assert.ok(sessionJson.token, 'Should return a token');
  assert.ok(sessionJson.visitorId, 'Should return a visitorId');
  const visitorToken = sessionJson.token;
  console.log(`   ✅ Anonymous Session initialized (visitorId: ${sessionJson.visitorId.slice(0, 8)}...).`);

  // Test 3: Celestial Bodies
  console.log('\n3. Testing GET /bodies ...');
  const bodiesRes = await fetch(`${API_BASE_URL}/bodies`);
  assert.equal(bodiesRes.status, 200);
  const bodiesJson = await bodiesRes.json();
  assert.ok(Array.isArray(bodiesJson.bodies), 'bodies should be an array');
  assert.ok(bodiesJson.bodies.length >= 2, 'Should have at least Moon and Mars');
  const moon = bodiesJson.bodies.find((b) => b.slug === 'moon');
  const mars = bodiesJson.bodies.find((b) => b.slug === 'mars');
  assert.ok(moon && mars, 'Moon and Mars must be present');
  console.log(`   ✅ Bodies verified: ${bodiesJson.bodies.map((b) => b.name).join(', ')}.`);

  // Test 4: Machines List & Facets
  console.log('\n4. Testing GET /machines ...');
  const machinesRes = await fetch(`${API_BASE_URL}/machines?limit=20`);
  assert.equal(machinesRes.status, 200);
  const machinesJson = await machinesRes.json();
  assert.ok(Array.isArray(machinesJson.data), 'machines data should be an array');
  assert.equal(machinesJson.pagination.total, 7, 'Should have exactly 7 machines in dataset');
  assert.ok(machinesJson.facets, 'Facets should be calculated');
  console.log(`   ✅ Machines verified: ${machinesJson.data.length} items loaded (total: ${machinesJson.pagination.total}).`);

  // Test 5: Machine Detail (Apollo 11 Eagle)
  console.log('\n5. Testing GET /machines/apollo-11-lm ...');
  const detailRes = await fetch(`${API_BASE_URL}/machines/apollo-11-lm`);
  assert.equal(detailRes.status, 200);
  const detailJson = await detailRes.json();
  assert.ok(detailJson.machine, 'Machine detail should exist');
  assert.equal(detailJson.machine.slug, 'apollo-11-lm');
  assert.ok(detailJson.machine.events.length > 0, 'Should have chronological events');
  assert.ok(detailJson.machine.facts.length > 0, 'Should have verified facts');
  assert.ok(detailJson.machine.sources.length > 0, 'Should have primary sources');
  console.log(`   ✅ Machine Detail verified (${detailJson.machine.name}, ${detailJson.machine.events.length} events, ${detailJson.machine.facts.length} facts).`);

  // Test 6: Machine Logbook
  console.log('\n6. Testing GET /machines/apollo-11-lm/logbook ...');
  const logbookRes = await fetch(`${API_BASE_URL}/machines/apollo-11-lm/logbook`);
  assert.equal(logbookRes.status, 200);
  const logbookJson = await logbookRes.json();
  assert.ok(logbookJson.entries && logbookJson.entries.length > 0, 'Logbook should have entries');
  console.log(`   ✅ Machine Logbook verified (${logbookJson.entries.length} entries for ${logbookJson.machine.name}).`);

  // Test 7: Quizzes List
  console.log('\n7. Testing GET /quizzes ...');
  const quizzesRes = await fetch(`${API_BASE_URL}/quizzes`);
  assert.equal(quizzesRes.status, 200);
  const quizzesJson = await quizzesRes.json();
  assert.ok(Array.isArray(quizzesJson.quizzes), 'Quizzes should be an array');
  assert.equal(quizzesJson.quizzes.length, 26, 'Should have 26 quizzes loaded');
  console.log(`   ✅ Quizzes List verified (Total 26 quizzes across Explorer and Expert levels).`);

  // Test 8: Quiz Detail & Options
  console.log('\n8. Testing GET /quizzes/moon-explorer ...');
  const quizDetailRes = await fetch(`${API_BASE_URL}/quizzes/moon-explorer`);
  assert.equal(quizDetailRes.status, 200);
  const quizDetailJson = await quizDetailRes.json();
  assert.ok(quizDetailJson.quiz.questions.length > 0, 'Should have questions');
  const firstQ = quizDetailJson.quiz.questions[0];
  assert.ok(firstQ.options.length >= 2, 'Question should have options');
  console.log(`   ✅ Quiz Detail verified (${quizDetailJson.quiz.title}, ${quizDetailJson.quiz.questions.length} questions).`);

  // Test 9: Submit Quiz Attempt & Award Badges
  console.log('\n9. Testing POST /quizzes/moon-explorer/attempts ...');
  const firstOption = firstQ.options.find((o) => o.label === 'Mare Tranquillitatis');
  const secondQ = quizDetailJson.quiz.questions[1];
  const secondOption = secondQ.options.find((o) => o.label === 'Surveyor 1');

  const attemptRes = await fetch(`${API_BASE_URL}/quizzes/moon-explorer/attempts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${visitorToken}`,
    },
    body: JSON.stringify({
      answers: [
        { questionId: firstQ.id, optionId: firstOption.id },
        { questionId: secondQ.id, optionId: secondOption.id },
      ],
    }),
  });
  assert.equal(attemptRes.status, 201, 'Attempt submission should return 201 Created');
  const attemptJson = await attemptRes.json();
  assert.equal(attemptJson.attempt.percentage, 100, 'Score should be 100%');
  assert.ok(Array.isArray(attemptJson.newBadges), 'Should return awarded badges');
  assert.ok(attemptJson.newBadges.length >= 1, 'Should unlock at least First Steps badge');
  console.log(`   ✅ Quiz Attempt scored 100%! Badges awarded: ${attemptJson.newBadges.map((b) => b.name).join(', ')}.`);

  // Test 10: Badges & Visitor Progress
  console.log('\n10. Testing GET /me/progress ...');
  const progressRes = await fetch(`${API_BASE_URL}/me/progress`, {
    headers: { Authorization: `Bearer ${visitorToken}` },
  });
  assert.equal(progressRes.status, 200);
  const progressJson = await progressRes.json();
  assert.equal(progressJson.progress.completedQuizzesCount, 1);
  assert.equal(progressJson.progress.perfectScoresCount, 1);
  assert.ok(progressJson.progress.badgesCount >= 1);
  console.log(`   ✅ Visitor Progress verified: ${progressJson.progress.completedQuizzesCount} quiz completed, ${progressJson.progress.badgesCount} badges.`);

  console.log('\n🎉 ALL 10 FUNCTIONAL END-TO-END TESTS PASSED SUCCESSFULLY! 🚀');
}

runTests().catch((err) => {
  console.error('\n❌ Functional test failed:', err);
  process.exit(1);
});
