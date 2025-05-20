import { View, Text, ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import Colors from '@/constants/Colors';

const InfoPage = () => {
    return (
        <ScrollView style={styles.container}>

            <View style={styles.section}>
                <Text style={styles.title}>About the App</Text>
                <Text style={styles.text}>
                    This app is a platform that allows users to manage their personal account information, perform currency conversion via exchange rates, and make deposit and withdrawal transactions. Users can view their balance, perform currency conversions, and track their transaction history.
                </Text>
            </View>


            <View style={styles.section}>
                <Text style={styles.title}>Currency Conversion</Text>
                <Text style={styles.text}>
                    This feature allows users to perform currency conversion using exchange rates. Users can view their current balance and select the desired currency to convert a specified amount based on the exchange rate. Exchange rates are updated via an API and provided to the user.
                </Text>
                <Text style={styles.text}>- View Current Balance: Users can see their current balance after logging into the app.</Text>
                <Text style={styles.text}>- Exchange Rate Updates: Exchange rates are fetched via an API and displayed to the user. Users can choose between different currencies.</Text>
                <Text style={styles.text}>- Currency Conversion: Users can convert a currency to another using the selected exchange rate and see the result instantly.</Text>
            </View>


            <View style={styles.section}>
                <Text style={styles.title}>Deposit and Withdrawal</Text>
                <Text style={styles.text}>
                    Users can perform deposit and withdrawal transactions to and from their wallet. A deposit adds a specified amount to the user's account, while a withdrawal takes a specified amount from the wallet.
                </Text>
                <Text style={styles.text}>- Deposit: To add money to your account, click the "Add Money" button.</Text>
                <Text style={styles.text}>- Withdrawal: To withdraw money from your account, click the "Withdraw Money" button.</Text>
                <Text style={styles.text}>- Invalid Amount Entry: An error message will be shown if an invalid amount is entered.</Text>
            </View>

            {/* Information about transaction history */}
            <View style={styles.section}>
                <Text style={styles.title}>Transaction History</Text>
                <Text style={styles.text}>
                    Users can view all their past deposit and withdrawal transactions on this page. Each transaction is listed with its type, amount, and date.
                </Text>
                <Text style={styles.text}>- Transaction History: Deposit and withdrawal transactions are listed here.</Text>
            </View>


            <View style={styles.section}>
                <Text style={styles.title}>Important Information</Text>
                <Text style={styles.text}>
                    - Deposit and Withdrawal: Only valid and positive numbers are accepted. Please enter a valid amount.
                </Text>
                <Text style={styles.text}>
                    - Privacy: All transactions are linked to your account only. Your data is stored securely in an encrypted format for your safety.
                </Text>
                <Text style={styles.text}>- Invalid Transaction: If an invalid transaction is attempted, the app will notify you with an error message.</Text>
            </View>


            <View style={styles.section}>
                <Text style={styles.text}>
                    With the transaction page, you can manage your deposits, withdrawals, currency conversions, and transaction history. Please check your balance and enter a valid amount before making a transaction.
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
        padding: 15,
    },
    section: {
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
});

export default InfoPage;

