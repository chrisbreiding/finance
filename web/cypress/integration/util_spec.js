import { ensureNumber } from '../../src/lib/util'

describe('ensureNumber', () => {
  it('returns the number if already a number', () => {
    expect(ensureNumber(5)).to.equal(5)
  })

  it('returns the number-ified string if a string', () => {
    expect(ensureNumber('8')).to.equal(8)
  })

  it('strips off common number string inclusions', () => {
    expect(ensureNumber('$1,000.00')).to.equal(1000.00)
  })

  it('strips off anything that is not a number or period', () => {
    expect(ensureNumber('A2,0B00.C00D')).to.equal(2000.00)
  })

  it('returns 0 if not a string', () => {
    expect(ensureNumber(true)).to.equal(0)
  })

  it('returns 0 if not ultimately a number', () => {
    expect(ensureNumber('EFGH')).to.equal(0)
  })
})
