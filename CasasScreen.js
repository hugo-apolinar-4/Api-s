import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Modal, TextInput, FlatList, ImageBackground, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../../config';

const image = { uri: "https://www.rincondelosencinos.com/static/5efa5d1ef7065c822d724227_loopweb-poster-00001.jpg" };

export const CasasScreen = () => {
  const [casas, setCasas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoNombreCasa, setNuevoNombreCasa] = useState('');

  const obtenerCasas = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/casas`);
      setCasas(response.data.casas);
    } catch (error) {
      console.error('Error al obtener casas:', error);
    }
  };

  const crearCasa = async () => {
    try {
      await axios.post(`${BASE_URL}/admin/casa/create`, { headers: { "Content-Type": "application/json" }, nombre: nuevoNombreCasa });
      setModalVisible(false);
      setNuevoNombreCasa('');
      obtenerCasas(); // Refrescar la lista de casas después de crear una nueva
    } catch (error) {
      console.error('Error al crear casa:', error);
    }
  };

  useEffect(() => {
    obtenerCasas();
  }, []);


  return (
    <ImageBackground source={image} style={styles.image}>
      <View style={styles.container}>
        <Text style={styles.titulo}>¡Bienvenido a nuestra aplicación!</Text>
        <Text style={styles.texto}>Lista de Casas:</Text>
        <FlatList
          data={casas}
          keyExtractor={(item) => item.id} // Asumiendo que 'id' es un número único
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                // Acción al seleccionar una casa, si es necesario
              }}
            >
              <Text style={styles.casaNombre}>Nombre de la Casa: {item.nombrecasa}</Text>
              {/* Ajusta según las propiedades que desees mostrar de cada casa */}
            </TouchableOpacity>
          )}
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Crear Nueva Casa</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre de la Casa"
                value={nuevoNombreCasa}
                onChangeText={setNuevoNombreCasa}
              />
              <Button title="Crear Casa" onPress={crearCasa} />
            </View>
          </View>
        </Modal>

        <Button
          title="Agregar Casa"
          onPress={() => setModalVisible(true)}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  texto: {
    fontSize: 18,
    marginBottom: 20,
    color: '#fff',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fondo blanco con opacidad
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: '100%',
  },
  casaNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333', // Color del texto
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});
