import React, { useState } from 'react';

const Calculator = () => {
    const [loanAmountStr, setLoanAmountStr] = useState("10000");
    const [loanTermStr, setLoanTermStr] = useState("5");

    const [totalWithInterest, setTotalWithInterest] = useState("");
    const [monthlyPayment, setMonthlyPayment] = useState("");

    // При расчёте переводим строки в числа. Пустая строка => 0
    const calculateMonthlyPayment = () => {
        const loanAmount = parseFloat(loanAmountStr) || 0;
        const loanTerm = parseInt(loanTermStr, 10) || 0;// фиксированный процент по сроку
        let tableRate = 0;
        switch (loanTerm) {
            case 3:
                tableRate = 15;
                break;
            case 4:
                tableRate = 20;
                break;
            case 5:
                tableRate = 25;
                break;
            case 6:
                tableRate = 30;
                break;
            default:
                tableRate = 0;
        }

        const fullAmount = loanAmount + loanAmount * (tableRate / 100);
        // Если срок 0 или его нет, чтобы избежать деления на 0, проверяем это
        const paymentPerMonth = loanTerm > 0 ? (fullAmount / loanTerm) : 0;

        setTotalWithInterest(fullAmount.toFixed(2));
        setMonthlyPayment(paymentPerMonth.toFixed(2));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        calculateMonthlyPayment();
    };

    return (
        <div className='w-1/2 mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
            <h2 className='text-4xl text-center pt-5 font-bold'>Калькулятор рассрочки:</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-12">
                <div className="flex flex-col gap-2">
                    <label>Сумма рассрочки:</label>
                    <input
                        className="border-2 border-gray-200 px-2 py-2 rounded-md "
                        type="number"
                        value={loanAmountStr}
                        onChange={(e) => setLoanAmountStr(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label>Срок рассрочки (месяцев):</label>
                    <input
                        className="border-2 border-gray-200 px-2 py-2 rounded-md "
                        type="number"
                        value={loanTermStr}
                        onChange={(e) => setLoanTermStr(e.target.value)}
                    />
                </div>

                <button className="w-fit mx-auto py-2 px-4 border-2 border-gray-200 rounded-md" type="submit">
                    Рассчитать
                </button>
            </form>

            {/* Выводим все необходимые данные: */}
            <div className='flex flex-col gap-2 bg-amber-300/50 p-3 rounded-lg mt-5'>
                <h3>Сумма рассрочки (без процентов): {loanAmountStr} руб.</h3>
                <h3>Полная сумма (с процентами): {totalWithInterest} руб.</h3>
                <h3>Ежемесячный платеж: {monthlyPayment} руб.</h3>
            </div>
        </div>
    );
};

export default Calculator;
