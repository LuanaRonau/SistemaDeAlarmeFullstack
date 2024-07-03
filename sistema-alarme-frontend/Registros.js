import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, ActivityIndicator, Image, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons'


export default function TelaRegistros({ navigation }) {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {

    const url = 'http://192.168.1.8:8000/Logging';
    
    setLoading(true);
    setError(null);

    axios.get(url)
      .then((response) => {
        setRegistros(response.data)
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.containerFundo}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.containerFundo}>
        <Text style={styles.errorText}>Erro: {error.message}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.containerFundo}>
      {registros.length ? (
        <View style={styles.container}>
          <FlatList
            data={registros}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.titulos}>Distância: {item.distancia}</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      ) : (
        <Text style={styles.semRegMsg}>Nenhum registro</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Configuracoes')}>
        <Icon name="settings-outline" style={styles.buttonIcon} size={24}/>
        <Text style={styles.buttonText}>Configurações</Text>
      </TouchableOpacity>
    </ScrollView>
    )
}

const styles = StyleSheet.create({
  containerFundo: {
    backgroundColor: '#222222',
    flex: 1,
  },
  container: {
    padding: 40
  },
  card: {
    backgroundColor: '#222222',
    borderRadius: 30,
    borderColor: '#00C0CC',
    borderWidth: 1.5,
    marginBottom: 30,
    justifyContent: 'center',
  },
  titulos: {
    paddingVertical: 25,
    fontSize: 18,
    fontWeight: "bold",
    color: '#fff',
    alignSelf: 'center',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#222222',
    borderColor: '#00C0CC',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 1.5,
    alignSelf: 'center',
    marginHorizontal: 80,
    marginVertical: 50,
    justifyContent: 'center',
  },
  buttonIcon: {
    color: '#fff',
    marginRight: 10,
  },
  buttonText: {
    paddingTop: 1,
    paddingRight: 1,
    color: '#fff',
    fontSize: 18,
  },
  semRegMsg: {
    textAlign: 'center',
    fontSize: 18,
    marginVertical: 30,
  }
});
