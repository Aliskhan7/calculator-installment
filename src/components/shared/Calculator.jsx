import React, { useCallback, useEffect, useState } from 'react';
import {NumericFormat} from "react-number-format";
import {generateWordDoc, generateWordFromTemplate} from "../../utils/generateDocx";
import {formatNumber} from "../../utils/formatters";
import ModalForm from "./ModalForm";


const Calculator = () => {
    const [loanAmountStr, setLoanAmountStr] = useState("10000");
    const [loanTermStr, setLoanTermStr] = useState("3");
    const [downPaymentStr, setDownPaymentStr] = useState("0"); // Первый взнос
    const [totalWithInterest, setTotalWithInterest] = useState("0");
    const [monthlyPayment, setMonthlyPayment] = useState("0");
    const [bgColor, setBgColor] = useState("bg-gray-200/50");

    const [modalOpen, setModalOpen] = useState(false);


    const getTableRate = (loanTerm) => {
        switch (parseInt(loanTerm, 10)) {
            case 3: return 15;
            case 4: return 20;
            case 5: return 25;
            case 6: return 30;
            default: return 0;
        }
    };

    // Функция расчета
    const calculateMonthlyPayment = useCallback(() => {
        const loanAmount = Math.max(parseFloat(loanAmountStr) || 0, 0);
        let loanTerm = Math.max(parseInt(loanTermStr, 10) || 0, 0);
        const downPayment = Math.max(parseFloat(downPaymentStr) || 0, 0);

        let fullAmount = loanAmount;

        // ✅ Если loanTerm = 0, процент НЕ начисляется
        if (loanAmount > 0 && loanTerm > 0) {
            const tableRate = getTableRate(loanTerm);
            fullAmount += loanAmount * (tableRate / 100);
        }

        // ✅ Если loanAmount = 0, итоговая сумма должна оставаться 0
        if (loanAmount === 0 || loanTerm === 0) {
            fullAmount = 0;
        }

        // ✅ Если первый взнос больше всей суммы — итоговая сумма становится 0
        if (downPayment >= fullAmount) {
            fullAmount = 0;
        } else {
            fullAmount -= downPayment;
        }

        const paymentPerMonth = loanTerm > 0 ? fullAmount / loanTerm : 0;

        setTotalWithInterest(fullAmount.toFixed(2));
        setMonthlyPayment(paymentPerMonth.toFixed(2));
    }, [loanAmountStr, loanTermStr, downPaymentStr]);


    useEffect(() => {
        calculateMonthlyPayment();
        setBgColor(prev => prev === "bg-gray-200/50" ? "bg-green-300/50" : "bg-gray-200/50");
    }, [calculateMonthlyPayment]);

    // Функция для контроля ввода значений (запрещаем отрицательные числа)
    const handleLoanAmountChange = (e) => {
        const value = Math.max(parseFloat(e.target.value) || 0, 0);
        setLoanAmountStr(value.toString());
    };

    const handleLoanTermChange = (e) => {
        let value = e.target.value;

        // Если поле пустое, ставим 0
        if (value.trim() === "") {
            setLoanTermStr("0");
            return;
        }

        // Преобразуем строку в число
        let numValue = parseInt(value, 10);

        // Корректируем диапазон
        if (isNaN(numValue) || numValue < 3) numValue = 3;
        if (numValue > 6) numValue = 6;

        setLoanTermStr(numValue.toString());
    };

    const handleDownPaymentChange = (e) => {
        const value = Math.max(parseFloat(e.target.value) || 0, 0);
        setDownPaymentStr(value.toString());
    };

    return (
        <div className='p-5 lg:p-0 w-full lg:w-1/2 mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
            <h2 className='text-3xl text-center pt-5 font-bold'>Калькулятор рассрочки</h2>
            <form className="flex flex-col gap-4 mt-12">
                <div className="flex flex-col gap-2">
                    <label>Сумма рассрочки:</label>
                    <NumericFormat
                        value={loanAmountStr}
                        thousandSeparator=" "
                        allowLeadingZeros={false}
                        decimalScale={0} // Без дробной части
                        onValueChange={(values) => handleLoanAmountChange({ target: { value: values.value } })} // Передаёт чистое число без пробелов
                        className="border border-gray-200 px-2 py-2 rounded-md"
                        placeholder="Введите сумму"
                    />
                </div>

                <div className="flex flex-col gap-2 relative">
                    <label>Срок рассрочки (месяцев):</label>
                    <input
                        className="border border-gray-200 px-2 py-2 rounded-md"
                        type="number"
                        value={loanTermStr}
                        onChange={handleLoanTermChange}
                    />
                    <div className="absolute z-10 top-[41px] left-6 text-gray-500/50 pointer-events-none">= {getTableRate(loanTermStr)}%</div>
                </div>

                <div className="flex flex-col gap-2">
                    <label>Первый взнос:</label>
                    <input
                        className="border border-gray-200 px-2 py-2 rounded-md"
                        type="number"
                        value={downPaymentStr}
                        onChange={handleDownPaymentChange}
                    />
                </div>
            </form>

            {/* Блок с обновляемыми значениями и изменяющимся фоном */}
            <div className='flex flex-col gap-2 bg-gray-200/50 p-4 rounded-lg mt-5'>
                <h3>Сумма рассрочки (без процентов): <span
                    className={`${bgColor} transition delay-75`}>{formatNumber(loanAmountStr)}</span> руб.</h3>
                <h3>Первый взнос: <span
                    className={`${bgColor} transition delay-75`}>{formatNumber(downPaymentStr)}</span> руб.</h3>
                <h3>Полная сумма (с процентами): <span
                    className={`${bgColor} transition delay-75`}>{formatNumber(totalWithInterest)}</span> руб.</h3>
                <h3>Ежемесячный платеж: <span
                    className={`${bgColor} transition delay-75`}>{formatNumber(monthlyPayment)}</span> руб.</h3>
                {/*<button onClick={() => generateWordFromTemplate(loanAmountStr, downPaymentStr, totalWithInterest, monthlyPayment)}>*/}
                {/*    Скачать DOCX*/}
                {/*</button>*/}
                <button onClick={() => setModalOpen(true)}>Скачать DOCX</button>
                <ModalForm isOpen={modalOpen} loanAmountStr={loanAmountStr} downPaymentStr={downPaymentStr} totalWithInterest={totalWithInterest} monthlyPayment={monthlyPayment}  onClose={() => setModalOpen(false)}/>
            </div>
        </div>
    );
};

export default Calculator;
