# Firmware - nRF52840

Embedded firmware for the wireless steak probe using nRF52840 BLE SoC.

## Hardware Requirements

### Supported Boards
- Adafruit Feather nRF52840 Express
- Particle Xenon
- Arduino Nano 33 BLE
- Custom PCB (production)

### Circuit

```
     3.3V
       │
       ├── [100K Resistor]
       │
       ├─── ADC Pin (A0)
       │
       ├── [100K NTC Thermistor]
       │
      GND
```

**Connections:**
- **ADC Pin:** Connect to A0 (or analog pin of choice)
- **VDD:** 3.3V from board regulator
- **GND:** Common ground

## Software Setup

### Option 1: PlatformIO (Recommended)

1. **Install PlatformIO**
   ```bash
   # Via pip
   pip install platformio
   
   # Or install VS Code + PlatformIO extension
   ```

2. **Clone and Build**
   ```bash
   cd firmware
   pio run
   ```

3. **Upload to Board**
   ```bash
   # Auto-detect port and upload
   pio run -t upload
   
   # Monitor serial output
   pio device monitor
   ```

### Option 2: Arduino IDE

1. **Install Adafruit nRF52 BSP**
   - File → Preferences → Additional Board Manager URLs
   - Add: `https://adafruit.github.io/arduino-board-index/package_adafruit_index.json`
   - Tools → Board → Boards Manager → Search "nRF52" → Install "Adafruit nRF52"

2. **Install Libraries**
   - Sketch → Include Library → Manage Libraries
   - Search and install:
     - Adafruit BluefruitLE nRF51
     - Adafruit Bluefruit nRF52 Libraries

3. **Configure Board**
   - Tools → Board → Adafruit Feather nRF52840 Express
   - Tools → Port → (select your board's port)

4. **Upload**
   - Open `src/main.cpp` (rename to `.ino` if needed)
   - Sketch → Upload

## Configuration

### Adjust Temperature Sampling

```cpp
#define SAMPLE_INTERVAL 2000  // Milliseconds between readings
#define NUM_SAMPLES 10        // Number of ADC samples to average
```

### Calibrate Thermistor Coefficients

Use the Steinhart-Hart calculator: https://www.thinksrs.com/downloads/programs/therm%20calc/ntccalibrator/ntccalculator.html

1. Measure resistance at 3 known temperatures:
   - Ice water (0°C / 32°F)
   - Room temp (~25°C / 77°F)
   - Boiling water (100°C / 212°F)

2. Update constants in firmware:
```cpp
#define STEINHART_A 0.001129148
#define STEINHART_B 0.000234125
#define STEINHART_C 0.0000000876741
```

### Adjust BLE TX Power

```cpp
Bluefruit.setTxPower(4);  // Range: -40 to +8 dBm
```

**Power vs Range:**
- `-8 dBm` → ~30ft, excellent battery life
- `0 dBm` → ~50ft, good battery life
- `+4 dBm` → ~100ft, moderate battery life
- `+8 dBm` → ~200ft, reduced battery life

For restaurant use (15ft), recommend `-8 dBm` or `0 dBm`.

## BLE Service/Characteristics

### Health Thermometer Service
- **Service UUID:** `0x1809`
- **Characteristic UUID:** `0x2A1C` (Temperature Measurement)
- **Format:** 4-byte unsigned integer (temperature × 100)
  - Example: `13500` = 135.00°F

### Reading Temperature
```javascript
// In mobile app
const tempRaw = characteristic.value[0] | 
                (characteristic.value[1] << 8) | 
                (characteristic.value[2] << 16) | 
                (characteristic.value[3] << 24);
const temperatureF = tempRaw / 100.0;
```

## Testing

### Serial Monitor Test

```bash
pio device monitor -b 115200
```

**Expected Output:**
```
Wireless Steak Probe - Starting...
Initializing BLE...
Configuring Temperature Service...
Ready! Waiting for connection...
Temperature: 72.3 °F
Temperature: 72.5 °F
Connected to: Android Phone
Temperature: 135.2 °F
Temperature: 136.1 °F
```

### Ice Water Test (Calibration)
1. Put probe in ice water (32°F)
2. Wait 1 minute for stabilization
3. Should read 32°F ±2°F

### Boiling Water Test (Calibration)
1. Put probe in boiling water (212°F at sea level)
2. Wait 30 seconds
3. Should read 212°F ±2°F (adjust for altitude)

## Troubleshooting

### "Device not found" when uploading
- Press reset button twice quickly (bootloader mode)
- Check USB cable (some are charge-only)
- Verify board selection in IDE/PlatformIO

### Temperature reads way too high/low
- Check resistor value (should be 100K)
- Verify thermistor is 100K NTC
- Check wiring (resistor → ADC → thermistor → GND)
- Recalibrate Steinhart-Hart coefficients

### BLE won't connect
- Check device name in mobile app
- Verify phone has location/BLE permissions
- Check TX power isn't too low
- Try different BLE scanner app for debugging

### Temperature readings are noisy
- Increase `NUM_SAMPLES` (more averaging)
- Add capacitor across thermistor (0.1µF)
- Check for loose connections
- Shield probe wire from EMI sources

## Battery Life Optimization

### Current Consumption
- **Active:** ~5mA @ 0dBm TX power
- **Connected idle:** ~2mA
- **Sleep:** ~50µA (not implemented yet)

### Estimated Battery Life
- CR2032 (220mAh): ~44 hours continuous
- LiPo 150mAh: ~30 hours continuous
- With sleep mode: 2-4 weeks

### Future Sleep Implementation
```cpp
// Put CPU to sleep between readings
sd_power_mode_set(NRF_POWER_MODE_LOWPWR);
delay(SAMPLE_INTERVAL);
```

## Production Considerations

### Custom PCB
- Move from dev board to custom nRF52840 module
- Smaller form factor (40x25mm target)
- Integrated LiPo charger (MCP73831)
- USB-C for charging
- Status LEDs

### EMI Testing
- Test near induction cooktop (strong EMI source)
- Test near microwave (2.4GHz interference)
- Add shielding if needed

### Manufacturing
- JLCPCB or similar for PCB + SMT assembly
- Pre-flash firmware before shipping
- Include calibration step in QC

## License
MIT - See LICENSE file
