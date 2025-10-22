'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Question } from '@/lib/types'
import { CheckCircle2, XCircle } from 'lucide-react'

interface QuestionCardProps {
  question: Question
  currentIndex: number
  totalQuestions: number
  onAnswer: (answer: string) => void
}

export function QuestionCard({
  question,
  currentIndex,
  totalQuestions,
  onAnswer,
}: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleSubmit = () => {
    if (!selectedAnswer) return

    const correct = selectedAnswer === question.correctAnswer
    setIsCorrect(correct)
    setIsAnswered(true)
  }

  const handleNext = () => {
    onAnswer(selectedAnswer)
    setSelectedAnswer('')
    setIsAnswered(false)
  }

  const progress = ((currentIndex + 1) / totalQuestions) * 100

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 進捗表示 */}
      <div className="space-y-2">
        <div className="flex justify-between text-base text-muted-foreground font-medium">
          <span>問題 {currentIndex + 1} / {totalQuestions}</span>
          <span>{progress.toFixed(0)}%</span>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      {/* 問題カード */}
      <Card className="poem-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">問題</CardTitle>
            <Badge variant="secondary" className="text-base px-3 py-1">第{question.poemId}番</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 問題文 */}
          <div className="text-center p-4 bg-white/50 rounded-lg">
            <p className="text-2xl font-bold font-sans whitespace-pre-line leading-relaxed">{question.questionText}</p>
          </div>

          {/* 選択肢 */}
          <div className="space-y-3">
            <Label className="text-xl font-semibold">選択肢を選んでください</Label>
            <RadioGroup
              value={selectedAnswer}
              onValueChange={setSelectedAnswer}
              disabled={isAnswered}
              className="space-y-3"
            >
              {question.choices.map((choice, index) => {
                const isThisCorrect = choice === question.correctAnswer
                const isThisSelected = choice === selectedAnswer
                
                let itemClassName = "flex items-start space-x-3 p-4 rounded-lg border-2 transition-all"
                
                if (isAnswered) {
                  if (isThisCorrect) {
                    itemClassName += " bg-green-50 border-green-500"
                  } else if (isThisSelected && !isThisCorrect) {
                    itemClassName += " bg-red-50 border-red-500"
                  }
                } else {
                  itemClassName += " hover:bg-accent cursor-pointer"
                }

                return (
                  <div key={index} className={itemClassName}>
                    <RadioGroupItem value={choice} id={`choice-${index}`} className="mt-1" />
                    <Label
                      htmlFor={`choice-${index}`}
                      className="flex-1 cursor-pointer text-xl font-sans leading-relaxed"
                    >
                      <span className="whitespace-pre-line">{choice}</span>
                    </Label>
                    {isAnswered && isThisCorrect && (
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    )}
                    {isAnswered && isThisSelected && !isThisCorrect && (
                      <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    )}
                  </div>
                )
              })}
            </RadioGroup>
          </div>

          {/* 解説（回答後） */}
          {isAnswered && (
            <div className="space-y-2 p-4 bg-accent/50 rounded-lg animate-fade-in">
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="h-7 w-7 text-green-500" />
                    <span className="font-semibold text-2xl text-green-700">正解！</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-7 w-7 text-red-500" />
                    <span className="font-semibold text-2xl text-red-700">不正解</span>
                  </>
                )}
              </div>
              {question.explanation && (
                <div className="text-lg text-muted-foreground">
                  <p className="font-medium mb-2">解説：</p>
                  <p className="whitespace-pre-line leading-relaxed">{question.explanation}</p>
                </div>
              )}
            </div>
          )}

          {/* ボタン */}
          <div className="flex gap-3 pt-2">
            {!isAnswered ? (
              <Button
                onClick={handleSubmit}
                disabled={!selectedAnswer}
                className="w-full text-xl h-14"
                size="lg"
              >
                回答する
              </Button>
            ) : (
              <Button onClick={handleNext} className="w-full text-xl h-14" size="lg">
                次の問題へ
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}