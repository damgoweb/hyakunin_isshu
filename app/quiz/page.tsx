'use client'

import { useState, useEffect } from 'react'
import { QuizSettingsComponent } from '@/components/quiz/quiz-settings'
import { QuestionCard } from '@/components/quiz/question-card'
import { QuizResultComponent } from '@/components/quiz/quiz-result'
import { getDataLoader } from '@/lib/data-loader'
import { QuizManager } from '@/lib/quiz-manager'
import { useQuizStore } from '@/store/quiz-store'
import { QuizSettings, Answer, QuizResult } from '@/lib/types'

type QuizState = 'settings' | 'quiz' | 'result'

export default function QuizPage() {
  const [quizState, setQuizState] = useState<QuizState>('settings')
  const [quizManager, setQuizManager] = useState<QuizManager | null>(null)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [result, setResult] = useState<QuizResult | null>(null)

  const {
    currentSession,
    startQuiz,
    submitAnswer,
    nextQuestion,
    completeQuiz,
    resetQuiz,
    getCurrentQuestion,
  } = useQuizStore()

  // データの初期化
  useEffect(() => {
    const initData = async () => {
      try {
        const dataLoader = getDataLoader()
        await dataLoader.loadPoems()
        const poems = dataLoader.getAllPoems()
        setQuizManager(new QuizManager(poems))
      } catch (error) {
        console.error('Failed to load data:', error)
      }
    }

    initData()
  }, [])

  // クイズ開始
  const handleStartQuiz = (settings: QuizSettings) => {
    if (!quizManager) return

    // 問題を生成
    const questions = quizManager.generateQuestions(settings)
    
    // セッションを開始
    startQuiz(questions, settings)
    setStartTime(new Date())
    setQuizState('quiz')
  }

  // 回答提出
  const handleAnswer = (selectedAnswer: string) => {
    const question = getCurrentQuestion()
    if (!question || !startTime) return

    const now = new Date()
    const timeSpent = (now.getTime() - startTime.getTime()) / 1000

    const answer: Answer = {
      questionId: question.id,
      poemId: question.poemId,
      selectedAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect: selectedAnswer === question.correctAnswer,
      timeSpent,
      timestamp: now,
    }

    submitAnswer(answer)

    // 次の問題へ
    if (currentSession && currentSession.currentQuestionIndex < currentSession.totalQuestions - 1) {
      nextQuestion()
      setStartTime(new Date())
    } else {
      // クイズ完了
      const quizResult = completeQuiz()
      if (quizResult) {
        setResult(quizResult)
        setQuizState('result')
      }
    }
  }

  // クイズを再開始
  const handleRestart = () => {
    resetQuiz()
    setQuizState('settings')
    setResult(null)
  }

  // 現在の問題を取得
  const currentQuestion = getCurrentQuestion()

  return (
    <div className="max-w-4xl mx-auto">
      {quizState === 'settings' && (
        <QuizSettingsComponent onStart={handleStartQuiz} />
      )}

      {quizState === 'quiz' && currentSession && currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          currentIndex={currentSession.currentQuestionIndex}
          totalQuestions={currentSession.totalQuestions}
          onAnswer={handleAnswer}
        />
      )}

      {quizState === 'result' && result && (
        <QuizResultComponent result={result} onRestart={handleRestart} />
      )}
    </div>
  )
}