'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { QuizMode, Difficulty, QuizSettings, QuizModeLabels, DifficultyLabels } from '@/lib/types'
import { PlayCircle } from 'lucide-react'

interface QuizSettingsProps {
  onStart: (settings: QuizSettings) => void
}

export function QuizSettingsComponent({ onStart }: QuizSettingsProps) {
  const [mode, setMode] = useState<QuizMode>(QuizMode.UPPER_TO_LOWER)
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.BEGINNER)
  const [questionCount, setQuestionCount] = useState<number>(10)

  const handleStart = () => {
    const settings: QuizSettings = {
      mode,
      difficulty,
      questionCount,
      showReading: true,
      showExplanation: true,
    }
    onStart(settings)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">クイズ設定</CardTitle>
        <CardDescription>
          お好みのモードと難易度を選択してください
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* クイズモード選択 */}
        <div className="space-y-3">
          <Label className="text-lg font-semibold">クイズモード</Label>
          <RadioGroup value={mode} onValueChange={(value) => setMode(value as QuizMode)}>
            {Object.entries(QuizModeLabels).map(([key, label]) => (
              <div key={key} className="flex items-center space-x-2">
                <RadioGroupItem value={key} id={key} />
                <Label htmlFor={key} className="text-base font-normal cursor-pointer">
                  {label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* 難易度選択 */}
        <div className="space-y-3">
          <Label className="text-lg font-semibold">難易度</Label>
          <RadioGroup value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
            {Object.entries(DifficultyLabels).map(([key, label]) => (
              <div key={key} className="flex items-center space-x-2">
                <RadioGroupItem value={key} id={key} />
                <Label htmlFor={key} className="text-base font-normal cursor-pointer">
                  {label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* 出題数選択 */}
        <div className="space-y-3">
          <Label htmlFor="question-count" className="text-lg font-semibold">
            出題数
          </Label>
          <Select
            value={questionCount.toString()}
            onValueChange={(value) => setQuestionCount(parseInt(value))}
          >
            <SelectTrigger id="question-count" className="text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10" className="text-base">10問</SelectItem>
              <SelectItem value="20" className="text-base">20問</SelectItem>
              <SelectItem value="50" className="text-base">50問</SelectItem>
              <SelectItem value="100" className="text-base">100問（全問）</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 開始ボタン */}
        <Button 
          onClick={handleStart} 
          className="w-full gap-2 text-lg" 
          size="lg"
        >
          <PlayCircle className="h-5 w-5" />
          クイズを開始
        </Button>
      </CardContent>
    </Card>
  )
}