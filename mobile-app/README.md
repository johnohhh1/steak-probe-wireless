# Mobile App - React Native

React Native mobile application for monitoring wireless steak probe temperature via BLE.

## Features

- 🔍 BLE device scanning and auto-discovery
- 📱 Real-time temperature monitoring
- 🎯 Target temperature alerts (Rare, Medium-Rare, Medium, etc.)
- 📊 Visual temperature display with color-coded doneness
- 🔔 Push notifications when target temp reached
- 📈 Temperature history graphing (coming soon)
- 🔢 Multi-probe support (coming soon)

## Prerequisites

- Node.js 18+ 
- React Native development environment
- Android Studio (for Android) or Xcode (for iOS)
- Physical Android/iOS device (BLE doesn't work well in emulators)

## Setup

### 1. Install Dependencies

```bash
cd mobile-app
npm install
```

### 2. Install CocoaPods (iOS only)

```bash
cd ios
pod install
cd ..
```

### 3. Android Permissions

The app requires the following permissions (automatically requested):
- `BLUETOOTH_SCAN`
- `BLUETOOTH_CONNECT`
- `ACCESS_FINE_LOCATION`

These are defined in `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.BLUETOOTH"/>
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN"/>
<uses-permission android:name="android.permission.BLUETOOTH_SCAN"/>
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT"/>
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
```

### 4. iOS Permissions

Add to `ios/SteakProbeApp/Info.plist`:

```xml
<key>NSBluetoothAlwaysUsageDescription</key>
<string>This app needs Bluetooth to connect to your steak probe</string>
<key>NSBluetoothPeripheralUsageDescription</key>
<string>This app needs Bluetooth to connect to your steak probe</string>
```

## Running the App

### Android

```bash
# Start Metro bundler
npm start

# In another terminal, run on Android
npm run android
```

### iOS

```bash
# Start Metro bundler
npm start

# In another terminal, run on iOS
npm run ios
```

## Usage

### Scanning for Devices

1. Tap **"Scan for Probes"** button
2. App will scan for 10 seconds
3. Any device with "SteakProbe" in the name will appear

### Connecting

1. Tap on a discovered device
2. App will connect and start receiving temperature
3. Temperature updates every 2 seconds

### Setting Target Temperature

Three quick-select buttons:
- **RARE:** 125°F
- **MED-RARE:** 135°F  
- **MEDIUM:** 145°F

Alert triggers when temp reaches ±2°F of target.

### Temperature Color Coding

- 🔵 **Blue** (< 120°F): Rare
- 🔴 **Red** (120-130°F): Medium-Rare
- 🟠 **Orange** (130-140°F): Medium
- 🟡 **Yellow** (140-150°F): Medium-Well
- ⚫ **Gray** (150°F+): Well Done

## Architecture

### BLE Communication

```javascript
// Service UUID (Health Thermometer)
const TEMP_SERVICE_UUID = '1809';

// Characteristic UUID (Temperature Measurement)
const TEMP_CHAR_UUID = '2A1C';

// Temperature format: uint32 * 100
// Example: 13500 = 135.00°F
```

### Data Flow

```
[Probe] → BLE Notification → App Listener → State Update → UI Render
```

### State Management

```javascript
const [devices, setDevices] = useState([]);        // Discovered devices
const [connectedDevice, setConnectedDevice] = useState(null);
const [temperature, setTemperature] = useState(null);
const [targetTemp, setTargetTemp] = useState(145);
```

## Troubleshooting

### Android: "Location permission required"
- Android requires location permission for BLE scanning
- Grant permission when prompted
- If denied, go to Settings → Apps → Permissions → Location

### iOS: App crashes on BLE scan
- Check Info.plist has Bluetooth usage descriptions
- Rebuild app: `cd ios && pod install && cd .. && npm run ios`

### "No devices found"
- Make sure probe is powered on
- Check probe is advertising (LED should blink)
- Try moving phone closer to probe
- Check probe name includes "SteakProbe"

### Temperature not updating
- Check BLE connection is active (device should show "Connected")
- Verify notifications are enabled
- Check firmware is sending correct characteristic UUID

### App won't connect to device
- Make sure only one device is trying to connect
- Restart probe (power cycle)
- Clear app data and restart
- Check phone Bluetooth is enabled

## Development

### Debug Mode

```bash
# Enable React Native debugger
npm start -- --reset-cache

# View logs
npx react-native log-android
# or
npx react-native log-ios
```

### BLE Debugging

Use a BLE scanner app to verify probe is advertising:
- **Android:** nRF Connect
- **iOS:** LightBlue

Check for:
- Device name: "SteakProbe-XX"
- Service UUID: 1809
- Characteristic UUID: 2A1C

## Building for Production

### Android APK

```bash
cd android
./gradlew assembleRelease
# Output: android/app/build/outputs/apk/release/app-release.apk
```

### Android App Bundle (Google Play)

```bash
cd android
./gradlew bundleRelease
# Output: android/app/build/outputs/bundle/release/app-release.aab
```

### iOS (TestFlight/App Store)

```bash
# Open Xcode
open ios/SteakProbeApp.xcworkspace

# Product → Archive
# Follow Xcode distribution wizard
```

## Future Features

### v0.2 - Temperature History
- [ ] Line chart of temperature over time
- [ ] Export data as CSV
- [ ] Session recording (start/stop)

### v0.3 - Multi-Probe Support
- [ ] Connect to multiple probes simultaneously
- [ ] Grid view of all active probes
- [ ] Individual target temps per probe
- [ ] Cook timer integration

### v0.4 - Kitchen Integration
- [ ] Kitchen display system (KDS) integration
- [ ] REST API for remote monitoring
- [ ] Webhook alerts to Slack/Discord
- [ ] Print station integration

### v0.5 - Advanced Features
- [ ] Cook profiles (save temps/times)
- [ ] Sous vide mode (maintain temp)
- [ ] Predictive time-to-target
- [ ] Historical analytics

## Performance

### Battery Impact
- BLE scanning: High (continuous radio use)
- Connected: Low (notifications are efficient)
- Background: Minimal (BLE state preserved)

### Optimization Tips
```javascript
// Reduce scan time
BleManager.scan([], 5, true); // 5 seconds instead of 10

// Increase connection interval
BleManager.connect(deviceId, { connectionPriority: 2 }); // Low power
```

## Testing

### Manual Test Cases

1. **Device Discovery**
   - ✅ Finds probe within 10 seconds
   - ✅ Shows device name correctly
   - ✅ Filters out non-probe devices

2. **Connection**
   - ✅ Connects on first tap
   - ✅ Shows connection status
   - ✅ Handles connection failures gracefully

3. **Temperature Reading**
   - ✅ Updates every 2 seconds
   - ✅ Accurate within ±2°F
   - ✅ Color changes appropriately

4. **Alerts**
   - ✅ Fires at target temp
   - ✅ Only fires once per cook
   - ✅ Works in background

5. **Disconnection**
   - ✅ Manual disconnect works
   - ✅ Auto-reconnect on signal loss
   - ✅ Handles probe power-off

## License
MIT - See LICENSE file
