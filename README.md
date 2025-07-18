# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

import { reactive } from 'vue';
import { shuffleQuestionsData } from '../helpers';
import type { IState, IApiLoadState } from '../types';
import { ScreenComponents, ResponseCodes } from '../components/enums';

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
    activeComponent: ScreenComponents.Options,
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
      const url: string = `https://opentdb.com/api.php?amount=${store.state.numberOfQuestions}&category=${category}&difficulty=${difficulty}`;
      store.mutations.setApiLoadState('questions', 'isCalled', true);

      try {
        const response = await fetch(url);
        const responseJSON = await response.json();

        if (responseJSON.response_code == ResponseCodes.NoResult) {
          return store.mutations.setWarning('red-400', 'Questions not found!');
        }

        const results = responseJSON.results;
        if (results.length) {
          store.state.questions = shuffleQuestionsData(results);
        }
      } catch (e: any) {
        store.mutations.setWarning('red-400', 'An error occurred during loading questions!');
      } finally {
        store.mutations.setApiLoadState('questions', 'isLoaded', true);
      }
    },

    async fetchCategories() {
      const url = 'https://opentdb.com/api_category.php';
      store.mutations.setApiLoadState('categories', 'isCalled', true);

      try {
        const response = await fetch(url);
        const responseJSON = await response.json();

        if (responseJSON.response_code == ResponseCodes.NoResult) {
          return store.mutations.setWarning('red-400', 'Categories not found!');
        }

        const results = responseJSON.trivia_categories;
        if (results.length) {
          // store.state.categories = results;
          const translatedCategories = await Promise.all(
            results.map(async (category: any) => {
              // Appel à l'API LibreTranslate pour traduire le nom de la catégorie
              const translateRes = await fetch('http://localhost:3000/translate', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  q: category.name,
                  source: 'en',
                  target: 'fr',
                }),
              });

              const translatedData = await translateRes.json();
              return {
                id: category.id,
                name: translatedData.translatedText,
              };
            })
          );
          store.state.categories = translatedCategories;
        }
      } catch (e: any) {
        store.mutations.setWarning('red-400', 'An error occurred during loading categories!');
      } finally {
        store.mutations.setApiLoadState('categories', 'isLoaded', true);
      }
    },
  },
};

export default store;
