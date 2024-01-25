import * as clack from '@clack/prompts';
import { setTimeout } from 'node:timers/promises';
import questions from './questions.json';
import color from 'picocolors';

let totalQuestions: number = 5;
let correctAnswers: number = 0;

interface Option {
    value: string;
    label: string;
}

interface Question {
    question: string;
    answersArray: string[];
    correctAnswer: string;
    language: string;
}

async function questionDisplay(question: string, mutlipleAnswers: string[], correctAnswer: string, language: string) : Promise<void> {
    const options: Option[] = [];

    mutlipleAnswers.forEach((answer: string) => {
        options.push({ value: answer, label: answer });
    });
    
    const answer: string | symbol = await clack.select({
        message: question + "\t\t" + color.green(`[${language}]`),
        initialValue: '1',
        options: options,
    });

    const spinner = clack.spinner();
    spinner.start();
    await setTimeout(1500);
    spinner.stop();
    
    if (answer === correctAnswer) {
        console.log(color.green('Correct!'));
        if (correctAnswers && correctAnswers % 10 === 0) {
            console.log(color.green(`${correctAnswers} hits streak, Keep going! 🤩`));
        }
        correctAnswers++;
    } else {
        console.log(color.red('Incorrect!, Game over!'));
        console.log(color.green(`You answered ${correctAnswers} questions correctly!`));
        process.exit(0);
    }
}

class QuestionClass {
    question: string;
    answersArray: string[];
    correctAnswer: string;
    language: string;

    constructor(question: string, answersArray: string[], correctAnswer: string, language: string) {
        this.question = question;
        this.answersArray = answersArray;
        this.correctAnswer = correctAnswer;
        this.language = language;
    }
}

async function main() {
    console.clear();

    clack.intro(`${color.bold(color.cyan('Welcome to the Alx trivia!'))}\n\n${color.yellow(`You will be asked random Alx questions, You need to answer ${totalQuestions} consecutive to Wins!`)}\n\n${color.green('Good luck!')}`);

    await setTimeout(2000);

    const questionsArray: QuestionClass[] = [];

    questions.forEach((question: Question) => {
        questionsArray.push(new QuestionClass(question.question, question.answersArray, question.correctAnswer, question.language));
    });

    const readyToPlay: string | symbol = await clack.select({
        message: "No cheating. Results at the end. Ready to play?",
        initialValue: "Yes",
        options: [
            {value: "Yes", label: "Yes"},
            {value: "No", label: "No"}],
    })

    if (readyToPlay === 'No') {
        console.log(color.red('Bye! ✌'));
        process.exit(0);
    }

    while (totalQuestions) {
        const randomQuestion: number = Math.floor(Math.random() * questionsArray.length);
        const question: QuestionClass = questionsArray[randomQuestion];
        await questionDisplay(question.question, question.answersArray, question.correctAnswer, question.language);
        questionsArray.splice(randomQuestion, 1);
        totalQuestions--;
    }

}
main().catch(console.error);