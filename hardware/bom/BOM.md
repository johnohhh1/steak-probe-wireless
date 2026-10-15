# Bill of Materials (BOM)

## Prototype (POC) Parts

### Probe Assembly
| Part | Description | Qty | Unit Cost | Total | Source |
|------|-------------|-----|-----------|-------|--------|
| FireBoard SF628T | 1" Competition probe, 100K thermistor | 1 | $15.99 | $15.99 | FireBoard Labs |
| 2.5mm male jack | Audio connector, right angle | 1 | $0.50 | $0.50 | Amazon/AliExpress |
| Heat shrink tubing | 3/16" diameter | 6" | $0.10 | $0.10 | Amazon |

**Probe Assembly Total: $16.59**

### Module Assembly
| Part | Description | Qty | Unit Cost | Total | Source |
|------|-------------|-----|-----------|-------|--------|
| nRF52840 dev board | Adafruit Feather or similar | 1 | $24.95 | $24.95 | Adafruit |
| 100K resistor | 1/4W, 1% tolerance | 1 | $0.05 | $0.05 | Mouser/Digikey |
| 2.5mm female jack | Audio connector, panel mount | 1 | $0.75 | $0.75 | Amazon/AliExpress |
| CR2032 battery holder | Optional if not using dev board LiPo | 1 | $1.50 | $1.50 | Amazon |
| 3D printed housing | PLA/PETG enclosure | 1 | $2.00 | $2.00 | Self-print |
| Wire | 22-24 AWG | 12" | $0.10 | $0.10 | Misc |

**Module Assembly Total: $29.35**

**Prototype Total Cost: $45.94**

---

## Production Design (Target BOM)

### Probe (Replaceable)
| Part | Description | Qty | Unit Cost (1K) | Total | Notes |
|------|-------------|-----|----------------|-------|-------|
| NTC Thermistor | 100K, 1% accuracy, 1/16" probe | 1 | $1.50 | $1.50 | Custom from CN manufacturer |
| Stainless steel probe | 304SS, 1" x 1/16" | 1 | $0.50 | $0.50 | Bulk from Shenzhen |
| 2.5mm male jack | Gold-plated, molded strain relief | 1 | $0.25 | $0.25 | AliExpress bulk |
| Silicone wire | High-temp rated, 24AWG | 2" | $0.05 | $0.05 | Bulk spool |
| Heat shrink | Food-safe, 3/16" | 1" | $0.02 | $0.02 | Bulk |

**Production Probe BOM: $2.32**  
**Retail Price Target: $8-10 (3-pack: $20-25)**

### Module (Main Unit)
| Part | Description | Qty | Unit Cost (1K) | Total | Notes |
|------|-------------|-----|----------------|-------|-------|
| nRF52840 module | Custom PCB w/ antenna | 1 | $4.50 | $4.50 | JLCPCB assembly |
| 100K resistor | 0805 SMD, 1% | 1 | $0.01 | $0.01 | JLCPCB parts |
| LiPo battery | 150mAh 3.7V | 1 | $1.50 | $1.50 | AliExpress bulk |
| Battery charger IC | MCP73831 or similar | 1 | $0.30 | $0.30 | JLCPCB parts |
| 2.5mm female jack | Panel mount, gold plated | 1 | $0.40 | $0.40 | AliExpress bulk |
| USB-C connector | For charging | 1 | $0.15 | $0.15 | JLCPCB parts |
| PCB | 2-layer, 40x25mm | 1 | $0.50 | $0.50 | JLCPCB |
| Injection molded housing | 2-piece ABS snap fit | 1 | $1.50 | $1.50 | Tooling amortized |
| LED indicator | 0805 SMD | 2 | $0.02 | $0.04 | JLCPCB parts |
| Button | Tactile switch | 1 | $0.05 | $0.05 | JLCPCB parts |
| Misc passives | Caps, resistors | 10 | $0.01 | $0.10 | JLCPCB parts |

**Production Module BOM: $9.05**  
**Retail Price Target: $35-40**

---

## Cost Analysis

### Prototype Economics
- Total Cost: ~$46/unit
- Good for testing, validation, POC

### Production Economics (1K units)
- Module: $9.05 BOM → $35 retail = **286% margin**
- Probe: $2.32 BOM → $8 retail (or $7 in 3-pack) = **244% margin**
- Target: 60-65% gross margin after fulfillment/overhead

### Scaling (10K units)
- Module BOM drops to ~$7.50 (custom molds, bulk pricing)
- Probe BOM drops to ~$1.80
- Maintain pricing = **366% module margin, 344% probe margin**

---

## Suppliers

### Prototype
- **Adafruit** - Dev boards, immediate shipping
- **FireBoard Labs** - Quality probe for baseline testing
- **Amazon** - Connectors, wire, misc parts
- **3D Printer** - Housings (PLA/PETG)

### Production
- **JLCPCB** - PCB fab + SMT assembly
- **Shenzhen manufacturers** (via Alibaba)
  - Thermistor probes
  - Injection molding
  - Final assembly
- **MG Chemicals** - Consulting on miniaturization
- **AliExpress** - Bulk connectors, batteries

---

## Notes
- All prices are estimates, subject to MOQ and negotiation
- Tooling costs for injection molding: ~$3K-5K (amortized over first 10K units)
- FCC/CE certification: ~$5K-10K (one-time)
- Packaging: ~$0.50/unit for box + inserts
