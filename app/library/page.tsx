'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { getDataLoader } from '@/lib/data-loader'
import { Poem } from '@/lib/types'
import { Search } from 'lucide-react'

export default function LibraryPage() {
  const [poems, setPoems] = useState<Poem[]>([])
  const [filteredPoems, setFilteredPoems] = useState<Poem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const dataLoader = getDataLoader()
        await dataLoader.loadPoems()
        const allPoems = dataLoader.getAllPoems()
        setPoems(allPoems)
        setFilteredPoems(allPoems)
      } catch (error) {
        console.error('Failed to load poems:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPoems(poems)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = poems.filter(
      (poem) =>
        poem.author.toLowerCase().includes(query) ||
        poem.upper.includes(searchQuery) ||
        poem.lower.includes(searchQuery) ||
        poem.reading_upper.includes(searchQuery) ||
        poem.reading_lower.includes(searchQuery) ||
        poem.id.toString().includes(searchQuery)
    )
    setFilteredPoems(filtered)
  }, [searchQuery, poems])

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">読み込み中...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">百人一首ライブラリ</h1>
          <p className="text-muted-foreground">
            百首すべての歌を閲覧できます
          </p>
        </div>

        {/* 検索バー */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="番号、作者、歌で検索..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          {filteredPoems.length}首を表示中
        </div>
      </div>

      {/* 歌のリスト */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredPoems.map((poem) => (
          <Card key={poem.id} className="poem-card hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{poem.author}</CardTitle>
                <Badge variant="secondary">第{poem.id}番</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="poem-text text-center space-y-2 p-4 bg-white/50 rounded-lg">
                <p className="text-base">{poem.upper}</p>
                <p className="text-base">{poem.lower}</p>
              </div>

              <div className="text-sm text-muted-foreground space-y-2">
                <div className="space-y-1">
                  <p className="font-medium">読み：</p>
                  <p className="text-xs">{poem.reading_upper}</p>
                  <p className="text-xs">{poem.reading_lower}</p>
                </div>

                {poem.description && (
                  <div className="pt-2 border-t space-y-1">
                    <p className="font-medium">解説：</p>
                    <p className="text-xs">{poem.description}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPoems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            検索結果が見つかりませんでした
          </p>
        </div>
      )}
    </div>
  )
}