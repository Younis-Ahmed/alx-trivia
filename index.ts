#!/usr/bin/env node

import * as clack from '@clack/prompts';
import { setTimeout } from 'node:timers/promises';
import color from 'picocolors';

let totalQuestions = 0;
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

    


}