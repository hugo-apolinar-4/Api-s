import React, { useState, useEffect } from 'react';
import { View, Text, Modal, Button } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../../../config';

export const EditarUsuarioScreen = ({ visible, onClose, userId }) => {
  const [usuario, setUsuario] = useState(null); // Estado para almacenar los datos del usuario

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/usuario/${userId}`); // Petición para obtener los datos del usuario
        setUsuario(response.data); // Almacenar los datos del usuario en el estado
        console.log(usuario);
      } catch (error) {
        console.error('Error al obtener usuario:', error);
        // Aquí puedes manejar el error según tu lógica
      }
    };

    if (visible) {
      obtenerUsuario(); // Llamar a la función para obtener el usuario solo cuando el modal es visible
    }
  }, [visible, userId]);

  const actulizarUsuario = async () => {

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

    const responseUpdateUsuario = await axios.put(`${BASE_URL}/admin/usuario/update/`,{
      headers: { "Accept": "application/json, text/plain, /", "Content-Type": "multipart/form-data" },
      body: data
    })
    .then(res => {
        // console.log(res.data.message);
        if (res.status === 200) {
            Alert.alert(res.data.message);
        } else {
            Alert.alert(res.data.content)
        }
        AsyncStorage.removeItem('userInfo');
        setUserInfo({});
        setIsLoading(false);
    })
    .catch(e => {
        console.log(`logout error ${e}`);
        setIsLoading(false);
    });
  }

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10 }}>
          <Text>Editar Usuario: {userId}</Text>
          {usuario && (
            <>
              {/* Renderizar los campos para editar la información del usuario */}
              <Text>Nombre: {usuario.nombre}</Text>
              <Text>Apellido Paterno: {usuario.apellidopaterno}</Text>
              <Text>Apellido Materno: {usuario.apellidomaterno}</Text>
              {/* Agrega más campos según la estructura de datos del usuario */}
            </>
          )}
          <Button title="Cerrar" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};