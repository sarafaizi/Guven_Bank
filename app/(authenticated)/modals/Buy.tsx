import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator, Modal, TextInput, ScrollView } from 'react-native';
import { useAuth } from '@/context/ AuthContext'
import Colors from '@/constants/Colors';

interface Stock {
    symbol: string;
    name: string;
    exchange: string;
}

interface Transaction {
    id: number;
    stock: Stock;
    transactionType: string;
    quantity: number;
    price: number;
    createdAt: string;
    updatedAt: string;
}

const BuySell = () => {
    const { token, balance } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [stockSymbol, setStockSymbol] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(0);
    const [transactionType, setTransactionType] = useState<'buy' | 'sell'>('buy');


    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/transaction', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch transactions');
            }
            const data: Transaction[] = await response.json();
            setTransactions(data);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };


    const handleTransaction = async () => {
        setLoading(true);
        try {
            const url = `http://localhost:8080/transaction/${stockSymbol}/${transactionType}?quantity=${quantity}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
            const data = await response.json();
            alert(`${transactionType === 'buy' ? 'Stock bought' : 'Stock sold'} successfully`);
            fetchTransactions();
            setModalVisible(false);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchTransactions();
        }
    }, [token]);

    return (
        <ScrollView contentContainerStyle={styles.container}>

            <Text style={styles.balance}>Current Balance</Text>
            <Text style={styles.balance2}>${balance}</Text>

            {loading && <ActivityIndicator size="large" color={Colors.primary} />}
            {error && <Text style={styles.error}>{error}</Text>}


            <View style={styles.buttonContainer}>
                <Button
                    title="Buy"
                    onPress={() => {
                        setTransactionType('buy');
                        setModalVisible(true);
                    }}
                    disabled={loading}
                />
                <Button
                    title="Sell"
                    onPress={() => {
                        setTransactionType('sell');
                        setModalVisible(true);
                    }}
                    disabled={loading}
                />
            </View>


            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>
                            {transactionType === 'buy' ? 'Buy Stock' : 'Sell Stock'}
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Stock Symbol (e.g., AAPL)"
                            value={stockSymbol}
                            onChangeText={setStockSymbol}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Quantity"
                            value={quantity.toString()}
                            keyboardType="numeric"
                            onChangeText={(text) => setQuantity(Number(text))}
                        />

                        <View style={styles.modalButtons}>
                            <Button title="Cancel" onPress={() => setModalVisible(false)} />
                            <Button title="Confirm" onPress={handleTransaction} />
                        </View>
                    </View>
                </View>
            </Modal>


            <Text style={styles.subtitle}>Your Transactions:</Text>
            {transactions.length > 0 ? (
                <View>
                    {transactions.map((item) => (
                        <View key={item.id} style={styles.transaction}>
                            <Text>Stock: {item.stock.name} ({item.stock.symbol})</Text>
                            <Text>Transaction Type: {item.transactionType}</Text>
                            <Text>Quantity: {item.quantity}</Text>
                            <Text>Price: {item.price}</Text>
                            <Text>Date: {new Date(item.createdAt).toLocaleString()}</Text>
                        </View>
                    ))}
                </View>
            ) : (
                <Text>No transactions found.</Text>
            )}
        </ScrollView>
    );
};

export default BuySell;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    balance: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 20,
        textAlign: 'center',
    },
    balance2: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.dark,
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        marginBottom: 20,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        maxHeight: '60%',
        overflow: 'scroll',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    subtitle: {
        fontSize: 18,
        marginTop: 20,
        fontWeight: 'bold',
    },
    transaction: {
        padding: 10,
        margin: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    error: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
});


