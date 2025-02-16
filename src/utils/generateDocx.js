import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import {formatNumber} from "./formatters";
import templateDocx from "../static/documents/template.docx"

// Функция загрузки шаблона и подстановки данных
export const generateWordFromTemplate = async (fullName,
                                               age,
                                               phone,
                                               passportNumber,
                                               passportSeries,
                                               address, loanTermStr, loanAmount, downPayment, totalWithInterest, monthlyPayment, ) => {
    try {
        // 1️⃣ Загружаем шаблон Word (из папки public/static)
        const response = await fetch(templateDocx);
        const templateArrayBuffer = await response.arrayBuffer();

        // 2️⃣ Загружаем файл DOCX в виде ZIP-архива
        const zip = new PizZip(templateArrayBuffer);
        const doc = new Docxtemplater(zip);

        // 3️⃣ Подставляем реальные значения в плейсхолдеры
        doc.setData({
            fullName,
            age,
            phone,
            passportNumber,
            passportSeries,
            address,
            loanTermStr: formatNumber(loanTermStr),
            loanAmount: formatNumber(loanAmount),
            downPayment: formatNumber(downPayment),
            totalWithInterest: formatNumber(totalWithInterest),
            monthlyPayment: formatNumber(monthlyPayment),
        });

        // 4️⃣ Генерируем документ с новыми данными
        doc.render();

        // 5️⃣ Создаем Blob и скачиваем обновленный DOCX
        const updatedDoc = doc.getZip().generate({ type: "blob" });
        saveAs(updatedDoc, "calculator-result.docx");
    } catch (error) {
        console.error("Ошибка при создании документа:", error);
    }
};
