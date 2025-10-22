'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, Trophy, Clock, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getDataLoader } from '@/lib/data-loader'
import { useQuizStore } from '@/store/quiz-store'
import { Poem } from '@/lib/types'

export default function HomePage() {
  const [dailyPoem, setDailyPoem] = useState<Poem | null>(null)
  const stats = useQuizStore((state) => state.stats)

  useEffect(() => {
    const loadData = async () => {
      try {
        const dataLoader = getDataLoader()
        await dataLoader.loadPoems()
        const poem = dataLoader.getDailyPoem()
        setDailyPoem(poem)
      } catch (error) {
        console.error('Failed to load data:', error)
      }
    }

    loadData()
  }, [])

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ヒーローセクション */}
      <section className="text-center space-y-4 py-8">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          百人一首を楽しく学ぼう
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          日本の古典文学の傑作、百人一首をクイズで楽しく学習できます。
          上の句から下の句を当てたり、作者を当てたり、様々なモードで挑戦しましょう。
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link href="/quiz">
            <Button size="lg" className="gap-2">
              <BookOpen className="h-5 w-5" />
              クイズを始める
            </Button>
          </Link>
          <Link href="/library">
            <Button size="lg" variant="outline" className="gap-2">
              📚 ライブラリを見る
            </Button>
          </Link>
        </div>
      </section>

      {/* 今日の一首 */}
      {dailyPoem && (
        <section>
          <Card className="poem-card max-w-2xl mx-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">🌸 今日の一首</CardTitle>
                <Badge variant="secondary">第{dailyPoem.id}番</Badge>
              </div>
              <CardDescription className="text-lg font-medium">
                {dailyPoem.author}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="poem-text text-center space-y-2">
                <p className="text-2xl">{dailyPoem.upper}</p>
                <p className="text-2xl">{dailyPoem.lower}</p>
              </div>
              <div className="text-base text-muted-foreground pt-4 border-t">
                <p className="mb-2 font-medium">読み：</p>
                <p>{dailyPoem.reading_upper}</p>
                <p>{dailyPoem.reading_lower}</p>
              </div>
              {dailyPoem.description && (
                <div className="text-base text-muted-foreground pt-4 border-t">
                  <p className="mb-2 font-medium">解説：</p>
                  <p>{dailyPoem.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {/* 統計情報 */}
      <section className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">総クイズ回数</CardTitle>
            <BookOpen className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalQuizzes}</div>
            <p className="text-sm text-muted-foreground">回プレイ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">総問題数</CardTitle>
            <Trophy className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalQuestions}</div>
            <p className="text-sm text-muted-foreground">問に挑戦</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">正解率</CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats.overallAccuracy.toFixed(1)}%
            </div>
            <p className="text-sm text-muted-foreground">全体の正解率</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">習得済み</CardTitle>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.masteredPoems.length}</div>
            <p className="text-sm text-muted-foreground">首を習得</p>
          </CardContent>
        </Card>
      </section>

      {/* クイズモード紹介 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-center">クイズモード</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>上の句 → 下の句</CardTitle>
              <CardDescription>
                上の句から下の句を当てる基本モード
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-base text-muted-foreground">
                最も基本的なモードです。上の句を見て、正しい下の句を4つの選択肢から選びます。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>下の句 → 上の句</CardTitle>
              <CardDescription>
                下の句から上の句を当てるモード
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-base text-muted-foreground">
                下の句を見て上の句を当てます。上の句を覚えるのに効果的です。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>作者 → 歌</CardTitle>
              <CardDescription>
                作者名から歌を当てるモード
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-base text-muted-foreground">
                作者の名前を見て、その作者の歌を選びます。作者と歌の関連を学べます。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>歌 → 作者</CardTitle>
              <CardDescription>
                歌から作者を当てるモード
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-base text-muted-foreground">
                歌を見て作者を当てます。作者の名前を覚えるのに最適です。
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-8">
        <Card className="max-w-2xl mx-auto bg-gradient-to-r from-pink-50 to-purple-50">
          <CardHeader>
            <CardTitle className="text-2xl">さあ、始めましょう！</CardTitle>
            <CardDescription>
              自分に合った難易度とモードで学習を開始
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/quiz">
              <Button size="lg" className="gap-2">
                <BookOpen className="h-5 w-5" />
                クイズに挑戦する
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}