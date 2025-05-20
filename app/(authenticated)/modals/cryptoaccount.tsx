import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TextInput, StyleSheet } from 'react-native';
import { useAuth } from '@/context/ AuthContext'

const WatchlistScreen = () => {
    const { token } = useAuth();
    const [watchlists, setWatchlists] = useState<any[]>([]);
    const [newWatchlistName, setNewWatchlistName] = useState('');
    const [isCreating, setIsCreating] = useState(false);


    const fetchWatchlists = async () => {
        try {
            const response = await fetch('http://localhost:8080/watchlist', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            setWatchlists(data);
        } catch (error) {
            console.error('Error fetching watchlists:', error);
        }
    };


    const createWatchlist = async () => {
        try {
            const response = await fetch('http://localhost:8080/watchlist', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newWatchlistName }),
            });

            const data = await response.json();
            setWatchlists([...watchlists, data]);
            setNewWatchlistName('');
            setIsCreating(false);
        } catch (error) {
            console.error('Error creating watchlist:', error);
        }
    };


    const handleAddStock = async (watchlistId: number, symbol: string) => {
        try {
            const response = await fetch(`http://localhost:8080/watchlist/${watchlistId}/stock/${symbol}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            setWatchlists(watchlists.map(watchlist =>
                watchlist.id === watchlistId ? { ...watchlist, stocks: data.stocks } : watchlist
            ));
        } catch (error) {
            console.error('Error adding stock:', error);
        }
    };


    useEffect(() => {
        if (token) {
            fetchWatchlists();
        }
    }, [token]);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Watchlist</Text>


            <Button title="Yeni Watchlist Oluştur" onPress={() => setIsCreating(true)} />


            {isCreating && (
                <View style={styles.createWatchlist}>
                    <TextInput
                        style={styles.input}
                        placeholder="Watchlist adı"
                        value={newWatchlistName}
                        onChangeText={setNewWatchlistName}
                    />
                    <Button title="Oluştur" onPress={createWatchlist} />
                </View>
            )}

            <FlatList
                data={watchlists}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.watchlistItem}>
                        <Text>{item.name}</Text>


                        <FlatList
                            data={item.stocks}
                            keyExtractor={(stock) => stock.symbol}
                            renderItem={({ item }) => (
                                <Text>{item.name}</Text>
                            )}
                        />


                        <Button
                            title="Stock Ekle (AAPL)"
                            onPress={() => handleAddStock(item.id, 'AAPL')}
                        />
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    createWatchlist: {
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 8,
    },
    watchlistItem: {
        marginBottom: 20,
    },
});

export default WatchlistScreen;



/*
import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TextInput, StyleSheet } from 'react-native';
import { useAuth } from '@/context/ AuthContext' // AuthContext'ten token'ı alıyoruz

const WatchlistScreen = () => {
    const { token } = useAuth(); // Kullanıcı token'ını alıyoruz
    const [watchlists, setWatchlists] = useState<any[]>([]); // Watchlist'leri tutmak için state
    const [newWatchlistName, setNewWatchlistName] = useState(''); // Yeni watchlist adı
    const [isCreating, setIsCreating] = useState(false); // Yeni watchlist oluşturma formunun gösterilmesi

    // Yeni watchlist oluşturmak için API'ye POST isteği
    const createWatchlist = async () => {
        try {
            const response = await fetch('http://localhost:8080/watchlist', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newWatchlistName }), // Yeni watchlist adı
            });

            const data = await response.json();
            setWatchlists([...watchlists, data]); // Yeni watchlist'i listeye ekle
            setNewWatchlistName(''); // Formu sıfırla
            setIsCreating(false); // Formu kapat
        } catch (error) {
            console.error('Error creating watchlist:', error);
        }
    };

    // Ekran yüklendiğinde watchlist'leri al
    useEffect(() => {
        if (token) {
            createWatchlist();
        }
    }, [token]);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Watchlist</Text>

           
            <Button title="Yeni Watchlist Oluştur" onPress={() => setIsCreating(true)} />

            
            {isCreating && (
                <View style={styles.createWatchlist}>
                    <TextInput
                        style={styles.input}
                        placeholder="Watchlist adı"
                        value={newWatchlistName}
                        onChangeText={setNewWatchlistName}
                    />
                    <Button title="Oluştur" onPress={createWatchlist} />
                </View>
            )}


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    createWatchlist: {
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 8,
    },
    watchlistItem: {
        marginBottom: 20,
    },
});

export default WatchlistScreen;
*/
