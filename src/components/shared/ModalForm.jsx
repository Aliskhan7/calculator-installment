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
            <div className="bg-white p-5 rounded-lg w-fit flex flex-col gap-2">
                <h2>Введите данные</h2>

                <label>Ф.И.О:</label>
                <input
                    className="border border-gray-200 px-2 py-2 rounded-md"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => {
                        const onlyLetters = e.target.value.replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, ""); // Разрешены буквы и пробелы
                        handleChange("fullName", onlyLetters);
                    }}
                    placeholder="Введите Ф.И.О."
                />

                <label>Возраст:</label>
                <PatternFormat
                    className="border border-gray-200 px-2 py-2 rounded-md"
                    value={formData.age}
                    format="##"
                    allowLeadingZeros={false}
                    decimalScale={0}
                    onValueChange={(values) => handleChange("age", values.value)}
                />

                <label>Телефон:</label>
                <PatternFormat
                    className="border border-gray-200 px-2 py-2 rounded-md"
                    value={formData.phone}
                    format="+7 (###) ###-##-##"
                    mask="_"
                    allowEmptyFormatting
                    onValueChange={(values) => handleChange("phone", values.value)}
                />

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

                <label>Место проживания:</label>
                <input className="border border-gray-200 px-2 py-2 rounded-md" type="text" value={formData.address} onChange={(e) => handleChange("address", e.target.value)}/>

                <div className="flex justify-between mt-2.5">
                    <button onClick={handleDownload}>Скачать DOCX</button>
                    <button onClick={onClose}>Закрыть</button>
                </div>
            </div>
        </ReactModal>
    );
};

export default ModalForm;
