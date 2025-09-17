import React, { useState, useRef } from 'react';
import { Text, View, StyleSheet, Button, Alert, SafeAreaView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScannerStackParamList } from '../App';
import { extractProductIdFromUrl } from '../data/products';

type ScannerNavigationProp = StackNavigationProp<ScannerStackParamList, 'Scanner'>;

const ScannerScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const scannedRef = useRef(false);
  const [permission, requestPermission] = useCameraPermissions();
  const navigation = useNavigation<ScannerNavigationProp>();

  React.useEffect(() => {
    if (permission?.granted) {
      setHasPermission(true);
    } else if (permission?.granted === false) {
      setHasPermission(false);
    }
  }, [permission]);

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scannedRef.current) return; // Prevent duplicate scans
    
    scannedRef.current = true;
    setScanned(true);
    
    console.log('Scanned URL:', data); // Debug log
    
    // Extract product ID from the scanned URL
    const productId = extractProductIdFromUrl(data);
    console.log('Extracted Product ID:', productId); // Debug log
    
    if (productId && productId >= 1 && productId <= 20) {
      // Navigate to ProductDetail with the scanned URL
      navigation.navigate('ProductDetail', { 
        productUrl: data,
        productId: productId 
      });
      
      // Reset scanner after navigation
      setTimeout(() => {
        scannedRef.current = false;
        setScanned(false);
      }, 1000);
    } else {
      // Show alert if URL doesn't contain valid product ID
      Alert.alert(
        'Invalid QR Code',
        `URL: ${data}\n\nThis QR code doesn't contain a valid product ID (1-20).`,
        [
          {
            text: 'OK',
            onPress: resetScanner,
          },
        ]
      );
    }
  };

  const resetScanner = () => {
    scannedRef.current = false;
    setScanned(false);
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.text}>We need your permission to show the camera</Text>
          <Button onPress={requestPermission} title="Grant Permission" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CameraView
        style={styles.camera}
        onBarcodeScanned={scannedRef.current ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'], // Only scan QR codes as required
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.scanArea}>
            <Text style={styles.scanText}>
              {scanned ? 'QR Code Scanned!' : 'Point camera at QR code'}
            </Text>
          </View>
          
          {scanned && (
            <View style={styles.buttonContainer}>
              <Button title="Scan Again" onPress={resetScanner} color="#007AFF" />
            </View>
          )}
        </View>
      </CameraView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  scanText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

export default ScannerScreen;