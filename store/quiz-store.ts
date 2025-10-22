import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  QuizSession,
  QuizSettings,
  Question,
  Answer,
  QuizResult,
  LearningStats,
  QuizMode,
  Difficulty,
} from '@/lib/types'

interface QuizState {
  // 現在のセッション
  currentSession: QuizSession | null
  
  // クイズ設定
  settings: QuizSettings
  
  // 学習統計
  stats: LearningStats
  
  // アクション
  startQuiz: (questions: Question[], settings: QuizSettings) => void
  submitAnswer: (answer: Answer) => void
  nextQuestion: () => void
  completeQuiz: () => QuizResult | null
  resetQuiz: () => void
  updateSettings: (settings: Partial<QuizSettings>) => void
  getCurrentQuestion: () => Question | null
  updateStats: (result: QuizResult) => void
}

const defaultSettings: QuizSettings = {
  mode: QuizMode.UPPER_TO_LOWER,
  difficulty: Difficulty.BEGINNER,
  questionCount: 10,
  showReading: true,
  showExplanation: true,
}

const defaultStats: LearningStats = {
  totalQuizzes: 0,
  totalQuestions: 0,
  correctAnswers: 0,
  overallAccuracy: 0,
  weakPoems: [],
  masteredPoems: [],
  modeStats: {
    [QuizMode.UPPER_TO_LOWER]: { played: 0, accuracy: 0 },
    [QuizMode.LOWER_TO_UPPER]: { played: 0, accuracy: 0 },
    [QuizMode.AUTHOR_TO_POEM]: { played: 0, accuracy: 0 },
    [QuizMode.POEM_TO_AUTHOR]: { played: 0, accuracy: 0 },
  },
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      currentSession: null,
      settings: defaultSettings,
      stats: defaultStats,

      /**
       * クイズを開始
       */
      startQuiz: (questions, settings) => {
        const session: QuizSession = {
          id: `session_${Date.now()}`,
          mode: settings.mode,
          difficulty: settings.difficulty,
          totalQuestions: questions.length,
          currentQuestionIndex: 0,
          questions,
          answers: [],
          startTime: new Date(),
          isCompleted: false,
        }

        set({ 
          currentSession: session,
          settings 
        })
      },

      /**
       * 回答を提出
       */
      submitAnswer: (answer) => {
        const { currentSession } = get()
        
        if (!currentSession) return

        const updatedSession = {
          ...currentSession,
          answers: [...currentSession.answers, answer],
        }

        set({ currentSession: updatedSession })
      },

      /**
       * 次の問題へ
       */
      nextQuestion: () => {
        const { currentSession } = get()
        
        if (!currentSession) return

        const nextIndex = currentSession.currentQuestionIndex + 1

        set({
          currentSession: {
            ...currentSession,
            currentQuestionIndex: nextIndex,
          }
        })
      },

      /**
       * クイズを完了
       */
      completeQuiz: () => {
        const { currentSession } = get()
        
        if (!currentSession) return null

        const endTime = new Date()
        const totalTime = Math.floor(
          (endTime.getTime() - currentSession.startTime.getTime()) / 1000
        )

        const correctCount = currentSession.answers.filter(a => a.isCorrect).length
        const accuracy = (correctCount / currentSession.totalQuestions) * 100

        const result: QuizResult = {
          sessionId: currentSession.id,
          mode: currentSession.mode,
          difficulty: currentSession.difficulty,
          totalQuestions: currentSession.totalQuestions,
          correctCount,
          incorrectCount: currentSession.totalQuestions - correctCount,
          accuracy,
          totalTime,
          averageTimePerQuestion: totalTime / currentSession.totalQuestions,
          answers: currentSession.answers,
          completedAt: endTime,
        }

        // 統計を更新
        get().updateStats(result)

        // セッションを完了状態に
        set({
          currentSession: {
            ...currentSession,
            endTime,
            isCompleted: true,
          }
        })

        return result
      },

      /**
       * クイズをリセット
       */
      resetQuiz: () => {
        set({ currentSession: null })
      },

      /**
       * 設定を更新
       */
      updateSettings: (newSettings) => {
        set({
          settings: {
            ...get().settings,
            ...newSettings,
          }
        })
      },

      /**
       * 現在の問題を取得
       */
      getCurrentQuestion: () => {
        const { currentSession } = get()
        
        if (!currentSession) return null

        return currentSession.questions[currentSession.currentQuestionIndex] || null
      },

      /**
       * 統計を更新
       */
      updateStats: (result) => {
        const { stats } = get()

        // 苦手な歌と習得済みの歌を更新
        const weakPoems = new Set(stats.weakPoems)
        const masteredPoems = new Set(stats.masteredPoems)

        result.answers.forEach(answer => {
          if (!answer.isCorrect) {
            weakPoems.add(answer.poemId)
            masteredPoems.delete(answer.poemId)
          } else {
            // 連続3回正解したら習得済みとする（簡易実装）
            masteredPoems.add(answer.poemId)
          }
        })

        // モード別統計を更新
        const modeStats = { ...stats.modeStats }
        const currentModeStats = modeStats[result.mode]
        
        const newPlayed = currentModeStats.played + 1
        const newAccuracy = 
          (currentModeStats.accuracy * currentModeStats.played + result.accuracy) / newPlayed

        modeStats[result.mode] = {
          played: newPlayed,
          accuracy: newAccuracy,
        }

        // 全体統計を更新
        const newTotalQuestions = stats.totalQuestions + result.totalQuestions
        const newCorrectAnswers = stats.correctAnswers + result.correctCount
        const newOverallAccuracy = (newCorrectAnswers / newTotalQuestions) * 100

        const updatedStats: LearningStats = {
          totalQuizzes: stats.totalQuizzes + 1,
          totalQuestions: newTotalQuestions,
          correctAnswers: newCorrectAnswers,
          overallAccuracy: newOverallAccuracy,
          weakPoems: Array.from(weakPoems),
          masteredPoems: Array.from(masteredPoems),
          modeStats,
          lastPlayedAt: new Date(),
        }

        set({ stats: updatedStats })
      },
    }),
    {
      name: 'hyakunin-isshu-quiz-storage',
      partialize: (state) => ({
        settings: state.settings,
        stats: state.stats,
      }),
    }
  )
)