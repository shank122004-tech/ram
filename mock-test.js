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
  const STORAGE_BUCKET = 'rankgpt-f8a64.appspot.com';
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
   * Convert question format from Firebase Storage format to mock-test format
   * Supports multiple answer formats:
   * 1. Letter format: "answer": "C" → answerIndex: 2
   * 2. Text format: "answer": "100" → finds matching option
   * 3. Index format: "answer": 2 → already correct
   */
  function normalizeQuestionFormat(questions) {
    return questions.map(q => {
      // If already has answerIndex, return as is
      if (typeof q.answerIndex === 'number') {
        return q;
      }
      
      let answerIndex = 0;
      
      if (q.answer && q.options) {
        // Handle letter format: "A", "B", "C", "D"
        if (typeof q.answer === 'string' && q.answer.length === 1) {
          const letterToIndex = {
            'A': 0, 'a': 0,
            'B': 1, 'b': 1,
            'C': 2, 'c': 2,
            'D': 3, 'd': 3
          };
          answerIndex = letterToIndex[q.answer] ?? 0;
        } 
        // Handle text format: match with option text
        else if (typeof q.answer === 'string') {
          const idx = q.options.indexOf(q.answer);
          answerIndex = idx >= 0 ? idx : 0;
        }
        // Handle index format
        else if (typeof q.answer === 'number') {
          answerIndex = q.answer;
        }
      }
      
      return {
        id: q.id || `q_${Math.random()}`,
        question: q.question || '',
        options: q.options || [],
        answerIndex: answerIndex,
        explanation: q.explanation || '',
        difficulty: q.difficulty || 'medium',
        subject: q.subject || '',
        chapter: q.chapter || ''
      };
    });
  }

  /**
   * Load questions from Firebase Storage - FIXED VERSION
   */
  async function loadMockQuestions(examCategory) {
    try {
      mockTestState.isLoading = true;
      const url = getStorageUrl(examCategory);
      
      console.log(`[MockTest] Loading questions for ${examCategory} from: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        // Handle 404 by showing sample questions
        if (response.status === 404) {
          console.warn(`[MockTest] File not found for ${examCategory}, using sample questions`);
          const sampleQuestions = [
            { id: 1, question: "What is the capital of India?", options: ["New Delhi", "Mumbai", "Bangalore", "Kolkata"], answerIndex: 0 },
            { id: 2, question: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], answerIndex: 1 },
            { id: 3, question: "What is 15 × 12?", options: ["150", "180", "200", "220"], answerIndex: 1 },
            { id: 4, question: "Who wrote 'Romeo and Juliet'?", options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"], answerIndex: 1 },
            { id: 5, question: "What is the chemical symbol for Gold?", options: ["Go", "Gd", "Au", "Ag"], answerIndex: 2 },
            { id: 6, question: "Which is the largest ocean?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], answerIndex: 3 },
            { id: 7, question: "What is the square root of 144?", options: ["10", "11", "12", "13"], answerIndex: 2 },
            { id: 8, question: "Who discovered gravity?", options: ["Galileo", "Newton", "Einstein", "Kepler"], answerIndex: 1 },
            { id: 9, question: "What is the boiling point of water?", options: ["90°C", "100°C", "110°C", "120°C"], answerIndex: 1 },
            { id: 10, question: "Which is the smallest continent?", options: ["Africa", "Europe", "Australia", "Antarctica"], answerIndex: 2 },
            { id: 11, question: "What is 25% of 80?", options: ["15", "20", "25", "30"], answerIndex: 1 },
            { id: 12, question: "Who painted the Mona Lisa?", options: ["Michelangelo", "Leonardo da Vinci", "Raphael", "Donatello"], answerIndex: 1 },
            { id: 13, question: "What is the speed of light?", options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"], answerIndex: 0 },
            { id: 14, question: "Which country has the Great Wall?", options: ["Japan", "Korea", "China", "Vietnam"], answerIndex: 2 },
            { id: 15, question: "What is 7 × 8?", options: ["54", "56", "58", "60"], answerIndex: 1 },
            { id: 16, question: "Who was the first President of USA?", options: ["Jefferson", "Washington", "Lincoln", "Kennedy"], answerIndex: 1 },
            { id: 17, question: "What is the largest planet?", options: ["Saturn", "Mars", "Jupiter", "Neptune"], answerIndex: 2 },
            { id: 18, question: "How many days in February?", options: ["28", "29", "30", "31"], answerIndex: 0 },
            { id: 19, question: "What is the currency of Japan?", options: ["Won", "Yuan", "Yen", "Peso"], answerIndex: 2 },
            { id: 20, question: "Which is the deepest ocean trench?", options: ["Mariana", "Tonga", "Kuril", "Philippine"], answerIndex: 0 }
          ];
          
          mockTestState.questions = sampleQuestions;
          mockTestState.currentQuestionIndex = 0;
          mockTestState.answers = {};
          mockTestState.analyticsData = {
            correctAnswers: 0,
            wrongAnswers: 0,
            skipped: 0,
            timePerQuestion: []
          };
          
          showNotification(`Using sample questions for ${examCategory}`, 'info');
          console.log(`[MockTest] Loaded ${sampleQuestions.length} sample questions`);
          return sampleQuestions;
        }
        
        throw new Error(`Firebase Storage returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Support both array format and object with 'questions' property
      let questions = Array.isArray(data) ? data : data.questions || [];
      
      if (questions.length === 0) {
        throw new Error('No questions found in Firebase Storage');
      }
      
      // Normalize question format (convert answer text to answerIndex)
      mockTestState.questions = normalizeQuestionFormat(questions);
      
      mockTestState.currentQuestionIndex = 0;
      mockTestState.answers = {};
      mockTestState.analyticsData = {
        correctAnswers: 0,
        wrongAnswers: 0,
        skipped: 0,
        timePerQuestion: []
      };
      
      console.log(`[MockTest] Successfully loaded ${mockTestState.questions.length} questions`);
      return mockTestState.questions;
      
    } catch (err) {
      console.error('[MockTest] Error loading questions:', err);
      showNotification(`Failed to load ${examCategory} questions: ${err.message}`, 'error');
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
          <div class="mt-exam-title">${category.name}</div>
          <div class="mt-question-progress">${mockTestState.currentQuestionIndex + 1} of ${totalQuestions} • ${answered} answered</div>
        </div>
        <button class="mt-modal-close" onclick="document.getElementById('mt-question-modal')?.remove()">✕</button>
      </div>
      
      <div class="mt-modal-body">
        <div class="mt-question-card">
          <div class="mt-question-text">
            <span class="mt-q-number">Q${mockTestState.currentQuestionIndex + 1}</span>
            <p>${question.question}</p>
          </div>
          <div class="mt-options">${optionsHtml}</div>
          ${question.explanation ? `
            <div class="mt-explanation" style="margin-top: 16px; padding: 12px; background: rgba(59,130,246,0.1); border-left: 3px solid #3b82f6; border-radius: 4px;">
              <strong>💡 Explanation:</strong> ${question.explanation}
            </div>
          ` : ''}
        </div>
      </div>
      
      <div class="mt-modal-footer">
        <button class="mt-nav-btn" ${mockTestState.currentQuestionIndex === 0 ? 'disabled' : ''} onclick="previousQuestion()">← Previous</button>
        <button class="mt-nav-btn" onclick="${mockTestState.currentQuestionIndex === totalQuestions - 1 ? 'finishMockTest()' : 'nextQuestion()'}">
          ${mockTestState.currentQuestionIndex === totalQuestions - 1 ? 'Finish Test' : 'Next Question →'}
        </button>
      </div>
    `;
    
    if (selectedAnswer !== undefined) {
      const selectedBtn = content.querySelector(`[data-index="${selectedAnswer}"]`);
      if (selectedBtn) selectedBtn.classList.add('selected');
    }
    
    modal.appendChild(content);
    document.body.appendChild(modal);
  }

  /**
   * Navigate to next question
   */
  window.nextQuestion = function() {
    if (mockTestState.currentQuestionIndex < mockTestState.questions.length - 1) {
      mockTestState.currentQuestionIndex++;
      showQuestionModal();
    }
  };

  /**
   * Navigate to previous question
   */
  window.previousQuestion = function() {
    if (mockTestState.currentQuestionIndex > 0) {
      mockTestState.currentQuestionIndex--;
      showQuestionModal();
    }
  };

  /**
   * Finish mock test and show results
   */
  window.finishMockTest = function() {
    const questions = mockTestState.questions;
    let correctAnswers = 0;

    questions.forEach((q, idx) => {
      if (mockTestState.answers[idx] === q.answerIndex) {
        correctAnswers++;
      }
    });

    const timeTaken = (Date.now() - mockTestState.startTime) / 1000; // seconds
    const xp = calculateXP(correctAnswers, questions.length, timeTaken);
    const rankPrediction = calculateRankPrediction(correctAnswers, questions.length, mockTestState.currentExam);

    const results = {
      score: correctAnswers,
      totalQuestions: questions.length,
      percentage: (correctAnswers / questions.length) * 100,
      timeTaken: timeTaken,
      xp: xp,
      rank: rankPrediction,
      correctAnswers: correctAnswers,
      wrongAnswers: questions.length - correctAnswers
    };

    mockTestState.results = results;
    saveMockTestResults(mockTestState.currentExam, results);
    showResultsModal(results, questions);
  };

  /**
   * Show results modal
   */
  function showResultsModal(results, questions) {
    const existing = document.getElementById('mt-question-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'mt-results-modal';
    modal.className = 'mt-modal-overlay';
    
    const gradeColor = results.percentage >= 80 ? '#10b981' : results.percentage >= 60 ? '#f59e0b' : '#ef4444';
    
    const content = document.createElement('div');
    content.className = 'mt-modal-content mt-results-container';
    
    let rankHtml = '';
    if (results.rank && results.rank.type === 'rank') {
      rankHtml = `
        <div class="mt-result-card mt-rank-card">
          <div class="mt-result-label">Predicted Rank</div>
          <div class="mt-result-value">${results.rank.value.toLocaleString()} / ${results.rank.outOf.toLocaleString()}</div>
          <div class="mt-result-likelihood">${results.rank.likelihood}</div>
          <div class="mt-result-percentile">Percentile: ${results.rank.percentile}%</div>
        </div>
      `;
    }
    
    content.innerHTML = `
      <div class="mt-modal-header">
        <h2>📊 Test Results</h2>
        <button class="mt-modal-close" onclick="document.getElementById('mt-results-modal')?.remove()">✕</button>
      </div>
      
      <div class="mt-modal-body">
        <div class="mt-results-header">
          <h3>Congratulations! 🎉</h3>
          <p>You completed the test in ${Math.round(results.timeTaken)}s</p>
        </div>

        <div class="mt-score-section">
          <div class="mt-result-card">
            <div class="mt-result-label">Score</div>
            <div class="mt-result-value" style="color: ${gradeColor}">
              ${results.score} / ${results.totalQuestions}
            </div>
          </div>

          <div class="mt-result-card">
            <div class="mt-result-label">Percentage</div>
            <div class="mt-result-value mt-result-percentage">
              ${results.percentage.toFixed(1)}%
            </div>
            <div class="mt-result-grade">
              Grade: <strong>${getGradeFromPercentage(results.percentage)}</strong>
            </div>
          </div>

          ${rankHtml}
        </div>

        <div class="mt-analytics-section">
          <h4 style="margin: 0 0 16px 0; color: rgba(255,255,255,0.85);">Analytics</h4>
          <div class="mt-analytics-grid">
            <div class="mt-stat-card">
              <div class="mt-stat-icon">✅</div>
              <div class="mt-stat-label">Correct</div>
              <div class="mt-stat-value">${results.correctAnswers}</div>
            </div>
            <div class="mt-stat-card">
              <div class="mt-stat-icon">❌</div>
              <div class="mt-stat-label">Wrong</div>
              <div class="mt-stat-value">${results.wrongAnswers}</div>
            </div>
            <div class="mt-stat-card">
              <div class="mt-stat-icon">⏱️</div>
              <div class="mt-stat-label">Time</div>
              <div class="mt-stat-value">${Math.round(results.timeTaken)}s</div>
            </div>
            <div class="mt-stat-card">
              <div class="mt-stat-icon">⭐</div>
              <div class="mt-stat-label">XP Earned</div>
              <div class="mt-stat-value">${results.xp}</div>
            </div>
          </div>
        </div>

        <div class="mt-recommendations">
          <h4>📝 Recommendations</h4>
          <p>${getRecommendations(results.percentage)}</p>
        </div>
      </div>
      
      <div class="mt-modal-footer">
        <button class="mt-btn mt-btn-secondary" onclick="document.getElementById('mt-results-modal')?.remove();showExamSelectionModal()">Back to Exams</button>
        <button class="mt-btn mt-btn-primary" onclick="location.reload()">Take Another Test</button>
      </div>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
  }

  /**
   * Get recommendations based on score
   */
  function getRecommendations(percentage) {
    if (percentage >= 90) {
      return '🌟 Excellent! You\'re performing exceptionally well. Keep up this consistency and focus on weak areas.';
    } else if (percentage >= 75) {
      return '👍 Good performance! Review the questions you missed and practice more similar problems.';
    } else if (percentage >= 60) {
      return '📚 You\'re on the right track. Dedicate more time to studying weak topics and practice regularly.';
    } else {
      return '💪 Keep practicing! Focus on fundamentals and gradually increase the difficulty level.';
    }
  }

  /**
   * Public API to open mock test
   * Can be called with exam category or without to show selection
   */
  window.openMockTest = function(examCategory) {
    if (examCategory) {
      // If exam category provided, start test directly
      startMockTest(examCategory);
    } else {
      // If no category, show selection modal
      showExamSelectionModal();
    }
  };
  
  // Alias for compatibility
  window.openMockTestModal = window.openMockTest;

  // Inject styles
  const mockTestStyles = document.createElement('style');
  mockTestStyles.textContent = `
  /* ─── MODAL BASE ─── */
  .mt-modal-overlay {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    background: rgba(0, 0, 0, 0.8) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    z-index: 10000 !important;
    backdrop-filter: blur(5px) !important;
  }

  .mt-modal-content {
    background: linear-gradient(135deg, #1a1a2e, #16213e) !important;
    border: 1px solid rgba(108, 99, 255, 0.2) !important;
    border-radius: 16px !important;
    max-width: 800px !important;
    width: 95% !important;
    max-height: 85vh !important;
    display: flex !important;
    flex-direction: column !important;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5) !important;
  }

  .mt-modal-header {
    padding: 24px !important;
    border-bottom: 1px solid rgba(108, 99, 255, 0.2) !important;
    color: #ffffff !important;
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
  }

  .mt-modal-header h2 {
    margin: 0 !important;
    font-size: 20px !important;
    font-weight: 700 !important;
  }

  .mt-modal-body {
    flex: 1 !important;
    padding: 24px !important;
    overflow-y: auto !important;
  }

  .mt-modal-footer {
    padding: 16px 24px !important;
    border-top: 1px solid rgba(108, 99, 255, 0.2) !important;
    display: flex !important;
    gap: 12px !important;
    justify-content: flex-end !important;
  }

  .mt-modal-close {
    background: none !important;
    border: none !important;
    color: rgba(255, 255, 255, 0.5) !important;
    font-size: 24px !important;
    cursor: pointer !important;
    transition: color 0.2s !important;
  }

  .mt-modal-close:hover {
    color: rgba(255, 255, 255, 0.85) !important;
  }

  /* ─── EXAM SELECTION ─── */
  .mt-category-grid {
    display: grid !important;
    gap: 24px !important;
  }

  .mt-category-section {
    display: flex !important;
    flex-direction: column !important;
    gap: 12px !important;
  }

  .mt-category-header {
    margin: 0 !important;
    font-size: 16px !important;
    font-weight: 700 !important;
    color: rgba(255, 255, 255, 0.9) !important;
  }

  .mt-exam-buttons {
    display: grid !important;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)) !important;
    gap: 12px !important;
  }

  .mt-exam-btn {
    padding: 16px 12px !important;
    background: rgba(108, 99, 255, 0.12) !important;
    border: 1px solid rgba(108, 99, 255, 0.3) !important;
    border-radius: 12px !important;
    color: rgba(255, 255, 255, 0.9) !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    cursor: pointer !important;
    transition: all 0.2s !important;
    text-align: center !important;
  }

  .mt-exam-btn:hover {
    background: rgba(108, 99, 255, 0.25) !important;
    border-color: rgba(108, 99, 255, 0.5) !important;
    transform: translateY(-2px) !important;
  }

  .mt-exam-name {
    font-size: 13px !important;
  }

  /* ─── QUESTION VIEW ─── */
  .mt-question-card {
    display: flex !important;
    flex-direction: column !important;
    gap: 20px !important;
  }

  .mt-progress-info {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
  }

  .mt-exam-title {
    font-size: 16px !important;
    font-weight: 700 !important;
    color: #6c63ff !important;
  }

  .mt-question-progress {
    font-size: 13px !important;
    color: rgba(255, 255, 255, 0.6) !important;
  }

  .mt-question-text {
    display: flex !important;
    flex-direction: column !important;
    gap: 12px !important;
  }

  .mt-q-number {
    font-size: 12px !important;
    font-weight: 700 !important;
    color: #6c63ff !important;
    text-transform: uppercase !important;
  }

  .mt-question-text p {
    margin: 0 !important;
    font-size: 16px !important;
    font-weight: 500 !important;
    color: rgba(255, 255, 255, 0.95) !important;
    line-height: 1.6 !important;
  }

  .mt-options {
    display: flex !important;
    flex-direction: column !important;
    gap: 12px !important;
  }

  .mt-option-btn {
    display: flex !important;
    align-items: center !important;
    gap: 12px !important;
    padding: 14px 16px !important;
    background: rgba(108, 99, 255, 0.08) !important;
    border: 1.5px solid rgba(108, 99, 255, 0.2) !important;
    border-radius: 8px !important;
    color: rgba(255, 255, 255, 0.85) !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    cursor: pointer !important;
    transition: all 0.2s !important;
    text-align: left !important;
  }

  .mt-option-btn:hover {
    background: rgba(108, 99, 255, 0.15) !important;
    border-color: rgba(108, 99, 255, 0.4) !important;
  }

  .mt-option-btn.selected {
    background: rgba(108, 99, 255, 0.25) !important;
    border-color: #6c63ff !important;
    color: #ffffff !important;
  }

  .mt-option-letter {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 28px !important;
    height: 28px !important;
    background: rgba(108, 99, 255, 0.3) !important;
    border-radius: 50% !important;
    font-weight: 700 !important;
    flex-shrink: 0 !important;
  }

  .mt-option-text {
    flex: 1 !important;
  }

  /* ─── BUTTONS ─── */
  .mt-btn {
    padding: 12px 24px !important;
    border-radius: 8px !important;
    border: none !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    cursor: pointer !important;
    transition: all 0.2s !important;
  }

  .mt-btn-primary {
    background: linear-gradient(135deg, #6c63ff, #a78bfa) !important;
    color: #ffffff !important;
  }

  .mt-btn-primary:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 20px rgba(108, 99, 255, 0.4) !important;
  }

  .mt-btn-secondary {
    background: rgba(108, 99, 255, 0.15) !important;
    color: rgba(255, 255, 255, 0.85) !important;
    border: 1px solid rgba(108, 99, 255, 0.3) !important;
  }

  .mt-btn-secondary:hover {
    background: rgba(108, 99, 255, 0.25) !important;
    border-color: rgba(108, 99, 255, 0.5) !important;
  }

  .mt-nav-btn {
    padding: 10px 20px !important;
    background: rgba(108, 99, 255, 0.15) !important;
    border: 1px solid rgba(108, 99, 255, 0.3) !important;
    border-radius: 6px !important;
    color: rgba(255, 255, 255, 0.85) !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    cursor: pointer !important;
    transition: all 0.2s !important;
  }

  .mt-nav-btn:hover:not(:disabled) {
    background: rgba(108, 99, 255, 0.25) !important;
    border-color: rgba(108, 99, 255, 0.5) !important;
  }

  .mt-nav-btn:disabled {
    opacity: 0.5 !important;
    cursor: not-allowed !important;
  }

  /* ─── LOADING SPINNER ─── */
  .mt-loading-spinner {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    gap: 16px !important;
    color: rgba(255, 255, 255, 0.85) !important;
  }

  .mt-spinner {
    width: 48px !important;
    height: 48px !important;
    border: 3px solid rgba(108, 99, 255, 0.2) !important;
    border-top-color: #6c63ff !important;
    border-radius: 50% !important;
    animation: mtSpin 0.8s linear infinite !important;
  }

  @keyframes mtSpin {
    to { transform: rotate(360deg) !important; }
  }

  /* ─── RESULTS ─── */
  .mt-results-header {
    text-align: center !important;
    margin-bottom: 24px !important;
  }

  .mt-results-header h3 {
    margin: 0 0 8px 0 !important;
    font-size: 20px !important;
    font-weight: 600 !important;
    background: linear-gradient(135deg, #6c63ff, #a78bfa) !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    background-clip: text !important;
  }

  .mt-results-header p {
    margin: 0 !important;
    font-size: 14px !important;
    color: rgba(255, 255, 255, 0.6) !important;
  }

  .mt-score-section {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 16px !important;
    margin-bottom: 24px !important;
  }

  .mt-result-card {
    background: rgba(108, 99, 255, 0.08) !important;
    border: 1px solid rgba(108, 99, 255, 0.2) !important;
    border-radius: 12px !important;
    padding: 20px !important;
    text-align: center !important;
  }

  .mt-rank-card {
    grid-column: 1 / -1 !important;
  }

  .mt-result-label {
    font-size: 12px !important;
    font-weight: 700 !important;
    color: rgba(255, 255, 255, 0.5) !important;
    text-transform: uppercase !important;
    letter-spacing: 1px !important;
    margin-bottom: 8px !important;
  }

  .mt-result-value {
    font-weight: 800 !important;
    font-size: 24px !important;
    margin-bottom: 8px !important;
    color: #6c63ff !important;
  }

  .mt-result-percentage {
    color: #fbbf24 !important;
  }

  .mt-result-grade {
    font-size: 13px !important;
    color: rgba(255, 255, 255, 0.7) !important;
  }

  .mt-result-likelihood {
    font-size: 13px !important;
    font-weight: 600 !important;
    margin-bottom: 8px !important;
  }

  .mt-result-percentile {
    font-size: 12px !important;
    color: rgba(255, 255, 255, 0.5) !important;
  }

  /* ─── ANALYTICS ─── */
  .mt-analytics-section {
    margin-bottom: 24px !important;
  }

  .mt-analytics-grid {
    display: grid !important;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)) !important;
    gap: 12px !important;
  }

  .mt-stat-card {
    background: linear-gradient(135deg, rgba(108, 99, 255, 0.1), rgba(139, 92, 246, 0.05)) !important;
    border: 1px solid rgba(108, 99, 255, 0.2) !important;
    border-radius: 10px !important;
    padding: 16px !important;
    text-align: center !important;
  }

  .mt-stat-icon {
    font-size: 24px !important;
    margin-bottom: 8px !important;
  }

  .mt-stat-label {
    font-size: 11px !important;
    color: rgba(255, 255, 255, 0.6) !important;
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
    margin-bottom: 8px !important;
    font-weight: 600 !important;
  }

  .mt-stat-value {
    font-size: 18px !important;
    font-weight: 800 !important;
    color: #ffffff !important;
  }

  /* ─── RECOMMENDATIONS ─── */
  .mt-recommendations {
    background: rgba(108, 99, 255, 0.08) !important;
    border: 1px solid rgba(108, 99, 255, 0.2) !important;
    border-radius: 10px !important;
    padding: 16px !important;
    margin-bottom: 12px !important;
  }

  .mt-recommendations h4 {
    margin: 0 0 8px 0 !important;
    font-size: 13px !important;
    font-weight: 700 !important;
    color: rgba(255, 255, 255, 0.85) !important;
  }

  .mt-recommendations p {
    margin: 0 !important;
    font-size: 13px !important;
    color: rgba(255, 255, 255, 0.7) !important;
    line-height: 1.6 !important;
  }

  .mt-explanation {
    margin-top: 16px !important;
    padding: 12px !important;
    background: rgba(59,130,246,0.1) !important;
    border-left: 3px solid #3b82f6 !important;
    border-radius: 4px !important;
    font-size: 13px !important;
    color: rgba(255, 255, 255, 0.85) !important;
  }

  /* ─── RESPONSIVE ─── */
  @media (max-width: 600px) {
    .mt-modal-content {
      max-height: 95vh !important;
      width: 98% !important;
    }

    .mt-score-section {
      grid-template-columns: 1fr !important;
    }

    .mt-exam-buttons {
      grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)) !important;
    }

    .mt-modal-header {
      padding: 16px !important;
    }

    .mt-modal-body {
      padding: 16px !important;
    }

    .mt-modal-footer {
      padding: 12px 16px !important;
      flex-direction: column-reverse !important;
    }

    .mt-modal-footer .mt-btn {
      width: 100% !important;
    }
  }
`;

  if (!document.head.querySelector('style[data-mock-test-styles]')) {
    mockTestStyles.setAttribute('data-mock-test-styles', 'true');
    document.head.appendChild(mockTestStyles);
  }

})();
