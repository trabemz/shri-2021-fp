import {
	allPass,
	equals,
	prop,
	compose,
	filter,
	converge,
	anyPass,
	lte,
	not,
} from 'ramda';

/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */
const getStar = prop('star');
const getSquare = prop('square');
const getCircle = prop('circle');
const getTriangle = prop('triangle');
const getLength = prop('length');

const isWhite = equals('white');
const isRed = equals('red');
const isGreen = equals('green');
const isBlue = equals('blue');
const isOrange = equals('orange');

const count = compose(getLength, Object.values);

const countGreen = compose(count, filter(isGreen));
const countRed = compose(count, filter(isRed));
const countBlue = compose(count, filter(isBlue));
const countOrange = compose(count, filter(isOrange));

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
	compose(isWhite, getTriangle),
	compose(isWhite, getCircle),
	compose(isRed, getStar),
	compose(isGreen, getSquare),
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = compose(lte(2), countGreen);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = converge(equals, [countRed, countBlue]);

// 4. Синий круг, красная звезда, оранжевый квадрат
export const validateFieldN4 = allPass([
	compose(isBlue, getCircle),
	compose(isRed, getStar),
	compose(isOrange, getSquare),
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = anyPass([
	compose(lte(3), countRed),
	compose(lte(3), countBlue),
	compose(lte(3), countGreen),
	compose(lte(3), countOrange),
]);

// 6. Две зеленые фигуры (одна из них треугольник), еще одна любая красная.
export const validateFieldN6 = allPass([
	compose(equals(2), countGreen),
	compose(equals(1), countRed),
	compose(isGreen, getTriangle),
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = converge(equals, [count, countOrange]);

// 8. Не красная и не белая звезда.
export const validateFieldN8 = allPass([
	compose(not, isRed, getStar),
	compose(not, isWhite, getStar),
]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = converge(equals, [count, countGreen]);

// 10. Треугольник и квадрат одного цвета (не белого)
export const validateFieldN10 = allPass([
	converge(equals, [getTriangle, getSquare]),
	compose(not, isWhite, getTriangle),
	compose(not, isWhite, getSquare),
]);
