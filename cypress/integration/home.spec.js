/// <reference types="Cypress" />

context('Home Page', () => {
    // Local - change ports
    beforeEach(() => {
        cy.visit('http://localhost:8083/programs/kroger/mymag/?banner=Kroger&tm=true&issue=M02U&testing=true&filtertag=DHMM20200001E&coupons=MM20200001E2000A&tm=true#/')
    })
    // staging
    // beforeEach(() => {
    //     cy.visit('staging.softcoin.com/programs/kroger/mymag/?banner=Kroger&issue=M01M#/')
    // })

    // Feature Aritcles
    it('Feature Articles should have 1 article', () => {
        cy.get('[data-cy=feature-article]').should(($el) => {
            expect($el).to.have.length(1)
        })
    })
    it('First article should be featured article', () => {
        cy.get('[data-cy=feature-article]').first().find('h5').should('have.text', 'Feature')
    })


    // // In the Kitchen
    it('Section Title: In the Kitchen', () => {
        cy.get('[data-cy=section-kitchen]').first().find('.section-title').should('have.text', 'In the Kitchen')
    })
    it('Section should have 6 Articles', () => {
        cy.get('[data-cy=section-kitchen] .kitchen .article-block').should(($el) => {
            expect($el).to.have.length(6)
        })
    })

    // // Now Playing
    it('Section Title: Now Playing', () => {
        cy.get('[data-cy=section-videos]').first().find('.section-title').should('have.text', 'Now Playing')
    })
    it('Section should have 1 main video', () => {
        cy.get('[data-cy=section-videos] #video_0').should(($el) => {
            expect($el).to.have.length(1)
        })
    })
    it('Section should have 4 secondary videos', () => {
        cy.get('[data-cy=section-videos] .thumbnails .video-item').should(($el) => {
            expect($el).to.have.length(4)
        })
    })

    // // Staff-Favorite Recipes
    it('Section Title: Staff-Favorite Recipes', () => {
        cy.get('[data-cy=section-recipes]').first().find('.section-title').should('have.text', 'Staff-Favorite Recipes')
    })

    // // Life at Large
    it('Section Title: Life at Large', () => {
        cy.get('[data-cy=section-life]').first().find('.section-title').should('have.text', 'Life at Large')
    })

    // // Poll Section
    it('Poll Section should be visible', () => {
        cy.get('[data-cy=section-poll]').should('be.visible')
    })
    it('Poll should have submit button', () => {
        cy.get('[data-cy=section-poll]').first().find('.submit-btn').should('have.text', 'Submit')
    })

    // // Footer
    it('Footer should be visible', () => {
        cy.get('[data-cy=section-footer]').should('be.visible')
    })
    it('Footer should have feedback button', () => {
        cy.get('[data-cy=section-footer]').first().find('.feedback-btn').should('have.text', 'Submit Feedback')
    })
})
