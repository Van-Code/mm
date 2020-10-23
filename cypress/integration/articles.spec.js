/// <reference types = "cypress" />

beforeEach(() => {
    cy.visit('https://staging.softcoin.com/programs/kroger/mymag/?coupons=MM20200002E2355A%2CMM20200002E4452A%2CMM20200002E4202A%2CMM20200002E4135A%2CMM20200002E4143A%2CMM20200002E2362A%2CMM20200002E2514A%2CMM20200002E2469A%2CMM20200002E2185A%2CMM20200002E2502A%2CMM20200002E4090A%2CMM20200002E4353A%2CMM20200002E4210A%2CMM20200002E2078A%2CMM20200002E2060A%2CMM20200002E2517A&cid=ema.pro.MM20200002E_M02UR&banner=Ralphs&issue=M02U&xg=50244617&origin=yt&filtertag=DHMM20200002E&tm=true#/articles')
})

it('Page Title: All Articles', () => {
    cy.get('[data-cy=all-articles]').first().find('.page-title').should('have.text', ' All Articles ')
})

it('should show articles', () => {
    cy.get('[data-cy=all-articles]').find('.article-block').should('be.visible')
})

describe('article titles', () => { 
    it('article title should be black', () => {
        cy.get('[data-cy=article-title]').first().should('have.css', 'color','rgb(0, 0, 0)')
    })
    it('clicking on first article should navigate to correct article', () => {
        cy.get('[data-cy=article-title]').first().click({ force: true })
        cy.hash().should('include', "401")
    })
})

describe('article tags', () => { 

    it('article tag should be visible', () => {
        cy.get('[data-cy=article-tag]').first().should('be.visible')
    })

    it('article tag should be uppercase', () => {
        cy.get('[data-cy=article-tag]').first().should('have.css','text-transform','uppercase')
    })

})
