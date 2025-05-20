
import { Button, StyleSheet, Text, TextInput, View, FlatList, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '@/constants/Colors';
import RoundBtn from '@/component/RoundBtn';
import Modal from 'react-native-modal';
import Decimal from 'decimal.js';
import { useAuth } from '@/context/ AuthContext'
import { useRouter } from 'expo-router';
import Dropdown from '@/component/Dropdown';

interface Transaction {
    type: string;
    amount: string;
    createdAt: string;
}

const Home = () => {
    const router = useRouter();
    const { token, balance, setBalance } = useAuth();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [amount, setAmount] = useState('');
    const [modalType, setModalType] = useState('add');
    const [errorMessage, setErrorMessage] = useState('');
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        if (token) {
            getWalletBalance();
            loadTransactionHistory();
        }
    }, [token]);

    const loadTransactionHistory = async () => {
        try {
            const response = await fetch('http://localhost:8080/wallet/transactions', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (response.ok) {
                setTransactions(data);
            } else {
                setErrorMessage('Failed to load transaction history');
            }
        } catch (error) {
            setErrorMessage('Error loading transaction history');
        }
    };

    const getWalletBalance = async () => {
        try {
            const response = await fetch('http://localhost:8080/wallet', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setBalance(data.balance);
        } catch (error) {
            setErrorMessage('Failed to fetch wallet balance');
        }
    };

    const onAddMoney = () => {
        setModalType('add');
        setIsModalVisible(true);
        setErrorMessage('');
    };

    const onWithdrawMoney = () => {
        setModalType('withdraw');
        setIsModalVisible(true);
        setErrorMessage('');
    };

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
        setErrorMessage('');
    };

    const onAddAmount = async () => {
        const amountToAdd = new Decimal(amount);

        if (amountToAdd.isNaN() || amountToAdd.lte(0)) {
            setErrorMessage('Please enter a valid amount!');
            return;
        }

        try {
            let url = '';
            let method = '';
            let type = '';

            if (modalType === 'add') {
                url = `http://localhost:8080/wallet/deposit?amount=${amountToAdd.toString()}`;
                method = 'POST';
                type = 'Deposit';
            } else if (modalType === 'withdraw') {
                url = `http://localhost:8080/wallet/withdraw?amount=${amountToAdd.toString()}`;
                method = 'POST';
                type = 'Withdraw';
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setBalance(data.balance);
                setAmount('');
                toggleModal();

                const newTransaction = {
                    type: type,
                    amount: amountToAdd.toString(),
                    description: type === 'add' ? 'Deposit to wallet' : 'Withdrawal from wallet',
                    balanceAfterTransaction: data.balance.toString(),
                    createdAt: new Date().toLocaleString(),
                };

                setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
            } else {
                setErrorMessage(data.description || 'Something went wrong, please try again.');
            }
        } catch (error) {
            setErrorMessage('An unexpected error occurred. Please try again.');
        }
    };

    const renderTransactionItem = ({ item }: { item: Transaction }) => (
        <View style={styles.transactionItem}>
            <Text style={styles.transactionText}>{item.type}  </Text>
            <Text style={styles.transactionText}>    ${item.amount}  </Text>
            <Text style={styles.transactionText}>    {item.createdAt}</Text>
        </View>
    );

    const handlePageRefresh = () => {
        getWalletBalance();
        loadTransactionHistory();
    };

    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={handlePageRefresh}>
                <View >
                    <View style={styles.header}>
                        <Text style={styles.balance}>${balance.toFixed(2)}</Text>
                        <Text style={styles.currency}>USD</Text>
                    </View>

                    <View style={styles.buttonsContainer}>
                        <RoundBtn icon={'add'} text={'Add Money'} onPress={onAddMoney} />
                        <RoundBtn icon={'remove'} text={'Withdraw Money'} onPress={onWithdrawMoney} />
                        <RoundBtn icon={'refresh'} text={'Exchange'} onPress={() => router.replace('/(authenticated)/(tabs)/currency')} />
                        <Dropdown />
                    </View>

                    <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>{modalType === 'add' ? 'Add Money' : 'Withdraw Money'}</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                placeholder="Enter amount"
                                value={amount}
                                onChangeText={setAmount}
                            />
                            {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
                            <Button
                                title={modalType === 'add' ? 'Add Money' : 'Withdraw Money'}
                                onPress={onAddAmount}
                                color={Colors.primary}
                            />
                        </View>
                    </Modal>
                    <Text style={styles.transactionHistoryTitle}>Transaction History</Text>

                </View>

            </TouchableWithoutFeedback>
            <View >


                <FlatList
                    data={transactions}
                    renderItem={renderTransactionItem}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.transactionList}
                />

            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingTop: 50,
        paddingBottom: 20,
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    balance: {
        fontSize: 50,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    currency: {
        fontSize: 20,
        color: Colors.gray,
    },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 30,
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: 350,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.primary,
        marginBottom: 20,
    },
    input: {
        height: 45,
        borderColor: Colors.primary,
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 15,
        fontSize: 18,
        width: '100%',
    },
    errorMessage: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
    },
    transactionHistoryTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 30,
        marginBottom: 10,
    },
    transactionList: {
        width: '100%',
        paddingBottom: 20,
        backgroundColor: Colors.lightGray,
        borderRadius: 23,
        paddingHorizontal: 0,
    },
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.primary,
    },
    transactionText: {
        fontSize: 12,
        color: Colors.primary,
        width: '33%',
        textAlign: 'center',
    },
});

export default Home;

