/// <reference types="Cypress" />

context('Videos', () => {
    beforeEach(() => {
        cy.visit('https://staging.softcoin.com/programs/kroger/mymag/?coupons=MM20200002E2355A%2CMM20200002E4452A%2CMM20200002E4202A%2CMM20200002E4135A%2CMM20200002E4143A%2CMM20200002E2362A%2CMM20200002E2514A%2CMM20200002E2469A%2CMM20200002E2185A%2CMM20200002E2502A%2CMM20200002E4090A%2CMM20200002E4353A%2CMM20200002E4210A%2CMM20200002E2078A%2CMM20200002E2060A%2CMM20200002E2517A&cid=ema.pro.MM20200002E_M02UR&banner=Ralphs&issue=M02U&xg=50244617&origin=yt&filtertag=DHMM20200002E&tm=true#/videos')
        cy.wait(2000)
      })

    it('should check if the video has text', () => {
        cy.get('[data-cy=page-title]').should('have.text', 'All Videos')
    })

    it('should have content', () => {
        cy.get('[data-cy=video-body]').should('be.visible')
    })

    it('should check if there is 1 main video on the page', () => {
        cy.get('.video_wrap_0').should('be.visible')
    })

    it('video should have tag', () => {
        cy.get('[data-cy=video]').next().find('.video-type')
    })

    it('video should have title', () => {
        cy.get('[data-cy=video]').next().find('.video-title')
    })
   
})