interface IQuestion {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  options: string[];
}

interface IQuizResult {
  correctAnswersNumber: number;
  totalQuestionsNumber: number;
  currentQuizSuccessRate: number;
  allQuizzesSuccessRate: number;
  hasAllQuizzesSuccessRate: boolean;
}
interface IApiLoadState {
  isLoaded: boolean;
  isCalled: boolean;
}

interface IWarning {
  color: string;
  message: string;
}

interface IState {
  quizzesResults: IQuizResult[];
  questions: IQuestion[];
  userAnswers: string[];
  activeQuizResult: IQuizResult;
  categories: ICategory[];
  numberOfQuestions: number;
  activeQuestionNumber: number;
  isQuizEnded: boolean;
  activeComponent: string;
  apiLoadState: {
    [key: string]: IApiLoadState;
  };
  warnings: IWarning[];
}

interface ICategory {
  id: number;
  name: string;
}

interface IDifficulty {
  id: string;
  name: string;
}

interface ISelectedItem {
  id?: string | number;
  name?: string;
}

export type {
  ISelectedItem,
  IQuestion,
  IQuizResult,
  IApiLoadState,
  IWarning,
  IState,
  ICategory,
  IDifficulty,
};
