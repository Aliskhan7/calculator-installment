import React, { useState } from "react";
import ReactModal from "react-modal";
import {PatternFormat} from "react-number-format";
import { generateWordFromTemplate } from "../../utils/generateDocx";

ReactModal.setAppElement("#root");

const ModalForm = ({ isOpen, onClose, loanAmountStr, downPaymentStr, totalWithInterest, monthlyPayment, loanTermStr }) => {
    const [formData, setFormData] = useState({
        fullName: "",
        age: "",
        phone: "",
        passportNumber: "",
        passportSeries: "",
        address: "",
    });

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleDownload = () => {
        generateWordFromTemplate(
            formData.fullName,
            formData.age,
            formData.phone,
            formData.passportNumber,
            formData.passportSeries,
            formData.address,
            loanTermStr,
            loanAmountStr,
            downPaymentStr,
            totalWithInterest,
            monthlyPayment
        );
        setFormData({
            fullName: "",
            age: "",
            phone: "",
            passportNumber: "",
            passportSeries: "",
            address: "",
        });
        onClose();
    };

    return (
        <ReactModal isOpen={isOpen} onRequestClose={onClose} className="modal" overlayClassName="fixed top-0 left-0 w-screen h-screen bg-black/50 flex items-center justify-center">
            <div className="relative bg-white p-12 rounded-lg w-[500px] flex flex-col gap-5">
                <div className='absolute top-4 right-6 flex justify-between items-center'>
                    <button className='ml-auto' onClick={onClose}>X</button>
                </div>
                <div className=' mx-auto text-2xl mt-10 mb-5 font-medium'>
                    Введите данные <span className='text-green-600'> клиента</span>
                </div>

                <div className='flex flex-col gap-2'>
                    <label>Ф.И.О:</label>
                    <input
                        required
                        className="border border-gray-200 px-2 py-2 rounded-md"
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => {
                            const onlyLetters = e.target.value.replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, ""); // Разрешены буквы и пробелы
                            handleChange("fullName", onlyLetters);
                        }}
                        placeholder="Введите Ф.И.О."
                    />
                </div>

                <div className='flex flex-col gap-2'>
                    <label>Возраст:</label>
                    <PatternFormat
                        className="border border-gray-200 px-2 py-2 rounded-md"
                        value={formData.age}
                        format="##"
                        allowLeadingZeros={false}
                        decimalScale={0}
                        onValueChange={(values) => handleChange("age", values.value)}
                        placeholder="Введите возраст"
                    />
                </div>
                <div className='flex flex-col gap-2'>
                    <label>Телефон:</label>
                    <PatternFormat
                        className="border border-gray-200 px-2 py-2 rounded-md"
                        value={formData.phone}
                        format="+7 (###) ###-##-##"
                        mask="_"
                        allowEmptyFormatting
                        onValueChange={(values) => handleChange("phone", values.value)}
                    />
                </div>
                <div className='flex flex-col gap-2'>
                    <label>Паспорт:</label>
                    <div className="flex w-full gap-2.5">
                        <PatternFormat
                            className="border border-gray-200 px-2 py-2 rounded-md"
                            placeholder="№"
                            format="######"
                            value={formData.passportNumber}
                            allowLeadingZeros
                            decimalScale={0}
                            onValueChange={(values) => handleChange("passportNumber", values.value)}
                        />
                        <PatternFormat
                            className="border border-gray-200 px-2 py-2 rounded-md"
                            placeholder="Серия"
                            format="## ##"
                            mask=" "
                            value={formData.passportSeries}
                            allowLeadingZeros
                            decimalScale={0}
                            onValueChange={(values) => handleChange("passportSeries", values.value)}
                        />
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <label>Место проживания:</label>
                    <input placeholder="Введите место проживания" className="border border-gray-200 px-2 py-2 rounded-md" type="text" value={formData.address}
                           onChange={(e) => handleChange("address", e.target.value)}/>
                </div>
                    <div className="flex">
                        <button className='border border-green-600 bg-green-600 w-fit mt-8 mx-auto text-white hover:bg-transparent hover:text-green-600 duration-75 px-4 py-2 rounded-xl' onClick={handleDownload}>Скачать DOCX</button>
                    </div>
                </div>
        </ReactModal>
);
};

export default ModalForm;
