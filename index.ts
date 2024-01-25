import * as clack from '@clack/prompts';
import { setTimeout } from 'node:timers/promises';
import questions from './questionsTest.json';
import color from 'picocolors';
import { Formatter } from 'picocolors/types';


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
    code?: any;
}

async function questionDisplay(question: string, mutlipleAnswers: string[], correctAnswer: string, language: string, code?: string) : Promise<void> {
    const options: Option[] = [];

    mutlipleAnswers.forEach((answer: string) => {
        options.push({ value: answer, label: answer });
    });

    const languageColor: { [key: string]: Formatter } = {
        "C" : color.blue, 
        "Python" : color.green, 
        "Javascript" : color.yellow, 
        "Shell" : color.red,
        "Git" : color.magenta
    };
    
    question = `${question}  ${(languageColor[language] ? languageColor[language] : color.green)(`[${language}]`)}\n${code ? color.cyan(code) : ''}`;

    const answer: string | symbol = await clack.select({
        message: question,
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
    code: any;

    constructor(question: string, answersArray: string[], correctAnswer: string, language: string, code: string) {
        this.question = question;
        this.answersArray = answersArray;
        this.correctAnswer = correctAnswer;
        this.language = language;
        this.code = code;
    }
}

async function main() {
    console.clear();

    clack.intro(`${color.bold(color.cyan('Welcome to the Alx trivia!'))}\n\n${color.yellow(`You will be asked random Alx questions, Answer as much as you can, if answered is incorrect you start over!`)}\n\n${color.green('Good luck!')}`);

    await setTimeout(2000);

    const questionsArray: QuestionClass[] = [];

    questions.forEach((question: Question) => {
        questionsArray.push(new QuestionClass(question.question, question.answersArray, question.correctAnswer, question.language, question.code));
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

    while (true) {
        const randomQuestion: number = Math.floor(Math.random() * questionsArray.length);
        const question: QuestionClass = questionsArray[randomQuestion];
        await questionDisplay(question.question, question.answersArray, question.correctAnswer, question.language);
        questionsArray.splice(randomQuestion, 1);
        if (questionsArray.length === 0) {
            console.log(color.green('You answered all the questions correctly! 🤩'));
            process.exit(0);
        }
    }

}
main().catch(console.error);