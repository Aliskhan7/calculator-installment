import React, { useState } from 'react';

const Calculator = () => {
    const [loanAmount, setLoanAmount] = useState(10000);   // Сумма рассрочки (без процентов)
    const [loanTerm, setLoanTerm] = useState(3);           // Срок рассрочки (в месяцах)
    const [monthlyPayment, setMonthlyPayment] = useState(0);
    const [totalWithInterest, setTotalWithInterest] = useState(0);

    // Расчёт «плоских» процентов по табличке:
    // 3 мес – 15%, 4 мес – 20%, 5 мес – 25%, 6 мес – 30%.
    const calculateMonthlyPayment = () => {
        let tableRate = null; // фиксированный процент по сроку

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

        // Полная сумма с учётом фиксированных процентов
        const fullAmount = loanAmount + loanAmount * (tableRate / 100);

        // Считаем ежемесячный платёж (полная сумма делится на срок)
        const paymentPerMonth = fullAmount / loanTerm;

        // Сохраняем результаты в стейты, округляем до двух знаков
        setTotalWithInterest(fullAmount.toFixed(2));
        setMonthlyPayment(paymentPerMonth.toFixed(2));
    };

    // Обработка отправки формы
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
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label>Срок рассрочки (месяцев):</label>
                    <input
                        className="border-2 border-gray-200 px-2 py-2 rounded-md "
                        type="number"
                        value={loanTerm}
                        onChange={(e) => setLoanTerm(e.target.value)}
                    />
                </div>

                <button className="w-fit mx-auto py-2 px-4 border-2 border-gray-200 rounded-md" type="submit">
                    Рассчитать
                </button>
            </form>

            {/* Выводим все необходимые данные: */}
            <div className='flex flex-col gap-2 bg-amber-300/50 p-3 rounded-lg mt-5'>
                <h3>Сумма рассрочки (без процентов): {loanAmount} руб.</h3>
                <h3>Полная сумма (с процентами): {totalWithInterest} руб.</h3>
                <h3>Ежемесячный платеж: {monthlyPayment} руб.</h3>
            </div>
        </div>
    );
};

export default Calculator;
