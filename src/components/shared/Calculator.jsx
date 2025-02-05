import React, {useCallback, useEffect, useState} from 'react';

const Calculator = () => {
    const [loanAmountStr, setLoanAmountStr] = useState("10000");
    const [loanTermStr, setLoanTermStr] = useState("3");

    const [totalWithInterest, setTotalWithInterest] = useState("0");
    const [monthlyPayment, setMonthlyPayment] = useState("0");

    const [bgColor, setBgColor] = useState("bg-gray-200/50");


    // При расчёте переводим строки в числа. Пустая строка => 0
    const calculateMonthlyPayment = useCallback(() => {
        const loanAmount = parseFloat(loanAmountStr) || 0;
        const loanTerm = parseInt(loanTermStr, 10) || 0;

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
        const paymentPerMonth = loanTerm > 0 ? (fullAmount / loanTerm) : 0;

        setTotalWithInterest(fullAmount.toFixed(2));
        setMonthlyPayment(paymentPerMonth.toFixed(2));
    }, [loanAmountStr, loanTermStr]);

    const handleSubmit = (e) => {
        e.preventDefault();
        calculateMonthlyPayment();
        setBgColor((prev) =>
            prev === "bg-transparent" ? "bg-green-500/50" : "bg-transparent"
        );
    };

    useEffect(()=> {
        calculateMonthlyPayment();
        setBgColor((prev) =>
            prev === "bg-transparent" ? "bg-green-500/50" : "bg-transparent"
        );
    }, [calculateMonthlyPayment, loanAmountStr, loanTermStr]);


    // Функция для контроля ввода срока рассрочки
    const handleLoanTermChange = (e) => {
        let value = parseInt(e.target.value, 10);

        if (value < 3) value = 3;
        if (value > 6) value = 6;

        setLoanTermStr(value.toString());
    };

    return (
        <div className='p-5 lg:p-0 w-full lg:w-1/2 mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
            <h2 className='text-3xl text-center pt-5 font-bold'>Калькулятор рассрочки</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-12">
                <div className="flex flex-col gap-2">
                    <label>Сумма рассрочки:</label>
                    <input
                        className="border border-gray-200 px-2 py-2 rounded-md "
                        type="number"
                        value={loanAmountStr}
                        onChange={(e) => setLoanAmountStr(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label>Срок рассрочки (месяцев):</label>
                    <input
                        className="border border-gray-200 px-2 py-2 rounded-md "
                        type="number"
                        value={loanTermStr}
                        onChange={handleLoanTermChange}
                    />
                </div>

                <button className="w-fit mx-auto py-2 px-4 border border-green-500 rounded-md bg-green-500 text-white hover:bg-transparent hover:text-green-500 transition delay-75 " type="submit">
                    Рассчитать
                </button>
            </form>

            {/* Выводим все необходимые данные: */}
            <div className='flex flex-col gap-2 bg-gray-200/50 p-4 rounded-lg mt-5'>
                <h3>Сумма рассрочки (без процентов): <span className={`${bgColor} transition delay-75`}>{loanAmountStr} руб.</span> </h3>
                <h3>Полная сумма (с процентами): <span className={`${bgColor} transition delay-75`}>{totalWithInterest} руб.</span> </h3>
                <h3>Ежемесячный платеж: <span className={`${bgColor} transition delay-75`}>{monthlyPayment} руб.</span> </h3>
            </div>
        </div>
    );
};

export default Calculator;
