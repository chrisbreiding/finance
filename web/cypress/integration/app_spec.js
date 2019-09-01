describe('app', () => {
  const _ = Cypress._
  let win

  beforeEach(() => {
    let data

    cy.fixture('data').then((theData) => {
      data = theData
    })
    cy.visit('/')
    .then((theWin) => {
      win = theWin

      cy.stub(win.api, 'authenticate').resolves()
      cy.stub(win.api, 'pollData').yields(data)
      cy.stub(win.api, 'saveData').resolves()
      cy.stub(win, 'fetch').resolves()
    })
  })

  it('shows refresh button when ping is available', () => {
    win.fetch.withArgs('https://finance.crbapps.dev:4193/ping').resolves({ ok: true })
    win.start()
    cy.get('.refresh button').should('be.visible')
  })

  it('does not show refresh button when ping is not available', () => {
    win.fetch.withArgs('https://finance.crbapps.dev:4193/ping').resolves({ ok: false })
    win.start()
    cy.get('.refresh button').should('not.be.visible')
  })

  describe('rewards', () => {
    beforeEach(() => {
      win.start()
    })

    it('shows amount', () => {
      cy.get('.rewards .amex .amount').should('have.text', '$123')
      cy.get('.rewards .citiMc .amount').should('have.text', '$456')
      cy.get('.rewards .amazonVisa .amount').should('have.text', '$789')
      cy.get('.rewards .discover .amount').should('have.text', '$543')
    })

    it('shows edit rewards form when clicking edit', () => {
      cy.get('.rewards h2 button').click({ force: true })
      cy.get('.edit-rewards').should('be.visible')
      cy.get('.edit-amex input').should('have.value', '123.45')
      cy.get('.edit-citiMc input').should('have.value', '456.78')
      cy.get('.edit-amazonVisa input').should('have.value', '789.01')
      cy.get('.edit-discover input').should('have.value', '543.21')
    })

    it('updates value when edited and saved', () => {
      cy.get('.rewards h2 button').click({ force: true })

      cy.get('.edit-amex input').clear().type('234.56')
      cy.get('.edit-citiMc input').clear().type('567.89')
      cy.get('.edit-amazonVisa input').clear().type('890.12')
      cy.get('.edit-discover input').clear().type('432.10')

      cy.get('.edit-rewards .save').click()
      .should(() => {
        expect(win.api.saveData).to.be.called

        const amounts = _.transform(win.api.saveData.lastCall.args[0].rewards, (memo, reward, key) => {
          memo[key] = reward.amount
        }, {})

        expect(amounts).to.eql({
          amex: 234.56,
          citiMc: 567.89,
          amazonVisa: 890.12,
          discover: 432.10,
        })
      })
      cy.get('.edit-rewards').should('not.exist')
    })

    it('updates display values', () => {
      cy.get('.rewards h2 button').click({ force: true })
      cy.get('.edit-amex input').clear().type('234.56')
      cy.get('.edit-amazonVisa input').clear().type('890.12')
      cy.get('.edit-rewards .save').click()

      cy.get('.rewards .amex .amount').should('have.text', '$234')
      cy.get('.rewards .citiMc .amount').should('have.text', '$456')
      cy.get('.rewards .amazonVisa .amount').should('have.text', '$890')
      cy.get('.rewards .discover .amount').should('have.text', '$543')
    })

    it('only updates last updated dates of values changed', () => {
      cy.clock()

      cy.get('.rewards h2 button').click({ force: true })
      cy.tick(50) // needed for modal to show up
      cy.get('.edit-citiMc input').clear().type('567.89')
      cy.get('.edit-discover input').clear().type('432.10')

      cy.get('.edit-rewards .save').click()
      .should(() => {
        expect(win.api.saveData).to.be.called

        const dates = _.transform(win.api.saveData.lastCall.args[0].rewards, (memo, reward, key) => {
          memo[key] = reward.lastUpdated
        }, {})

        expect(dates).to.eql({
          amex: '2019-02-02T14:51:58.712Z',
          citiMc: '1970-01-01T00:00:00.050Z',
          amazonVisa: '2019-02-03T14:51:58.712Z',
          discover: '1970-01-01T00:00:00.050Z',
        })
      })
    })
  })

  describe('accounts', () => {
    beforeEach(() => {
      win.start()
    })

    it('displays balances for savings and checking', () => {
      cy.get('.savings .total').should('have.text', '$20,000')
      cy.get('.checking .total').should('have.text', '$8,000')
    })

    it('allows editing values through savings button', () => {
      cy.get('.savings h2 button').click({ force: true })
      cy.get('.edit-accounts').should('be.visible')
    })

    it('allows editing values through checking button', () => {
      cy.get('.checking h2 button').click({ force: true })
      cy.get('.edit-accounts').should('be.visible')
    })

    it('allows editing values', () => {
      cy.get('.savings h2 button').click({ force: true })
      cy.get('.edit-savings input').clear().type(30000)
      cy.get('.edit-checking input').clear().type(18000)

      cy.get('.edit-accounts .save').click()
      .should(() => {
        expect(win.api.saveData).to.be.called
        expect(win.api.saveData.lastCall.args[0].savingsBalance).to.equal(30000)
        expect(win.api.saveData.lastCall.args[0].checkingBalance).to.equal(18000)
      })
      cy.get('.edit-accounts').should('not.exist')
    })

    it('updates display values', () => {
      cy.get('.savings h2 button').click({ force: true })
      cy.get('.edit-savings input').clear().type(30000)
      cy.get('.edit-checking input').clear().type(18000)
      cy.get('.edit-accounts .save').click()

      cy.get('.savings .total').should('have.text', '$30,000')
      cy.get('.checking .total').should('have.text', '$18,000')
    })
  })

  describe('goals', () => {
    beforeEach(() => {
      const time = new Date(2019, 1, 1).valueOf()

      cy.clock(time).then(() => {
        win.start()
      })
    })

    describe('projection', () => {
      it('shows projected date when enabled', () => {
        cy.get('.goal').eq(0).find('.projection')
          .should('be.visible')
          .should('have.text', 'Jul 2019')
      })

      it('uses planned amount by default', () => {
        cy.get('.goal').eq(1).find('.projection')
          .should('be.visible')
          .should('have.text', 'May 2019')
      })

      it('uses projection amount when set', () => {
        cy.get('.goal').eq(2).find('.projection')
          .should('be.visible')
          .should('have.text', 'Nov 2019')
      })

      it('does not show projected date when disabled', () => {
        cy.get('.goal').eq(3).find('.projection')
          .should('not.be.visible')
      })

      describe('editing', () => {
        it('shows projection amount when show projection is checked', () => {
          cy.get('.goal h3 button').eq(4).click({ force: true })
          cy.tick(50)
          cy.get('.edit-goal').should('be.visible')
          cy.get('.edit-goal .edit-projection input[type=number]').should('not.be.visible')
          cy.get('.edit-projection input[type=checkbox]').check()
          cy.get('.edit-goal .edit-projection input[type=number]').should('be.visible')
        })

        it('does not projection amount when show projection is not checked', () => {
          cy.get('.goal h3 button').eq(0).click({ force: true })
          cy.tick(50)
          cy.get('.edit-goal').should('be.visible')
          cy.get('.edit-goal .edit-projection input[type=number]').should('be.visible')
          cy.get('.edit-projection input[type=checkbox]').uncheck()
          cy.get('.edit-goal .edit-projection input[type=number]').should('not.be.visible')
        })
      })
    })
  })
})
