import React, { useState, useEffect } from 'react';
import { Card, CardBody, Container, Table } from 'reactstrap';

const ListDisplay = () => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        fetchIncomeData();
        fetchExpenseData();
    }, []);

    const fetchIncomeData = async () => {
        try {
            const response = await fetch('http://localhost:8000/account/viewIncome');
            const data = await response.json();
            setIncomes(data);
        } catch (error) {
            console.error('Error fetching income data:', error);
        }
    };

    const fetchExpenseData = async () => {
        try {
            const response = await fetch('http://localhost:8000/account/viewExpense');
            const data = await response.json();
            setExpenses(data);
        } catch (error) {
            console.error('Error fetching expense data:', error);
        }
    };

    const calculateTotal = (data) => {
        return data.reduce((total, item) => total + parseFloat(item.amount), 0).toFixed(2);
    };

    return (
        <Container>
            <Card className="overflow-hidden mt-5">
                <CardBody className="pt-0">
                    <div className="p-4 mb-5" >
                        <div className="text-center">
                            <h3>Income</h3>
                        </div>
                        <Table >
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {incomes.map((income) => (
                                    <tr key={income.id}>
                                        <td>{income.title}</td>
                                        <td>{income.description}</td>
                                        <td>{income.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <p>Total Income: {calculateTotal(incomes)}</p>
                    </div>
                    <div className="p-2">
                        <div className="text-center">
                            <h3>Expense</h3>
                        </div>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.map((expense) => (
                                    <tr key={expense.id}>
                                        <td>{expense.title}</td>
                                        <td>{expense.description}</td>
                                        <td>{expense.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <p>Total Expense: {calculateTotal(expenses)}</p>
                    </div>
                </CardBody>
            </Card>
        </Container>
    );
};

export default ListDisplay;
