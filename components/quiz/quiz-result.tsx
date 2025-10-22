'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { QuizResult } from '@/lib/types'
import { Trophy, Home, RotateCcw, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { formatTime } from '@/lib/utils'

interface QuizResultProps {
  result: QuizResult
  onRestart: () => void
}

export function QuizResultComponent({ result, onRestart }: QuizResultProps) {
  const getResultMessage = () => {
    if (result.accuracy >= 90) return { text: '素晴らしい！', emoji: '🎉', color: 'text-yellow-500' }
    if (result.accuracy >= 70) return { text: 'よくできました！', emoji: '👏', color: 'text-green-500' }
    if (result.accuracy >= 50) return { text: 'まずまずです', emoji: '😊', color: 'text-blue-500' }
    return { text: 'もう一度挑戦！', emoji: '💪', color: 'text-purple-500' }
  }

  const message = getResultMessage()

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 結果サマリー */}
      <Card className="text-center poem-card">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Trophy className={`h-16 w-16 ${message.color}`} />
          </div>
          <CardTitle className="text-3xl">
            <span className="text-4xl mr-2">{message.emoji}</span>
            {message.text}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* スコア表示 */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">正解数</p>
              <p className="text-3xl font-bold text-green-500">
                {result.correctCount}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">不正解数</p>
              <p className="text-3xl font-bold text-red-500">
                {result.incorrectCount}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">正解率</p>
              <p className="text-3xl font-bold text-blue-500">
                {result.accuracy.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* 詳細統計 */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <p className="text-sm">総時間</p>
              </div>
              <p className="text-xl font-semibold">{formatTime(result.totalTime)}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <p className="text-sm">平均時間/問</p>
              </div>
              <p className="text-xl font-semibold">
                {result.averageTimePerQuestion.toFixed(1)}秒
              </p>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button onClick={onRestart} variant="default" className="flex-1 gap-2">
              <RotateCcw className="h-4 w-4" />
              もう一度挑戦
            </Button>
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full gap-2">
                <Home className="h-4 w-4" />
                ホームへ戻る
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* 詳細結果 */}
      <Card>
        <CardHeader>
          <CardTitle>詳細結果</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {result.answers.map((answer, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  answer.isCorrect
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">問{index + 1}</Badge>
                      {answer.isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    {!answer.isCorrect && (
                      <div className="text-sm space-y-1">
                        <p className="text-muted-foreground">
                          あなたの回答: <span className="text-red-600">{answer.selectedAnswer}</span>
                        </p>
                        <p className="text-muted-foreground">
                          正解: <span className="text-green-600">{answer.correctAnswer}</span>
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {answer.timeSpent.toFixed(1)}秒
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}