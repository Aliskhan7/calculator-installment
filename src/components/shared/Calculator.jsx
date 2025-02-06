import React, { useCallback, useEffect, useState } from 'react';

const Calculator = () => {
    const [loanAmountStr, setLoanAmountStr] = useState("10000");
    const [loanTermStr, setLoanTermStr] = useState("3");
    const [downPaymentStr, setDownPaymentStr] = useState("0"); // Первый взнос
    const [totalWithInterest, setTotalWithInterest] = useState("0");
    const [monthlyPayment, setMonthlyPayment] = useState("0");
    const [bgColor, setBgColor] = useState("bg-gray-200/50");


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
        const loanTerm = Math.max(parseInt(loanTermStr, 10) || 0, 3);
        const downPayment = Math.max(parseFloat(downPaymentStr) || 0, 0);

        const tableRate = getTableRate(loanTerm)


        // Итоговая сумма с процентами
        let fullAmount = loanAmount + loanAmount * (tableRate / 100);

        // Вычитаем первый взнос (но не больше, чем сумма рассрочки)
        if (downPayment > fullAmount) {
            fullAmount = 0;
        } else {
            fullAmount -= downPayment;
        }

        // Рассчитываем ежемесячный платеж
        const paymentPerMonth = loanTerm > 0 ? (fullAmount / loanTerm) : 0;

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
        let value = parseInt(e.target.value, 10);
        if (value < 3) value = 3;
        if (value > 6) value = 6;
        setLoanTermStr(value.toString());
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
                    <input
                        className="border border-gray-200 px-2 py-2 rounded-md"
                        type="number"
                        value={loanAmountStr}
                        onChange={handleLoanAmountChange}
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
                    className={`${bgColor} transition delay-75`}>{loanAmountStr}</span> руб.</h3>
                <h3>Первый взнос: <span
                    className={`${bgColor} transition delay-75`}>{downPaymentStr}</span> руб.</h3>
                <h3>Полная сумма (с процентами): <span
                    className={`${bgColor} transition delay-75`}>{totalWithInterest}</span> руб.</h3>
                <h3>Ежемесячный платеж: <span
                    className={`${bgColor} transition delay-75`}>{monthlyPayment}</span> руб.</h3>
            </div>
        </div>
    );
};

export default Calculator;
