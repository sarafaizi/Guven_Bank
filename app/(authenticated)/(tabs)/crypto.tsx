/*import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, Modal, Button } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/ AuthContext'
import { router, useRouter } from 'expo-router';

const screenWidth = Dimensions.get('window').width;

interface HistoricalData {
    date: string;
    close: number;
}

const Crypto: React.FC = () => {
    const [symbol, setSymbol] = useState<string>('AAPL');
    const [image, setImage] = useState<string | undefined>();
    const [price, setPrice] = useState<number | undefined>();
    const [change, setChange] = useState<number | undefined>();
    const [companyName, setCompanyName] = useState<string | undefined>();
    const [isDetailVisible, setIsDetailVisible] = useState<boolean>(false);
    const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
    const [historicalDataWeek, setHistoricalDataWeek] = useState<HistoricalData[]>([]);
    const [historicalDatayear, setHistoricalDatayear] = useState<HistoricalData[]>([]); // 1 haftalık veri
    const { token } = useAuth();
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // Modal durumu
    const router = useRouter();

    const getStock = async () => {
        try {
            const response = await fetch(`http://localhost:8080/stock/${symbol}/company`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to fetch stock data');
            const data = await response.json();

            if (data && data.length > 0) {
                setSymbol(data[0].symbol);
                setImage(data[0].image);
                setPrice(data[0].price);
                setChange(data[0].changes);
                setCompanyName(data[0].companyName);

            }
        } catch (error) {
            console.error('Error fetching stock data:', error);
        }
    };

    const getHistoricalData = async () => {
        try {
            const response = await fetch(`http://localhost:8080/stock/${symbol}/historical/last-month`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to fetch historical data');
            const data = await response.json();

            if (data && data.historical) {
                setHistoricalData(data.historical.reverse());
            }
        } catch (error) {
            console.error('Error fetching historical data:', error);
        }
    };

    const getHistoricalDataweek = async () => {
        try {
            const response = await fetch(`http://localhost:8080/stock/${symbol}/historical/last-week`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to fetch historical data');
            const data = await response.json();

            if (data && data.historical) {
                setHistoricalDataWeek(data.historical.reverse());
            }
        } catch (error) {
            console.error('Error fetching historical data:', error);
        }
    };
    const getHistoricalDatayear = async () => {
        try {
            const response = await fetch(`http://localhost:8080/stock/${symbol}/historical/last-year`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to fetch historical data');
            const data = await response.json();

            if (data && data.historical) {
                setHistoricalDatayear(data.historical.reverse());
            }
        } catch (error) {
            console.error('Error fetching historical data:', error);
        }
    };

    useEffect(() => {
        if (token) {
            getStock();
            getHistoricalData();
            getHistoricalDataweek();
            getHistoricalDatayear();
        }
    }, [token, symbol]);

    const toggleDetail = () => setIsDetailVisible(!isDetailVisible);

    return (

        <ScrollView>

            <ScrollView style={styles.scrollView} horizontal={false}>

                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>Markets</Text>
                </View>
                <View style={{ borderBottomWidth: 1, borderBottomColor: Colors.dark, marginTop: -7, marginBottom: 10 }} />
                <TouchableOpacity style={styles.itemContainer} onPress={() => setIsModalVisible(true)}>
                    <View style={styles.row}>
                        {image && <Image source={{ uri: image }} style={styles.image} />}
                        <View style={styles.textContainer}>
                            <Text style={styles.symbolText}>{symbol}</Text>
                            <Text style={styles.companyText}>{companyName}</Text>
                        </View>
                        <View style={styles.priceChangeContainer}>
                            <Text style={styles.priceText}>${price?.toFixed(2)}</Text>
                            <Text style={[styles.changeText, change && change >= 0 ? styles.positiveChange : styles.negativeChange]}>
                                {change?.toFixed(2)}%
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {isDetailVisible && historicalData.length > 0 && (
                    <View >
                        <View style={styles.chartContainer}>
                            <View style={styles.detailContainer}>
                                <Text style={styles.detailTitle}>Company Details:</Text>
                                <Text style={styles.detailText}>Symbol: {symbol}</Text>
                                <Text style={styles.detailText}>Company: </Text>
                                <Text style={styles.detailText}>Price: ${price}</Text>
                                <Text style={styles.detailText}>Change: {change}%</Text>

                            </View>
                        </View>
                        <View style={styles.chartContainer}>
                            <View style={styles.chartContainer}>
                                <View style={styles.detailContainer}>
                                    <Text style={styles.detailTitle}>Company Details:</Text>
                                    <Text style={styles.detailText}>Symbol: {symbol}</Text>
                                    <Text style={styles.detailText}>Company: </Text>
                                    <Text style={styles.detailText}>Price: ${price}</Text>
                                    <Text style={styles.detailText}>Change: {change}%</Text>


                                </View>
                            </View>




                            <Text style={styles.chartTitle}>1 Haftalık Fiyat Değişimi</Text>
                            <LineChart
                                data={{
                                    labels: historicalDataWeek.map(item => item.date),
                                    datasets: [{ data: historicalDataWeek.map(item => item.close), strokeWidth: 2 }],
                                }}
                                width={screenWidth} // Ekran genişliği
                                height={250}
                                yAxisLabel="$"
                                yAxisInterval={1}
                                chartConfig={{
                                    backgroundColor: 'transparent',
                                    backgroundGradientFrom: Colors.gray,
                                    backgroundGradientTo: Colors.primary,
                                    decimalPlaces: 2,
                                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                }}
                                style={styles.chart}
                            />
                        </View>

                        <View style={styles.chartContainer}>
                            <Text style={styles.chartTitle}>1 Aylık Fiyat Değişimi</Text>
                            <LineChart
                                data={{
                                    labels: historicalData.map(item => item.date),
                                    datasets: [{ data: historicalData.map(item => item.close), strokeWidth: 2 }],
                                }}
                                width={screenWidth} // Ekran genişliği
                                height={250}
                                yAxisLabel="$"
                                yAxisInterval={1}
                                chartConfig={{
                                    backgroundColor: 'transparent',
                                    backgroundGradientFrom: Colors.gray,
                                    backgroundGradientTo: Colors.primary,
                                    decimalPlaces: 2,
                                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                }}
                                style={styles.chart}
                            />
                        </View>

                        <ScrollView horizontal>
                            <View style={styles.chartContainer}>
                                <Text style={styles.chartTitle}>3 Haftalık Fiyat Değişimi</Text>
                                <LineChart
                                    data={{
                                        labels: historicalData.map(item => item.date),
                                        datasets: [{ data: historicalData.map(item => item.close), strokeWidth: 2 }],
                                    }}
                                    width={screenWidth * 4} // Ekran genişliği
                                    height={250}
                                    yAxisLabel="$"
                                    yAxisInterval={1}
                                    chartConfig={{
                                        backgroundColor: 'transparent',
                                        backgroundGradientFrom: Colors.gray,
                                        backgroundGradientTo: Colors.primary,
                                        decimalPlaces: 2,
                                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    }}
                                    style={styles.chart}
                                />
                            </View>
                        </ScrollView>
                    </View>
                )}
            </ScrollView>


            <Modal visible={isModalVisible} animationType="slide" onRequestClose={() => setIsModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Grafikler</Text>

                    <ScrollView style={styles.scrollView} horizontal={false}>
                        <View style={styles.chartContainer}>
                           
                            <Text style={styles.chartTitle}>1 Haftalık Fiyat Değişimi</Text>
                            <LineChart
                                data={{
                                    labels: historicalDataWeek.map(item => item.date),
                                    datasets: [{ data: historicalDataWeek.map(item => item.close), strokeWidth: 2 }],
                                }}
                                width={screenWidth} // Ekran genişliği
                                height={250}
                                yAxisLabel="$"
                                yAxisInterval={1}
                                chartConfig={{
                                    backgroundColor: 'transparent',
                                    backgroundGradientFrom: Colors.gray,
                                    backgroundGradientTo: Colors.primary,
                                    decimalPlaces: 2,
                                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                }}
                                style={styles.chart}
                            />
                        </View>

                        <View style={styles.chartContainer}>
                            <Text style={styles.chartTitle}>1 Aylık Fiyat Değişimi</Text>
                            <LineChart
                                data={{
                                    labels: historicalData.map(item => item.date),
                                    datasets: [{ data: historicalData.map(item => item.close), strokeWidth: 2 }],
                                }}
                                width={screenWidth} // Ekran genişliği
                                height={250}
                                yAxisLabel="$"
                                yAxisInterval={1}
                                chartConfig={{
                                    backgroundColor: 'transparent',
                                    backgroundGradientFrom: Colors.gray,
                                    backgroundGradientTo: Colors.primary,
                                    decimalPlaces: 2,
                                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                }}
                                style={styles.chart}
                            />
                        </View>

                        <ScrollView horizontal>
                            <View style={styles.chartContainer}>
                                <Text style={styles.chartTitle}>3 Haftalık Fiyat Değişimi</Text>
                                <LineChart
                                    data={{
                                        labels: historicalData.map(item => item.date),
                                        datasets: [{ data: historicalData.map(item => item.close), strokeWidth: 2 }],
                                    }}
                                    width={screenWidth * 4} // Ekran genişliği
                                    height={250}
                                    yAxisLabel="$"
                                    yAxisInterval={1}
                                    chartConfig={{
                                        backgroundColor: 'transparent',
                                        backgroundGradientFrom: Colors.gray,
                                        backgroundGradientTo: Colors.primary,
                                        decimalPlaces: 2,
                                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    }}
                                    style={styles.chart}
                                />
                            </View>
                        </ScrollView>
                        <ScrollView horizontal>
                            <View style={styles.chartContainer}>
                                <Text style={styles.chartTitle}>1 yıllık Fiyat Değişimi</Text>
                                <LineChart
                                    data={{
                                        labels: historicalDatayear.map(item => item.date),
                                        datasets: [{ data: historicalDatayear.map(item => item.close), strokeWidth: 2 }],
                                    }}
                                    width={screenWidth * 40} // Ekran genişliği
                                    height={250}
                                    yAxisLabel="$"
                                    yAxisInterval={1}
                                    chartConfig={{
                                        backgroundColor: 'transparent',
                                        backgroundGradientFrom: Colors.gray,
                                        backgroundGradientTo: Colors.primary,
                                        decimalPlaces: 2,
                                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    }}
                                    style={styles.chart}
                                />
                            </View>
                        </ScrollView>

                    </ScrollView>

                    <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeModalButton}>
                        <Text style={styles.closeModalText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </ScrollView>
    );
};

export default Crypto;

const styles = StyleSheet.create({
    scrollView: { padding: 10 },
    headerContainer: { marginBottom: 10, marginTop: 70 },
    headerText: { fontSize: 32, fontWeight: 'bold' },
    itemContainer: { padding: 10, borderWidth: 1, borderRadius: 10, borderColor: '#ccc' },
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    image: { width: 60, height: 60, borderRadius: 30, marginRight: 15, backgroundColor: Colors.dark },
    textContainer: { flex: 1 },
    symbolText: { fontSize: 18, fontWeight: 'bold' },
    companyText: { fontSize: 14, color: '#888' },
    priceChangeContainer: { alignItems: 'flex-end' },
    priceText: { fontSize: 18, fontWeight: 'bold', color: Colors.primary },
    changeText: { fontSize: 16 },
    positiveChange: { color: 'green' },
    negativeChange: { color: 'red' },
    chartContainer: { marginBottom: 20 },
    chartTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#fff' },
    chart: { marginVertical: 10 },
    modalContainer: { flex: 1, padding: 20, backgroundColor: '#333' },
    modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#fff' },
    closeModalButton: {
        backgroundColor: Colors.primary,
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center',
    },
    closeModalText: { fontSize: 18, color: '#fff' },
    detailContainer: {
        marginTop: 20,
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#ccc',
        backgroundColor: '#f9f9f9',
    },
    detailTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    detailText: {
        fontSize: 16,
        marginBottom: 5,
    },
});
*/



import { useAuth } from '@/context/ AuthContext'
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator, Modal, TextInput, ScrollView, Image } from 'react-native';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import CustomerHeader2 from '@/component/CustomerHeader2';
import { Picker } from '@react-native-picker/picker';


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
interface assets {
    id: number;
    stock: Stock;
    symbol: string;
    name: string;
    exchange: string;
    quantity: number;
    averagePrice: number;
    createdAt: string;
    updatedAt: string;

}

const Crypto = () => {
    const { token, balance } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [stockSymbol, setStockSymbol] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(0);
    const [transactionType, setTransactionType] = useState<'buy' | 'sell'>('buy');
    const [showTransactions, setShowTransactions] = useState<boolean>(true);
    const [showTransactions2, setShowTransactions2] = useState<boolean>(false); const [showTransactions3, setShowTransactions3] = useState<boolean>(false);
    const router = useRouter();
    const [balance2, setBalance2] = useState(balance);
    const [selectedValue, setSelectedValue] = useState<string>("");
    const [assets, setAssets] = useState<assets[]>([]);

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
            setSelectedValue(data[0].stock.symbol)
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
            getWalletBalance();

        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }; const getWalletBalance = async () => {
        try {
            const response = await fetch('http://localhost:8080/wallet', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            setBalance2(data.balance.toString());


        } catch (error) {
            console.error('Error fetching wallet balance:', error);
        }
    };


    const fetchassets = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/portfolio', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch transactions');
            }
            const data: assets[] = await response.json();
            setAssets(data);


        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchTransactions();
            fetchassets();
            console.log(transactions)
        }
    }, [token]);
    useEffect(() => {

        if (balance2) {
            setBalance2(balance2.toString());
            console.log(token)
            console.log(assets)
            fetchassets();

        }
    }, [balance2]);

    return (
        <View style={styles.container}>
            <Text style={styles.balance}>Current Balance</Text>
            <Text style={styles.balance2}>${balance2}</Text>

            {loading && <ActivityIndicator size="large" color={Colors.primary} />}
            {error && <Text style={styles.error}>{error}</Text>}


            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <View style={styles.button} >
                    <Button
                        title="Buy"
                        onPress={() => {
                            setTransactionType('buy');
                            setModalVisible(true);
                        }}
                        disabled={loading}
                        color={Colors.dark}
                    />
                </View>
                <View style={styles.button}>
                    <Button
                        title="Sell"
                        onPress={() => {
                            setTransactionType('sell');
                            setModalVisible(true);
                        }}
                        disabled={loading}
                        color={Colors.dark}
                    />
                </View>
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


            <View style={{ flexDirection: 'row-reverse', marginTop: 23, }}>
                <ScrollView horizontal style={{
                    backgroundColor: Colors.primaryMuted, borderRadius: 35, flexDirection: 'row',
                    height: 50,
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Button
                            title={"Assets"}
                            onPress={() => {
                                setShowTransactions3(!showTransactions3);
                                setShowTransactions(false);
                                setShowTransactions2(false);
                            }}

                            color={Colors.dark}
                        />
                        < Button
                            title={showTransactions ? "Hide Transactions" : "Show All Transactions"}
                            onPress={() => {
                                setShowTransactions(!showTransactions)
                                setShowTransactions2(false);
                                setShowTransactions3(false);
                            }}
                            color={Colors.dark}

                        />
                        <Button
                            title={"stock"}
                            onPress={() => {
                                setShowTransactions2(!showTransactions2);
                                setShowTransactions(false);
                                setShowTransactions3(false);
                            }
                            }
                            color={Colors.dark}
                        />


                    </View>
                </ScrollView>
            </View>

            {
                showTransactions && (
                    <Text style={styles.subtitle}>Your Transactions:</Text>
                )
            }

            {
                showTransactions && (
                    <ScrollView style={styles.transactionContainer}>
                        {transactions.length > 0 ? (
                            transactions.map((item) => (
                                <View key={item.id} style={styles.transaction}>
                                    <Text>Stock: {item.stock.name} ({item.stock.symbol})</Text>
                                    <Text>Transaction Type: {item.transactionType}</Text>
                                    <Text>Quantity: {item.quantity}</Text>
                                    <Text>Price: {item.price}</Text>
                                    <Text>Date: {item.createdAt.toLocaleString()}</Text>
                                </View>
                            ))
                        ) : (
                            <Text>No transactions found.</Text>
                        )
                        }


                    </ScrollView>
                )
            }


            {
                showTransactions3 && (
                    <Text style={styles.subtitle}>Your Assets:</Text>
                )
            }
            {showTransactions3 && (

                <ScrollView style={styles.transactionContainer}>
                    {
                        assets.length > 0 ? (
                            assets.map((item) => (
                                <View key={item.id} style={styles.transaction}>
                                    <View style={{ flexDirection: 'column-reverse' }}>
                                        <Text>İd:{item.id}</Text>
                                        <View style={{ left: 250 }}>


                                        </View>


                                    </View>
                                    <Text>Stock: {item.stock.symbol}</Text>
                                    <Text>Name: {item.stock.name}</Text>
                                    <Text>Exchange: {item.stock.exchange}</Text>
                                    <Text>Quantity: {item.quantity}</Text>

                                    <Text>averagePrice: {item.averagePrice}</Text>



                                    <Text>Date: {item.createdAt}</Text>

                                </View>
                            ))
                        ) : (
                            <Text>No transactions found.</Text>
                        )
                    }
                </ScrollView>
            )
            }
        </View >
    );
};

export default Crypto;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
        top: 50
    },
    balance: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 20,
        textAlign: 'center',
    },
    balance2: {
        fontSize: 34,
        fontWeight: 'bold',
        color: Colors.dark,
        marginVertical: 23,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '40%',
        marginBottom: 20,
        backgroundColor: Colors.primaryMuted
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
    transactionContainer: {
        flex: 1,
    },
    transaction: {
        padding: 10,
        margin: 5,
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: 5,
        backgroundColor: Colors.primaryMuted
    },
    error: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
    button: {
        backgroundColor: Colors.primaryMuted, width: 90, borderRadius: 23, borderWidth: 1, borderColor: Colors.primary, marginTop: 20
    }
});

