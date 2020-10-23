context('Coupons', () => {
  beforeEach(() => {
      // change port
      cy.visit('http://localhost:8083/programs/kroger/mymag/?banner=Kroger&origin=MM19002&filtertag=DHMM20190002E&coupons=MM20190002E4495A,MM20190002E4042A,MM20190002E4310A,MM20190002E4136A,MM20190002E2015A,MM20190002E2101A,MM20190002E3135A,MM20190002E2075A,MM20190002E2090A,MM20190002E3119A,MM20190002E4385A,MM20190002E4319A,MM20190002E4003A,MM20190002E2148A,MM20190002E2069A&issue=2001&testing=true#/coupons')
  });
  describe('test coupons', () => {
    it('should show coupon titles', () => {
        cy.get('[data-cy=page-title]').should('have.text', ' All Coupons ')
    });
    it('should show loaded to card after clipping', () => {
        cy.get('[data-cy=coupon-block]').find('.actionButton').first().click();
        cy.get('[data-cy=coupon-block]').find('.btnholder').contains('Loaded to card');
    });
    it('should show drawer after clicking more', () => {
        cy.get('[data-cy=coupon-block]').find('.more').first().click({ force: true });
        cy.get('[data-cy=dialog]').should('exist');
        cy.get('[data-cy=dialog] .drawer-close').click();
    });
  });
  describe('test drawer', () => {
    it('should show loaded to card after clipping', () => {
       cy.get('[data-cy=coupon-block]').find('.more').first().click({ force: true });
       cy.get('[data-cy=dialog]').find('.actionButton').click();
       cy.get('[data-cy=dialog]').find('.btnholder').contains('Loaded to card');
       cy.get('[data-cy=dialog] .drawer-close').click();
    });
 
    it('should have media image', () =>{
      cy.get('[data-cy=coupon-block] .more').first().click({ force: true });
      cy.get('[data-cy=dialog]').find('.mediaImg').should('exist');
    });
  });
});

describe('Logged out', () => {
  beforeEach(() => {
    // change port
    cy.visit('http://localhost:8083/programs/kroger/mymag/?banner=Kroger&origin=MM19002&filtertag=DHMM20190002E&coupons=MM20190002E4495A,MM20190002E4042A,MM20190002E4310A,MM20190002E4136A,MM20190002E2015A,MM20190002E2101A,MM20190002E3135A,MM20190002E2075A,MM20190002E2090A,MM20190002E3119A,MM20190002E4385A,MM20190002E4319A,MM20190002E4003A,MM20190002E2148A,MM20190002E2069A&issue=2002&testing=true&loggedOut=true#/coupons');
  });
  it('should show sign in to load and bring user to sign in page', () => {
    cy.get('[data-cy=coupon-block]').find('.btnholder').contains('Sign in to Load');
  })
});

describe('Mobile', () => {
  beforeEach(function () {
    // change port
    cy.viewport(414,767);
    cy.visit('http://localhost:8083/programs/kroger/mymag/?banner=Kroger&origin=MM19002&filtertag=DHMM20190002E&coupons=MM20190002E4495A,MM20190002E4042A,MM20190002E4310A,MM20190002E4136A,MM20190002E2015A,MM20190002E2101A,MM20190002E3135A,MM20190002E2075A,MM20190002E2090A,MM20190002E3119A,MM20190002E4385A,MM20190002E4319A,MM20190002E4003A,MM20190002E2148A,MM20190002E2069A&issue=2002&testing=true#/coupons')
  })
  it('coupons should exists on page', () => {
    cy.get('[data-cy=coupon-block] [data-cy=coupon-li]');
  })
});
