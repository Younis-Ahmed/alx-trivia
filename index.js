#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clack = __importStar(require("@clack/prompts"));
const promises_1 = require("node:timers/promises");
const questions_json_1 = __importDefault(require("./questions.json"));
const picocolors_1 = __importDefault(require("picocolors"));
let totalQuestions = 0;
let correctAnswers = 0;
function questionDisplay(question, mutlipleAnswers, correctAnswerIdx) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = [];
        mutlipleAnswers.forEach((answer) => {
            options.push({ value: answer, label: answer });
        });
        const answer = yield clack.select({
            message: question,
            initialValue: '1',
            options: options,
        });
        const spinner = clack.spinner();
        spinner.start();
        yield (0, promises_1.setTimeout)(1000);
        spinner.stop();
        if (answer === mutlipleAnswers[correctAnswerIdx]) {
            console.log(picocolors_1.default.green('Correct!'));
            correctAnswers++;
        }
        else {
            console.log(picocolors_1.default.red('Incorrect!'));
        }
    });
}
class Question {
    constructor(question, answersArray, correctAnswerIndex) {
        this.question = question;
        this.answersArray = answersArray;
        this.correctAnswerIndex = correctAnswerIndex;
    }
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.clear();
        yield (0, promises_1.setTimeout)(1000);
        clack.intro(`${picocolors_1.default.bgBlack(picocolors_1.default.magenta('Welcome to the Alx trivia!'))}\n\n${picocolors_1.default.bgBlack(picocolors_1.default.yellow(`You will be asked random Alx questions, You need to answer ${totalQuestions} consecutive to Wins!`))}\n\n${picocolors_1.default.bgBlack(picocolors_1.default.green('Good luck!'))}`);
        yield (0, promises_1.setTimeout)(2000);
        const questionsArray = [];
        questions_json_1.default.forEach((question) => {
            questionsArray.push(new Question(question.question, question.answers, question.correct));
        });
        const readyToPlay = yield clack.select({
            message: "No cheating. Results at the end. Ready to play?",
            initialValue: "Yes",
            options: [
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" }
            ],
        });
        if (readyToPlay === 'No') {
            console.log(picocolors_1.default.bgBlack(picocolors_1.default.red('Bye!')));
            process.exit(0);
        }
        while (totalQuestions < 5) {
            const randomQuestion = Math.floor(Math.random() * questionsArray.length);
            const question = questionsArray[randomQuestion];
            yield questionDisplay(question.question, question.answersArray, question.correctAnswerIndex);
            totalQuestions++;
        }
    });
}
