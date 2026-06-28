/**
 * mock-test.js — CrackAI Mock Test Suite v1.0.0 [Enterprise Level]
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * FEATURES:
 * ✅ 30 Exam Categories (CAT, SSC CGL, NEET, JEE, UPSC, School Classes, etc.)
 * ✅ Questions loaded from Firebase Storage (/mock folder)
 * ✅ Real-time analytics & performance tracking
 * ✅ Realistic Rank Prediction (based on lakhs of test-takers)
 * ✅ Percentage calculation for school classes
 * ✅ XP reward system (saved to user profile)
 * ✅ Beautiful, professional UI/UX
 * ✅ Progress tracking & question navigation
 * ✅ Results page with detailed stats
 * ✅ Mobile-responsive design
 * 
 * EXAM CATEGORIES:
 * - Government Exams: CAT, CDS, CGL, CHSL, CPO, CUET, GATE, GD, IBPS_PO, JEE, MTS, NDA, NEET, RRB_NTPC, UPSC
 * - School Classes: Class 1-12 (with Math, Science, English subjects)
 * - Arts/Commerce/Science streams for Class 11-12
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

(function() {
  'use strict';

  /* ─── CONSTANTS ─────────────────────────────────────────────────────────── */
  const STORAGE_BUCKET = 'rankgpt-f8a64.firebasestorage.app';
  const MOCK_FOLDER = 'mock';
  
  const EXAM_CATEGORIES = {
    // Government Exams
    'cat': { name: '📊 CAT', type: 'competitive', maxRank: 2000, totalTakers: 200000 },
    'cds': { name: '⚔️ CDS', type: 'military', maxRank: 5000, totalTakers: 150000 },
    'cgl': { name: '🏛️ SSC CGL', type: 'government', maxRank: 50000, totalTakers: 2000000 },
    'chsl': { name: '📝 SSC CHSL', type: 'government', maxRank: 80000, totalTakers: 1500000 },
    'cpo': { name: '🚔 SSC CPO', type: 'government', maxRank: 25000, totalTakers: 800000 },
    'cuet': { name: '🎓 CUET', type: 'university', maxRank: 1000000, totalTakers: 1400000 },
    'gate': { name: '🔬 GATE', type: 'engineering', maxRank: 60000, totalTakers: 900000 },
    'gd': { name: '🎬 GD (Group Discussion)', type: 'other', maxRank: 10000, totalTakers: 500000 },
    'ibps_po': { name: '🏦 IBPS PO', type: 'banking', maxRank: 20000, totalTakers: 1200000 },
    'jee': { name: '🧪 JEE Main/Advanced', type: 'engineering', maxRank: 100000, totalTakers: 1200000 },
    'mts': { name: '📋 SSC MTS', type: 'government', maxRank: 100000, totalTakers: 2500000 },
    'nda': { name: '🪖 NDA', type: 'military', maxRank: 5000, totalTakers: 400000 },
    'neet': { name: '⚕️ NEET', type: 'medical', maxRank: 1600000, totalTakers: 1600000 },
    'rrb_ntpc': { name: '🚂 RRB NTPC', type: 'railway', maxRank: 150000, totalTakers: 2000000 },
    'upsc': { name: '🏆 UPSC IAS', type: 'civil_service', maxRank: 1000, totalTakers: 1000000 },
    
    // School Classes
    'class1': { name: '📚 Class 1', type: 'school', maxRank: null, totalTakers: 5000000 },
    'class2': { name: '📚 Class 2', type: 'school', maxRank: null, totalTakers: 5000000 },
    'class3': { name: '📚 Class 3', type: 'school', maxRank: null, totalTakers: 5000000 },
    'class4': { name: '📚 Class 4', type: 'school', maxRank: null, totalTakers: 5000000 },
    'class5': { name: '📚 Class 5', type: 'school', maxRank: null, totalTakers: 5000000 },
    'class6': { name: '📚 Class 6', type: 'school', maxRank: null, totalTakers: 5000000 },
    'class7': { name: '📚 Class 7', type: 'school', maxRank: null, totalTakers: 5000000 },
    'class8': { name: '📚 Class 8', type: 'school', maxRank: null, totalTakers: 5000000 },
    'class9': { name: '📚 Class 9', type: 'school', maxRank: null, totalTakers: 5000000 },
    'class10': { name: '📚 Class 10 (Board)', type: 'school', maxRank: null, totalTakers: 4000000 },
    'class11_arts': { name: '📖 Class 11 (Arts)', type: 'school', maxRank: null, totalTakers: 2000000 },
    'class11_com': { name: '📊 Class 11 (Commerce)', type: 'school', maxRank: null, totalTakers: 2000000 },
    'class11_sci': { name: '🔬 Class 11 (Science)', type: 'school', maxRank: null, totalTakers: 2000000 },
    'class12_arts': { name: '📖 Class 12 (Arts)', type: 'school', maxRank: null, totalTakers: 1500000 },
    'class12_com': { name: '📊 Class 12 (Commerce)', type: 'school', maxRank: null, totalTakers: 1500000 },
    'class12_sci': { name: '🔬 Class 12 (Science)', type: 'school', maxRank: null, totalTakers: 1500000 }
  };

  /* ─── GLOBAL STATE ──────────────────────────────────────────────────────── */
  let mockTestState = {
    currentExam: null,
    questions: [],
    currentQuestionIndex: 0,
    answers: {},
    startTime: null,
    endTime: null,
    results: null,
    isLoading: false,
    analyticsData: {
      correctAnswers: 0,
      wrongAnswers: 0,
      skipped: 0,
      timePerQuestion: []
    }
  };

  /* ─── UTILITY FUNCTIONS ─────────────────────────────────────────────────── */
  
  /**
   * Get Firebase Storage URL for mock questions
   */
  function getStorageUrl(examCategory) {
    const bucket = STORAGE_BUCKET.replace('appspot.com', 'firebaseio.com');
    return `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o/${MOCK_FOLDER}%2F${examCategory}.json?alt=media`;
  }

  /**
   * Load questions from Firebase Storage
   */
  async function loadMockQuestions(examCategory) {
    try {
      mockTestState.isLoading = true;
      const url = getStorageUrl(examCategory);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to load questions for ${examCategory}`);
      }

      const data = await response.json();
      mockTestState.questions = Array.isArray(data) ? data : data.questions || [];
      mockTestState.currentQuestionIndex = 0;
      mockTestState.answers = {};
      mockTestState.analyticsData = {
        correctAnswers: 0,
        wrongAnswers: 0,
        skipped: 0,
        timePerQuestion: []
      };
      
      return mockTestState.questions;
    } catch (err) {
      console.error('Error loading mock questions:', err);
      showNotification('Failed to load questions. Please try again.', 'error');
      return [];
    } finally {
      mockTestState.isLoading = false;
    }
  }

  /**
   * Calculate realistic rank based on score and exam category
   */
  function calculateRankPrediction(score, totalQuestions, examCategory) {
    const category = EXAM_CATEGORIES[examCategory];
    if (!category) return null;

    const percentage = (score / totalQuestions) * 100;
    
    // For school classes, return percentage instead of rank
    if (category.type === 'school') {
      return {
        type: 'percentage',
        value: Math.round(percentage * 10) / 10,
        expectedGrade: getGradeFromPercentage(percentage),
        percentile: getPercentile(score, totalQuestions, category)
      };
    }

    // For competitive exams, calculate realistic rank
    const estimatedRank = Math.ceil((1 - (percentage / 100)) * category.totalTakers);
    const percentile = ((category.totalTakers - estimatedRank) / category.totalTakers) * 100;

    return {
      type: 'rank',
      value: estimatedRank,
      outOf: category.totalTakers,
      percentile: Math.round(percentile * 10) / 10,
      likelihood: getLikelihoodText(percentile, category)
    };
  }

  /**
   * Get grade from percentage (for school classes)
   */
  function getGradeFromPercentage(percentage) {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
  }

  /**
   * Get percentile rank
   */
  function getPercentile(score, totalQuestions, category) {
    const percentage = (score / totalQuestions) * 100;
    // Simulate realistic percentile distribution (normal curve)
    if (percentage >= 95) return 99.5;
    if (percentage >= 90) return 98;
    if (percentage >= 85) return 95;
    if (percentage >= 80) return 90;
    if (percentage >= 75) return 85;
    if (percentage >= 70) return 78;
    if (percentage >= 65) return 70;
    if (percentage >= 60) return 60;
    if (percentage >= 50) return 45;
    if (percentage >= 40) return 30;
    return Math.max(5, percentage);
  }

  /**
   * Get likelihood text based on percentile
   */
  function getLikelihoodText(percentile, category) {
    if (percentile >= 99) return '🔥 Exceptional - Top 1% chance';
    if (percentile >= 95) return '⭐ Excellent - Top 5% likely';
    if (percentile >= 90) return '✅ Very Good - Top 10% possible';
    if (percentile >= 80) return '👍 Good - Top 20% probable';
    if (percentile >= 70) return '📊 Average - Top 30% chance';
    if (percentile >= 50) return '⚠️ Below Average - Top 50%+';
    return '❌ Needs Improvement - Keep practicing';
  }

  /**
   * Calculate XP based on performance
   */
  function calculateXP(score, totalQuestions, timeTaken) {
    const baseXP = 50;
    const scoreBonus = Math.round((score / totalQuestions) * 100);
    const timeBonus = Math.max(0, 20 - (timeTaken / 60)); // Bonus for faster completion
    
    return Math.round(baseXP + scoreBonus + timeBonus);
  }

  /**
   * Save mock test results to Firestore
   */
  async function saveMockTestResults(examCategory, results) {
    try {
      const user = window._firebaseAuth?.currentUser;
      if (!user) {
        console.warn('User not logged in');
        return false;
      }

      const db = window._firebaseDb;
      const { doc, setDoc, updateDoc, arrayUnion } = window._firebaseFns;
      
      const mockTestRecord = {
        examCategory,
        timestamp: new Date().toISOString(),
        score: results.score,
        totalQuestions: results.totalQuestions,
        percentage: results.percentage,
        timeTaken: results.timeTaken,
        xp: results.xp,
        rank: results.rank,
        correctAnswers: results.correctAnswers,
        wrongAnswers: results.wrongAnswers
      };

      // Save individual mock test record
      const mockTestsRef = doc(db, 'users', user.uid, 'mockTests', `${examCategory}_${Date.now()}`);
      await setDoc(mockTestsRef, mockTestRecord);

      // Update user's total XP
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        mockTestXP: arrayUnion(results.xp),
        totalXP: (window._userData?.totalXP || 0) + results.xp,
        lastMockTest: new Date().toISOString()
      });

      return true;
    } catch (err) {
      console.error('Error saving mock test results:', err);
      return false;
    }
  }

  /**
   * Show notification (reusing existing notification system)
   */
  function showNotification(message, type = 'info') {
    // Try to use existing notification system
    if (typeof window.showNotificationBanner === 'function') {
      window.showNotificationBanner(message, type === 'error' ? 'error' : 'success');
    } else {
      // Fallback
      alert(message);
    }
  }

  /* ─── UI CREATION FUNCTIONS ─────────────────────────────────────────────── */

  /**
   * Create and show exam selection modal
   */
  function showExamSelectionModal() {
    console.log('[MockTest] showExamSelectionModal called');
    const modal = document.createElement('div');
    modal.id = 'mt-exam-selection-modal';
    modal.className = 'mt-modal-overlay';
    // FORCE display with inline styles
    modal.style.cssText = 'position:fixed !important;top:0 !important;left:0 !important;right:0 !important;bottom:0 !important;background:rgba(0,0,0,0.75) !important;display:flex !important;align-items:center !important;justify-content:center !important;z-index:99999 !important;';
    
    const content = document.createElement('div');
    content.className = 'mt-modal-content mt-exam-selection';
    // FORCE display with inline styles
    content.style.cssText = 'background:linear-gradient(135deg,#16161e 0%,#1a1a28 100%) !important;border:1.5px solid rgba(108,99,255,0.25) !important;border-radius:18px !important;max-width:900px !important;width:92vw !important;max-height:90vh !important;overflow-y:auto !important;';
    
    content.innerHTML = `
      <div class="mt-modal-header">
        <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
          <span style="font-size: 28px;">📝</span>
          <div>
            <h2 style="margin: 0; font-size: 24px; font-weight: 800; background: linear-gradient(135deg, #6c63ff, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Mock Test Center</h2>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: rgba(255,255,255,0.5); font-weight: 500;">Select Your Exam & Start Testing</p>
          </div>
        </div>
        <button class="mt-modal-close" onclick="document.getElementById('mt-exam-selection-modal')?.remove()">✕</button>
      </div>
      
      <div class="mt-modal-body">
        <div class="mt-category-grid">
          <div class="mt-category-section">
            <h3 class="mt-category-header">🎯 Competitive Exams</h3>
            <div class="mt-exam-buttons" id="mt-competitive-exams"></div>
          </div>
          
          <div class="mt-category-section">
            <h3 class="mt-category-header">📚 School Classes</h3>
            <div class="mt-exam-buttons" id="mt-school-exams"></div>
          </div>
        </div>
      </div>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    console.log('[MockTest] Modal appended to body, checking visibility...');
    console.log('[MockTest] Modal element:', modal);
    console.log('[MockTest] Modal display:', window.getComputedStyle(modal).display);
    
    // Populate competitive exams
    const competitiveContainer = document.getElementById('mt-competitive-exams');
    Object.entries(EXAM_CATEGORIES).forEach(([key, category]) => {
      if (category.type !== 'school') {
        const btn = document.createElement('button');
        btn.className = 'mt-exam-btn';
        btn.innerHTML = `
          <div class="mt-exam-name">${category.name}</div>
        `;
        btn.onclick = () => startMockTest(key);
        competitiveContainer.appendChild(btn);
      }
    });
    
    // Populate school exams
    const schoolContainer = document.getElementById('mt-school-exams');
    Object.entries(EXAM_CATEGORIES).forEach(([key, category]) => {
      if (category.type === 'school') {
        const btn = document.createElement('button');
        btn.className = 'mt-exam-btn';
        btn.innerHTML = `
          <div class="mt-exam-name">${category.name}</div>
        `;
        btn.onclick = () => startMockTest(key);
        schoolContainer.appendChild(btn);
      }
    });
  }

  /**
   * Start mock test for selected exam
   */
  async function startMockTest(examCategory) {
    mockTestState.currentExam = examCategory;
    
    // Close exam selection modal
    const modal = document.getElementById('mt-exam-selection-modal');
    if (modal) modal.remove();
    
    // Show loading
    const loadingModal = document.createElement('div');
    loadingModal.id = 'mt-loading-modal';
    loadingModal.className = 'mt-modal-overlay';
    loadingModal.innerHTML = `
      <div class="mt-loading-spinner">
        <div class="mt-spinner"></div>
        <p>Loading questions...</p>
      </div>
    `;
    document.body.appendChild(loadingModal);
    
    // Load questions
    const questions = await loadMockQuestions(examCategory);
    
    if (questions.length === 0) {
      if (loadingModal) loadingModal.remove();
      showNotification('No questions available for this exam. Please try another.', 'error');
      showExamSelectionModal();
      return;
    }
    
    if (loadingModal) loadingModal.remove();
    
    // Initialize mock test state
    mockTestState.startTime = Date.now();
    mockTestState.analyticsData = {
      correctAnswers: 0,
      wrongAnswers: 0,
      skipped: 0,
      timePerQuestion: []
    };
    
    showQuestionModal();
  }

  /**
   * Show question modal
   */
  function showQuestionModal() {
    // Remove existing modal if any
    const existing = document.getElementById('mt-question-modal');
    if (existing) existing.remove();
    
    const modal = document.createElement('div');
    modal.id = 'mt-question-modal';
    modal.className = 'mt-modal-overlay';
    
    const question = mockTestState.questions[mockTestState.currentQuestionIndex];
    if (!question) {
      finishMockTest();
      return;
    }
    
    const category = EXAM_CATEGORIES[mockTestState.currentExam];
    const totalQuestions = mockTestState.questions.length;
    const answered = Object.keys(mockTestState.answers).length;
    
    const content = document.createElement('div');
    content.className = 'mt-modal-content mt-question-container';
    
    let optionsHtml = question.options.map((option, idx) => `
      <button class="mt-option-btn" data-index="${idx}" onclick="(function(){
        const btn = event.target.closest('.mt-option-btn');
        document.querySelectorAll('.mt-option-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        mockTestState.answers[${mockTestState.currentQuestionIndex}] = ${idx};
      })()">
        <span class="mt-option-letter">${String.fromCharCode(65 + idx)}</span>
        <span class="mt-option-text">${option}</span>
      </button>
    `).join('');
    
    const selectedAnswer = mockTestState.answers[mockTestState.currentQuestionIndex];
    
    content.innerHTML = `
      <div class="mt-modal-header">
        <div class="mt-progress-info">
          <span>${mockTestState.currentQuestionIndex + 1}/${totalQuestions}</span>
          <span class="mt-exam-title">${category.name}</span>
        </div>
        <button class="mt-modal-close" onclick="document.getElementById('mt-question-modal')?.remove();mockTestState.currentExam=null;">✕</button>
      </div>
      
      <div class="mt-progress-bar">
        <div class="mt-progress-fill" style="width: ${(answered/totalQuestions)*100}%"></div>
      </div>
      
      <div class="mt-modal-body mt-question-body">
        <div class="mt-question-text">
          <span class="mt-difficulty-badge" style="background:${getDifficultyColor(question.difficulty)}">${question.difficulty}</span>
          <p>${question.question}</p>
        </div>
        
        <div class="mt-options-container">
          ${optionsHtml}
        </div>
      </div>
      
      <div class="mt-modal-footer">
        <div class="mt-nav-buttons">
          <button class="mt-btn mt-btn-secondary" onclick="mockTestState.currentQuestionIndex=Math.max(0,mockTestState.currentQuestionIndex-1);showQuestionModal()" ${mockTestState.currentQuestionIndex === 0 ? 'disabled' : ''}>
            ← Previous
          </button>
          <button class="mt-btn mt-btn-secondary" onclick="mockTestState.currentQuestionIndex=Math.min(mockTestState.questions.length-1,mockTestState.currentQuestionIndex+1);showQuestionModal()">
            Next →
          </button>
        </div>
        
        <button class="mt-btn mt-btn-primary" onclick="if(Object.keys(mockTestState.answers).length > 0) finishMockTest(); else showNotification('Please answer at least one question', 'error')">
          Finish Test
        </button>
      </div>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Highlight selected answer
    if (selectedAnswer !== undefined) {
      const buttons = document.querySelectorAll('.mt-option-btn');
      if (buttons[selectedAnswer]) {
        buttons[selectedAnswer].classList.add('selected');
      }
    }
  }

  /**
   * Get difficulty color
   */
  function getDifficultyColor(difficulty) {
    const colors = {
      'Easy': '#22c55e',
      'Medium': '#f59e0b',
      'Hard': '#ef4444'
    };
    return colors[difficulty] || '#6b7280';
  }

  /**
   * Finish mock test and show results
   */
  async function finishMockTest() {
    if (!mockTestState.startTime) return;
    
    mockTestState.endTime = Date.now();
    const timeTaken = (mockTestState.endTime - mockTestState.startTime) / 1000; // in seconds
    
    // Calculate results
    let correctAnswers = 0;
    const totalQuestions = mockTestState.questions.length;
    
    Object.entries(mockTestState.answers).forEach(([qIdx, answerIdx]) => {
      const question = mockTestState.questions[parseInt(qIdx)];
      const selectedAnswer = question.options[answerIdx];
      if (selectedAnswer === question.answer) {
        correctAnswers++;
      }
    });
    
    const percentage = (correctAnswers / totalQuestions) * 100;
    const xp = calculateXP(correctAnswers, totalQuestions, timeTaken);
    const rank = calculateRankPrediction(correctAnswers, totalQuestions, mockTestState.currentExam);
    
    mockTestState.results = {
      examCategory: mockTestState.currentExam,
      score: correctAnswers,
      totalQuestions,
      percentage: Math.round(percentage * 10) / 10,
      timeTaken,
      xp,
      rank,
      correctAnswers,
      wrongAnswers: totalQuestions - Object.keys(mockTestState.answers).length,
      skipped: totalQuestions - Object.keys(mockTestState.answers).length
    };
    
    // Save to Firestore
    await saveMockTestResults(mockTestState.currentExam, mockTestState.results);
    
    // Show results
    showResultsModal();
  }

  /**
   * Show results modal
   */
  function showResultsModal() {
    // Remove existing modals
    document.querySelectorAll('[id^="mt-"]').forEach(el => el.remove());
    
    const modal = document.createElement('div');
    modal.id = 'mt-results-modal';
    modal.className = 'mt-modal-overlay';
    
    const results = mockTestState.results;
    const category = EXAM_CATEGORIES[mockTestState.currentExam];
    const isSchoolClass = category.type === 'school';
    
    let rankDisplay = '';
    if (isSchoolClass) {
      rankDisplay = `
        <div class="mt-result-card mt-rank-card">
          <div class="mt-result-label">Expected Percentage</div>
          <div class="mt-result-value" style="font-size: 48px; color: #6c63ff;">${results.rank.value}%</div>
          <div class="mt-result-grade">Grade: <span style="font-weight: 800; font-size: 18px;">${results.rank.expectedGrade}</span></div>
          <div class="mt-result-percentile">Percentile: ${results.rank.percentile.toFixed(1)}%</div>
        </div>
      `;
    } else {
      rankDisplay = `
        <div class="mt-result-card mt-rank-card">
          <div class="mt-result-label">Expected Rank</div>
          <div class="mt-result-value" style="font-size: 36px; color: #fbbf24;">
            ${results.rank.value.toLocaleString('en-IN')}
            <div style="font-size: 12px; color: rgba(255,255,255,0.6);">out of ${results.rank.outOf.toLocaleString('en-IN')}</div>
          </div>
          <div class="mt-result-likelihood" style="color: ${results.rank.percentile >= 90 ? '#22c55e' : results.rank.percentile >= 70 ? '#f59e0b' : '#ef4444'}">
            ${results.rank.likelihood}
          </div>
          <div class="mt-result-percentile">Percentile: ${results.rank.percentile.toFixed(1)}%</div>
        </div>
      `;
    }
    
    const content = document.createElement('div');
    content.className = 'mt-modal-content mt-results-container';
    
    content.innerHTML = `
      <div class="mt-modal-header">
        <h2>🎉 Test Complete!</h2>
        <button class="mt-modal-close" onclick="document.getElementById('mt-results-modal')?.remove();">✕</button>
      </div>
      
      <div class="mt-modal-body">
        <div class="mt-results-header">
          <h3>${category.name}</h3>
          <p>Test Completed Successfully</p>
        </div>
        
        <div class="mt-score-section">
          <div class="mt-result-card mt-score-card">
            <div class="mt-result-label">Your Score</div>
            <div class="mt-result-value" style="font-size: 52px; color: #22c55e;">
              ${results.score}/${results.totalQuestions}
            </div>
            <div class="mt-result-percentage" style="font-size: 18px; color: #fbbf24;">
              ${results.percentage}%
            </div>
          </div>
          
          ${rankDisplay}
        </div>
        
        <div class="mt-analytics-section">
          <div class="mt-analytics-grid">
            <div class="mt-stat-card">
              <div class="mt-stat-icon">✅</div>
              <div class="mt-stat-label">Correct Answers</div>
              <div class="mt-stat-value">${results.correctAnswers}</div>
            </div>
            
            <div class="mt-stat-card">
              <div class="mt-stat-icon">❌</div>
              <div class="mt-stat-label">Wrong Answers</div>
              <div class="mt-stat-value">${results.wrongAnswers}</div>
            </div>
            
            <div class="mt-stat-card">
              <div class="mt-stat-icon">⏱️</div>
              <div class="mt-stat-label">Time Taken</div>
              <div class="mt-stat-value">${formatTime(results.timeTaken)}</div>
            </div>
            
            <div class="mt-stat-card">
              <div class="mt-stat-icon">⭐</div>
              <div class="mt-stat-label">XP Earned</div>
              <div class="mt-stat-value" style="color: #fbbf24;">+${results.xp}</div>
            </div>
          </div>
        </div>
        
        <div class="mt-recommendations">
          <h4>📈 Performance Analysis</h4>
          <p>${getPerformanceRecommendation(results.percentage)}</p>
        </div>
      </div>
      
      <div class="mt-modal-footer">
        <button class="mt-btn mt-btn-secondary" onclick="document.getElementById('mt-results-modal')?.remove();showExamSelectionModal()">
          Try Another Test
        </button>
        <button class="mt-btn mt-btn-primary" onclick="document.getElementById('mt-results-modal')?.remove();">
          Back to Home
        </button>
      </div>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Trigger confetti on good performance
    if (results.percentage >= 75 && typeof confetti !== 'undefined') {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }
  }

  /**
   * Format time to readable format
   */
  function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  }

  /**
   * Get performance recommendation
   */
  function getPerformanceRecommendation(percentage) {
    if (percentage >= 90) {
      return '🌟 Exceptional performance! You\'re well-prepared for this exam. Focus on mastering the remaining weak areas and practice timed tests.';
    } else if (percentage >= 75) {
      return '✅ Great job! You have a strong foundation. Work on improving accuracy and speed for competitive exams.';
    } else if (percentage >= 60) {
      return '👍 Good effort! You\'re on the right track. Identify weak topics and dedicate more time to them.';
    } else if (percentage >= 45) {
      return '⚠️ You need more practice. Review concepts, solve more questions, and track your improvement.';
    } else {
      return '💪 Keep practicing! Start with basic concepts, build your foundation, and gradually increase difficulty levels.';
    }
  }

  /* ─── PUBLIC API ────────────────────────────────────────────────────────── */
  
  window.openMockTest = function() {
    console.log('[MockTest] openMockTest called, window.openMockTest exists:', typeof window.openMockTest);
    console.log('[MockTest] mockTestState exists:', !!window.mockTestState);
    console.log('[MockTest] EXAM_CATEGORIES exists:', !!EXAM_CATEGORIES);
    try {
      showExamSelectionModal();
      console.log('[MockTest] showExamSelectionModal executed successfully');
    } catch(err) {
      console.error('[MockTest] Error in showExamSelectionModal:', err);
      console.error('[MockTest] Stack:', err.stack);
      alert('Error opening mock test: ' + err.message);
    }
  };

  // Ensure it's also available as openMockTestModal
  window.openMockTestModal = window.openMockTest;

  window.showQuestionModal = showQuestionModal;
  window.finishMockTest = finishMockTest;
  window.mockTestState = mockTestState;
  window.MockTest = {
    init: function() {
      return true;
    },
    open: function() {
      showExamSelectionModal();
    },
    state: mockTestState
  };

  // Initialize mock test button if it exists
  document.addEventListener('DOMContentLoaded', function() {
    const mockTestBtn = document.getElementById('mockTestBtn');
    if (mockTestBtn) {
      mockTestBtn.addEventListener('click', function() {
        window.openMockTest();
      });
    }
  });

  // Also handle the dropdown button click
  if (typeof window !== 'undefined') {
    window.addEventListener('load', function() {
      // Handle if button is added dynamically
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.addedNodes.length) {
            mutation.addedNodes.forEach(function(node) {
              if (node.nodeType === 1) { // Element node
                const mockBtn = node.querySelector ? node.querySelector('#mockTestBtn') : null;
                if (mockBtn) {
                  mockBtn.addEventListener('click', function() {
                    window.openMockTest();
                  });
                }
              }
            });
          }
        });
      });
      
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  /* ─── STYLES ────────────────────────────────────────────────────────────────── */
  const mockTestStyles = document.createElement('style');
  mockTestStyles.textContent = `
/* ─── MODAL OVERLAY ─── */
  .mt-modal-overlay {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    background: rgba(0, 0, 0, 0.75) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    z-index: 99999 !important;
    animation: mtFadeIn 0.3s ease !important;
    backdrop-filter: blur(6px) !important;
  }

  @keyframes mtFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  /* ─── MODAL CONTENT ─── */
  .mt-modal-content {
    background: linear-gradient(135deg, #16161e 0%, #1a1a28 100%) !important;
    border: 1.5px solid rgba(108, 99, 255, 0.25) !important;
    border-radius: 18px !important;
    box-shadow: 0 25px 70px rgba(0, 0, 0, 0.5), 0 0 2px rgba(108, 99, 255, 0.2) !important;
    max-width: 900px !important;
    width: 92vw !important;
    max-height: 90vh !important;
    overflow-y: auto !important;
    animation: mtSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
  }

  @keyframes mtSlideIn {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* ─── MODAL HEADER ─── */
  .mt-modal-header {
    padding: 28px !important;
    border-bottom: 1px solid rgba(108, 99, 255, 0.15) !important;
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    gap: 16px !important;
  }

  .mt-modal-header h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 800;
    background: linear-gradient(135deg, #6c63ff, #a78bfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .mt-modal-header h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #ffffff;
  }

  .mt-modal-close {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.6);
    border-radius: 8px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 20px;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .mt-modal-close:hover {
    background: rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.9);
  }

  /* ─── MODAL BODY ─── */
  .mt-modal-body {
    padding: 28px !important;
    color: rgba(255, 255, 255, 0.9) !important;
  }

  /* ─── MODAL FOOTER ─── */
  .mt-modal-footer {
    padding: 20px 28px !important;
    border-top: 1px solid rgba(108, 99, 255, 0.15) !important;
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    gap: 12px !important;
  }

  /* ─── PROGRESS BAR ─── */
  .mt-progress-bar {
    height: 6px;
    background: rgba(108, 99, 255, 0.1);
    border-radius: 3px;
    margin: 0;
    overflow: hidden;
  }

  .mt-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #6c63ff, #a78bfa);
    border-radius: 3px;
    transition: width 0.3s ease;
  }

  /* ─── PROGRESS INFO ─── */
  .mt-progress-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    font-weight: 600;
  }

  .mt-exam-title {
    color: rgba(255, 255, 255, 0.8);
    font-weight: 700;
  }

  /* ─── EXAM SELECTION ─── */
  .mt-category-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }

  @media (max-width: 1000px) {
    .mt-category-grid {
      grid-template-columns: 1fr;
      gap: 24px;
    }
  }

  .mt-category-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .mt-category-header {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.9);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .mt-exam-buttons {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }

  /* ─── EXAM BUTTONS ─── */
  .mt-exam-btn {
    background: rgba(108, 99, 255, 0.1);
    border: 1.5px solid rgba(108, 99, 255, 0.3);
    border-radius: 12px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    color: inherit;
    font-family: inherit;
  }

  .mt-exam-btn:hover {
    background: rgba(108, 99, 255, 0.2);
    border-color: rgba(108, 99, 255, 0.6);
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(108, 99, 255, 0.2);
  }

  .mt-exam-name {
    font-size: 14px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.85);
    text-align: center;
    line-height: 1.4;
  }

  /* ─── QUESTION CONTAINER ─── */
  .mt-question-body {
    padding-bottom: 0 !important;
  }

  .mt-question-text {
    margin-bottom: 28px;
  }

  .mt-question-text p {
    margin: 12px 0 0 0;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.6;
    color: #ffffff;
  }

  .mt-difficulty-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    color: #ffffff;
    letter-spacing: 0.5px;
  }

  /* ─── OPTIONS CONTAINER ─── */
  .mt-options-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }

  /* ─── OPTION BUTTON ─── */
  .mt-option-btn {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: rgba(108, 99, 255, 0.06);
    border: 1.5px solid rgba(108, 99, 255, 0.2);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }

  .mt-option-btn:hover {
    background: rgba(108, 99, 255, 0.12);
    border-color: rgba(108, 99, 255, 0.4);
  }

  .mt-option-btn.selected {
    background: rgba(108, 99, 255, 0.25);
    border-color: #6c63ff;
    box-shadow: 0 0 20px rgba(108, 99, 255, 0.3);
  }

  .mt-option-letter {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: rgba(108, 99, 255, 0.2);
    border-radius: 8px;
    font-weight: 700;
    color: #6c63ff;
    flex-shrink: 0;
  }

  .mt-option-btn.selected .mt-option-letter {
    background: #6c63ff;
    color: #ffffff;
  }

  .mt-option-text {
    font-size: 14px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.85);
  }

  /* ─── NAVIGATION BUTTONS ─── */
  .mt-nav-buttons {
    display: flex;
    gap: 12px;
  }

  /* ─── BUTTONS ─── */
  .mt-btn {
    padding: 12px 24px;
    border-radius: 8px;
    border: none;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .mt-btn-primary {
    background: linear-gradient(135deg, #6c63ff, #a78bfa);
    color: #ffffff;
  }

  .mt-btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(108, 99, 255, 0.4);
  }

  .mt-btn-secondary {
    background: rgba(108, 99, 255, 0.15);
    color: rgba(255, 255, 255, 0.85);
    border: 1px solid rgba(108, 99, 255, 0.3);
  }

  .mt-btn-secondary:hover {
    background: rgba(108, 99, 255, 0.25);
    border-color: rgba(108, 99, 255, 0.5);
  }

  /* ─── LOADING SPINNER ─── */
  .mt-loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .mt-spinner {
    width: 48px;
    height: 48px;
    border: 3px solid rgba(108, 99, 255, 0.2);
    border-top-color: #6c63ff;
    border-radius: 50%;
    animation: mtSpin 0.8s linear infinite;
  }

  @keyframes mtSpin {
    to { transform: rotate(360deg); }
  }

  /* ─── RESULTS MODAL ─── */
  .mt-results-container {
    max-height: none;
  }

  .mt-results-header {
    text-align: center;
    margin-bottom: 24px;
  }

  .mt-results-header h3 {
    margin: 0 0 8px 0;
    font-size: 20px;
    font-weight: 600;
    background: linear-gradient(135deg, #6c63ff, #a78bfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .mt-results-header p {
    margin: 0;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
  }

  .mt-score-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 24px;
  }

  @media (max-width: 600px) {
    .mt-score-section {
      grid-template-columns: 1fr;
    }
  }

  .mt-result-card {
    background: rgba(108, 99, 255, 0.08);
    border: 1px solid rgba(108, 99, 255, 0.2);
    border-radius: 12px;
    padding: 20px;
    text-align: center;
  }

  .mt-rank-card {
    grid-column: 1 / -1;
  }

  .mt-result-label {
    font-size: 12px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 8px;
  }

  .mt-result-value {
    font-weight: 800;
    margin-bottom: 8px;
  }

  .mt-result-percentage {
    color: #fbbf24;
  }

  .mt-result-grade {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 4px;
  }

  .mt-result-likelihood {
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .mt-result-percentile {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
  }

  /* ─── ANALYTICS ─── */
  .mt-analytics-section {
    margin-bottom: 24px;
  }

  .mt-analytics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px;
  }

  .mt-stat-card {
    background: linear-gradient(135deg, rgba(108, 99, 255, 0.1), rgba(139, 92, 246, 0.05));
    border: 1px solid rgba(108, 99, 255, 0.2);
    border-radius: 10px;
    padding: 16px;
    text-align: center;
  }

  .mt-stat-icon {
    font-size: 24px;
    margin-bottom: 8px;
  }

  .mt-stat-label {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.6);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
    font-weight: 600;
  }

  .mt-stat-value {
    font-size: 18px;
    font-weight: 800;
    color: #ffffff;
  }

  /* ─── RECOMMENDATIONS ─── */
  .mt-recommendations {
    background: rgba(108, 99, 255, 0.08);
    border: 1px solid rgba(108, 99, 255, 0.2);
    border-radius: 10px;
    padding: 16px;
    margin-bottom: 12px;
  }

  .mt-recommendations h4 {
    margin: 0 0 8px 0;
    font-size: 13px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.85);
  }

  .mt-recommendations p {
    margin: 0;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.6;
  }

  /* ─── RESPONSIVE ─── */
  @media (max-width: 600px) {
    .mt-modal-content {
      max-height: 95vh;
      border-radius: 12px;
    }

    .mt-modal-header {
      padding: 16px;
    }

    .mt-modal-body {
      padding: 16px;
    }

    .mt-modal-footer {
      padding: 16px;
      flex-direction: column-reverse;
    }

    .mt-modal-footer .mt-btn {
      width: 100%;
    }

    .mt-nav-buttons {
      width: 100%;
    }

    .mt-nav-buttons .mt-btn {
      flex: 1;
    }

    .mt-exam-buttons {
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    }
  }

  /* ─── DARK MODE ─── */
  [data-theme="dark"] {
    --bg-secondary: #16161e;
    --text-primary: #ffffff;
  }

  /* ─── LIGHT MODE ─── */
  [data-theme="light"] {
    --bg-secondary: #ffffff;
    --text-primary: #16161e;
  }
`;

  document.head.appendChild(mockTestStyles);

})();