import { Poem, Difficulty } from './types'

/**
 * 百人一首データを管理するクラス
 */
export class DataLoader {
  private poems: Poem[] = []
  private isLoaded: boolean = false

  /**
   * JSONファイルからデータを読み込む
   */
  async loadPoems(): Promise<Poem[]> {
    if (this.isLoaded && this.poems.length > 0) {
      return this.poems
    }

    try {
      const response = await fetch('/data/hyakunin_isshu.json')
      
      if (!response.ok) {
        throw new Error(`Failed to load data: ${response.statusText}`)
      }

      const data = await response.json()
      
      // データの検証
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Invalid data format')
      }

      this.poems = data.map((item: any) => ({
        id: item.id,
        author: item.author,
        upper: item.upper,
        lower: item.lower,
        reading_upper: item.reading_upper,
        reading_lower: item.reading_lower,
        description: item.description || '',
      }))

      this.isLoaded = true
      return this.poems
    } catch (error) {
      console.error('Error loading poems:', error)
      throw error
    }
  }

  /**
   * すべての歌を取得
   */
  getAllPoems(): Poem[] {
    if (!this.isLoaded) {
      throw new Error('Data not loaded. Call loadPoems() first.')
    }
    return [...this.poems]
  }

  /**
   * IDで特定の歌を取得
   */
  getPoemById(id: number): Poem | undefined {
    return this.poems.find(poem => poem.id === id)
  }

  /**
   * 難易度に応じた歌を取得
   */
  getPoemsByDifficulty(difficulty: Difficulty): Poem[] {
    switch (difficulty) {
      case Difficulty.BEGINNER:
        return this.poems.filter(poem => poem.id >= 1 && poem.id <= 20)
      
      case Difficulty.INTERMEDIATE:
        return this.poems.filter(poem => poem.id >= 21 && poem.id <= 50)
      
      case Difficulty.ADVANCED:
        return this.poems.filter(poem => poem.id >= 51 && poem.id <= 100)
      
      case Difficulty.ALL:
        return [...this.poems]
      
      default:
        return [...this.poems]
    }
  }

  /**
   * ランダムに歌を取得
   */
  getRandomPoems(count: number, difficulty?: Difficulty): Poem[] {
    const sourcePoems = difficulty 
      ? this.getPoemsByDifficulty(difficulty)
      : this.getAllPoems()

    // シャッフル
    const shuffled = [...sourcePoems].sort(() => Math.random() - 0.5)
    
    // 指定された数だけ返す
    return shuffled.slice(0, Math.min(count, shuffled.length))
  }

  /**
   * 作者名で歌を検索
   */
  getPoemsByAuthor(author: string): Poem[] {
    return this.poems.filter(poem => 
      poem.author.includes(author)
    )
  }

  /**
   * キーワードで歌を検索
   */
  searchPoems(keyword: string): Poem[] {
    const lowerKeyword = keyword.toLowerCase()
    
    return this.poems.filter(poem => 
      poem.author.toLowerCase().includes(lowerKeyword) ||
      poem.upper.includes(keyword) ||
      poem.lower.includes(keyword) ||
      poem.reading_upper.includes(keyword) ||
      poem.reading_lower.includes(keyword)
    )
  }

  /**
   * 今日の一首を取得（日付ベースで決定的に選択）
   */
  getDailyPoem(date?: Date): Poem {
    const targetDate = date || new Date()
    
    // 日付から一意のインデックスを計算
    const year = targetDate.getFullYear()
    const month = targetDate.getMonth() + 1
    const day = targetDate.getDate()
    
    // シンプルなハッシュ関数
    const seed = (year * 10000 + month * 100 + day) % this.poems.length
    
    return this.poems[seed]
  }

  /**
   * データがロード済みかチェック
   */
  isDataLoaded(): boolean {
    return this.isLoaded
  }

  /**
   * 歌の総数を取得
   */
  getTotalCount(): number {
    return this.poems.length
  }
}

// シングルトンインスタンス
let dataLoaderInstance: DataLoader | null = null

/**
 * DataLoaderのシングルトンインスタンスを取得
 */
export function getDataLoader(): DataLoader {
  if (!dataLoaderInstance) {
    dataLoaderInstance = new DataLoader()
  }
  return dataLoaderInstance
}