import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, Modal, Button } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/ AuthContext'
import { router, useRouter } from 'expo-router';
import { replace } from 'expo-router/build/global-state/routing';

const screenWidth = Dimensions.get('window').width;

interface HistoricalData {
    date: string;
    close: number;
}

const market: React.FC = () => {
    const [symbol, setSymbol] = useState<string>('AAPL');
    const [image, setImage] = useState<string | undefined>();
    const [price, setPrice] = useState<number | undefined>();
    const [change, setChange] = useState<number | undefined>();
    const [companyName, setCompanyName] = useState<string | undefined>();
    const [isDetailVisible, setIsDetailVisible] = useState<boolean>(false);
    const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
    const [historicalDataWeek, setHistoricalDataWeek] = useState<HistoricalData[]>([]);
    const [historicalDatayear, setHistoricalDatayear] = useState<HistoricalData[]>([]);
    const { token } = useAuth();
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
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
                console.log(data.historical)
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

    const pressed = () => {
        setIsModalVisible(false)
        router.push("/(authenticated)/(tabs)/crypto")
    }

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
                                width={screenWidth}
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
                                width={screenWidth}
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
                                    width={screenWidth * 4}
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
                    <Text style={styles.modalTitle}>Charts</Text>

                    <ScrollView style={styles.scrollView} horizontal={false}>
                        <View style={styles.chartContainer}>

                            <Text style={styles.chartTitle}>1-Week Price Change</Text>
                            <LineChart
                                data={{
                                    labels: historicalDataWeek.map(item => item.date),
                                    datasets: [{ data: historicalDataWeek.map(item => item.close), strokeWidth: 2 }],
                                }}
                                width={screenWidth}
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
                            <Text style={styles.chartTitle}>1-Month Price Change</Text>
                            <LineChart
                                data={{
                                    labels: historicalData.map(item => item.date),
                                    datasets: [{ data: historicalData.map(item => item.close), strokeWidth: 2 }],
                                }}
                                width={screenWidth}
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
                                <Text style={styles.chartTitle}>1-Month Price Change Details</Text>
                                <LineChart
                                    data={{
                                        labels: historicalData.map(item => item.date),
                                        datasets: [{ data: historicalData.map(item => item.close), strokeWidth: 2 }],
                                    }}
                                    width={screenWidth * 4}
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
                                <Text style={styles.chartTitle}>1-Year Price Change</Text>
                                <LineChart
                                    data={{
                                        labels: historicalDatayear.map(item => item.date),
                                        datasets: [{ data: historicalDatayear.map(item => item.close), strokeWidth: 2 }],
                                    }}
                                    width={screenWidth * 40}
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


                    <TouchableOpacity onPress={() => pressed()} style={styles.closeModalButton}>
                        <Text style={styles.closeModalText}>BUY</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </ScrollView>
    );
};

export default market;

const styles = StyleSheet.create({
    scrollView: { padding: 10 },
    headerContainer: { marginBottom: 10, marginTop: 0 },
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


