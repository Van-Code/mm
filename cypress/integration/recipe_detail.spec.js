context('Recipe Detail Page', () => {
    //beforeEach(() => {
    //     cy.visit('http://localhost/programs/kroger/mymag/?banner=Kroger&origin=MM19006&filtertag=DHMM20190006E&coupons=MM20190006E4495A,MM20190006E4042A,MM20190006E4310A,MM20190006E4136A,MM20190006E2015A,MM20190006E2101A,MM20190006E3135A,MM20190006E2075A,MM20190006E2090A,MM20190006E3119A,MM20190006E4385A,MM20190006E4319A,MM20190006E4003A,MM20190006E2148A,MM20190006E2069A&issue=1906&articles=201,301,341,501,561,731,531,351,211,221,401,411,421&testing=true#/recipes/1906/701/spirited-negroni')
    // })
    
    // Url with no parameters
    beforeEach(() => {
        cy.visit('http://localhost/programs/kroger/mymag/?testing=true#/recipes/1906/701/spirited-negroni')
    })
    
    describe('Recipe Header', () => {
        it('Should have Recipe text at top', () => {
            cy.get('[data-cy=recipe-intro]').should('have.text', 'Recipe')
        })
        it('Recipe title should populate', () => {
            cy.get('[data-cy=recipe-title]').should('not.be.empty')
        })
    });
    
    describe('Recipe Image', () => {
        it('Recipe should have image', () => {
            cy.get('[data-cy=recipe-img]').invoke('attr', 'src').should('include', 'cdns3')
        })
    });
    
    describe('Spec bar', () => {
        it('Recipe should include hands-on and total time', () => {
            cy.get('[data-cy=recipe-spec]').and('contain','HANDS-ON TIME').and('contain','TOTAL TIME')
        });
    });
    
    describe('Recipe Content', () => {
        it('Recipe content should populate and include ingredients/instructions ', () => {
            cy.get('[data-cy=recipe-content]').should('not.be.empty').and('contain','Ingredients').and('contain','Instructions')
        })
    });
    
    describe('Nutritional Info', () => {
        it('Recipe should have Nutritional Information text and Per serving text', () => {
            cy.get('[data-cy=recipe_nutrition]').should('contain', 'Nutritional Information').and('contain','Per Serving')
        })
    });

    describe('Share Section', () => {
        it('Facebook share should include title in href', () => {
            cy.get('[data-cy=recipe-title]').then(($rec) => {
                const txt = $rec.text().replace(/\s+/g, '-').toLowerCase()
                cy.get('li[data-cy=share-facebook] a').should('have.attr', 'href').and('contains',txt)
            })
        })
        it('Twitter share should include title in href', () => {
            cy.get('[data-cy=recipe-title]').then(($rec) => {
                const txt = $rec.text().replace(/\s+/g, '-').toLowerCase()
                cy.get('li[data-cy=share-twitter] a').should('have.attr', 'href').and('contains',txt)
            })
        })
        it('Pinterest share should include title in href', () => {
            cy.get('[data-cy=recipe-title]').then(($rec) => {
                const txt = $rec.text().replace(/\s+/g, '-').toLowerCase()
                cy.get('li[data-cy=share-pinterest] a').should('have.attr', 'href').and('contains',txt)
            })
        })
    });
    
    describe('Keywords', () => {
        it('Keywords should have keyword icons', () => {
            cy.get('[data-cy=keyword-icon]').its('length').should('be.gt', 0)        
        })
    });

    describe('Back Button', () => {
        beforeEach(function(){
            cy.visit('http://localhost/programs/kroger/mymag/?testing=true#/recipes')
            cy.visit('http://localhost/programs/kroger/mymag/?testing=true#/recipes/1906/701/spirited-negroni')
        })
        it('Back button should take you back to all recipes', () => {
            cy.get('[data-cy=back-btn]').click()     
        })
    });

    describe('Mobile', () => {
        beforeEach(function () {
            cy.viewport(767, 1000)
        })
        it('Side Panel should be visible', () => {
            cy.get('[data-cy=mobile-side-panel]').should('be.visible')     
        })
        it('Recipe Key be visible and have Recipe Key text', () => {
            cy.get('[data-cy=recipe_key_panel]').should('be.visible').find('h5').should('have.text','Recipe Key')
        })
    });
});