import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, TextInput, Button, Alert } from 'react-native';
import { BASE_URL } from '../../config';
import { EditarUsuarioScreen } from './usuario/EditarUsuarioScreen';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export const UsuariosScreen = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [casas, setCasas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [statusCasa, setStatusCasa] = useState('activo');
  const [selectedCasa, setSelectedCasa] = useState('');
  const [modalVisible2, setModalVisible2] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    obtenerUsuarios();
    obtenerCasas();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/usuarios`);
      const data = await response.json();
      setUsuarios(data.usuarios);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const obtenerCasas = async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/casas`);
      const data = await response.json();
      setCasas(data.casas);
    } catch (error) {
      console.error('Error al obtener casas:', error);
    }
  };

  const crearUsuario = async () => {
    try {
      const data = {
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        fechaNacimiento,
        usuario,
        contrasena,
        statusCasa,
        selectedCasa
      };

      const responseUsuarioCreate = await axios.post(`${BASE_URL}/admin/usuario/create`, data, {
        headers: { "Content-Type": "application/json" }
      });
      obtenerUsuarios();
      if (responseUsuarioCreate.status === 200) {
        alert('Se creó correctamente el usuario');
      } else {
        // Procesar otros códigos de estado si es necesario
      }

      setModalVisible(false);
    } catch (error) {
      console.error('Error al crear usuario:', error);
    }
  };

  const refrescarUsuarios = () => {
    obtenerUsuarios();
  };

  const handleActionButton = async (userId, status) => {
    if (status === 2) {
      // Lógica para activar el usuario
      await activarUsuario(userId);
    } else {
      // Lógica para eliminar el usuario
      await eliminarUsuario(userId);
    }
  };

  const handleEditarUsuario = (userId) => {
    setSelectedUserId(userId);
    setModalVisible2(true);
  };

  const eliminarUsuario = async (userId) => {
    console.log(userId);
    try {
      const response = await axios.put(`${BASE_URL}/admin/usuario/update/status/${userId}`);
      if (response.status === 200) {
        obtenerUsuarios();
        alert('Usuario eliminado correctamente');
      } else {
        // Handle other status codes if needed
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  const activarUsuario = async (userId) => {
    try {
      const response = await axios.put(`${BASE_URL}/admin/usuario/activate/${userId}`);

      if (response.status === 200) {
        obtenerUsuarios();
        console.log(`Usuario con ID ${userId} activado correctamente`);
        Alert.alert('Éxito', 'Usuario activado correctamente');
      } else {
        console.error(`Error al activar usuario con ID ${userId}: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error al activar usuario con ID ${userId}:`, error);
    }
  };

  const onChangeFechaNacimiento = (event, selectedDate) => {
    const currentDate = selectedDate || fechaNacimiento;
    setShowDatePicker(Platform.OS === 'ios');
    setFechaNacimiento(currentDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Bienvenido a mi aplicación</Text>
      <Text style={styles.subtitulo}>Lista de Usuarios:</Text>
      <Button title="Refrescar Usuarios" onPress={refrescarUsuarios} />
      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.usuarioItem}>
            <Text style={styles.usuarioNombre}>{item.nombre} {item.apellidopaterno} {item.apellidomaterno}</Text>
            <Text style={styles.usuarioEdad}>Edad: {item.fechanacimiento}</Text>
            <Text style={styles.usuarioEdad}>Casa residencial: {item.Casa.nombrecasa}</Text>
            <View style={styles.botonesContainer}>
              <Button title="Editar" onPress={() => handleEditarUsuario(item.idUsuario)} />
              <Button title={item.status === 2 ? 'Activar' : 'Eliminar'} onPress={() => handleActionButton(item.idUsuario, item.status)} />
            </View>
          </View>
        )}
      />
      <EditarUsuarioScreen visible={modalVisible2} onClose={() => setModalVisible2(false)} userId={selectedUserId} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Crear Nuevo Usuario</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={nombre}
              onChangeText={setNombre}
            />
            <TextInput
              style={styles.input}
              placeholder="Apellido Paterno"
              value={apellidoPaterno}
              onChangeText={setApellidoPaterno}
            />
            <TextInput
              style={styles.input}
              placeholder="Apellido Materno"
              value={apellidoMaterno}
              onChangeText={setApellidoMaterno}
            />
            <View style={styles.input}>
              <Button title="Seleccionar Fecha de Nacimiento" onPress={() => setShowDatePicker(true)} />
              {showDatePicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={fechaNacimiento}
                  mode="date"
                  display="default"
                  onChange={onChangeFechaNacimiento}
                />
              )}
            </View>
            <TextInput
              style={styles.input}
              placeholder="Usuario"
              value={usuario}
              onChangeText={setUsuario}
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              value={contrasena}
              onChangeText={setContrasena}
              secureTextEntry={true}
            />
            <View style={styles.selectContainer}>
              <Text style={styles.selectLabel}>Status Casa:</Text>
              <Picker
                style={styles.select}
                selectedValue={statusCasa}
                onValueChange={(itemValue) => setStatusCasa(itemValue)}
              >
                <Picker.Item label="Activo" value="activo" />
                <Picker.Item label="Baja" value="baja" />
              </Picker>
            </View>
            <View style={styles.selectContainer}>
              <Text style={styles.selectLabel}>Seleccionar Casa:</Text>
              <Picker
                style={styles.select}
                selectedValue={selectedCasa}
                onValueChange={(itemValue) => setSelectedCasa(itemValue)}
              >
                <Picker.Item label="Selecciona una casa" value="0" />
                {casas.map((casa) => (
                  <Picker.Item
                    key={casa.idCasa}
                    label={casa.nombrecasa}
                    value={casa.idCasa}
                  />
                ))}
              </Picker>
            </View>
            <Button
              title="Crear Usuario"
              onPress={crearUsuario}
            />
          </View>
        </View>
      </Modal>
      <Button
        title="Crear Nuevo Usuario"
        onPress={() => setModalVisible(true)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 18,
    marginBottom: 10,
  },
  usuarioItem: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  usuarioNombre: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  usuarioEdad: {
    fontSize: 14,
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
  selectContainer: {
    marginBottom: 10,
  },
  selectLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  select: {
    width: '100%',
    padding: 10,
    borderRadius: 5,
  },
});
