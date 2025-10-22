import { 
  Poem, 
  Question, 
  QuizMode, 
  Difficulty, 
  QuizSettings 
} from './types'
import { shuffleArray, getRandomItems } from './utils'

/**
 * クイズの問題を生成・管理するクラス
 */
export class QuizManager {
  private allPoems: Poem[] = []

  constructor(poems: Poem[]) {
    this.allPoems = poems
  }

  /**
   * クイズ設定に基づいて問題リストを生成
   */
  generateQuestions(settings: QuizSettings): Question[] {
    // 難易度に応じた歌を取得
    const sourcePoems = this.getPoemsByDifficulty(settings.difficulty)
    
    // ランダムに指定数の歌を選択
    const selectedPoems = getRandomItems(
      sourcePoems, 
      settings.questionCount
    )

    // 各歌から問題を生成
    return selectedPoems.map((poem, index) => 
      this.createQuestion(poem, settings.mode, index)
    )
  }

  /**
   * 難易度に応じた歌を取得
   */
  private getPoemsByDifficulty(difficulty: Difficulty): Poem[] {
    switch (difficulty) {
      case Difficulty.BEGINNER:
        return this.allPoems.filter(p => p.id >= 1 && p.id <= 20)
      
      case Difficulty.INTERMEDIATE:
        return this.allPoems.filter(p => p.id >= 21 && p.id <= 50)
      
      case Difficulty.ADVANCED:
        return this.allPoems.filter(p => p.id >= 51 && p.id <= 100)
      
      case Difficulty.ALL:
      default:
        return this.allPoems
    }
  }

  /**
   * 単一の問題を生成
   */
  private createQuestion(
    poem: Poem, 
    mode: QuizMode, 
    index: number
  ): Question {
    const questionId = `${mode}_${poem.id}_${Date.now()}_${index}`

    switch (mode) {
      case QuizMode.UPPER_TO_LOWER:
        return this.createUpperToLowerQuestion(poem, questionId)
      
      case QuizMode.LOWER_TO_UPPER:
        return this.createLowerToUpperQuestion(poem, questionId)
      
      case QuizMode.AUTHOR_TO_POEM:
        return this.createAuthorToPoemQuestion(poem, questionId)
      
      case QuizMode.POEM_TO_AUTHOR:
        return this.createPoemToAuthorQuestion(poem, questionId)
      
      default:
        throw new Error(`Unknown quiz mode: ${mode}`)
    }
  }

  /**
   * 上の句 → 下の句 問題を生成
   */
  private createUpperToLowerQuestion(poem: Poem, id: string): Question {
    const wrongChoices = this.getRandomWrongChoices(
      poem.id,
      (p) => p.lower,
      3
    )

    const choices = shuffleArray([poem.lower, ...wrongChoices])

    return {
      id,
      poemId: poem.id,
      mode: QuizMode.UPPER_TO_LOWER,
      questionText: poem.upper,
      correctAnswer: poem.lower,
      choices,
      explanation: `作者: ${poem.author}\n${poem.description}`,
    }
  }

  /**
   * 下の句 → 上の句 問題を生成
   */
  private createLowerToUpperQuestion(poem: Poem, id: string): Question {
    const wrongChoices = this.getRandomWrongChoices(
      poem.id,
      (p) => p.upper,
      3
    )

    const choices = shuffleArray([poem.upper, ...wrongChoices])

    return {
      id,
      poemId: poem.id,
      mode: QuizMode.LOWER_TO_UPPER,
      questionText: poem.lower,
      correctAnswer: poem.upper,
      choices,
      explanation: `作者: ${poem.author}\n${poem.description}`,
    }
  }

  /**
   * 作者 → 歌 問題を生成
   */
  private createAuthorToPoemQuestion(poem: Poem, id: string): Question {
    const fullPoem = `${poem.upper}\n${poem.lower}`
    
    const wrongChoices = this.getRandomWrongChoices(
      poem.id,
      (p) => `${p.upper}\n${p.lower}`,
      3
    )

    const choices = shuffleArray([fullPoem, ...wrongChoices])

    return {
      id,
      poemId: poem.id,
      mode: QuizMode.AUTHOR_TO_POEM,
      questionText: poem.author,
      correctAnswer: fullPoem,
      choices,
      explanation: poem.description,
    }
  }

  /**
   * 歌 → 作者 問題を生成
   */
  private createPoemToAuthorQuestion(poem: Poem, id: string): Question {
    const fullPoem = `${poem.upper}\n${poem.lower}`
    
    const wrongChoices = this.getRandomWrongChoices(
      poem.id,
      (p) => p.author,
      3
    )

    const choices = shuffleArray([poem.author, ...wrongChoices])

    return {
      id,
      poemId: poem.id,
      mode: QuizMode.POEM_TO_AUTHOR,
      questionText: fullPoem,
      correctAnswer: poem.author,
      choices,
      explanation: poem.description,
    }
  }

  /**
   * ランダムな誤答選択肢を取得
   */
  private getRandomWrongChoices(
    correctPoemId: number,
    selector: (poem: Poem) => string,
    count: number
  ): string[] {
    // 正解以外の歌を取得
    const otherPoems = this.allPoems.filter(p => p.id !== correctPoemId)
    
    // ランダムに選択
    const selected = getRandomItems(otherPoems, count)
    
    // 選択肢のテキストを抽出
    return selected.map(selector)
  }

  /**
   * 答えが正しいかチェック
   */
  checkAnswer(question: Question, answer: string): boolean {
    return question.correctAnswer === answer
  }

  /**
   * 利用可能な歌の数を取得
   */
  getAvailablePoemCount(difficulty: Difficulty): number {
    return this.getPoemsByDifficulty(difficulty).length
  }
}