/**
 * 百人一首の一首のデータ構造
 */
export interface Poem {
  id: number
  author: string
  upper: string          // 上の句
  lower: string          // 下の句
  reading_upper: string  // 上の句の読み
  reading_lower: string  // 下の句の読み
  description: string    // 解説
}

/**
 * クイズのモード
 */
export enum QuizMode {
  UPPER_TO_LOWER = 'upper_to_lower',       // 上の句 → 下の句
  LOWER_TO_UPPER = 'lower_to_upper',       // 下の句 → 上の句
  AUTHOR_TO_POEM = 'author_to_poem',       // 作者 → 歌
  POEM_TO_AUTHOR = 'poem_to_author',       // 歌 → 作者
}

/**
 * 難易度レベル
 */
export enum Difficulty {
  BEGINNER = 'beginner',           // 初級（1-20番）
  INTERMEDIATE = 'intermediate',   // 中級（21-50番）
  ADVANCED = 'advanced',           // 上級（51-100番）
  ALL = 'all',                     // 全問
}

/**
 * クイズの問題
 */
export interface Question {
  id: string                    // 問題のユニークID
  poemId: number               // 元となる歌のID
  mode: QuizMode               // クイズモード
  questionText: string         // 問題文
  correctAnswer: string        // 正解
  choices: string[]            // 選択肢（4つ）
  explanation: string          // 解説
}

/**
 * ユーザーの回答
 */
export interface Answer {
  questionId: string           // 問題ID
  poemId: number              // 歌のID
  selectedAnswer: string      // 選択した答え
  correctAnswer: string       // 正解
  isCorrect: boolean          // 正誤
  timeSpent: number           // 回答にかかった時間（秒）
  timestamp: Date             // 回答した日時
}

/**
 * クイズセッション
 */
export interface QuizSession {
  id: string                   // セッションID
  mode: QuizMode              // クイズモード
  difficulty: Difficulty      // 難易度
  totalQuestions: number      // 総問題数
  currentQuestionIndex: number // 現在の問題番号（0始まり）
  questions: Question[]       // 問題リスト
  answers: Answer[]           // 回答履歴
  startTime: Date             // 開始時刻
  endTime?: Date              // 終了時刻
  isCompleted: boolean        // 完了フラグ
}

/**
 * クイズの設定
 */
export interface QuizSettings {
  mode: QuizMode
  difficulty: Difficulty
  questionCount: number        // 出題数（10, 20, 50, 100）
  showReading: boolean        // 読みを表示するか
  showExplanation: boolean    // 解説を表示するか
  timeLimit?: number          // 制限時間（秒）オプション
}

/**
 * クイズの結果
 */
export interface QuizResult {
  sessionId: string
  mode: QuizMode
  difficulty: Difficulty
  totalQuestions: number
  correctCount: number
  incorrectCount: number
  accuracy: number             // 正解率（%）
  totalTime: number            // 総時間（秒）
  averageTimePerQuestion: number // 1問あたりの平均時間
  answers: Answer[]
  completedAt: Date
}

/**
 * 学習統計
 */
export interface LearningStats {
  totalQuizzes: number         // 総クイズ回数
  totalQuestions: number       // 総問題数
  correctAnswers: number       // 総正解数
  overallAccuracy: number      // 総合正解率
  weakPoems: number[]          // 苦手な歌のIDリスト
  masteredPoems: number[]      // 習得済みの歌のIDリスト
  modeStats: {
    [key in QuizMode]: {
      played: number
      accuracy: number
    }
  }
  lastPlayedAt?: Date
}

/**
 * 今日の一首
 */
export interface DailyPoem {
  poem: Poem
  date: string                 // YYYY-MM-DD形式
}

/**
 * モード表示名のマッピング
 */
export const QuizModeLabels: Record<QuizMode, string> = {
  [QuizMode.UPPER_TO_LOWER]: '上の句 → 下の句',
  [QuizMode.LOWER_TO_UPPER]: '下の句 → 上の句',
  [QuizMode.AUTHOR_TO_POEM]: '作者 → 歌',
  [QuizMode.POEM_TO_AUTHOR]: '歌 → 作者',
}

/**
 * 難易度表示名のマッピング
 */
export const DifficultyLabels: Record<Difficulty, string> = {
  [Difficulty.BEGINNER]: '初級（1-20番）',
  [Difficulty.INTERMEDIATE]: '中級（21-50番）',
  [Difficulty.ADVANCED]: '上級（51-100番）',
  [Difficulty.ALL]: '全問（1-100番）',
}