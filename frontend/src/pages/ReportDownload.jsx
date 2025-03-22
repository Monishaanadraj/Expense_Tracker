import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import style from "../styles/ReportDownload.module.css";

const ReportDownload = () => {
    const [user, setUser] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [selectedRange, setSelectedRange] = useState(""); // Default empty selection
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    useEffect(() => {
        if (user && selectedRange) {
            fetchExpenses(user.id, selectedRange, startDate, endDate);
        }
    }, [user, selectedRange, startDate, endDate]);

    const fetchExpenses = async (userId, range, start, end) => {
        try {
            console.log(`Fetching ${range} expenses for userId:`, userId);
            const response = await axios.get(`http://localhost:5000/expenses?userId=${userId}`);
            const allExpenses = response.data;
            const currentDate = new Date();

            let filteredExpenses = allExpenses.filter((expense) => {
                const expenseDate = new Date(expense.date);

                if (range === "monthly") {
                    return (
                        expenseDate.getFullYear() === currentDate.getFullYear() &&
                        expenseDate.getMonth() === currentDate.getMonth()
                    );
                } else if (range === "quarterly") {
                    const currentQuarter = Math.floor(currentDate.getMonth() / 3);
                    const expenseQuarter = Math.floor(expenseDate.getMonth() / 3);
                    return (
                        expenseDate.getFullYear() === currentDate.getFullYear() &&
                        expenseQuarter === currentQuarter
                    );
                } else if (range === "yearly") {
                    return expenseDate.getFullYear() === currentDate.getFullYear();
                } else if (range === "custom" && start && end) {
                    return expenseDate >= new Date(start) && expenseDate <= new Date(end);
                } else if (range === "all") {
                    return true; // Fetch all expenses
                }

                return false; // If no range is selected
            });

            console.log("Filtered Expenses:", filteredExpenses);
            setExpenses(filteredExpenses);
        } catch (error) {
            console.error("Error fetching expenses:", error);
        }
    };

    const handleRangeChange = (event) => {
        setSelectedRange(event.target.value);
        setStartDate("");
        setEndDate("");
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB"); // DD/MM/YYYY
    };

    const generatePDF = () => {
        if (!user) {
            alert("You must be logged in to download reports.");
            return;
        }

        if (expenses.length === 0) {
            alert("No data available for export.");
            return;
        }

        const doc = new jsPDF();
        doc.text(`Expense Report (${selectedRange})`, 20, 10);

        autoTable(doc, {
            head: [["Title", "Category", "Amount", "Date"]],
            body: expenses.map((item) => [
                item.title,
                item.category,
                `₹${item.amount}`,
                formatDate(item.date),
            ]),
        });

        doc.save(`Expense_Report_${selectedRange}.pdf`);
    };

    const generateExcel = () => {
        if (!user) {
            alert("You must be logged in to download reports.");
            return;
        }

        if (expenses.length === 0) {
            alert("No data available for export.");
            return;
        }

        const formattedData = expenses.map((item) => ({
            Title: item.title,
            Category: item.category,
            Amount: `₹${item.amount}`,
            Date: formatDate(item.date),
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

        XLSX.writeFile(workbook, `Expense_Report_${selectedRange}.xlsx`);
    };

    return (
        <div className={style.dashboard_container}>
            <h2>Generate Report</h2>

            {!user && <p className={style.warning}>⚠️ You must be logged in to download reports.</p>}

            <div className={style.top_section}>
                <label>Select Time Period:</label>
                <select className={style.dropdown} onChange={handleRangeChange} value={selectedRange} disabled={!user}>
                    <option value="" disabled>Select Option</option>
                    <option value="all">All Dates</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                    <option value="custom">Custom Range</option>
                </select>
            </div>

            {selectedRange === "custom" && (
                <div className={style.date_picker}>
                    <label>Start Date:</label>
                    <input type="date" className={style.date_input} value={startDate} onChange={(e) => setStartDate(e.target.value)} disabled={!user} />
                    <label>End Date:</label>
                    <input type="date" className={style.date_input} value={endDate} onChange={(e) => setEndDate(e.target.value)} disabled={!user} />
                </div>
            )}

            <div className={style.dwnld_btn}>
                <button className={style.download_btn} disabled={!user || !selectedRange} onClick={generatePDF}>
                    Download PDF
                </button>
                <button className={style.download_btn} disabled={!user || !selectedRange} onClick={generateExcel}>
                    Download Excel
                </button>
            </div>
        </div>
    );
};

export default ReportDownload;
