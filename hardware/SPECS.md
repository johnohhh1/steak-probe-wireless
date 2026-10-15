# Hardware Specifications

## Probe Assembly

### Physical Specifications
- **Length:** 1 inch (28mm) insertion depth
- **Diameter:** 1/16 inch (1.8mm) 
- **Material:** 304 Stainless Steel
- **Cable Length:** 2 inches (prototype), 0 inches (production - direct mount)
- **Connector:** 2.5mm audio jack (TRS)

### Electrical Specifications
- **Sensor Type:** 100K NTC Thermistor
- **Resistance @ 25°C:** 100,000 Ω ±1%
- **Beta Value:** 3950K (typical for 100K NTC)
- **Temperature Range:** 0°F to 572°F (-18°C to 300°C)
- **Accuracy:** ±2°F (±1°C) typical
- **Response Time:** <3 seconds to 63% of final value

### Connector Pinout (2.5mm TRS)
```
   Tip ──────── Thermistor (+)
   Ring ──────── Not Connected
   Sleeve ────── Thermistor (-)
```

## Module Assembly

### Microcontroller
- **MCU:** Nordic nRF52840
- **CPU:** ARM Cortex-M4F @ 64 MHz
- **Flash:** 1 MB
- **RAM:** 256 KB
- **Wireless:** Bluetooth 5.0 (BLE)
- **Range:** 200ft open air, 50ft+ in kitchen
- **Power:** 3.3V nominal

### ADC Specifications
- **Resolution:** 12-bit (0-4095)
- **Input Range:** 0-3.3V
- **Sampling Rate:** Configurable (default: 0.5 Hz / 2 seconds)
- **Samples per Reading:** 10 (averaged)
- **Input Impedance:** >100 MΩ

### Power System

#### Prototype (Dev Board)
- **Battery:** Integrated LiPo (varies by board)
- **Capacity:** 100-500 mAh typical
- **Voltage:** 3.7V nominal
- **Charging:** USB (500mA)

#### Production
- **Battery:** 150mAh 3.7V LiPo
- **Charger IC:** MCP73831 (500mA)
- **Protection:** Overcharge, over-discharge, short circuit
- **Connector:** USB-C
- **Charge Time:** ~30 minutes (80%), ~45 minutes (100%)

### Power Consumption
- **Active (TX @ 0dBm):** 5-7 mA
- **Connected Idle:** 2-3 mA
- **Advertising:** 3-5 mA
- **Sleep (future):** 50 µA

### Battery Life Estimates
| Mode | Current | Battery | Duration |
|------|---------|---------|----------|
| Continuous (no sleep) | 5 mA | 150 mAh LiPo | ~30 hours |
| Continuous (no sleep) | 5 mA | CR2032 (220 mAh) | ~44 hours |
| With sleep (future) | 0.5 mA avg | 150 mAh LiPo | ~300 hours (12.5 days) |
| With sleep (future) | 0.5 mA avg | CR2032 | ~440 hours (18 days) |

### BLE Radio
- **Standard:** Bluetooth 5.0
- **Frequency:** 2.4 GHz ISM band
- **Channels:** 40 (3 advertising, 37 data)
- **TX Power:** -40 to +8 dBm (adjustable)
- **Recommended TX Power:** 0 dBm (50ft range, good battery life)
- **Antenna:** Chip antenna or PCB trace antenna
- **Connection Interval:** 100-200 ms

### Analog Front End

#### Voltage Divider Circuit
```
    VDD (3.3V)
        │
        ├── R1 (100K) ─┬─── ADC Input (nRF52840 A0)
        │              │
        └──────────────┴─── Thermistor (100K @ 25°C)
                       │
                      GND
```

#### Voltage Calculation
```
V_adc = VDD × (R_thermistor / (R1 + R_thermistor))
```

#### Resistance Calculation
```
R_thermistor = R1 × (V_adc / (VDD - V_adc))
```

#### Temperature Calculation (Steinhart-Hart)
```
1/T = A + B×ln(R) + C×ln(R)³

Where:
  T = Temperature in Kelvin
  R = Resistance in Ohms
  A, B, C = Calibration coefficients
  
Default coefficients (100K NTC):
  A = 0.001129148
  B = 0.000234125  
  C = 0.0000000876741
```

## PCB Design (Production)

### Physical
- **Dimensions:** 40mm × 25mm × 8mm
- **Layers:** 2-layer FR4
- **Thickness:** 1.6mm
- **Finish:** ENIG (gold plating)
- **Color:** Black solder mask
- **Silkscreen:** White

### Components
- **MCU:** nRF52840 (QFN-48 package)
- **Antenna:** 2.4GHz chip antenna or PCB trace
- **Battery Connector:** JST-PH 2-pin
- **USB Connector:** USB-C receptacle
- **Probe Connector:** 2.5mm panel-mount jack
- **Buttons:** 1× tactile (power/pair)
- **LEDs:** 2× 0805 SMD (power, status)
- **Passives:** 0805 size (resistors, capacitors)

### Test Points
- VDD
- GND
- ADC
- SWDIO (programming)
- SWCLK (programming)
- TX (UART debug)
- RX (UART debug)

## Enclosure (Production)

### Material
- **Type:** ABS plastic
- **Process:** Injection molding
- **Color:** Black matte finish
- **Tool Cost:** $3,000-5,000 (amortized)

### Design
- **Assembly:** 2-piece snap-fit
- **Sealing:** IP54 (splash resistant)
- **Buttons:** Molded-in tactile button caps
- **LEDs:** Light pipes for status indication
- **Connector:** Recessed 2.5mm jack opening
- **USB Port:** Sealed rubber flap over USB-C

### Dimensions
- **Length:** 50mm
- **Width:** 30mm  
- **Height:** 12mm
- **Weight:** 25g (with battery)

## Environmental Specifications

### Operating Conditions
- **Temperature:** 32°F to 140°F (0°C to 60°C)
- **Humidity:** 10% to 90% non-condensing
- **Altitude:** 0 to 10,000 ft

### Storage Conditions
- **Temperature:** -4°F to 158°F (-20°C to 70°C)
- **Humidity:** 5% to 95% non-condensing

### Durability
- **Drop Test:** 3 ft drop onto concrete (survives)
- **Water Resistance:** IP54 (splash proof, not submersible)
- **Heat Exposure:** Can withstand 500°F radiant heat (brief)

## Calibration

### Ice Water Test
1. Fill container with ice + water
2. Stir, wait for equilibrium (32°F / 0°C)
3. Insert probe, wait 60 seconds
4. Record ADC reading
5. Calculate resistance

### Boiling Water Test
1. Bring water to rolling boil
2. Adjust for altitude (212°F at sea level)
3. Insert probe, wait 30 seconds
4. Record ADC reading
5. Calculate resistance

### Room Temperature Test
1. Allow probe to stabilize at room temp
2. Measure with calibrated thermometer (±0.5°F)
3. Record ADC reading
4. Calculate resistance

### Coefficient Calculation
Use Steinhart-Hart calculator with 3 known points:
- Ice water: 32°F, R₁
- Room temp: measured, R₂
- Boiling: 212°F, R₃

Calculator: https://www.thinksrs.com/downloads/programs/therm%20calc/ntccalibrator/ntccalculator.html

## Compliance & Certification

### Target Certifications
- **FCC Part 15** (USA) - Wireless device
- **CE Mark** (Europe) - Safety & EMC
- **IC** (Canada) - Radio device
- **RoHS** - Hazardous substances
- **REACH** - Chemical safety

### Estimated Costs
- FCC Testing: $3,000-5,000
- CE Testing: $2,000-4,000
- Total Certification: ~$8,000-10,000

### Food Safety
- **Material:** 304 stainless steel (food-grade)
- **Standards:** NSF/ANSI 51 (food equipment)
- **Cleaning:** Dishwasher safe (probe only)

## Manufacturing

### Prototype (100 units)
- **PCB:** JLCPCB ($500)
- **Assembly:** JLCPCB SMT ($800)
- **Components:** Mouser/Digikey ($1,200)
- **Enclosures:** 3D printed ($500)
- **Probes:** AliExpress bulk ($200)
- **Total:** ~$3,200 / 100 = **$32/unit**

### Production (1,000 units)
- **PCB + Assembly:** $6,000
- **Components:** $8,000
- **Injection-molded housings:** $4,000
- **Probes:** $1,500
- **Total:** ~$19,500 / 1,000 = **$19.50/unit**

### High Volume (10,000 units)
- **Per unit:** ~$9-12 fully loaded
- **Retail:** $35-40 module, $8-10 probe
- **Margin:** 60-65% gross

## Specifications Summary

| Parameter | Specification |
|-----------|---------------|
| **Temperature Range** | 0°F to 572°F |
| **Accuracy** | ±2°F typical |
| **Response Time** | <3 seconds |
| **Probe Diameter** | 1/16" (1.8mm) |
| **Probe Length** | 1" (28mm) |
| **BLE Range** | 50ft+ in kitchen |
| **Battery Life** | 30 hours continuous (future: 2-4 weeks) |
| **Charging** | USB-C, 30 min to 80% |
| **Weight** | 25g with battery |
| **Dimensions** | 50×30×12mm |
| **Water Resistance** | IP54 (splash proof) |

## Next Revision Goals

### v2.0 Hardware
- [ ] Reduce size to 40×25×10mm
- [ ] Add sleep mode (4-week battery life)
- [ ] Integrated USB-C charging
- [ ] Magnetic pogo-pin charging (optional)
- [ ] Better antenna (improve range to 100ft)
- [ ] Temperature-compensated crystal (better accuracy)

### v2.0 Probe
- [ ] Thinner profile (1/32" if possible)
- [ ] Shorter length (3/4" for thin steaks)
- [ ] Faster response (<2 seconds)
- [ ] Higher temp range (600°F+)
- [ ] Reinforced cable strain relief
