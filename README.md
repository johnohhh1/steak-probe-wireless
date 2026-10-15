# 🥩 Wireless Steak Probe - Restaurant Grade

A modular, thin-profile wireless meat thermometer designed for commercial kitchens and thin cuts.

## The Problem
Existing wireless probes (Meater, ThermoWorks) are 4-5 inches long and thick, making them unsuitable for:
- 1-inch thick steaks
- High-volume restaurant service
- Quick temp checks at QA line
- Multi-probe monitoring

## The Solution
**Modular 2-piece design:**
- **Probe:** 1" x 1/16" diameter with 2.5mm audio jack
- **Module:** nRF52840 BLE radio with battery
- **Range:** 50-200ft (only need ~15ft in kitchen)
- **Cost:** Module ~$35-40, replacement probes ~$8-10

## Key Features
✅ Thin basketball-needle profile (1/16" diameter)  
✅ Replaceable probes (bent probe = cheap swap, not $50 replacement)  
✅ Multi-probe support (monitor 8+ steaks simultaneously)  
✅ Long battery life (optimized for short-range)  
✅ Designed with a working restaurant kitchen  

## Tech Stack
- **Hardware:** nRF52840 (BLE 5.0), 100K NTC thermistor
- **Firmware:** Arduino/PlatformIO (C/C++)
- **Mobile:** React Native (iOS/Android)
- **Range:** 200ft capable, optimized for 15-50ft
- **Power:** CR2032 or rechargeable LiPo

## Project Structure
```
steak-probe-wireless/
├── firmware/           # nRF52840 embedded code
│   ├── src/           # Main firmware source
│   └── platformio.ini # PlatformIO config
├── mobile-app/        # React Native app
│   └── src/           # App source code
├── hardware/          # PCB designs, schematics, BOMs
│   ├── cad/          # 3D printable housings
│   └── bom/          # Bill of materials
└── docs/             # Documentation
```

## Quick Start

### Firmware (nRF52840)
```bash
cd firmware
pio run -t upload
```

### Mobile App
```bash
cd mobile-app
npm install
npm run android  # or npm run ios
```

## Hardware Requirements

**Dev Board:** Adafruit Feather nRF52840 or similar  
**Probe:** FireBoard Competition Series 1" (100K thermistor) or equivalent  
**Resistor:** 100K ohm for voltage divider  
**Connector:** 2.5mm audio jack (male/female pair)  

**Circuit:**
```
3.3V → 100K resistor → ADC → Thermistor → GND
                        ↑
                   (measure here)
```

## Roadmap

### Phase 1: POC (This Week)
- [x] FireBoard probe ordered
- [ ] Solder prototype (probe + module)
- [ ] Flash basic firmware
- [ ] Build simple Android app
- [ ] Live test in a restaurant kitchen

### Phase 2: Refinement
- [ ] Calibration testing (ice water, boiling water)
- [ ] EMI testing (induction, microwave interference)
- [ ] Battery optimization
- [ ] Multi-probe coordination
- [ ] Kitchen display integration

### Phase 3: Production
- [ ] Custom PCB design
- [ ] Contact MG chemicals for miniaturization advice
- [ ] Manufacturer sourcing (Shenzhen)
- [ ] Injection-molded housings
- [ ] FCC/CE certification

## Business Model
- **Module:** $35-40 retail ($15-20 BOM)
- **Probe 3-pack:** $20-25 ($6 BOM)
- **Target:** Restaurant FOH managers, competition BBQ, home enthusiasts
- **Volume play:** Bulk sales to chains, subscription probe replacements

## Target Specs
- **Temp Range:** 0-572°F (-18-300°C)
- **Accuracy:** ±2°F
- **Response Time:** <3 seconds
- **Battery Life:** 2-4 weeks (CR2032)
- **BLE Range:** 50ft practical, 200ft max

## Contributing
This is an early proof of concept: the firmware and app are sketches, not finished products. Open an issue before big changes. Hardware test results (probe accuracy, range in a real kitchen) are especially welcome.

Built by restaurant operators who actually use this shit. PRs welcome.

## License
MIT - Build cool stuff, make money, don't be a dick.

