# Quick Start Guide

Get your wireless steak probe prototype running this weekend.

## What You Need

### Hardware
- [x] nRF52840 dev board (you have this!)
- [ ] FireBoard 1" Competition probe - [Order here](https://ddrbbqsupply.com/products/fireboard-competition-series-1-inch-short-probe)
- [ ] 100K ohm resistor (from your stockpile)
- [ ] 2.5mm audio jack (male + female pair)
- [ ] Soldering iron + solder
- [ ] Wire cutters
- [ ] Heat shrink tubing
- [ ] 3D printer (optional, for housings)

### Software
- [ ] PlatformIO or Arduino IDE
- [ ] Node.js 18+
- [ ] Android Studio or Xcode
- [ ] Physical Android/iOS device

## Friday Night: Hardware Assembly

### Step 1: Prepare the Probe (30 min)

1. **Cut FireBoard cable**
   - Cut off the stock 2.5mm jack from probe
   - Leave ~2" of wire attached to probe
   - Strip wire ends (~5mm)

2. **Solder 2.5mm male jack to probe**
   ```
   Probe wire → 2.5mm male jack
   (Red/+)   → Tip
   (Black/-) → Sleeve
   ```

3. **Add heat shrink**
   - Cover solder joints
   - Heat to shrink tight
   
✅ **Test:** Use multimeter to check continuity through jack

### Step 2: Wire the nRF Module (30 min)

1. **Connect components on breadboard first:**
   ```
   nRF52840 Board
   ├─ 3.3V ──[100K resistor]── A0 ──[Thermistor]── GND
   └─ GND ────────────────────────┴─────────────────┘
   ```

2. **Add female 2.5mm jack:**
   - Jack tip → ADC junction (between resistor & thermistor)
   - Jack sleeve → GND

3. **Test resistance:**
   - Plug probe into jack
   - Measure resistance across thermistor terminals
   - Should be ~100K at room temp (~75°F)

✅ **Test:** Pinch probe tip → resistance should drop (temp increases)

## Saturday Morning: Software Setup

### Firmware Flash (1 hour)

1. **Install PlatformIO**
   ```bash
   pip install platformio
   ```

2. **Clone this repo**
   ```bash
   git clone https://github.com/johnohhh1/steak-probe-wireless
   cd steak-probe-wireless/firmware
   ```

3. **Build and upload**
   ```bash
   pio run -t upload
   pio device monitor -b 115200
   ```

4. **Verify serial output**
   ```
   Wireless Steak Probe - Starting...
   Temperature: 72.3 °F
   Temperature: 72.5 °F
   ```

✅ **Test:** Temperature reading should be close to room temp

### Calibrate (30 min)

1. **Ice water test:**
   - Fill cup with ice water
   - Insert probe, wait 60 seconds
   - Should read 32°F ±2°F

2. **If off by >5°F:**
   - Adjust Steinhart-Hart coefficients in `firmware/src/main.cpp`
   - Reflash firmware
   - Retest

✅ **Test:** Ice water = 32°F, room temp = ambient temp

## Saturday Afternoon: Mobile App

### Build Android App (2 hours)

1. **Install dependencies**
   ```bash
   cd mobile-app
   npm install
   ```

2. **Enable developer mode on phone:**
   - Settings → About → Tap "Build number" 7 times
   - Settings → Developer Options → Enable USB Debugging

3. **Connect phone via USB**
   ```bash
   adb devices  # Should list your phone
   ```

4. **Run app**
   ```bash
   npm run android
   ```

5. **Test BLE scanning**
   - Tap "Scan for Probes"
   - Should find "SteakProbe-01"
   - Tap to connect
   - Temperature should display

✅ **Test:** App shows live temperature from probe

## Saturday Evening: First Live Test

### Steak Test in a Real Kitchen

1. **Bring to work:**
   - Probe + module (assembled)
   - Phone with app
   - Backup CR2032 battery if using battery-powered module

2. **Setup:**
   - Start app, scan, connect to probe
   - Set target temp (135°F for med-rare)

3. **Test cook:**
   - Insert probe in 1" thick steak
   - Put on flat top
   - Watch temp climb in app

4. **Validate:**
   - Does temp match Thermapen spot check?
   - Does alert fire at 135°F?
   - Does probe stay connected?

5. **Test edge cases:**
   - Walk to QA line (15ft) - stays connected?
   - Near microwave - any interference?
   - Multiple steaks - need multiple probes? (v0.2 feature)

## Troubleshooting

### Firmware won't upload
- Double-tap reset button on board (bootloader mode)
- Check USB cable
- Try different USB port

### Temperature reading is wrong
- **Too high/low:** Check resistor value (100K?)
- **Noisy:** Increase NUM_SAMPLES in firmware
- **Stuck:** Check wiring, resolder joints

### App can't find probe
- Check probe is powered (LED blinking?)
- Grant location permission on Android
- Make sure Bluetooth is on
- Try nRF Connect app to verify probe is advertising

### App connects but no temperature
- Check serial monitor - firmware sending data?
- Verify characteristic UUID matches (0x2A1C)
- Check BLE notification is enabled

## Success Criteria

- [x] Probe reads accurate temperature (±2°F)
- [x] BLE connects from phone
- [x] App displays temperature in real-time
- [x] Target temp alert works
- [x] Works at 15ft range (flat top to QA)
- [x] No interference from kitchen equipment
- [ ] Multi-probe support (v0.2)

## Next Steps

### Week 2: Refinement
- Test EMI near induction/microwave
- Optimize battery life (lower TX power)
- Add multiple probe support
- Temperature history graph

### Week 3: Production Planning
- Design custom PCB (smaller form factor)
- 3D model injection-molded housing
- Contact MG for miniaturization advice
- Source manufacturers in Shenzhen

### Month 2: Pilot Production
- Order 100 units for testing
- Test in more restaurant kitchens
- Gather feedback from managers
- Refine design based on real use

## Questions?

Open an issue on GitHub or reach out directly.

**Let's ship this! 🥩🔥**
