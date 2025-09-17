import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

const WebViewScreen = () => {
  const [url, setUrl] = useState('https://expo.dev');
  const [currentUrl, setCurrentUrl] = useState('https://expo.dev');
  const [loading, setLoading] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  const handleLoadStart = () => {
    setLoading(true);
  };

  const handleLoadEnd = (syntheticEvent: any) => {
    setLoading(false);
    const { nativeEvent } = syntheticEvent;
    const loadedUrl = nativeEvent.url || currentUrl;
    
    setCanGoBack(nativeEvent.canGoBack || false);
    setCanGoForward(nativeEvent.canGoForward || false);
    
    // Show alert similar to Week 8.2 example
    Alert.alert('Page Loaded', `Loaded: ${loadedUrl}`);
  };

  const handleNavigationStateChange = (navState: any) => {
    setCanGoBack(navState.canGoBack || false);
    setCanGoForward(navState.canGoForward || false);
    if (navState.url) {
      setCurrentUrl(navState.url);
    }
  };

  const handleLoadUrl = () => {
    // Validate URL format
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }
    setCurrentUrl(formattedUrl);
  };

  const goBack = () => {
    if (webViewRef.current && canGoBack) {
      webViewRef.current.goBack();
    }
  };

  const goForward = () => {
    if (webViewRef.current && canGoForward) {
      webViewRef.current.goForward();
    }
  };

  const reload = () => {
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  const webViewRef = React.useRef<WebView>(null);

  return (
    <SafeAreaView style={styles.container}>
      {/* URL Input Section */}
      <View style={styles.urlContainer}>
        <TextInput
          style={styles.urlInput}
          value={url}
          onChangeText={setUrl}
          placeholder="Enter URL (e.g., expo.dev)"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />
        <TouchableOpacity style={styles.goButton} onPress={handleLoadUrl}>
          <Text style={styles.goButtonText}>Go</Text>
        </TouchableOpacity>
      </View>

      {/* Navigation Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={[styles.navButton, !canGoBack && styles.disabledButton]} 
          onPress={goBack}
          disabled={!canGoBack}
        >
          <Text style={[styles.navButtonText, !canGoBack && styles.disabledText]}>← Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, !canGoForward && styles.disabledButton]} 
          onPress={goForward}
          disabled={!canGoForward}
        >
          <Text style={[styles.navButtonText, !canGoForward && styles.disabledText]}>Forward →</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navButton} onPress={reload}>
          <Text style={styles.navButtonText}>↻ Reload</Text>
        </TouchableOpacity>
      </View>

      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}

      {/* Current URL Display */}
      <View style={styles.currentUrlContainer}>
        <Text style={styles.currentUrlText} numberOfLines={1}>
          {currentUrl}
        </Text>
      </View>

      {/* WebView */}
      <WebView
        ref={webViewRef}
        source={{ uri: currentUrl }}
        style={styles.webview}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onNavigationStateChange={handleNavigationStateChange}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          Alert.alert('Error', `Failed to load: ${nativeEvent.description}`);
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        allowsBackForwardNavigationGestures={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  urlContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  urlInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    fontSize: 16,
  },
  goButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 5,
  },
  goButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  controlsContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    justifyContent: 'space-around',
  },
  navButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#f5f5f5',
  },
  navButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  disabledText: {
    color: '#999',
  },
  loadingContainer: {
    backgroundColor: '#ffffcc',
    padding: 5,
    alignItems: 'center',
  },
  loadingText: {
    color: '#666',
    fontSize: 14,
  },
  currentUrlContainer: {
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  currentUrlText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  webview: {
    flex: 1,
  },
});

export default WebViewScreen;