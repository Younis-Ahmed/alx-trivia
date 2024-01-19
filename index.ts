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