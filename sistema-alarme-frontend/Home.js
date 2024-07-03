import * as React from 'react';
import { View, Text, Image, TouchableOpacity, Linking, StyleSheet, BackHandler, Button } from 'react-native';

export default function TelaHome({ navigation }) {
  return (
    <View style={styles.containerFundo}>

      <View style={styles.container}>
        <Image source={require('./assets/hotwheels.png')} style={styles.logo}></Image>
        <Text style={styles.title} >Sistema de Ré</Text>
      </View>


      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Configuracoes')}>
        <Text style={styles.buttonText}>Configurações do Sistema</Text>
      </TouchableOpacity>
    
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Registros')}>
        <Text style={styles.buttonText}>Registros das Distâncias</Text>
      </TouchableOpacity>
      
    </View>
  );
}

const styles = StyleSheet.create({
  containerFundo:{
    backgroundColor: '#222222',
    flex: 1,
  },
  container: {
    alignItems: 'center',
    padding: 60,
  },
  logo: {
    width: 280,
    height:180,
  },
  title: {
    textAlign: 'center',
    display: "flex",    
    padding: 10,
    fontSize: 24,
    fontWeight:"bold",
    color: '#fff',
  },
  button: {
    backgroundColor: '#222222', // Azul Bebê
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderRadius: 30,
    alignItems: 'center',
    borderColor: '#00C0CC',
    marginLeft: 80,
    marginRight: 80,
    marginBottom:25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  }
});
