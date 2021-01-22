/* global test, describe, expect */
const {
  convertNCToTileOffset,
  hexDisplay,
  getNametableAddresses,
  getAttrOffset,
  getAttrAddresses,
  nametableStatusBar
} = require('./tilemapping.js');

describe('convertNCToTileOffset', () => {
  test('converts 0,0 to first tile', () => {
    const result = convertNCToTileOffset(0, 0);

    expect(result).toBe(0);
  });

  test('converts 1,0 to first tile', () => {
    const result = convertNCToTileOffset(1, 0);

    expect(result).toBe(0);
  });

  test('converts 1,1 to first tile', () => {
    const result = convertNCToTileOffset(1, 1);

    expect(result).toBe(0);
  });

  test('converts 0,17 to tile number 32', () => {
    const result = convertNCToTileOffset(0, 17);

    expect(result).toBe(32);
  });

  test('converts 17,17 to tile number 33', () => {
    const result = convertNCToTileOffset(17, 17);

    expect(result).toBe(33);
  });

  test('converts 511,479 to tile number 959', () => {
    const result = convertNCToTileOffset(511, 479);

    expect(result).toBe(959);
  });
});

describe('hexDisplay', () => {
  test('uses the appropriate width', () => {
    expect(hexDisplay(0, 4)).toBe('0000');
    expect(hexDisplay(0, 2)).toBe('00');
  });

  test('converts to hex appropriately', () => {
    expect(hexDisplay(0)).toBe('0');
    expect(hexDisplay(10)).toBe('a');
    expect(hexDisplay(255)).toBe('ff');
    expect(hexDisplay(256)).toBe('100');
  });

  test('converts to hex and pads as needed', () => {
    expect(hexDisplay(959, 4)).toBe('03bf');
  });
});

describe('getNametableAddresses', () => {
  test('sets appropriate base values', () => {
    expect(getNametableAddresses(0)).toBe('$2000, $2400, $2800, $2c00');
  });

  test('works with small values', () => {
    expect(getNametableAddresses(10)).toBe('$200a, $240a, $280a, $2c0a');
  });

  test('works with large values', () => {
    expect(getNametableAddresses(320)).toBe('$2140, $2540, $2940, $2d40');
  });
});

describe('getAttrOffset', () => {
  test('Tile zero is zero', () => {
    expect(getAttrOffset(0)).toBe(0);
  });

  test('Tile 4 is 1', () => {
    expect(getAttrOffset(4)).toBe(1);
  });

  test('Tile 128 is 8', () => {
    expect(getAttrOffset(128)).toBe(8);
  });
});

describe('getAttrAddresses', () => {
  test('sets appropriate base values', () => {
    expect(getAttrAddresses('0')).toBe('$23c0, $27c0, $2bc0, $2fc0');
  });

  test('works with small values', () => {
    expect(getAttrAddresses('10')).toBe('$23d0, $27d0, $2bd0, $2fd0');
  });

  test('works with large values', () => {
    expect(getAttrAddresses('3f')).toBe('$23ff, $27ff, $2bff, $2fff');
  });
});

describe('nametableStatusBar', () => {
  test('works appropriately for tile 0', () => {
    const result = nametableStatusBar(0);

    expect(result).toBe('Nametable offset: $0000 ($2000, $2400, $2800, $2c00)   Attribute offset: $0000 ($23c0, $27c0, $2bc0, $2fc0)');
  });
});
