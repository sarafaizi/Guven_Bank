
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/ AuthContext'
import Clipboard from '@react-native-clipboard/clipboard';

const Info = () => {

    const [pressed, setPressed] = useState(false);
    const { token } = useAuth();
    const [cardnumber, setCardnumber] = useState<string | undefined>();
    const [expirationDate, setExpirationDate] = useState<string | undefined>();
    const [cvv, setCvv] = useState<string | undefined>();
    const [name, setName] = useState<string | undefined>();
    const [email, setEmail] = useState<string | undefined>();
    const [enabled, setEnabled] = useState<boolean | undefined>();

    useEffect(() => {
        if (token) {
            getcardinfo();
        }
    }, [token]);

    const getcardinfo = async () => {
        try {
            const response = await fetch('http://localhost:8080/user/card', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            console.log(data)
            setName(data[0].cardHolderName)
            console.log(name)
            if (data && data.length > 0) {
                setCardnumber(data[0].cardNumber);
                setExpirationDate(data[0].expirationDate);
                setCvv(data[0].cvv);
                setEmail(data[0].user.email);
                setEnabled(data[0].user.enabled)
            }

        } catch (error) {
            console.error("Error fetching card info:", error);
        }
    };


    useEffect(() => {
        console.log('Card Number:', cardnumber);
        console.log('Expiration Date:', expirationDate);
        console.log('cvv', cvv)
        console.log('email', email)
        console.log(enabled)
    }, [cardnumber, expirationDate, cvv, email, enabled]);


    const copyToClipboard = (value: string) => {
        if (value) {
            Clipboard.setString(value);
            alert("Copied to clipboard");
        } else {
            alert("No data to copy");
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <TouchableOpacity
                    style={[styles.Card, { backgroundColor: pressed ? Colors.primary : Colors.primaryMuted }]}
                    onPressIn={() => setPressed(true)}
                    onPressOut={() => setPressed(false)}
                >
                    <Text style={styles.title}>PURPLE CARD</Text>
                    <Image source={require('@/assets/images/Ekran Resmi 2025-02-20 01.06.38.png')} style={styles.image} />
                    <Text style={styles.cardno}>{cardnumber || 'N/A'}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.cardtext}>VALID FROM</Text>
                        <Text style={styles.cardtext}>CVV</Text>
                    </View>
                    <View style={[{ flexDirection: 'row' }]}>
                        <Text style={styles.Date}>{expirationDate || 'N/A'}</Text>
                        <Text style={styles.Date}>{cvv || 'N/A'}</Text>
                    </View>
                    <Image source={require('@/assets/images/Troy-logo-sloganli.png')} style={styles.troy} />
                    <Text style={styles.name}>{name || 'N/A'}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section2}>
                <Text style={styles.text}>Card Information</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableHeader}>Card Holder</Text>
                        <TouchableOpacity onPress={() => copyToClipboard(name || '')}>
                            <Text style={styles.tableData}>{name}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableHeader}>Card Number</Text>
                        <TouchableOpacity onPress={() => copyToClipboard(cardnumber || '')}>
                            <Text style={styles.tableData}>{cardnumber}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableHeader}>Expiration Date</Text>
                        <TouchableOpacity onPress={() => copyToClipboard(expirationDate || '')}>
                            <Text style={styles.tableData}>{expirationDate || 'N/A'}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableHeader}>CVV</Text>
                        <TouchableOpacity onPress={() => copyToClipboard(cvv || '')}>
                            <Text style={styles.tableData}>{cvv || 'N/A'}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableHeader}>Email</Text>
                        <TouchableOpacity onPress={() => copyToClipboard(email || '')}>
                            <Text style={styles.tableData}>{email || 'N/A'}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableHeader}>Card status</Text>
                        <Text style={styles.tableData}>
                            {enabled !== undefined ? (enabled ? 'Active' : 'Inactive') : 'N/A'}
                        </Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default Info;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    section: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 15,
    },
    section2: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
    },

    text: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    Card: {
        margin: 12,
        marginRight: 22,
        width: '95%',
        height: 230,
        backgroundColor: Colors.primaryMuted,
        borderRadius: 34,
        borderWidth: 4,
        borderColor: Colors.primary,
        padding: 20,
        position: 'relative',
    },
    title: {
        fontSize: 23,
        fontWeight: 'bold',
        position: 'absolute',
        top: 35,
        left: 20,
    },
    image: {
        width: 56,
        height: 45,
        top: 56,
    },
    cardno: {
        top: 71,
        fontFamily: 'Courier',
        fontSize: 19,
    },
    cardtext: {
        top: 78,
        left: 30,
        fontFamily: 'Helvetica Neue',
        marginLeft: 23,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    Date: {
        top: 90,
        marginLeft: 38,
        left: 50,
    },
    troy: {
        width: 93,
        height: 45,
        top: 50,
        left: 230,
    },
    name: {
        top: -140,
        left: 240,
        fontWeight: 'thin',
        fontSize: 15
    },
    table: {
        marginTop: 15,
        width: '90%',
        borderWidth: 1,
        borderColor: Colors.primaryMuted,
        borderRadius: 10,
        top: 25
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderColor: Colors.primaryMuted,
    },
    tableHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    tableData: {
        fontSize: 16,
        color: Colors.primaryMuted,
    },
});
