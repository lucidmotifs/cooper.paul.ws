## CORE Entities



- Region -> location -> geo-area
- Country -> land-area
-- Nation -> geo-pol-area
-- Dependent -> geo-pol-area
- Continent -> land-area
- Ocean -> water-area
- City (Town, Hamlet, etc..) -> land-area
-- Capital
- Hemisphere > geo-region
- State/Prov > geopol-subdivision
- County > geopol-subdivision

### Subtypes (inheritence)
- Language
- Border

### Relationships
- partOf (
- geoPoliticalSubdivision(
- geoSubregion (
- borders (
- overlaps (location, location)
- dependsOn (geo-pol-area, geo-pol-area)
