/// <reference types = "cypress" />

beforeEach(() => {
    cy.visit('http://localhost:8083/programs/kroger/mymag/?banner=Kroger&issue=M01M&testing=true#/articles/2001/401')
})

describe('Article Detail Header', () => {
    it('Should have category', () => {
        cy.get('[data-cy=article-content] .header div.tag p').should('not.be.empty')
    })
    it('Should have title', () => {
        cy.get('[data-cy=article-content] .header h1').should('not.be.empty')
    })
});

describe('Article Detail Body', () => {
    it('Content should load', () => {
        cy.get('[data-cy=article-content] .right-column').should('not.be.empty')
    })
    // it('Recipe Button href include recipe title and should take to recipe', () => {
    //     cy.get('.recipe-block .content h2').then(($rec) => {
    //         const txt = $rec.text().replace(/\s+/g, '-').toLowerCase()
    //         cy.get('[data-cy=article-content] .right-column .recipe-block a').should('have.attr', 'href').and('contains', txt)
    //     })
    // })
});





// Cant get to pass will come back
// describe('Share Section', () => {
//     it('Facebook share should include title in href', () => {
//         cy.get('[data-cy=article-content] .header h1').then(($rec) => {
//             const txt = $rec.text().replace(/\s+/g, '%20').slice(0, -1)
//             cy.get('li[data-cy=share-facebook] a').should('have.attr', 'href').and('contains', txt)
//         })
//     })
//     it('Twitter share should include title in href', () => {
//         cy.get('[data-cy=article-content] .header h1').then(($rec) => {
//             const txt = $rec.text().replace(/\s+/g, ' ')
//             cy.get('li[data-cy=share-twitter] a').should('have.attr', 'href').and('contains', txt)
//         })
//     })
//     it('Pinterest share should include title in href', () => {
//         cy.get('[data-cy=article-content] .header h1').then(($rec) => {
//             const txt = $rec.text().replace(/\s+/g, ' ')
//             cy.get('li[data-cy=share-pinterest] a').should('have.attr', 'href').and('contains', txt)
//         })
//     })
// });
