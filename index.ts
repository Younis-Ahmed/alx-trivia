import * as clack from '@clack/prompts';
import { setTimeout } from 'node:timers/promises';
import questions from './questions.json';
import color from 'picocolors';

let totalQuestions = 5;
let correctAnswers = 0;

async function questionDisplay(question: string, mutlipleAnswers: string[], correctAnswerIdx: number) : Promise<void> {
    const options: { value: string, label: string }[] = [];

    mutlipleAnswers.forEach((answer) => {
        options.push({ value: answer, label: answer });
    });
    
    const answer = await clack.select({
        message: question,
        initialValue: '1',
        options: options,
    });

    const spinner = clack.spinner();
    spinner.start();
    await setTimeout(1000);
    spinner.stop();
    
    if (answer === mutlipleAnswers[correctAnswerIdx]) {
        console.log(color.green('Correct!'));
        correctAnswers++;
    } else {
        console.log(color.red('Incorrect!'));
    }
}

class Question {
    question: string;
    answersArray: string[];
    correctAnswerIndex: number;

    constructor(question: string, answersArray: string[], correctAnswerIndex: number) {
        this.question = question;
        this.answersArray = answersArray;
        this.correctAnswerIndex = correctAnswerIndex;
    }
}

async function main() {
    console.clear();

    await setTimeout(1000);

    clack.intro(`${color.bgBlack(color.magenta('Welcome to the Alx trivia!'))}\n\n${color.bgBlack(color.yellow(`You will be asked random Alx questions, You need to answer ${totalQuestions} consecutive to Wins!`))}\n\n${color.bgBlack(color.green('Good luck!'))}`);

    await setTimeout(2000);

    const questionsArray: Question[] = [];

    questions.forEach((question) => {
        questionsArray.push(new Question(question.question, question.answers, question.correct));
    });

    const readyToPlay = await clack.select({
		message: "No cheating. Results at the end. Ready to play?",
		initialValue: "Yes",
		options: [
			{value: "Yes", label: "Yes"},
			{value: "No", label: "No"}],
	})

    if (readyToPlay === 'No') {
        console.log(color.bgBlack(color.red('Bye!')));
        process.exit(0);
    }



    while (totalQuestions) {
        const randomQuestion = Math.floor(Math.random() * questionsArray.length);
        const question = questionsArray[randomQuestion];
        await questionDisplay(question.question, question.answersArray, question.correctAnswerIndex);
        totalQuestions--;
    }

}
main().catch(console.error);