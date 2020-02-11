import React, { useState, useEffect } from 'react';
import { StyleSheet, Button, Text, View } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

import MainViewProps from './../../../models/components/MainView/MainViewProps';
import MainViewState from './../../../models/components/MainView/MainViewState';
import CameraAPI from '../../../api/CameraAPI';
import PhotoCommandStateType from '../../../models/PhotoCommandStateType';
import PhotoCommandState from './../../../api/PhotoCommandState';


export default class MainView extends React.Component<MainViewProps, MainViewState> {

    constructor(props) {
        super(props);
        this.state = {
            hasPermission: null,
            scanned: false,
            hostIp: '192.168.50.97',
            photoCommandState: PhotoCommandState.state
        };
        this.setPhotoCommandState();
        console.log(this.state.photoCommandState);
    }

    setPhotoCommandState = async () => {
        let data = await CameraAPI.getPhotoCommandState();
        PhotoCommandState.state = data;
        this.setState({ photoCommandState: data });
        console.log(this.state.photoCommandState);
    }

    openScanReader() {
        console.log('opened scan reader!');
    }



    render() {
        return (
            <View style={styles.mainViewWrapper}>
                <Text>IP приложения: </Text>
                <Button title={'сканировать код'} onPress={() => this.openScanReader()} />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    mainViewWrapper: {
        flex: 1,
        alignItems: 'center',
        width: '100%',
        // backgroundColor: 'green'
    },
    scanButton: {
        width: '100%'
    }
});