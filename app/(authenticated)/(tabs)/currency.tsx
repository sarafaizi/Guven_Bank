
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from '@/context/ AuthContext'
import Colors from "@/constants/Colors";

interface CurrencyType {
    currencyCode: string;
    exchangeRate: number;
}

const Currency = () => {
    const [amount, setAmount] = useState<string>("");
    const [fromCurrency, setFromCurrency] = useState<string>("");
    const [toCurrency, setToCurrency] = useState<string>("");
    const { token, balance } = useAuth();
    const [currencies, setCurrencies] = useState<CurrencyType[]>([]);
    const [selectedRate, setSelectedRate] = useState<number>(0);
    const [conversionResult, setConversionResult] = useState<string>("");

    useEffect(() => {
        if (token) {
            getWalletBalance();
            getCurrency();
        }
    }, [token]);

    useEffect(() => {

        if (balance) {
            setAmount(balance.toString());
            getWalletBalance();
            getCurrency();
        }
    }, [balance]);

    const getWalletBalance = async () => {
        try {
            const response = await fetch('http://localhost:8080/wallet', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            setFromCurrency(data.currency);
            setAmount(data.balance.toString());
        } catch (error) {
            console.error('Error fetching wallet balance:', error);
        }
    };

    const getCurrency = async () => {
        try {
            const response = await fetch('http://localhost:8080/currency/top', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }

            const data = await response.json();
            setCurrencies(data);
            setToCurrency(data[0].currencyCode);
            setSelectedRate(data[0].exchangeRate);
        } catch (error) {
            console.error("Error fetching currency:", error);
        }
    };

    const handleCurrencyChange = (currencyCode: string) => {
        setToCurrency(currencyCode);
        const selectedCurrency = currencies.find((currency) => currency.currencyCode === currencyCode);
        if (selectedCurrency) {
            setSelectedRate(selectedCurrency.exchangeRate);
        }
    };

    const handleConversion = () => {
        const convertedAmount = (parseFloat(amount) * selectedRate).toFixed(2);
        setConversionResult(`${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`);
    };

    const handleRefresh = async () => {
        await getWalletBalance();
        await getCurrency();
    };


    return (
        <View style={styles.container}>

            <Text style={styles.title}>Currency Converter</Text>

            <Text style={styles.label}>Amount:</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Enter amount"
                value={amount}
                onChangeText={(text) => setAmount(text)}
            />

            <View style={styles.pickerContainer}>
                <View style={styles.currencyBox}>
                    <Text style={styles.currencyText}>{fromCurrency}</Text>
                </View>

                <View style={styles.currencyBox}>
                    <Text style={styles.currencyText}>{selectedRate ? selectedRate.toFixed(2) : "..."}</Text>
                </View>
            </View>

            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={toCurrency}
                    onValueChange={handleCurrencyChange}
                    style={styles.picker}
                >
                    {currencies.map((currency, index) => (
                        <Picker.Item
                            key={index}
                            label={currency.currencyCode}
                            value={currency.currencyCode}
                        />
                    ))}
                </Picker>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleConversion}>
                <Text style={styles.buttonText}>Convert</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleRefresh}>
                <Text style={styles.buttonText}>Refresh</Text>
            </TouchableOpacity>

            {conversionResult && (
                <Text style={styles.result}>{conversionResult}</Text>
            )}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(201, 200, 250, 0.7)',
        padding: 10,
        top: -80
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        bottom: 0,
    },
    label: {
        fontSize: 16,
        marginBottom: 125,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        width: "80%",
        marginVertical: 10,
        borderRadius: 5,
        backgroundColor: "white",
        textAlign: "center",
        bottom: 120
    },
    pickerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "80%",
        marginTop: 10,
        bottom: 120
    },
    currencyBox: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        width: "40%",
        alignItems: "center",
        borderRadius: 5,
        backgroundColor: "white",
        marginHorizontal: 5,
    },
    currencyText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    picker: {
        flex: 1,
        height: 50,
        backgroundColor: "white",
        marginHorizontal: 5,
    },
    button: {
        backgroundColor: Colors.primary,
        padding: 12,
        width: "80%",
        alignItems: "center",
        borderRadius: 5,
        marginTop: 15,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 1, height: 3 },
        bottom: -160,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    result: {
        marginTop: 30,
        fontSize: 18,
        fontWeight: "bold",
        bottom: 30,
    },
});

export default Currency;
