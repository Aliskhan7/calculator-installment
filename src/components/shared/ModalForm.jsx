import React, { useState } from "react";
import ReactModal from "react-modal";
import { NumericFormat } from "react-number-format";
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
        // console.log(`Изменено поле ${field}:`, value); // Логируем, что передается в стейт
        setFormData((prev) => ({
            ...prev,
            [field]: value, // ✅ Убираем `.toString()`, он не нужен!
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
        <ReactModal isOpen={isOpen} onRequestClose={onClose} className="modal" overlayClassName="overlay">
            <div className="modal-content">
                <h2>Введите данные</h2>

                <label>Ф.И.О:</label>
                <input type="text" value={formData.fullName} onChange={(e) => handleChange("fullName", e.target.value)} />

                <label>Возраст:</label>
                <NumericFormat
                    value={formData.age}
                    allowLeadingZeros={false}
                    decimalScale={0}
                    onValueChange={(values) => handleChange("age", values.value)}
                />

                <label>Телефон:</label>
                <NumericFormat
                    value={formData.phone}
                    format="+7 (###) ###-##-##"
                    mask="_"
                    allowEmptyFormatting
                    onValueChange={(values) => handleChange("phone", values.value)}
                />

                <label>Паспорт:</label>
                <div className="passport-inputs">
                    <NumericFormat
                        placeholder="№"
                        value={formData.passportNumber}
                        allowLeadingZeros
                        decimalScale={0}
                        onValueChange={(values) => handleChange("passportNumber", values.value)}
                    />
                    <NumericFormat
                        placeholder="Серия"
                        value={formData.passportSeries}
                        allowLeadingZeros
                        decimalScale={0}
                        onValueChange={(values) => handleChange("passportSeries", values.value)}
                    />
                </div>

                <label>Место проживания:</label>
                <input type="text" value={formData.address} onChange={(e) => handleChange("address", e.target.value)} />

                <div className="modal-buttons">
                    <button onClick={handleDownload}>Скачать DOCX</button>
                    <button onClick={onClose}>Закрыть</button>
                </div>
            </div>

            <style jsx>{`
                .overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .modal {
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    width: 400px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .passport-inputs {
                    display: flex;
                    gap: 10px;
                }
                .modal-buttons {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 10px;
                }
                input {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                }
            `}</style>
        </ReactModal>
    );
};

export default ModalForm;
