import { reactive } from 'vue';
import { shuffleQuestionsData } from '../helpers';
import type { IState, IApiLoadState } from '../types';
import { ScreenComponents } from '../enums';

const localStorageName: string = 'quizzesResults';

const store = {
  state: reactive<IState>({
    quizzesResults: JSON.parse(localStorage.getItem(localStorageName) || '[]'),
    questions: [],
    userAnswers: [],
    activeQuizResult: {
      correctAnswersNumber: 0,
      totalQuestionsNumber: 0,
      currentQuizSuccessRate: 0,
      allQuizzesSuccessRate: 0,
      hasAllQuizzesSuccessRate: false,
    },
    categories: [],
    numberOfQuestions: 10,
    activeQuestionNumber: 0,
    isQuizEnded: false,
    activeComponent: ScreenComponents.Welcom,
    apiLoadState: {
      categories: {
        isLoaded: false,
        isCalled: false,
      },
      questions: {
        isLoaded: false,
        isCalled: false,
      },
    },
    warnings: [],
  }),
  getters: {
    getCategories() {
      return store.state.categories;
    },
    getApiLoadState() {
      return store.state.apiLoadState;
    },
    getQuestions() {
      return store.state.questions;
    },
    getUserAnswers(questionNumber: number) {
      return store.state.userAnswers[questionNumber];
    },
    getActiveQuestion() {
      return store.state.questions[store.state.activeQuestionNumber];
    },
    getActiveQuestionNumber() {
      return store.state.activeQuestionNumber;
    },
    getNumberOfQuestions() {
      return store.state.numberOfQuestions;
    },
    getActiveComponent() {
      return store.state.activeComponent;
    },
    getActiveQuestionAnswer() {
      return store.state.userAnswers[store.state.activeQuestionNumber];
    },
    getIsQuizEnded() {
      return store.state.isQuizEnded;
    },
    getActiveQuizResult() {
      return store.state.activeQuizResult;
    },
    getWarnings() {
      return store.state.warnings;
    },
  },
  mutations: {
    setQuestionNumber(number: number) {
      store.state.activeQuestionNumber = number;
    },
    setAnswer(answer: string) {
      store.state.userAnswers[store.state.activeQuestionNumber] = answer;
    },
    setActiveComponent(componentName: string) {
      store.state.activeComponent = componentName;
    },
    setApiLoadState(apiName: string, statusType: string, status: boolean) {
      store.state.apiLoadState[apiName][statusType as keyof IApiLoadState] = status;
    },
    handleNext() {
      if (store.state.activeQuestionNumber == store.state.questions.length - 1) {
        store.mutations.finishQuiz();
      } else {
        store.mutations.setQuestionNumber(store.state.activeQuestionNumber + 1);
      }
    },
    finishQuiz() {
      const correctAnswersNumber = store.state.questions.filter((question, index) => {
        return question.correct_answer == store.getters.getUserAnswers(index);
      }).length;
      const totalQuestionsNumber = store.state.questions.length;
      const currentQuizSuccessRate = Math.round(
        (correctAnswersNumber / totalQuestionsNumber) * 100
      );

      let allQuizzesSuccessRate: number = 0;
      let hasAllQuizzesSuccessRate: boolean = false;

      if (store.state.quizzesResults.length) {
        hasAllQuizzesSuccessRate = true;
        const worseRates = store.state.quizzesResults
          .map((quiz) => quiz.currentQuizSuccessRate)
          .filter((rate) => rate < currentQuizSuccessRate).length;
        const allRates = store.state.quizzesResults.length;
        allQuizzesSuccessRate = Math.round((worseRates / allRates) * 100);
      }

      store.state.activeQuizResult = {
        correctAnswersNumber,
        totalQuestionsNumber,
        currentQuizSuccessRate,
        allQuizzesSuccessRate,
        hasAllQuizzesSuccessRate,
      };
      store.state.quizzesResults.push(store.state.activeQuizResult);
      localStorage.setItem(localStorageName, JSON.stringify(store.state.quizzesResults));
      store.state.isQuizEnded = true;
      store.state.activeComponent = ScreenComponents.Report;
    },
    newQuiz() {
      store.mutations.setActiveComponent(ScreenComponents.Options);
      store.mutations.setQuestionNumber(0);
      store.mutations.setApiLoadState('questions', 'isCalled', false);
      store.mutations.setApiLoadState('questions', 'isLoaded', false);
      store.state.userAnswers = [];
      store.state.questions = [];
      store.state.activeQuizResult = {
        correctAnswersNumber: 0,
        totalQuestionsNumber: 0,
        currentQuizSuccessRate: 0,
        allQuizzesSuccessRate: 0,
        hasAllQuizzesSuccessRate: false,
      };
      store.state.isQuizEnded = false;
    },
    setWarning(color: string, message: string) {
      store.state.warnings.push({
        color,
        message,
      });
    },
  },
  actions: {
    async fetchQuestions(category: number, difficulty: string) {
      store.mutations.setApiLoadState('questions', 'isCalled', true);
      try {
        const response = await fetch('/data/questions.json');
        const data = await response.json();

        // Filtrer les questions selon la catégorie et la difficulté
        const filtered = data.filter((q: any) => {
          return q.categoryId == category && q.difficulty == difficulty;
        });

        if (!filtered.length) {
          return store.mutations.setWarning(
            'red-400',
            'Aucune question trouvée pour cette sélection.'
          );
        }

        store.state.questions = shuffleQuestionsData(
          filtered.slice(0, store.state.numberOfQuestions)
        );
      } catch (e: any) {
        store.mutations.setWarning('red-400', 'Erreur lors du chargement des questions !');
      } finally {
        store.mutations.setApiLoadState('questions', 'isLoaded', true);
      }
    },
    async fetchCategories() {
      store.mutations.setApiLoadState('categories', 'isCalled', true);
      try {
        const response = await fetch('/data/categories.json');
        const data = await response.json();
        store.state.categories = data;
      } catch (e: any) {
        store.mutations.setWarning('red-400', 'Erreur lors du chargement des catégories !');
      } finally {
        store.mutations.setApiLoadState('categories', 'isLoaded', true);
      }
    },
  },
};

export default store;
