import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, ActivityIndicator, Image, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons'


export default function TelaConfiguracoes({ navigation }) {
  const [distanciaMinima, setDistanciaMinima] = useState(10.0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const handleChangeDistanciaMin = (change) => {
    setLoading(true);
    setError(null);
    
    const newDistanciaMinima = distanciaMinima + change;
    setDistanciaMinima(newDistanciaMinima)
    
    const patchData = {
      distancia_minima: newDistanciaMinima
    };
    const url = 'http://192.168.1.8:8000/Controle';
    
    axios.patch(url, patchData)
    .then((response) => {
      console.log(response.data); // Mensagem de sucesso do servidor
      setLoading(false);
    })
    .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  return (

    <ScrollView style={styles.containerFundo}>
    
      <View style={styles.container}>
        <TouchableOpacity onPress={() => handleChangeDistanciaMin(-1)}>
            <Icon name="caret-back-outline" style={styles.arrow} size={50}/>
        </TouchableOpacity>

        <Text style={styles.distancia}>{distanciaMinima}</Text>

        <TouchableOpacity onPress={() => handleChangeDistanciaMin(1)}>
            <Icon name="caret-forward-outline" style={styles.arrow} size={50}/>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Registros')}>
        <Icon name="albums-outline" style={styles.buttonIcon} size={24}/>
        <Text style={styles.buttonText}>Ver Registros</Text>
      </TouchableOpacity>

    </ScrollView>
    
  )
}

const styles = StyleSheet.create({
  containerFundo: {
    backgroundColor: '#222222',
    flex: 1,
    flexGrow: 1,
  },
  container: {
    height: 250,
    width: 250,
    marginTop: 150,
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 30,
    borderColor: '#00C0CC',
    borderWidth: 1.5,
    alignSelf: 'center',
    alignItems: 'center',
  },
  arrow: {
    color: '#fff',
    paddingHorizontal: 24,
  },
  distancia: {
    color: '#fff',
    fontSize: 34,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#222222',
    borderColor: '#00C0CC',
    borderWidth: 1.5,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 100,
    alignSelf: 'center',
  },
  buttonIcon: {
    color: '#fff',
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,    
  },
});
