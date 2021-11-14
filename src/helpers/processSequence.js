/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */

import Api from '../tools/api';
import {
	allPass,
	compose,
	prop,
	tap,
	curry,
	match,
	when,
	not,
	tryCatch,
	andThen,
	partialRight,
	otherwise,
} from 'ramda';

const api = new Api();

const getLength = prop('length');
const getMessage = prop('message');
const getResult = prop('result');

const getAnimal = (value) => api.get(`https://animals.tech/${value}`, {});
const convertToBinary = (value) =>
	api.get('https://api.tech/numbers/base', { from: 10, to: 2, number: value });

const more = curry((first, second) => second > first);
const less = curry((first, second) => second < first);
const isFloat = allPass([
	compose(more(2), getLength),
	compose(less(10), getLength),
	match(/^[0-9]+\.?[0-9]*/g),
]);

const throwValidationError = () => {
	throw new Error('ValidationError');
};
const validateValue = when(compose(not, isFloat), throwValidationError);

const pow = partialRight(Math.pow, [2]);
const divideByThreeRemainder = (x) => x % 3;

const parseValueToInt = compose(Math.round, parseFloat);

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
	const hangdleErrorMessage = compose(handleError, getMessage);

	const processBinaryValue = compose(
		tap(writeLog),
		divideByThreeRemainder,
		tap(writeLog),
		pow,
		tap(writeLog),
		getResult
	);

	const handleResultSuccess = compose(handleSuccess, getResult);

	const processValue = compose(
		otherwise(handleError),
		andThen(handleResultSuccess),
		andThen(getAnimal),
		andThen(processBinaryValue),
		convertToBinary,
		tap(writeLog),
		parseValueToInt,
		tap(validateValue),
		tap(writeLog)
	);

	const processSafe = tryCatch(processValue, hangdleErrorMessage);
	processSafe(value);
};

export default processSequence;
