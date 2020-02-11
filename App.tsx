import React, { useState, useEffect } from 'react';
import MainView from './components/views/MainView/MainView';
import { StyleSheet, Button, Text, View, TouchableOpacity, Image } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import BaseUrl from './api/BaseUrl';
import CameraAPI from './api/CameraAPI';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [hostIP, setHostIP] = useState('');
  const [scanned, setScanned] = useState(true);
  const [hasHostIP, setHasHostIP] = useState(false);
  const [isCamera, setIsCamera] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [needFlash, setNeedFlash] = useState(Camera.Constants.FlashMode.torch);
  const [camera, setCamera] = useState();
  const [isTakedPhoto, setIsTakedPhoto] = useState(false);
  const [takedPhoto, setTakedPhoto] = useState();

  // let camera = React.createRef();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const openScanReader = () => {
    setScanned(false);
  }

  const openCamera = () => {
    setIsTakedPhoto(false);
    setIsCamera(true);
  }

  const takePicture = () => {
    if (camera) {
      camera.takePictureAsync({ quality: 0, onPictureSaved: onPictureSaved, base64: true, exif: true });
    }
  };

  const onPictureSaved = photo => {
    setIsCamera(false);
    setIsTakedPhoto(true);
    setTakedPhoto(photo);
    console.log(photo.exif);
    CameraAPI.setPhotoCommandState(photo.base64);
    
    // console.log(photo.base64);
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setHasHostIP(true);
    BaseUrl.url = 'http://' + data + '/';
    setHostIP(data);
  };

  if (isCamera) {
    return (
      <View style={{ flex: 1 }}>
        <Camera style={{ flex: 1 }} type={type} flashMode={needFlash} autoFocus={true} ref={(ref) => { setCamera(ref) }}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              style={{
                flex: 1,
                alignSelf: 'flex-end',
                alignItems: 'center',
              }}
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}>
              <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> камера </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                alignSelf: 'flex-end',
                alignItems: 'center',
              }}
              onPress={() => {
                takePicture();
              }}>
              <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> снять </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                alignSelf: 'flex-end',
                alignItems: 'center',
              }}
              onPress={() => {
                setIsCamera(false);
              }}>
              <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> выйти </Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    );
  }

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  let button = <Button title={ isTakedPhoto ? 'переснять фотографию' : 'сделать фотографию' } onPress={() => openCamera()} />;
  if (!hasHostIP) {
    button = <Button title={'сканировать код'} onPress={() => openScanReader()} />;
  }

  let pictureBox;
  if (isTakedPhoto) {
    pictureBox = <Image resizeMode={'stretch'} style={styles.pictureBox} source={takedPhoto} />
  }

  if (!scanned) {
    return <BarCodeScanner
      onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      style={StyleSheet.absoluteFillObject}
    />
  }

  return (
    <View style={styles.container}>
      <View style={styles.mainViewWrapper}>
        <Text style={{ paddingBottom: '5%', marginTop: '3%' }}>Адрес приложения А100: {hostIP}</Text>
        {button}
        {pictureBox}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: '10%',
    flex: 1,
    // flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  mainViewWrapper: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    // backgroundColor: 'green'
  },
  scanButton: {
    width: '100%'
  },
  pictureBox: {
    flex: 1,
    width: '100%',
    marginTop: '5%'
  }
});
