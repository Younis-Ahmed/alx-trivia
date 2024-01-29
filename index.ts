import * as clack from '@clack/prompts';
import { setTimeout } from 'node:timers/promises';
import questions from './questions.json';
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
    code: string;
}


/**
 * Displays a question with multiple answers and prompts the user to select an answer.
 * 
 * @param question - The question to display.
 * @param mutlipleAnswers - An array of possible answers.
 * @param correctAnswer - The correct answer.
 * @param language - The programming language associated with the question.
 * @param code - Optional code snippet related to the question.
 * @returns A promise that resolves to void.
 */
export async function questionDisplay(question: string, mutlipleAnswers: string[], correctAnswer: string, language: string, code: string) : Promise<void> {
    const options: Option[] = []; // [{value: "1", label: "1"}, {value: "2", label: "2"}]

    // Loop through the answers and push them to the options array
    mutlipleAnswers.forEach((answer: string) => {
        options.push({ value: answer, label: answer });
    });

    // Create a dictionary to store the color of the language
    const languageColor: { [key: string]: Formatter } = {
        "C" : color.blue, 
        "Python" : color.green, 
        "Javascript" : color.yellow, 
        "Shell" : color.red,
        "Git" : color.magenta
    };
    
    // Add the language color to the question depending on the language
    question = `${question}  ${(languageColor[language] ?? color.green)(`[${language}]`)}\n${code ? color.cyan(code) : ''}`;
    const answer: string | symbol = await clack.select({
        message: question,
        initialValue: '1',
        options: options,
    });

    // Add a spinner to make it look like the program is thinking 😁
    const spinner = clack.spinner();
    spinner.start();
    await setTimeout(1500);
    spinner.stop();
    
    // Check if the answer is correct and console log the result, of every 10 correct answers console log a message
    if (answer === correctAnswer) {
        console.log(color.green('Correct!'));
        if (correctAnswers && correctAnswers % 10 === 0) {
            console.log(color.green(`${correctAnswers} hits streak, Keep going! 🤩`));
        }
        correctAnswers++;
    } else { // If the answer is incorrect console log the result and exit the program
        console.clear();
        console.log(color.bold(color.red('❌ Game over!\n')));
        console.log(color.bold(color.green(`You answered ${correctAnswers} questions correctly!\n\n`)));
        process.exit(0);
    }
}

/**
 * Class to store the questions and answers, Related to the questionDisplay function
 */
class QuestionClass {
    question: string;
    answersArray: string[];
    correctAnswer: string;
    language: string;
    code: string;

    constructor(question: string, answersArray: string[], correctAnswer: string, language: string, code: string) {
        this.question = question;
        this.answersArray = answersArray;
        this.correctAnswer = correctAnswer;
        this.language = language;
        this.code = code;
    }
}

/**
 * Main function to run the program
 */
export async function main() {
    console.clear(); // Clear the console

    clack.intro(
        `${color.bold(color.cyan('Welcome to the Alx trivia!'))}\n\n
        ${color.bold(color.yellow(`You will be asked random Alx questions, Answer as much as you can.\nif answered incorrectly you start over!`))}\n\n
        ${color.green('Good luck!')}`);

    await setTimeout(2000);

    const questionsArray: QuestionClass[] = [];

    questions.forEach((question: Question) => { // Loop through the questions and answers and push them to the questionsArray
        questionsArray.push(new QuestionClass(question.question, question.answersArray, question.correctAnswer, question.language, question.code));
    });

    const readyToPlay: string | symbol = await clack.select({ // Ask the user if they are ready to play
        message: `No cheating. Results at the end.\n\n${color.underline(color.yellow("[Ctrl + D] Exit [Ctrl + C] Exit + result)"))}\n\nReady to play?`,
        initialValue: "Yes",
        options: [
            {value: "Yes", label: "Yes"},
            {value: "No", label: "No"}],
    })

    if (readyToPlay === 'No') {
        console.log(color.red('Bye! ✌'));
        process.exit(0);
    }

    while (true) { // Loop through the questionsArray and display the questions and answers
        if (questionsArray.length === 0) {
            console.log(color.green('You answered all the questions correctly! 🤩'));
            process.exit(0);
        }
        const randomQuestion: number = Math.floor(Math.random() * questionsArray.length);
        const question: QuestionClass | undefined = questionsArray[randomQuestion];
        if (!question) {
            continue;
        }
        await questionDisplay(question.question, question.answersArray, question.correctAnswer, question.language, question.code);
        questionsArray.splice(randomQuestion, 1);
    }

}
main().catch(console.error);